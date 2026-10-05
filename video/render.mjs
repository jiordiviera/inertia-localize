// Renders a video page frame by frame with Playwright and encodes it with ffmpeg. The
// result is silent; soundtrack.mjs adds the audio. Formats are listed in formats.json.
//
//   node video/render.mjs                      # landscape, en + fr, in video/dist
//   node video/render.mjs --format tiktok      # vertical, captions burned in
//   node video/render.mjs --lang fr --fps 60
//   node video/render.mjs --stills 2,10,50     # PNG stills for quick review
//
// Requires ffmpeg on PATH and the `playwright` package (local, or global via NODE_PATH).

import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { captionCues, readClips } from './captions.mjs'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const here = dirname(fileURLToPath(import.meta.url))
const { values } = parseArgs({
  options: {
    format: { type: 'string', default: 'landscape' },
    lang: { type: 'string' },
    fps: { type: 'string', default: '30' },
    out: { type: 'string', default: join(here, 'dist') },
    stills: { type: 'string' },
  },
})

const fps = Number(values.fps)
const outDir = resolve(values.out)
const formats = JSON.parse(await readFile(join(here, 'formats.json'), 'utf8'))
const config = formats[values.format]
const langs = values.lang?.split(',') ?? config.langs
const page = pathToFileURL(join(here, config.page))
const narration = JSON.parse(
  await readFile(join(here, config.narration), 'utf8'),
)

async function openPage(browser, lang) {
  const tab = await browser.newPage()
  await tab.goto(`${page.href}?render&lang=${lang}`)
  await tab.evaluate(() => window.__ready)
  await tab.setViewportSize(await tab.evaluate(() => window.__size))
  if (config.burnCaptions) {
    // Short, punchy cues timed from the voice clips, word by word when aligned.
    const lines = narration[lang]
    const clips = readClips(join(here, config.voice, lang), lines.length)
    const cues = captionCues(lines, clips, { width: 20, lines: 2, maxWords: 5 })
    await tab.evaluate((list) => window.__setCaptions(list), cues)
  }
  return tab
}

async function renderStills(browser, lang, times) {
  const tab = await openPage(browser, lang)
  for (const time of times) {
    await tab.evaluate((t) => window.__seek(t), time)
    const file = join(
      outDir,
      `still-${values.format}-${lang}-${time.toFixed(1)}.png`,
    )
    await writeFile(file, await tab.screenshot())
    console.log(file)
  }
  await tab.close()
}

async function renderVideo(browser, lang) {
  const tab = await openPage(browser, lang)
  const duration = await tab.evaluate(() => window.__duration)
  const frames = Math.round(duration * fps)
  const file = join(outDir, `${config.name}-${lang}.silent.mp4`)

  const ffmpeg = spawn(
    'ffmpeg',
    [
      ['-y', '-loglevel', 'error'],
      ['-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-'],
      ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20'],
      ['-pix_fmt', 'yuv420p', '-movflags', '+faststart', file],
    ].flat(),
    { stdio: ['pipe', 'inherit', 'inherit'] },
  )
  const exited = once(ffmpeg, 'exit')

  // Raw CDP capture with optimizeForSpeed is several times faster than page.screenshot().
  const cdp = await tab.context().newCDPSession(tab)
  for (let frame = 0; frame < frames; frame++) {
    await tab.evaluate((t) => window.__seek(t), frame / fps)
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      optimizeForSpeed: true,
    })
    const png = Buffer.from(data, 'base64')
    if (!ffmpeg.stdin.write(png)) await once(ffmpeg.stdin, 'drain')
    if (frame % (fps * 5) === 0) {
      console.log(`[${lang}] ${(frame / fps).toFixed(0)}s / ${duration}s`)
    }
  }

  ffmpeg.stdin.end()
  const [code] = await exited
  await tab.close()
  if (code !== 0) throw new Error(`ffmpeg exited with code ${code}`)
  console.log(file)
}

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch()
try {
  if (values.stills) {
    const times = values.stills.split(',').map(Number)
    for (const lang of langs) await renderStills(browser, lang, times)
  } else {
    await Promise.all(langs.map((lang) => renderVideo(browser, lang)))
  }
} finally {
  await browser.close()
}
