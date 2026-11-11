import type { SceneProps } from '../data';
import { C, Dots, Facts, T, pathLen, useFlow, type Pt } from '../parts';

// Pool: T3C11 (the atmosphere refracts radio waves slightly, so "nearly" straight),
// T3C01 (UHF is usually not propagated by the ionosphere, so rarely heard past the radio horizon),
// T3A11 (the ionosphere can reflect HF radio waves), T3B10 (HF is 3 to 30 MHz),
// T3B08 (VHF is 30 to 300 MHz), T3B09 (UHF is 300 to 3000 MHz),
// T3C02 (long-distance ionospheric propagation is far more common on HF).
const EARTH = { cx: 175, cy: 640, r: 470 };
const SKY_R = 605;
const yOn = (x: number, r: number) => EARTH.cy - Math.sqrt(r * r - (x - EARTH.cx) ** 2);
const A: Pt = [60, yOn(60, EARTH.r) - 18];
const B: Pt = [150, yOn(150, EARTH.r) - 18];
const FAR: Pt = [310, yOn(310, EARTH.r) - 18];
// straight on past the nearby station, over the horizon and out to space
const SPACE: Pt = [350, A[1] + ((B[1] - A[1]) / (B[0] - A[0])) * (350 - A[0])];
const LOS: Pt[] = [A, B];
const LOS_ON: Pt[] = [A, B, SPACE];
const TOP: Pt = [185, yOn(185, SKY_R)];
const HOP: Pt[] = [A, TOP, FAR];
const THROUGH: Pt[] = [A, [128, yOn(128, SKY_R)], [152, 0]];
const SPEED = 85;

function Station({ p, label, color }: { p: Pt; label: string; color: string }) {
  return (
    <g>
      <path d={`M${p[0]} ${p[1] + 18} V${p[1]}`} style={{ stroke: color, strokeWidth: 2.5, strokeLinecap: 'round' }} />
      <circle cx={p[0]} cy={p[1]} r="4" style={{ fill: color }} />
      <text x={p[0]} y={p[1] + 36} text-anchor="middle" style={{ ...T.label, fill: color === C.muted ? C.muted : C.text2 }}>{label}</text>
    </g>
  );
}

export function PropagationScene({ step: st, t, ts }: SceneProps) {
  const off = useFlow(t, SPEED);
  const reach = ts * SPEED; // how far a signal has travelled since this line began
  const sky = st >= 3;
  const los = st === 1 || st === 7;
  const losOn = st === 2;
  const hop = st === 4 || st === 5 || st === 7;
  const through = st === 6;
  const farHeard = (st === 4 && reach > pathLen(HOP)) || st === 5 || st === 7;
  const arc = (r: number) => `M0 ${yOn(0, r).toFixed(1)} A${r} ${r} 0 0 1 350 ${yOn(350, r).toFixed(1)}`;
  return (
    <svg viewBox="0 0 350 230" role="img" aria-label="The curve of the Earth with the ionosphere above. A VHF signal travels straight to a nearby station. An HF signal reflects off the ionosphere and comes down far away.">
      {/* ionosphere */}
      <path d={arc(SKY_R)} style={{ fill: 'none', stroke: C.topic, strokeWidth: 10, strokeDasharray: '2 9', strokeLinecap: 'round', opacity: sky ? 0.9 : 0.25 }} />
      {sky && <text x="12" y="20" style={{ ...T.label, fill: C.topic }}>Ionosphere</text>}
      {/* Earth */}
      <path d={`${arc(EARTH.r)} V230 H0 Z`} style={{ fill: C.raised, stroke: C.muted, strokeWidth: 3, strokeLinejoin: 'round' }} />
      {st === 0 && (
        <>
          <Dots pts={LOS_ON} off={off} gap={24} upTo={reach} />
          <Dots pts={[A, [20, 120]]} off={off} gap={24} upTo={reach} />
          <Dots pts={[A, [120, 70]]} off={off} gap={24} upTo={reach} />
        </>
      )}
      {los && <Dots pts={LOS} off={off} gap={20} upTo={st === 7 ? undefined : reach} />}
      {losOn && <Dots pts={LOS_ON} off={off} gap={20} />}
      {hop && <Dots pts={HOP} off={off} gap={22} color={C.topic} upTo={st === 4 ? reach : undefined} />}
      {through && <Dots pts={THROUGH} off={off} gap={22} upTo={reach} />}
      {(st === 1 || st === 2) && <text x="104" y={A[1] - 16} text-anchor="middle" style={{ ...T.label, fill: C.accent }}>line of sight</text>}
      {st === 2 && <text x="342" y={SPACE[1] - 10} text-anchor="end" style={{ ...T.label, fill: C.accent }}>out to space</text>}
      {st === 6 && <text x="84" y="96" text-anchor="end" style={{ ...T.label, fill: C.accent }}>VHF, UHF</text>}
      {(st === 4 || st === 5) && <text x="252" y="100" style={{ ...T.label, fill: C.topic }}>HF</text>}
      {st === 7 && <text x="164" y={B[1] - 8} style={{ ...T.label, fill: C.accent }}>VHF, UHF: local</text>}
      {st === 7 && <text x="185" y="104" text-anchor="middle" style={{ ...T.label, fill: C.topic }}>HF: long distance</text>}
      <Station p={A} label="You" color={C.text} />
      <Station p={B} label="Nearby" color={st === 1 || st === 2 || st === 7 ? C.good : C.text} />
      <Station p={FAR} label={st === 2 || st === 6 ? 'Not heard' : farHeard ? 'Heard' : 'Far away'} color={farHeard ? C.good : st === 2 || st === 6 ? C.muted : C.text} />
    </svg>
  );
}

export function PropagationExtra({ step: st }: { step: number }) {
  const local = st === 1 || st === 2 || st === 6 || st === 7;
  return (
    <Facts items={[
      { k: 'HF', v: '3 to 30 MHz', on: st === 4 || st === 5 || st === 7 },
      { k: 'VHF', v: '30 to 300 MHz', on: local },
      { k: 'UHF', v: '300 to 3000 MHz', on: local },
    ]} />
  );
}
