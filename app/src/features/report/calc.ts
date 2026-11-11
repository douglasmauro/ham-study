/**
 * Weekly report numbers. Pure functions of the answer log, the activity log and
 * `now`, so they can be checked outside the browser.
 *
 * "This week" is the last 7 local calendar days including today. "Last week" is
 * the 7 calendar days before that.
 */
import { buildStates, DAY, groupP, isMastered, localDay, passProbability, type AnswerEvent, type QState } from '../../lib/engine';
import { ALL_GROUPS, POOL, QUESTIONS_BY_GROUP, QUESTIONS_BY_ID } from '../../lib/pool';
import { examTime } from '../../lib/stats';
import type { Data } from '../../lib/store';

export interface DayBar { key: string; t: number; label: string; answers: number; activities: number; isToday: boolean }
export interface WeekTotals { days: number; answers: number; right: number; accuracy: number | null; activities: number }
export interface TopicChange { id: string; then: number; now: number; delta: number }
export interface ExamRun { t: number; right: number; total: number; pass: boolean }
export type PaceKind = 'done' | 'no-date' | 'past' | 'on' | 'behind';
export interface Pace {
  kind: PaceKind;
  unseen: number;
  newThisWeek: number;
  perDay: number; // new questions per day over the days counted
  daysCounted: number;
  daysToExam: number | null;
  daysToCover: number | null; // days until 17 days before the exam
  needPerDay: number | null;
  daysAtPace: number | null; // days to see the rest at the current pace
}
export interface Report {
  empty: boolean;
  hasPrev: boolean; // anything logged before this week started
  days: DayBar[];
  week: WeekTotals;
  prev: WeekTotals;
  readinessNow: number;
  readinessThen: number;
  improved: TopicChange[];
  weakest: TopicChange[];
  newlyMastered: string[];
  slipped: string[];
  masteredNow: number;
  exams: ExamRun[];
  unfinishedExams: number;
  pace: Pace;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function readinessOf(states: Record<string, QState>): number {
  return passProbability(ALL_GROUPS.map((g) => groupP(QUESTIONS_BY_GROUP[g.id], states)), POOL.pool.passMark);
}

/** Average chance of a right answer per exam question in a topic (same as stats.ts SubStat.p). */
function topicP(sub: string, states: Record<string, QState>): number {
  const groups = POOL.subelements.find((s) => s.id === sub)!.groups;
  return groups.reduce((a, g) => a + groupP(QUESTIONS_BY_GROUP[g.id], states), 0) / groups.length;
}

/**
 * Practice exams are logged one answer at a time with mode 'exam', one question
 * per group in syllabus order. A run ends when the next exam answer is not from
 * a later group, or after 35 answers. Only runs of all 35 count as an exam.
 */
export function examRuns(events: AnswerEvent[]): { t: number; right: number; total: number }[] {
  const order: Record<string, number> = Object.fromEntries(ALL_GROUPS.map((g, i) => [g.id, i]));
  const runs: { t: number; right: number; total: number; lastIdx: number }[] = [];
  let cur: (typeof runs)[number] | null = null;
  for (const e of events.filter((x) => x.mode === 'exam').sort((a, b) => a.t - b.t)) {
    const idx = order[QUESTIONS_BY_ID[e.q]?.group ?? ''] ?? -1;
    if (!cur || idx <= cur.lastIdx || cur.total >= ALL_GROUPS.length) {
      cur = { t: e.t, right: 0, total: 0, lastIdx: -1 };
      runs.push(cur);
    }
    cur.total++;
    if (e.correct) cur.right++;
    cur.lastIdx = idx;
    cur.t = e.t;
  }
  return runs;
}

export function computeReport(data: Data, now = Date.now()): Report {
  const events = data.events.filter((e) => e.t <= now);
  const acts = (data.activities ?? []).filter((a) => a.t <= now);
  const d = new Date(now);
  const startOf = (back: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - back).getTime();
  const thisStart = startOf(6);
  const prevStart = startOf(13);

  const days: DayBar[] = [];
  for (let i = 6; i >= 0; i--) {
    const t = startOf(i);
    days.push({ key: localDay(t), t, label: WEEKDAYS[new Date(t).getDay()], answers: 0, activities: 0, isToday: i === 0 });
  }
  const byKey = Object.fromEntries(days.map((x) => [x.key, x]));
  for (const e of events) if (e.t >= thisStart) byKey[localDay(e.t)].answers++;
  for (const a of acts) if (a.t >= thisStart) byKey[localDay(a.t)].activities++;

  const totals = (from: number, to: number): WeekTotals => {
    const ev = events.filter((e) => e.t >= from && e.t < to);
    const ac = acts.filter((a) => a.t >= from && a.t < to);
    const right = ev.filter((e) => e.correct).length;
    return {
      days: new Set([...ev, ...ac].map((x) => localDay(x.t))).size,
      answers: ev.length,
      right,
      accuracy: ev.length ? right / ev.length : null,
      activities: ac.length,
    };
  };
  const week = totals(thisStart, Infinity);
  const prev = totals(prevStart, thisStart);

  const statesNow = buildStates(events);
  const statesThen = buildStates(events.filter((e) => e.t < thisStart));

  const touchedThisWeek = new Set(events.filter((e) => e.t >= thisStart).map((e) => e.q.slice(0, 2)));
  const touchedEver = new Set(Object.keys(statesNow).map((q) => q.slice(0, 2)));
  const changes: TopicChange[] = POOL.subelements.map((s) => {
    const then = topicP(s.id, statesThen);
    const nowP = topicP(s.id, statesNow);
    return { id: s.id, then, now: nowP, delta: nowP - then };
  });
  const improved = changes
    .filter((c) => touchedThisWeek.has(c.id) && Math.round(c.delta * 100) > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);
  const weakest = changes.filter((c) => touchedEver.has(c.id)).sort((a, b) => a.now - b.now).slice(0, 2);

  const masteredIds = Object.keys(statesNow).filter((q) => isMastered(statesNow[q]));
  const newlyMastered = masteredIds.filter((q) => !isMastered(statesThen[q])).sort();
  const slipped = Object.keys(statesThen).filter((q) => isMastered(statesThen[q]) && !isMastered(statesNow[q])).sort();

  const runs = examRuns(events).filter((r) => r.t >= thisStart);
  const exams = runs
    .filter((r) => r.total === ALL_GROUPS.length)
    .map((r) => ({ t: r.t, right: r.right, total: r.total, pass: r.right >= POOL.pool.passMark }));

  // Pace: new questions first seen this week, per calendar day counted (the whole week, or from the first answer if that is later).
  const unseen = POOL.questions.length - Object.keys(statesNow).length;
  const newThisWeek = Object.keys(statesNow).filter((q) => !statesThen[q]).length;
  const first = events.length ? Math.min(...events.map((e) => e.t)) : now;
  const daysCounted = days.filter((x) => x.t + DAY > first).length || 1; // calendar days from the first answer (or the week start) through today
  const perDay = newThisWeek / daysCounted;
  const exam = data.settings.examDate ? examTime(data.settings.examDate) : null;
  const daysToExam = exam ? Math.max(0, Math.ceil((exam - now) / DAY)) : null;
  const daysToCover = exam ? Math.ceil((exam - 17 * DAY - now) / DAY) : null;
  const needPerDay = daysToCover !== null && daysToCover > 0 ? unseen / daysToCover : null;
  const daysAtPace = perDay > 0 ? Math.ceil(unseen / perDay) : null;
  let kind: PaceKind;
  if (unseen === 0) kind = 'done';
  else if (exam === null) kind = 'no-date';
  else if (needPerDay === null) kind = 'past';
  else kind = perDay >= needPerDay ? 'on' : 'behind';

  return {
    empty: events.length === 0 && acts.length === 0,
    hasPrev: events.some((e) => e.t < thisStart) || acts.some((a) => a.t < thisStart),
    days, week, prev,
    readinessNow: readinessOf(statesNow),
    readinessThen: readinessOf(statesThen),
    improved, weakest, newlyMastered, slipped,
    masteredNow: masteredIds.length,
    exams,
    unfinishedExams: runs.length - exams.length,
    pace: { kind, unseen, newThisWeek, perDay, daysCounted, daysToExam, daysToCover, needPerDay, daysAtPace },
  };
}
