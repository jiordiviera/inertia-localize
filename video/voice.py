"""Generate voice-over clips from a narration file with Kokoro-82M.

    pip install kokoro-onnx soundfile
    python video/voice.py --model model.onnx --voices node_modules/kokoro-js/voices
    python video/voice.py --model model.onnx --voices ... --lang fr
    python video/voice.py --format tiktok --align ...   # also time each caption word
    python video/voice.py --dry-run          # print the phonemes only

The format (formats.json) picks the narration file and the voice folder, for example
video/voice/<lang>/ for landscape. The model is Kokoro-82M (Apache-2.0) in ONNX form, for
example onnx/model.onnx from https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX.
The voices are the .bin style files shipped in the kokoro-js npm package.

Each line is read from its `speak` field when present, otherwise from `text`; words in
[brackets] are pronounced in English and /…/ holds raw phonemes, which keeps product names
right in the French narration. A line that would overrun its `until` time is regenerated
slightly faster. `--align` transcribes each clip with faster-whisper and writes
NN.words.json, the start and end of every caption word, for burned-in captions. Run
`node video/soundtrack.mjs` afterwards to mix the clips in.
"""

import argparse
import difflib
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


def align(model, path, text, lang, duration):
    """Time each word of `text` from a Whisper transcript of the clip."""
    segments, _ = model.transcribe(str(path), language=lang, word_timestamps=True)
    heard = [word for segment in segments for word in segment.words]
    words = text.split(" ")

    def norm(word):
        return re.sub(r"[^\w]", "", word.lower())

    matcher = difflib.SequenceMatcher(
        a=[norm(word) for word in words],
        b=[norm(word.word) for word in heard],
        autojunk=False,
    )
    times = [None] * len(words)
    for a, b, size in matcher.get_matching_blocks():
        for offset in range(size):
            times[a + offset] = (heard[b + offset].start, heard[b + offset].end)

    # Words Whisper heard differently share the gap between their matched neighbours.
    index = 0
    while index < len(words):
        if times[index]:
            index += 1
            continue
        end = index
        while end < len(words) and not times[end]:
            end += 1
        start_time = times[index - 1][1] if index else 0.0
        end_time = times[end][0] if end < len(words) else duration
        weights = [len(word) + 1 for word in words[index:end]]
        cursor = start_time
        for offset, weight in enumerate(weights):
            step = (end_time - start_time) * weight / sum(weights)
            times[index + offset] = (cursor, cursor + step)
            cursor += step
        index = end
    return [
        {"text": word, "start": round(start, 3), "end": round(end, 3)}
        for word, (start, end) in zip(words, times)
    ]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model")
    parser.add_argument("--voices", help="folder of kokoro-js voice .bin files")
    parser.add_argument("--format", default="landscape")
    parser.add_argument("--lang")
    parser.add_argument("--align", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    formats = json.loads((HERE / "formats.json").read_text(encoding="utf-8"))
    config = formats[args.format]
    narration = json.loads((HERE / config["narration"]).read_text(encoding="utf-8"))
    langs = args.lang.split(",") if args.lang else config["langs"]
    whisper = None
    if args.align and not args.dry_run:
        from faster_whisper import WhisperModel

        whisper = WhisperModel("small", device="cpu", compute_type="int8")
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

    for lang in langs:
        voice, espeak, speed = VOICES[lang]
        folder = HERE / config["voice"] / lang
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
            if whisper:
                words = align(whisper, folder / f"{index:02d}.wav", line["text"], lang, seconds)
                (folder / f"{index:02d}.words.json").write_text(json.dumps(words))
            flag = "" if seconds <= budget else f"  overruns by {seconds - budget:.2f}s"
            print(f"{lang} {index:02d} {seconds:5.2f}s / {budget:5.2f}s at x{rate:.2f}{flag}")


if __name__ == "__main__":
    main()
