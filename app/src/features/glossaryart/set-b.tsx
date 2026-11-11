import type { ComponentChildren } from 'preact';
import { Art, T, wave, type TermArt } from './kit';

/* Set B: radio wave propagation (T3), antennas and feed lines (T9), station setup and controls (T4). */

/* ---------- small shared helpers ---------- */

const n = (v: number) => +v.toFixed(1);
const rad = (deg: number) => (deg * Math.PI) / 180;

/** A straight line with an arrowhead at the end (and at the start when `both`). */
function Ar({ x1, y1, x2, y2, c = 'ga-s', h = 6, both = false }: { x1: number; y1: number; x2: number; y2: number; c?: string; h?: number; both?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = (x: number, y: number, ang: number) =>
    `M${n(x - h * Math.cos(ang - 0.5))} ${n(y - h * Math.sin(ang - 0.5))}L${x} ${y}L${n(x - h * Math.cos(ang + 0.5))} ${n(y - h * Math.sin(ang + 0.5))}`;
  return <path class={c} d={`M${x1} ${y1}L${x2} ${y2}${head(x2, y2, a)}${both ? head(x1, y1, a + Math.PI) : ''}`} />;
}

/** Just an arrowhead at (x, y) pointing along `deg` (0 = right, 90 = down). */
function Head({ x, y, deg, c = 'ga-s', h = 6 }: { x: number; y: number; deg: number; c?: string; h?: number }) {
  const a = rad(deg);
  return <path class={c} d={`M${n(x - h * Math.cos(a - 0.5))} ${n(y - h * Math.sin(a - 0.5))}L${x} ${y}L${n(x - h * Math.cos(a + 0.5))} ${n(y - h * Math.sin(a + 0.5))}`} />;
}

/** Arc of a circle from angle a0 to a1 (degrees, 0 = right, 90 = down). */
function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
  return `M${n(x0)} ${n(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${n(x1)} ${n(y1)}`;
}
/** Several arcs around one point: radio waves spreading out. */
const rings = (cx: number, cy: number, rs: number[], a0: number, a1: number) => rs.map((r) => arc(cx, cy, r, a0, a1)).join('');

/** A sine wave whose height changes from a0 to a1 between xa and xb (constant outside). */
function fadeWave(x0: number, x1: number, y: number, length: number, a0: number, a1: number, xa: number, xb: number): string {
  let d = '';
  for (let x = x0; x <= x1; x += 1) {
    const k = Math.min(1, Math.max(0, (x - xa) / (xb - xa)));
    const yy = y - (a0 + (a1 - a0) * k) * Math.sin(((x - x0) / length) * 2 * Math.PI);
    d += `${x === x0 ? 'M' : 'L'}${x} ${yy.toFixed(1)}`;
  }
  return d;
}

/** A wave whose frequency rises and falls while its height stays the same (FM). */
function fmWave(x0: number, x1: number, y: number, amp: number): string {
  let d = '', ph = 0;
  for (let x = x0; x <= x1; x += 0.5) {
    ph += 0.5 * (0.42 + 0.26 * Math.sin(((x - x0) / (x1 - x0)) * 4 * Math.PI));
    d += `${x === x0 ? 'M' : 'L'}${x} ${(y - amp * Math.sin(ph)).toFixed(1)}`;
  }
  return d;
}

/** A box with rounded corners and an optional centered label. */
function Box({ x, y, w, h, c = 'ga-w', t, tc = '' }: { x: number; y: number; w: number; h: number; c?: string; t?: string; tc?: string }) {
  return (
    <>
      <rect class={c} x={x} y={y} width={w} height={h} rx="4" />
      {t ? <T x={x + w / 2} y={y + h / 2 + 4} a="middle" c={tc}>{t}</T> : null}
    </>
  );
}

/** The antenna symbol of the exam figures: a triangle, point down, with a line through it. Apex at (x, y). */
function Ant({ x, y, s = 14, c = 'ga-w', stem = 10 }: { x: number; y: number; s?: number; c?: string; stem?: number }) {
  return <path class={c} d={`M${x} ${y + stem}V${y - s}M${n(x - s * 0.7)} ${y - s}H${n(x + s * 0.7)}L${x} ${y}Z`} />;
}

/* The curved Earth used by the long-distance pictures. */
const earthY = (x: number) => 132 - 64 * (x / 240) * (1 - x / 240);
function Earth() {
  return (
    <>
      <path class="ga-fw ga-soft" d="M0 132Q120 100 240 132V140H0Z" />
      <path class="ga-w" d="M0 132Q120 100 240 132" />
    </>
  );
}
/** A sky layer following the Earth's curve; `top` is its height at the middle of the picture. */
const layer = (top: number) => `M0 ${top + 16}Q120 ${top - 16} 240 ${top + 16}`;
/** A small station (mast with the antenna symbol) standing on the curved Earth. */
function Stn({ x, c = 'ga-w' }: { x: number; c?: string }) {
  const g = n(earthY(x));
  return <Ant x={x} y={g - 8} s={9} c={c} stem={8} />;
}

/** A car seen from the side; (x, y) is where the rear wheel meets the road. Drawn 80 x 32 before scaling. */
function Car({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path class="ga-w ga-thin" d="M0 -6V-16Q0 -20 6 -20H16L24 -32H52L62 -20L76 -18Q80 -17 80 -12V-6Z" />
      <path class="ga-w ga-thin" d="M28 -29H38V-20H22ZM42 -29H50L57 -20H42Z" />
      <circle class="ga-fbg ga-w ga-thin" cx="18" cy="-6" r="6" />
      <circle class="ga-fbg ga-w ga-thin" cx="62" cy="-6" r="6" />
    </g>
  );
}

/** A handheld radio; (x, y) is the top left corner of its 22 x 40 body. */
function HT({ x, y, c = 'ga-w', ant = 22 }: { x: number; y: number; c?: string; ant?: number }) {
  return (
    <>
      <rect class={c} x={x} y={y} width="22" height="40" rx="3" />
      <path class={c} d={`M${x + 5} ${y}V${y - ant}`} />
      <path class={`${c} ga-thin`} d={`M${x + 5} ${y + 7}H${x + 17}V${y + 15}H${x + 5}ZM${x + 6} ${y + 23}H${x + 16}M${x + 6} ${y + 29}H${x + 16}`} />
    </>
  );
}

/** A laptop; (x, y) is the top left of the screen. 44 wide, 38 tall with the base. */
function Laptop({ x, y, children }: { x: number; y: number; children?: ComponentChildren }) {
  return (
    <>
      <rect class="ga-w" x={x} y={y} width="44" height="30" rx="2" />
      <path class="ga-w" d={`M${x - 6} ${y + 36}H${x + 50}`} />
      {children}
    </>
  );
}

/** A round control knob with a pointer. */
function Knob({ x, y, r = 10, c = 'ga-k', deg = -50 }: { x: number; y: number; r?: number; c?: string; deg?: number }) {
  return (
    <>
      <circle class={c} cx={x} cy={y} r={r} />
      <path class={c} d={`M${x} ${y}L${n(x + r * 0.8 * Math.cos(rad(deg)))} ${n(y + r * 0.8 * Math.sin(rad(deg)))}`} />
    </>
  );
}

/** A meter face: an arc scale with ticks and a needle. (cx, cy) is the needle pivot. */
function Dial({ cx, cy, r, deg, c = 'ga-k' }: { cx: number; cy: number; r: number; deg: number; c?: string }) {
  const ticks = [-150, -120, -90, -60, -30].map((a) => `M${n(cx + r * Math.cos(rad(a)))} ${n(cy + r * Math.sin(rad(a)))}L${n(cx + (r - 5) * Math.cos(rad(a)))} ${n(cy + (r - 5) * Math.sin(rad(a)))}`).join('');
  return (
    <>
      <path class="ga-w ga-thin" d={arc(cx, cy, r, -150, -30) + ticks} />
      <path class={c} d={`M${cx} ${cy}L${n(cx + (r - 8) * Math.cos(rad(deg)))} ${n(cy + (r - 8) * Math.sin(rad(deg)))}`} />
      <circle class={c.replace('ga-', 'ga-f')} cx={cx} cy={cy} r="2.5" />
    </>
  );
}

/* ---------- T3: radio waves ---------- */

/** The radio spectrum from 3 to 3000 MHz with one range picked out. */
function Spectrum({ hl }: { hl: 'VHF' | 'UHF' }) {
  const seg = [['HF', 22], ['VHF', 88], ['UHF', 154]] as const;
  return (
    <Art label={`A frequency scale from 3 to 3000 megahertz split into HF, VHF and UHF, with ${hl} picked out: ${hl === 'VHF' ? '30 to 300' : '300 to 3000'} megahertz. The waves above get shorter as frequency rises.`}>
      <path class="ga-s ga-thin" d={wave(22, 88, 36, 44, 12) + wave(88, 154, 36, 22, 12) + wave(154, 220, 36, 8.25, 12)} />
      {seg.map(([name, x]) => (
        <>
          {name === hl ? <rect class="ga-fk ga-soft" x={x} y="62" width="66" height="28" /> : null}
          <rect class={name === hl ? 'ga-k' : 'ga-w ga-thin'} x={x} y="62" width="66" height="28" />
          <T x={x + 33} y={80} a="middle" c={name === hl ? 'ga-tk ga-tb' : 'ga-tm'}>{name}</T>
        </>
      ))}
      <T x={22} y={108} a="middle" c="ga-tm">3</T>
      <T x={88} y={108} a="middle" c={hl === 'VHF' ? 'ga-tk ga-tb' : 'ga-tm'}>30</T>
      <T x={154} y={108} a="middle" c="ga-tk ga-tb">300</T>
      <T x={218} y={108} a="middle" c={hl === 'UHF' ? 'ga-tk ga-tb' : 'ga-tm'}>3000</T>
      <T x={120} y={128} a="middle" c="ga-tm">megahertz (MHz)</T>
    </Art>
  );
}

/** A radio wave drawn as its two fields: electric (up and down) and magnetic (slanted, at right angles). */
function EM({ hl }: { hl: 'e' | 'm' | 'both' }) {
  const x0 = 34, x1 = 194, y = 70, len = 80, amp = 26;
  let m = '';
  for (let x = x0; x <= x1; x += 2) {
    const s = Math.sin(((x - x0) / len) * 2 * Math.PI);
    m += `${x === x0 ? 'M' : 'L'}${n(x - 16 * s)} ${n(y + 12 * s)}`;
  }
  const peaks = [x0 + len / 4, x0 + (3 * len) / 4, x0 + (5 * len) / 4, x0 + (7 * len) / 4];
  const ec = hl === 'm' ? 'ga-w' : 'ga-k', mc = hl === 'e' ? 'ga-w' : 'ga-k';
  const label = hl === 'e'
    ? 'A radio wave travelling to the right. Its electric field, picked out, swings up and down; the magnetic field lies at right angles to it.'
    : hl === 'm'
      ? 'A radio wave travelling to the right. Its magnetic field, picked out, swings side to side, at right angles to the electric field.'
      : 'An electromagnetic wave travelling to the right: an electric field swinging up and down and a magnetic field at right angles to it, moving together.';
  return (
    <Art label={label}>
      <Ar x1={22} y1={y} x2={222} y2={y} c="ga-s ga-thin" />
      <path class={`${mc} ga-thin`} d={peaks.map((p, i) => `M${p} ${y}L${p - (i % 2 ? -16 : 16)} ${y + (i % 2 ? -12 : 12)}`).join('')} />
      <path class={mc} d={m} />
      <path class={`${ec} ga-thin`} d={peaks.map((p, i) => `M${p} ${y}V${y + (i % 2 ? amp : -amp)}`).join('')} />
      <path class={ec} d={wave(x0, x1, y, len, amp)} />
      <T x={84} y={20} c={hl === 'm' ? 'ga-tm' : 'ga-tk ga-tb'}>electric field</T>
      <T x={30} y={128} c={hl === 'e' ? 'ga-tm' : 'ga-tk ga-tb'}>magnetic field</T>
      <T x={232} y={90} a="end" c="ga-ts">travel</T>
    </Art>
  );
}

