# Building a feature

The app is Preact + TypeScript, built with Vite. It is a phone-first study app
for the US amateur radio Technician exam. The learner is a beginner and a
visual learner who studies 10 to 15 minutes a day and wants to understand
concepts, not memorize answers.

## Where things go

Each feature lives in its own folder under `src/features/<area>/` and touches
nothing outside it. Shared code you may import but must not edit:

| Import | What it gives you |
|---|---|
| `src/features/types.ts` | `FeatureDef`, `FeatureProps`, `FeatureResult` |
| `src/lib/pool.ts` | `POOL`, `QUESTIONS_BY_ID`, `QUESTIONS_BY_GROUP`, `TOPICS`, `topicOf`, `groupTitle` |
| `src/lib/explain.ts` | `explanationFor(id)`: concept, hint and a reason per choice |
| `src/lib/store.ts` | `useData()`, `getData()`, `addEvent`, `newId` (answer log and settings) |
| `src/lib/stats.ts` | `computeStats(data)`: readiness, per-topic and per-group mastery, question states |
| `src/lib/engine.ts` | spaced repetition helpers, `seededRng`, `shuffle`, `localDay`, `DAY` |
| `src/ui/Icon.tsx` | `<Icon name=... />` stroke icons |
| `src/styles.css` | design tokens and shared classes (read it before styling) |

An area that lists items (`dragdrop`, `cards`, `labs`, `missions`, `clips`)
exports `ITEMS: FeatureDef[]` from its `index.ts`. The hub at `#/learn/<area>`
lists them and `#/do/<area>/<id>` runs one full-screen. Your component gets
`onDone(result?)`; call it once when the learner finishes. The host records it
and shows the way back, so do not build your own "finished" screen.

Put your own styles in a CSS file inside your folder and import it from your
component. Prefix every class with your area name (for example `.dd-card`) so
styles never collide.

## Look and feel

Use the tokens in `src/styles.css` (`var(--surface)`, `var(--accent)` and so on)
and the shared classes (`screen`, `topbar`, `iconbtn`, `card`, `btn primary`,
`chip`, `dot`, `bar`, `row`, `stack`, `grid2`, `muted`, `small`). Never hard-code
a color that a token covers.

- **A screen** is `<div class="screen">` with a `topbar` first: a back button
  (`<a class="iconbtn" href="#/learn/<area>" aria-label="Back">`), then the
  topic label in the topic's color above an `<h1>` title.
- **Topic color and icon** come from `TOPICS[sub]`. A topic keeps its one color
  everywhere.
- **Status colors never change meaning:** green (`--good`) = right or mastered,
  amber (`--accent`) = learning, selected or the signal path, red (`--bad`) =
  wrong or weak, gray = not seen.
- **Diagrams** are inline SVG in one house style: flat, 2 to 3 px strokes,
  rounded caps, wires and outlines in `--muted` or `--text`, the signal or
  current path in `--accent`, the part being taught in the topic color, labels
  in the body font at 12 px or more. Schematic symbols must match the ones in
  the official figures (`public/figures/T-1.png`, `T-2.png`, `T-3.png`).
- **Motion** is short and means something (current flows, a wave moves). Respect
  `prefers-reduced-motion`.
- **Phone first:** design for 390 px wide, one thumb. Touch targets are at least
  44 px. Body text is at least 16 px, secondary text at least 13 px. No
  horizontal scrolling. Primary actions sit in the lower half of the screen.
- **Every drag also works by tapping:** tap an item to select it, then tap where
  it goes. Use pointer events (`onPointerDown/Move/Up`) with
  `touch-action: none` on draggable items so dragging works on touch screens.
- **Feedback teaches:** a wrong move bounces back with one line saying why; a
  right one confirms with the reason. Never a bare "wrong".
- **Accessible:** real `<button>` and `<a>` elements, `aria-label` on icon-only
  buttons, color always paired with a word or an icon, SVG either
  `aria-hidden="true"` or `role="img"` with an `aria-label`.
- Write in plain words and short sentences. No emoji.

Interactive reference mock-ups the owner approved (read them for layout and
behavior, do not copy their framework):
`/tmp/claude-0/-home-user-claude-group-ride/e5d64048-6ea9-5368-bc4e-95918352d817/scratchpad/hamdesign/project/`
holds `Sort.dc.html`, `Order.dc.html`, `Label.dc.html`, `Lab.dc.html`,
`Mission.dc.html`, `Clip.dc.html`, `Question.dc.html`, `Map.dc.html` and
`Main.dc.html`.

## Accuracy

People study for a licensing exam from this, so a confident false statement is
the worst outcome.

- The official pool is the truth. Before you state a fact (a frequency, a band
  edge, a power limit, a formula, a rule), find the pool question that covers
  it: `python3 tools/explanations.py show T5` prints a topic's questions with
  the keyed answer starred, and `pair T5` adds the explanations. Never
  contradict the key.
- Prefer facts that the pool states. If you add something the pool does not
  state, it must be basic, uncontroversial and something you are sure of.
- Tie content to the pool: set `groups` on each `FeatureDef` to the question
  groups it teaches, and where it helps, name the question ids in a code
  comment beside the content.
- Do not invent rule numbers, statistics or figures.

## Working alongside other agents

Other agents are building other features in the same checkout at the same time.

- Create and edit files only inside your own folder (and any extra paths your
  brief names). Do not edit shared files, `package.json` or other features.
  Add no dependencies.
- Do not run git commands, `npm install`, `npm run build` or `vite preview`.
- Type-check with `npx tsc --noEmit -p .` from `app/`. Fix every error in your
  own files. Errors in other features' folders are theirs: ignore them.
- Test in a real phone-sized browser. Start a dev server on the port your brief
  gives you (`npx vite --port <port> --strictPort`, in the background), drive
  it with Playwright (already installed: `require('playwright')`, viewport
  390 x 844, `chromium.launch()` with no options), take screenshots into your
  scratch folder and look at them. Check for page errors, text that overflows
  or overlaps, and that every interaction works by drag and by tap where both
  apply. Stop your dev server when you are done.
- Put scratch scripts and screenshots under
  `/tmp/claude-0/-home-user-claude-group-ride/e5d64048-6ea9-5368-bc4e-95918352d817/scratchpad/<your-area>/`,
  never in the repository.
