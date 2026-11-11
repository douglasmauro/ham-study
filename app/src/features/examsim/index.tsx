import { useEffect, useRef, useState } from 'preact/hooks';
import { explanationFor } from '../../lib/explain';
import { ALL_GROUPS, POOL, QUESTIONS_BY_ID, TOPICS, topicOf } from '../../lib/pool';
import { Icon } from '../../ui/Icon';
import './examsim.css';
import {
  clearActive, clock, DEFAULT_MINUTES, finishExam, loadActive, loadAttempts, MINUTE_OPTIONS, newExam, saveActive,
  type ActiveExam, type Attempt,
} from './state';

const LETTERS = 'ABCD';

type View =
  | { k: 'start' }
  | { k: 'exam'; exam: ActiveExam }
  | { k: 'report'; attempt: Attempt; fresh: boolean };

export default function ExamSim() {
  const [view, setView] = useState<View>({ k: 'start' });

  if (view.k === 'exam') {
    return (
      <Exam
        initial={view.exam}
        onPause={() => setView({ k: 'start' })}
        onFinish={(e, timedOut) => setView({ k: 'report', attempt: finishExam(e, timedOut), fresh: true })}
      />
    );
  }
  if (view.k === 'report') {
    return (
      <Report
        attempt={view.attempt}
        fresh={view.fresh}
        onBack={() => setView({ k: 'start' })}
        onOpen={(a) => setView({ k: 'report', attempt: a, fresh: false })}
      />
    );
  }
  return (
    <Start
      onBegin={(exam) => {
        saveActive(exam);
        setView({ k: 'exam', exam });
      }}
      onOpen={(a) => setView({ k: 'report', attempt: a, fresh: false })}
    />
  );
}

function FlagIcon({ size = 18, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 21V4" />
      <path d="M6 4h11l-2.5 4l2.5 4H6" fill={filled ? 'currentColor' : 'none'} />
    </svg>
  );
}

function useTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}

// ---------- start ----------

function Start({ onBegin, onOpen }: { onBegin: (e: ActiveExam) => void; onOpen: (a: Attempt) => void }) {
  const [active, setActive] = useState(() => loadActive());
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [attempts] = useState(() => loadAttempts());
  useTopOnMount();
  const { examQuestions, passMark } = POOL.pool;
  const groups = ALL_GROUPS.length;
  const answered = active ? active.answers.filter((a) => a !== null).length : 0;

  const facts = [
    `${examQuestions} multiple-choice questions, one drawn from each of the ${groups} question groups.`,
    `${passMark} correct answers to pass. You can miss ${examQuestions - passMark}.`,
    'Official wording, with choices in the official A, B, C, D order.',
    'No hints, and no feedback until you submit.',
    'You can skip, flag a question, go back and change any answer before you submit.',
  ];

  return (
    <div class="screen">
      <div class="topbar">
        <a class="iconbtn" href="#/learn" aria-label="Back"><Icon name="back" /></a>
        <div><div class="sub">Exam day</div><h1>Exam simulation</h1></div>
      </div>

      {active && (
        <div class="card stack examsim-resume">
          <h2>Exam in progress</h2>
          <span>
            You answered {answered} of {active.ids.length} and have {clock(active.durationMs - active.usedMs)} left.
            The clock stopped while you were away.
          </span>
          <button class="btn primary block" onClick={() => onBegin(active)}>Resume exam</button>
          <button
            class="examsim-textbtn"
            onClick={() => {
              if (confirm('Discard the exam in progress? Its answers will not be scored or saved.')) {
                clearActive();
                setActive(null);
              }
            }}
          >
            Discard it
          </button>
        </div>
      )}

      <div class="card stack">
        <h2>What to expect</h2>
        <ul class="examsim-list">
          {facts.map((f) => (
            <li><Icon name="check" size={18} color="var(--accent)" /><span>{f}</span></li>
          ))}
        </ul>
      </div>

      {!active && (
        <div class="card stack">
          <h2>Timer</h2>
          <div class="examsim-opts" role="group" aria-label="Time limit">
            {MINUTE_OPTIONS.map((m) => (
              <button class="examsim-opt" aria-pressed={m === minutes} onClick={() => setMinutes(m)}>{m} minutes</button>
            ))}
          </div>
          <span class="small muted">
            Real exam sessions are not tightly timed. The timer is here for practice, and the exam is submitted when it reaches zero.
          </span>
        </div>
      )}

      {!active && (
        <button class="btn primary block" onClick={() => onBegin(newExam(minutes))}>
          <Icon name="exam" size={20} />Start the exam
        </button>
      )}

      <PastScores attempts={attempts} onOpen={onOpen} />
    </div>
  );
}

