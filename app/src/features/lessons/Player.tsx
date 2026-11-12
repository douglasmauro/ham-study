import { useEffect, useRef, useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import { useGlossaryArt } from '../../ui/GlossaryArt';
import { Icon } from '../../ui/Icon';
import { CLIPS } from '../clips/items';
import { LESSON_CLIPS } from '../clips/lessonClips';
import { ClipPlayer } from '../clips/Player';
import type { FeatureProps } from '../types';
import { CardView, Footer, Say, type Nav } from './Card';
import type { CardStep, CheckStep, ClipStep, Lesson, RecapStep } from './types';
import './lessons.css';

/* ---------- where the learner is, kept for this browser tab ---------- */

interface Pos {
  step: number;
  max: number; // furthest step reached
  fast: boolean; // took "I already know this"
  score: number | null; // first-try score of the last finished check
}
const key = (id: string) => `ls-pos-${id}`;
function loadPos(lesson: Lesson): Pos {
  try {
    const p = JSON.parse(sessionStorage.getItem(key(lesson.id)) ?? 'null') as Pos | null;
    if (p && Number.isInteger(p.step) && p.step >= 0 && p.step < lesson.steps.length) {
      return { step: p.step, max: Math.max(p.step, p.max | 0), fast: !!p.fast, score: typeof p.score === 'number' ? p.score : null };
    }
  } catch { /* no storage: start from the top */ }
  return { step: 0, max: 0, fast: false, score: null };
}
function savePos(id: string, p: Pos | null) {
  try {
    if (p) sessionStorage.setItem(key(id), JSON.stringify(p));
    else sessionStorage.removeItem(key(id));
  } catch { /* ignore */ }
}

/* ---------- clip step ---------- */

function ClipView({ step, nav }: { step: ClipStep; nav: Nav }) {
  const clip = CLIPS.find((c) => c.data.id === step.clip) ?? LESSON_CLIPS.find((c) => c.data.id === step.clip);
  const wrap = useRef<HTMLDivElement>(null);
  const [ended, setEnded] = useState(false);
  // The clip player shows "Play again" on its play button once the last line has been said.
  // That is the only outside sign that the clip is over, so watch for it.
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof MutationObserver !== 'function') return;
    const look = () => { if (el.querySelector('.clip-play[aria-label="Play again"]')) setEnded(true); };
    const mo = new MutationObserver(look);
    mo.observe(el, { subtree: true, attributes: true, attributeFilter: ['aria-label'] });
    return () => mo.disconnect();
  }, []);
  if (!clip) return <Footer nav={nav} />;
  return (
    <>
      {step.intro && <p class="ls-p ls-intro">{step.intro}</p>}
      <div class="ls-clip" ref={wrap}>
        <ClipPlayer clips={[clip]} onDone={nav.next} />
      </div>
      <Footer nav={nav} label={ended || nav.revisit ? 'Continue' : 'Skip clip'} />
    </>
  );
}

/* ---------- check step ---------- */

function CheckView({ step, fast, ideaOf, nav, onScore, onReview, onFinish }: {
  step: CheckStep;
  fast: boolean;
  ideaOf: (stepId: string) => string;
  nav: Nav;
  onScore: (score: number) => void; // normal path: on to the recap
  onReview: () => void; // fast path, something missed: back to the first card
  onFinish: (score: number) => void; // fast path, all right: the lesson is done
}) {
  const [n, setN] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [missed, setMissed] = useState<number[]>([]); // questions not right on the first try
  const [over, setOver] = useState(false);
  const total = step.questions.length;
  const q = step.questions[n];
  const score = total - missed.length;

  const pick = (i: number) => {
    if (solved) return;
    setLast(i);
    if (q.choices[i].right) setSolved(true);
    else {
      if (!wrong.includes(i)) setWrong([...wrong, i]);
      if (!missed.includes(n)) setMissed([...missed, n]);
    }
  };
  const next = () => {
    if (n < total - 1) {
      setN(n + 1);
      setWrong([]);
      setLast(null);
      setSolved(false);
    } else if (!fast) onScore(score);
    else if (!missed.length) onFinish(score);
    else setOver(true);
  };

  if (over) {
    const ideas = [...new Set(missed.map((i) => ideaOf(step.questions[i].review)))];
    return (
      <>
        <h2 class="ls-h">{score} of {total} right on the first try</h2>
        <p class="ls-p">Close, but the lesson is worth a few minutes. Look out for {ideas.length === 1 ? 'this idea' : 'these ideas'}:</p>
        <ul class="ls-review">
          {ideas.map((t) => <li><Icon name="bulb" size={20} color="var(--accent)" /><span>{t}</span></li>)}
        </ul>
        <Footer nav={{ ...nav, back: undefined }} label="Go through the lesson" onNext={onReview} />
      </>
    );
  }

  const said = last === null ? null : q.choices[last];
  const lastQ = n === total - 1;
  return (
    <>
      <div class="ls-check-head">
        <span class="ls-kicker">Check yourself</span>
        <span class="ls-count">Question {n + 1} of {total}</span>
      </div>
      <h2 class="ls-h ls-q">{q.q}</h2>
      <div class="ls-options">
        {q.choices.map((c, i) => {
          const state = solved && c.right ? 'right' : wrong.includes(i) ? 'wrong' : '';
          return (
            <button type="button" class={`choice ${state}${solved && !c.right ? ' dim' : ''}`} disabled={solved} onClick={() => pick(i)}>
              <span class="letter">{'ABCD'[i]}</span>
              <span class="ls-grow">{c.label}</span>
              {state && <span class="tag">{state === 'right' ? 'Right' : 'No'}</span>}
            </button>
          );
        })}
      </div>
      {said && <Say tone={said.right ? 'good' : 'bad'}>{said.why}</Say>}
      {said && !said.right && <span class="ls-note">Try again. This idea is on the card "{ideaOf(q.review)}".</span>}
      <Footer nav={nav} locked={!solved} note="Pick an answer to continue."
        label={!lastQ ? 'Next question' : !fast ? 'See the recap' : missed.length ? 'See how you did' : 'Finish lesson'} onNext={next} />
    </>
  );
}

