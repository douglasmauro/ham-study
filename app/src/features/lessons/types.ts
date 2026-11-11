import type { ComponentType } from 'preact';

/**
 * A lesson is data. The player in Player.tsx turns it into screens, so a new lesson is a new
 * file under content/ and one line each in index.ts and manifest.ts.
 */

/** What a custom picture is told, so it can react to the card's activity. */
export interface PicProps {
  value?: number; // slider position
  picked?: string | null; // id of the option tapped last (tap-choice)
  solved?: boolean; // the activity is done
  onPick?: (id: string) => void; // call it to make a part of the picture tappable (tap-choice)
}

/** A card's picture: a glossary drawing by term id, or a component drawn with the glossaryart kit. */
export type Pic = { art: string } | { draw: ComponentType<PicProps> };

/* ---------- activities ---------- */

/** Drag a slider, watch the picture and a readout change, reach a target. */
export interface SliderDef {
  kind: 'slider';
  prompt: string; // the target, as an instruction: "Raise the frequency until ..."
  label: string; // what the slider sets, e.g. "Frequency"
  min: number;
  max: number;
  step: number;
  start: number;
  readouts: (v: number) => { label: string; value: string }[]; // the numbers shown under the picture
  goal: (v: number) => boolean;
  hint: (v: number) => string; // shown while the target is not reached; says which way to go
  done: string; // shown once it is reached
}

/** Tap one of 2 to 4 options (or the matching part of the picture). */
export interface ChoiceDef {
  kind: 'choice';
  prompt: string;
  options: { id: string; label: string; right?: boolean; why: string }[];
}

/** Put each item in its slot: tap an item, then a slot. */
export interface SortDef {
  kind: 'sort';
  prompt: string;
  slots: { id: string; label: string; sub?: string; rule: string }[]; // rule: one line said after a wrong drop here
  items: { id: string; label: string; slot: string; why: string }[]; // why: said after the right drop
}

/** A guided sum: top divided by bottom, the learner types the result. */
export interface ComputeRound {
  prompt: string;
  left: string; // what is being worked out, e.g. "meters"
  top: string;
  bottom: string;
  accept: [number, number]; // any answer in this range is right
  traps?: { range: [number, number]; why: string }[]; // known wrong answers with their own reason
  hint: string; // reason shown for any other wrong answer
  answer: string; // filled in by "Show me"
  working: string[]; // revealed after answering
}
export interface ComputeDef {
  kind: 'compute';
  rounds: ComputeRound[];
}

export type Interaction = SliderDef | ChoiceDef | SortDef | ComputeDef;

/* ---------- steps ---------- */

interface StepBase {
  id: string; // unique in the lesson
  covers: string[]; // pool question ids this step teaches
}

/** Plays one of the narrated clips (src/features/clips) inline. */
export interface ClipStep extends StepBase {
  type: 'clip';
  clip: string; // clip id, e.g. 'wavelength'
  intro?: string;
}

/** Teaches one idea. */
export interface CardStep extends StepBase {
  type: 'card';
  idea: string; // a few words naming the idea, used in "review this" lists
  picture?: Pic;
  heading: string;
  text: string[]; // two or three plain sentences or short paragraphs
  remember?: string; // the one fact the exam wants
  interaction?: Interaction;
}

export interface CheckQuestion {
  q: string;
  choices: { label: string; right?: boolean; why: string }[]; // 2 to 4, exactly one right
  review: string; // id of the card that teaches it
  covers: string[];
}

/** "Check yourself": 2 to 4 easy questions in plain words. Not copies of pool questions. */
export interface CheckStep extends StepBase {
  type: 'check';
  questions: CheckQuestion[];
}

/** The 4 to 6 facts to take away. */
export interface RecapStep extends StepBase {
  type: 'recap';
  facts: { icon: ComponentType; text: string; covers: string[] }[];
}

export type Step = ClipStep | CardStep | CheckStep | RecapStep;

export interface Lesson {
  id: string; // same id in manifest.ts
  title: string;
  blurb: string;
  sub: string; // topic id, e.g. 'T3'
  groups: string[]; // question groups it teaches
  minutes: number;
  steps: Step[]; // by convention: clip, cards, check, recap
}
