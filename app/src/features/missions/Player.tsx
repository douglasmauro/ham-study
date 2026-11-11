import { useEffect, useRef, useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import { Icon } from '../../ui/Icon';
import type { FeatureProps } from '../types';
import { fill, type Mission, type PickDecision, type SliderDecision, type Step, type StripDecision, type Vars } from './model';
import './missions.css';

interface Solved {
  first: boolean;
  chip: string;
  vars: Vars;
}

const topicColor = (sub: string) => TOPICS[sub]?.color ?? 'var(--accent)';

function reveal(el: HTMLElement | null) {
  if (!el) return;
  const calm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
}

/** Plays one mission, a step at a time. Score counts steps right on the first try. */
export function MissionPlayer({ mission, onDone }: { mission: Mission } & FeatureProps) {
  const [idx, setIdx] = useState(0);
  const [vars, setVars] = useState<Vars>({});
  const [chips, setChips] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState<Solved | null>(null);
  const [finished, setFinished] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const total = mission.steps.length;
  const step = mission.steps[idx];
  const last = idx === total - 1;
  const allVars = solved ? { ...vars, ...solved.vars } : vars;
  const shownChips = solved ? [...chips, solved.chip] : chips;
  const doneCount = idx + (solved ? 1 : 0);

  useEffect(() => { if (solved) reveal(endRef.current); }, [solved]);
  useEffect(() => { window.scrollTo(0, 0); }, [idx]);

  const next = () => {
    if (!solved) return;
    setVars(allVars);
    setChips(shownChips);
    setSolved(null);
    setIdx(idx + 1);
  };
  const finish = () => {
    if (finished) return;
    setFinished(true);
    onDone({ score, total });
  };

  return (
    <div class="screen ms-screen">
      <div class="topbar">
        <a class="iconbtn" href="#/learn/missions" aria-label="Back"><Icon name="back" /></a>
        <div class="grow">
          <div class="sub" style={{ color: topicColor(mission.sub) }}>Mission · step {idx + 1} of {total}</div>
          <h1>{mission.short}</h1>
        </div>
      </div>

      <div class="ms-progress" role="img" aria-label={`Mission progress: ${doneCount} of ${total} steps done`}
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {mission.steps.map((_, i) => (
          <span class={i < doneCount ? 'ms-seg done' : i === idx ? 'ms-seg now' : 'ms-seg'} />
        ))}
      </div>

      {shownChips.length > 0 && (
        <div class="ms-chips" aria-label="Decisions so far">
          <span class="ms-chips-label">Decisions so far</span>
          {shownChips.map((c) => (
            <span class="ms-chip"><Icon name="check" size={14} color="var(--good)" stroke={3} />{c}</span>
          ))}
        </div>
      )}

      <StepView key={idx} step={step} n={idx + 1} goal={idx === 0 ? mission.goal : undefined} vars={vars}
        onSolved={(s) => { setSolved(s); if (s.first) setScore((x) => x + 1); }} />

      <div ref={endRef} class="stack">
        {solved && !last && (
          <button type="button" class="btn primary block" onClick={next}>
            Next: {mission.steps[idx + 1].title.toLowerCase()}
          </button>
        )}
        {solved && last && (
          <>
            <div class="card ms-recap">
              <h2>Mission recap</h2>
              <p class="ms-recap-goal">{mission.goal}</p>
              <ol>
                {mission.steps.map((s) => (
                  <li><span class="ms-recap-title" style={{ color: topicColor(s.sub) }}>{s.title}</span>{fill(s.recap, allVars)}</li>
                ))}
              </ol>
              <p class="small muted">Right on the first try: {score} of {total} steps.</p>
            </div>
            <button type="button" class="btn primary block" onClick={finish} disabled={finished}>Finish mission</button>
          </>
        )}
      </div>
    </div>
  );
}

function StepView({ step, n, goal, vars, onSolved }: {
  step: Step; n: number; goal?: string; vars: Vars; onSolved: (s: Solved) => void;
}) {
  const d = step.decision;
  const [value, setValue] = useState<number | undefined>(d.type === 'pick' ? undefined : d.start);
  const [done, setDone] = useState(false);
  const color = topicColor(step.sub);

  const solve = (s: Solved) => { setDone(true); onSolved(s); };

  return (
    <>
      <div class="card ms-step" style={{ '--ms-topic': color }}>
        {goal && <p class="ms-goal"><b>Goal:</b> {goal}</p>}
        <span class="ms-step-label">Step {n} · {step.title}</span>
        <p class="ms-story">{fill(step.story, vars)}</p>
        {step.formula && <p class="ms-formula">{fill(step.formula, vars)}</p>}
        {step.pic && <div class="ms-pic">{step.pic({ vars, value, solved: done })}</div>}
        {d.type === 'strip' && <Strip d={d} value={value ?? d.start} solved={done} onChange={setValue} />}
        <p class="ms-ask">{fill(step.ask, vars)}</p>
      </div>

      {d.type === 'pick' && <Pick d={d} vars={vars} onSolved={solve} />}
      {d.type !== 'pick' && <Adjust d={d} value={value ?? d.start} onChange={setValue} onSolved={solve} />}

      <p class="ms-covers small muted">Covers {step.covers.join(', ')}</p>
    </>
  );
}

/* ---------- pick one ---------- */

function Pick({ d, vars, onSolved }: { d: PickDecision; vars: Vars; onSolved: (s: Solved) => void }) {
  const [tried, setTried] = useState<number[]>([]);
  const [paused, setPaused] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (paused !== null) reveal(noteRef.current); }, [paused]);

  const pick = (i: number) => {
    if (done || paused !== null || tried.includes(i)) return;
    if (d.options[i].correct) {
      setDone(true);
      onSolved({ first: tried.length === 0, chip: fill(d.chip, vars), vars: d.set ?? {} });
    } else {
      setTried([...tried, i]);
      setPaused(i);
    }
  };

  return (
    <div class="stack">
      {d.options.map((o, i) => {
        const wrong = tried.includes(i);
        const right = done && !!o.correct;
        const cls = right ? 'ms-opt right' : wrong ? 'ms-opt wrong' : done ? 'ms-opt dim' : 'ms-opt';
        return (
          <button type="button" class={cls} onClick={() => pick(i)} disabled={done || paused !== null || wrong}>
            <span class="ms-opt-top">
              <span>{fill(o.text, vars)}</span>
              {right && <span class="ms-tag good"><Icon name="check" size={14} stroke={3} />Correct</span>}
              {wrong && <span class="ms-tag bad"><Icon name="x" size={14} stroke={3} />Not this</span>}
            </span>
            {(done || wrong) && <span class="ms-why">{fill(o.why, vars)}</span>}
          </button>
        );
      })}
      <div ref={noteRef} aria-live="polite">
        {paused !== null && (
          <div class="ms-note bad">
            <span class="ms-note-title"><Icon name="x" size={16} stroke={3} />Mission paused</span>
            <span>{fill(d.options[paused].why, vars)}</span>
            <button type="button" class="btn secondary" onClick={() => setPaused(null)}>Try again</button>
          </div>
        )}
        {done && (
          <div class="ms-note good">
            <span class="ms-note-title"><Icon name="check" size={16} stroke={3} />{tried.length ? 'That works' : 'Right the first time'}</span>
            <span>Each choice now shows its reason.</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- slider and band strip share the set-then-check controls ---------- */

function Adjust({ d, value, onChange, onSolved }: {
  d: SliderDecision | StripDecision; value: number; onChange: (v: number) => void; onSolved: (s: Solved) => void;
}) {
  const [misses, setMisses] = useState(0);
  const [paused, setPaused] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (paused || done) reveal(noteRef.current); }, [paused, done]);

  const locked = !!paused || !!done;
  const clamp = (v: number) => Math.min(d.max, Math.max(d.min, v));
  const nudge = (dir: number) => { if (!locked) onChange(clamp(value + dir * d.step)); };

  const check = () => {
    if (locked) return;
    let wrong: string | null = null;
    let right = '';
    if (d.type === 'slider') {
      const tol = d.tolerance ?? 0;
      if (value < d.target - tol) wrong = d.lowWhy(value);
      else if (value > d.target + tol) wrong = d.highWhy(value);
      else right = d.rightWhy;
    } else {
      const ok = d.segments.find((s) => s.ok);
      if (ok && (value === ok.from || value === ok.to)) wrong = d.edgeWhy;
      else if (ok && value > ok.from && value < ok.to) right = d.rightWhy(value);
      else wrong = d.segments.find((s) => !s.ok && value >= s.from && value <= s.to)?.why ?? d.edgeWhy;
    }
    if (wrong) { setMisses(misses + 1); setPaused(wrong); return; }
    setDone(right);
    onSolved({ first: misses === 0, chip: d.chip(value), vars: d.set ? d.set(value) : {} });
  };

  const less = d.type === 'slider' ? d.lessLabel : 'Down';
  const more = d.type === 'slider' ? d.moreLabel : 'Up';

  return (
    <div class="stack">
      <div class="ms-adjust">
        <div class="row between">
          <span class="ms-adjust-label">{d.label}</span>
          <span class="ms-readout" aria-live="polite">{d.format(value)}</span>
        </div>
        {d.type === 'slider' && (
          <input class="ms-range" type="range" min={d.min} max={d.max} step={d.step} value={value} disabled={locked}
            aria-label={d.label} aria-valuetext={d.format(value)}
            onInput={(e) => onChange(clamp(Number((e.target as HTMLInputElement).value)))} />
        )}
        <div class="grid2">
          <button type="button" class="btn secondary" onClick={() => nudge(-1)} disabled={locked || value <= d.min}>− {less}</button>
          <button type="button" class="btn secondary" onClick={() => nudge(1)} disabled={locked || value >= d.max}>+ {more}</button>
        </div>
      </div>
      {!locked && <button type="button" class="btn primary block" onClick={check}>Check {d.format(value)}</button>}
      <div ref={noteRef} aria-live="polite">
        {paused && (
          <div class="ms-note bad">
            <span class="ms-note-title"><Icon name="x" size={16} stroke={3} />Mission paused</span>
            <span>{paused}</span>
            <button type="button" class="btn secondary" onClick={() => setPaused(null)}>Try again</button>
          </div>
        )}
        {done && (
          <div class="ms-note good">
            <span class="ms-note-title"><Icon name="check" size={16} stroke={3} />{misses ? 'That works' : 'Right the first time'}</span>
            <span>{done}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- band strip: drag the marker, or tap where it should go ---------- */

const SW = 320;
const PAD = 16;

function Strip({ d, value, solved, onChange }: { d: StripDecision; value: number; solved: boolean; onChange: (v: number) => void }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState(false);
  const x = (v: number) => PAD + ((v - d.min) / (d.max - d.min)) * (SW - 2 * PAD);
  const ok = d.segments.find((s) => s.ok);

  const fromEvent = (e: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box || !box.width) return;
    const sx = ((e.clientX - box.left) / box.width) * SW;
    const raw = d.min + ((sx - PAD) / (SW - 2 * PAD)) * (d.max - d.min);
    const snapped = Math.round(raw / d.step) * d.step;
    onChange(Math.min(d.max, Math.max(d.min, snapped)));
  };

  return (
    <svg ref={ref} class={solved ? 'ms-strip' : 'ms-strip live'} viewBox={`0 0 ${SW} 108`} role="img"
      aria-label={`Band strip from ${d.format(d.min)} to ${d.format(d.max)}. Marker at ${d.format(value)}.${solved && ok ? ` Allowed segment ${d.format(ok.from)} to ${d.format(ok.to)}.` : ''}`}
      onPointerDown={(e) => { if (solved) return; (e.currentTarget as Element).setPointerCapture(e.pointerId); setDrag(true); fromEvent(e); }}
      onPointerMove={(e) => { if (drag && !solved) fromEvent(e); }}
      onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)}>
      <rect x={PAD} y="40" width={SW - 2 * PAD} height="26" rx="6" class="ms-strip-band" />
      {solved && ok && (
        <>
          <rect x={x(ok.from)} y="40" width={x(ok.to) - x(ok.from)} height="26" rx="4" class="ms-strip-ok" />
          <text x={(x(ok.from) + x(ok.to)) / 2} y="103" text-anchor="middle" class="ms-t ms-strip-oklabel">{ok.label}</text>
        </>
      )}
      {d.ticks.map((t) => (
        <g>
          <line x1={x(t)} y1="66" x2={x(t)} y2="74" class="ms-strip-tick" />
          <text x={x(t)} y="90" text-anchor="middle" class="ms-t ms-strip-ticklabel">{(t / 1000).toFixed(1)}</text>
        </g>
      ))}
      <text x={SW - PAD} y="102" text-anchor="end" class="ms-t ms-strip-ticklabel">MHz</text>
      <g class="ms-strip-marker" transform={`translate(${x(value)} 0)`}>
        <line x1="0" y1="26" x2="0" y2="70" />
        <path d="M-9 8h18v12l-9 8l-9 -8z" />
      </g>
    </svg>
  );
}
