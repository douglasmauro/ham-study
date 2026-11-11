import type { SceneProps } from '../data';
import { C, Formula, T, useFlow } from '../parts';

// Pool: T3B04 and T3B11 (speed of light, 300,000,000 m/s), T5A04 and T5A06 (frequency, hertz),
// T3B12 (all frequencies travel at the same speed), T3B05 (wavelength shortens as frequency rises),
// T3B06 (meters = 300 / MHz), T3B07 (bands are named by approximate wavelength).
const X0 = 15;
const X1 = 335;
const PX_PER_M = 40; // the ruler is to scale: 8 meters across
const SPEED = 90; // px per second, the same for every wave
const L2M = (300 / 146) * PX_PER_M; // 146 MHz: about 2 m
const L6M = (300 / 50) * PX_PER_M; // 50 MHz: 6 m

function wavePath(lambda: number, cycles: number, y0: number, amp: number) {
  let d = '';
  for (let x = X0; x <= X1; x += 2) {
    const y = y0 - amp * Math.sin(2 * Math.PI * (cycles - (x - X0) / lambda));
    d += (x === X0 ? 'M' : 'L') + x + ' ' + y.toFixed(1);
  }
  return d;
}

function Bracket({ x, w, y, label, hot }: { x: number; w: number; y: number; label: string; hot?: boolean }) {
  const col = hot ? C.topic : C.text2;
  return (
    <g>
      <path d={`M${x} ${y - 5} V${y + 5} M${x} ${y} H${x + w} M${x + w} ${y - 5} V${y + 5}`} style={{ stroke: col, strokeWidth: 2, strokeLinecap: 'round', fill: 'none' }} />
      <text x={Math.max(x + w / 2, x + 34)} y={y - 9} text-anchor="middle" style={{ ...T.label, fill: col }}>{label}</text>
    </g>
  );
}

export function WavelengthScene({ step: st, t, ts }: SceneProps) {
  // one wave for most of the clip; its length depends on the line being spoken
  let lambda = 120;
  if (st === 3) lambda = 120 * Math.pow(2, -Math.sin(Math.min(ts, 60) * 1.1)); // frequency sweeps up, then down
  if (st === 5) lambda = L2M;
  if (st === 6) lambda = L6M;
  const cycles = useFlow(t, SPEED / lambda);
  const cyclesHi = useFlow(t, SPEED / L2M);
  const cyclesLo = useFlow(t, SPEED / L6M);
  const wave = { fill: 'none', stroke: C.topic, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const ruler = st >= 4;
  const both = st >= 7;
  const mhz = Math.round((300 / (lambda / PX_PER_M)));
  return (
    <svg viewBox="0 0 350 230" role="img" aria-label="A radio wave moving to the right above a ruler marked in meters. A shorter wave has a higher frequency.">
      {both ? (
        <>
          <text x={X0} y="18" style={T.label}>146 MHz: the 2 meter band</text>
          <path d={wavePath(L2M, cyclesHi, 46, 18)} style={wave} />
          <Bracket x={X0} w={L2M} y={86} label="2 m" hot />
          <text x={X0 + 110} y="90" style={T.label}>50 MHz: the 6 meter band</text>
          <path d={wavePath(L6M, cyclesLo, 130, 18)} style={wave} />
          <Bracket x={X0} w={L6M} y={176} label="6 m" hot />
        </>
      ) : (
        <>
          <path d={`M${X0} 110 H${X1}`} style={{ stroke: C.line, strokeWidth: 1.5, strokeDasharray: '4 6' }} />
          <path d={wavePath(lambda, cycles, 110, 42)} style={wave} />
          {st <= 0 && (
            <g>
              <text x={X1} y="26" text-anchor="end" style={{ ...T.label, fill: C.accent }}>speed of light</text>
              <path d="M236 40 H330 M322 34 l8 6 l-8 6" style={{ stroke: C.accent, strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }} />
            </g>
          )}
          {st === 1 && (
            <g>
              <path d="M250 52 V172" style={{ stroke: C.accent, strokeWidth: 2, strokeDasharray: '3 5', strokeLinecap: 'round' }} />
              <text x="250" y="40" text-anchor="middle" style={{ ...T.label, fill: C.accent }}>cycles passing: {Math.floor(Math.min(ts, 60) * SPEED / lambda)}</text>
            </g>
          )}
          {st >= 2 && st <= 3 && <Bracket x={X0} w={lambda} y={46} label="one wavelength" hot={st === 2} />}
          {st === 3 && <text x={X1} y="26" text-anchor="end" style={{ ...T.label, fill: C.accent }}>frequency {lambda < 118 ? 'higher' : lambda > 122 ? 'lower' : ''}</text>}
          {st === 4 && <Bracket x={X0} w={lambda} y={46} label="wavelength" />}
          {st >= 5 && <Bracket x={X0} w={lambda} y={46} label={st === 5 ? 'about 2 m' : '6 m'} hot />}
          {st >= 5 && <text x={X1} y="26" text-anchor="end" style={{ ...T.value, fill: C.accent }}>{mhz} MHz</text>}
        </>
      )}
      {/* ruler in meters, to scale with the wave */}
      <g style={{ opacity: ruler ? 1 : 0.25 }}>
        <path d={`M${X0} 198 H${X1}`} style={{ stroke: C.muted, strokeWidth: 2, strokeLinecap: 'round' }} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((m) => (
          <g>
            <path d={`M${X0 + m * PX_PER_M} 198 v7`} style={{ stroke: C.muted, strokeWidth: 2, strokeLinecap: 'round' }} />
            <text x={X0 + m * PX_PER_M} y="220" text-anchor="middle" style={{ ...T.label, fill: C.muted }}>{m}</text>
          </g>
        ))}
        <text x={X1} y="190" text-anchor="end" style={{ ...T.label, fill: C.muted }}>meters</text>
      </g>
    </svg>
  );
}

export function WavelengthExtra({ step: st }: { step: number }) {
  const work = st >= 7 ? '2 m band, 6 m band' : st === 6 ? '300 ÷ 50 = 6 m' : st === 5 ? '300 ÷ 146 ≈ 2 m' : '300 ÷ megahertz';
  return (
    <Formula formula="m = 300 ÷ MHz" work={work} dim={st < 4}>
      <div class={`clip-side${st === 3 ? ' hot' : ''}`}>
        <span>Frequency <b>up</b></span>
        <span>Wavelength <b>shorter</b></span>
      </div>
    </Formula>
  );
}