/** One antenna and the wave it makes, with the electric field direction drawn in. */
function Pol({ kind }: { kind: 'v' | 'h' }) {
  if (kind === 'v') {
    const pk = [85, 125, 165, 205];
    return (
      <Art label="An upright antenna sends a wave whose electric field swings up and down, at right angles to the ground: vertical polarization.">
        <path class="ga-w" d="M10 118H230" />
        <path class="ga-w ga-thick" d="M34 118V46" />
        <path class="ga-s ga-thin" d="M48 82H226" />
        <path class="ga-s" d={wave(65, 225, 82, 80, 24)} />
        {pk.map((p, i) => <Ar x1={p} y1={82} x2={p} y2={i % 2 ? 103 : 61} c="ga-k" h={5} />)}
        <T x={130} y={22} a="middle" c="ga-tk ga-tb">electric field: up and down</T>
        <T x={34} y={38} a="middle" c="ga-tm">antenna</T>
        <T x={228} y={132} a="end" c="ga-tm">ground</T>
      </Art>
    );
  }
  let d = '';
  for (let x = 70; x <= 222; x += 2) {
    const s = Math.sin(((x - 70) / 76) * 2 * Math.PI);
    d += `${x === 70 ? 'M' : 'L'}${n(x - 17 * s)} ${n(66 + 12 * s)}`;
  }
  const pk = [89, 127, 165, 203];
  return (
    <Art label="An antenna whose element lies parallel to the ground sends a wave whose electric field swings side to side, parallel to the ground: horizontal polarization.">
      <path class="ga-w ga-thin" d="M8 122H196L232 98H44Z" />
      <path class="ga-w" d="M36 110V66" />
      <path class="ga-w ga-thick" d="M16 80L56 52" />
      <path class="ga-s ga-thin" d="M56 66H228" />
      <path class="ga-s" d={d} />
      {pk.map((p, i) => <Ar x1={p} y1={66} x2={p + (i % 2 ? 15 : -15)} y2={66 + (i % 2 ? -10.5 : 10.5)} c="ga-k" h={5} />)}
      <T x={130} y={22} a="middle" c="ga-tk ga-tb">electric field: side to side</T>
      <T x={150} y={115} a="middle" c="ga-tm">parallel to the ground</T>
    </Art>
  );
}

/** Earth, two stations and a signal that goes up to something in the sky and comes back down. */
function SkyBounce({ top, children }: { top: number; children?: ComponentChildren }) {
  return (
    <>
      <Earth />
      <Stn x={30} />
      <Stn x={210} />
      {children}
      <path class="ga-s" d={`M30 ${n(earthY(30) - 20)}L120 ${top}L210 ${n(earthY(210) - 20)}`} />
      <Head x={210} y={n(earthY(210) - 20)} deg={Math.atan2(earthY(210) - 20 - top, 90) * 180 / Math.PI} />
    </>
  );
}

/** A station on a strongly curved Earth with the straight sight line and the slightly bent radio path. */
function HorizonScene({ marks }: { marks: boolean }) {
  return (
    <>
      <path class="ga-fw ga-soft" d="M0 110Q120 50 240 110V140H0Z" />
      <path class="ga-w" d="M0 110Q120 50 240 110" />
      <Ant x={40} y={66} s={10} stem={27} />
      <path class="ga-w ga-thin ga-dash" d={marks ? 'M40 53L179 87' : 'M40 53L232 100'} />
      <path class="ga-s" d="M40 53Q135 62 205 95" />
      {marks ? (
        <>
          <circle class="ga-fw" cx="179" cy="87.3" r="4" />
          <circle class="ga-fk" cx="205" cy="95" r="4" />
        </>
      ) : <Head x={205} y={95} deg={38} />}
    </>
  );
}

/** A transmitter and receiver seen from above with a building that reflects the signal. */
function BounceMap({ blocked }: { blocked: boolean }) {
  return (
    <>
      <rect class={blocked ? 'ga-k' : 'ga-w'} x="88" y="14" width="64" height="24" rx="2" />
      <T x={120} y={31} a="middle" c={blocked ? 'ga-tk' : 'ga-tm'}>building</T>
      <Ant x={24} y={100} s={10} />
      <Ant x={216} y={100} s={10} />
      <path class="ga-s" d="M30 86L120 40L206 84" />
      <Head x={206} y={84} deg={27} />
    </>
  );
}

