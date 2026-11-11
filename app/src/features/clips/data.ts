import type { ComponentType } from 'preact';
import ohmsLaw from './data/ohms-law.json';
import power from './data/power.json';
import wavelength from './data/wavelength.json';
import repeater from './data/repeater.json';
import swr from './data/swr.json';
import propagation from './data/propagation.json';
import durations from './data/durations.json';

/** One narration line. The caption is shown; tools/make_clip_audio.py turns it into speech. */
export interface ClipLine {
  caption: string;
  say?: string; // spoken in place of the caption, when the two must differ
  questionIds: string[]; // pool questions this line agrees with
}

/** A clip's data file (src/features/clips/data/<id>.json). */
export interface ClipData {
  id: string;
  title: string;
  blurb: string;
  sub: string;
  groups: string[];
  questionIds: string[];
  lines: ClipLine[];
}

/** What a clip's picture gets: the line being spoken and two clocks that stop when paused. */
export interface SceneProps {
  step: number; // index of the current line, -1 before the clip starts
  t: number; // seconds of playing time since the clip started
  ts: number; // seconds of playing time since this line started
}

export interface ClipDef {
  data: ClipData;
  Scene: ComponentType<SceneProps>;
  Extra: ComponentType<{ step: number }>;
}

export const CLIP_DATA = { ohmsLaw, power, wavelength, repeater, swr, propagation } satisfies Record<string, ClipData>;

const DURATIONS: Record<string, { title: number; lines: number[] } | undefined> = durations;

/** Reading pace used when there is no recording to time a line by. */
function readingMs(text: string) {
  return text.trim().split(/\s+/).length * 380 + 600;
}

/** Length of a line's recording in ms, or a reading-pace guess if it was never recorded. */
export function lineMs(clip: ClipData, n: number) {
  return DURATIONS[clip.id]?.lines[n] ?? readingMs(clip.lines[n].caption);
}

export function titleMs(clip: ClipData) {
  return DURATIONS[clip.id]?.title ?? readingMs(clip.title);
}

/** Relative on purpose, so the app still finds its audio when hosted under a sub-path. */
export function audioUrl(clipId: string, file: number | 'title') {
  return `./audio/clips/${clipId}/${file}.mp3`;
}
