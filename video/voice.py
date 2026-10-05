"""Generate the voice-over clips in video/voice/<lang>/ from narration.json with Kokoro-82M.

    pip install kokoro-onnx soundfile
    python video/voice.py --model model.onnx --voices node_modules/kokoro-js/voices
    python video/voice.py --model model.onnx --voices ... --lang fr
    python video/voice.py --dry-run          # print the phonemes only

The model is Kokoro-82M (Apache-2.0) in ONNX form, for example
https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/onnx/model.onnx. The voices are the .bin style files shipped in the
kokoro-js npm package. Each line is read from its `speak` field when present, otherwise
from `text`; words in [brackets] are pronounced in English and /…/ holds raw phonemes,
which keeps product names right in the French narration. A line that would overrun its `until` time is regenerated
slightly faster. Run `node video/soundtrack.mjs` afterwards to mix the clips in.
"""

import argparse
import json
import re
import tempfile
from pathlib import Path

import numpy as np
import soundfile
from kokoro_onnx import Kokoro
from kokoro_onnx.tokenizer import Tokenizer

HERE = Path(__file__).parent
VOICES = {"en": ("af_heart", "en-us", 1.0), "fr": ("ff_siwis", "fr-fr", 1.0)}
MAX_SPEED = 1.3


SEGMENT = re.compile(r"\[([^\]]+)\]|/([^/]+)/")


def phonemes(tokenizer, text, lang):
    """Phonemize text: [words] in English, /phonemes/ as written, the rest in `lang`."""
    spoken = []
    last = 0
    for match in [*SEGMENT.finditer(text), None]:
        plain = text[last : match.start() if match else len(text)]
        if plain.strip():
            spoken.append(tokenizer.phonemize(plain, lang))
        if match:
            english, raw = match.groups()
            spoken.append(tokenizer.phonemize(english, "en-us") if english else raw)
            last = match.end()
    # espeak marks language switches as (en)…(fr); the model would read them aloud.
    joined = re.sub(r"\([a-z-]+\)", "", " ".join(spoken))
    return re.sub(r"\s+([.,:;!?])", r"\1", joined).strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model")
    parser.add_argument("--voices", help="folder of kokoro-js voice .bin files")
    parser.add_argument("--lang", default="en,fr")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    narration = json.loads((HERE / "narration.json").read_text(encoding="utf-8"))
    tokenizer = Tokenizer()
    kokoro = None
    if not args.dry_run:
        styles = {
            path.stem: np.fromfile(path, dtype=np.float32).reshape(-1, 1, 256)
            for path in Path(args.voices).glob("*.bin")
        }
        with tempfile.NamedTemporaryFile(suffix=".npz", delete=False) as handle:
            np.savez(handle, **styles)
        kokoro = Kokoro(args.model, handle.name)

    for lang in args.lang.split(","):
        voice, espeak, speed = VOICES[lang]
        folder = HERE / "voice" / lang
        folder.mkdir(parents=True, exist_ok=True)
        for index, line in enumerate(narration[lang], start=1):
            spoken = phonemes(tokenizer, line.get("speak", line["text"]), espeak)
            if args.dry_run:
                print(f"{lang} {index:02d} {spoken}")
                continue
            budget = line["until"] - line["at"] - 0.2
            rate = speed
            while True:
                audio, sample_rate = kokoro.create(spoken, voice, rate, is_phonemes=True)
                seconds = len(audio) / sample_rate
                if seconds <= budget or rate >= MAX_SPEED:
                    break
                rate = min(MAX_SPEED, rate * seconds / budget * 1.02)
            soundfile.write(folder / f"{index:02d}.wav", audio, sample_rate)
            flag = "" if seconds <= budget else f"  overruns by {seconds - budget:.2f}s"
            print(f"{lang} {index:02d} {seconds:5.2f}s / {budget:5.2f}s at x{rate:.2f}{flag}")


if __name__ == "__main__":
    main()
