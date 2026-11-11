import type { ComponentChildren } from 'preact';

/** Values a decision leaves behind for later steps: text can use them as {name}. */
export type Vars = Record<string, string | number>;

/** What a step picture gets, so it can react to earlier choices and to a live slider or marker. */
export interface PicProps {
  vars: Vars;
  /** The live value of a slider or band-strip decision; undefined for a pick. */
  value?: number;
  /** True once the step has been answered correctly. */
  solved: boolean;
}

export interface PickOption {
  text: string;
  /** One-line reason, shown after answering. */
  why: string;
  correct?: boolean;
}

/** Pick one of 3 or 4 options. */
export interface PickDecision {
  type: 'pick';
  options: PickOption[];
  /** Chip that carries the choice forward. */
  chip: string;
  set?: Vars;
}

/** Set a value with a slider and stepper buttons, then check it against a target. */
export interface SliderDecision {
  type: 'slider';
  label: string;
  min: number;
  max: number;
  step: number;
  start: number;
  target: number;
  /** How far from the target still counts (default 0). */
  tolerance?: number;
  /** Words for the two stepper buttons, e.g. "Shorten" and "Lengthen". */
  lessLabel: string;
  moreLabel: string;
  format: (v: number) => string;
  /** One line shown when the checked value is below / above the target. */
  lowWhy: (v: number) => string;
  highWhy: (v: number) => string;
  rightWhy: string;
  chip: (v: number) => string;
  /** Values the accepted setting leaves for later steps. */
  set?: (v: number) => Vars;
}

export interface StripSegment {
  from: number;
  to: number;
  label: string;
  /** Reason shown when the marker is checked inside this segment. */
  why: string;
  ok?: boolean;
}

/** Place a marker on a band strip inside the allowed segment. */
export interface StripDecision {
  type: 'strip';
  label: string;
  min: number;
  max: number;
  step: number;
  start: number;
  /** Tick labels drawn under the strip. */
  ticks: number[];
  segments: StripSegment[];
  /** Checked exactly on an edge of the allowed segment. */
  edgeWhy: string;
  rightWhy: (v: number) => string;
  format: (v: number) => string;
  chip: (v: number) => string;
  set?: (v: number) => Vars;
}

export type Decision = PickDecision | SliderDecision | StripDecision;

export interface Step {
  /** Short name, e.g. "Build the antenna". */
  title: string;
  /** Topic id ('T1'..'T9', 'T0') that colors this step. */
  sub: string;
  /** A short piece of story. May use {name} for earlier values. */
  story: string;
  /** Optional worked line in the mono font. May use {name}. */
  formula?: string;
  /** Inline SVG for this step. Not used by a strip step: the strip is the picture. */
  pic?: (p: PicProps) => ComponentChildren;
  /** The question for the one decision. */
  ask: string;
  decision: Decision;
  /** Pool question ids this step covers. */
  covers: string[];
  /** One line of the end-of-mission recap. May use {name}. */
  recap: string;
}

export interface Mission {
  id: string;
  title: string;
  /** Short name for the header. */
  short: string;
  blurb: string;
  sub: string;
  minutes: number;
  /** The goal, shown above the first step. */
  goal: string;
  steps: Step[];
}

export function fill(text: string, vars: Vars): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/** Question groups a mission teaches, taken from the ids its steps cover. */
export function groupsOf(m: Mission): string[] {
  const out: string[] = [];
  for (const s of m.steps) for (const id of s.covers) {
    const g = id.slice(0, 3);
    if (!out.includes(g)) out.push(g);
  }
  return out;
}
