import type { SceneProps } from '../data';
import { C, Dots, Facts, T, ease, lerp, useFlow, type Pt } from '../parts';

// Pool: T9B12 (SWR measures how well a load is matched to a transmission line),
// T7C04 (1:1 is a perfect match), T7C06 (4:1 indicates an impedance mismatch),
// T7C05 (solid-state transmitters reduce power at high SWR to protect the output transistors),
// T7C08 (a directional wattmeter can be used to determine SWR).
const FWD: Pt[] = [[100, 150], [272, 150]];
const REF: Pt[] = [[272, 162], [100, 162]];
const GX = 186;
const GY = 100;

/** What the picture shows on each line: is power coming back, and what the meter reads. */
function state(st: number) {
  const mismatch = st === 2 || st === 3 || st === 5 || st === 6;
  const reading = st < 3 ? null : mismatch ? '4:1' : '1:1';
  return { mismatch, reading };
}

export function SwrScene({ step: st, t, ts }: SceneProps) {
  const off = useFlow(t, 70);
  const { mismatch, reading } = state(st);
  const prev = state(st - 1);
  const k = ease(ts);
  // needle: straight left for 1:1, well to the right for 4:1
  const angOf = (m: boolean) => (m ? 55 : 160);
  const ang = (lerp(st - 1 < 3 ? 160 : angOf(prev.mismatch), st < 3 ? 160 : angOf(mismatch), k) * Math.PI) / 180;
  const cut = st === 6; // transmitter has folded its power back
  const meterHot = st === 3 || st === 7;
  const radiate = st >= 1 ? (mismatch ? 0.3 : 1) : 0.15;
  const pulse = (t * 1.2) % 1;
  return (
    <svg viewBox="0 0 350 230" role="img" aria-label="A transmitter, a feed line and an antenna. Forward power goes to the antenna, reflected power comes back, and a meter shows the SWR.">
      {/* legend */}
      <circle cx="20" cy="18" r="4" style={{ fill: C.accent }} />
      <text x="30" y="22" style={T.label}>forward</text>
      <g style={{ opacity: st >= 2 ? 1 : 0.3 }}>
        <circle cx="96" cy="18" r="4" style={{ fill: C.bad }} />
        <text x="106" y="22" style={T.label}>reflected</text>
      </g>
      {/* SWR meter */}
      <g style={{ opacity: st >= 3 ? 1 : 0.25 }}>
        <path d={`M${GX - 46} ${GY} A46 46 0 0 1 ${GX + 46} ${GY}`} style={{ fill: 'none', stroke: meterHot ? C.topic : C.muted, strokeWidth: 3, strokeLinecap: 'round' }} />
        <path d={`M${GX} ${GY} L${(GX + 38 * Math.cos(ang)).toFixed(1)} ${(GY - 38 * Math.sin(ang)).toFixed(1)}`} style={{ stroke: C.text, strokeWidth: 3, strokeLinecap: 'round' }} />
        <circle cx={GX} cy={GY} r="4" style={{ fill: C.text }} />
        <text x={GX - 50} y={GY + 16} text-anchor="middle" style={{ ...T.label, fill: C.muted }}>1:1</text>
        <text x={GX + 50} y={GY + 16} text-anchor="middle" style={{ ...T.label, fill: C.muted }}>high</text>
        <text x={GX} y={GY - 56} text-anchor="middle" style={{ ...T.value, fill: reading === '4:1' ? C.bad : reading ? C.good : C.text2 }}>
          SWR {reading ?? ''}
        </text>
        <path d={`M${GX} ${GY + 4} V144`} style={{ stroke: C.muted, strokeWidth: 2, strokeDasharray: '3 5', strokeLinecap: 'round' }} />
      </g>
      {/* feed line */}
      <rect x="96" y="143" width="180" height="26" rx="13" style={{ fill: 'none', stroke: C.muted, strokeWidth: 2.5 }} />
      <Dots pts={FWD} off={off} gap={cut ? 44 : 22} color={C.accent} />
      {mismatch && <Dots pts={REF} off={off} gap={cut ? 60 : 30} color={C.bad} />}
      <text x="186" y="190" text-anchor="middle" style={T.label}>Feed line</text>
      {/* transmitter */}
      <rect x="12" y="124" width="84" height="62" rx="10" style={{ fill: C.surface, stroke: C.text, strokeWidth: 2.5 }} />
      <text x="54" y="206" text-anchor="middle" style={T.label}>Transmitter</text>
      <text x="54" y="146" text-anchor="middle" style={{ ...T.label, fill: cut ? C.bad : C.muted }}>{cut ? 'power cut' : 'power'}</text>
      <rect x="24" y="158" width="60" height="10" rx="5" style={{ fill: C.line }} />
      <rect x="24" y="158" width={cut ? lerp(60, 22, k) : 60} height="10" rx="5" style={{ fill: cut ? C.bad : C.accent }} />
      {/* antenna */}
      <path d="M276 156 H306 V56" style={{ fill: 'none', stroke: st === 1 ? C.topic : C.text, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      <text x="306" y="206" text-anchor="middle" style={T.label}>Antenna</text>
      {[0, 1, 2].map((i) => {
        const r = 10 + ((i + pulse) % 3) * 9;
        return (
          <path d={`M${306 - r} ${72 - r} A${r * 1.4} ${r * 1.4} 0 0 0 ${306 - r} ${72 + r} M${306 + r} ${72 - r} A${r * 1.4} ${r * 1.4} 0 0 1 ${306 + r} ${72 + r}`}
            style={{ fill: 'none', stroke: C.accent, strokeWidth: 2.5, strokeLinecap: 'round', opacity: radiate * (1 - r / 42) }} />
        );
      })}
    </svg>
  );
}

export function SwrExtra({ step: st }: { step: number }) {
  return (
    <Facts items={[
      { k: 'SWR 1:1', v: 'perfect match', on: st === 4 || st === 7, tone: 'good' },
      { k: 'SWR 4:1', v: 'mismatch', on: st === 5 || st === 6 || st === 7, tone: 'bad' },
    ]} />
  );
}
