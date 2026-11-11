#!/usr/bin/env python3
"""Validate and merge the glossary.

    python3 tools/glossary.py check [T2 ...]   # validate one or more subelement files (default: all)
    python3 tools/glossary.py merge            # check everything, then write the app's data file

Source files: pools/glossary/<pool>/<SUB>.json (see pools/glossary/GUIDE.md).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POOL_ID = "technician-2026"
POOL = json.loads((ROOT / "app/src/data" / f"{POOL_ID}.json").read_text(encoding="utf-8"))
SRC = ROOT / "pools/glossary" / POOL_ID
OUT = ROOT / "app/src/data" / f"glossary-{POOL_ID}.json"
QIDS = {q["id"]: q for q in POOL["questions"]}
MAX_DEF, MAX_MORE = 200, 260


def key(term):
    return re.sub(r"[^a-z0-9]+", " ", term.lower()).strip()


def slug(term):
    return re.sub(r"[^a-z0-9]+", "-", term.lower()).strip("-")


def check(subs):
    problems, entries = [], []
    for sub in subs:
        path = SRC / f"{sub}.json"
        if not path.exists():
            problems.append(f"{sub}: missing file {path.relative_to(ROOT)}")
            continue
        try:
            terms = json.loads(path.read_text(encoding="utf-8"))["terms"]
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            problems.append(f"{sub}: file must be valid JSON with a top-level 'terms' list ({e})")
            continue
        seen = set()
        linked = set()
        for t in terms:
            name = t.get("term", "")
            where = f"{sub} '{name}'"
            extra = set(t) - {"term", "aka", "def", "more", "questions"}
            if extra:
                problems.append(f"{where}: unknown keys {sorted(extra)}")
            if not isinstance(name, str) or not name.strip() or name != name.strip():
                problems.append(f"{where}: term must be a non-empty trimmed string")
                continue
            if key(name) in seen:
                problems.append(f"{where}: listed twice in this file")
            seen.add(key(name))
            d = t.get("def", "")
            if not isinstance(d, str) or not d.strip():
                problems.append(f"{where}: missing def")
            elif len(d) > MAX_DEF:
                problems.append(f"{where}: def is {len(d)} chars, max {MAX_DEF}")
            m = t.get("more")
            if m is not None and (not isinstance(m, str) or not m.strip() or len(m) > MAX_MORE):
                problems.append(f"{where}: more must be a non-empty string of at most {MAX_MORE} chars")
            for text in (d, m or ""):
                if isinstance(text, str) and ("\n" in text or text != text.strip()):
                    problems.append(f"{where}: stray whitespace or line break")
            aka = t.get("aka", [])
            if not isinstance(aka, list) or not all(isinstance(a, str) and a.strip() for a in aka):
                problems.append(f"{where}: aka must be a list of strings")
                aka = []
            qs = t.get("questions", [])
            if not isinstance(qs, list) or not qs:
                problems.append(f"{where}: needs at least one question id")
                qs = []
            for q in qs:
                if q not in QIDS:
                    problems.append(f"{where}: unknown question id {q}")
                elif QIDS[q]["sub"] != sub:
                    problems.append(f"{where}: {q} is not in {sub}")
            if len(qs) != len(set(qs)):
                problems.append(f"{where}: duplicate question ids")
            linked.update(qs)
            entries.append({"term": name, "aka": aka, "def": d, "more": m, "questions": qs, "sub": sub})
        unlinked = sorted(q["id"] for q in POOL["questions"] if q["sub"] == sub and q["id"] not in linked)
        if unlinked:
            problems.append(f"{sub}: {len(unlinked)} questions are not linked from any term: {', '.join(unlinked)}")
        if not 20 <= len(terms) <= 80:
            problems.append(f"{sub}: {len(terms)} terms; expected roughly 25 to 60")
    return problems, entries


def merge(entries):
    """Combine the same term from several subelements: union the questions, keep the fullest text."""
    order = [q["id"] for q in POOL["questions"]]
    by = {}
    for e in entries:
        k = key(e["term"])
        if k not in by:
            by[k] = {**e, "aka": list(e["aka"]), "questions": list(e["questions"])}
            continue
        m = by[k]
        if len(e["questions"]) > len(m["questions"]):
            m["term"], m["def"], m["sub"] = e["term"], e["def"], e["sub"]
            m["more"] = e["more"] or m["more"]
        elif not m["more"]:
            m["more"] = e["more"]
        m["aka"] = sorted(set(m["aka"]) | set(e["aka"]), key=str.lower)
        m["questions"] = list(dict.fromkeys(m["questions"] + e["questions"]))
    out = []
    for m in sorted(by.values(), key=lambda x: key(x["term"])):
        item = {"id": slug(m["term"]), "term": m["term"], "def": m["def"], "sub": m["sub"],
                "questions": sorted(m["questions"], key=order.index)}
        aka = [a for a in m["aka"] if key(a) != key(m["term"])]
        if aka:
            item["aka"] = aka
        if m["more"]:
            item["more"] = m["more"]
        out.append(item)
    return out


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    all_subs = [s["id"] for s in POOL["subelements"]]
    if cmd == "check":
        problems, entries = check(sys.argv[2:] or all_subs)
        for p in problems:
            print(p)
        print(f"{len(entries)} terms read, {len(problems)} problems")
        sys.exit(1 if problems else 0)
    elif cmd == "merge":
        problems, entries = check(all_subs)
        if problems:
            for p in problems:
                print(p)
            sys.exit(f"{len(problems)} problems; nothing written")
        merged = merge(entries)
        ids = [m["id"] for m in merged]
        if len(ids) != len(set(ids)):
            sys.exit("two terms produce the same id")
        OUT.write_text(json.dumps(merged, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"wrote {len(merged)} terms ({len(entries)} before merging) to {OUT.relative_to(ROOT)}")
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