const T3: Record<string, TermArt> = {
  '6-meter-band': () => (
    <Art label="A wave with one wavelength marked as about 6 meters, above a scale of the VHF range from 30 to 300 megahertz with the 6-meter band marked near the bottom end.">
      <path class="ga-s" d={wave(30, 210, 30, 90, 14)} />
      <path class="ga-k" d="M30 56H120M30 51V61M120 51V61" />
      <T x={128} y={60} c="ga-tk ga-tb">about 6 meters</T>
      <T x={72} y={84} a="middle" c="ga-tk">6 m band</T>
      <rect class="ga-w" x="30" y="94" width="180" height="12" rx="3" />
      <rect class="ga-fk" x="68" y="90" width="8" height="20" rx="2" />
      <T x={30} y={126} c="ga-tm">30</T>
      <T x={120} y={126} a="middle" c="ga-tm">VHF</T>
      <T x={212} y={126} a="end" c="ga-tm">300 MHz</T>
    </Art>
  ),
  absorption: () => (
    <Art label="A strong wave enters a clump of trees and comes out the other side much weaker: the vegetation has absorbed part of the signal.">
      {[100, 120, 140].map((x) => (
        <>
          <path class="ga-k" d={`M${x} 112V86`} />
          <circle class="ga-fk ga-soft" cx={x} cy={66} r="16" />
          <circle class="ga-k ga-thin" cx={x} cy={66} r="16" />
        </>
      ))}
      <path class="ga-w" d="M10 112H230" />
      <path class="ga-s" d={fadeWave(12, 222, 66, 21, 18, 4, 88, 152)} />
      <Head x={228} y={66} deg={0} />
      <T x={120} y={24} a="middle" c="ga-tk ga-tb">vegetation absorbs</T>
      <T x={46} y={132} a="middle" c="ga-ts">strong in</T>
      <T x={190} y={132} a="middle" c="ga-ts">weak out</T>
    </Art>
  ),
  'auroral-backscatter': () => (
    <Art label="Two stations on the curved Earth. A VHF signal goes up to a glowing aurora curtain in the sky and is reflected back down to the other station, arriving distorted.">
      <Earth />
      <Stn x={40} />
      <Stn x={130} />
      {[176, 190, 204, 218].map((x, i) => <path class="ga-k" d={`M${x} ${30 + (i % 2) * 6}q-5 12 0 24t0 ${20 - (i % 2) * 6}`} />)}
      <path class="ga-s" d={`M42 ${n(earthY(40) - 20)}L186 52L134 ${n(earthY(130) - 20)}`} />
      <Head x={134} y={n(earthY(130) - 20)} deg={132} />
      <T x={197} y={20} a="middle" c="ga-tk ga-tb">aurora</T>
      <T x={70} y={50} a="middle" c="ga-ts">VHF signal</T>
      <T x={100} y={131} a="middle" c="ga-tm">arrives distorted</T>
    </Art>
  ),
  'beam-antenna': () => (
    <Art label="A beam antenna seen from above, with its parallel elements on a boom. Almost all of its signal goes out in one direction, shown as a long lobe to the right.">
      <path class="ga-s" d="M100 72C124 30 222 40 222 72C222 104 124 114 100 72" />
      <path class="ga-s ga-thin ga-dash" d="M44 72C36 62 22 64 22 72C22 80 36 82 44 72" />
      <path class="ga-w" d="M44 72H100" />
      <path class="ga-k" d="M46 46V98M64 50V94M82 54V90M100 57V87" />
      <T x={150} y={22} a="middle" c="ga-ts">most signal this way</T>
      <Ar x1={130} y1={72} x2={196} y2={72} c="ga-s ga-thin" />
      <T x={64} y={118} a="middle" c="ga-tk ga-tb">beam antenna</T>
      <T x={232} y={132} a="end" c="ga-tm">seen from above</T>
    </Art>
  ),
  'cross-polarization': () => (
    <Art label="An upright transmitting antenna sends a wave with an up-and-down electric field toward a receiving antenna that lies flat. The two do not match, so the received signal is reduced.">
      <path class="ga-w" d="M10 112H230" />
      <path class="ga-k ga-thick" d="M34 112V50" />
      <path class="ga-w" d="M196 112V72" />
      <path class="ga-k ga-thick" d="M168 72H224" />
      <path class="ga-s" d={wave(52, 148, 72, 48, 16)} />
      <Ar x1={64} y1={90} x2={64} y2={54} c="ga-s ga-thin" both h={5} />
      <T x={120} y={22} a="middle" c="ga-tk ga-tb">mismatch: weaker signal</T>
      <T x={12} y={131} c="ga-tm">vertical</T>
      <T x={228} y={131} a="end" c="ga-tm">horizontal</T>
    </Art>
  ),
  'electric-field': () => <EM hl="e" />,
  'magnetic-field': () => <EM hl="m" />,
  'electromagnetic-wave': () => <EM hl="both" />,
  'elliptical-polarization': () => (
    <Art label="A wave seen head-on. Its electric field arrow keeps turning around an ellipse instead of holding one direction, so it is a changing mix of vertical and horizontal.">
      <ellipse class="ga-w ga-thin ga-dash" cx="70" cy="70" rx="50" ry="32" />
      {[20, 70, 125, 160, 215, 250, 305].map((a) => <path class="ga-k ga-thin ga-soft" d={`M70 70L${n(70 + 50 * Math.cos(rad(a)))} ${n(70 + 32 * Math.sin(rad(a)))}`} />)}
      <Ar x1={70} y1={70} x2={n(70 + 50 * Math.cos(rad(-25)))} y2={n(70 + 32 * Math.sin(rad(-25)))} c="ga-k" />
      <path class="ga-s" d={arc(70, 70, 16, -20, 200)} />
      <Head x={n(70 + 16 * Math.cos(rad(200)))} y={n(70 + 16 * Math.sin(rad(200)))} deg={290} h={5} />
      <T x={136} y={50} c="ga-tk ga-tb">electric field</T>
      <T x={136} y={66} c="ga-tk">keeps turning</T>
      <T x={136} y={100} c="ga-tm">wave seen</T>
      <T x={136} y={116} c="ga-tm">head-on</T>
    </Art>
  ),
  'error-rate': () => {
    const sent = [1, 0, 1, 1, 0, 0, 1, 0], got = [1, 0, 0, 1, 0, 1, 1, 0];
    return (
      <Art label="A row of eight data bits as sent, and below it the same row as received with two bits changed and marked wrong. The more bits arrive wrong, the higher the error rate.">
        <T x={12} y={38} c="ga-tm">sent</T>
        <T x={12} y={84} c="ga-tm">received</T>
        {sent.map((b, i) => <T x={84 + i * 19} y={38} a="middle" c="ga-mono ga-tb">{b}</T>)}
        {got.map((b, i) => (
          <>
            {b !== sent[i] ? <rect class="ga-bad" x={76 + i * 19} y="68" width="16" height="22" rx="3" /> : null}
            <T x={84 + i * 19} y={84} a="middle" c="ga-mono ga-tb">{b}</T>
            <path class="ga-s ga-thin" d={`M${84 + i * 19} 46v10`} />
          </>
        ))}
        <path class="ga-k ga-thin" d="M122 92L134 106M179 92L167 106" />
        <T x={150} y={122} a="middle" c="ga-tk ga-tb">bits received wrongly</T>
      </Art>
    );
  },
  'f-region': () => (
    <Art label="The curved Earth with two layers of the ionosphere above it. A signal passes through the lower E region, is returned by the high F region and comes down a long distance away.">
      <path class="ga-w ga-thin ga-dash" d={layer(62)} />
      <path class="ga-fk ga-soft" d={`${layer(26)}V58Q120 26 0 58Z`} />
      <path class="ga-k" d={layer(36)} />
      <SkyBounce top={37} />
      <T x={120} y={20} a="middle" c="ga-tk ga-tb">F region</T>
      <T x={120} y={80} a="middle" c="ga-tm">E region</T>
      <T x={120} y={131} a="middle" c="ga-tm">long distance</T>
    </Art>
  ),
  fading: () => (
    <Art label="A graph of received signal strength against time. The line rises and falls again and again: the signal gets stronger and weaker.">
      <path class="ga-w" d="M30 20V110H228" />
      <path class="ga-s" d="M30 60C44 20 58 24 72 62S100 100 114 70S140 24 156 50S180 100 196 80S214 40 224 44" />
      <T x={66} y={18} c="ga-ts">stronger</T>
      <T x={92} y={104} a="middle" c="ga-ts">weaker</T>
      <T x={228} y={128} a="end" c="ga-tm">time</T>
      <T x={30} y={128} c="ga-tk ga-tb">signal strength</T>
    </Art>
  ),
  'free-space': () => (
    <Art label="A radio wave crossing empty space between two antennas, with only a few stars around and nothing in its path.">
      {[[60, 30], [104, 112], [150, 26], [186, 108], [84, 100], [200, 34]].map(([x, y]) => <circle class="ga-fw" cx={x} cy={y} r="1.5" />)}
      <Ant x={22} y={72} s={12} />
      <Ant x={218} y={72} s={12} />
      <path class="ga-s" d={wave(40, 190, 66, 30, 12)} />
      <Head x={198} y={66} deg={0} />
      <T x={120} y={24} a="middle" c="ga-tk ga-tb">nothing in the way</T>
      <T x={120} y={128} a="middle" c="ga-tm">empty space</T>
    </Art>
  ),
  'horizontal-polarization': () => <Pol kind="h" />,
  'vertical-polarization': () => <Pol kind="v" />,
  ionosphere: () => (
    <Art label="The curved Earth with the Sun shining on a charged layer high in the atmosphere, the ionosphere. A signal from one station goes up, is returned by the layer and comes down far away.">
      <path class="ga-fk ga-soft" d={`${layer(34)}V68Q120 36 0 68Z`} />
      <path class="ga-k" d={layer(52)} />
      <circle class="ga-s" cx="20" cy="20" r="8" />
      <path class="ga-s ga-thin" d="M32 20h6M30 30l5 4M20 32v6" />
      <SkyBounce top={53} />
      <T x={120} y={47} a="middle" c="ga-tk ga-tb">ionosphere</T>
      <T x={46} y={24} c="ga-tm">charged by the Sun</T>
      <T x={120} y={131} a="middle" c="ga-tm">Earth</T>
    </Art>
  ),
  'knife-edge-diffraction': () => (
    <Art label="A transmitter on one side of a sharp mountain ridge and a receiver hidden behind it. The signal reaches the top of the ridge and bends down over the edge to the receiver.">
      <path class="ga-w" d="M10 118H230" />
      <path class="ga-fw ga-soft" d="M76 118L120 40L164 118Z" />
      <path class="ga-w" d="M76 118L120 40L164 118" />
      <Ant x={26} y={100} s={10} stem={18} />
      <Ant x={206} y={106} s={8} stem={12} />
      <path class="ga-w ga-thin ga-dash" d="M120 36L180 0" />
      <path class="ga-s" d="M32 88L120 36L198 92" />
      <Head x={198} y={92} deg={36} />
      <circle class="ga-fk" cx="120" cy="38" r="4.5" />
      <T x={14} y={22} c="ga-tk ga-tb">bends over</T>
      <T x={14} y={38} c="ga-tk ga-tb">the edge</T>
      <T x={120} y={104} a="middle" c="ga-tm">ridge</T>
    </Art>
  ),
  'line-of-sight': () => (
    <Art label="Two antennas on hilltops with a straight, unblocked signal path between them, passing above the valley.">
      <path class="ga-fw ga-soft" d="M0 122Q40 66 84 122ZM156 122Q200 66 240 122Z" />
      <path class="ga-w" d="M0 122Q40 66 84 122H156Q200 66 240 122" />
      <Ant x={40} y={68} s={11} stem={26} />
      <Ant x={200} y={68} s={11} stem={26} />
      <Ar x1={52} y1={60} x2={188} y2={60} c="ga-k" both />
      <T x={120} y={30} a="middle" c="ga-tk ga-tb">straight, clear path</T>
      <T x={120} y={84} a="middle" c="ga-tm">nothing</T>
      <T x={120} y={100} a="middle" c="ga-tm">in the way</T>
    </Art>
  ),
  'meteor-scatter': () => (
    <Art label="A meteor streaks through the upper atmosphere leaving a short-lived trail. A signal from one station reflects off the trail and comes down to a distant station. The 6-meter band works best.">
      <path class="ga-k ga-thick" d="M104 40L140 26" />
      <path class="ga-k ga-thin ga-dash" d="M144 24L186 8" />
      <circle class="ga-fk" cx="102" cy="41" r="4" />
      <SkyBounce top={36} />
      <T x={12} y={22} c="ga-tk ga-tb">meteor trail</T>
      <T x={120} y={131} a="middle" c="ga-tm">best on 6 meters</T>
    </Art>
  ),
  microwave: () => (
    <Art label="Two waves compared: a long VHF wave above, and below it a microwave whose wavelength is very short. Microwaves are at 1 gigahertz and higher.">
      <path class="ga-w" d={wave(20, 220, 30, 100, 12)} />
      <T x={20} y={60} c="ga-tm">VHF: longer waves</T>
      <path class="ga-k" d={wave(20, 220, 88, 10, 12)} />
      <T x={20} y={120} c="ga-tk ga-tb">microwaves</T>
      <T x={220} y={120} a="end" c="ga-tk">1 GHz and up</T>
    </Art>
  ),
  'multipath-propagation': () => (
    <Art label="Seen from above: a signal reaches the receiver by two routes at once, a direct path and a second path reflected off a building.">
      <BounceMap blocked={false} />
      <Ar x1={38} y1={96} x2={202} y2={96} c="ga-s" />
      <T x={120} y={114} a="middle" c="ga-ts">direct path</T>
      <T x={12} y={54} c="ga-ts">reflected</T>
      <T x={120} y={132} a="middle" c="ga-tk ga-tb">two routes at once</T>
    </Art>
  ),
  'picket-fencing': () => (
    <Art label="A moving car and, above it, a graph of its signal strength flicking rapidly up and down like the pickets of a fence: rapid flutter.">
      <path class="ga-s" d={(() => { let d = 'M14 62'; for (let i = 0; i < 18; i++) d += `L${20 + i * 12} ${i % 2 ? 62 - (i % 3) * 3 : 30 + (i % 4) * 3}`; return d; })()} />
      <T x={14} y={20} c="ga-tk ga-tb">rapid flutter</T>
      <T x={226} y={82} a="end" c="ga-tm">signal strength</T>
      <path class="ga-w" d="M10 124H230" />
      <Car x={50} y={124} />
      <path class="ga-w" d="M66 104V88" />
      <Ar x1={144} y1={108} x2={176} y2={108} c="ga-k" />
      <T x={184} y={112} c="ga-tk">moving</T>
    </Art>
  ),
  polarization: () => (
    <Art label="Two antennas. Beside the upright one the electric field arrow points up and down: vertical polarization. Beside the flat one the arrow points side to side: horizontal polarization.">
      <path class="ga-w" d="M10 104H230" />
      <path class="ga-w ga-thick" d="M40 104V36" />
      <Ar x1={72} y1={92} x2={72} y2={40} c="ga-k" both />
      <T x={58} y={124} a="middle" c="ga-tk ga-tb">vertical</T>
      <path class="ga-w" d="M176 104V56" />
      <path class="ga-w ga-thick" d="M144 56H208" />
      <Ar x1={148} y1={78} x2={204} y2={78} c="ga-k" both />
      <T x={176} y={124} a="middle" c="ga-tk ga-tb">horizontal</T>
      <T x={120} y={22} a="middle" c="ga-tm">electric field direction</T>
    </Art>
  ),
  precipitation: () => (
    <Art label="A cloud with rain falling from it. A microwave signal passing through the rain comes out weaker, so its range is reduced.">
      <path class="ga-k" d="M70 48a13 13 0 0 1 3 -25a19 19 0 0 1 36 -4a15 15 0 0 1 13 29Z" />
      <path class="ga-k ga-thin" d="M74 58l-4 10M90 58l-4 10M106 58l-4 10M122 58l-4 10M82 74l-4 10M98 74l-4 10M114 74l-4 10" />
      <path class="ga-s" d={fadeWave(14, 220, 102, 10, 11, 3, 60, 136)} />
      <Head x={227} y={102} deg={0} />
      <T x={140} y={34} c="ga-tk ga-tb">rain or snow</T>
      <T x={120} y={131} a="middle" c="ga-ts">microwaves lose range</T>
    </Art>
  ),
  propagation: () => (
    <Art label="Two stations on the curved Earth and the ways a radio wave can travel between them: straight across, or up to the ionosphere and back down.">
      <path class="ga-w ga-thin ga-dash" d={layer(34)} />
      <SkyBounce top={35} />
      <Ar x1={42} y1={n(earthY(30) - 22)} x2={198} y2={n(earthY(210) - 22)} c="ga-s" />
      <T x={120} y={22} a="middle" c="ga-tm">ionosphere</T>
      <T x={120} y={64} a="middle" c="ga-tk ga-tb">by the sky</T>
      <T x={120} y={100} a="middle" c="ga-tk ga-tb">direct</T>
      <T x={8} y={131} c="ga-tm">sends</T>
      <T x={232} y={131} a="end" c="ga-tm">receives</T>
    </Art>
  ),
  'radio-horizon': () => (
    <Art label="A station on the curved Earth. The straight line of sight touches the ground at the visual horizon; the radio signal bends slightly and reaches a little farther, to the radio horizon.">
      <HorizonScene marks />
      <T x={140} y={28} a="middle" c="ga-ts">radio waves bend slightly</T>
      <T x={170} y={112} a="end" c="ga-tm">visual horizon</T>
      <path class="ga-w ga-thin" d="M176 100L179 92" />
      <T x={232} y={130} a="end" c="ga-tk ga-tb">radio horizon</T>
      <path class="ga-k ga-thin" d="M207 118L205 100" />
    </Art>
  ),
  reflection: () => (
    <Art label="Seen from above: a hill blocks the direct path between two stations, but the signal bounces off a building and continues in a new direction to reach the other station.">
      <BounceMap blocked />
      <path class="ga-w ga-thin ga-dash" d="M38 96H92" />
      <ellipse class="ga-fw ga-soft" cx="120" cy="96" rx="26" ry="12" />
      <ellipse class="ga-w" cx="120" cy="96" rx="26" ry="12" />
      <T x={120} y={100} a="middle" c="ga-tm">hill</T>
      <T x={12} y={54} c="ga-ts">bounces</T>
      <T x={120} y={130} a="middle" c="ga-tm">direct path blocked</T>
    </Art>
  ),
  refraction: () => (
    <Art label="A station on the curved Earth. Instead of going straight out into space, the radio wave is bent slightly by the atmosphere and follows the curve of the Earth a little.">
      <HorizonScene marks={false} />
      <T x={140} y={28} a="middle" c="ga-tk ga-tb">bent by the atmosphere</T>
      <T x={232} y={84} a="end" c="ga-tm">straight</T>
      <T x={120} y={128} a="middle" c="ga-tm">Earth</T>
    </Art>
  ),
  'signal-strength': () => (
    <Art label="A receiver's signal meter with a scale from weak to strong and the needle pointing toward strong, next to an arriving radio wave.">
      <path class="ga-s" d={wave(12, 60, 56, 16, 9)} />
      <Head x={66} y={56} deg={0} />
      <rect class="ga-w" x="76" y="20" width="150" height="92" rx="6" />
      <Dial cx={151} cy={92} r={48} deg={-52} />
      <T x={88} y={104} c="ga-tm">weak</T>
      <T x={214} y={104} a="end" c="ga-tm">strong</T>
      <T x={38} y={84} a="middle" c="ga-ts">arriving</T>
      <T x={151} y={130} a="middle" c="ga-tk ga-tb">signal meter</T>
    </Art>
  ),
  'speed-of-light': () => (
    <Art label="A long wave and a short wave leave together and cover the same distance in the same time: every radio frequency travels at the speed of light, 300,000,000 meters per second.">
      <path class="ga-w" d="M26 36V104" />
      <path class="ga-s" d={wave(26, 196, 52, 68, 11)} />
      <Head x={204} y={52} deg={0} />
      <path class="ga-s" d={wave(26, 196, 88, 17, 11)} />
      <Head x={204} y={88} deg={0} />
      <path class="ga-k ga-dash" d="M206 36V104" />
      <T x={120} y={22} a="middle" c="ga-tk ga-tb">300,000,000 m per second</T>
      <T x={120} y={126} a="middle" c="ga-tm">all frequencies: same speed</T>
    </Art>
  ),
  'sporadic-e': () => (
    <Art label="The curved Earth with the E region of the ionosphere above it. A signal is returned to Earth by an occasional dense patch in the E region.">
      <path class="ga-w ga-thin ga-dash" d={layer(52)} />
      <ellipse class="ga-fk" cx="120" cy="50" rx="24" ry="5" />
      <ellipse class="ga-fk ga-soft" cx="196" cy="56" rx="14" ry="4" />
      <ellipse class="ga-fk ga-soft" cx="40" cy="57" rx="12" ry="4" />
      <SkyBounce top={55} />
      <T x={120} y={36} a="middle" c="ga-tk ga-tb">dense patch</T>
      <T x={120} y={20} a="middle" c="ga-tm">E region of the ionosphere</T>
      <T x={120} y={131} a="middle" c="ga-tm">Earth</T>
    </Art>
  ),
  'sunspot-cycle': () => (
    <Art label="The Sun with dark spots on it, next to a graph of the number of sunspots rising and falling regularly over the years.">
      <circle class="ga-s" cx="42" cy="62" r="26" />
      {[[34, 54, 4], [50, 66, 3], [40, 74, 2.5], [54, 50, 2]].map(([x, y, r]) => <circle class="ga-fk" cx={x} cy={y} r={r} />)}
      <T x={42} y={110} a="middle" c="ga-tm">Sun</T>
      <path class="ga-w" d="M92 30V100H228" />
      <path class="ga-k" d={wave(94, 226, 68, 66, 24, -Math.PI / 2)} />
      <T x={160} y={22} a="middle" c="ga-tk ga-tb">number of sunspots</T>
      <T x={160} y={120} a="middle" c="ga-tm">years</T>
    </Art>
  ),
  'temperature-inversion': () => (
    <Art label="Layers of air above the ground: cool air at the bottom, a layer of warm air sitting on top of it, and colder air above. The warm layer over cool air is the inversion.">
      <rect class="ga-fk ga-soft" x="14" y="46" width="212" height="30" />
      <path class="ga-k" d="M14 46H226M14 76H226" />
      <path class="ga-w ga-thick" d="M10 118H230" />
      <T x={120} y={30} a="middle" c="ga-tm">colder air</T>
      <T x={120} y={66} a="middle" c="ga-tk ga-tb">warm air on top</T>
      <T x={120} y={102} a="middle" c="ga-tm">cool air</T>
      <T x={120} y={134} a="middle" c="ga-tm">ground</T>
    </Art>
  ),
  'tropospheric-ducting': () => {
    const L = (x: number) => 104 - 64 * (x / 240) * (1 - x / 240);
    const xs = [22, 55, 88, 120, 152, 185, 218];
    const d = xs.map((x, i) => `${i ? 'L' : 'M'}${x} ${n(i === 0 || i === 6 ? earthY(x) - 18 : i % 2 ? L(x) + 2 : earthY(x) - 3)}`).join('');
    return (
      <Art label="The curved Earth with a layer of warm air above it. A VHF or UHF signal is trapped between the ground and the layer and is guided along the Earth far beyond the horizon.">
        <Earth />
        <path class="ga-fk ga-soft" d="M0 104Q120 72 240 104V92Q120 60 0 92Z" />
        <path class="ga-k" d="M0 104Q120 72 240 104" />
        <Stn x={22} />
        <Stn x={218} />
        <path class="ga-s" d={d} />
        <T x={120} y={50} a="middle" c="ga-tk ga-tb">warm air layer: the duct</T>
        <T x={120} y={24} a="middle" c="ga-ts">VHF and UHF guided far</T>
        <T x={120} y={133} a="middle" c="ga-tm">Earth</T>
      </Art>
    );
  },
  uhf: () => <Spectrum hl="UHF" />,
  vhf: () => <Spectrum hl="VHF" />,
  wavelength: () => (
    <Art label="A wave with the distance from one crest to the next marked as one wavelength. Wavelength in meters equals 300 divided by the frequency in megahertz.">
      <path class="ga-w ga-thin" d="M20 72H220" />
      <path class="ga-s" d={wave(30, 210, 72, 90, 24)} />
      <path class="ga-k ga-thin ga-dash" d="M52.5 32V48M142.5 32V48" />
      <Ar x1={52.5} y1={32} x2={142.5} y2={32} c="ga-k" both />
      <T x={97.5} y={22} a="middle" c="ga-tk ga-tb">one wavelength</T>
      <T x={120} y={126} a="middle" c="ga-tm">meters = 300 ÷ MHz</T>
    </Art>
  ),
};

