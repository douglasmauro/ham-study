/**
 * Exam simulation state: the draw, the in-progress attempt (sessionStorage, so a
 * reload or the back button never loses it) and the finished attempts
 * (localStorage, under this feature's own key).
 */
import { buildExam, seededRng } from '../../lib/engine';
import { ALL_GROUPS, QUESTIONS_BY_GROUP, QUESTIONS_BY_ID, POOL } from '../../lib/pool';
import { addEvent, newId } from '../../lib/store';

const ACTIVE_KEY = 'hamstudy:examsim:active';
const HISTORY_KEY = 'hamstudy:examsim:v1';
const MAX_ATTEMPTS = 60;

export const DEFAULT_MINUTES = 35;
export const MINUTE_OPTIONS = [20, DEFAULT_MINUTES, 60];

export interface ActiveExam {
  v: 1;
  id: string;
  seed: number;
  ids: string[]; // question ids, in syllabus order
  answers: (number | null)[]; // original choice index, or null
  flags: boolean[];
  ms: number[]; // time spent looking at each question
  cur: number;
  startedAt: number;
  durationMs: number;
  usedMs: number; // counts only while the exam is on screen
}

export interface Attempt {
  id: string;
  t: number; // when it was submitted
  ids: string[];
  answers: (number | null)[];
  score: number;
  total: number;
  passMark: number;
  usedMs: number;
  durationMs: number;
  timedOut: boolean;
}

interface History {
  version: 1;
  attempts: Attempt[];
}

export function newExam(minutes: number): ActiveExam {
  const seed = Date.now();
  const ids = buildExam(ALL_GROUPS, QUESTIONS_BY_GROUP, seededRng(seed));
  return {
    v: 1,
    id: newId(),
    seed,
    ids,
    answers: ids.map(() => null),
    flags: ids.map(() => false),
    ms: ids.map(() => 0),
    cur: 0,
    startedAt: seed,
    durationMs: minutes * 60_000,
    usedMs: 0,
  };
}

export function loadActive(): ActiveExam | null {
  try {
    const raw = sessionStorage.getItem(ACTIVE_KEY);
    if (!raw) return null;
    const e = JSON.parse(raw) as ActiveExam;
    const n = e?.ids?.length;
    if (e.v !== 1 || !n || e.answers?.length !== n || e.flags?.length !== n || e.ms?.length !== n) return null;
    if (!e.ids.every((id) => QUESTIONS_BY_ID[id])) return null; // drawn from another pool
    if (loadAttempts().some((a) => a.id === e.id)) return null; // already submitted
    return { ...e, cur: Math.min(Math.max(0, e.cur | 0), n - 1) };
  } catch {
    return null;
  }
}

export function saveActive(e: ActiveExam) {
  try {
    sessionStorage.setItem(ACTIVE_KEY, JSON.stringify(e));
  } catch {
    // Storage unavailable: the exam still works for this visit.
  }
}

export function clearActive() {
  try {
    sessionStorage.removeItem(ACTIVE_KEY);
  } catch {
    // nothing to clear
  }
}

export function loadAttempts(): Attempt[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const h = JSON.parse(raw) as History;
    return h.version === 1 && Array.isArray(h.attempts) ? h.attempts : [];
  } catch {
    return [];
  }
}

function saveAttempts(attempts: Attempt[]) {
  try {
    const h: History = { version: 1, attempts: attempts.slice(-MAX_ATTEMPTS) };
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  } catch {
    // Quota or private mode: the report still shows for this visit.
  }
}

const submitted = new Set<string>();

/**
 * Score the exam, store the attempt and add each answered question to the shared
 * answer log. Safe to call twice: an attempt is recorded only once.
 */
export function finishExam(e: ActiveExam, timedOut: boolean): Attempt {
  const before = loadAttempts();
  const existing = before.find((a) => a.id === e.id);
  if (existing) {
    clearActive();
    return existing;
  }
  const now = Date.now();
  const score = e.ids.filter((id, i) => e.answers[i] === QUESTIONS_BY_ID[id].answer).length;
  const attempt: Attempt = {
    id: e.id,
    t: now,
    ids: e.ids,
    answers: e.answers,
    score,
    total: e.ids.length,
    passMark: POOL.pool.passMark,
    usedMs: Math.min(e.usedMs, e.durationMs),
    durationMs: e.durationMs,
    timedOut,
  };
  saveAttempts([...before, attempt]);
  clearActive();
  if (!submitted.has(e.id)) {
    submitted.add(e.id);
    e.ids.forEach((id, i) => {
      const choice = e.answers[i];
      if (choice === null) return;
      addEvent({
        id: newId(),
        t: now + i, // keeps the exam order in the log
        q: id,
        choice,
        correct: choice === QUESTIONS_BY_ID[id].answer,
        ms: Math.round(e.ms[i]),
        hint: 0,
        mode: 'exam',
      });
    });
  }
  return attempt;
}

export function clock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
