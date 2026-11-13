/**
 * The learning engine: spaced repetition, mastery, readiness and session building.
 * Everything here is a pure function of the answer log, so it is easy to test and
 * two devices that share the same log always agree.
 */
import type { Question } from './pool';

export type Mode = 'drill' | 'exam' | 'review';

export interface AnswerEvent {
  id: string; // unique, so logs from two devices merge cleanly
  t: number; // epoch ms
  q: string; // question id
  choice: number; // original choice index picked
  correct: boolean;
  ms: number; // time to answer
  hint: 0 | 1 | 2; // hint steps used
  guess?: boolean; // learner said they guessed
  mode: Mode;
}

export interface QState {
  q: string;
  box: number; // 0 = learning, 5 = long-term
  due: number; // epoch ms
  seen: number;
  right: number;
  wrong: number;
  last: number;
  recent: boolean[]; // last few clean answers (true = right without help)
  wrongChoices: number[]; // choices picked when wrong, newest last
}

export const DAY = 86_400_000;
const INTERVAL_DAYS = [0, 1, 3, 7, 16, 35];
const RELEARN_MS = 10 * 60_000;

export function applyEvent(prev: QState | undefined, ev: AnswerEvent): QState {
  const s: QState = prev
    ? { ...prev, recent: prev.recent.slice(), wrongChoices: prev.wrongChoices.slice() }
    : { q: ev.q, box: 0, due: ev.t, seen: 0, right: 0, wrong: 0, last: 0, recent: [], wrongChoices: [] };
  s.seen++;
  s.last = ev.t;
  const helped = ev.hint > 0 || !!ev.guess;
  if (ev.correct) {
    s.right++;
    if (helped) {
      // Half-learned: keep it close.
      s.box = Math.min(s.box, 1) || 1;
      s.due = ev.t + DAY;
    } else {
      s.box = Math.min(s.box + 1, INTERVAL_DAYS.length - 1);
      s.due = ev.t + INTERVAL_DAYS[s.box] * DAY;
    }
  } else {
    s.wrong++;
    s.box = 0;
    s.due = ev.t + RELEARN_MS;
    s.wrongChoices.push(ev.choice);
    if (s.wrongChoices.length > 6) s.wrongChoices.shift();
  }
  s.recent.push(ev.correct && !helped);
  if (s.recent.length > 4) s.recent.shift();
  return s;
}

export function buildStates(events: AnswerEvent[]): Record<string, QState> {
  const out: Record<string, QState> = {};
  const sorted = events.slice().sort((a, b) => a.t - b.t);
  for (const ev of sorted) out[ev.q] = applyEvent(out[ev.q], ev);
  return out;
}

/** Estimated chance of answering this question right on the exam. */
export function pCorrect(s: QState | undefined): number {
  if (!s) return 0.25; // a blind guess among four
  const n = s.recent.length;
  const k = s.recent.filter(Boolean).length;
  let p = (k + 0.5) / (n + 2);
  if (s.box >= 4) p = Math.max(p, 0.95);
  else if (s.box === 3) p = Math.max(p, 0.85);
  return p;
}

/**
 * Answered right twice in a row with no hint or guess. A settled question leaves miss lists
 * and top-ups and waits for its normal review date, so other questions get the time.
 */
export function isSettled(s: QState | undefined): boolean {
  if (!s || s.recent.length < 2) return false;
  return s.recent[s.recent.length - 1] && s.recent[s.recent.length - 2];
}

export function isMastered(s: QState | undefined): boolean {
  return !!s && s.box >= 3;
}

/** Chance of getting the one exam question drawn from this group right. */
export function groupP(questions: Question[], states: Record<string, QState>): number {
  if (!questions.length) return 0;
  return questions.reduce((a, q) => a + pCorrect(states[q.id]), 0) / questions.length;
}

/** Probability that at least `passMark` of independent questions are right (Poisson binomial). */
export function passProbability(ps: number[], passMark: number): number {
  let dist = [1];
  for (const p of ps) {
    const next = new Array(dist.length + 1).fill(0);
    for (let k = 0; k < dist.length; k++) {
      next[k] += dist[k] * (1 - p);
      next[k + 1] += dist[k] * p;
    }
    dist = next;
  }
  let sum = 0;
  for (let k = passMark; k < dist.length; k++) sum += dist[k];
  return Math.min(1, Math.max(0, sum));
}

export type Status = 'new' | 'weak' | 'learning' | 'mastered';

export function groupStatus(questions: Question[], states: Record<string, QState>): Status {
  const seen = questions.filter((q) => states[q.id]);
  if (!seen.length) return 'new';
  const mastered = questions.filter((q) => isMastered(states[q.id])).length / questions.length;
  if (mastered >= 0.8) return 'mastered';
  const right = seen.reduce((a, q) => a + states[q.id].right, 0);
  const total = seen.reduce((a, q) => a + states[q.id].seen, 0);
  return right / total < 0.6 ? 'weak' : 'learning';
}

