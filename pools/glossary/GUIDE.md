# Writing the glossary

The glossary lists every radio term a beginner meets in the question pool, with
a plain definition. In the app each term shows a colored dot worked out from
the learner's answers to the questions linked to it, so the links matter as
much as the definitions.

Terms are stored per subelement in `pools/glossary/technician-2026/<SUB>.json`:

```json
{
  "terms": [
    {
      "term": "Repeater offset",
      "aka": ["offset", "shift"],
      "def": "The difference between a repeater's transmit frequency and its receive frequency.",
      "more": "On 2 meters the usual offset is plus or minus 600 kHz. Your radio must transmit on the repeater's receive frequency.",
      "questions": ["T2A01", "T2A03", "T2A07"]
    }
  ]
}
```

## Fields

- **term**: the word or phrase as a learner would look it up. Sentence case
  ("Repeater offset"), except abbreviations and proper names ("SWR", "CTCSS",
  "Ohm's law", "FM"). For an abbreviation, use the abbreviation as the term and
  spell it out at the start of the definition.
- **aka** (optional): other names or spellings for the same thing, including
  the spelled-out form of an abbreviation. Used by search.
- **def** (max 200 characters): one plain sentence saying what it is. Do not
  use the term to define itself. A beginner with no background must be able to
  follow it.
- **more** (optional, max 260 characters): one or two sentences with the detail
  the exam cares about: the number to remember, how it is used, or how it
  differs from a similar term.
- **questions** (at least one): the ids of every question in this subelement
  that tests this term: the term appears in the question, or in the keyed
  answer, or it is the idea the question is about. Do not link a question only
  because the term appears in one of its wrong choices.

## What to include

Go through every question in the subelement (`python3 tools/explanations.py
pair <SUB>` prints each question with its keyed answer and explanations) and
collect every technical term, abbreviation, unit, component, mode, Q signal,
rule concept and piece of equipment that a beginner might not know. Include
basic ones too ("Frequency", "Antenna", "Call sign"). Aim for 25 to 60 terms
per subelement; every question should be linked from at least one term.

## Rules

1. **The official pool is the truth.** A definition must agree with the keyed
   answers of the questions it links to. State only what you are sure of. Do
   not invent numbers, rule references or history.
2. **Plain words, short sentences.** No emoji, no markdown, no line breaks.
3. **One entry per concept.** Put synonyms in `aka`, not in separate entries.
   Near-opposites that learners confuse (for example "Series circuit" and
   "Parallel circuit") are separate entries, and each `more` can say how it
   differs from the other.
4. A term may also appear in another subelement's file; that is fine. The
   merge step combines them.

## Commands

```sh
python3 tools/explanations.py pair T2     # questions with keyed answers and explanations
python3 tools/glossary.py check T2        # validate your file
```
