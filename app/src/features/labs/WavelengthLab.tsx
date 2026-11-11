import { useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import type { FeatureProps } from '../types';
import { Checks, LabShell, Slider, num, type LabCheck } from './shared';

// The rule: wavelength in meters = 300 / frequency in MHz (T3B06).
// Wavelength gets shorter as frequency increases (T3B05).
// Bands are identified by approximate wavelength in meters (T3B07).
const F_MIN = 1.8, F_MAX = 450, STEPS = 1000;
const freqOf = (v: number) => F_MIN * Math.pow(F_MAX / F_MIN, v / STEPS);
const sliderOf = (f: number) => Math.round((STEPS * Math.log(f / F_MIN)) / Math.log(F_MAX / F_MIN));

// US amateur band edges in MHz, from the approved mock-up. The pool itself confirms only
// single frequencies inside some of these (52.525 MHz is 6 meters: T1B03; 146.52 MHz is 2 meters: T1B04).
const BANDS: [number, number, string][] = [
  [1.8, 2.0, '160 m'], [3.5, 4.0, '80 m'], [7.0, 7.3, '40 m'], [10.1, 10.15, '30 m'],
  [14.0, 14.35, '20 m'], [18.068, 18.168, '17 m'], [21.0, 21.45, '15 m'], [24.89, 24.99, '12 m'],
  [28.0, 29.7, '10 m'], [50, 54, '6 m'], [144, 148, '2 m'], [222, 225, '1.25 m'], [420, 450, '70 cm'],
];
const round3 = (f: number) => Number(f.toPrecision(3));
const bandOf = (f: number) => BANDS.find((b) => f >= b[0] && f <= b[1])?.[2] ?? null;

// HF 3 to 30 MHz (T3B10), VHF 30 to 300 MHz (T3B08), UHF 300 to 3000 MHz (T3B09).
const rangeOf = (f: number) => (f < 3 ? 'below HF' : f < 30 ? 'HF' : f < 300 ? 'VHF' : 'UHF');

const JUMPS: [string, number][] = [
  ['80 m', 3.75], ['40 m', 7.15], ['20 m', 14.2], ['10 m', 28.4],
  ['6 m', 52.525], ['2 m', 146.52], ['1.25 m', 223.5], ['70 cm', 440],
];

const fmtF = (f: number) => num(f, 3);
const fmtWave = (m: number) => (m >= 1 ? `${num(m, m >= 100 ? 0 : 1)} meters` : `${Math.round(m * 100)} cm`);

export function WavelengthLab({ onDone }: FeatureProps) {
  // Slider positions give round frequencies (3 figures); jump buttons give exact ones.
  const [v, setV] = useState(500);
  const [f, setFreq] = useState(round3(freqOf(500)));
  const setF = (nf: number) => { setFreq(nf); setV(sliderOf(nf)); };
  const wave = 300 / f;
  const band = bandOf(f);
  const color = TOPICS.T3.color;

  // The drawing shows more cycles as frequency rises. It is a picture, not to scale.
  const cycles = 1 + 14 * (v / STEPS);
  const W = 318, mid = 50, amp = 36;
  let d = '';
  for (let x = 0; x <= W; x += 2) d += `${x === 0 ? 'M' : 'L'}${x} ${(mid - amp * Math.sin((x / W) * cycles * 2 * Math.PI)).toFixed(1)} `;
  const one = (W / cycles).toFixed(1);

  const checks: LabCheck[] = [
    { // T3B06, T1B04
      prompt: 'Set the slider so the wave is about 2 meters long.',
      test: () => Math.abs(wave - 2) <= 0.1
        ? { ok: true, say: `300 ÷ ${fmtF(f)} = ${num(wave, 2)} meters. That is why 144 to 148 MHz is called the 2-meter band.` }
        : { ok: false, say: `The wave is ${fmtWave(wave)} now. ${wave > 2 ? 'Raise the frequency to shorten it.' : 'Lower the frequency to lengthen it.'}` },
    },
    { // T3B05, T3B09
      prompt: 'Make the wave shorter than 1 meter.',
      test: () => wave < 1
        ? { ok: true, say: `You had to go up to ${fmtF(f)} MHz. Wavelength gets shorter as frequency increases. Above 300 MHz is UHF.` }
        : { ok: false, say: `The wave is ${fmtWave(wave)}. A shorter wave needs a higher frequency: go above 300 MHz.` },
    },
    { // T1B03
      prompt: 'Find a frequency in the 6-meter band.',
      test: () => band === '6 m'
        ? { ok: true, say: `${fmtF(f)} MHz gives 300 ÷ ${fmtF(f)} = ${num(wave, 1)} meters, close to 6. The band name is the approximate wavelength.` }
        : { ok: false, say: `${fmtF(f)} MHz is a ${fmtWave(wave)} wave${band ? `, in the ${band} band` : ''}. You want about 6 meters: try 300 ÷ 6 = 50 MHz, or a little above.` },
    },
  ];

  return (
    <LabShell sub="T3" title="Wavelength slider">
      <div class="card lab-card">
        <div class="row between" style={{ flexWrap: 'wrap' }}>
          <span class="lab-big">{fmtF(f)} MHz</span>
          <span class="chip" style={{ color: band ? 'var(--good)' : 'var(--muted)' }}>{band ? `${band} band` : 'between bands'} · {rangeOf(f)}</span>
        </div>
        <svg class="lab-svg" viewBox="0 0 318 112" role="img" aria-label={`Wave at ${fmtF(f)} megahertz, wavelength ${fmtWave(wave)}`}>
          <line x1="0" y1={mid} x2={W} y2={mid} stroke="var(--line)" stroke-width="1" />
          <path d={d} fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" />
          <path d={`M0 102 H${one} M0 95 V109 M${one} 95 V109`} fill="none" stroke={color} stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <span class="small" style={{ color, fontWeight: 600 }}>One wavelength is marked under the wave: {fmtWave(wave)}. The drawing is not to scale.</span>
        <Slider id="lab-wl-f" label="Frequency" value={v} min={0} max={STEPS} text={`${fmtF(f)} MHz`}
          minText="1.8 MHz" maxText="450 MHz" onChange={(nv) => { setV(nv); setFreq(round3(freqOf(nv))); }} />
      </div>

      <div class="card lab-card lab-rule">
        <h2>The rule</h2>
        <p>Wavelength in meters is 300 divided by the frequency in megahertz.</p>
        <div class="lab-formula">300 ÷ {fmtF(f)} MHz</div>
        <div class="lab-result" style={{ color }}>= {fmtWave(wave)}</div>
        <p class="lab-note">Higher frequency, shorter wave. Bands are named by their approximate wavelength.</p>
      </div>

      <div class="stack">
        <span class="small muted">Jump to a band</span>
        <div class="lab-jumps">
          {JUMPS.map(([label, jf]) => (
            <button type="button" class={`lab-jump ${band === label ? 'on' : ''}`} onClick={() => setF(jf)}>{label}</button>
          ))}
        </div>
      </div>

      <Checks checks={checks} onDone={onDone} />
    </LabShell>
  );
}