/* ---------- T9: antennas and feed lines ---------- */

/**
 * A coaxial cable cut back in steps. With `solid` the shield is a solid ridged tube (hardline)
 * instead of braid.
 */
function CoaxCut({ solid = false }: { solid?: boolean }) {
  const braid = [];
  for (let x = 92; x < 130; x += 8) braid.push(`M${x} 54l8 32M${x + 8} 54l-8 32`);
  const ridges = [];
  for (let x = 84; x <= 132; x += 8) ridges.push(`M${x} 52V88`);
  return (
    <>
      <path class="ga-s ga-thick" d="M170 70H226" />
      <rect class="ga-fbg" x="130" y="60" width="40" height="20" />
      <rect class="ga-k ga-thin" x="130" y="60" width="40" height="20" />
      <rect class="ga-fbg" x={solid ? 78 : 90} y={solid ? 52 : 54} width={solid ? 54 : 40} height={solid ? 36 : 32} rx={solid ? 3 : 0} />
      <rect class={solid ? 'ga-k' : 'ga-k ga-thin'} x={solid ? 78 : 90} y={solid ? 52 : 54} width={solid ? 54 : 40} height={solid ? 36 : 32} rx={solid ? 3 : 0} />
      <path class="ga-k ga-thin" d={(solid ? ridges : braid).join('')} />
      <rect class="ga-fw" x="14" y="50" width={solid ? 64 : 76} height="40" rx="3" />
    </>
  );
}

/** Two round cable ends side by side: thin RG-58 and thick RG-213. */
function CoaxPair({ hl }: { hl: '58' | '213' }) {
  const end = (cx: number, r: number, on: boolean) => (
    <>
      <circle class={on ? 'ga-k ga-thick' : 'ga-w ga-thick'} cx={cx} cy={64} r={r} />
      <circle class={on ? 'ga-k ga-thin' : 'ga-w ga-thin'} cx={cx} cy={64} r={r * 0.68} />
      <circle class={on ? 'ga-fs' : 'ga-fw'} cx={cx} cy={64} r={r * 0.2} />
    </>
  );
  return (
    <Art label={`The cut ends of two 50-ohm coaxial cables: thin RG-58 and thick RG-213, with ${hl === '58' ? 'the thin, flexible RG-58' : 'the thick RG-213, which has less loss,'} picked out.`}>
      {end(62, 13, hl === '58')}
      {end(166, 28, hl === '213')}
      <T x={120} y={20} a="middle" c="ga-tm">both 50 ohms</T>
      <T x={62} y={110} a="middle" c={hl === '58' ? 'ga-tk ga-tb' : 'ga-tm'}>RG-58</T>
      <T x={62} y={126} a="middle" c={hl === '58' ? 'ga-tk' : 'ga-tm'}>thin, flexible</T>
      <T x={166} y={110} a="middle" c={hl === '213' ? 'ga-tk ga-tb' : 'ga-tm'}>RG-213</T>
      <T x={166} y={126} a="middle" c={hl === '213' ? 'ga-tk' : 'ga-tm'}>thick, less loss</T>
    </Art>
  );
}

/** A reference antenna's even pattern and a beam's long lobe; the difference between them is the gain. */
function GainScene({ hl }: { hl: 'gain' | 'ref' }) {
  const ref = hl === 'ref';
  return (
    <Art label={ref
      ? 'A simple reference antenna with its even, round pattern picked out. A beam antenna reaches farther in one direction, and that extra reach, compared with the reference, is its gain.'
      : 'The round pattern of a reference antenna and the long lobe of a beam antenna. The extra signal strength of the beam in its best direction, compared with the reference, is the gain.'}>
      <path class="ga-s ga-thin" d="M62 72C84 34 212 44 212 72C212 100 84 110 62 72" />
      <circle class={ref ? 'ga-k' : 'ga-w ga-dash'} cx="62" cy="72" r="30" />
      {ref ? <path class="ga-k ga-thick" d="M62 58V86" /> : <circle class="ga-fw" cx="62" cy="72" r="3" />}
      <Ar x1={97} y1={72} x2={207} y2={72} c={ref ? 'ga-w' : 'ga-k'} both />
      <T x={152} y={64} a="middle" c={ref ? 'ga-tm' : 'ga-tk ga-tb'}>gain</T>
      <T x={152} y={28} a="middle" c="ga-ts">beam antenna</T>
      <T x={12} y={128} c={ref ? 'ga-tk ga-tb' : 'ga-tm'}>reference antenna</T>
    </Art>
  );
}

/** The outline of a coax plug on the end of its cable, facing right toward a socket on a panel. */
function Plug({ kind }: { kind: 'pl259' | 'n' | 'bnc' }) {
  if (kind === 'bnc') {
    return (
      <>
        <path class="ga-w ga-thick" d="M12 72H52" />
        <rect class="ga-w" x="52" y="62" width="26" height="20" rx="2" />
        <rect class="ga-k" x="78" y="54" width="52" height="36" rx="4" />
        <path class="ga-k" d="M130 62H112V74" />
        <path class="ga-k ga-thin" d="M86 54V90M94 54V90" />
        <rect class="ga-w" x="166" y="60" width="40" height="24" rx="2" />
        <path class="ga-w ga-thick" d="M208 44V100" />
        <circle class="ga-fk" cx="178" cy="56" r="3.5" />
        <circle class="ga-fk" cx="178" cy="88" r="3.5" />
        <path class="ga-s" d="M130 72H150" />
      </>
    );
  }
  const isN = kind === 'n';
  const thr = [];
  for (let x = 92; x <= 132; x += 6) thr.push(`M${x} ${isN ? 54 : 50}V${isN ? 90 : 94}`);
  const sock = [];
  for (let x = 176; x <= 200; x += 6) sock.push(`M${x} ${isN ? 58 : 56}V${isN ? 86 : 88}`);
  return (
    <>
      <path class="ga-w ga-thick" d="M12 72H52" />
      <rect class="ga-w" x="52" y="62" width="34" height="20" rx="2" />
      {isN ? <path class="ga-k" d="M70 54H86V90H70L64 72Z" /> : null}
      <rect class="ga-k" x="86" y={isN ? 54 : 50} width="52" height={isN ? 36 : 44} rx="3" />
      <path class="ga-k ga-thin" d={thr.join('')} />
      <path class="ga-s" d={isN ? 'M138 72H146' : 'M138 72H156'} />
      <rect class="ga-w" x="170" y={isN ? 58 : 56} width="36" height={isN ? 28 : 32} rx="2" />
      <path class="ga-w ga-thin" d={sock.join('')} />
      <path class="ga-w ga-thick" d="M208 42V102" />
    </>
  );
}

/** A vertical rod standing on a ground line with its feed point at the bottom. */
function GroundLine() {
  return <path class="ga-w" d="M12 112H228" />;
}

