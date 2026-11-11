# Ham Study

A phone-first, visual study app for the US amateur radio **Technician** exam
(Element 2, 2026–2030 pool), with **General** to follow. It teaches each concept
with pictures and hands-on practice, tracks every answer, and adapts each day's
drill to your weak spots.

## What works today

- **Official question pool:** all 409 questions of the 2026–2030 Technician pool
  (February 19, 2026 revision, errata included), imported from the NCVEC's
  public-domain file with automated checks, plus the three official figures.
- **Daily drill:** spaced repetition. Misses come back in the same session and the
  next day, while mastered questions fade out. New questions are paced so you
  see the whole pool about 2½ weeks before your exam date.
- **Question card:** answer choices are shuffled (except "all of these" style
  answers), a hint button appears after 30 seconds (first a nudge, then one wrong
  answer ruled out), and an "I guessed" toggle.
- **Explanations for every question:** a one-line concept, a hint that doesn't
  give the answer away, and a reason for each of the four choices: why the
  right one is right and why each wrong one isn't.
- **Readiness score:** the estimated chance you'd pass today, based on one
  question drawn from each of the 35 groups, like the real exam.
- **Practice exam:** 35 questions in the real format, no hints, scored at 26 to
  pass, with a breakdown by topic.
- **Mastery map**, **review my misses**, **topic and group drills**, a streak, an
  exam countdown, and backup and restore.
- Works offline and can be installed to your phone's home screen.
- No server and no accounts: progress stays on each person's own phone, and
  pushes to `main` deploy the app to GitHub Pages.

Coming next: visual labs, scenario missions, hands-on formats (sort, order,
label…), and narrated concept clips.

## Layout

| Path | What |
|---|---|
| `app/` | The web app (Vite + Preact + TypeScript) |
| `app/src/data/technician-2026.json` | Generated question pool. Never edit by hand. |
| `app/src/lib/engine.ts` | Spaced repetition, readiness, session building (unit tested) |
| `tools/parse_pool.py` | Converts an official NCVEC `.docx` pool to JSON and checks it |
| `pools/explanations/` | Explanations per subelement, plus the writing guide |
| `tools/explanations.py` | Shows questions with the key, validates explanations, merges them for the app |
| `pools/source/` | The original NCVEC pool documents |

## Develop

```sh
cd app
npm install
npm run dev      # local dev server
npm test         # engine and pool tests
npm run build    # production build in app/dist
```

Regenerate the pool from the official document:

```sh
python3 tools/parse_pool.py "pools/source/2026-2030 Technician Pool and Syllabus Public Release Feb 19 2026.docx" \
  app/src/data/technician-2026.json --id technician-2026 --name Technician --element 2 \
  --effective 2026-07-01 --expires 2030-06-30 --revision 2026-02-19 \
  --source-url https://ncvec.org/index.php/2026-2030-technician-question-pool
```

The question pool and figures are public domain, released by the NCVEC Question
Pool Committee.
