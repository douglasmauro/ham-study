import type { SceneProps } from '../data';
import { C, Dots, Facts, T, useFlow, type Pt } from '../parts';

// Pool: T2A07 (offset = difference between a repeater's transmit and receive frequencies),
// T2A01 (2 meter band: plus or minus 600 kHz), T2A03 (70 centimeter band: plus or minus 5 MHz),
// T2B02 (CTCSS: sub-audible tone sent with the voice to open a receiver's squelch),
// T2B04 (cannot get in: wrong offset or wrong tone).
// The frequencies drawn are examples of such a pair, 600 kHz and 5 MHz apart.
const UP: Pt[] = [[38, 148], [175, 50]];
const DOWN: Pt[] = [[175, 50], [312, 148]];

function Handheld({ x, label, color }: { x: number; label: string; color: string }) {
  return (
    <g>
      <path d={`M${x - 4} 166 V148`} style={{ stroke: color, strokeWidth: 2.5, strokeLinecap: 'round' }} />
      <rect x={x - 9} y="166" width="18" height="32" rx="4" style={{ fill: C.surface, stroke: color, strokeWidth: 2.5 }} />
      <path d={`M${x - 4} 174 h8`} style={{ stroke: color, strokeWidth: 2, strokeLinecap: 'round' }} />
      <text x={x} y="218" text-anchor="middle" style={T.label}>{label}</text>
    </g>
  );
}

export function RepeaterScene({ step: st, t }: SceneProps) {
  const off = useFlow(t, 70);
  const uhf = st === 5;
  const fIn = uhf ? '447.000' : '146.340';
  const fOut = uhf ? '442.000' : '146.940';
  const offset = uhf ? '5 MHz apart' : '600 kHz apart';
  const flowing = st >= 2;
  const tower = st === 1 || st === 2 ? C.topic : C.text;
  return (
    <svg viewBox="0 0 350 230" role="img" aria-label="Two handheld radios on either side of a hill. A repeater on the hilltop hears one and retransmits to the other.">
      {/* ground and hill */}
      <path d="M8 200 H100 C130 200 140 104 175 104 C210 104 220 200 250 200 H342" style={{ fill: 'none', stroke: C.muted, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      {/* direct path, blocked by the hill */}
      <g style={{ opacity: st <= 1 ? 1 : 0.35 }}>
        <path d="M52 180 H112" style={{ stroke: C.bad, strokeWidth: 2.5, strokeDasharray: '5 7', strokeLinecap: 'round' }} />
        <path d="M118 174 l10 12 M128 174 l-10 12" style={{ stroke: C.bad, strokeWidth: 3, strokeLinecap: 'round' }} />
        {st <= 1 && <text x="86" y="166" text-anchor="middle" style={{ ...T.label, fill: C.bad }}>blocked</text>}
      </g>
      {/* repeater tower */}
      <path d="M166 104 L175 50 L184 104 M170 82 H180 M168 94 H182 M172 68 H178" style={{ fill: 'none', stroke: tower, strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      <path d="M175 50 V38" style={{ stroke: tower, strokeWidth: 2.5, strokeLinecap: 'round' }} />
      {st >= 1 && <text x="175" y="150" text-anchor="middle" style={{ ...T.label, fill: st === 1 ? C.topic : C.text2 }}>Repeater</text>}
      <Handheld x={42} label="You" color={C.text} />
      <Handheld x={308} label="Friend" color={C.text} />
      {flowing && (
        <>
          <path d="M38 148 L175 50" style={{ stroke: C.accent, strokeWidth: 1.5, opacity: 0.35 }} />
          <path d="M175 50 L312 148" style={{ stroke: C.topic, strokeWidth: 1.5, opacity: 0.35 }} />
          <Dots pts={UP} off={off} gap={26} color={C.accent} />
          <Dots pts={DOWN} off={off} gap={26} color={C.topic} />
          <text x="92" y="84" text-anchor="end" style={{ ...T.label, fill: C.accent }}>{st >= 6 ? 'voice + tone' : 'it listens'}</text>
          <text x="258" y="84" style={{ ...T.label, fill: C.topic }}>it sends</text>
        </>
      )}
      {st >= 3 && (
        <>
          <text x="92" y="102" text-anchor="end" style={{ ...T.value, fontSize: '13px' }}>{fIn}</text>
          <text x="258" y="102" style={{ ...T.value, fontSize: '13px' }}>{fOut}</text>
          <path d="M100 26 V18 H250 V26" style={{ fill: 'none', stroke: st <= 5 || st === 7 ? C.topic : C.text2, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
          <text x="175" y="13" text-anchor="middle" style={{ ...T.label, fill: st <= 5 || st === 7 ? C.topic : C.text2 }}>offset: {offset}</text>
        </>
      )}
      {st >= 6 && (
        <g>
          {/* the tone rides along with the voice */}
          <path d="M22 126 q4 -8 8 0 t8 0 t8 0" style={{ fill: 'none', stroke: C.topic, strokeWidth: 2.5, strokeLinecap: 'round' }} />
          <path d="M196 44 l5 5 l9 -10" style={{ fill: 'none', stroke: C.good, strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
          <text x="214" y="48" style={{ ...T.label, fill: C.good }}>squelch opens</text>
        </g>
      )}
    </svg>
  );
}

export function RepeaterExtra({ step: st }: { step: number }) {
  return (
    <Facts items={[
      { k: '2 meter band', v: '± 600 kHz', on: st === 4 || st === 7 },
      { k: '70 cm band', v: '± 5 MHz', on: st === 5 || st === 7 },
      { k: 'Tone', v: 'CTCSS', on: st === 6 || st === 7 },
    ]} />
  );
}