export function masteryShare(questions: Question[], states: Record<string, QState>): number {
  if (!questions.length) return 0;
  return questions.filter((q) => isMastered(states[q.id])).length / questions.length;
}

// ---------- session building ----------

export interface Rng {
  (): number;
}

export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rng: Rng): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface DrillOptions {
  size: number; // questions in the session
  newCount: number; // new questions to introduce
  rng: Rng;
  /** Top up a short session with already-seen questions (default true). */
  pad?: boolean;
}

/**
 * A daily drill: due reviews first (most overdue), then new questions spread across
 * the groups with the least coverage, then the weakest seen questions as filler.
 * The result interleaves reviews and new material.
 */
export function buildDrill(
  questions: Question[],
  states: Record<string, QState>,
  now: number,
  opts: DrillOptions,
): string[] {
  const due = questions
    .filter((q) => states[q.id] && states[q.id].due <= now)
    .sort((a, b) => states[a.id].due - states[b.id].due)
    .map((q) => q.id);

  const unseen = questions.filter((q) => !states[q.id]);
  const byGroup: Record<string, Question[]> = {};
  for (const q of unseen) (byGroup[q.group] ||= []).push(q);
  const coverage = (g: string) => {
    const all = questions.filter((q) => q.group === g).length;
    return 1 - (byGroup[g]?.length ?? 0) / all;
  };
  const groups = shuffle(Object.keys(byGroup), opts.rng).sort((a, b) => coverage(a) - coverage(b));
  const fresh: string[] = [];
  let round = 0;
  while (fresh.length < unseen.length && fresh.length < opts.size) {
    let added = false;
    for (const g of groups) {
      const q = byGroup[g][round];
      if (q) {
        fresh.push(q.id);
        added = true;
      }
    }
    if (!added) break;
    round++;
  }

  const newCount = Math.min(opts.newCount, fresh.length);
  const reviewSlots = Math.max(0, opts.size - newCount);
  const reviews = due.slice(0, reviewSlots);
  let news = fresh.slice(0, opts.size - reviews.length);

  // Not enough due work: fill with the weakest seen questions.
  const chosen = new Set([...reviews, ...news]);
  if (opts.pad !== false && chosen.size < opts.size) {
    const weakest = questions
      .filter((q) => states[q.id] && !chosen.has(q.id) && !isSettled(states[q.id]))
      .sort((a, b) => pCorrect(states[a.id]) - pCorrect(states[b.id]))
      .map((q) => q.id);
    for (const id of weakest) {
      if (chosen.size >= opts.size) break;
      chosen.add(id);
      reviews.push(id);
    }
  }
  news = news.filter((id) => !reviews.includes(id));

  // Interleave: review, new, review, new...
  const out: string[] = [];
  const r = shuffle(reviews, opts.rng);
  const n = news;
  while (r.length || n.length) {
    if (r.length) out.push(r.shift()!);
    if (n.length) out.push(n.shift()!);
  }
  return out.slice(0, opts.size);
}

/** One random question from every group, in syllabus order, like the real exam. */
export function buildExam(groups: { id: string }[], byGroup: Record<string, Question[]>, rng: Rng): string[] {
  return groups.map((g) => {
    const qs = byGroup[g.id];
    return qs[Math.floor(rng() * qs.length)].id;
  });
}

/** How many new questions to introduce today so the whole pool is seen by `coverBy`. */
export function newPerDay(unseen: number, now: number, coverBy: number): number {
  const days = Math.max(1, Math.ceil((coverBy - now) / DAY));
  return Math.max(5, Math.min(20, Math.ceil(unseen / days)));
}

/** Choices whose position matters ("All these choices are correct") are never shuffled. */
export function canShuffleChoices(q: Question): boolean {
  return !q.choices.some((c) => /\b(these|above)\b|\bboths?\b|\b[A-D] and [A-D]\b/i.test(c));
}

// ---------- streaks ----------

export function localDay(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Consecutive days (ending today, or yesterday if today isn't done yet) with at least `goal` answers. */
export function streak(events: AnswerEvent[], now: number, goal: number): number {
  const counts: Record<string, number> = {};
  for (const e of events) counts[localDay(e.t)] = (counts[localDay(e.t)] || 0) + 1;
  let day = now;
  if ((counts[localDay(day)] || 0) < goal) day -= DAY;
  let n = 0;
  while ((counts[localDay(day)] || 0) >= goal) {
    n++;
    day -= DAY;
  }
  return n;
}
