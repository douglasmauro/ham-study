import { lazy, Suspense } from 'preact/compat';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { canShuffleChoices, shuffle, seededRng, type Mode } from '../lib/engine';
import { explanationFor } from '../lib/explain';
import { groupTitle, topicOf, type Question } from '../lib/pool';
import { KeyTerms } from './GlossaryArt';
import { Icon } from './Icon';

const WorkedSteps = lazy(() => import('../features/worked'));

export interface AnswerResult {
  choice: number; // original index
  correct: boolean;
  ms: number;
  hint: 0 | 1 | 2;
}

interface Props {
  q: Question;
  mode: Mode;
  index: number;
  total: number;
  hintDelaySec: number;
  sound: boolean;
  onAnswer: (r: AnswerResult) => string; // returns the stored event id
  onGuess: (eventId: string, guess: boolean) => void;
  onNext: () => void;
  onQuit: () => void;
}

let audio: AudioContext | null = null;
function tone(ok: boolean) {
  try {
    audio ||= new AudioContext();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = 'sine';
    o.frequency.value = ok ? 880 : 220;
    g.gain.setValueAtTime(0.0001, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + (ok ? 0.25 : 0.35));
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.4);
  } catch {
    // Audio unavailable: silent is fine.
  }
}

export function QuestionCard(p: Props) {
  const { q, mode } = p;
  const exam = mode === 'exam';
  const exp = explanationFor(q.id);
  const topic = topicOf(q.id);

  const order = useMemo(() => {
    const idx = [0, 1, 2, 3];
    return canShuffleChoices(q) ? shuffle(idx, seededRng(Date.now() ^ q.id.length * 7919)) : idx;
  }, [q.id]);

  const [picked, setPicked] = useState<number | null>(null);
  const [hintStep, setHintStep] = useState<0 | 1 | 2>(0);
  const [hintReady, setHintReady] = useState(false);
  const [eliminated, setEliminated] = useState<number | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [guess, setGuess] = useState(false);
  const start = useRef(Date.now());
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPicked(null);
    setHintStep(0);
    setHintReady(false);
    setEliminated(null);
    setEventId(null);
    setGuess(false);
    start.current = Date.now();
    top.current?.scrollIntoView({ block: 'start' });
    if (exam) return;
    const t = setTimeout(() => setHintReady(true), p.hintDelaySec * 1000);
    return () => clearTimeout(t);
  }, [q.id]);

  const answered = picked !== null;

  function pick(choice: number) {
    if (answered || choice === eliminated) return;
    const correct = choice === q.answer;
    const id = p.onAnswer({ choice, correct, ms: Date.now() - start.current, hint: hintStep });
    if (exam) {
      p.onNext();
      return;
    }
    if (p.sound) tone(correct);
    setPicked(choice);
    setEventId(id);
  }

  function nextHint() {
    if (hintStep === 0) setHintStep(1);
    else if (hintStep === 1) {
      const wrong = [0, 1, 2, 3].filter((i) => i !== q.answer);
      setEliminated(wrong[Math.floor(Math.random() * wrong.length)]);
      setHintStep(2);
    }
  }

  const letters = 'ABCD';
  const verdictOrder = answered ? [picked!, ...order.filter((i) => i !== picked)] : [];

  return (
    <div class="stack" ref={top}>
      <div class="progress">
        <button class="iconbtn" aria-label="Quit this session" onClick={p.onQuit}><Icon name="back" /></button>
        <div class="bar grow" aria-hidden="true"><div style={{ width: `${(p.index / p.total) * 100}%`, background: 'var(--accent)' }} /></div>
        <span class="small muted" style={{ fontWeight: 600 }}>{p.index + 1} / {p.total}</span>
      </div>
      <div class="row" style={{ flexWrap: 'wrap', gap: '8px' }}>
        <span class="chip" style={{ color: topic.color }}><span class="dot" style={{ background: topic.color }} />{q.group} · {topic.name}</span>
        <span class="small muted">{q.id}</span>
      </div>

      <p class="qtext">{q.question}</p>
      {q.figure && (
        <div class="figure"><img src={`./figures/${q.figure}.png`} alt={`Figure ${q.figure} from the official question pool`} /></div>
      )}

      <div class="choices">
        {order.map((ci, pos) => {
          let cls = 'choice';
          let tag = '';
          if (answered) {
            if (ci === q.answer) { cls += ' right'; tag = 'Correct'; }
            else if (ci === picked) { cls += ' wrong'; tag = 'Your pick'; }
            else cls += ' dim';
          } else if (ci === eliminated) {
            cls += ' out';
            tag = 'Not this';
          }
          return (
            <button class={cls} disabled={answered || ci === eliminated} onClick={() => pick(ci)}>
              <span class="letter">{letters[pos]}</span>
              <span>{q.choices[ci]}</span>
              {tag && <span class="tag">{tag}</span>}
            </button>
          );
        })}
      </div>

      {!exam && !answered && hintStep < 2 && hintReady && (
        <button class="hintbtn" onClick={nextHint}><Icon name="bulb" size={18} />{hintStep === 0 ? 'Need a hint?' : 'Narrow it down'}</button>
      )}

      {!exam && !answered && hintStep >= 1 && (
        <div class="hintcard">
          <span class="label">Hint</span>
          <span>{exp?.hint ?? `This question is about: ${groupTitle(q.group)}.`}</span>
          {hintStep === 2 && eliminated !== null && (
            <span class="muted small">
              Ruled out: “{q.choices[eliminated]}”{exp?.why?.[eliminated] ? ` — ${exp.why[eliminated]}` : ''}
            </span>
          )}
        </div>
      )}

      {answered && (
        <div class="card stack">
          <p class="result-title" style={{ color: picked === q.answer ? 'var(--good)' : 'var(--bad)' }}>
            {picked === q.answer ? (hintStep > 0 ? 'Correct, with a hint' : 'Correct!') : 'Not quite'}
          </p>
          {exp?.concept && <p style={{ margin: 0, lineHeight: 1.45 }}>{exp.concept}</p>}
          <div class="verdicts">
            {verdictOrder.map((ci) => {
              const ok = ci === q.answer;
              // When the answer is "All these choices are correct", the other three are true statements.
              const alsoTrue = !ok && /^all (of )?these choices are correct/i.test(q.choices[q.answer]);
              return (
                <div class={`verdict${ci === picked ? ' mine' : ''}`}>
                  <span class="vlabel" style={{ color: ok ? 'var(--good)' : alsoTrue ? 'var(--accent)' : 'var(--bad)' }}>{ok ? 'Correct' : alsoTrue ? 'Also true' : 'Not this'}</span>
                  <div class="stack" style={{ gap: '2px' }}>
                    <span style={{ fontWeight: 600 }}>{q.choices[ci]}</span>
                    {exp?.why?.[ci] && <span class="small" style={{ color: 'var(--text-2)', lineHeight: 1.4 }}>{exp.why[ci]}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <KeyTerms qid={q.id} />
          <Suspense fallback={null}><WorkedSteps q={q} /></Suspense>
          {q.refs && <span class="small muted">FCC rule reference: §{q.refs}</span>}
          <div class="row between" style={{ flexWrap: 'wrap' }}>
            {picked === q.answer && hintStep === 0 ? (
              <button class={`toggle${guess ? ' on' : ''}`} aria-pressed={guess}
                onClick={() => { const g = !guess; setGuess(g); if (eventId) p.onGuess(eventId, g); }}>
                {guess ? '✓ ' : ''}I guessed
              </button>
            ) : <span />}
            <button class="btn primary" onClick={p.onNext}>Next<Icon name="chevron" size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
