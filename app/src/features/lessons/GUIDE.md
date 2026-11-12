# Writing a lesson

A lesson teaches one question group before the learner is tested on it. The
learner is a beginner and a visual learner studying on a phone. They want to
understand the ideas, not memorize answers. The first lesson,
`content/t3b-wavelength-frequency.tsx`, is the model the owner approved: read
it in full before writing, and match its tone, depth and length.

## What you write

For a lesson with id `t5d-ohms-law` you create exactly two files:

1. `app/src/features/lessons/content/t5d-ohms-law.tsx`: the lesson, as data,
   with the lesson as its **default export** (`export default LESSON;`). The
   `id` must equal the file name and the manifest entry; `title` and `groups`
   must match `manifest.ts`.
2. `app/src/features/clips/data/lesson-t5d-ohms-law.json`: the lesson's short
   narrated intro (see "The intro clip").

Do not edit any other file. `manifest.ts`, `index.tsx`, the player, the card
and the kit are shared. If the player lacks something you need, design around
it and say so in your report.

## Shape of a lesson

Read `types.ts` for the exact data format. By convention a lesson is:

1. **clip**: `{ type: 'clip', clip: 'lesson-<lesson id>' }`, the intro you wrote.
2. **cards**: 5 to 8 concept cards, **one idea each**, in an order where each
   idea builds on the last. Each card has a picture, a heading, two short
   paragraphs at most, usually a `remember` line with the one fact the exam
   wants, and usually an activity (tap-choice, slider, sort or compute) that
   makes the learner use the idea before moving on.
3. **check**: 3 or 4 easy questions in plain words. They must NOT be copies of
   pool questions. Every choice has a one-line `why`, and each question names
   the card that teaches it (`review`).
4. **recap**: 4 to 6 facts to remember, each with the pool question ids it covers.

Aim for about 8 minutes. Every pool question in the group must be covered by a
card and by a recap fact: put the question ids in `covers` on each step.

## Teaching

- **Teach before you ask.** The card's text and picture must give the learner
  everything needed to do its activity. An activity checks understanding of
  what was just shown; it is never a guess.
- **Plain words, short sentences.** Define each new term the first time it
  appears. Use one concrete comparison where it helps (water in a pipe, a rope
  being shaken) and stay consistent with the model lesson's comparisons.
- **Say why it matters on the air** in a phrase, where it is natural.
- **Feedback teaches.** Every wrong option says why it is wrong; the right one
  confirms with the reason.
- **Rules and procedures** (FCC rules, operating practice, safety) are less
  visual. Teach them through small situations: "you are on a repeater and..."
  with a picture of the situation, then the rule, then a choice. Group related
  rules onto one card so the lesson does not become a list.
- **Math**: show the formula as a picture, work one example in the text, then
  let the learner do one with the compute activity.
- No emoji, no markdown in strings, no exclamation marks.

## Pictures

Each card's picture is either a glossary drawing, `{ art: '<term id>' }`, or a
component you draw with the kit, `{ draw: MyPicture }` (see `drawkit.tsx` and
the model lesson; pictures get `value`, `picked`, `solved` and `onPick` so they
can react to the activity). Prefer the glossary drawing when one fits: the
learner then sees the same picture in the lesson and the glossary. List the
drawings for your topic with:

```sh
python3 -c "import json;[print(t['id'],'|',t['term']) for t in json.load(open('app/src/data/glossary-technician-2026.json')) if t['sub']=='T5']"
```

and see them at `#/glossary-art/T5` in the running app. Draw your own picture
only when the activity needs one that reacts (a slider that changes a wave, a
tappable circuit) or no glossary drawing shows the idea. Custom pictures use
only the kit's CSS classes for color, sit on the 240 x 140 canvas, and keep
labels at least 6 units inside the edge with no overlapping text. Schematic
symbols must match the official figures in `app/public/figures/`.

## The intro clip

A narrated slide show of 4 to 6 lines, 25 to 40 seconds, that gives the big
picture before the cards. Each line names the glossary drawing to show while it
is spoken:

```json
{
  "id": "lesson-t5d-ohms-law",
  "title": "Ohm's law and simple circuits",
  "blurb": "The big idea before the cards.",
  "sub": "T5",
  "groups": ["T5D"],
  "questionIds": ["T5D01", "T5D02"],
  "lines": [
    { "caption": "A battery pushes. A resistor pushes back.", "art": "voltage", "label": "the push", "questionIds": ["T5D01"] }
  ]
}
```

- `id` is `lesson-` plus the lesson id, and equals the file name.
- `caption` is shown on screen and read aloud by a text-to-speech voice. Write
  it for the ear: one or two short sentences, no symbols or abbreviations the
  voice would stumble on (write "megahertz", not "MHz"; "equals", not "=").
  Use `say` only when the spoken words must differ from the caption.
- `art` is a glossary term id (it must exist). `label` is an optional few
  words shown large under the picture.
- `questionIds` lists the pool questions the line agrees with.

The audio is recorded later by the lead; in your testing the clip plays with
captions only and says "Sound could not be played", which is expected.

## Accuracy

People study for a licensing exam from this. The official pool is the truth.

- Run `python3 tools/explanations.py pair <SUB>` and read every question in
  your group with its keyed answer and explanations before writing.
- Every fact, number, frequency, rule and formula must agree with the keyed
  answers. Use the pool's own figures and wording for anything the exam asks.
- Do not invent rule numbers, statistics, frequencies or history. If you add a
  basic fact the pool does not state, it must be uncontroversial and something
  you are sure of, and you must list it in your report.
- Safety lessons must never present an unsafe practice as acceptable.
- Check and compute activities: confirm that exactly one option is right, and
  compute every number yourself.

## Testing

Start a dev server on your port (`npx vite --port <port> --strictPort` from
`app/`, in the background) and drive it with Playwright (`require('playwright')`,
`chromium.launch()` with no options, viewport 390 x 844). Your lesson runs at
`http://localhost:<port>/#/do/lessons/<lesson id>?1` even before it is switched
on. Go through every step doing each activity wrong first and then right, take
a screenshot of every step, LOOK at each one, and fix anything clipped,
cramped, overlapping or unclear. Check for page and console errors and for
horizontal scrolling. Type-check with `npx tsc --noEmit -p .` from `app/` and
fix errors in your files only. Other writers are working in the same checkout:
ignore errors in their files, never edit shared files, and do not run git
commands, `npm install`, `npm run build` or `vite preview`. Stop your dev
server when done, and keep scratch files out of the repository.
