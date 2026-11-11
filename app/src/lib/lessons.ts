import { LESSONS, type LessonInfo } from '../features/lessons/manifest';
import type { Data } from './store';

/**
 * Lessons that are switched on for learners. A lesson can be in the code, and reachable by its
 * address for review, before it is listed here; only listed lessons appear in the app, show as
 * the next lesson, or hold back their group's questions.
 */
export const LIVE_LESSONS = new Set<string>(['t3b-wavelength-frequency']);

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
