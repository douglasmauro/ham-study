import type { VNode } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { FeatureProps } from '../types';
import { Shell } from './Shell';

export interface TalkOption {
  text: string;
  ok?: boolean; // exactly one per pick
  why: string; // one line: why it is right, or why not
}
export type TalkStep =
  | { who: 'you' | 'them'; name: string; text: string }
  | { note: string } // narration between bubbles
  | { ask: string; name: string; pick: TalkOption[] };
export interface TalkStrip {
  sub: string;
  title: string;
  caption: string; // sets the scene
  art: () => VNode;
  steps: TalkStep[];
}

const isPick = (s: TalkStep): s is Extract<TalkStep, { pick: TalkOption[] }> => 'pick' in s;

function mix<T>(a: T[]): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A two-way contact as speech bubbles; the learner picks the right next line at each pick point. */
export function Talk({ strip, onDone }: FeatureProps & { strip: TalkStrip }) {
  const steps = strip.steps;
  const picks = useMemo(() => steps.map((s, i) => (isPick(s) ? i : -1)).filter((i) => i >= 0), [steps]);
  const options = useMemo(() => steps.map((s) => (isPick(s) ? mix(s.pick) : [])), [steps]);
  const nextStop = (from: number) => { const n = picks.find((p) => p >= from); return n === undefined ? steps.length : n; };
  const [at, setAt] = useState(() => nextStop(0)); // index of the open pick, or steps.length at the end
  const [solved, setSolved] = useState<Record<number, TalkOption>>({});
  const [wrong, setWrong] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const tail = useRef<HTMLDivElement>(null);
  const cur = at < steps.length ? steps[at] : null;
  const curSolved = solved[at];
  const done = Object.keys(solved).length;

  useEffect(() => {
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    tail.current?.scrollIntoView({ block: 'end', behavior: reduce ? 'auto' : 'smooth' });
  }, [at, curSolved, wrong.length]);

  function choose(o: TalkOption) {
    if (curSolved || wrong.includes(o.text)) return;
    if (o.ok) {
      if (!wrong.length) setScore(score + 1);
      setSolved({ ...solved, [at]: o });
    } else {
      setWrong([...wrong, o.text]);
    }
  }
  function go() {
    setWrong([]);
    setAt(nextStop(at + 1));
  }
  const atEnd = at >= steps.length;
  const finish = atEnd || (!!curSolved && at === steps.length - 1);

  return (
    <Shell sub={strip.sub} kind="Radio conversation" title={strip.title} step={done} total={picks.length}
      count={`${Math.min(done + 1, picks.length)} of ${picks.length}`}>
      <div class="cd-panel">
        {strip.art()}
        <p class="cd-caption">{strip.caption}</p>
      </div>
      <div class="cd-strip">
        {steps.slice(0, Math.min(at + 1, steps.length)).map((s, i) => {
          if ('note' in s) return <div class="cd-narr" key={i}>{s.note}</div>;
          if (isPick(s)) {
            const o = solved[i];
            if (!o) return null;
            return (
              <div class="cd-line cd-you" key={i}>
                <div class="cd-bubble">{o.text}</div>
                <span class="cd-who">{s.name}</span>
                <span class="cd-why">{o.why}</span>
              </div>
            );
          }
          return (
            <div class={`cd-line cd-${s.who}`} key={i}>
              <div class="cd-bubble">{s.text}</div>
              <span class="cd-who">{s.name}</span>
            </div>
          );
        })}
      </div>
      {cur && isPick(cur) && !curSolved && (
        <div class="cd-picker">
          <span class="cd-ask">{cur.ask}</span>
          {options[at].map((o) => {
            const bad = wrong.includes(o.text);
            return (
              <button type="button" class={`cd-opt${bad ? ' is-wrong' : ''}`} key={o.text} disabled={bad} onClick={() => choose(o)}>
                <span>{o.text}</span>
                {bad && <span class="cd-optwhy">Not this one. {o.why}</span>}
              </button>
            );
          })}
        </div>
      )}
      <div class="cd-actions" ref={tail}>
        {(curSolved || atEnd) && (
          <button type="button" class="btn primary"
            onClick={() => (finish ? onDone({ score, total: picks.length }) : go())}>
            {finish ? 'Finish' : 'Continue'}
          </button>
        )}
      </div>
    </Shell>
  );
}
