import type { SceneProps } from '../data';
import { C, Dots, Formula, T, Triangle, useFlow, type Pt } from '../parts';

// Pool: T5A05 (voltage causes electron flow), T5A01 and T5A03 (current, amperes),
// T5A11 (resistance opposes current), T5D01 to T5D03 (the three forms of Ohm's law),
// T5D06 (12 V and 4 A is 3 ohms: here 12 V across 4 ohms is 3 A), T5D05 (12 V, 1.5 A, 8 ohms).
const LOOP: Pt[] = [[40, 40], [310, 40], [310, 190], [40, 190], [40, 40]];

export function OhmsLawScene({ step: st, t }: SceneProps) {
  const amps = st >= 6 ? 1.5 : 3;
  const off = useFlow(t, amps * 22);
  const battery = st === 1 ? C.topic : C.text;
  const resistor = st === 3 || st === 6 ? C.topic : C.text;
  const values = st >= 5;
  return (
    <svg viewBox="0 0 350 230" role="img" aria-label="A battery and a resistor joined in a loop of wire, with current flowing around it">
      <rect x="40" y="40" width="270" height="150" rx="6" style={{ fill: 'none', stroke: C.muted, strokeWidth: 3 }} />
      {/* battery: long line is the positive side */}
      <rect x="24" y="96" width="32" height="40" style={{ fill: C.surface }} />
      <path d="M22 106 H58 M31 122 H49" style={{ stroke: battery, strokeWidth: 4, strokeLinecap: 'round' }} />
      <path d="M40 96 V106 M40 122 V136" style={{ stroke: C.muted, strokeWidth: 3 }} />
      <text x="12" y="103" style={{ fill: battery, fontSize: '14px', fontWeight: 700 }}>+</text>
      {/* resistor */}
      <rect x="146" y="28" width="78" height="24" style={{ fill: C.surface }} />
      <path d="M146 40 l6 -10 l10 20 l10 -20 l10 20 l10 -20 l10 20 l10 -20 l6 10" style={{ fill: 'none', stroke: resistor, strokeWidth: 3.5, strokeLinejoin: 'round', strokeLinecap: 'round' }} />
      {st >= 2 && (
        <Dots pts={LOOP} off={off} loop gap={60} r={4}
          skip={([x, y]) => (x < 42 && y > 90 && y < 142) || (y < 42 && x > 140 && x < 230)} />
      )}
      {values ? (
        <>
          <text x="62" y="120" style={T.value}>E = 12 V</text>
          <text x="185" y="20" text-anchor="middle" style={T.value}>R = {st >= 6 ? '8 Ω' : '4 Ω'}</text>
          <text x="175" y="216" text-anchor="middle" style={{ ...T.value, fill: C.accent }}>I = {st >= 6 ? '1.5 A' : '3 A'}</text>
        </>
      ) : (
        <>
          {st < 1 && <text x="62" y="120" style={T.label}>Battery</text>}
          {st < 1 && <text x="185" y="20" text-anchor="middle" style={T.label}>Resistor</text>}
          {st >= 1 && <text x="62" y="112" style={{ ...T.label, fill: st === 1 ? C.topic : C.text2 }}>Voltage</text>}
          {st >= 1 && <text x="62" y="128" style={T.label}>the push</text>}
          {st >= 2 && <text x="175" y="216" text-anchor="middle" style={{ ...T.label, fill: C.accent }}>Current: the flow</text>}
          {st >= 3 && <text x="185" y="20" text-anchor="middle" style={{ ...T.label, fill: st === 3 ? C.topic : C.text2 }}>Resistance pushes back</text>}
        </>
      )}
    </svg>
  );
}

export function OhmsLawExtra({ step: st }: { step: number }) {
  const work = st >= 6 ? '12 V ÷ 8 Ω = 1.5 A' : st >= 5 ? '12 V ÷ 4 Ω = 3 A' : 'volts = amperes × ohms';
  return (
    <Formula formula="E = I × R" work={work} dim={st < 4}>
      <Triangle top="E" left="I" right="R" hot={st === 7} label="Ohm's law triangle: E on top, I and R on the bottom" />
    </Formula>
  );
}
