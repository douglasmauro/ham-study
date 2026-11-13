import { useState } from 'preact/hooks';
import { buildDrill, buildExam, DAY, isSettled, pCorrect, seededRng, type Mode } from '../lib/engine';
import { TERMS_BY_ID } from '../lib/glossary';
import { lockedGroups, nextLesson } from '../lib/lessons';
import { ALL_GROUPS, POOL, QUESTIONS_BY_GROUP, QUESTIONS_BY_ID, TOPICS, topicOf } from '../lib/pool';
import { computeStats } from '../lib/stats';
import { addEvent, getData, markGuess, newId } from '../lib/store';
import { Icon } from './Icon';
import { QuestionCard, type AnswerResult } from './QuestionCard';

export type SessionKind = 'drill' | 'topic' | 'group' | 'review' | 'notebook' | 'term' | 'exam';

interface Result {
  q: string;
  choice: number;
  correct: boolean;
}

function plan(kind: SessionKind, target: string | undefined): { ids: string[]; title: string } {
  const data = getData();
  const stats = computeStats(data);
  const now = Date.now();
  const rng = seededRng(now);
  switch (kind) {
    case 'exam':
      return { ids: buildExam(ALL_GROUPS, QUESTIONS_BY_GROUP, rng), title: 'Practice exam' };
    case 'topic': {
      const qs = POOL.questions.filter((q) => q.sub === target);
      return { ids: buildDrill(qs, stats.states, now, { size: 15, newCount: 8, rng }), title: `${target} · ${TOPICS[target!]?.name ?? ''}` };
    }
    case 'group': {
      const qs = QUESTIONS_BY_GROUP[target!] ?? [];
      return { ids: buildDrill(qs, stats.states, now, { size: Math.min(12, qs.length), newCount: 6, rng }), title: `Group ${target}` };
    }
    case 'review': {
      const since = now - 7 * DAY;
      const missed = [...new Set(data.events.filter((e) => !e.correct && e.t >= since).map((e) => e.q))]
        .filter((id) => !isSettled(stats.states[id]));
      return { ids: missed.slice(-20).reverse(), title: 'Review my misses' };
    }
    case 'term': {
      const term = TERMS_BY_ID[target ?? ''];
      const qs = term ? term.questions.map((id) => QUESTIONS_BY_ID[id]).filter(Boolean) : [];
      return { ids: buildDrill(qs, stats.states, now, { size: Math.min(12, qs.length), newCount: 12, rng }), title: term?.term ?? 'Term' };
    }
    case 'notebook': {
      // The picture notebook's entries: any question answered wrong, with a hint or as a guess,
      // and not yet mastered. Weakest first, up to 20 per session.
      const trouble = new Set(data.events.filter((e) => !e.correct || e.hint > 0 || e.guess).map((e) => e.q));
      const ids = [...trouble]
        .filter((id) => (stats.states[id]?.box ?? 0) < 3 && !isSettled(stats.states[id]))
        .sort((a, b) => pCorrect(stats.states[a]) - pCorrect(stats.states[b]));
      return { ids: ids.slice(0, 20), title: 'Notebook drill' };
    }
    default: {
      // Learn first: hold back new questions from groups whose lesson is not finished yet.
      const locked = lockedGroups(data);
      const open = POOL.questions.filter((q) => stats.states[q.id] || !locked.has(q.group));
      return {
        ids: buildDrill(open, stats.states, now, { size: data.settings.dailyGoal, newCount: stats.newToday, rng, pad: false }),
        title: "Today's drill",
      };
    }
  }
}

export function Session({ kind, target }: { kind: SessionKind; target?: string }) {
  const [{ ids: initial, title }] = useState(() => plan(kind, target));
  const [queue, setQueue] = useState<string[]>(initial);
  const [requeued] = useState(() => new Set<string>());
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [startReadiness] = useState(() => computeStats(getData()).readiness);
  const settings = getData().settings;
  const mode: Mode = kind === 'exam' ? 'exam' : kind === 'review' || kind === 'notebook' ? 'review' : 'drill';

  if (!queue.length && kind === 'drill') {
    return (
      <div class="screen">
        <div class="topbar"><a class="iconbtn" href="#/" aria-label="Home"><Icon name="back" /></a><h1>{title}</h1></div>
        <CaughtUp empty />
        <a class="btn secondary block" href="#/">Back home</a>
      </div>
    );
  }

  if (!queue.length) {
    return (
      <div class="screen">
        <div class="topbar"><a class="iconbtn" href="#/" aria-label="Home"><Icon name="back" /></a><h1>{title}</h1></div>
        <div class="card">{kind === 'review' ? 'No misses in the last 7 days. Nice work.' : 'Nothing to study here right now.'}</div>
      </div>
    );
  }

  if (index >= queue.length) {
    return kind === 'exam'
      ? <ExamReport results={results} />
      : <Summary title={title} results={results} startReadiness={startReadiness} caughtUp={kind === 'drill' && initial.length < settings.dailyGoal} />;
  }

  const q = QUESTIONS_BY_ID[queue[index]];

  function onAnswer(r: AnswerResult): string {
    const id = newId();
    addEvent({ id, t: Date.now(), q: q.id, choice: r.choice, correct: r.correct, ms: r.ms, hint: r.hint, mode });
    setResults((rs) => [...rs, { q: q.id, choice: r.choice, correct: r.correct }]);
    // A miss comes back a few questions later in the same session (once).
    if (!r.correct && mode !== 'exam' && !requeued.has(q.id)) {
      requeued.add(q.id);
      setQueue((qs) => {
        const at = Math.min(qs.length, index + 4);
        return [...qs.slice(0, at), q.id, ...qs.slice(at)];
      });
    }
    return id;
  }

  return (
    <div class="screen">
      <QuestionCard
        key={index}
        q={q}
        mode={mode}
        index={index}
        total={queue.length}
        hintDelaySec={settings.hintDelaySec}
        sound={settings.sound}
        onAnswer={onAnswer}
        onGuess={markGuess}
        onNext={() => setIndex((i) => i + 1)}
        onQuit={() => {
          if (!results.length || confirm('Leave this session? Answers so far are saved.')) location.hash = '#/';
        }}
      />
    </div>
  );
}

