// Captions shared by render.mjs (burned in) and soundtrack.mjs (SRT files): narration lines
// are timed from the voice clips, word by word when voice.py --align wrote NN.words.json.

import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Wraps text into lines of at most `width` characters.
export function wrap(text, width) {
  const lines = ['']
  for (const word of text.split(' ')) {
    const last = lines.length - 1
    if (lines[last] && `${lines[last]} ${word}`.length > width) lines.push(word)
    else lines[last] = lines[last] ? `${lines[last]} ${word}` : word
  }
  return lines
}

// The clip for each narration line: file, length and optional word timings.
export function readClips(folder, count) {
  const files = existsSync(folder) ? readdirSync(folder) : []
  return Array.from({ length: count }, (_, index) => {
    const prefix = String(index + 1).padStart(2, '0')
    const name = files.find(
      (file) => file.startsWith(prefix) && !file.endsWith('.json'),
    )
    if (!name) return null
    const path = join(folder, name)
    const probe = ['-v', 'error', '-show_entries', 'format=duration']
    const duration = Number(
      execFileSync('ffprobe', [...probe, '-of', 'csv=p=0', path]).toString(),
    )
    const timings = join(folder, `${prefix}.words.json`)
    const words = existsSync(timings)
      ? JSON.parse(readFileSync(timings, 'utf8'))
      : null
    return { path, duration, words }
  })
}

// Every word of a line with absolute times, spread by length when not aligned.
function timedWords(line, clip) {
  // Split on plain spaces only, so a no-break space keeps French "mot :" together.
  const words = line.text.split(/ +/)
  if (clip?.words?.length === words.length) {
    return clip.words.map((word) => ({
      text: word.text,
      start: line.at + word.start,
      end: line.at + word.end,
    }))
  }
  const span = clip
    ? clip.duration
    : Math.min(line.until - line.at - 0.1, line.text.length / 14 + 0.4)
  const weights = words.map(
    (word) =>
      word.length + 1 + (/[.:!?]$/.test(word) ? 4 : /,$/.test(word) ? 2 : 0),
  )
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let cursor = line.at
  return words.map((text, index) => {
    const start = cursor
    cursor += (span * weights[index]) / total
    return { text, start, end: cursor }
  })
}

// Splits one sentence into the fewest cues that fit, avoiding one-word cues and
// preferring to break after punctuation (dynamic programming over break points).
function splitSentence(words, fits, capacity) {
  const best = [{ cost: 0, from: -1 }]
  for (let end = 1; end <= words.length; end++) {
    best[end] = { cost: Number.POSITIVE_INFINITY, from: -1 }
    for (let start = 0; start < end; start++) {
      const chunk = words.slice(start, end)
      if (!fits(chunk) || best[start].cost === Number.POSITIVE_INFINITY)
        continue
      // Penalties: a lone word, a short piece of a longer sentence, a break that is
      // not after punctuation, and an under-filled cue (which favours balanced cues).
      const text = chunk.map((word) => word.text).join(' ')
      const orphan = chunk.length === 1 && words.length > 1 ? 8 : 0
      const short = chunk.length < 3 && words.length >= 4 ? 3 : 0
      const loose =
        end < words.length && !/[,:;]$/.test(chunk.at(-1).text) ? 2 : 0
      const fill = 2 * (1 - Math.min(text.length / capacity, 1)) ** 2
      const cost = best[start].cost + 10 + orphan + short + loose + fill
      if (cost < best[end].cost) best[end] = { cost, from: start }
    }
  }
  const chunks = []
  for (let end = words.length; end > 0; end = best[end].from) {
    // A word too long to fit on its own still gets a cue.
    if (best[end].from === -1) return [words]
    chunks.unshift(words.slice(best[end].from, end))
  }
  return chunks
}

// Groups words into cues of at most `lines` lines of `width` characters (and at most
// `maxWords` words), never spanning two sentences.
export function captionCues(
  narration,
  clips,
  { width = 42, lines = 2, maxWords = Number.POSITIVE_INFINITY } = {},
) {
  const fits = (chunk) =>
    chunk.length <= maxWords &&
    wrap(chunk.map((word) => word.text).join(' '), width).length <= lines
  const cues = []
  narration.forEach((line, index) => {
    let sentence = []
    for (const word of timedWords(line, clips[index])) {
      sentence.push(word)
      if (/[.!?]$/.test(word.text)) {
        for (const words of splitSentence(sentence, fits, width * lines)) {
          cues.push({ words, until: line.until })
        }
        sentence = []
      }
    }
    for (const words of sentence.length
      ? splitSentence(sentence, fits, width * lines)
      : []) {
      cues.push({ words, until: line.until })
    }
  })
  return cues.map((cue, index) => {
    const next = cues[index + 1]
    const last = cue.words.at(-1).end + 0.6
    const end = Math.min(next ? next.words[0].start : last, last, cue.until)
    const text = cue.words.map((word) => word.text).join(' ')
    return { start: cue.words[0].start, end, text, words: cue.words }
  })
}

function srtTime(seconds) {
  const ms = Math.round(seconds * 1000)
  const pad = (value, size = 2) => String(value).padStart(size, '0')
  const hours = pad(Math.floor(ms / 3600000))
  const minutes = pad(Math.floor(ms / 60000) % 60)
  return `${hours}:${minutes}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`
}

export function srt(cues, width = 42) {
  return cues
    .map(
      (cue, index) =>
        `${index + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${wrap(cue.text, width).join('\n')}\n`,
    )
    .join('\n')
}
