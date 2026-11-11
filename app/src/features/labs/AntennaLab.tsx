import { useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import type { FeatureProps } from '../types';
import { Checks, LabShell, Slider, num, type LabCheck } from './shared';

// What the pool states:
//   wavelength in meters = 300 / frequency in MHz (T3B06)
//   a 19-inch vertical is a resonant quarter-wave on 2 meters (T9A08)
//   shortening a dipole raises its resonant frequency (T9A05)
// Not stated by the pool, added so the numbers agree with T9A08: a real wire antenna resonates
// when cut about 5 percent shorter than the free-space figure. At 146 MHz:
// 300 / 146 / 4 = 0.514 m = 20.2 in, times 0.95 = 19.2 in, the pool's 19 inches.
const SHORTEN = 0.95;
const F_MIN = 28, F_MAX = 450, STEPS = 1000;
const freqOf = (v: number) => F_MIN * Math.pow(F_MAX / F_MIN, v / STEPS);
const sliderOf = (f: number) => Math.round((STEPS * Math.log(f / F_MIN)) / Math.log(F_MAX / F_MIN));
const JUMPS: [string, number][] = [['10 m', 28.4], ['6 m', 52.525], ['2 m', 146], ['70 cm', 440]];
const IN_PER_M = 39.37;

const fmtF = (f: number) => num(f, 3);
const round3 = (f: number) => Number(f.toPrecision(3));
const meters = (m: number) => (m >= 1 ? `${num(m, 2)} m` : `${num(m * 100, 1)} cm`);
const inches = (m: number) => { const i = m * IN_PER_M; return i >= 100 ? `${num(i / 12, 1)} ft` : `${num(i, 1)} in`; };
const PERSON = 1.7; // a person about 1.7 m tall, only to give the drawing a sense of size

export function AntennaLab({ onDone }: FeatureProps) {
  const [f, setFreq] = useState(52.525);
  const [v, setV] = useState(sliderOf(52.525));
  const setF = (nf: number) => { setFreq(nf); setV(sliderOf(nf)); };
  const [fit, setFit] = useState(false);
  const color = TOPICS.T9.color;
  const wave = 300 / f;
  const half = (wave / 2) * SHORTEN;
  const quarter = (wave / 4) * SHORTEN;
  const qIn = quarter * IN_PER_M;

  // Drawing: 320 x 240 units. Fixed scale fits the longest dipole (28 MHz); "fit" fills the width at any frequency.
  const GROUND = 206, DIP_Y = 26, CX = 160, VX = 252, SPAN = 284;
  const longest = (300 / F_MIN / 2) * SHORTEN;
  const s = fit ? SPAN / half : SPAN / longest; // units per meter
  const dip = half * s, vert = quarter * s;
  const barM = [5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02].find((m) => m * s <= 90) ?? 0.02;
  const personH = PERSON * s;
  const LY = Math.min(GROUND - 34, Math.max(80, GROUND - vert / 2)); // label height for the vertical
  const showPerson = personH <= GROUND - 40;

  const checks: LabCheck[] = [
    { // T9A08
      prompt: 'Find the frequency where the quarter-wave vertical is about 19 inches long.',
      test: () => Math.abs(qIn - 19) <= 0.5
        ? { ok: true, say: `At ${fmtF(f)} MHz the quarter-wave is ${num(qIn, 1)} inches. The 2-meter band is right here, around 146 MHz, which is why 19-inch verticals are common on it.` }
        : { ok: false, say: `The vertical is ${inches(quarter)} now. ${qIn > 19 ? 'Raise the frequency to shorten it.' : 'Lower the frequency to lengthen it.'}` },
    },
    { // T9A05
      prompt: 'Now shorten the half-wave dipole to under 40 centimeters.',
      test: () => half < 0.4
        ? { ok: true, say: `You had to go up to ${fmtF(f)} MHz. A shorter dipole is resonant at a higher frequency.` }
        : { ok: false, say: `The dipole is ${meters(half)} long. A shorter antenna belongs to a higher frequency: slide up.` },
    },
    { // T3B06 applied
      prompt: 'Find the frequency where the half-wave dipole is about 5 meters long.',
      test: () => Math.abs(half - 5) <= 0.1
        ? { ok: true, say: `At ${fmtF(f)} MHz the wave is ${num(wave, 1)} m, so half a wave is about 5 m. That is the 10-meter band.` }
        : { ok: false, say: `The dipole is ${meters(half)} long. ${half > 5 ? 'Raise the frequency.' : 'Lower the frequency: you want a wave about 10 meters long.'}` },
    },
  ];

  return (
    <LabShell sub="T9" title="Antenna length">
      <div class="card lab-card">
        <div class="row between" style={{ flexWrap: 'wrap' }}>
          <span class="lab-big">{fmtF(f)} MHz</span>
          <button type="button" class={`toggle ${fit ? 'on' : ''}`} style={{ minHeight: '44px' }} aria-pressed={fit} onClick={() => setFit(!fit)}>
            {fit ? 'Zoomed to fit' : 'Zoom to fit'}
          </button>
        </div>
        <svg class="lab-svg" viewBox="0 0 320 240" role="img"
          aria-label={`At ${fmtF(f)} megahertz: half-wave dipole ${meters(half)}, quarter-wave vertical ${meters(quarter)}`}>
          {/* ground and scale bar */}
          <line x1="8" y1={GROUND} x2="312" y2={GROUND} stroke="var(--muted)" stroke-width="2" stroke-linecap="round" />
          <path d={`M12 ${GROUND + 16} h${barM * s} m0 -5 v10 M12 ${GROUND + 11} v10`} fill="none" stroke="var(--text-2)" stroke-width="2" stroke-linecap="round" />
          <text x={Math.max(12 + barM * s + 8, 20)} y={GROUND + 21}>{meters(barM)}</text>
          {/* person for size */}
          {showPerson && (
            <g stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" fill="none">
              <circle cx="60" cy={GROUND - personH * 0.92} r={personH * 0.08} />
              <path d={`M60 ${GROUND - personH * 0.84} V${GROUND - personH * 0.4} l${-personH * 0.1} ${personH * 0.4} M60 ${GROUND - personH * 0.4} l${personH * 0.1} ${personH * 0.4} M${60 - personH * 0.14} ${GROUND - personH * 0.62} L60 ${GROUND - personH * 0.76} L${60 + personH * 0.14} ${GROUND - personH * 0.62}`} />
            </g>
          )}
          {showPerson && personH > 40 && <text x="60" y={GROUND - personH - 6} text-anchor="middle" style={{ fontSize: '12px', fill: 'var(--muted)' }}>person</text>}
          {/* half-wave dipole: two equal wires, fed in the middle */}
          <path d={`M${CX - dip / 2} ${DIP_Y} H${CX - 3} M${CX + 3} ${DIP_Y} H${CX + dip / 2}`} stroke={color} stroke-width="3" stroke-linecap="round" />
          <path d={`M${CX - 3} ${DIP_Y} v14 M${CX + 3} ${DIP_Y} v14`} stroke="var(--accent)" stroke-width="2" stroke-linecap="round" />
          <text x={CX} y={DIP_Y - 10} text-anchor="middle" style={{ fontWeight: 700, fill: color }}>Half-wave dipole {meters(half)}</text>
          {/* quarter-wave vertical on the ground */}
          <line x1={VX} y1={GROUND} x2={VX} y2={GROUND - vert} stroke={color} stroke-width="3" stroke-linecap="round" />
          <circle cx={VX} cy={GROUND} r="4" fill="var(--accent)" />
          <text x={VX - 10} y={LY} text-anchor="end" style={{ fontWeight: 700, fill: color }}>Quarter-wave</text>
          <text x={VX - 10} y={LY + 17} text-anchor="end" style={{ fontWeight: 700, fill: color }}>vertical {meters(quarter)}</text>
        </svg>
        <div class="row" style={{ flexWrap: 'wrap' }}>
          <span class="chip">Dipole {inches(half)}</span>
          <span class="chip">Vertical {inches(quarter)}</span>
        </div>
        <span class="small muted">{fit ? 'Zoomed so the dipole fills the picture. Watch the scale bar.' : 'Both antennas and the person are drawn to the same scale.'} The amber marks are the feed points.</span>
        <Slider id="lab-ant-f" label="Frequency" value={v} min={0} max={STEPS} text={`${fmtF(f)} MHz`}
          minText="28 MHz" maxText="450 MHz" onChange={(nv) => { setV(nv); setFreq(round3(freqOf(nv))); }} />
        <div class="lab-jumps">
          {JUMPS.map(([label, jf]) => <button type="button" class={`lab-jump ${f === jf ? 'on' : ''}`} onClick={() => setF(jf)}>{label}</button>)}
        </div>
      </div>

      <div class="card lab-card lab-rule">
        <h2>The rule</h2>
        <p>An antenna is cut to a fraction of the wavelength. Higher frequency, shorter antenna.</p>
        <div class="lab-formula">300 ÷ {fmtF(f)} MHz = {meters(wave)}</div>
        <div class="grid2" style={{ width: '100%' }}>
          <div class="stack" style={{ gap: '2px' }}>
            <span class="small muted">Half wave</span>
            <span class="lab-result" style={{ color, fontSize: '20px' }}>{meters(half)}</span>
            <span class="small">{inches(half)}</span>
          </div>
          <div class="stack" style={{ gap: '2px' }}>
            <span class="small muted">Quarter wave</span>
            <span class="lab-result" style={{ color, fontSize: '20px' }}>{meters(quarter)}</span>
            <span class="small">{inches(quarter)}</span>
          </div>
        </div>
        <p class="lab-note">Half of {meters(wave)} is {meters(wave / 2)} and a quarter is {meters(wave / 4)}. Real antennas are cut about 5 percent shorter than that, and the lengths shown include it. On 2 meters the quarter-wave comes out at about 19 inches.</p>
      </div>

      <Checks checks={checks} onDone={onDone} />
    </LabShell>
  );
}
