import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import { Icon } from '../../ui/Icon';
import type { FeatureResult } from '../types';
import './labs.css';

/** Show a number without trailing zeros, at most `d` decimals. */
export function num(n: number, d = 2): string {
  return String(Number(n.toFixed(d)));
}

/** Screen frame every lab shares: back button, topic label in the topic color, title. */
export function LabShell({ sub, title, children }: { sub: string; title: string; children: ComponentChildren }) {
  const t = TOPICS[sub];
  return (
    <div class="screen lab-screen">
      <div class="topbar">
        <a class="iconbtn" href="#/learn/labs" aria-label="Back"><Icon name="back" /></a>
        <div>
          <div class="lab-topic" style={{ color: t.color }}>{sub} · {t.name} · Visual lab</div>
          <h1>{title}</h1>
        </div>
      </div>
      {children}
    </div>
  );
}

/** A thumb-sized slider with minus and plus buttons for exact values. Works in whole steps. */
export function Slider(p: {
  id: string; label: string; value: number; min: number; max: number; step?: number;
  text: string; minText?: string; maxText?: string; onChange: (v: number) => void;
}) {
  const step = p.step ?? 1;
  const set = (v: number) => p.onChange(Math.min(p.max, Math.max(p.min, Number(v.toFixed(6)))));
  return (
    <div class="lab-slider">
      <div class="lab-slider-head">
        <label for={p.id}>{p.label}</label>
        <output for={p.id}>{p.text}</output>
      </div>
      <div class="lab-slider-row">
        <button type="button" class="lab-step" aria-label={`Lower ${p.label}`} disabled={p.value <= p.min} onClick={() => set(p.value - step)}>−</button>
        <input id={p.id} class="lab-range" type="range" min={p.min} max={p.max} step={step} value={p.value}
          aria-valuetext={p.text} onInput={(e) => set(Number((e.target as HTMLInputElement).value))} />
        <button type="button" class="lab-step" aria-label={`Raise ${p.label}`} disabled={p.value >= p.max} onClick={() => set(p.value + step)}>+</button>
      </div>
      {p.minText && <div class="lab-ends"><span>{p.minText}</span><span>{p.maxText}</span></div>}
    </div>
  );
}

export interface LabCheck {
  prompt: string;
  /** Looks at the model as it is now. `say` is the one line shown: the reason when right, what to change when not. */
  test: () => { ok: boolean; say: string };
}

/** The "now try it" tasks. Each is answered by setting the model, then pressing Check. */
export function Checks({ checks, onDone }: { checks: LabCheck[]; onDone: (r?: FeatureResult) => void }) {
  const [i, setI] = useState(0);
  const [fb, setFb] = useState<{ ok: boolean; say: string } | null>(null);
  const [missed, setMissed] = useState(false);
  const [score, setScore] = useState(0);
  const sent = useRef(false);
  const last = i === checks.length - 1;
  const solved = !!fb?.ok;

  const press = () => {
    if (!solved) {
      const r = checks[i].test();
      setFb(r);
      if (r.ok) { if (!missed) setScore(score + 1); } else setMissed(true);
    } else if (!last) {
      setI(i + 1); setFb(null); setMissed(false);
    } else if (!sent.current) {
      sent.current = true;
      onDone({ score, total: checks.length });
    }
  };

  return (
    <div class="lab-checks">
      <div class="lab-checks-head">
        <span>Now try it · {i + 1} of {checks.length}</span>
        <span class="lab-checks-dots" aria-hidden="true">
          {checks.map((_, k) => <i class={k < i || (k === i && solved) ? 'done' : k === i ? 'now' : ''} />)}
        </span>
      </div>
      <p class="lab-prompt">{checks[i].prompt}</p>
      {fb && <p class={`lab-fb ${fb.ok ? 'good' : 'bad'}`} role="status" key={`${i}-${fb.say}`}><b>{fb.ok ? 'Right. ' : 'Not yet. '}</b>{fb.say}</p>}
      <button type="button" class="btn primary block" onClick={press}>{!solved ? 'Check' : last ? 'Done' : 'Next'}</button>
    </div>
  );
}

/**
 * The memory triangle: the top letter equals the two bottom letters multiplied.
 * Tap the letter you want to find and the other two show how to get it.
 */
