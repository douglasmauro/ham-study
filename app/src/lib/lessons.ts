import { POOL } from './pool';
import { LESSONS, type LessonInfo } from '../features/lessons/manifest';
import type { Data } from './store';

/**
 * Lessons that are switched on for learners. A lesson can be in the code, and reachable by its
 * address for review, before it is listed here; only listed lessons appear in the app, show as
 * the next lesson, or hold back their group's questions.
 */
export const LIVE_LESSONS = new Set<string>([
  't3b-wavelength-frequency', 't3a-signals-travel', 't3c-propagation',
  't5a-current-voltage', 't5b-units-decibels', 't5c-capacitance-power', 't5d-ohms-law',
  't6a-components', 't6b-semiconductors', 't6c-schematics', 't6d-component-functions',
  't7a-station-equipment', 't8a-modes',
  't4a-station-setup', 't4b-operating-controls', 't9a-antennas', 't9b-feed-lines', 't7c-swr',
  't2a-making-contacts', 't2b-repeaters', 't2c-nets-emergencies', 't8b-satellites', 't8c-activities', 't8d-digital-modes',
  't7b-problems', 't7d-test-instruments',
  't1a-purpose-terms', 't1b-bands-privileges', 't1c-licenses', 't1d-transmissions', 't1e-control-operator', 't1f-identification',
  't0a-electrical-safety', 't0b-tower-safety', 't0c-rf-exposure',
]);

/** Live lessons in teaching order. */
export const ALL_LESSONS: LessonInfo[] = LESSONS.filter((l) => LIVE_LESSONS.has(l.id)).sort((a, b) => a.order - b.order);

export function finishedLessons(data: Data): Set<string> {
  return new Set((data.activities ?? []).filter((a) => a.area === 'lessons').map((a) => a.item));
}

/** The first lesson, in teaching order, that the learner has not finished. */
export function nextLesson(data: Data): LessonInfo | null {
  const done = finishedLessons(data);
  return ALL_LESSONS.find((l) => !done.has(l.id)) ?? null;
}

/**
 * Learn first, then get tested: groups whose lesson exists but is not finished yet. The daily
 * drill does not introduce new questions from these groups. Groups with no lesson written
 * yet are never locked, and questions already seen keep coming back for review.
 */
export function lockedGroups(data: Data): Set<string> {
  const done = finishedLessons(data);
  return new Set(ALL_LESSONS.filter((l) => !done.has(l.id)).flatMap((l) => l.groups));
}

/**
 * What the daily drill can offer right now: questions due for review, and new questions from
 * finished lessons (up to today's allowance). When both are zero there is nothing to practice
 * until the next lesson or the next review comes due.
 */
export function practiceAvailable(data: Data, states: Record<string, unknown>, now: number, newToday: number): { due: number; fresh: number } {
  const locked = lockedGroups(data);
  let due = 0;
  let open = 0;
  for (const q of POOL.questions) {
    const st = states[q.id] as { due: number } | undefined;
    if (st) { if (st.due <= now) due++; }
    else if (!locked.has(q.group)) open++;
  }
  return { due, fresh: Math.min(newToday, open) };
}
