#!/usr/bin/env python3
"""Convert an official NCVEC question pool (.docx) into the app's JSON format.

Usage:
    python3 tools/parse_pool.py <pool.docx> <out.json> --id technician-2026 \
        --name Technician --element 2 --effective 2026-07-01 --expires 2030-06-30 \
        --revision 2026-02-19 --source-url <url>

The parser fails loudly if anything does not match the syllabus: question counts
per subelement, one question per group on the exam, four choices per question,
and a valid answer key. Nothing is ever typed in by hand.
"""
import argparse
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

SUB_RE = re.compile(
    r"^SUBELEMENT (?P<id>[A-Z]\d) - (?P<title>.+?) \[(?P<exam>\d+) Exam Questions - (?P<groups>\d+) Groups\]\s*(?P<count>\d+)? ?(Questions)?\s*$"
)
GROUP_RE = re.compile(r"^(?P<id>[A-Z]\d[A-Z]) (?P<title>.+)$")
QHEAD_RE = re.compile(r"^(?P<id>[A-Z]\d[A-Z]\d{2}) \((?P<ans>[A-D])\)\s*(?:\[(?P<refs>[^\]]*)\])?\s*$")
CHOICE_RE = re.compile(r"^(?P<letter>[A-D])\.\s?(?P<text>.*)$")
FIG_RE = re.compile(r"figure (T-\d|G\d-\d|E\d-\d)", re.I)


SUPER = str.maketrans("0123456789+-", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻")
SUB = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")


def docx_lines(path):
    """Paragraph texts, keeping superscripts/subscripts (E², 10⁶) as Unicode."""
    root = ET.fromstring(zipfile.ZipFile(path).read("word/document.xml"))
    lines = []
    for p in root.iter(W + "p"):
        parts = []
        for r in p.iter(W + "r"):
            va = r.find(f"{W}rPr/{W}vertAlign")
            mode = va.get(W + "val") if va is not None else None
            for n in r:
                if n.tag == W + "t":
                    t = n.text or ""
                    if mode == "superscript":
                        if not t.translate(SUPER).isascii() or all(ch in "0123456789+-" for ch in t):
                            t = t.translate(SUPER)
                        else:
                            t = "^" + t
                    elif mode == "subscript":
                        t = t.translate(SUB)
                    parts.append(t)
                elif n.tag == W + "tab":
                    parts.append("\t")
        lines.append("".join(parts).strip())
    return lines


def clean(s):
    s = s.replace(" ", " ")
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def fail(msg):
    print("POOL CHECK FAILED: " + msg, file=sys.stderr)
    sys.exit(1)


def parse(lines):
    # Syllabus (expected counts) comes first, then the pool proper.
    syllabus = {}
    group_titles = {}
    pool_start = None
    for i, line in enumerate(lines):
        if line.startswith("FCC Element") and "Question Pool" in line and "Syllabus" not in line:
            pool_start = i
            break
        m = SUB_RE.match(line)
        if m and m.group("count"):
            syllabus[m.group("id")] = {
                "title": clean(m.group("title")),
                "examQuestions": int(m.group("exam")),
                "groupCount": int(m.group("groups")),
                "questionCount": int(m.group("count")),
            }
            continue
        g = GROUP_RE.match(line)
        if g and syllabus:
            group_titles[g.group("id")] = clean(g.group("title"))
    if pool_start is None or not syllabus:
        fail("could not find the syllabus and the start of the pool")

    questions = []
    i = pool_start
    n = len(lines)
    while i < n:
        line = lines[i]
        if line.startswith("~~~~End of question pool"):
            break
        m = QHEAD_RE.match(line)
        if not m:
            i += 1
            continue
        qid = m.group("id")
        i += 1
        stem_parts = []
        while i < n and not CHOICE_RE.match(lines[i]):
            if lines[i]:
                stem_parts.append(lines[i])
            i += 1
        choices = {}
        while i < n and lines[i] != "~~":
            c = CHOICE_RE.match(lines[i])
            if c:
                choices[c.group("letter")] = clean(c.group("text"))
            elif lines[i]:
                fail(f"{qid}: unexpected line inside choices: {lines[i]!r}")
            i += 1
        if sorted(choices) != ["A", "B", "C", "D"]:
            fail(f"{qid}: expected choices A-D, got {sorted(choices)}")
        stem = clean(" ".join(stem_parts))
        if not stem:
            fail(f"{qid}: empty question text")
        fig = FIG_RE.search(stem)
        questions.append({
            "id": qid,
            "sub": qid[:2],
            "group": qid[:3],
            "answer": "ABCD".index(m.group("ans")),
            "refs": clean(m.group("refs") or ""),
            "question": stem,
            "choices": [choices[k] for k in "ABCD"],
            "figure": fig.group(1).upper() if fig else None,
        })
        i += 1
    return syllabus, group_titles, questions


def verify(syllabus, group_titles, questions):
    ids = [q["id"] for q in questions]
    if len(ids) != len(set(ids)):
        fail("duplicate question ids")
    total_expected = sum(s["questionCount"] for s in syllabus.values())
    if len(questions) != total_expected:
        fail(f"found {len(questions)} questions, syllabus says {total_expected}")
    for sid, s in syllabus.items():
        qs = [q for q in questions if q["sub"] == sid]
        if len(qs) != s["questionCount"]:
            fail(f"{sid}: found {len(qs)} questions, syllabus says {s['questionCount']}")
        groups = sorted({q["group"] for q in qs})
        if len(groups) != s["groupCount"] or s["groupCount"] != s["examQuestions"]:
            fail(f"{sid}: {len(groups)} groups, syllabus says {s['groupCount']} groups / {s['examQuestions']} exam questions")
        for g in groups:
            if g not in group_titles:
                fail(f"{g}: missing group title")
            nums = [int(q["id"][3:]) for q in qs if q["group"] == g]
            if nums != list(range(1, len(nums) + 1)):
                fail(f"{g}: question numbers are not 01..{len(nums):02d}")
    exam = sum(s["examQuestions"] for s in syllabus.values())
    return exam


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("docx")
    ap.add_argument("out")
    ap.add_argument("--id", required=True)
    ap.add_argument("--name", required=True)
    ap.add_argument("--element", type=int, required=True)
    ap.add_argument("--effective", required=True)
    ap.add_argument("--expires", required=True)
    ap.add_argument("--revision", required=True)
    ap.add_argument("--source-url", required=True)
    ap.add_argument("--pass-mark", type=int, default=26)
    a = ap.parse_args()

    syllabus, group_titles, questions = parse(docx_lines(a.docx))
    exam = verify(syllabus, group_titles, questions)

    order = list(syllabus.keys())
    data = {
        "pool": {
            "id": a.id,
            "name": a.name,
            "element": a.element,
            "effective": a.effective,
            "expires": a.expires,
            "revision": a.revision,
            "source": a.source_url,
            "examQuestions": exam,
            "passMark": a.pass_mark,
        },
        "subelements": [
            {
                "id": sid,
                "title": syllabus[sid]["title"],
                "examQuestions": syllabus[sid]["examQuestions"],
                "groups": [
                    {"id": g, "title": group_titles[g]}
                    for g in sorted({q["group"] for q in questions if q["sub"] == sid})
                ],
            }
            for sid in order
        ],
        "questions": questions,
    }
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"OK: {len(questions)} questions, {sum(len(s['groups']) for s in data['subelements'])} groups, "
          f"{exam}-question exam, figures: {sorted({q['figure'] for q in questions if q['figure']})}")


if __name__ == "__main__":
    main()