/* ---------- recap step ---------- */

function RecapView({ step, score, total, nav, onFinish }: { step: RecapStep; score: number | null; total: number; nav: Nav; onFinish: () => void }) {
  return (
    <>
      <div class="ls-check-head">
        <span class="ls-kicker">Recap</span>
        {score !== null && <span class="ls-count">Check: {score} of {total} first try</span>}
      </div>
      <h2 class="ls-h">{step.facts.length} facts to remember</h2>
      <ul class="ls-facts">
        {step.facts.map((f) => (
          <li>
            <span class="ls-fact-icon"><f.icon /></span>
            <span class="ls-fact-text">
              <span>{f.text}</span>
              <span class="ls-ids">{f.covers.join(' · ')}</span>
            </span>
          </li>
        ))}
      </ul>
      <Footer nav={nav} label="Finish lesson" onNext={onFinish} />
    </>
  );
}

/* ---------- the player ---------- */

export function LessonPlayer({ lesson, onDone }: { lesson: Lesson } & FeatureProps) {
  const [pos, setPosState] = useState<Pos>(() => loadPos(lesson));
  const topic = TOPICS[lesson.sub];
  const steps = lesson.steps;
  const checkAt = steps.findIndex((s) => s.type === 'check');
  const firstCard = Math.max(0, steps.findIndex((s) => s.type === 'card'));
  const total = checkAt >= 0 ? (steps[checkAt] as CheckStep).questions.length : 0;
  const done = useRef(false);
  useGlossaryArt(); // start loading the drawings now, so they are ready when the first card opens

  const setPos = (p: Pos) => {
    savePos(lesson.id, p);
    setPosState(p);
    window.scrollTo(0, 0);
  };
  const go = (i: number, extra: Partial<Pos> = {}) => setPos({ ...pos, step: i, max: Math.max(pos.max, i), ...extra });
  const finish = (score: number | null) => {
    if (done.current) return;
    done.current = true;
    savePos(lesson.id, null);
    onDone(score === null ? undefined : { score, total });
  };

  const i = pos.step;
  const step = steps[i];
  const nav: Nav = {
    next: () => (i < steps.length - 1 ? go(i + 1) : finish(pos.score)),
    back: i > 0 ? () => (pos.fast ? go(0, { fast: false }) : go(i - 1)) : undefined,
    revisit: i < pos.max,
  };
  const ideaOf = (id: string) => (steps.find((s) => s.id === id && s.type === 'card') as CardStep | undefined)?.idea ?? lesson.title;

  return (
    <div class="screen ls-screen" style={{ '--ls-topic': topic?.color ?? 'var(--accent)' }}>
      <div class="topbar">
        <a class="iconbtn" href="#/learn/lessons" aria-label="Back"><Icon name="back" /></a>
        <div class="stack" style={{ gap: '2px' }}>
          <span class="sub" style={{ color: topic?.color }}>{lesson.sub} · {topic?.name} · Lesson</span>
          <h1>{lesson.title}</h1>
        </div>
      </div>
      <div class="ls-progress" role="img" aria-label={`Step ${i + 1} of ${steps.length}`}>
        {steps.map((_, k) => <i class={k < i ? 'done' : k === i ? 'now' : ''} />)}
      </div>

      <div class="ls-step-body" key={`${i}-${pos.fast}`}>
        {step.type === 'clip' && <ClipView step={step} nav={nav} />}
        {step.type === 'card' && <CardView step={step} sub={lesson.sub} nav={nav} />}
        {step.type === 'check' && (
          <CheckView step={step} fast={pos.fast} ideaOf={ideaOf} nav={nav}
            onScore={(score) => go(i + 1, { score })}
            onReview={() => go(firstCard, { fast: false, max: firstCard })}
            onFinish={(score) => finish(score)} />
        )}
        {step.type === 'recap' && <RecapView step={step} score={pos.score} total={total} nav={nav} onFinish={() => finish(pos.score)} />}
        {i === 0 && checkAt > 0 && (
          <button type="button" class="ls-link" onClick={() => go(checkAt, { fast: true })}>I already know this. Take me to the check.</button>
        )}
      </div>
    </div>
  );
}
