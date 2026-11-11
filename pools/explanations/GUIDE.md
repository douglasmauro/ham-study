# Writing explanations

Each question gets three pieces of teaching text, stored per subelement in
`pools/explanations/technician-2026/<SUB>.json`:

```json
{
  "T5D01": {
    "concept": "Ohm's law: current equals voltage divided by resistance. More push means more flow; more resistance means less.",
    "hint": "Picture the Ohm's law triangle: cover the letter you want and look at how the other two are arranged.",
    "why": [
      "Multiplying voltage by resistance gives a meaningless number here; current gets smaller as resistance grows, not larger.",
      "Current is the voltage (E) divided by the resistance (R): the push divided by what opposes it.",
      "Squaring the voltage belongs to a power formula (P = E² / R), not to finding current.",
      "E² / R is the formula for power in watts, not current in amperes."
    ]
  }
}
```

The reader is a beginner and a visual learner studying on a phone. They want to
understand the idea, not memorize an answer.

## The three fields

- **concept** (max 240 characters): the idea behind the question in one or two
  plain sentences, written so it would still help if the question were worded
  differently. Give the reason or a mental picture where there is one.
- **hint** (max 170 characters): a nudge shown *before* answering. Point toward
  the idea or a way to reason about it. It must never contain the answer's
  words or make the answer obvious by elimination.
- **why** (exactly 4 lines, max 180 characters each): one per answer choice, in
  the official A, B, C, D order shown by the `show` command. For the correct
  choice, say why it is right. For each wrong choice, say what that thing
  actually is or why it does not fit, so the learner can tell the ideas apart.

## Rules

1. **The official answer key is the truth.** The line for the starred choice
   must support it, and the other three must not contradict it. If you believe
   the key is debatable, still explain the keyed answer.
2. **Be accurate.** State only what you are sure of. Do not invent FCC rule
   numbers, frequencies, dates or figures; use the ones in the question, its
   choices or its rule reference. If you cannot say something specific and true
   about a wrong choice, say plainly that it is not what the question describes.
3. **Never refer to a choice by letter** ("choice A", "B and C"). The app
   shuffles choices. Refer to a choice by what it says.
4. **Do not start a `why` line with a verdict** ("Correct:", "Wrong:", "Not
   this:"). The app adds that label.
5. **"All these choices are correct"**: when it is the answer, each of the
   other three lines says why that item is true, and the "all" line says all
   three are true. When it is a wrong choice, say which item is false.
6. **Made-up or joke choices**: say it is not a real term or not a real rule,
   only if you are confident. Otherwise say it is not what is described.
7. **Plain words.** Short sentences. Define a term the first time it appears in
   an entry. No emoji, no markdown, no line breaks, no exclamation marks.
8. **Figures**: for questions that use figure T-1, T-2 or T-3, describe the
   symbol's shape in words (the figures are in `app/public/figures/`; look at
   them before writing).
9. **Math questions**: show the working with the question's own numbers in the
   correct choice's line, and say which slip produces each wrong number when
   you can tell.

## Commands

```sh
python3 tools/explanations.py show T5     # the questions, with * on the keyed answer
python3 tools/explanations.py check T5    # validate your file
```
