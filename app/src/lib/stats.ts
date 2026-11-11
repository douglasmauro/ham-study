import {
  buildStates, DAY, groupP, groupStatus, localDay, masteryShare, newPerDay, passProbability,
  streak, type QState, type Status,
} from './engine';
import { POOL, QUESTIONS_BY_GROUP } from './pool';
import type { Data } from './store';

export interface GroupStat {
  id: string;
  title: string;
  status: Status;
  p: number;
  mastery: number;
}

export interface SubStat {
  id: string;
  title: string;
  mastery: number; // share of questions mastered
  p: number; // average chance per exam question
  groups: GroupStat[];
}

export interface Stats {
  states: Record<string, QState>;
  readiness: number; // probability of passing today
  subs: SubStat[];
  weakest: SubStat | null;
  streak: number;
  todayCount: number;
  seenCount: number;
  masteredCount: number;
  dueCount: number;
  daysToExam: number | null;
  newToday: number;
}

let cacheKey = '';
let cache: Stats | null = null;

export function examTime(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d, 9).getTime();
}

export function computeStats(data: Data, now = Date.now()): Stats {
  const key = `${data.events.length}:${data.events.at(-1)?.id ?? ''}:${data.events.filter((e) => e.guess).length}:${data.settings.examDate}:${localDay(now)}`;
  if (cache && key === cacheKey) return cache;

  const states = buildStates(data.events);
  const subs: SubStat[] = POOL.subelements.map((s) => {
    const groups = s.groups.map((g) => {
      const qs = QUESTIONS_BY_GROUP[g.id];
      return { id: g.id, title: g.title, status: groupStatus(qs, states), p: groupP(qs, states), mastery: masteryShare(qs, states) };
    });
    const qs = s.groups.flatMap((g) => QUESTIONS_BY_GROUP[g.id]);
    return {
      id: s.id,
      title: s.title,
      mastery: masteryShare(qs, states),
      p: groups.reduce((a, g) => a + g.p, 0) / groups.length,
      groups,
    };
  });
  const allGroupPs = subs.flatMap((s) => s.groups.map((g) => g.p));
  const readiness = passProbability(allGroupPs, POOL.pool.passMark);
  const seen = Object.keys(states).length;
  const today = localDay(now);
  const todayEvents = data.events.filter((e) => localDay(e.t) === today);
  const introducedToday = new Set(
    todayEvents.filter((e) => !data.events.some((o) => o.q === e.q && o.t < e.t)).map((e) => e.q),
  ).size;

  const exam = data.settings.examDate ? examTime(data.settings.examDate) : null;
  const coverBy = exam ? exam - 17 * DAY : now + 24 * DAY;
  const unseen = POOL.questions.length - seen;

  const touched = subs.filter((s) => s.groups.some((g) => g.status !== 'new'));
  const weakest = (touched.length ? touched : subs).slice().sort((a, b) => a.p - b.p)[0] ?? null;

  cache = {
    states,
    readiness,
    subs,
    weakest,
    streak: streak(data.events, now, Math.min(10, data.settings.dailyGoal)),
    todayCount: todayEvents.length,
    seenCount: seen,
    masteredCount: Object.values(states).filter((s) => s.box >= 3).length,
    dueCount: Object.values(states).filter((s) => s.due <= now).length,
    daysToExam: exam ? Math.max(0, Math.ceil((exam - now) / DAY)) : null,
    newToday: Math.max(0, newPerDay(unseen, now, coverBy) - introducedToday),
  };
  cacheKey = key;
  return cache;
}
