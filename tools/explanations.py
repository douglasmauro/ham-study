#!/usr/bin/env python3
"""Work with the teaching explanations for a question pool.

    python3 tools/explanations.py show T5            # print a subelement's questions with the answer key
    python3 tools/explanations.py pair T5            # each choice beside its explanation line, for proofreading
    python3 tools/explanations.py check [T5]         # validate explanation files (one subelement or all)
    python3 tools/explanations.py merge              # check everything present, then write the app's data file

Explanations live in pools/explanations/<pool>/<SUB>.json as
    { "T5D01": { "concept": "...", "hint": "...", "why": ["...", "...", "...", "..."] }, ... }
`why` follows the ORIGINAL choice order of the official pool (A, B, C, D).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POOL_ID = "technician-2026"
POOL = json.loads((ROOT / "app/src/data" / f"{POOL_ID}.json").read_text(encoding="utf-8"))
SRC = ROOT / "pools/explanations" / POOL_ID
OUT = ROOT / "app/src/data" / f"explanations-{POOL_ID}.json"

MAX = {"concept": 240, "hint": 170, "why": 180}
LETTER_REF = re.compile(r"\b(choice|answer|option)s? [A-D]\b|\([A-D]\)|\b[A-D] (and|or) [A-D]\b|\b[A-D] is (correct|wrong|right)\b")
LABEL_START = re.compile(r"^(correct|incorrect|wrong|right|not this|true|false)\b[:.,!—-]", re.I)


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def show(sub):
    for q in POOL["questions"]:
        if q["sub"] != sub:
            continue
        print(f"{q['id']}  [{q['refs']}]" if q["refs"] else q["id"])
        print(f"  Q: {q['question']}" + (f"  (uses figure {q['figure']})" if q["figure"] else ""))
        for i, c in enumerate(q["choices"]):
            print(f"  {'ABCD'[i]}{' *' if i == q['answer'] else '  '} {c}")
        print()


def pair(sub):
    """Print each choice next to its explanation line, to proofread alignment."""
    d = json.loads((SRC / f"{sub}.json").read_text(encoding="utf-8"))
    for q in POOL["questions"]:
        if q["sub"] != sub:
            continue
        e = d[q["id"]]
        print(f"{q['id']}  Q: {q['question']}")
        print(f"  concept: {e['concept']}")
        print(f"  hint: {e['hint']}")
        for i, c in enumerate(q["choices"]):
            print(f"  {'ABCD'[i]}{' *KEY*' if i == q['answer'] else ''} {c}")
            print(f"       why: {e['why'][i]}")
        print()


def check(subs):
    problems = []
    data = {}
    for sub in subs:
        path = SRC / f"{sub}.json"
        qs = [q for q in POOL["questions"] if q["sub"] == sub]
        if not path.exists():
            problems.append(f"{sub}: missing file {path.relative_to(ROOT)}")
            continue
        try:
            d = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            problems.append(f"{sub}: invalid JSON: {e}")
            continue
        ids = {q["id"] for q in qs}
        for extra in sorted(set(d) - ids):
            problems.append(f"{extra}: not a question in {sub}")
        for q in qs:
            e = d.get(q["id"])
            if not e:
                problems.append(f"{q['id']}: missing")
                continue
            if set(e) != {"concept", "hint", "why"}:
                problems.append(f"{q['id']}: keys must be exactly concept, hint, why")
                continue
            why = e["why"]
            if not (isinstance(why, list) and len(why) == 4 and all(isinstance(w, str) and w.strip() for w in why)):
                problems.append(f"{q['id']}: why must be 4 non-empty strings")
                continue
            texts = [("concept", e["concept"]), ("hint", e["hint"])] + [("why", w) for w in why]
            for kind, t in texts:
                if not isinstance(t, str) or not t.strip():
                    problems.append(f"{q['id']}: empty {kind}")
                    continue
                if len(t) > MAX[kind]:
                    problems.append(f"{q['id']}: {kind} is {len(t)} chars, max {MAX[kind]}: {t[:50]}...")
                if LETTER_REF.search(t):
                    problems.append(f"{q['id']}: {kind} refers to a choice by letter (choices are shuffled): {t[:60]}")
                if t != t.strip() or "\n" in t:
                    problems.append(f"{q['id']}: {kind} has stray whitespace")
            for w in why:
                if LABEL_START.match(w):
                    problems.append(f"{q['id']}: why line starts with a verdict label (the app adds it): {w[:40]}")
            answer = norm(q["choices"][q["answer"]])
            if len(answer) >= 4 and not answer.startswith("all ") and answer in norm(e["hint"]):
                problems.append(f"{q['id']}: hint gives away the answer text")
            data[q["id"]] = {"concept": e["concept"], "hint": e["hint"], "why": why}
    return problems, data


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    all_subs = [s["id"] for s in POOL["subelements"]]
    if cmd == "show":
        show(sys.argv[2])
    elif cmd == "pair":
        pair(sys.argv[2])
    elif cmd == "check":
        subs = sys.argv[2:] or all_subs
        problems, data = check(subs)
        for p in problems:
            print(p)
        print(f"{len(data)} explanations read, {len(problems)} problems")
        sys.exit(1 if problems else 0)
    elif cmd == "merge":
        problems, data = check(all_subs)
        if problems:
            for p in problems:
                print(p)
            sys.exit(f"{len(problems)} problems; nothing written")
        ordered = {q["id"]: data[q["id"]] for q in POOL["questions"]}
        OUT.write_text(json.dumps(ordered, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"wrote {len(ordered)} explanations to {OUT.relative_to(ROOT)}")
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
