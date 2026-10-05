# Videos

Source for the Inertia Localize presentation videos, with voice-over, music and sound effects. Two formats are listed in `formats.json`:

- `landscape`: 1920×1080, about 80 seconds, English and French, for LinkedIn and X.
- `tiktok`: 1080×1920, about 45 seconds, English, with burned-in word-by-word captions, for TikTok, Reels and Shorts.

Both are H.264 and AAC, loudness normalized to −14 LUFS.

## Files

- `index.html` (landscape) and `tiktok.html` (portrait) hold the animated scenes. Open one in a browser to preview it: space pauses, the arrow keys jump 5 seconds, `?lang=fr` switches the copy and `?t=42` starts at 42 seconds.
- `base.css` and `timeline.js` are shared by both pages: the look, and the engine that seeks every animation to a given time.
- `render.mjs` seeks a page frame by frame in Chromium (Playwright) and pipes the frames to ffmpeg, burning in captions when the format asks for it.
- `soundtrack.mjs` synthesizes the music bed and the sound effects, mixes in the voice-over, writes SRT captions and muxes the final MP4.
- `narration.json` and `narration.tiktok.json` are the voice-over scripts: one line per scene, with the time it starts (`at`) and the time it must end by (`until`).
- `voice.py` generates the voice-over with Kokoro-82M; `captions.mjs` times and splits the captions.
- `fonts/` contains the Latin subsets of Geist and Geist Mono, licensed under the SIL Open Font License 1.1 (`fonts/OFL.txt`).

## Render

```sh
python video/voice.py --model model.onnx --voices <kokoro-js>/voices           # landscape voice
python video/voice.py --format tiktok --align --model model.onnx --voices ...  # portrait voice + word timings
node video/render.mjs                         # landscape, silent: dist/inertia-localize-intro-{en,fr}.silent.mp4
node video/render.mjs --format tiktok         # portrait, silent, captions burned in
node video/soundtrack.mjs                     # final: dist/inertia-localize-intro-{en,fr}.mp4 + .srt
node video/soundtrack.mjs --format tiktok     # final: dist/inertia-localize-tiktok-en.mp4
node video/render.mjs --stills 3,30,50        # PNG frames for a quick review
```

Generate the voice before rendering a format with burned-in captions, since the captions are timed from the clips. The `.srt` files can be uploaded alongside the landscape videos on LinkedIn and X.

The scripts require ffmpeg on `PATH` and Playwright with Chromium. When Playwright is installed globally, run them with `NODE_PATH="$(npm root -g)"`. `voice.py` needs `pip install kokoro-onnx soundfile`, plus `faster-whisper` for `--align`.

## Voice-over

`voice.py` generates the clips with the open-source Kokoro-82M model (see its docstring for the model and voice files). Optional `speak` fields in the narration hold the text as pronounced, with English words in `[brackets]` and raw phonemes in `/slashes/`; `text` stays the caption. With `--align`, each clip is transcribed with Whisper to time every caption word.

To use a recorded voice instead, record one clip per narration line and save them in the format's voice folder (`video/voice/<lang>/` for landscape, `video/voice/tiktok/<lang>/` for portrait) as `01.wav`, `02.wav`, and so on (any format ffmpeg reads). Each clip starts at its line's `at` time and should finish before `until`. The folder is ignored by git, like `video/dist/`. Then run `node video/soundtrack.mjs` again: clips are levelled, the music ducks under the voice and the captions follow the real clip lengths. Lines without a clip are skipped.

## Editing

Animation delays in the pages are absolute timeline seconds (for example `style="--d:12.5s"`), so scenes can be retimed without tracking nested offsets. Each `.scene` declares its window with `data-in` and `data-out`, and the `duration` passed to `createTimeline` sets the total length.

Sound effects follow the same timeline: scene changes get a whoosh, typed commands get keystrokes, and any element with `data-sfx="pop|tick|chime|…"` plays that effect at its `--d` time (or `data-sfx-at`).

On-screen copy in `index.html` lives in the `messages` object as flat dot keys, like the package's own translation groups. Add a locale there and in `narration.json`, then pass it with `--lang`.
