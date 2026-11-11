import { useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import type { FeatureProps } from '../types';
import { Checks, LabShell, num, type LabCheck } from './shared';

// Decibels compare two power levels.
// About 3 dB is double the power (T5B09: 5 W to 10 W), so -3 dB is half and -6 dB is a quarter
// (T5B10: 12 W to 3 W). 10 dB is ten times the power (T5B11: 20 W to 200 W).
const STARTS = [5, 12, 20, 100];
const STEPS: { db: number; label: string; what: string }[] = [
  { db: 3, label: '+3 dB', what: 'double' },
  { db: -3, label: '−3 dB', what: 'half' },
  { db: 10, label: '+10 dB', what: 'ten times' },
  { db: -10, label: '−10 dB', what: 'one tenth' },
];
const factor = (db: number) => (Math.abs(db) === 3 ? 2 : 10) ** Math.sign(db);
const watts = (w: number) => (w < 1 ? `${num(w, 4)} W (${num(w * 1000, 1)} mW)` : `${num(w, 2)} W`); // 500 mW = 0.5 W: T5B05
const signed = (db: number) => (db > 0 ? `+${db}` : db < 0 ? `−${-db}` : '0');

export function DecibelLab({ onDone }: FeatureProps) {
  const [start, setStart] = useState(5);
  const [trail, setTrail] = useState<number[]>([]);
  const color = TOPICS.T5.color;
  const net = trail.reduce((a, b) => a + b, 0);
  // Count the steps and multiply once, so the watts stay exact.
  const n3 = trail.filter((d) => Math.abs(d) === 3).reduce((a, d) => a + Math.sign(d), 0);
  const n10 = trail.filter((d) => Math.abs(d) === 10).reduce((a, d) => a + Math.sign(d), 0);
  const ratio = 2 ** n3 * 10 ** n10;
  const power = Number((start * ratio).toPrecision(10));
  const top = Math.max(start, power);
  const can = (db: number) => { const r = ratio * factor(db); return r <= 1000 && r >= 1 / 1000 && trail.length < 12; };
  const pick = (s: number) => { setStart(s); setTrail([]); };
  const ratioText = ratio >= 1 ? `× ${num(ratio)}` : `÷ ${num(1 / ratio)}`;
  const at = `You are at ${watts(power)}, starting from ${start} W.`;

  const checks: LabCheck[] = [
    { // T5B09
      prompt: 'Start at 5 W. Use the buttons to reach 10 watts.',
      test: () => start === 5 && power === 10
        ? { ok: true, say: `5 W to 10 W is double the power. That is ${signed(net)} dB.` }
        : { ok: false, say: start !== 5 ? 'Pick the 5 W start first.' : `${at} Doubling needs one +3 dB step.` },
    },
    { // T5B11
      prompt: 'Start at 20 W. Reach 200 watts.',
      test: () => start === 20 && power === 200
        ? { ok: true, say: `20 W to 200 W is ten times the power. That is ${signed(net)} dB.` }
        : { ok: false, say: start !== 20 ? 'Pick the 20 W start first.' : `${at} Ten times the power is one +10 dB step.` },
    },
    { // T5B10
      prompt: 'Start at 12 W. Bring the power down to 3 watts.',
      test: () => start === 12 && power === 3
        ? { ok: true, say: `12 W to 6 W to 3 W: two halvings. −3 dB and −3 dB add up to ${signed(net)} dB.` }
        : { ok: false, say: start !== 12 ? 'Pick the 12 W start first.' : `${at} 3 W is a quarter of 12 W: halve it, then halve it again.` },
    },
  ];

  let w = start;
  const steps = trail.map((db) => { w = Number((w * factor(db)).toPrecision(10)); return `${signed(db)} dB → ${watts(w)}`; });

  return (
    <LabShell sub="T5" title="Decibels and power">
      <div class="card lab-card">
        <span class="small muted">Starting power</span>
        <div class="lab-jumps">
          {STARTS.map((s) => <button type="button" class={`lab-jump ${start === s ? 'on' : ''}`} aria-pressed={start === s} onClick={() => pick(s)}>{s} W</button>)}
        </div>
        <div class="row between" style={{ flexWrap: 'wrap' }}>
          <span class="lab-big" aria-live="polite">{watts(power)}</span>
          <span class="chip">{signed(net)} dB</span>
        </div>
        <div role="img" aria-label={`Start ${start} watts, now ${watts(power)}`} class="stack" style={{ gap: '6px' }}>
          <div class="lab-pbar"><span>Start</span><div class="track"><div class="fill" style={{ width: `${(100 * start) / top}%`, background: 'var(--muted)' }} /></div></div>
          <div class="lab-pbar"><span>Now</span><div class="track"><div class="fill" style={{ width: `${(100 * power) / top}%`, background: color }} /></div></div>
        </div>
        <div class="lab-db-grid">
          {STEPS.map((s) => (
            <button type="button" class="lab-db-btn" disabled={!can(s.db)} onClick={() => setTrail([...trail, s.db])}>
              {s.label}<span>{s.what}</span>
            </button>
          ))}
        </div>
        <div class="lab-trail" aria-live="polite">{start} W{steps.map((s) => <><br />{s}</>)}</div>
        <button type="button" class="btn secondary" disabled={!trail.length} onClick={() => setTrail([])}>Back to start</button>
      </div>

      <div class="card lab-card lab-rule">
        <h2>The rule</h2>
        <p>Every 3 dB is about double the power. Every 10 dB is ten times the power. A minus sign means the power went down.</p>
        <div class="lab-formula">{start} W {ratioText}</div>
        <div class="lab-result" style={{ color }}>= {watts(power)} ({signed(net)} dB)</div>
        <p class="lab-note">Decibels add up while the power multiplies: two +3 dB steps are +6 dB and four times the power.</p>
      </div>

      <Checks checks={checks} onDone={onDone} />
    </LabShell>
  );
}
