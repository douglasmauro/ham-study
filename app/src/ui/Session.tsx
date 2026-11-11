import { useState } from 'preact/hooks';
import { buildDrill, buildExam, DAY, seededRng, type Mode } from '../lib/engine';
import { ALL_GROUPS, POOL, QUESTIONS_BY_GROUP, QUESTIONS_BY_ID, TOPICS, topicOf } from '../lib/pool';
import { computeStats } from '../lib/stats';
import { addEvent, getData, markGuess, newId } from '../lib/store';
import { Icon } from './Icon';
import { QuestionCard, type AnswerResult } from './QuestionCard';

export type SessionKind = 'drill' | 'topic' | 'group' | 'review' | 'exam';

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
      const missed = [...new Set(data.events.filter((e) => !e.correct && e.t >= since).map((e) => e.q))];
      return { ids: missed.slice(-20).reverse(), title: 'Review my misses' };
    }
    default:
      return {
        ids: buildDrill(POOL.questions, stats.states, now, { size: data.settings.dailyGoal, newCount: stats.newToday, rng }),
        title: "Today's drill",
      };
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
  const mode: Mode = kind === 'exam' ? 'exam' : kind === 'review' ? 'review' : 'drill';

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
      : <Summary title={title} results={results} startReadiness={startReadiness} />;
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

function Summary({ title, results, startReadiness }: { title: string; results: Result[]; startReadiness: number }) {
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
      <Misses results={results} />
      <a class="btn primary block" href="#/">Back home</a>
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