const T9: Record<string, TermArt> = {
  '5-8-wave-antenna': () => (
    <Art label="Two vertical antennas side by side: a short quarter-wave and a taller five-eighths-wave. The five-eighths antenna sends a longer lobe along the ground: it has more gain.">
      <GroundLine />
      <path class="ga-w ga-thick" d="M34 112V84" />
      <path class="ga-s ga-thin ga-dash" d="M38 110C52 88 80 82 82 90C82 100 56 108 38 110" />
      <path class="ga-k ga-thick" d="M124 112V42" />
      <path class="ga-s" d="M128 110C156 86 226 84 228 96C228 106 158 110 128 110" />
      <T x={34} y={130} a="middle" c="ga-tm">1/4</T>
      <T x={124} y={130} a="middle" c="ga-tk ga-tb">5/8 wavelength</T>
      <T x={180} y={74} a="middle" c="ga-ts">more gain</T>
    </Art>
  ),
  'antenna-efficiency': () => (
    <Art label="Power is fed into an antenna. Part of it leaves as radio waves and part is lost as heat. An efficient antenna radiates most of the power it is given.">
      <path class="ga-w" d="M60 118H116" />
      <path class="ga-w ga-thick" d="M88 118V40" />
      <Ar x1={14} y1={100} x2={76} y2={100} c="ga-s ga-thick" h={8} />
      <T x={12} y={86} c="ga-ts">power in</T>
      <path class="ga-k" d={rings(88, 62, [18, 30, 42], -42, 42)} />
      <T x={140} y={36} c="ga-tk ga-tb">radiated</T>
      <path class="ga-w ga-thin" d="M104 112q4 -5 0 -10t0 -10M114 112q4 -5 0 -10t0 -10M124 112q4 -5 0 -10t0 -10" />
      <T x={136} y={110} c="ga-tm">lost as heat</T>
    </Art>
  ),
  'antenna-gain': () => <GainScene hl="gain" />,
  'reference-antenna': () => <GainScene hl="ref" />,
  'antenna-loading': () => (
    <Art label="A full-size antenna drawn dashed beside a much shorter antenna with a coil, an inductor, inserted in its element. The coil makes the short antenna act electrically longer.">
      <GroundLine />
      <path class="ga-w ga-dash" d="M36 112V20" />
      <path class="ga-w ga-thick" d="M106 112V86M106 62V46" />
      <path class="ga-k" d="M106 86a4 4 0 0 0 0 -8a4 4 0 0 0 0 -8a4 4 0 0 0 0 -8" />
      <T x={122} y={72} c="ga-tk ga-tb">loading coil</T>
      <T x={122} y={88} c="ga-tk">(an inductor)</T>
      <T x={36} y={130} a="middle" c="ga-tm">full size</T>
      <T x={152} y={130} a="middle" c="ga-tm">short, acts longer</T>
    </Art>
  ),
  'antenna-tuner': () => (
    <Art label="A station chain: radio, then an antenna tuner with two knobs, then the antenna. The tuner sits between them and matches the antenna system's impedance to the radio.">
      <Box x={12} y={56} w={50} h={36} t="radio" />
      <path class="ga-w" d="M62 74H88M152 74H200V60" />
      <rect class="ga-k" x="88" y="44" width="64" height="58" rx="4" />
      <T x={120} y={62} a="middle" c="ga-tk ga-tb">tuner</T>
      <Knob x={106} y={84} r={8} />
      <Knob x={134} y={84} r={8} deg={-120} />
      <Ant x={200} y={50} s={15} />
      <T x={200} y={96} a="middle" c="ga-tm">antenna</T>
      <T x={120} y={128} a="middle" c="ga-tm">matches the impedances</T>
    </Art>
  ),
  bnc: () => (
    <Art label="A BNC plug on a coaxial cable facing its socket. The plug has a collar with a slot, and the socket has two small studs: the collar pushes on and locks with a twist.">
      <Plug kind="bnc" />
      <T x={104} y={40} a="middle" c="ga-tk ga-tb">bayonet collar</T>
      <T x={186} y={36} a="middle" c="ga-tm">socket</T>
      <T x={120} y={124} a="middle" c="ga-tk">push on, then twist</T>
    </Art>
  ),
  'pl-259': () => (
    <Art label="A PL-259 plug on a coaxial cable facing its socket. It has a center pin and a large threaded ring that screws onto the socket.">
      <Plug kind="pl259" />
      <T x={112} y={36} a="middle" c="ga-tk ga-tb">threaded ring</T>
      <T x={150} y={116} a="middle" c="ga-ts">center pin</T>
      <path class="ga-s ga-thin" d="M150 104V78" />
      <T x={52} y={116} a="middle" c="ga-tm">coax</T>
      <T x={232} y={132} a="end" c="ga-tm">screws on</T>
    </Art>
  ),
  'type-n': () => (
    <Art label="A Type N plug on a coaxial cable facing its socket. It has a threaded nut that screws on and a fine center pin, and works well at UHF and higher frequencies.">
      <Plug kind="n" />
      <T x={108} y={40} a="middle" c="ga-tk ga-tb">threaded nut</T>
      <T x={188} y={40} a="middle" c="ga-tm">socket</T>
      <T x={120} y={124} a="middle" c="ga-tk">good at UHF and above</T>
    </Art>
  ),
  'rf-connector': () => (
    <Art label="The back of a radio with a round socket, and a coaxial cable ending in a plug about to be joined to it. Plug and socket are both RF connectors.">
      <rect class="ga-w" x="150" y="24" width="78" height="92" rx="5" />
      <T x={196} y={44} a="middle" c="ga-tm">radio</T>
      <rect class="ga-k" x="138" y="58" width="24" height="26" rx="2" />
      <path class="ga-w ga-thick" d="M12 71H50" />
      <rect class="ga-w" x="50" y="62" width="18" height="18" rx="2" />
      <rect class="ga-k" x="68" y="56" width="34" height="30" rx="3" />
      <path class="ga-k ga-thin" d="M76 56V86M84 56V86M92 56V86" />
      <path class="ga-s" d="M102 71H114" />
      <Ar x1={118} y1={71} x2={132} y2={71} c="ga-w ga-thin" h={5} />
      <T x={84} y={46} a="middle" c="ga-tk ga-tb">plug</T>
      <T x={144} y={104} a="end" c="ga-tk ga-tb">socket</T>
      <T x={30} y={96} a="middle" c="ga-tm">coax</T>
    </Art>
  ),
  broadside: () => (
    <Art label="A dipole wire seen from above with its two signal lobes. The strongest signal leaves at right angles to the length of the wire: broadside to the antenna.">
      <circle class="ga-s ga-thin" cx="86" cy="43" r="27" />
      <circle class="ga-s ga-thin" cx="86" cy="97" r="27" />
      <path class="ga-w ga-thick" d="M26 70H146" />
      <Ar x1={86} y1={70} x2={86} y2={22} c="ga-k" />
      <Ar x1={86} y1={70} x2={86} y2={118} c="ga-k" />
      <path class="ga-k ga-thin" d="M86 62H94V70" />
      <T x={126} y={30} c="ga-tk ga-tb">broadside</T>
      <T x={154} y={74} c="ga-tm">antenna wire</T>
      <T x={126} y={118} c="ga-ts">strongest signal</T>
    </Art>
  ),
  'coaxial-cable': () => (
    <Art label="A coaxial cable cut back in steps to show its layers: the outer jacket, the metal shield, the insulation and the center wire.">
      <CoaxCut />
      <T x={50} y={40} a="middle" c="ga-tm">jacket</T>
      <T x={110} y={40} a="middle" c="ga-tk ga-tb">shield</T>
      <T x={150} y={104} a="middle" c="ga-tk">insulation</T>
      <path class="ga-k ga-thin" d="M150 92V82" />
      <T x={228} y={52} a="end" c="ga-ts">center wire</T>
      <T x={50} y={112} a="middle" c="ga-tm">50 ohms</T>
    </Art>
  ),
  dipole: () => (
    <Art label="A dipole: a straight wire half a wavelength long, split at its center where the feed line connects, and held up by an insulator at each end.">
      <path class="ga-w ga-thin" d="M8 44H24M216 44H232" />
      <circle class="ga-w ga-thin" cx="27" cy="44" r="3" />
      <circle class="ga-w ga-thin" cx="213" cy="44" r="3" />
      <path class="ga-k ga-thick" d="M30 44H114M126 44H210" />
      <rect class="ga-fbg" x="114" y="39" width="12" height="10" />
      <rect class="ga-k ga-thin" x="114" y="39" width="12" height="10" rx="2" />
      <path class="ga-w" d="M118 49V120M122 49V120" />
      <Ar x1={30} y1={26} x2={210} y2={26} c="ga-w ga-thin" both h={5} />
      <T x={120} y={18} a="middle" c="ga-tk ga-tb">1/2 wavelength</T>
      <T x={132} y={68} c="ga-tk">fed at the center</T>
      <T x={132} y={108} c="ga-tm">feed line</T>
    </Art>
  ),
  'feed-line': () => (
    <Art label="A radio indoors connected by a long cable to an antenna up high. The cable carrying the signal between them is the feed line.">
      <Box x={12} y={84} w={54} h={34} t="radio" />
      <path class="ga-k ga-thick" d="M66 102H140Q160 102 160 82V64Q160 44 180 44H196" />
      <Ant x={196} y={34} s={16} stem={10} />
      <T x={106} y={92} a="middle" c="ga-tk ga-tb">feed line</T>
      <T x={204} y={66} a="middle" c="ga-tm">antenna</T>
    </Art>
  ),
  'feed-line-loss': () => (
    <Art label="Power travelling along a feed line from the radio to the antenna, drawn as an arrow that gets thinner on the way: some power is lost as heat inside the cable.">
      <Box x={12} y={66} w={46} h={30} t="radio" />
      <path class="ga-w ga-thick" d="M58 81H200V70" />
      <Ant x={200} y={64} s={12} stem={0} />
      <path class="ga-fs" d="M62 40L176 49V44L194 53L176 62V57L62 66Z" />
      <T x={62} y={30} c="ga-ts">power in</T>
      <T x={150} y={30} c="ga-ts">less out</T>
      <path class="ga-k ga-thin" d="M92 88q4 5 0 10t0 10M118 88q4 5 0 10t0 10M144 88q4 5 0 10t0 10" />
      <T x={120} y={130} a="middle" c="ga-tk ga-tb">lost as heat</T>
    </Art>
  ),
  'handheld-transceiver': () => (
    <Art label="A handheld transceiver: a small radio body with its antenna on top, a display, a speaker and a push-to-talk button on the side.">
      <rect class="ga-k" x="98" y="48" width="46" height="80" rx="6" />
      <path class="ga-k ga-thick" d="M108 48V14" />
      <path class="ga-k" d="M134 48V40" />
      <rect class="ga-k ga-thin" x="104" y="56" width="34" height="18" rx="2" />
      <path class="ga-k ga-thin" d="M106 84H136M106 91H136M106 98H136" />
      <rect class="ga-fk" x="92" y="62" width="5" height="22" rx="2" />
      {[108, 121, 134].map((x) => <circle class="ga-fk" cx={x} cy={112} r="2.2" />)}
      <T x={116} y={24} c="ga-tm">antenna</T>
      <T x={152} y={70} c="ga-tm">display</T>
      <T x={152} y={96} c="ga-tm">speaker</T>
      <T x={86} y={70} a="end" c="ga-tm">push</T>
      <T x={86} y={86} a="end" c="ga-tm">to talk</T>
    </Art>
  ),
  hardline: () => (
    <Art label="A stiff coaxial cable cut back to show a center conductor inside a solid, ridged metal tube that forms the outer shield. This is hardline, a very low loss feed line.">
      <CoaxCut solid />
      <T x={104} y={40} a="middle" c="ga-tk ga-tb">solid metal shield</T>
      <T x={228} y={56} a="end" c="ga-ts">center</T>
      <T x={46} y={112} a="middle" c="ga-tm">jacket</T>
      <T x={160} y={112} a="middle" c="ga-tm">stiff, very low loss</T>
    </Art>
  ),
  'impedance-matching': () => (
    <Art label="Two cases. Above, a 50-ohm feed line joins a 50-ohm part and all the power passes. Below, the impedances differ and part of the power is reflected back.">
      <Box x={12} y={14} w={66} h={24} t="50 ohms" c="ga-k" tc="ga-tk" />
      <Box x={116} y={14} w={66} h={24} t="50 ohms" c="ga-k" tc="ga-tk" />
      <Ar x1={82} y1={26} x2={112} y2={26} c="ga-s" />
      <T x={12} y={56} c="ga-tk ga-tb">equal: all power passes</T>
      <Box x={12} y={78} w={66} h={24} t="50 ohms" />
      <Box x={116} y={78} w={66} h={24} t="different" />
      <Ar x1={82} y1={85} x2={112} y2={85} c="ga-s" />
      <Ar x1={112} y1={96} x2={82} y2={96} c="ga-bad" />
      <T x={12} y={120} c="ga-tm">unequal: some is reflected</T>
    </Art>
  ),
  load: () => (
    <Art label="A transmitter, a feed line, and at the far end of the feed line the antenna, which receives the power: the load.">
      <Box x={12} y={56} w={76} h={32} t="transmitter" />
      <path class="ga-w ga-thick" d="M88 72H184" />
      <Ar x1={104} y1={60} x2={160} y2={60} c="ga-s" />
      <T x={132} y={50} a="middle" c="ga-ts">power</T>
      <T x={136} y={92} a="middle" c="ga-tm">feed line</T>
      <rect class="ga-k ga-dash" x="184" y="30" width="44" height="64" rx="5" />
      <Ant x={206} y={64} s={15} c="ga-k" stem={8} />
      <T x={206} y={114} a="middle" c="ga-tk ga-tb">load</T>
    </Art>
  ),
  mobile: () => (
    <Art label="A car on the road with a radio inside and an antenna on its roof sending out radio waves: operating mobile.">
      <path class="ga-w" d="M10 118H230" />
      <Car x={56} y={118} s={1.5} />
      <path class="ga-k ga-thick" d="M112 70V28" />
      <rect class="ga-k" x="126" y="80" width="16" height="9" rx="2" />
      <path class="ga-s" d={rings(112, 40, [14, 24, 34], -40, 40) + rings(112, 40, [14, 24, 34], 140, 220)} />
      <T x={184} y={76} c="ga-tk ga-tb">radio</T>
      <path class="ga-k ga-thin" d="M180 74L146 83" />
      <T x={12} y={134} c="ga-tm">in a vehicle</T>
    </Art>
  ),
  'quarter-wave-antenna': () => (
    <Art label="A quarter-wave vertical antenna: an upright radiating element one quarter of a wavelength long, fed at its base, with radial wires sloping away below it.">
      <path class="ga-w" d="M120 96L72 124M120 96L168 124M120 96V134" />
      <path class="ga-k ga-thick" d="M120 96V22" />
      <circle class="ga-fs" cx="120" cy="96" r="4" />
      <Ar x1={104} y1={24} x2={104} y2={92} c="ga-w ga-thin" both h={5} />
      <T x={96} y={56} a="end" c="ga-tk ga-tb">1/4</T>
      <T x={96} y={72} a="end" c="ga-tk ga-tb">wavelength</T>
      <T x={130} y={48} c="ga-tk">element</T>
      <T x={132} y={92} c="ga-ts">feed point</T>
      <T x={178} y={124} c="ga-tm">radials</T>
    </Art>
  ),
  'radiating-element': () => (
    <Art label="An antenna on a mast. The upright rod that sends out and picks up radio waves, the radiating element, is picked out; the radials, mast and feed line are drawn quietly.">
      <path class="ga-w" d="M70 84L40 100M70 84L100 100M70 84V132" />
      <path class="ga-w ga-thin" d="M74 88V132" />
      <path class="ga-k ga-thick" d="M70 84V18" />
      <path class="ga-s" d={rings(70, 50, [16, 28, 40], -38, 38)} />
      <T x={124} y={40} c="ga-tk ga-tb">radiating</T>
      <T x={124} y={56} c="ga-tk ga-tb">element</T>
      <T x={110} y={104} c="ga-tm">radials</T>
      <T x={84} y={128} c="ga-tm">mast and feed line</T>
    </Art>
  ),
  'radiation-pattern': () => (
    <Art label="A chart of circles around an antenna with a shape drawn on it that reaches far to the right and only a little to the left: the radiation pattern shows how strongly the antenna radiates in each direction.">
      <circle class="ga-w ga-thin" cx="112" cy="70" r="18" />
      <circle class="ga-w ga-thin" cx="112" cy="70" r="36" />
      <circle class="ga-w ga-thin" cx="112" cy="70" r="54" />
      <path class="ga-w ga-thin" d="M52 70H172M112 12V128" />
      <path class="ga-k" d="M112 70C122 40 166 44 166 70C166 96 122 100 112 70C104 60 92 62 92 70C92 78 104 80 112 70" />
      <circle class="ga-fs" cx="112" cy="70" r="3.5" />
      <T x={178} y={74} c="ga-tk ga-tb">strong</T>
      <T x={46} y={74} a="end" c="ga-tm">weak</T>
      <T x={232} y={132} a="end" c="ga-tm">from above</T>
    </Art>
  ),
  'resonant-frequency': () => (
    <Art label="Two dipoles, a long one and a short one. The longer antenna is resonant at a lower frequency; shortening it raises its resonant frequency.">
      <path class="ga-w ga-thick" d="M24 34H114M126 34H216" />
      <path class="ga-s ga-thin" d="M24 34Q120 2 216 34" />
      <T x={120} y={56} a="middle" c="ga-tm">longer: lower frequency</T>
      <path class="ga-k ga-thick" d="M70 96H114M126 96H170" />
      <path class="ga-s ga-thin" d="M70 96Q120 66 170 96" />
      <T x={120} y={120} a="middle" c="ga-tk ga-tb">shorter: higher frequency</T>
    </Art>
  ),
  'rg-213': () => <CoaxPair hl="213" />,
  'rg-58': () => <CoaxPair hl="58" />,
  'rubber-duck-antenna': () => (
    <Art label="A handheld radio with its short, flexible rubber duck antenna, and beside it, dashed, the taller full-size quarter-wave antenna it is compared with. The rubber duck has low efficiency.">
      <rect class="ga-w" x="28" y="74" width="44" height="54" rx="5" />
      <rect class="ga-w ga-thin" x="34" y="82" width="32" height="14" rx="2" />
      <rect class="ga-k" x="36" y="36" width="9" height="38" rx="4" />
      <path class="ga-k ga-thin" d="M37 68l7 -4l-7 -4l7 -4l-7 -4l7 -4l-7 -4" />
      <path class="ga-w ga-dash" d="M62 74V12" />
      <T x={84} y={24} c="ga-tm">full-size 1/4 wave</T>
      <path class="ga-w ga-thin" d="M80 20H66" />
      <T x={84} y={58} c="ga-tk ga-tb">rubber duck</T>
      <path class="ga-k ga-thin" d="M80 54H49" />
      <T x={84} y={74} c="ga-tk">short and flexible</T>
      <T x={84} y={104} c="ga-tm">low efficiency</T>
    </Art>
  ),
  shielding: () => (
    <Art label="A handheld radio being used inside a car. The metal body of the car surrounds the antenna and blocks most of the signal, so only a weak signal gets out.">
      <path class="ga-w" d="M10 122H230" />
      <Car x={30} y={122} s={1.7} />
      <rect class="ga-k" x="92" y="84" width="9" height="16" rx="2" />
      <path class="ga-k" d="M95 84V74" />
      <path class="ga-s" d={rings(95, 78, [8, 15], -30, 30)} />
      <path class="ga-s ga-thin ga-dash" d={rings(95, 78, [84, 98], -22, 4)} />
      <T x={120} y={22} a="middle" c="ga-tk ga-tb">metal body blocks the signal</T>
      <T x={206} y={102} a="middle" c="ga-ts">weak</T>
    </Art>
  ),
  'vertical-antenna': () => (
    <Art label="A vertical antenna: a single upright radiating element standing on the ground, sending its signal out equally all around.">
      <path class="ga-w" d="M12 114H228" />
      <path class="ga-k ga-thick" d="M120 114V28" />
      <circle class="ga-fs" cx="120" cy="114" r="4" />
      <path class="ga-s" d={rings(120, 70, [20, 34, 48], -36, 36) + rings(120, 70, [20, 34, 48], 144, 216)} />
      <T x={12} y={24} c="ga-tk ga-tb">one upright element</T>
      <T x={120} y={132} a="middle" c="ga-ts">signal all around</T>
    </Art>
  ),
  weatherproofing: () => (
    <Art label="Two coaxial cables joined outdoors by a connector that has been wrapped in tape. Raindrops fall on it but the tape seals the joint so water cannot get in.">
      {[[40, 20], [76, 30], [112, 18], [150, 30], [186, 20], [214, 34]].map(([x, y]) => <path class="ga-w ga-thin" d={`M${x} ${y}l-4 12`} />)}
      <path class="ga-w ga-thick" d="M12 78H74M166 78H228" />
      <rect class="ga-fbg" x="72" y="62" width="96" height="32" rx="12" />
      <rect class="ga-k" x="72" y="62" width="96" height="32" rx="12" />
      <path class="ga-k ga-thin" d="M88 63l-10 30M102 62l-10 32M116 62l-10 32M130 62l-10 32M144 62l-10 32M158 62l-10 32M166 68l-8 26" />
      <T x={228} y={56} a="end" c="ga-tm">rain</T>
      <T x={120} y={118} a="middle" c="ga-tk ga-tb">tape seals the connector</T>
    </Art>
  ),
  'whip-antenna': () => (
    <Art label="A car with a whip antenna: a long, thin, flexible rod mounted on the vehicle, bending slightly back.">
      <path class="ga-w" d="M10 122H230" />
      <Car x={84} y={122} s={1.5} />
      <path class="ga-k" d="M96 92Q96 50 76 16" />
      <circle class="ga-fk" cx="96" cy="92" r="3.5" />
      <T x={112} y={30} c="ga-tk ga-tb">whip antenna</T>
      <T x={112} y={46} c="ga-tk">thin, flexible rod</T>
    </Art>
  ),
  yagi: () => (
    <Art label="A Yagi antenna: a boom carrying parallel elements, with the reflector at the back, the driven element where the feed line connects, and directors at the front. The signal is focused out past the directors.">
      <path class="ga-w" d="M40 74H190" />
      <path class="ga-k" d="M48 36V112M140 46V102M184 49V99" />
      <path class="ga-k ga-thick" d="M92 40V108" />
      <circle class="ga-fs" cx="92" cy="74" r="4" />
      <Ar x1={196} y1={74} x2={230} y2={74} c="ga-s" />
      <T x={12} y={26} c="ga-tk">reflector</T>
      <T x={162} y={36} a="middle" c="ga-tk">directors</T>
      <T x={62} y={132} c="ga-tk ga-tb">driven element</T>
      <T x={232} y={96} a="end" c="ga-ts">signal</T>
    </Art>
  ),
};

