// Timeline engine shared by the video pages (index.html, tiktok.html).
//
// Every animation delay in a page is an absolute timeline time (`--d: 12.5s`). Seeking
// pauses every CSS animation at that time, so a frame is fully determined by `time`.
// render.mjs drives `window.__seek` frame by frame; opened in a browser, the page plays
// itself (space pauses, arrow keys jump 5 s, `?t=42` starts at 42 s, `?lang=fr`).

// biome-ignore lint/correctness/noUnusedVariables: called from the pages' inline scripts.
function createTimeline({ duration, width, height, messages = {} }) {
  const params = new URLSearchParams(location.search)
  const lang = messages[params.get('lang')] ? params.get('lang') : 'en'
  const rendering = params.has('render')
  const t = (key) => messages[lang]?.[key] ?? messages.en?.[key] ?? key

  document.documentElement.lang = lang
  for (const el of document.querySelectorAll('[data-t]')) {
    el.innerHTML = t(el.dataset.t)
  }

  const scenes = [...document.querySelectorAll('.scene')].map((el) => {
    const start = Number(el.dataset.in)
    const end = Number(el.dataset.out)
    el.style.setProperty('--in', `${start}s`)
    el.style.setProperty('--out', `${end}s`)
    return { el, start, end }
  })

  const typed = [...document.querySelectorAll('[data-type]')].map((el) => {
    const text = el.textContent
    const start = Number(el.dataset.type)
    const length = Number(el.dataset.dur)
    const caret = document.createElement('span')
    caret.className = 'caret'
    el.after(caret)
    el.textContent = ''
    const caretEnd = Number(el.dataset.caretEnd ?? start + length + 0.7)
    return { el, text, start, length, caret, caretEnd }
  })

  const escapeHtml = (text) =>
    text.replace(
      /[&<>]/g,
      (char) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt' }[char]};`,
    )

  // Burned-in captions: [{ start, end, words: [{ text, start, end }] }], set by render.mjs.
  const captionBox = document.getElementById('captions')
  let captions = []
  let shownCaption = null

  function showCaptions(time) {
    if (!captionBox) return
    const cue = captions.find((item) => time >= item.start && time < item.end)
    if (cue !== shownCaption) {
      shownCaption = cue
      captionBox.innerHTML = cue
        ? cue.words
            .map((word) => `<span>${escapeHtml(word.text)}</span>`)
            .join(' ')
        : ''
    }
    if (!cue) return
    const pop = Math.min((time - cue.start) / 0.14, 1)
    captionBox.style.transform = `scale(${0.9 + 0.1 * (1 - (1 - pop) ** 3)})`
    captionBox.querySelectorAll('span').forEach((span, index) => {
      const word = cue.words[index]
      span.className =
        time >= word.start && time < word.end + 0.05
          ? 'now'
          : time >= word.end
            ? 'said'
            : ''
    })
  }

  function seek(time) {
    for (const scene of scenes) {
      const visible = time >= scene.start - 0.01 && time < scene.end + 0.7
      scene.el.style.display = visible ? '' : 'none'
    }
    for (const animation of document.getAnimations()) {
      animation.pause()
      animation.currentTime = time * 1000
    }
    for (const item of typed) {
      const progress = Math.min(
        Math.max((time - item.start) / item.length, 0),
        1,
      )
      item.el.textContent = item.text.slice(
        0,
        Math.round(progress * item.text.length),
      )
      const typing = progress > 0 && progress < 1
      const shown = time >= item.start - 0.5 && time < item.caretEnd
      const blink = Math.floor(time * 2.4) % 2 === 0
      item.caret.style.opacity = shown && (typing || blink) ? '1' : '0'
    }
    showCaptions(time)
  }

  // Sound cues for soundtrack.mjs: scene transitions, keystrokes and [data-sfx] elements.
  function cues() {
    const list = []
    for (const scene of scenes) {
      if (scene.end < duration) list.push({ type: 'whoosh', time: scene.end })
    }
    for (const item of typed) {
      ;[...item.text].forEach((char, index) => {
        const time =
          item.start + ((index + 0.5) / item.text.length) * item.length
        if (char !== ' ') list.push({ type: 'key', time })
      })
    }
    for (const el of document.querySelectorAll('[data-sfx]')) {
      const time = Number.parseFloat(
        el.dataset.sfxAt ?? el.style.getPropertyValue('--d'),
      )
      list.push({
        type: el.dataset.sfx,
        time,
        note: Number(el.dataset.sfxNote ?? 0),
      })
    }
    return list.sort((a, b) => a.time - b.time)
  }

  window.__duration = duration
  window.__size = { width, height }
  window.__seek = seek
  window.__cues = cues
  window.__setCaptions = (list) => {
    captions = list
    shownCaption = null
  }
  window.__ready = Promise.all([
    document.fonts.load('700 40px Geist'),
    document.fonts.load('400 20px "Geist Mono"'),
  ]).then(() => document.fonts.ready)

  if (rendering) return

  const stage = document.getElementById('stage')
  const fit = () => {
    const scale = Math.min(innerWidth / width, innerHeight / height)
    const x = (innerWidth - width * scale) / 2
    const y = (innerHeight - height * scale) / 2
    stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
  }
  addEventListener('resize', fit)
  fit()

  let time = Number(params.get('t') ?? 0)
  let paused = false
  let last = performance.now()
  addEventListener('keydown', (event) => {
    if (event.key === ' ') paused = !paused
    if (event.key === 'ArrowRight') time += 5
    if (event.key === 'ArrowLeft') time = Math.max(0, time - 5)
  })
  const tick = (now) => {
    if (!paused) time = (time + (now - last) / 1000) % duration
    last = now
    seek(time)
    requestAnimationFrame(tick)
  }
  window.__ready.then(() => requestAnimationFrame(tick))
}
