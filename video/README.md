# Intro video

Source for the Inertia Localize presentation video: 1920×1080, about 80 seconds, with a soundtrack, in English and French. It is sized for LinkedIn and X: H.264 and AAC, loudness normalized to −14 LUFS.

- `index.html` holds the animated scenes. Open it in a browser to preview: space pauses, the arrow keys jump 5 seconds, `?lang=fr` switches the copy and `?t=42` starts at 42 seconds.
- `render.mjs` seeks the page frame by frame in Chromium (Playwright) and pipes the frames to ffmpeg.
- `soundtrack.mjs` synthesizes the music bed and the sound effects, mixes in an optional voice-over, writes SRT captions and muxes the final MP4.
- `narration.json` is the voice-over script: one line per scene, with the time it starts (`at`) and the time it must end by (`until`).
- `fonts/` contains the Latin subsets of Geist and Geist Mono, licensed under the SIL Open Font License 1.1 (`fonts/OFL.txt`).

## Render

```sh
node video/render.mjs                    # silent video: video/dist/video-{en,fr}.mp4
node video/soundtrack.mjs                # final video: video/dist/inertia-localize-intro-{en,fr}.mp4
node video/render.mjs --lang fr --fps 60
node video/render.mjs --stills 3,30,50   # PNG frames for a quick review
```

`soundtrack.mjs` also writes `captions-{en,fr}.srt`, which can be uploaded alongside the video on LinkedIn and X.

Both scripts require ffmpeg on `PATH` and Playwright with Chromium. When Playwright is installed globally, run them with `NODE_PATH="$(npm root -g)"`.

## Voice-over

Record or generate one clip per line of `narration.json` and save them as `video/voice/<lang>/01.wav`, `02.wav`, and so on (any format ffmpeg reads). Each clip starts at its line's `at` time and should finish before `until`. Then run `node video/soundtrack.mjs` again: clips are levelled, the music ducks under the voice and the captions follow the real clip lengths. Lines without a clip are skipped.

## Editing

Animation delays in `index.html` are absolute timeline seconds (for example `style="--d:12.5s"`), so scenes can be retimed without tracking nested offsets. Each `.scene` declares its window with `data-in` and `data-out`, and `DURATION` sets the total length.

Sound effects follow the same timeline: scene changes get a whoosh, typed commands get keystrokes, and any element with `data-sfx="pop|tick|chime|…"` plays that effect at its `--d` time (or `data-sfx-at`).

On-screen copy lives in the `messages` object as flat dot keys, like the package's own translation groups. Add a locale there and in `narration.json`, then pass it with `--lang`.
