# Intro video

Source for the Inertia Localize presentation video: 1920×1080, about 80 seconds, rendered in English and French.

- `index.html` holds the animated scenes. Open it in a browser to preview: space pauses, the arrow keys jump 5 seconds, `?lang=fr` switches the copy and `?t=42` starts at 42 seconds.
- `render.mjs` seeks the page frame by frame in Chromium (Playwright) and pipes the frames to ffmpeg.
- `fonts/` contains the Latin subsets of Geist and Geist Mono, licensed under the SIL Open Font License 1.1 (`fonts/OFL.txt`).

## Render

```sh
node video/render.mjs                    # video/dist/inertia-localize-intro-{en,fr}.mp4
node video/render.mjs --lang fr --fps 60
node video/render.mjs --stills 3,30,50   # PNG frames for a quick review
```

Rendering requires ffmpeg on `PATH` and Playwright with Chromium. When Playwright is installed globally, run the script with `NODE_PATH="$(npm root -g)"`.

## Editing

Animation delays in `index.html` are absolute timeline seconds (for example `style="--d:12.5s"`), so scenes can be retimed without tracking nested offsets. Each `.scene` declares its window with `data-in` and `data-out`, and `DURATION` sets the total length.

On-screen copy lives in the `messages` object as flat dot keys, like the package's own translation groups. Add a locale there and pass it with `--lang`.
