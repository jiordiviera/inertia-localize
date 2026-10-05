// Builds the soundtrack (music bed, sound effects and an optional voice-over) for the video
// rendered by render.mjs, writes SRT captions, and muxes everything into the final MP4.
//
//   node video/soundtrack.mjs              # en + fr
//   node video/soundtrack.mjs --lang fr
//
// Voice-over is optional: put one clip per narration line in video/voice/<lang>/, named by
// line number (01.wav, 02.mp3, …). Each clip starts at its line's `at` time in
// narration.json and the music ducks under it. Without clips the video gets music, sound
// effects and captions only. Requires ffmpeg on PATH and Playwright (to read the cues).

import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const here = dirname(fileURLToPath(import.meta.url))
const { values } = parseArgs({
  options: {
    lang: { type: 'string', default: 'en,fr' },
    out: { type: 'string', default: join(here, 'dist') },
  },
})
const outDir = resolve(values.out)
const narration = JSON.parse(
  await readFile(join(here, 'narration.json'), 'utf8'),
)
const RATE = 48000
const TAU = Math.PI * 2

// ---------------------------------------------------------------- helpers

function ffmpeg(args, input) {
  return new Promise((done, fail) => {
    const child = spawn('ffmpeg', ['-hide_banner', '-y', ...args])
    const stdout = []
    const stderr = []
    child.stdout.on('data', (chunk) => stdout.push(chunk))
    child.stderr.on('data', (chunk) => stderr.push(chunk))
    child.on('error', fail)
    child.on('close', (code) => {
      const log = Buffer.concat(stderr).toString()
      if (code === 0) done({ stdout: Buffer.concat(stdout), log })
      else fail(new Error(`ffmpeg exited with code ${code}\n${log}`))
    })
    child.stdin.on('error', () => {})
    child.stdin.end(input)
  })
}

async function readTimeline() {
  const browser = await chromium.launch()
  try {
    const tab = await browser.newPage()
    await tab.goto(`${pathToFileURL(join(here, 'index.html')).href}?render`)
    await tab.evaluate(() => window.__ready)
    return await tab.evaluate(() => ({
      duration: window.__duration,
      cues: window.__cues(),
    }))
  } finally {
    await browser.close()
  }
}