function PastScores({ attempts, onOpen, currentId }: { attempts: Attempt[]; onOpen: (a: Attempt) => void; currentId?: string }) {
  if (!attempts.length) {
    return <div class="card muted">No simulations finished yet. Your scores will be listed here so you can see the trend.</div>;
  }
  const recent = attempts.slice(-12);
  const last = recent[recent.length - 1];
  const fmt = (t: number) => new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ', ' + new Date(t).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return (
    <div class="card stack">
      <h2>Past simulations</h2>
      {recent.length > 1 && (
        <>
          <div class="examsim-trend" role="img"
            aria-label={`Scores of the last ${recent.length} simulations, oldest first: ${recent.map((a) => `${a.score} of ${a.total}`).join(', ')}`}>
            <span class="line" style={{ bottom: `${(last.passMark / last.total) * 100}%` }} />
            {recent.map((a) => (
              <span class={`b ${a.score >= a.passMark ? 'pass' : 'fail'}`} style={{ height: `${(a.score / a.total) * 100}%` }} />
            ))}
          </div>
          <span class="small muted">Oldest on the left. The dashed line is the pass mark, {last.passMark}.</span>
        </>
      )}
      {attempts.slice().reverse().slice(0, 20).map((a) => {
        const passed = a.score >= a.passMark;
        return (
          <button class="examsim-past" onClick={() => onOpen(a)} aria-label={`${fmt(a.t)}, ${a.score} of ${a.total}, ${passed ? 'pass' : 'not yet'}. Open the report`}>
            <span>{fmt(a.t)}{a.id === currentId ? ' · this one' : ''}</span>
            <span class="s">{a.score} / {a.total}</span>
            <span class={`v ${passed ? 'pass' : 'fail'}`}>{passed ? 'PASS' : 'Not yet'}</span>
            <Icon name="chevron" size={18} color="var(--muted)" />
          </button>
        );
      })}
    </div>
  );
}

// ---------- the exam ----------

