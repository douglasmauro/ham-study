import { useEffect, useRef, useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import type { FeatureProps } from '../types';
import { Checks, LabShell, num, type LabCheck } from './shared';

// Everything shown here is stated by a pool question; the question id sits beside each fact.
// The pool gives no full band edges for these bands, so none are shown.
// Ranges: HF 3 to 30 MHz (T3B10), VHF 30 to 300 MHz (T3B08), UHF 300 to 3000 MHz (T3B09).
const RANGES: { id: 'HF' | 'VHF' | 'UHF'; lo: number; hi: number; text: string }[] = [
  { id: 'HF', lo: 3, hi: 30, text: '3 to 30 MHz' },
  { id: 'VHF', lo: 30, hi: 300, text: '30 to 300 MHz' },
  { id: 'UHF', lo: 300, hi: 3000, text: '300 to 3000 MHz' },
];

interface Mark { lo: number; hi?: number; label: string }
interface Band {
  id: string; short: string; name: string; range: 'HF' | 'VHF' | 'UHF';
  at: number; // where the flag sits on the strip, MHz
  where: string; // the frequencies the pool states for the band
  marks: Mark[]; // drawn in the close-up
  facts: { k: string; text: string; q: string }[];
}

const DIGITAL = { k: 'Digital', text: 'Technicians may use digital modes such as FT8 on this band.', q: 'T1B05' };
const SSB = { k: 'Phone', text: 'SSB phone may be used in at least some segment of every amateur band above 50 MHz.', q: 'T1B10' };
const POWER_VHF = { k: 'Power', text: 'Above 30 MHz a Technician may run up to 1500 watts peak envelope power, except for some specific restrictions.', q: 'T1B12' };

const BANDS: Band[] = [
  {
    id: '10m', short: '10 m', name: '10 meters', range: 'HF', at: 28.4,
    where: 'The pool states 28.200 to 28.500 MHz as part of this band.',
    marks: [{ lo: 28.2, hi: 28.3, label: 'Beacons' }, { lo: 28.3, hi: 28.5, label: 'Technician phone' }],
    facts: [
      { k: 'Phone', text: 'Technicians may use phone from 28.300 to 28.500 MHz. This is the only HF band where a Technician has phone privileges.', q: 'T1B01, T1B06' },
      DIGITAL,
      { k: 'Power', text: 'In their HF band segments, Technicians may run at most 200 watts peak envelope power.', q: 'T1B11' },
      { k: 'Also here', text: 'Automatically controlled propagation beacons are found between 28.200 and 28.300 MHz.', q: 'T1A06' },
    ],
  },
  {
    id: '6m', short: '6 m', name: '6 meters', range: 'VHF', at: 51,
    where: 'The pool states 50.0 to 50.1 MHz and 52.525 MHz as part of this band.',
    marks: [{ lo: 50.0, hi: 50.1, label: 'CW only' }, { lo: 52.525, label: '52.525 MHz' }],
    facts: [
      { k: 'CW only', text: '50.0 to 50.1 MHz is limited to CW (Morse code) only.', q: 'T1B07' },
      { k: 'In this band', text: '52.525 MHz is in the 6-meter band.', q: 'T1B03' },
      DIGITAL, SSB, POWER_VHF,
    ],
  },
  {
    id: '2m', short: '2 m', name: '2 meters', range: 'VHF', at: 145.2,
    where: 'The pool states 144.0 to 144.1 MHz and 146.52 MHz as part of this band.',
    marks: [{ lo: 144.0, hi: 144.1, label: 'CW only' }, { lo: 146.52, label: '146.52 MHz' }],
    facts: [
      { k: 'CW only', text: '144.0 to 144.1 MHz is limited to CW (Morse code) only.', q: 'T1B07' },
      { k: 'In this band', text: '146.52 MHz is in the 2-meter band. It is the national calling frequency for FM simplex.', q: 'T1B04, T2A02' },
      DIGITAL, SSB, POWER_VHF,
    ],
  },
  {
    id: '70cm', short: '70 cm', name: '70 centimeters', range: 'UHF', at: 430,
    // 300 / 0.7 m = about 430 MHz by the wavelength rule (T3B06, T3B07).
    where: 'The pool states no frequencies for this band. The wavelength rule puts it near 300 ÷ 0.7 = about 430 MHz.',
    marks: [],
    facts: [SSB, POWER_VHF],
  },
];

const LO = 3, HI = 3000, DECADES = Math.log10(HI / LO);
const ZOOMS = [1, 2, 4, 8];
const TICKS = [3, 5, 10, 20, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000];
const MAJOR = new Set([3, 30, 300, 3000]);
const H = 190, AXIS = 150;

export function BandLab({ onDone }: FeatureProps) {
  const [sel, setSel] = useState<string | null>(null);
  const [zi, setZi] = useState(0);
  const [base, setBase] = useState(326);
  const scroller = useRef<HTMLDivElement>(null);
  const color = TOPICS.T1.color;
  const zoom = ZOOMS[zi];
  const W = base * zoom;
  const PAD = 22;
  const x = (f: number) => PAD + ((W - 2 * PAD) * Math.log10(f / LO)) / DECADES;
  const band = BANDS.find((b) => b.id === sel) ?? null;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const fit = () => { if (el.clientWidth >= 200) setBase(el.clientWidth); };
    fit();
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, []);

  // Keep the chosen band (or the middle of the view) in sight when the zoom or the choice changes.
  const center = useRef(0.5);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const frac = band ? x(band.at) / W : center.current;
    el.scrollLeft = frac * W - el.clientWidth / 2;
  }, [zi, sel, base]);
  const onScroll = () => {
    const el = scroller.current;
    if (el) center.current = (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth;
  };

  const pickCheck = (want: string, right: string, wrong: (b: Band) => string): LabCheck['test'] => () => {
    if (!band) return { ok: false, say: 'Tap a band on the strip first.' };
    return band.id === want ? { ok: true, say: right } : { ok: false, say: `You picked ${band.name}. ${wrong(band)}` };
  };
  const checks: LabCheck[] = [
    { // T1B06, T1B01, T3B10
      prompt: 'Tap the only HF band where a Technician may use phone.',
      test: pickCheck('10m', '10 meters is HF (3 to 30 MHz). Technician phone is 28.300 to 28.500 MHz.',
        (b) => `That band is ${b.range}, which is ${RANGES.find((r) => r.id === b.range)!.text}. HF is 3 to 30 MHz.`),
    },
    { // T1B04
      prompt: 'Tap the band that includes 146.52 MHz.',
      test: pickCheck('2m', '300 ÷ 146.52 is about 2 meters, so 146.52 MHz is in the 2-meter band.',
        (b) => `Its wavelength is about ${b.short}. Try the rule: 300 ÷ 146.52 is about 2 meters.`),
    },
    { // T1B03
      prompt: 'Tap the band that includes 52.525 MHz.',
      test: pickCheck('6m', '300 ÷ 52.525 is about 6 meters, so 52.525 MHz is in the 6-meter band.',
        (b) => `Its wavelength is about ${b.short}. Try the rule: 300 ÷ 52.525 is about 6 meters.`),
    },
    { // T3B09
      prompt: 'Tap the band that is UHF.',
      test: pickCheck('70cm', 'UHF is 300 to 3000 MHz. 70 centimeters is near 430 MHz.',
        (b) => `That band is ${b.range}, which is ${RANGES.find((r) => r.id === b.range)!.text}. UHF is 300 to 3000 MHz.`),
    },
  ];

  const ticks = TICKS.filter((t) => MAJOR.has(t) || zoom >= 2 || t === 10 || t === 100 || t === 1000);

  return (
    <LabShell sub="T1" title="Band explorer">
      <div class="card lab-card">
        <div class="row between">
          <span class="small muted">Swipe the strip sideways. Tap a band.</span>
          <div class="lab-zoom">
            <button type="button" class="lab-step" aria-label="Zoom out" disabled={zi === 0} onClick={() => setZi(zi - 1)}>−</button>
            <span class="small" style={{ fontWeight: 700, minWidth: '26px', textAlign: 'center' }}>{zoom}×</span>
            <button type="button" class="lab-step" aria-label="Zoom in" disabled={zi === ZOOMS.length - 1} onClick={() => setZi(zi + 1)}>+</button>
          </div>
        </div>
        <div class="lab-strip-scroll" ref={scroller} onScroll={onScroll} tabIndex={0} role="group" aria-label="Frequency strip from 3 to 3000 megahertz">
          <div class="lab-strip" style={{ width: `${W}px` }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              {RANGES.map((r, k) => (
                <g>
                  <rect x={x(r.lo) + 1} y={AXIS - 22} width={Math.max(0, x(r.hi) - x(r.lo) - 2)} height="22" rx="6"
                    fill={band?.range === r.id ? color : 'var(--raised)'} opacity={band?.range === r.id ? 0.35 : 1} />
                  <text x={(x(r.lo) + x(r.hi)) / 2} y={AXIS - 6} text-anchor="middle" style={{ fontSize: '13px', fontWeight: 700, fill: 'var(--text)' }}>{r.id}</text>
                  {k > 0 && <line x1={x(r.lo)} y1="8" x2={x(r.lo)} y2={AXIS} stroke="var(--line)" stroke-width="1" stroke-dasharray="3 4" />}
                </g>
              ))}
              <line x1={x(LO)} y1={AXIS} x2={x(HI)} y2={AXIS} stroke="var(--muted)" stroke-width="2" stroke-linecap="round" />
              {ticks.map((t) => (
                <g>
                  <line x1={x(t)} y1={AXIS} x2={x(t)} y2={AXIS + (MAJOR.has(t) ? 9 : 5)} stroke="var(--muted)" stroke-width="2" stroke-linecap="round" />
                  {(MAJOR.has(t) || zoom >= 2) && <text x={x(t)} y={AXIS + 24} text-anchor="middle" style={{ fontSize: '12px', fill: 'var(--muted)' }}>{t}</text>}
                </g>
              ))}
              <text x={x(LO) + 16} y={AXIS + 38} style={{ fontSize: '12px', fill: 'var(--muted)' }}>MHz</text>
              {BANDS.map((b, k) => (
                <line x1={x(b.at)} y1={k % 2 ? 106 : 52} x2={x(b.at)} y2={AXIS - 22}
                  stroke={sel === b.id ? 'var(--accent)' : color} stroke-width="3" stroke-linecap="round" />
              ))}
            </svg>
            {BANDS.map((b, k) => (
              <button type="button" class={`lab-band ${sel === b.id ? 'on' : ''}`} style={{ left: `${x(b.at)}px`, top: k % 2 ? '62px' : '8px' }}
                aria-pressed={sel === b.id} aria-label={`${b.name} band`} onClick={() => setSel(b.id)}>{b.short}</button>
            ))}
          </div>
        </div>
        <span class="lab-note">The strip is stretched so each step of ten takes the same width. Only the HF, VHF and UHF ranges are drawn as blocks.</span>
      </div>

      {!band && (
        <div class="card lab-card lab-rule">
          <h2>The rule</h2>
          <p>HF is 3 to 30 MHz. VHF is 30 to 300 MHz. UHF is 300 to 3000 MHz. A band's name is its approximate wavelength.</p>
          <p class="lab-note">Tap 10 m, 6 m, 2 m or 70 cm to see what the question pool says about it.</p>
        </div>
      )}

      {band && (
        <div class="card lab-card" aria-live="polite">
          <div class="row between" style={{ flexWrap: 'wrap' }}>
            <span class="result-title">{band.name}</span>
            <span class="chip" style={{ color }}>{band.range} · {RANGES.find((r) => r.id === band.range)!.text}</span>
          </div>
          <div class="lab-formula" style={{ fontSize: '16px' }}>300 ÷ {num(band.at, 1)} MHz = about {num(300 / band.at, 1)} m</div>
          <span class="small" style={{ color: 'var(--text-2)' }}>{band.where}</span>
          {band.marks.length > 0 && <CloseUp band={band} color={color} />}
          <h2 style={{ marginTop: '4px' }}>What the pool says</h2>
          <ul class="lab-facts">
            {band.facts.map((f) => <li><span class="k">{f.k}</span>{f.text} <span class="q">({f.q})</span></li>)}
          </ul>
        </div>
      )}

      <Checks checks={checks} onDone={onDone} />
    </LabShell>
  );
}

/** A straight (not stretched) close-up that spans only the frequencies the pool states for the band. */
function CloseUp({ band, color }: { band: Band; color: string }) {
  const lo = Math.min(...band.marks.map((m) => m.lo));
  const hi = Math.max(...band.marks.map((m) => m.hi ?? m.lo));
  const X0 = 30, X1 = 290;
  const x = (f: number) => X0 + ((X1 - X0) * (f - lo)) / (hi - lo);
  const fx = (f: number) => (band.range === 'HF' ? f.toFixed(3) : f.toFixed(1));
  return (
    <svg class="lab-svg" viewBox="0 0 320 96" role="img"
      aria-label={`Close-up of ${band.name}: ${band.marks.map((m) => `${m.label} ${m.lo}${m.hi ? ` to ${m.hi}` : ''} megahertz`).join(', ')}`}>
      <line x1={X0} y1="52" x2={X1} y2="52" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" />
      {band.marks.map((m, k) => {
        const a = x(m.lo), b = m.hi ? x(m.hi) : a;
        const wide = b - a > 60;
        const tx = wide ? (a + b) / 2 : Math.min(X1 - 4, Math.max(X0 + 4, a));
        const anchor = wide ? 'middle' : a > 160 ? 'end' : 'start';
        return (
          <g>
            {m.hi
              ? <rect x={a} y="42" width={Math.max(6, b - a)} height="20" rx="5" fill={k % 2 ? 'var(--accent)' : color} />
              : <circle cx={a} cy="52" r="7" fill="var(--accent)" />}
            <text x={tx} y="30" text-anchor={anchor} style={{ fontSize: '13px', fontWeight: 700, fill: 'var(--text)' }}>{m.label}</text>
            <text x={tx} y="84" text-anchor={anchor} style={{ fontSize: '12px', fill: 'var(--muted)' }}>
              {m.hi ? `${fx(m.lo)} to ${fx(m.hi)}` : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
