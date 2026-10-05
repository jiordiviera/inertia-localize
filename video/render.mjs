// Renders video/index.html frame by frame with Playwright and encodes it with ffmpeg.
//
//   node video/render.mjs                      # en + fr MP4s in video/dist
//   node video/render.mjs --lang fr --fps 60
//   node video/render.mjs --stills 2,10,50     # PNG stills for quick review
//
// Requires ffmpeg on PATH and the `playwright` package (local, or global via NODE_PATH).

import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, writeFile } from 'node:fs/promises'
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
    fps: { type: 'string', default: '30' },
    out: { type: 'string', default: join(here, 'dist') },
    stills: { type: 'string' },
  },
})

const fps = Number(values.fps)
const langs = values.lang.split(',').map((lang) => lang.trim())
const outDir = resolve(values.out)
const page = pathToFileURL(join(here, 'index.html'))

async function openPage(browser, lang) {
  const tab = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  })
  await tab.goto(`${page.href}?render&lang=${lang}`)
  await tab.evaluate(() => window.__ready)
  return tab
}

async function renderStills(browser, lang, times) {
  const tab = await openPage(browser, lang)
  for (const time of times) {
    await tab.evaluate((t) => window.__seek(t), time)
    const file = join(outDir, `still-${lang}-${time.toFixed(1)}.png`)
    await writeFile(file, await tab.screenshot())
    console.log(file)
  }
  await tab.close()
}

async function renderVideo(browser, lang) {
  const tab = await openPage(browser, lang)
  const duration = await tab.evaluate(() => window.__duration)
  const frames = Math.round(duration * fps)
  const file = join(outDir, `inertia-localize-intro-${lang}.mp4`)

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