// Deterministic noise so every render sounds the same.
let seed = 0x1f2e3d
function random() {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const noise = () => random() * 2 - 1
const midi = (note) => 440 * 2 ** ((note - 69) / 12)
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function stereo(length) {
  return [new Float32Array(length), new Float32Array(length)]
}

// Renders `seconds` of mono audio from a per-sample function of time.
function synth(seconds, sample) {
  const out = new Float32Array(Math.ceil(seconds * RATE))
  for (let i = 0; i < out.length; i++) out[i] = sample(i / RATE, i)
  return out
}

// Adds a mono or stereo buffer to a stereo track with equal-power panning.
function mix(track, time, buffer, gain = 1, pan = 0) {
  const [left, right] = Array.isArray(buffer) ? buffer : [buffer, buffer]
  const angle = ((clamp(pan, -1, 1) + 1) * Math.PI) / 4
  const gainLeft = gain * Math.cos(angle) * Math.SQRT2
  const gainRight = gain * Math.sin(angle) * Math.SQRT2
  const start = Math.round(time * RATE)
  for (let i = 0; i < left.length; i++) {
    const j = start + i
    if (j < 0 || j >= track[0].length) continue
    track[0][j] += left[i] * gainLeft
    track[1][j] += right[i] * gainRight
  }
}

// Chamberlin state-variable filter; cutoff can change per sample.
function filter(mode) {
  let low = 0
  let band = 0
  return (input, cutoff, q = 0.8) => {
    const f = 2 * Math.sin((Math.PI * Math.min(cutoff, RATE / 6)) / RATE)
    low += f * band
    const high = input - low - q * band
    band += f * high
    return mode === 'low' ? low : mode === 'high' ? high : band
  }
}

const TABLE = 4096
const SAW = new Float32Array(TABLE + 1)
for (let i = 0; i <= TABLE; i++) {
  for (let h = 1; h <= 12; h++) SAW[i] += Math.sin((TAU * h * i) / TABLE) / h
  SAW[i] *= 0.55
}
function wave(table, phase) {
  const x = (phase - Math.floor(phase)) * TABLE
  const i = x | 0
  return table[i] + (table[i + 1] - table[i]) * (x - i)
}

function rms(buffer, threshold = 0) {
  let sum = 0
  let count = 0
  for (const value of buffer) {
    if (Math.abs(value) < threshold) continue
    sum += value * value
    count++
  }
  return count ? Math.sqrt(sum / count) : 0
}

// ---------------------------------------------------------------- music

const BEAT = 60 / 100
const BAR = BEAT * 4
const CHORD = BAR * 2
const PROGRESSION = [
  { root: 41, notes: [53, 57, 60, 64] }, // Fmaj7
  { root: 45, notes: [55, 57, 60, 64] }, // Am7
  { root: 48, notes: [55, 59, 60, 64] }, // Cmaj7
  { root: 43, notes: [55, 59, 62, 64] }, // G6
]
// One entry per scene, in order: intro, problem, idea, flow, setup, demo, features, agents, outro.
const ARRANGEMENT = [
  { pad: 0.8, arp: 0, bass: 0, drums: 0 },
  { pad: 1, arp: 0.55, bass: 0, drums: 0 },
  { pad: 1, arp: 0.8, bass: 0.9, drums: 0 },
  { pad: 0.9, arp: 1, bass: 1, drums: 1 },
  { pad: 0.9, arp: 1, bass: 1, drums: 1 },
  { pad: 0.9, arp: 1, bass: 1, drums: 1 },
  { pad: 0.9, arp: 1, bass: 1, drums: 1 },
  { pad: 1, arp: 0.7, bass: 0.6, drums: 0 },
  { pad: 1, arp: 0.35, bass: 0.7, drums: 0 },
]

function arrangement(sceneEnds) {
  const ramp = 0.6
  return (part, time) => {
    let index = sceneEnds.findIndex((end) => time < end)
    if (index === -1) index = sceneEnds.length
    const current = ARRANGEMENT[Math.min(index, ARRANGEMENT.length - 1)][part]
    const end = sceneEnds[index]
    if (end === undefined || time < end - ramp) return current
    const next = ARRANGEMENT[Math.min(index + 1, ARRANGEMENT.length - 1)][part]
    return current + (next - current) * ((time - (end - ramp)) / ramp)
  }
}

function music(duration, sceneEnds) {
  const length = Math.ceil(duration * RATE)
  const level = arrangement(sceneEnds)
  const pad = stereo(length)
  const arp = stereo(length)
  const rhythm = stereo(length)

  for (let k = 0; k * CHORD < duration; k++) {
    const start = k * CHORD
    const chord = PROGRESSION[k % PROGRESSION.length]

    // Warm detuned pad, one voice per chord tone.
    for (const note of chord.notes) {
      for (const detune of [-0.07, 0.07]) {
        const frequency = midi(note + detune)
        let phase = random()
        const voice = synth(CHORD + 1.6, (t) => {
          phase += frequency / RATE
          const attack = clamp(t / 1.1, 0, 1)
          const release = t > CHORD ? Math.exp(-(t - CHORD) * 3) : 1
          return wave(SAW, phase) * attack * release * level('pad', start + t)
        })
        mix(pad, start, voice, 0.05, detune < 0 ? -0.55 : 0.55)
      }
    }

    // Bass, arpeggio and drums follow the bar grid.
    for (let bar = 0; bar < 2; bar++) {
      const barStart = start + bar * BAR
      for (const [beat, beats] of [
        [0, 1.4],
        [1.5, 0.5],
        [2, 0.9],
        [3, 0.9],
      ]) {
        const time = barStart + beat * BEAT
        const gain = level('bass', time)
        if (gain <= 0 || time >= duration) continue
        const frequency = midi(chord.root)
        const tone = synth(beats * BEAT + 0.2, (t) => {
          const env = Math.min(t / 0.01, 1) * Math.exp(-t * 2.2)
          const body =
            Math.sin(TAU * frequency * t) +
            0.35 * Math.sin(TAU * 2 * frequency * t)
          return Math.tanh(body * 1.4) * env
        })
        mix(rhythm, time, tone, 0.2 * gain)
      }

      const pattern = [0, 1, 2, 3, 2, 1, 3, 2]
      pattern.forEach((index, step) => {
        const time = barStart + step * (BEAT / 2)
        const gain = level('arp', time)
        if (gain <= 0 || time >= duration) return
        const frequency = midi(chord.notes[index] + 12)
        const pluck = synth(0.6, (t) => {
          const env = Math.min(t / 0.004, 1) * Math.exp(-t * 7)
          const fm = 0.8 * Math.exp(-t * 10) * Math.sin(TAU * 2 * frequency * t)
          return (
            (Math.sin(TAU * frequency * t + fm) +
              0.2 * Math.sin(TAU * 3 * frequency * t)) *
            env
          )
        })
        mix(arp, time, pluck, 0.06 * gain, step % 2 ? 0.35 : -0.35)
      })

      for (let beat = 0; beat < 4; beat++) {
        const time = barStart + beat * BEAT
        const gain = level('drums', time)
        if (gain <= 0 || time >= duration) continue
        if (beat % 2 === 0) {
          let phase = 0
          const kick = synth(0.4, (t) => {
            phase += (42 + 85 * Math.exp(-t * 32)) / RATE
            return (
              Math.sin(TAU * phase) * Math.exp(-t * 8) +
              (t < 0.003 ? noise() * 0.3 : 0)
            )
          })
          mix(rhythm, time, kick, 0.38 * gain)
        } else {
          const band = filter('band')
          const clap = synth(
            0.25,
            (t) => band(noise(), 1700, 1.2) * Math.exp(-t * 18),
          )
          mix(rhythm, time, clap, 0.12 * gain, 0.1)
        }
        const high = filter('high')
        const hat = synth(0.07, (t) => high(noise(), 7500) * Math.exp(-t * 70))
        mix(rhythm, time + BEAT / 2, hat, 0.05 * gain, 0.25)
      }
    }
  }

  // Slow low-pass sweep on the pad, and a ping-pong echo on the arpeggio.
  for (const channel of [0, 1]) {
    const low = filter('low')
    for (let i = 0; i < length; i++) {
      pad[channel][i] = low(
        pad[channel][i],
        1300 + 600 * Math.sin((TAU * i) / RATE / 19),
        1,
      )
    }
  }
  const delay = Math.round(BEAT * 0.75 * RATE)
  for (let i = delay; i < length; i++) {
    arp[0][i] += arp[1][i - delay] * 0.32
    arp[1][i] += arp[0][i - delay] * 0.32
  }

  const out = stereo(length)
  for (let i = 0; i < length; i++) {
    const t = i / RATE
    const fade = clamp(t / 1.2, 0, 1) * clamp((duration - t) / 3, 0, 1)
    out[0][i] = (pad[0][i] + arp[0][i] + rhythm[0][i]) * fade
    out[1][i] = (pad[1][i] + arp[1][i] + rhythm[1][i]) * fade
  }
  // Sit the bed around -23 dBFS RMS so effects and voice stay on top.
  const gain = 0.07 / rms(out[0])
  for (const channel of out) for (let i = 0; i < length; i++) channel[i] *= gain
  return out
}

// ---------------------------------------------------------------- sound effects

const PING_NOTES = [72, 74, 76, 79, 81]

const EFFECTS = {
  whoosh() {
    const duration = 0.8
    const band = [filter('band'), filter('band')]
    const sweep = (t) => {
      const x = t / duration
      return x < 0.55
        ? 400 * (2500 / 400) ** (x / 0.55)
        : 2500 * (700 / 2500) ** ((x - 0.55) / 0.45)
    }
    const env = (t) => Math.sin(Math.PI * clamp(t / duration, 0, 1)) ** 2
    const left = synth(
      duration,
      (t) => band[0](noise(), sweep(t), 0.6) * env(t) * (1 - t / duration),
    )
    const right = synth(
      duration,
      (t) => band[1](noise(), sweep(t), 0.6) * env(t) * (t / duration),
    )
    return { buffer: [left, right], gain: 0.7 }
  },
  swish() {
    const duration = 0.45
    const band = filter('band')
    const buffer = synth(duration, (t) => {
      const cutoff = 1500 * (4000 / 1500) ** (t / duration)
      return (
        band(noise(), cutoff, 0.7) * Math.sin(Math.PI * (t / duration)) ** 2
      )
    })
    return { buffer, gain: 0.22, pan: random() * 0.6 - 0.3 }
  },
  key() {
    const high = filter('high')
    const buffer = synth(0.035, (t) => {
      const click = high(noise(), 3500) * Math.exp(-t * 260)
      return click + 0.3 * Math.sin(TAU * 1900 * t) * Math.exp(-t * 400)
    })
    return {
      buffer,
      gain: 0.11 * (0.6 + 0.4 * random()),
      pan: random() * 0.5 - 0.25,
    }
  },
  tick() {
    const buffer = synth(0.08, (t) => {
      const tone = Math.sin(TAU * 2600 * t) + 0.25 * Math.sin(TAU * 5200 * t)
      return tone * Math.exp(-t * 90)
    })
    return { buffer, gain: 0.07, pan: random() * 0.4 - 0.2 }
  },
  pop() {
    let phase = 0
    const partials = [1046.5, 1568, 2093, 2637]
    const buffer = synth(1.6, (t) => {
      phase += (180 * (520 / 180) ** clamp(t / 0.07, 0, 1)) / RATE
      const body =
        Math.sin(TAU * phase) * Math.min(t / 0.003, 1) * Math.exp(-t * 14)
      let shimmer = 0
      partials.forEach((frequency, index) => {
        shimmer +=
          Math.sin(TAU * frequency * t) * Math.exp(-t * (2.2 + index)) * 0.18
      })
      return body + shimmer * Math.min(t / 0.02, 1)
    })
    return { buffer, gain: 0.45 }
  },
  chime() {
    const buffer = synth(0.9, (t) => {
      const tone =
        Math.sin(TAU * 1318.5 * t) +
        0.7 *
          Math.sin(TAU * 1975.5 * t) *
          Math.min(Math.max(t - 0.06, 0) / 0.002, 1) +
        0.2 * Math.sin(TAU * 2637 * t)
      return tone * Math.min(t / 0.002, 1) * Math.exp(-t * 6)
    })
    return { buffer, gain: 0.12, pan: 0.15 }
  },
  error() {
    const low = filter('low')
    const blip = (t, frequency) => {
      let value = 0
      for (const h of [1, 3, 5, 7])
        value += Math.sin(TAU * frequency * h * t) / h
      return value
    }
    const buffer = synth(0.42, (t) => {
      const first = t < 0.12 ? blip(t, 233) * Math.exp(-t * 12) : 0
      const second =
        t >= 0.14 ? blip(t - 0.14, 174.6) * Math.exp(-(t - 0.14) * 9) : 0
      return low(first + second, 1800, 1)
    })
    return { buffer, gain: 0.3 }
  },
  ping(cue) {
    const frequency = midi(PING_NOTES[cue.note % PING_NOTES.length])
    const buffer = synth(0.7, (t) => {
      const fm = 0.9 * Math.exp(-t * 9) * Math.sin(TAU * 2 * frequency * t)
      return (
        Math.sin(TAU * frequency * t + fm) *
        Math.min(t / 0.003, 1) *
        Math.exp(-t * 6)
      )
    })
    return { buffer, gain: 0.16, pan: -0.5 + cue.note * 0.25 }
  },
  click() {
    const high = filter('high')
    const buffer = synth(0.12, (t) => {
      const snap = high(noise(), 2500) * Math.exp(-t * 900)
      const tone = 0.4 * Math.sin(TAU * 1200 * t) * Math.exp(-t * 160)
      const thump = 0.6 * Math.sin(TAU * 140 * t) * Math.exp(-t * 45)
      return snap + tone + thump
    })
    return { buffer, gain: 0.4 }
  },
  sparkle() {
    const notes = [1318.5, 1661.2, 1975.5, 2637]
    const buffer = synth(0.9, (t) => {
      let value = 0
      notes.forEach((frequency, index) => {
        const local = t - index * 0.05
        if (local > 0)
          value +=
            Math.sin(TAU * frequency * local) *
            Math.exp(-local * 7) *
            Math.min(local / 0.002, 1)
      })
      return value
    })
    return { buffer, gain: 0.1, pan: 0.2 }
  },
}

function effects(duration, cues) {
  const out = stereo(Math.ceil(duration * RATE))
  for (const cue of cues) {
    const make = EFFECTS[cue.type]
    if (!make) continue
    const { buffer, gain, pan = 0 } = make(cue)
    // Transitions start slightly early so the swell peaks on the cut.
    const offset = cue.type === 'whoosh' ? -0.35 : 0
    mix(out, cue.time + offset, buffer, gain, pan)
  }
  return out
}

// ---------------------------------------------------------------- voice and captions

async function decode(file) {
  const { stdout } = await ffmpeg([
    '-i',
    file,
    '-f',
    'f32le',
    '-ac',
    '1',
    '-ar',
    String(RATE),
    '-',
  ])
  const bytes = stdout.buffer.slice(
    stdout.byteOffset,
    stdout.byteOffset + stdout.length,
  )
  return new Float32Array(bytes)
}

async function voiceOver(lang, lines, duration) {
  const folder = join(here, 'voice', lang)
  const files = existsSync(folder) ? readdirSync(folder) : []
  const track = new Float32Array(Math.ceil(duration * RATE))
  const spans = []
  for (const [index, line] of lines.entries()) {
    const name = files.find((file) =>
      file.startsWith(String(index + 1).padStart(2, '0')),
    )
    if (!name) continue
    const clip = await decode(join(folder, name))
    const level = rms(clip, 0.01)
    const gain = level ? 0.12 / level : 1
    const start = Math.round(line.at * RATE)
    for (let i = 0; i < clip.length && start + i < track.length; i++) {
      track[start + i] += clip[i] * gain
    }
    spans[index] = clip.length / RATE
  }
  return { track, spans, found: spans.filter(Boolean).length }
}

function srtTime(seconds) {
  const ms = Math.round(seconds * 1000)
  const pad = (value, size = 2) => String(value).padStart(size, '0')
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`
}

// Wraps text into lines of at most `width` characters.
function wrap(text, width = 42) {
  const lines = ['']
  for (const word of text.split(' ')) {
    const last = lines.length - 1
    if (lines[last] && `${lines[last]} ${word}`.length > width) lines.push(word)
    else lines[last] = lines[last] ? `${lines[last]} ${word}` : word
  }
  return lines
}

// One cue per sentence (two lines max), timed in proportion to its length.
function captions(lines, spans) {
  const cues = []
  lines.forEach((line, index) => {
    const estimate = line.text.length / 14 + 0.4
    const end = Math.min(
      line.until - 0.1,
      line.at + (spans[index] ? spans[index] + 0.3 : estimate),
    )
    // Sentences first, then commas when a sentence alone needs more than two lines.
    const pieces = line.text
      .match(/[^.:!?]+[.:!?]*\s*/g)
      .flatMap((sentence) =>
        wrap(sentence.trim()).length > 2
          ? sentence.match(/[^,]+,?\s*/g)
          : [sentence],
      )
      .map((piece) => piece.trim())
    const chunks = []
    for (const piece of pieces) {
      const previous = chunks.at(-1)
      if (previous && wrap(`${previous} ${piece}`).length <= 2) {
        chunks[chunks.length - 1] = `${previous} ${piece}`
      } else chunks.push(piece)
    }
    const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    let start = line.at
    for (const chunk of chunks) {
      const stop = start + ((end - line.at) * chunk.length) / total
      cues.push(
        `${srtTime(start)} --> ${srtTime(stop)}\n${wrap(chunk).join('\n')}`,
      )
      start = stop
    }
  })
  return cues.map((cue, index) => `${index + 1}\n${cue}\n`).join('\n')
}

// ---------------------------------------------------------------- mixdown

function wav(left, right) {
  const header = Buffer.alloc(44)
  const bytes = left.length * 8
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + bytes, 4)
  header.write('WAVEfmt ', 8)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(3, 20)
  header.writeUInt16LE(2, 22)
  header.writeUInt32LE(RATE, 24)
  header.writeUInt32LE(RATE * 8, 28)
  header.writeUInt16LE(8, 32)
  header.writeUInt16LE(32, 34)
  header.write('data', 36)
  header.writeUInt32LE(bytes, 40)
  const data = new Float32Array(left.length * 2)
  for (let i = 0; i < left.length; i++) {
    data[i * 2] = left[i]
    data[i * 2 + 1] = right[i]
  }
  return Buffer.concat([header, Buffer.from(data.buffer)])
}

async function build(lang, timeline, bed, sfx) {
  const lines = narration[lang]
  const {
    track: voice,
    spans,
    found,
  } = await voiceOver(lang, lines, timeline.duration)
  const length = voice.length

  // Duck the music under the voice: fast attack, slow release, about -10 dB.
  const left = new Float32Array(length)
  const right = new Float32Array(length)
  const attack = Math.exp(-1 / (0.03 * RATE))
  const release = Math.exp(-1 / (0.35 * RATE))
  let envelope = 0
  for (let i = 0; i < length; i++) {
    const level = Math.abs(voice[i])
    envelope =
      level > envelope
        ? attack * envelope + (1 - attack) * level
        : release * envelope + (1 - release) * level
    const duck = 1 - 0.68 * clamp(envelope / 0.05, 0, 1)
    left[i] = bed[0][i] * duck + sfx[0][i] + voice[i]
    right[i] = bed[1][i] * duck + sfx[1][i] + voice[i]
  }
  let peak = 0
  for (let i = 0; i < length; i++)
    peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]))
  const scale = 0.89 / peak
  for (let i = 0; i < length; i++) {
    left[i] *= scale
    right[i] *= scale
  }

  const audio = join(outDir, `soundtrack-${lang}.wav`)
  await writeFile(audio, wav(left, right))
  await writeFile(join(outDir, `captions-${lang}.srt`), captions(lines, spans))

  // Two-pass EBU R128 normalisation to -14 LUFS, the usual target for social feeds.
  const target = 'I=-14:TP=-1.5:LRA=11'
  const { log } = await ffmpeg([
    '-i',
    audio,
    '-af',
    `loudnorm=${target}:print_format=json`,
    '-f',
    'null',
    '-',
  ])
  const measured = JSON.parse(
    log.slice(log.lastIndexOf('{'), log.lastIndexOf('}') + 1),
  )
  const loudnorm = [
    `loudnorm=${target}`,
    `measured_I=${measured.input_i}`,
    `measured_TP=${measured.input_tp}`,
    `measured_LRA=${measured.input_lra}`,
    `measured_thresh=${measured.input_thresh}`,
    `offset=${measured.target_offset}`,
    'linear=true',
  ].join(':')
  const chain = `${loudnorm},alimiter=limit=0.79:level=false`

  const video = join(outDir, `video-${lang}.mp4`)
  const file = join(outDir, `inertia-localize-intro-${lang}.mp4`)
  await ffmpeg(
    [
      ['-i', video, '-i', audio],
      ['-map', '0:v', '-map', '1:a', '-c:v', 'copy'],
      ['-af', chain, '-c:a', 'aac', '-b:a', '192k', '-ar', String(RATE)],
      ['-shortest', '-movflags', '+faststart', file],
    ].flat(),
  )
  console.log(`${file} (${found}/${lines.length} voice clips)`)
}

const timeline = await readTimeline()
const sceneEnds = timeline.cues
  .filter((cue) => cue.type === 'whoosh')
  .map((cue) => cue.time)
const bed = music(timeline.duration, sceneEnds)
const sfx = effects(timeline.duration, timeline.cues)
for (const lang of values.lang.split(',').map((value) => value.trim())) {
  await build(lang, timeline, bed, sfx)
}