/** Shown when the daily drill has run out of material: nothing due and no new questions left. */
function CaughtUp({ empty }: { empty?: boolean }) {
  const lesson = nextLesson(getData());
  return (
    <div class="card stack" style={{ border: '2px solid var(--accent)', gap: '10px' }}>
      <h2 style={{ margin: 0 }}>{empty ? 'You are all caught up' : 'That is everything for now'}</h2>
      <span style={{ color: 'var(--text-2)', lineHeight: 1.45 }}>
        {lesson
          ? `You have practiced everything from the lessons you have finished. New questions unlock with your next lesson: ${lesson.title}.`
          : 'You have practiced everything due today. Questions come back for review as they come due.'}
      </span>
      {lesson && <a class="btn primary block" href={`#/do/lessons/${lesson.id}?${Date.now()}`}>Start the next lesson</a>}
    </div>
  );
}

function Summary({ title, results, startReadiness, caughtUp }: { title: string; results: Result[]; startReadiness: number; caughtUp?: boolean }) {
  const stats = computeStats(getData());
  const right = results.filter((r) => r.correct).length;
  const delta = Math.round((stats.readiness - startReadiness) * 100);
  return (
    <div class="screen">
      <div class="topbar"><h1>{title} done</h1></div>
      <div class="card stack" style={{ alignItems: 'center', textAlign: 'center' }}>
        <span class="score-big">{right} / {results.length}</span>
        <span class="muted">correct answers this session, including second tries</span>
        <div class="row" style={{ gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span class="chip"><Icon name="flame" size={16} color="var(--accent)" />{stats.streak}-day streak</span>
          <span class="chip">Readiness {Math.round(stats.readiness * 100)}% {delta !== 0 && <span style={{ color: delta > 0 ? 'var(--good)' : 'var(--bad)' }}>{delta > 0 ? `+${delta}` : delta}</span>}</span>
        </div>
      </div>
      {caughtUp && <CaughtUp />}
      <Misses results={results} />
      <a class={`btn ${caughtUp ? 'secondary' : 'primary'} block`} href="#/">Back home</a>
    </div>
  );
}

function Misses({ results }: { results: Result[] }) {
  const missed = [...new Map(results.filter((r) => !r.correct).map((r) => [r.q, r])).values()];
  if (!missed.length) return null;
  return (
    <div class="card stack">
      <h2>Worth another look</h2>
      {missed.map((r) => {
        const q = QUESTIONS_BY_ID[r.q];
        return (
          <div class="review-item">
            <span class="small muted">{q.id}</span>
            <span style={{ fontWeight: 600 }}>{q.question}</span>
            <span class="small" style={{ color: 'var(--good)' }}>Answer: {q.choices[q.answer]}</span>
            <span class="small" style={{ color: 'var(--bad)' }}>You picked: {q.choices[r.choice]}</span>
          </div>
        );
      })}
    </div>
  );
}

function ExamReport({ results }: { results: Result[] }) {
  const right = results.filter((r) => r.correct).length;
  const passed = right >= POOL.pool.passMark;
  const bySub = POOL.subelements.map((s) => {
    const rs = results.filter((r) => r.q.startsWith(s.id));
    return { id: s.id, right: rs.filter((r) => r.correct).length, total: rs.length };
  });
  return (
    <div class="screen">
      <div class="topbar"><h1>Practice exam result</h1></div>
      <div class="card stack" style={{ alignItems: 'center', textAlign: 'center' }}>
        <span class={`score-big ${passed ? 'pass' : 'fail'}`}>{right} / {results.length}</span>
        <span style={{ fontWeight: 700 }} class={passed ? 'pass' : 'fail'}>{passed ? 'PASS' : 'Not yet'} · {POOL.pool.passMark} needed</span>
      </div>
      <div class="card stack">
        <h2>By topic</h2>
        {bySub.map((s) => {
          const t = TOPICS[s.id];
          return (
            <div class="row">
              <span class="dot" style={{ background: t.color }} />
              <span class="grow">{s.id} · {t.name}</span>
              <span style={{ fontWeight: 700, color: s.right === s.total ? 'var(--good)' : s.right === 0 ? 'var(--bad)' : 'var(--text)' }}>{s.right}/{s.total}</span>
            </div>
          );
        })}
      </div>
      <Misses results={results} />
      <div class="grid2">
        <a class="btn secondary" href="#/">Home</a>
        <a class="btn primary" href={`#/exam?${Date.now()}`}>New exam</a>
      </div>
    </div>
  );
}

export function topicColor(id: string) {
  return topicOf(id).color;
}
