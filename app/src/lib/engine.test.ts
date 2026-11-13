import { describe, expect, it } from 'vitest';
import {
  applyEvent, buildDrill, buildExam, buildStates, canShuffleChoices, DAY, groupP,
  isSettled, passProbability, pCorrect, seededRng, streak, type AnswerEvent,
} from './engine';
import { explanationFor } from './explain';
import { ALL_GROUPS, POOL, QUESTIONS_BY_GROUP, QUESTIONS_BY_ID } from './pool';

const T0 = Date.UTC(2026, 10, 12, 15);
let n = 0;
const ev = (q: string, correct: boolean, t: number, extra: Partial<AnswerEvent> = {}): AnswerEvent => ({
  id: `e${n++}`, t, q, choice: correct ? QUESTIONS_BY_ID[q].answer : (QUESTIONS_BY_ID[q].answer + 1) % 4,
  correct, ms: 5000, hint: 0, mode: 'drill', ...extra,
});

describe('pool data', () => {
  it('matches the official exam structure', () => {
    expect(POOL.questions).toHaveLength(409);
    expect(ALL_GROUPS).toHaveLength(35);
    expect(POOL.pool.examQuestions).toBe(35);
    expect(POOL.pool.passMark).toBe(26);
    for (const q of POOL.questions) {
      expect(q.choices).toHaveLength(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
    }
  });
  it('kept the formulas and errata', () => {
    expect(QUESTIONS_BY_ID.T5D01.choices[QUESTIONS_BY_ID.T5D01.answer]).toBe('I = E / R');
    expect(QUESTIONS_BY_ID.T1C01.question).toBe(
      'For which classes of amateur radio licenses does the FCC currently issue new licenses?',
    );
    expect(POOL.questions.some((q) => q.choices.includes('P = I² x E'))).toBe(true);
  });
});

describe('explanations', () => {
  it('cover every question with a concept, a hint and four reasons', () => {
    for (const q of POOL.questions) {
      const e = explanationFor(q.id);
      expect(e?.concept, q.id).toBeTruthy();
      expect(e?.hint, q.id).toBeTruthy();
      expect(e?.why, q.id).toHaveLength(4);
    }
  });
});

describe('spaced repetition', () => {
  it('stretches intervals on clean answers and resets on a miss', () => {
    let s = applyEvent(undefined, ev('T1A01', true, T0));
    expect(s.box).toBe(1);
    expect(s.due).toBe(T0 + DAY);
    s = applyEvent(s, ev('T1A01', true, T0 + DAY));
    expect(s.box).toBe(2);
    expect(s.due).toBe(T0 + DAY + 3 * DAY);
    s = applyEvent(s, ev('T1A01', false, T0 + 5 * DAY));
    expect(s.box).toBe(0);
    expect(s.due - (T0 + 5 * DAY)).toBe(10 * 60_000);
    expect(s.wrongChoices).toHaveLength(1);
  });
  it('treats hinted or guessed answers as half-learned', () => {
    const s = applyEvent(undefined, ev('T1A01', true, T0, { hint: 1 }));
    expect(s.box).toBe(1);
    expect(s.recent).toEqual([false]);
    const g = applyEvent(undefined, ev('T1A01', true, T0, { guess: true }));
    expect(g.recent).toEqual([false]);
  });
});

describe('readiness', () => {
  it('is near zero for a blank slate and near one when everything is mastered', () => {
    const blank = ALL_GROUPS.map((g) => groupP(QUESTIONS_BY_GROUP[g.id], {}));
    expect(passProbability(blank, 26)).toBeLessThan(0.001);
    const events: AnswerEvent[] = [];
    POOL.questions.forEach((q) => {
      for (let i = 0; i < 4; i++) events.push(ev(q.id, true, T0 + i * 10 * DAY));
    });
    const states = buildStates(events);
    const ps = ALL_GROUPS.map((g) => groupP(QUESTIONS_BY_GROUP[g.id], states));
    expect(passProbability(ps, 26)).toBeGreaterThan(0.99);
  });
  it('computes an exact Poisson-binomial tail', () => {
    expect(passProbability([0.5, 0.5], 1)).toBeCloseTo(0.75);
    expect(passProbability([1, 1, 0], 2)).toBeCloseTo(1);
  });
  it('gives unseen questions guessing odds', () => {
    expect(pCorrect(undefined)).toBe(0.25);
  });
});

describe('sessions', () => {
  it('builds a drill of the requested size with new questions spread across groups', () => {
    const ids = buildDrill(POOL.questions, {}, T0, { size: 20, newCount: 12, rng: seededRng(1) });
    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
    expect(new Set(ids.map((id) => id.slice(0, 3))).size).toBe(20);
  });
  it('puts due reviews in the drill', () => {
    const states = buildStates([ev('T5D01', false, T0 - DAY)]);
    const ids = buildDrill(POOL.questions, states, T0, { size: 10, newCount: 5, rng: seededRng(2) });
    expect(ids).toContain('T5D01');
  });
  it('builds an exam with exactly one question per group', () => {
    const ids = buildExam(ALL_GROUPS, QUESTIONS_BY_GROUP, seededRng(3));
    expect(ids).toHaveLength(35);
    expect(new Set(ids.map((id) => id.slice(0, 3))).size).toBe(35);
  });
  it('never shuffles "all of these" style choices', () => {
    const q = POOL.questions.find((x) => x.choices.some((c) => /All these choices/i.test(c)))!;
    expect(canShuffleChoices(q)).toBe(false);
    expect(canShuffleChoices(QUESTIONS_BY_ID.T5D01)).toBe(true);
  });
});

describe('streaks', () => {
  it('counts consecutive days that met the goal', () => {
    const events = [0, 1, 2].flatMap((d) =>
      Array.from({ length: 10 }, (_, i) => ev('T1A01', true, T0 - d * DAY + i)),
    );
    expect(streak(events, T0, 10)).toBe(3);
    expect(streak(events, T0 + DAY, 10)).toBe(3);
    expect(streak(events, T0 + 2 * DAY, 10)).toBe(0);
  });
});

describe('settled questions', () => {
  it('are settled after two clean right answers in a row, and unsettled by a miss', () => {
    const s1 = buildStates([ev('T3B05', false, T0), ev('T3B05', true, T0 + 1), ev('T3B05', true, T0 + 2)]);
    expect(isSettled(s1.T3B05)).toBe(true);
    const s2 = buildStates([ev('T3B05', true, T0), ev('T3B05', true, T0 + 1), ev('T3B05', false, T0 + 2)]);
    expect(isSettled(s2.T3B05)).toBe(false);
    const s3 = buildStates([ev('T3B05', true, T0), ev('T3B05', true, T0 + 1, { hint: 1 })]);
    expect(isSettled(s3.T3B05)).toBe(false);
  });
  it('are not used to top up a short drill', () => {
    const qs = QUESTIONS_BY_GROUP.T3B;
    // Every question seen; one settled, the rest missed once and not due yet.
    const events = qs.flatMap((q, i) => (i === 0
      ? [ev(q.id, true, T0), ev(q.id, true, T0 + 1)]
      : [ev(q.id, false, T0 + 2)]));
    const states = buildStates(events);
    const ids = buildDrill(qs, states, T0 + 3, { size: qs.length, newCount: 0, rng: seededRng(1) });
    expect(ids).not.toContain(qs[0].id);
    expect(ids.length).toBe(qs.length - 1);
  });
});