export function Triangle(p: {
  top: string; left: string; right: string;
  values: Record<string, number>; units: Record<string, string>; names: Record<string, string>; color: string;
}) {
  const [pick, setPick] = useState(p.top);
  const v = (k: string) => num(p.values[k]);
  let formula: string;
  let live: string;
  if (pick === p.top) {
    formula = `${p.top} = ${p.left} × ${p.right}`;
    live = `${v(p.left)} × ${v(p.right)} = ${v(p.top)} ${p.units[p.top]}`;
  } else {
    const other = pick === p.left ? p.right : p.left;
    formula = `${pick} = ${p.top} ÷ ${other}`;
    live = `${v(p.top)} ÷ ${v(other)} = ${v(pick)} ${p.units[pick]}`;
  }
  const btn = (k: string, x: string, y: string) => (
    <button type="button" class={`lab-tri-btn ${pick === k ? 'on' : ''}`} style={{ left: x, top: y }}
      aria-pressed={pick === k} aria-label={`Find ${p.names[k]} (${k})`} onClick={() => setPick(k)}>{k}</button>
  );
  return (
    <div class="stack" style={{ alignItems: 'center' }}>
      <div class="lab-tri">
        <svg class="lab-svg" viewBox="0 0 220 170" aria-hidden="true">
          <path d="M110 8 L212 162 H8 Z" fill="none" stroke={p.color} stroke-width="3" stroke-linejoin="round" />
          <path d="M58 88 H162 M110 88 V162" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" />
        </svg>
        {btn(p.top, '50%', '36%')}
        {btn(p.left, '30%', '75%')}
        {btn(p.right, '70%', '75%')}
      </div>
      <p class="lab-note" style={{ textAlign: 'center' }}>Tap the letter you want to find. Side by side means multiply. Top over bottom means divide.</p>
      <div class="lab-formula" aria-live="polite">{formula}</div>
      <div class="lab-result" style={{ color: p.color }}>{live}</div>
    </div>
  );
}

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Loop geometry in SVG units. Dots run clockwise from the battery's positive plate (conventional current).
const L = 50, R = 270, T = 44, B = 144;
const PERIM = 2 * (R - L) + 2 * (B - T);
function loopPoint(d: number): [number, number] {
  let s = ((d % PERIM) + PERIM) % PERIM;
  if (s < B - T) return [L, B - s];
  s -= B - T;
  if (s < R - L) return [L + s, T];
  s -= R - L;
  if (s < B - T) return [R, T + s];
  s -= B - T;
  return [R - s, B];
}
const DOTS = 12;
/** Dot speed in SVG units per second for each ampere. Speed is directly proportional to current. */
export const DOT_SPEED_PER_AMP = 14;

/**
 * A battery and one resistor in a single loop, drawn with the same symbols as the
 * official figures (battery: figure T-1 item 4, resistor: figure T-1 item 1).
 * Dots move at a speed proportional to `amps`. `glow` (0 to 1) lights the resistor for the power lab.
 */
export function Circuit(p: { amps: number; batteryText: string; loadText: string; currentText: string; color: string; glow?: number; label: string }) {
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const speed = useRef(0);
  speed.current = p.amps * DOT_SPEED_PER_AMP;
  useEffect(() => {
    const place = (off: number) => dots.current.forEach((c, k) => {
      if (!c) return;
      const [x, y] = loopPoint(off + (k * PERIM) / DOTS);
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1));
    });
    place(0);
    if (reducedMotion()) return;
    let off = 0, prev = performance.now(), raf = 0;
    const tick = (now: number) => {
      off += (speed.current * Math.min(100, now - prev)) / 1000;
      prev = now;
      place(off);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const glow = p.glow ?? 0;
  return (
    <svg class="lab-svg" viewBox="0 0 320 180" role="img" aria-label={p.label}>
      {glow > 0 && <ellipse cx="160" cy={T} rx={34 + glow * 30} ry={14 + glow * 22} fill={p.color} opacity={0.12 + glow * 0.4} />}
      {/* wires */}
      <path d={`M${L} 80 V${T} H130 M190 ${T} H${R} V${B} H${L} V108`} fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      {/* battery: long thin plate is positive */}
      <path d={`M${L - 16} 80 H${L + 16} M${L - 16} 98 H${L + 16}`} stroke="var(--text)" stroke-width="2" stroke-linecap="round" />
      <path d={`M${L - 8} 89 H${L + 8} M${L - 8} 107 H${L + 8}`} stroke="var(--text)" stroke-width="4" stroke-linecap="round" />
      <text x={L - 30} y="78" style={{ fontSize: '15px', fontWeight: 700 }}>+</text>
      <text x={L + 24} y="90">Battery</text>
      <text x={L + 24} y="108" style={{ fontWeight: 700, fill: 'var(--text)' }}>{p.batteryText}</text>
      {/* resistor */}
      <path d={`M130 ${T} l5 -10 l10 20 l10 -20 l10 20 l10 -20 l10 20 l5 -10`} fill="none" stroke={p.color} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <text x="160" y="18" text-anchor="middle" style={{ fontWeight: 700, fill: p.color }}>{p.loadText}</text>
      {/* current */}
      {Array.from({ length: DOTS }, (_, k) => <circle ref={(el) => { dots.current[k] = el; }} r="4" fill="var(--accent)" />)}
      <path d={`M176 ${B + 16} H146 m7 -5 l-7 5 l7 5`} fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <text x="160" y={B - 12} text-anchor="middle" style={{ fontWeight: 700, fill: 'var(--accent)' }}>{p.currentText}</text>
    </svg>
  );
}
