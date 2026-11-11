import type { SceneProps } from '../data';
import { C, Dots, Formula, T, Triangle, ease, lerp, useFlow, type Pt } from '../parts';

// Pool: T5A10 (power is the rate energy is used), T5A02 (watts), T5C08 (P = I x E),
// T5C09 (13.8 V x 10 A = 138 W), T5C11 (120 W at 12 V needs 10 A).
const OUT: Pt[] = [[112, 108], [228, 108]];
const BACK: Pt[] = [[228, 142], [112, 142]];

export function PowerScene({ step: st, t, ts }: SceneProps) {
  const off = useFlow(t, 60);
  const second = st >= 6; // the 120 W example
  const volts = st < 3 ? 'volts' : second ? '12 V' : '13.8 V';
  const amps = st < 3 ? 'amperes' : second ? '10 A' : '10 A';
  const watts = st < 3 ? 'watts' : st === 3 ? '? W' : second ? '120 W' : '138 W';
  // meter bar: full scale 150 W
  const level = st < 4 ? 0 : st < 6 ? lerp(st === 4 ? 0 : 138, 138, ease(ts)) / 150 : lerp(138, 120, ease(ts)) / 150;
  const hotW = st === 1 || st === 4;
  return (
    <svg viewBox="0 0 350 230" role="img" aria-label="A power supply feeding a radio through two wires, with a meter showing the power in watts">
      <path d="M110 108 H230 M110 142 H230" style={{ stroke: C.muted, strokeWidth: 3, strokeLinecap: 'round' }} />
      <Dots pts={OUT} off={off} gap={24} />
      <Dots pts={BACK} off={off} gap={24} />
      {/* power supply */}
      <rect x="18" y="70" width="92" height="92" rx="10" style={{ fill: C.surface, stroke: C.text, strokeWidth: 2.5 }} />
      <text x="64" y="58" text-anchor="middle" style={T.label}>Power supply</text>
      <text x="64" y="112" text-anchor="middle" style={{ ...T.label, fill: C.muted }}>E</text>
      <text x="64" y="134" text-anchor="middle" style={T.value}>{volts}</text>
      {/* radio */}
      <rect x="230" y="70" width="102" height="92" rx="10" style={{ fill: C.surface, stroke: hotW ? C.topic : C.text, strokeWidth: 2.5 }} />
      <text x="281" y="58" text-anchor="middle" style={T.label}>Radio</text>
      <path d="M246 86 h70" style={{ stroke: C.line, strokeWidth: 6, strokeLinecap: 'round' }} />
      <text x="281" y="118" text-anchor="middle" style={{ ...T.label, fill: C.muted }}>P</text>
      <text x="281" y="140" text-anchor="middle" style={{ ...T.value, fill: hotW ? C.topic : C.text }}>{watts}</text>
      {/* current on the wire */}
      <text x="170" y="76" text-anchor="middle" style={{ ...T.label, fill: C.muted }}>I</text>
      <text x="170" y="94" text-anchor="middle" style={{ ...T.value, fontSize: '14px', fill: second ? C.topic : C.accent }}>{amps}</text>
      {/* watt meter */}
      <text x="18" y="192" style={T.label}>Power used</text>
      <text x="332" y="192" text-anchor="end" style={{ ...T.label, fill: C.muted }}>150 W</text>
      <rect x="18" y="200" width="314" height="12" rx="6" style={{ fill: C.line }} />
      {level > 0 && <rect x="18" y="200" width={314 * level} height="12" rx="6" style={{ fill: C.topic }} />}
    </svg>
  );
}

export function PowerExtra({ step: st }: { step: number }) {
  const work = st >= 6 ? '120 W ÷ 12 V = 10 A' : st === 5 ? 'I = P ÷ E' : st === 4 ? '10 A × 13.8 V = 138 W' : st === 3 ? '10 A × 13.8 V = ?' : 'watts = amperes × volts';
  return (
    <Formula formula="P = I × E" work={work} dim={st < 2}>
      <Triangle top="P" left="I" right="E" hot={st === 5 || st === 6} label="Power triangle: P on top, I and E on the bottom" />
    </Formula>
  );
}