/* ---------- T4: station setup and controls ---------- */

/** A radio's speaker jack joined by an audio cable to a computer's line in jack. */
function AudioLink({ hl }: { hl: 'spk' | 'line' }) {
  return (
    <Art label={hl === 'spk'
      ? 'A radio and a computer joined by an audio cable. The cable starts at the radio\'s speaker connector, picked out, where received audio comes out, and goes to the computer\'s line in.'
      : 'A radio and a computer joined by an audio cable. Received audio leaves the radio\'s speaker connector and enters the computer at its line in connector, picked out.'}>
      <Box x={12} y={44} w={78} h={54} />
      <T x={51} y={64} a="middle" c="ga-tm">radio</T>
      <Box x={150} y={44} w={78} h={54} />
      <T x={189} y={64} a="middle" c="ga-tm">computer</T>
      <path class="ga-w" d="M82 84H158" />
      <circle class="ga-fbg" cx="80" cy="84" r="6" />
      <circle class={hl === 'spk' ? 'ga-k ga-thick' : 'ga-w'} cx="80" cy="84" r="6" />
      <circle class="ga-fbg" cx="160" cy="84" r="6" />
      <circle class={hl === 'line' ? 'ga-k ga-thick' : 'ga-w'} cx="160" cy="84" r="6" />
      <Ar x1={70} y1={30} x2={170} y2={30} c="ga-s" />
      <T x={120} y={20} a="middle" c="ga-ts">received audio</T>
      <T x={12} y={118} c={hl === 'spk' ? 'ga-tk ga-tb' : 'ga-tm'}>speaker jack</T>
      <T x={228} y={118} a="end" c={hl === 'line' ? 'ga-tk ga-tb' : 'ga-tm'}>line in</T>
    </Art>
  );
}

/** A battery body with its two terminals on the right side. */
function Battery({ x, y, w = 56, h = 50 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <>
      <rect class="ga-w" x={x} y={y} width={w} height={h} rx="4" />
      <T x={x + w / 2} y={y + h / 2 + 4} a="middle" c="ga-tm">battery</T>
    </>
  );
}