function Exam({ initial, onPause, onFinish }: {
  initial: ActiveExam;
  onPause: () => void;
  onFinish: (e: ActiveExam, timedOut: boolean) => void;
}) {
  const [exam, setExam] = useState(initial);
  const [sheet, setSheet] = useState<null | 'grid' | 'submit'>(null);
  const done = useRef(false);
  const total = exam.ids.length;
  const i = exam.cur;
  const q = QUESTIONS_BY_ID[exam.ids[i]];
  const left = exam.durationMs - exam.usedMs;

  // The clock runs only while the exam is on screen, so leaving never costs time.
  // Time is charged to the question being shown, on every tick and on every move.
  const last = useRef(Date.now());
  const charge = (e: ActiveExam): ActiveExam => {
    const now = Date.now();
    const d = document.hidden ? 0 : Math.min(now - last.current, 2000);
    last.current = now;
    return d > 0 ? { ...e, usedMs: e.usedMs + d, ms: e.ms.map((m, k) => (k === e.cur ? m + d : m)) } : e;
  };
  useEffect(() => {
    const id = setInterval(() => setExam(charge), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (done.current) return;
    saveActive(exam);
    if (exam.usedMs >= exam.durationMs) {
      done.current = true;
      onFinish(exam, true);
    }
  }, [exam]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [i]);

  useEffect(() => {
    if (!sheet) return;
    const on = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setSheet(null);
    };
    addEventListener('keydown', on);
    return () => removeEventListener('keydown', on);
  }, [sheet]);

  const go = (n: number) => {
    setExam((e) => ({ ...charge(e), cur: Math.min(total - 1, Math.max(0, n)) }));
    setSheet(null);
  };
  const pick = (c: number | null) => setExam((e) => ({ ...e, answers: e.answers.map((a, k) => (k === e.cur ? c : a)) }));
  const toggleFlag = () => setExam((e) => ({ ...e, flags: e.flags.map((f, k) => (k === e.cur ? !f : f)) }));
  const submit = () => {
    if (done.current) return;
    done.current = true;
    onFinish(charge(exam), false);
  };

  const unanswered = exam.answers.map((a, k) => (a === null ? k + 1 : 0)).filter(Boolean);
  const flagged = exam.flags.map((f, k) => (f ? k + 1 : 0)).filter(Boolean);
  const timerCls = left <= 60_000 ? ' last' : left <= 5 * 60_000 ? ' low' : '';

  const grid = (
    <>
      <div class="examsim-grid">
        {exam.ids.map((_, k) => {
          const a = exam.answers[k] !== null;
          const f = exam.flags[k];
          return (
            <button
              class={`examsim-tile${a ? ' answered' : ''}${k === i ? ' current' : ''}`}
              aria-current={k === i ? 'true' : undefined}
              aria-label={`Question ${k + 1}, ${a ? 'answered' : 'not answered'}${f ? ', flagged' : ''}`}
              onClick={() => go(k)}
            >
              {k + 1}
              {f && <span class="examsim-pin"><FlagIcon size={16} filled /></span>}
            </button>
          );
        })}
      </div>
      <div class="examsim-legend">
        <span><i class="answered" />Answered</span>
        <span><i />Not answered</span>
        <span style={{ color: 'var(--accent)' }}><FlagIcon size={16} filled /><span style={{ color: 'var(--text-2)' }}>Flagged</span></span>
        <span><i class="current" />You are here</span>
      </div>
    </>
  );

  return (
    <div class="screen examsim-screen">
      <div class="examsim-head">
        <button class="iconbtn" aria-label="Pause and leave the exam" onClick={onPause}><Icon name="back" /></button>
        <div class="grow">
          <div class="examsim-count">Question {i + 1} of {total}</div>
          <div class="small muted">{total - unanswered.length} answered{flagged.length ? ` · ${flagged.length} flagged` : ''}</div>
        </div>
        <div class={`examsim-timer${timerCls}`} role="timer" aria-label={`Time left ${clock(left)}`}>
          {clock(left)}<small>left</small>
        </div>
        <button class="iconbtn" aria-label="Show all questions" onClick={() => setSheet('grid')}><Icon name="grid" /></button>
      </div>

      <p class="qtext">{q.question}</p>
      {q.figure && (
        <div class="figure"><img src={`./figures/${q.figure}.png`} alt={`Figure ${q.figure} from the official question pool`} /></div>
      )}

      <div class="choices" role="radiogroup" aria-label="Answer choices">
        {q.choices.map((text, c) => {
          const on = exam.answers[i] === c;
          return (
            <button class={`choice examsim-choice${on ? ' picked' : ''}`} role="radio" aria-checked={on} onClick={() => pick(c)}>
              <span class="letter">{LETTERS[c]}</span>
              <span class="grow">{text}</span>
              {on && <span class="tag">Your answer</span>}
            </button>
          );
        })}
      </div>
      {exam.answers[i] !== null && (
        <button class="examsim-textbtn" onClick={() => pick(null)}>Clear my answer</button>
      )}

      <div class="examsim-foot">
        <button class="examsim-flag" aria-pressed={exam.flags[i]} onClick={toggleFlag}>
          <FlagIcon filled={exam.flags[i]} />{exam.flags[i] ? 'Flagged for review' : 'Flag for review'}
        </button>
        <div class="examsim-nav">
          <button class="btn secondary" disabled={i === 0} onClick={() => go(i - 1)}><Icon name="back" size={18} />Previous</button>
          {i < total - 1
            ? <button class="btn primary" onClick={() => go(i + 1)}>Next<Icon name="chevron" size={18} /></button>
            : <button class="btn primary" onClick={() => setSheet('submit')}>Submit exam</button>}
        </div>
      </div>

      {sheet === 'grid' && (
        <div class="examsim-overlay" onClick={(ev) => ev.target === ev.currentTarget && setSheet(null)}>
          <div class="examsim-sheet" role="dialog" aria-modal="true" aria-label="All questions">
            <div class="row between">
              <h2>All questions</h2>
              <button class="iconbtn" style={{ background: 'var(--raised)' }} aria-label="Close" onClick={() => setSheet(null)}><Icon name="x" /></button>
            </div>
            <span class="muted small">Tap a number to go to that question.</span>
            {grid}
            <button class="btn primary block" onClick={() => setSheet('submit')}>Submit exam</button>
          </div>
        </div>
      )}

      {sheet === 'submit' && (
        <div class="examsim-overlay" onClick={(ev) => ev.target === ev.currentTarget && setSheet(null)}>
          <div class="examsim-sheet" role="alertdialog" aria-modal="true" aria-label="Submit the exam?">
            <h2>Submit the exam?</h2>
            {unanswered.length > 0 ? (
              <div class="examsim-warn" style={{ borderLeftColor: 'var(--bad)' }}>
                <strong>{unanswered.length} {unanswered.length === 1 ? 'question is' : 'questions are'} not answered.</strong>{' '}
                An unanswered question counts as wrong, so a guess is better than a blank.
              </div>
            ) : (
              <span>All {total} questions are answered.</span>
            )}
            {flagged.length > 0 && (
              <div class="examsim-warn">
                {flagged.length} {flagged.length === 1 ? 'question is' : 'questions are'} still flagged for review.
              </div>
            )}
            <span class="muted small">You have {clock(left)} left. After you submit, answers cannot be changed.</span>
            {(unanswered.length > 0 || flagged.length > 0) && grid}
            <div class="examsim-nav">
              <button class="btn secondary" onClick={() => setSheet(null)}>Keep working</button>
              <button class="btn primary" onClick={submit}>Submit now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- score report ----------

function Report({ attempt, fresh, onBack, onOpen }: {
  attempt: Attempt;
  fresh: boolean;
  onBack: () => void;
  onOpen: (a: Attempt) => void;
}) {
  const [attempts] = useState(() => loadAttempts());
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [attempt.id]);
  const a = attempt;
  const passed = a.score >= a.passMark;
  const blanks = a.answers.filter((x) => x === null).length;
  const rows = a.ids.map((id, i) => ({ q: QUESTIONS_BY_ID[id], n: i + 1, choice: a.answers[i] })).filter((r) => r.q);
  const missed = rows.filter((r) => r.choice !== r.q.answer);
  const bySub = POOL.subelements.map((s) => {
    const rs = rows.filter((r) => r.q.sub === s.id);
    return { id: s.id, right: rs.filter((r) => r.choice === r.q.answer).length, total: rs.length };
  }).filter((s) => s.total > 0);

  return (
    <div class="screen">
      <div class="topbar">
        <button class="iconbtn" aria-label="Back to the exam simulation start" onClick={onBack}><Icon name="back" /></button>
        <div>
          <div class="sub">{fresh ? 'Exam submitted' : new Date(a.t).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <h1>Score report</h1>
        </div>
      </div>

      <div class="card stack" style={{ alignItems: 'center', textAlign: 'center' }}>
        <span class={`score-big ${passed ? 'pass' : 'fail'}`}>{a.score} / {a.total}</span>
        <span style={{ fontWeight: 700 }} class={passed ? 'pass' : 'fail'}>{passed ? 'PASS' : 'Not yet'} · {a.passMark} needed</span>
        <span class="muted">
          {passed
            ? a.score === a.total ? 'Every answer right.' : `${a.score - a.passMark} above the pass mark.`
            : `${a.passMark - a.score} more correct ${a.passMark - a.score === 1 ? 'answer' : 'answers'} to pass.`}
        </span>
        <div class="row" style={{ gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span class="chip">Time used {clock(a.usedMs)} of {clock(a.durationMs)}</span>
          {blanks > 0 && <span class="chip">{blanks} not answered</span>}
        </div>
        {a.timedOut && <span class="small" style={{ color: 'var(--accent)' }}>Time ran out, so the exam was submitted automatically.</span>}
      </div>

      <div class="card stack">
        <h2>By topic</h2>
        {bySub.map((s) => {
          const t = TOPICS[s.id];
          return (
            <div class="examsim-topicrow">
              <span class="dot" style={{ background: t.color }} />
              <span><span style={{ color: t.color, fontWeight: 700 }}>{s.id}</span> · {t.name}</span>
              <div class="bar" aria-hidden="true"><div style={{ width: `${(s.right / s.total) * 100}%`, background: t.color }} /></div>
              <span class="n" style={{ color: s.right === s.total ? 'var(--good)' : s.right === 0 ? 'var(--bad)' : 'var(--text)' }}>{s.right}/{s.total}</span>
            </div>
          );
        })}
      </div>

      {missed.length > 0 ? (
        <>
          <div class="card">
            <h2 style={{ margin: 0 }}>{missed.length} to look at again</h2>
          </div>
          {missed.map((r) => <Miss q={r.q} n={r.n} choice={r.choice} />)}
        </>
      ) : (
        <div class="card" style={{ color: 'var(--good)', fontWeight: 600 }}>Nothing missed. Every answer was right.</div>
      )}

      <div class="grid2">
        <a class="btn secondary" href="#/"><Icon name="home" size={18} />Home</a>
        <a class="btn primary" href={`#/examsim?${a.id}-${fresh ? 'n' : 'o'}`} onClick={onBack}>New simulation</a>
      </div>

      <PastScores attempts={attempts} onOpen={onOpen} currentId={a.id} />
    </div>
  );
}

function Miss({ q, n, choice }: { q: (typeof POOL.questions)[number]; n: number; choice: number | null }) {
  const exp = explanationFor(q.id);
  const topic = topicOf(q.id);
  return (
    <div class="examsim-miss">
      <div class="row" style={{ flexWrap: 'wrap', gap: '8px' }}>
        <span class="chip" style={{ color: topic.color }}><span class="dot" style={{ background: topic.color }} />Question {n} · {topic.name}</span>
        <span class="small muted">{q.id}</span>
      </div>
      <p class="q">{q.question}</p>
      {q.figure && (
        <div class="figure"><img src={`./figures/${q.figure}.png`} alt={`Figure ${q.figure} from the official question pool`} /></div>
      )}
      {choice === null ? (
        <div class="examsim-ans bad">
          <span class="lab">Your answer</span>
          <span style={{ fontWeight: 600 }}>Not answered</span>
        </div>
      ) : (
        <div class="examsim-ans bad">
          <span class="lab">Your answer · not this</span>
          <span style={{ fontWeight: 600 }}>{LETTERS[choice]}. {q.choices[choice]}</span>
          {exp?.why?.[choice] && <span class="why">{exp.why[choice]}</span>}
        </div>
      )}
      <div class="examsim-ans good">
        <span class="lab">Correct answer</span>
        <span style={{ fontWeight: 600 }}>{LETTERS[q.answer]}. {q.choices[q.answer]}</span>
        {exp?.why?.[q.answer] && <span class="why">{exp.why[q.answer]}</span>}
      </div>
      {exp?.concept && <p class="examsim-concept"><strong>The idea:</strong> {exp.concept}</p>}
    </div>
  );
}
