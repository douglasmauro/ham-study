#!/usr/bin/env python3
"""Generate the narration audio for the concept clips.

    python3 tools/make_clip_audio.py --piper /path/to/piper --model /path/to/voice.onnx
    PIPER_BIN=... PIPER_MODEL=... python3 tools/make_clip_audio.py
    python3 tools/make_clip_audio.py --dry-run          # print what would be spoken, make nothing
    python3 tools/make_clip_audio.py --only swr power   # just these clips

Reads every clip in app/src/features/clips/data/<clipId>.json (the same files
the player reads for its captions) and writes

    app/public/audio/clips/<clipId>/title.mp3   the clip title (used by Listen mode)
    app/public/audio/clips/<clipId>/<n>.mp3     line n, counting from 0
    app/src/features/clips/data/durations.json  length of every file in milliseconds

The caption keeps its normal spelling. Only the text handed to the voice is
respelled: see PRONUNCIATION below. A line can also carry its own "say" text
in the JSON, which is used in place of the caption (the map still applies).

Needs the Piper text-to-speech program, a Piper voice model and ffmpeg.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "app" / "src" / "features" / "clips" / "data"
OUT_DIR = ROOT / "app" / "public" / "audio" / "clips"
DURATIONS = "durations.json"

# ---------------------------------------------------------------------------
# Pronunciation map. Applied in order to the text that is spoken, never to the
# caption. Each entry is (regular expression, replacement). Add a line here when
# the voice gets a word wrong, then run with --dry-run to see the result.
# ---------------------------------------------------------------------------
PRONUNCIATION: list[tuple[str, str]] = [
    # typography
    (r"[‘’]", "'"),
    (r"[“”]", '"'),
    # maths symbols
    (r"\s*=\s*", " equals "),
    (r"\s*[×]\s*", " times "),
    (r"(?<=[A-Z0-9])\s+x\s+(?=[A-Z0-9])", " times "),
    (r"\s*[÷]\s*", " divided by "),
    (r"(?<=[A-Z0-9])\s+/\s+(?=[A-Z0-9])", " divided by "),
    (r"\s*≈\s*", " is about "),
    (r"±\s*", "plus or minus "),
    (r"(\d)\s*:\s*(\d)", r"\1 to \2"),  # an SWR of 1:1 is said "one to one"
    # units written as symbols after a number
    (r"(\d)\s*MHz\b", r"\1 megahertz"),
    (r"(\d)\s*kHz\b", r"\1 kilohertz"),
    (r"(\d)\s*GHz\b", r"\1 gigahertz"),
    (r"(\d)\s*Hz\b", r"\1 hertz"),
    (r"(\d)\s*dB\b", r"\1 decibels"),
    (r"(\d)\s*Ω", r"\1 ohms"),
    (r"(\d)\s*V\b", r"\1 volts"),
    (r"(\d)\s*A\b", r"\1 amperes"),
    (r"(\d)\s*W\b", r"\1 watts"),
    (r"(\d)\s*cm\b", r"\1 centimeters"),
    (r"(\d)\s*m\b", r"\1 meters"),
    (r"(\d)-(meter|centimeter|volt|ohm|watt)\b", r"\1 \2"),
    # the same units standing alone
    (r"\bMHz\b", "megahertz"),
    (r"\bkHz\b", "kilohertz"),
    (r"\bGHz\b", "gigahertz"),
    (r"\bHz\b", "hertz"),
    (r"\bdB\b", "decibels"),
    (r"Ω", "ohms"),
    # words the voice stumbles on
    (r"\bOhm's\b", "Ome's"),
    (r"\b([Oo])hm(s?)\b", r"\1me\2"),
    # the letter I in a formula is said "eye", not swallowed like the word "I"
    (r"\bI(?= (?:times|equals|divided)\b)", "eye"),
    (r"(?<=times )I\b|(?<=equals )I\b|(?<=by )I\b", "eye"),
]

# Initialisms are spelled out letter by letter ("SWR" becomes "S W R"), because
# the voice otherwise tries to read some of them as words ("UHF" came out "oof").
# Words written in capitals that really are words go here.
NOT_INITIALISMS = {"OK", "NOT", "AND", "OR", "NO", "ALL", "ANY", "US"}

# How to say a single letter. Only the letters the voice gets wrong when they
# stand alone need an entry: "A" turns into the word "a", "I" into the word "I".
LETTER_NAMES = {"A": "eigh", "I": "eye"}

CALL_SIGN = re.compile(r"\b(?:[AKNW][A-Z]?|[A-Z]{1,2})\d[A-Z]{1,3}\b")
INITIALISM = re.compile(r"\b[A-Z]{2,6}\b")
NUMBER = re.compile(r"\d[\d,]*(?:\.\d+)?")

ONES = ("zero one two three four five six seven eight nine ten eleven twelve thirteen "
        "fourteen fifteen sixteen seventeen eighteen nineteen").split()
TENS = "zero ten twenty thirty forty fifty sixty seventy eighty ninety".split()


def int_words(n: int) -> str:
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("-" + ONES[n % 10] if n % 10 else "")
    if n < 1000:
        return ONES[n // 100] + " hundred" + (" " + int_words(n % 100) if n % 100 else "")
    for size, name in ((10**9, "billion"), (10**6, "million"), (10**3, "thousand")):
        if n >= size:
            rest = n % size
            return int_words(n // size) + " " + name + (" " + int_words(rest) if rest else "")
    raise ValueError(n)


def number_words(text: str) -> str:
    """12 -> twelve, 13.8 -> thirteen point eight, 146.520 -> one four six point five two zero."""
    whole, _, frac = text.replace(",", "").partition(".")
    if frac and len(frac) >= 2:
        # a frequency such as 146.52: hams read it digit by digit
        return " ".join(ONES[int(d)] for d in whole) + " point " + " ".join(ONES[int(d)] for d in frac)
    words = int_words(int(whole))
    if frac:
        words += " point " + " ".join(ONES[int(d)] for d in frac)
    return words


def spell(token: str) -> str:
    """Letters and digits one at a time: W1AW -> W one eigh W."""
    return " ".join(ONES[int(c)] if c.isdigit() else LETTER_NAMES.get(c, c) for c in token)


def spoken(text: str) -> str:
    """The text handed to the voice for a caption."""
    out = CALL_SIGN.sub(lambda m: spell(m.group(0)), text)
    for pattern, repl in PRONUNCIATION:
        out = re.sub(pattern, repl, out)
    out = INITIALISM.sub(lambda m: m.group(0) if m.group(0) in NOT_INITIALISMS else spell(m.group(0)), out)
    out = NUMBER.sub(lambda m: number_words(m.group(0).rstrip(",")) + ("," if m.group(0).endswith(",") else ""), out)
    return re.sub(r"\s+", " ", out).strip()


def load_clips(only: list[str]) -> list[dict]:
    clips = []
    for path in sorted(DATA_DIR.glob("*.json")):
        if path.name == DURATIONS:
            continue
        clip = json.loads(path.read_text(encoding="utf-8"))
        if only and clip["id"] not in only:
            continue
        if clip["id"] != path.stem:
            sys.exit(f"{path.name}: id {clip['id']!r} does not match the file name")
        clips.append(clip)
    missing = set(only) - {c["id"] for c in clips}
    if missing:
        sys.exit("No such clip: " + ", ".join(sorted(missing)))
    return clips


def utterances(clip: dict) -> list[tuple[str, str]]:
    """(file stem, text to speak) for a clip: its title, then each line."""
    items = [("title", spoken(clip.get("sayTitle") or clip["title"]) + ".")]
    for n, line in enumerate(clip["lines"]):
        items.append((str(n), spoken(line.get("say") or line["caption"])))
    return items


def duration_ms(path: Path) -> int:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        check=True, capture_output=True, text=True).stdout
    return round(float(out.strip()) * 1000)


def synthesize(piper: str, model: str, text: str, mp3: Path, tmp: Path) -> None:
    wav = tmp / "line.wav"
    subprocess.run([piper, "-m", model, "-f", str(wav)], input=text, text=True, check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    mp3.parent.mkdir(parents=True, exist_ok=True)
    # mono, 64 kbps; a short fade at each end so lines never start or stop with a click
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-ac", "1", "-b:a", "64k",
                    "-af", "afade=t=in:d=0.02", str(mp3)], check=True)


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate narration mp3 files for the concept clips.")
    ap.add_argument("--piper", default=os.environ.get("PIPER_BIN"), help="Piper program (or set PIPER_BIN)")
    ap.add_argument("--model", default=os.environ.get("PIPER_MODEL"), help="Piper voice model, .onnx (or set PIPER_MODEL)")
    ap.add_argument("--only", nargs="*", default=[], metavar="CLIP", help="clip ids to do (default: all)")
    ap.add_argument("--dry-run", action="store_true", help="print the caption and the spoken text, make no audio")
    args = ap.parse_args()

    clips = load_clips(args.only)
    if args.dry_run:
        for clip in clips:
            print(f"== {clip['id']}")
            for (stem, say), cap in zip(utterances(clip), [clip["title"]] + [l["caption"] for l in clip["lines"]]):
                print(f"  {stem:>5}  caption: {cap}\n         spoken:  {say}")
        return

    if not args.piper or not args.model:
        sys.exit("Give the Piper program and voice model: --piper and --model, or PIPER_BIN and PIPER_MODEL.")
    for need in (args.piper, args.model):
        if not Path(need).exists() and not shutil.which(need):
            sys.exit(f"Not found: {need}")
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        sys.exit("ffmpeg and ffprobe are needed to make the mp3 files.")

    dur_path = DATA_DIR / DURATIONS
    durations = json.loads(dur_path.read_text(encoding="utf-8")) if dur_path.exists() else {}
    with tempfile.TemporaryDirectory() as tmp:
        for clip in clips:
            out = OUT_DIR / clip["id"]
            if out.exists():
                shutil.rmtree(out)  # no stale files when a clip gets shorter
            entry: dict = {"title": 0, "lines": []}
            for stem, say in utterances(clip):
                mp3 = out / f"{stem}.mp3"
                synthesize(args.piper, args.model, say, mp3, Path(tmp))
                ms = duration_ms(mp3)
                if stem == "title":
                    entry["title"] = ms
                else:
                    entry["lines"].append(ms)
            durations[clip["id"]] = entry
            total = sum(entry["lines"]) / 1000
            print(f"{clip['id']}: {len(entry['lines'])} lines, {total:.1f} s")
    known = {p.stem for p in DATA_DIR.glob("*.json")}
    durations = {k: v for k, v in sorted(durations.items()) if k in known}
    dur_path.write_text(json.dumps(durations, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {dur_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