const T4: Record<string, TermArt> = {
  'ampere-hour': () => (
    <Art label="A battery marked with its capacity in ampere-hours. Dividing the ampere-hour rating by the current the equipment draws gives the hours the battery will last.">
      <rect class="ga-k" x="16" y="44" width="62" height="64" rx="5" />
      <path class="ga-k" d="M28 44V36H40V44M54 44V36H66V44" />
      <rect class="ga-fk ga-soft" x="22" y="70" width="50" height="32" rx="2" />
      <T x={47} y={90} a="middle" c="ga-tk ga-tb">Ah</T>
      <T x={160} y={46} a="middle" c="ga-tk ga-tb">ampere-hours</T>
      <path class="ga-w" d="M100 56H220" />
      <T x={160} y={76} a="middle" c="ga-tm">amperes drawn</T>
      <T x={160} y={108} a="middle" c="ga-ts">= hours it lasts</T>
    </Art>
  ),
  'chassis-ground': () => (
    <Art label="A vehicle battery whose negative terminal is joined by a lead to a bolt on the metal body of the vehicle. That fastening point is the chassis ground, and the radio's negative lead connects there too.">
      <Battery x={24} y={46} w={84} h={44} />
      <path class="ga-w" d="M40 46V38H52V46M80 46V38H92V46" />
      <T x={46} y={32} a="middle" c="ga-tm">+</T>
      <T x={76} y={32} a="middle" c="ga-tm">−</T>
      <path class="ga-w" d="M86 38V22H124V98" />
      <path class="ga-w" d="M232 74H156L128 100" />
      <T x={232} y={66} a="end" c="ga-tm">from radio −</T>
      <path class="ga-w ga-thick" d="M10 106H230" />
      <circle class="ga-fbg" cx="124" cy="104" r="7" />
      <circle class="ga-k ga-thick" cx="124" cy="104" r="7" />
      <T x={110} y={128} a="middle" c="ga-tk ga-tb">chassis ground</T>
      <T x={232} y={128} a="end" c="ga-tm">metal body</T>
    </Art>
  ),
  'code-plug': () => (
    <Art label="A computer loads a file of settings into a DMR radio. The file, the code plug, lists the repeaters and talkgroups the radio can use.">
      <Laptop x={14} y={54} />
      <T x={36} y={110} a="middle" c="ga-tm">computer</T>
      <Ar x1={64} y1={70} x2={78} y2={70} c="ga-s" h={5} />
      <path class="ga-k" d="M82 40H150L162 52V104H82Z" />
      <path class="ga-k ga-thin" d="M150 40V52H162" />
      <T x={122} y={72} a="middle">repeaters</T>
      <T x={122} y={92} a="middle">talkgroups</T>
      <T x={122} y={30} a="middle" c="ga-tk ga-tb">code plug</T>
      <Ar x1={166} y1={70} x2={182} y2={70} c="ga-s" h={5} />
      <HT x={190} y={58} ant={20} />
      <T x={228} y={126} a="end" c="ga-tm">DMR radio</T>
    </Art>
  ),
  'computer-radio-interface': () => (
    <Art label="A computer and a radio joined by three connections: receive audio from the radio to the computer, transmit audio from the computer to the radio, and a keying line that switches the radio to transmit.">
      <Box x={10} y={26} w={44} h={84} />
      <path class="ga-w ga-thin" d="M18 36H46V58H18Z" />
      <Box x={186} y={26} w={44} h={84} />
      <Knob x={208} y={50} r={9} c="ga-w ga-thin" />
      <Ar x1={182} y1={44} x2={58} y2={44} c="ga-k" />
      <Ar x1={58} y1={72} x2={182} y2={72} c="ga-k" />
      <Ar x1={58} y1={100} x2={182} y2={100} c="ga-k" />
      <T x={120} y={36} a="middle" c="ga-tk">receive audio</T>
      <T x={120} y={64} a="middle" c="ga-tk">transmit audio</T>
      <T x={120} y={92} a="middle" c="ga-tk">keying</T>
      <T x={10} y={128} c="ga-tm">computer</T>
      <T x={230} y={128} a="end" c="ga-tm">radio</T>
    </Art>
  ),
  'current-draw': () => (
    <Art label="A power supply feeding a radio through a wire, with arrows showing the current flowing to the radio and a meter in the wire reading it in amperes.">
      <Box x={10} y={54} w={60} h={40} t="supply" />
      <Box x={170} y={54} w={60} h={40} t="radio" />
      <path class="ga-w" d="M70 74H104M136 74H170" />
      <circle class="ga-k" cx="120" cy="74" r="16" />
      <T x={120} y={79} a="middle" c="ga-tk ga-tl">A</T>
      <Head x={92} y={74} deg={0} />
      <Head x={158} y={74} deg={0} />
      <T x={120} y={30} a="middle" c="ga-ts">current the radio takes</T>
      <T x={120} y={122} a="middle" c="ga-tk ga-tb">measured in amperes</T>
    </Art>
  ),
  'd-star': () => (
    <Art label="A handheld radio sending a D-STAR digital signal made of two parts travelling together: your call sign and your voice as data.">
      <HT x={14} y={62} />
      <path class="ga-s" d={rings(19, 44, [10, 18], -40, 40)} />
      <Box x={58} y={52} w={78} h={28} t="call sign" c="ga-k" tc="ga-tk ga-tb" />
      <Box x={140} y={52} w={86} h={28} t="voice as data" />
      <Ar x1={60} y1={96} x2={224} y2={96} c="ga-s" />
      <T x={142} y={38} a="middle" c="ga-tm">sent together, digitally</T>
      <T x={142} y={118} a="middle" c="ga-ts ga-mono">1 0 1 1 0 0 1 0 1</T>
    </Art>
  ),
  dc: () => (
    <Art label="A battery and a graph of its voltage against time: a flat, level line, because direct current flows steadily in one direction.">
      <path class="ga-w" d="M22 58H50M28 66H44M22 78H50M28 86H44M36 58V40M36 86V104" />
      <T x={54} y={50} c="ga-tm">+</T>
      <T x={54} y={104} c="ga-tm">−</T>
      <path class="ga-w" d="M92 24V100H228" />
      <path class="ga-k ga-thick" d="M92 50H222" />
      <T x={160} y={40} a="middle" c="ga-tk ga-tb">DC: steady</T>
      <T x={98} y={20} c="ga-tm">voltage</T>
      <T x={228} y={118} a="end" c="ga-tm">time</T>
      <Ar x1={110} y1={76} x2={200} y2={76} c="ga-s ga-thin" />
      <T x={155} y={92} a="middle" c="ga-ts">one direction</T>
    </Art>
  ),
  'digital-mode': () => (
    <Art label="A computer connected to a radio whose antenna sends out information as a stream of ones and zeros: data instead of plain voice.">
      <Laptop x={16} y={52} />
      <T x={38} y={72} a="middle" c="ga-mono ga-ts">101</T>
      <Ar x1={68} y1={68} x2={86} y2={68} c="ga-s" h={5} />
      <Box x={90} y={50} w={50} h={36} t="radio" />
      <path class="ga-w" d="M140 68H160V58" />
      <Ant x={160} y={50} s={13} stem={8} />
      <path class="ga-s" d={rings(160, 42, [18, 28], -30, 30)} />
      <T x={196} y={74} c="ga-mono ga-tk ga-tb">1011</T>
      <T x={196} y={90} c="ga-mono ga-tk ga-tb">0010</T>
      <T x={120} y={122} a="middle" c="ga-tk">information sent as data</T>
    </Art>
  ),
  'digital-voice': () => (
    <Art label="A voice, drawn as a smooth wave, goes into a radio which converts it into ones and zeros before sending it from the antenna.">
      <rect class="ga-w" x="14" y="52" width="12" height="22" rx="6" />
      <path class="ga-w" d="M10 68a10 10 0 0 0 20 0M20 78V88M14 88H26" />
      <path class="ga-s" d={fadeWave(36, 82, 66, 15, 5, 12, 36, 60)} />
      <Box x={88} y={48} w={52} h={36} t="radio" c="ga-k" tc="ga-tk ga-tb" />
      <T x={176} y={70} a="middle" c="ga-mono ga-ts ga-tb">10110</T>
      <Ant x={216} y={64} s={13} stem={10} />
      <T x={60} y={112} a="middle" c="ga-tm">voice in</T>
      <T x={180} y={112} a="middle" c="ga-tk ga-tb">sent as data</T>
      <T x={114} y={36} a="middle" c="ga-tm">converts</T>
    </Art>
  ),
  'electronic-keyer': () => (
    <Art label="A two-lever paddle connected to an electronic keyer, which is connected to a radio. As the operator presses the paddle, the keyer forms evenly timed dits and dahs.">
      <path class="ga-w" d="M12 86H52M26 86V58M38 86V58" />
      <path class="ga-w ga-thick" d="M22 56H30M34 56H42" />
      <path class="ga-w" d="M52 78H80M140 70H170" />
      <Box x={80} y={52} w={60} h={36} t="keyer" c="ga-k" tc="ga-tk ga-tb" />
      <Box x={170} y={52} w={58} h={36} t="radio" />
      <T x={32} y={104} a="middle" c="ga-tm">paddle</T>
      <T x={120} y={30} a="middle" c="ga-tm">helps you send Morse by hand</T>
      {[[80, 8], [94, 24], [124, 8], [138, 8], [152, 24], [182, 8], [196, 24]].map(([x, w]) => <rect class="ga-fs" x={x} y="112" width={w} height="8" rx="1" />)}
      <T x={228} y={106} a="end" c="ga-ts">even dits and dahs</T>
    </Art>
  ),
  'flat-copper-strap': () => (
    <Art label="A wide, flat strip of copper drawn in perspective, with its width marked, above an ordinary round wire for comparison.">
      <path class="ga-fk ga-soft" d="M16 62L196 40L224 58L44 80Z" />
      <path class="ga-k" d="M16 62L196 40L224 58L44 80Z" />
      <path class="ga-k ga-thin" d="M16 62V66L44 84V80M44 84L224 62V58" />
      <Ar x1={104} y1={52} x2={130} y2={69} c="ga-w ga-thin" both h={4} />
      <T x={120} y={24} a="middle" c="ga-tk ga-tb">flat copper strap</T>
      <T x={140} y={92} c="ga-tk">wide and flat</T>
      <path class="ga-w" d="M16 116H130" />
      <T x={140} y={120} c="ga-tm">round wire</T>
    </Art>
  ),
  fm: () => (
    <Art label="An FM signal: a wave whose cycles bunch together and spread apart as the voice changes its frequency, while its height stays the same.">
      <path class="ga-w ga-thin ga-dash" d="M14 46H226M14 94H226" />
      <path class="ga-s" d={fmWave(14, 226, 70, 24)} />
      <T x={120} y={26} a="middle" c="ga-tk ga-tb">the frequency changes</T>
      <T x={120} y={120} a="middle" c="ga-tm">the height stays the same</T>
    </Art>
  ),
  'heavy-gauge-wire': () => (
    <Art label="Two wires of the same length: a thick, heavy-gauge wire, which has less resistance, above a thin wire, which has more.">
      <path class="ga-k" d="M40 40H196M40 64H196" />
      <ellipse class="ga-k" cx="40" cy="52" rx="5" ry="12" />
      <ellipse class="ga-fk ga-soft" cx="196" cy="52" rx="5" ry="12" />
      <ellipse class="ga-k" cx="196" cy="52" rx="5" ry="12" />
      <T x={120} y={24} a="middle" c="ga-tk ga-tb">heavy gauge: less resistance</T>
      <path class="ga-w ga-thick" d="M40 100H196" />
      <T x={120} y={124} a="middle" c="ga-tm">thin wire: more resistance</T>
    </Art>
  ),
  hotspot: () => (
    <Art label="A handheld digital radio talks over a very short distance to a hotspot, a small low power box, which links it to a digital voice or data network.">
      <HT x={14} y={62} />
      <path class="ga-s ga-thin" d={rings(19, 46, [10, 18], -40, 30)} />
      <rect class="ga-k" x="92" y="64" width="44" height="28" rx="4" />
      <path class="ga-k" d="M100 64V46" />
      <circle class="ga-fk" cx="126" cy="78" r="3" />
      <path class="ga-s ga-thin" d={rings(100, 50, [10, 18], 150, 220)} />
      <path class="ga-w" d="M136 78H164" />
      <path class="ga-w" d="M176 92a12 12 0 0 1 2 -23a16 16 0 0 1 31 -3a13 13 0 0 1 9 26Z" />
      <T x={114} y={112} a="middle" c="ga-tk ga-tb">hotspot</T>
      <T x={114} y={30} a="middle" c="ga-tm">very low power</T>
      <T x={198} y={112} a="middle" c="ga-tm">network</T>
    </Art>
  ),
  'line-in': () => <AudioLink hl="line" />,
  'speaker-connector': () => <AudioLink hl="spk" />,
  'microphone-gain': () => (
    <Art label="A microphone feeding a transmitter through a knob marked mic gain. The knob sets how strongly the microphone drives the transmitter; set too high, the transmitted audio is distorted.">
      <rect class="ga-w" x="16" y="50" width="14" height="26" rx="7" />
      <path class="ga-w" d="M11 68a12 12 0 0 0 24 0M23 80V92M16 92H30" />
      <path class="ga-w" d="M38 66H74M118 66H146" />
      <path class="ga-w ga-thin" d={arc(96, 66, 26, -220, 40)} />
      <Knob x={96} y={66} r={18} deg={-35} />
      <T x={96} y={26} a="middle" c="ga-tk ga-tb">mic gain</T>
      <Box x={146} y={48} w={82} h={36} t="transmitter" />
      <T x={120} y={124} a="middle" c="ga-tm">too high: distorted audio</T>
    </Art>
  ),
  mode: () => (
    <Art label="Three tiles showing three modes, each putting information on a radio signal in a different way: FM with changing frequency, SSB with changing strength, and CW switched on and off.">
      {[12, 86, 160].map((x) => <rect class="ga-k" x={x} y="38" width="68" height="60" rx="5" />)}
      <path class="ga-s ga-thin" d={fmWave(18, 74, 68, 14)} />
      <path class="ga-s ga-thin" d={(() => { let d = ''; for (let x = 92; x <= 148; x += 1) { const e = 4 + 12 * Math.abs(Math.sin(((x - 92) / 56) * 2 * Math.PI)); d += `${x === 92 ? 'M' : 'L'}${x} ${(68 - e * Math.sin((x - 92) * 1.1)).toFixed(1)}`; } return d; })()} />
      <path class="ga-s ga-thin" d={wave(166, 176, 68, 5, 14) + wave(184, 204, 68, 5, 14) + wave(212, 222, 68, 5, 14)} />
      <T x={46} y={118} a="middle" c="ga-tk ga-tb">FM</T>
      <T x={120} y={118} a="middle" c="ga-tk ga-tb">SSB</T>
      <T x={194} y={118} a="middle" c="ga-tk ga-tb">CW</T>
      <T x={120} y={24} a="middle" c="ga-tm">ways to carry information</T>
    </Art>
  ),
  'morse-code': () => (
    <Art label="Morse code as a row of short and long signals: a short one is a dit and a long one is a dah. Above each is the burst of radio signal that sends it.">
      {[[24, 12], [48, 36], [96, 12], [120, 12], [144, 36], [192, 24]].map(([x, w]) => (
        <>
          <path class="ga-s ga-thin" d={wave(x, x + w, 40, 6, 10)} />
          <rect class="ga-fk" x={x} y="66" width={w} height="12" rx="2" />
        </>
      ))}
      <path class="ga-w ga-thin" d="M30 82V92M66 82V92" />
      <T x={30} y={106} a="middle" c="ga-tk ga-tb">dit</T>
      <T x={66} y={106} a="middle" c="ga-tk ga-tb">dah</T>
      <T x={228} y={106} a="end" c="ga-tm">short and long signals</T>
    </Art>
  ),
  'negative-power-return': () => (
    <Art label="A battery and a radio joined by two wires. The positive wire carries current to the radio; the negative wire, picked out with an arrow, carries it back to the battery.">
      <Battery x={12} y={40} w={58} h={52} />
      <Box x={170} y={40} w={58} h={52} t="radio" />
      <Ar x1={70} y1={52} x2={170} y2={52} c="ga-w" />
      <Ar x1={170} y1={80} x2={70} y2={80} c="ga-k ga-thick" h={8} />
      <T x={120} y={42} a="middle" c="ga-tm">positive</T>
      <T x={120} y={100} a="middle" c="ga-tk ga-tb">negative return</T>
      <T x={120} y={126} a="middle" c="ga-tm">current back to the battery</T>
    </Art>
  ),
  'off-frequency': () => (
    <Art label="A frequency scale with the receiver tuned at one spot and the signal's peak a little to one side of it. The gap between them means the receiver is off frequency.">
      <path class="ga-w" d="M14 100H226" />
      <path class="ga-fw ga-soft" d="M62 100L72 52H132L142 100Z" />
      <path class="ga-w" d="M62 100L72 52H132L142 100" />
      <path class="ga-s" d="M124 100C140 100 140 46 152 46S164 100 180 100" />
      <path class="ga-w ga-thin ga-dash" d="M102 52V110M152 46V110" />
      <Ar x1={104} y1={112} x2={150} y2={112} c="ga-k" both h={5} />
      <T x={86} y={42} a="middle" c="ga-tm">receiver</T>
      <T x={174} y={36} a="middle" c="ga-ts">signal</T>
      <T x={127} y={132} a="middle" c="ga-tk ga-tb">off frequency</T>
    </Art>
  ),
  'power-supply': () => (
    <Art label="A wall outlet feeds a power supply, which provides 13.8 volts DC to the radio.">
      <rect class="ga-w" x="12" y="52" width="28" height="38" rx="4" />
      <path class="ga-w" d="M21 62V70M31 62V70M26 78V82" />
      <path class="ga-w" d="M40 72H68M148 72H184" />
      <rect class="ga-k" x="68" y="46" width="80" height="52" rx="5" />
      <T x={108} y={68} a="middle" c="ga-tk ga-tb">power</T>
      <T x={108} y={84} a="middle" c="ga-tk ga-tb">supply</T>
      <Box x={184} y={54} w={44} h={36} t="radio" />
      <T x={26} y={110} a="middle" c="ga-tm">outlet</T>
      <T x={166} y={62} a="middle" c="ga-ts">DC</T>
      <T x={120} y={128} a="middle" c="ga-ts">13.8 volts DC for the radio</T>
    </Art>
  ),
  'receiver-filter-bandwidth': () => (
    <Art label="A frequency scale with the receiver filter drawn as a window. The wanted signal fits inside it, noise and other signals outside are shut out, and the width of the window is the bandwidth.">
      <path class="ga-w" d="M14 104H226" />
      <path class="ga-w ga-thin" d="M20 104l6 -18l6 14l6 -22l6 26M176 104l6 -24l6 18l6 -28l6 20l6 -14l6 28" />
      <path class="ga-fk ga-soft" d="M74 104L82 50H150L158 104Z" />
      <path class="ga-k" d="M74 104L82 50H150L158 104" />
      <path class="ga-s" d="M92 104C106 104 104 62 116 62S126 104 140 104" />
      <Ar x1={82} y1={38} x2={150} y2={38} c="ga-k" both h={5} />
      <T x={116} y={26} a="middle" c="ga-tk ga-tb">bandwidth</T>
      <T x={116} y={124} a="middle" c="ga-ts">wanted signal</T>
      <T x={228} y={66} a="end" c="ga-tm">shut out</T>
    </Art>
  ),
  'rf-power-meter': () => (
    <Art label="A transmitter, then an RF power meter with a dial, then the antenna. The meter is connected in the feed line between the transmitter and the antenna.">
      <Box x={10} y={58} w={50} h={32} t="radio" />
      <path class="ga-w ga-thick" d="M60 74H84M156 74H204V62" />
      <rect class="ga-k" x="84" y="40" width="72" height="62" rx="5" />
      <Dial cx={120} cy={88} r={30} deg={-60} />
      <Ant x={204} y={54} s={14} stem={8} />
      <Ar x1={64} y1={62} x2={80} y2={62} c="ga-s ga-thin" h={4} />
      <T x={120} y={30} a="middle" c="ga-tk ga-tb">RF power meter</T>
      <T x={120} y={124} a="middle" c="ga-tm">in the feed line</T>
    </Art>
  ),
  rit: () => (
    <Art label="A frequency scale with two markers. The transmit marker stays where it is; the receive marker has been moved slightly to one side by the RIT knob.">
      <path class="ga-w" d="M14 92H152" />
      <path class="ga-w ga-thick" d="M70 92V54" />
      <path class="ga-w ga-thin ga-dash" d="M70 54V40" />
      <path class="ga-k ga-thick" d="M96 92V54" />
      <Ar x1={74} y1={72} x2={92} y2={72} c="ga-k ga-thin" h={4} />
      <T x={64} y={34} a="end" c="ga-tm">transmit</T>
      <T x={90} y={48} c="ga-tk ga-tb">receive</T>
      <path class="ga-k ga-thin" d={arc(196, 70, 28, -140, -40)} />
      <Head x={n(196 + 28 * Math.cos(rad(-40)))} y={n(70 + 28 * Math.sin(rad(-40)))} deg={50} c="ga-k ga-thin" h={5} />
      <Knob x={196} y={70} r={18} deg={-60} />
      <T x={196} y={110} a="middle" c="ga-tk ga-tb">RIT</T>
      <T x={14} y={126} c="ga-tm">only receive shifts</T>
    </Art>
  ),
  scanning: () => (
    <Art label="A row of frequencies with a pointer sweeping across them one after another. One frequency has a signal on it: the scan is checking for activity.">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect class={i === 4 ? 'ga-k' : 'ga-w ga-thin'} x={16 + i * 30} y="58" width="26" height="30" rx="3" />)}
      <path class="ga-s" d="M143 82V76M149 82V68M155 82V72" />
      <Ar x1={20} y1={44} x2={142} y2={44} c="ga-k" />
      <path class="ga-k ga-thin ga-dash" d="M156 44H220" />
      <T x={120} y={26} a="middle" c="ga-tk ga-tb">tunes through frequencies</T>
      <T x={149} y={108} a="middle" c="ga-ts">activity</T>
      <T x={120} y={128} a="middle" c="ga-tm">checking each one</T>
    </Art>
  ),
  'signal-to-noise-ratio': () => (
    <Art label="A wanted signal standing up as a tall peak above a low, ragged line of background noise. How far the signal rises above the noise is the signal-to-noise ratio.">
      <path class="ga-w ga-thin" d="M14 102l8 -8l6 10l8 -12l6 8l8 -6l6 10l8 -8M150 100l8 -8l6 10l8 -12l6 8l8 -6l6 10l8 -8l6 6l6 -8" />
      <path class="ga-s" d="M70 98C96 98 94 28 108 28S120 98 150 100" />
      <path class="ga-w ga-thin ga-dash" d="M112 28H176M154 96H176" />
      <Ar x1={166} y1={32} x2={166} y2={92} c="ga-k" both />
      <T x={176} y={58} c="ga-tk ga-tb">signal</T>
      <T x={176} y={74} c="ga-tk ga-tb">to noise</T>
      <T x={62} y={40} a="middle" c="ga-ts">signal</T>
      <T x={40} y={124} a="middle" c="ga-tm">noise</T>
    </Art>
  ),
  transceiver: () => (
    <Art label="One box, the transceiver, containing both a transmitter and a receiver, which share a single antenna.">
      <rect class="ga-k" x="16" y="34" width="150" height="88" rx="6" />
      <Box x={28} y={46} w={104} h={28} t="transmitter" />
      <Box x={28} y={84} w={104} h={28} t="receiver" />
      <path class="ga-w" d="M132 60H150V98H132M150 78H206V64" />
      <Ant x={206} y={56} s={15} stem={8} />
      <T x={91} y={24} a="middle" c="ga-tk ga-tb">transceiver</T>
      <T x={206} y={100} a="middle" c="ga-tm">antenna</T>
    </Art>
  ),
  'transmitter-keying': () => (
    <Art label="A switch inside a radio connects the antenna either to the receiver or to the transmitter. Keying moves it from receive to transmit.">
      <Ant x={34} y={40} s={14} stem={32} />
      <circle class="ga-fw" cx="34" cy="74" r="3.5" />
      <path class="ga-w ga-thin ga-dash" d="M34 74L84 92" />
      <path class="ga-k ga-thick" d="M34 74L84 56" />
      <path class="ga-k ga-thin" d={arc(34, 74, 40, -14, 14)} />
      <Head x={n(34 + 40 * Math.cos(rad(-14)))} y={n(74 + 40 * Math.sin(rad(-14)))} deg={-104} c="ga-k ga-thin" h={5} />
      <circle class="ga-fk" cx="88" cy="55" r="3.5" />
      <circle class="ga-fw" cx="88" cy="93" r="3.5" />
      <Box x={104} y={41} w={84} h={28} t="transmit" c="ga-k" tc="ga-tk ga-tb" />
      <Box x={104} y={79} w={84} h={28} t="receive" />
      <path class="ga-w" d="M88 55H104M88 93H104" />
      <T x={120} y={128} a="middle" c="ga-tm">keying: switch to transmit</T>
    </Art>
  ),
  vfo: () => (
    <Art label="The front of a transceiver with a frequency display and a large tuning knob, the VFO. Turning the knob changes the operating frequency.">
      <rect class="ga-w" x="12" y="24" width="216" height="84" rx="8" />
      <rect class="ga-w ga-thin" x="24" y="44" width="96" height="34" rx="3" />
      <T x={72} y={67} a="middle" c="ga-mono ga-tl ga-ts">146.520</T>
      <T x={72} y={96} a="middle" c="ga-tm">frequency</T>
      <circle class="ga-k ga-thick" cx="174" cy="66" r="24" />
      <circle class="ga-fk" cx="184" cy="54" r="4" />
      <path class="ga-k ga-thin" d={arc(174, 66, 33, -150, -30)} />
      <Head x={n(174 + 33 * Math.cos(rad(-30)))} y={n(66 + 33 * Math.sin(rad(-30)))} deg={60} c="ga-k ga-thin" h={5} />
      <Head x={n(174 + 33 * Math.cos(rad(-150)))} y={n(66 + 33 * Math.sin(rad(-150)))} deg={120} c="ga-k ga-thin" h={5} />
      <T x={174} y={128} a="middle" c="ga-tk ga-tb">VFO knob</T>
    </Art>
  ),
  'voltage-drop': () => (
    <Art label="A power supply joined to a radio by a wire. A tall bar shows the full voltage at the supply and a shorter bar the voltage that reaches the radio; the difference is the voltage drop lost along the wire.">
      <Box x={12} y={96} w={58} h={28} t="supply" />
      <Box x={170} y={96} w={58} h={28} t="radio" />
      <Ar x1={70} y1={110} x2={170} y2={110} c="ga-w" />
      <T x={120} y={104} a="middle" c="ga-tm">wire</T>
      <rect class="ga-fs" x="30" y="30" width="22" height="58" rx="2" />
      <rect class="ga-fs" x="188" y="54" width="22" height="34" rx="2" />
      <path class="ga-w ga-thin ga-dash" d="M52 30H212" />
      <Ar x1={199} y1={33} x2={199} y2={51} c="ga-k" both h={4} />
      <T x={182} y={46} a="end" c="ga-tk ga-tb">voltage drop</T>
      <T x={58} y={64} c="ga-ts">volts</T>
      <T x={120} y={22} a="middle" c="ga-tm">lost along the wire</T>
    </Art>
  ),
};

/** Drawings keyed by glossary term id (the `id` field in the glossary data). */
export const ART: Record<string, TermArt> = { ...T3, ...T9, ...T4 };
