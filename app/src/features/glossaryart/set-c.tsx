import type { ComponentChildren } from 'preact';
import { Art, T, wave, zig } from './kit';
import type { TermArt } from './kit';

/* ---------- small shared shapes (T7 station equipment, T8 signals) ---------- */

const P = ({ d, c = 'ga-w' }: { d: string; c?: string }) => <path d={d} class={c} />;
const C = ({ x, y, r, c = 'ga-w' }: { x: number; y: number; r: number; c?: string }) => <circle cx={x} cy={y} r={r} class={c} />;
const R = ({ x, y, w, h, c = 'ga-w', r = 3 }: { x: number; y: number; w: number; h: number; c?: string; r?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} class={c} />
);

/** A line with an arrowhead at the end (and at the start when `both`). */
function Arr({ x1, y1, x2, y2, c = 'ga-w', both = false }: { x1: number; y1: number; x2: number; y2: number; c?: string; both?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = (x: number, y: number, ang: number) =>
    [0.5, -0.5].map((da) => `M${x} ${y}L${(x - 7 * Math.cos(ang + da)).toFixed(1)} ${(y - 7 * Math.sin(ang + da)).toFixed(1)}`).join('');
  return <path class={c} d={`M${x1} ${y1}L${x2} ${y2}${head(x2, y2, a)}${both ? head(x1, y1, a + Math.PI) : ''}`} />;
}

/** A labelled block of a block diagram. */
function Box({ x, y, w, h, c = 'ga-w', tc = '', children }: { x: number; y: number; w: number; h: number; c?: string; tc?: string; children?: ComponentChildren }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} class={c} />
      <T x={x + w / 2} y={y + h / 2 + 4} a="middle" c={tc}>{children}</T>
    </g>
  );
}

/** Antenna symbol as in exam figure T-3: a triangle, point down, on a vertical line. (x, y) is the top centre. */
const Ant = ({ x, y, h = 24, c = 'ga-w' }: { x: number; y: number; h?: number; c?: string }) => (
  <path class={c} d={`M${x - 9} ${y}h18l-9 13zM${x} ${y}v${h}`} />
);

/** Ground symbol as in exam figure T-1: a bar with three slanted strokes. */
const Gnd = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => (
  <path class={c} d={`M${x - 9} ${y}h18M${x - 9} ${y}l-4 7M${x} ${y}l-4 7M${x + 9} ${y}l-4 7`} />
);

/** Battery symbol as in exam figure T-1: long and short plates. (x, y) is the top plate centre; 18 tall. */
const Batt = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => (
  <path class={c} d={`M${x - 10} ${y}h20M${x - 5} ${y + 6}h10M${x - 10} ${y + 12}h20M${x - 5} ${y + 18}h10`} />
);

/** Round meter with a letter on its face. */
const Meter = ({ x, y, l }: { x: number; y: number; l: string }) => (
  <g>
    <circle cx={x} cy={y} r={13} class="ga-k ga-fbg" />
    <T x={x} y={y + 5} a="middle" c="ga-tk ga-tl">{l}</T>
  </g>
);

const Dot = ({ x, y, c = 'ga-fk', r = 3.5 }: { x: number; y: number; c?: string; r?: number }) => <circle cx={x} cy={y} r={r} class={c} />;
const Tick = ({ x, y }: { x: number; y: number }) => <path class="ga-good" d={`M${x - 6} ${y}l4 5l8 -10`} />;
const Cross = ({ x, y }: { x: number; y: number }) => <path class="ga-bad" d={`M${x - 5} ${y - 5}l10 10M${x + 5} ${y - 5}l-10 10`} />;

/** Frequency axis with an arrowhead and an optional label under its right end. */
function FAxis({ y, x0 = 14, x1 = 226, label = 'frequency' }: { y: number; x0?: number; x1?: number; label?: string }) {
  return (
    <g>
      <Arr x1={x0} y1={y} x2={x1} y2={y} c="ga-w ga-thin" />
      {label ? <T x={x1} y={y + 16} a="end" c="ga-tm">{label}</T> : null}
    </g>
  );
}

/** Satellite: body, two solar panels and a stub antenna pointing down. */
const Sat = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => (
  <g>
    <rect x={x - 7} y={y - 6} width={14} height={12} rx={2} class={`${c} ga-fbg`} />
    <rect x={x - 25} y={y - 4} width={14} height={8} rx={1} class={`${c} ga-thin`} />
    <rect x={x + 11} y={y - 4} width={14} height={8} rx={1} class={`${c} ga-thin`} />
    <path class={`${c} ga-thin`} d={`M${x - 11} ${y}h4M${x + 7} ${y}h4M${x} ${y + 6}v6`} />
  </g>
);

/** Curved ground under a satellite scene. */
const Earth = () => <P d="M8 124Q120 100 232 124" />;

/** Radio waves spreading to the right of a point. */
const Rays = ({ x, y, c = 'ga-s' }: { x: number; y: number; c?: string }) => (
  <path class={c} d={`M${x + 8} ${y - 6}a9 9 0 0 1 0 12M${x + 13} ${y - 11}a16 16 0 0 1 0 22`} />
);

/** The internet, as a cloud about 70 wide centred on (x, y). */
const Cloud = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => (
  <g>
    <path class={c} d={`M${x - 28} ${y + 11}a11 11 0 0 1 2 -22a15 15 0 0 1 28 -6a12 12 0 0 1 24 28z`} />
    <T x={x - 2} y={y + 5} a="middle" c="ga-tm">internet</T>
  </g>
);

/** Laptop computer. */
const PC = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => (
  <g>
    <rect x={x - 13} y={y - 10} width={26} height={17} rx={2} class={c} />
    <path class={c} d={`M${x - 18} ${y + 11}h36`} />
  </g>
);

/** Repeater tower standing on (x, y), h tall. */
const Tower = ({ x, y, h, c = 'ga-w' }: { x: number; y: number; h: number; c?: string }) => (
  <path class={c} d={`M${x - 7} ${y}L${x} ${y - h}L${x + 7} ${y}M${x - 4.5} ${y - h * 0.35}h9M${x - 2.5} ${y - h * 0.65}h5`} />
);

/** Handheld radio. */
const HT = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => (
  <g>
    <rect x={x - 6} y={y - 12} width={12} height={22} rx={2} class={c} />
    <path class={`${c} ga-thin`} d={`M${x + 3} ${y - 12}v-11M${x - 3} ${y - 6}h6`} />
  </g>
);

/** Microphone. */
const Mic = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => (
  <g>
    <rect x={x - 4} y={y - 12} width={8} height={15} rx={4} class={c} />
    <path class={`${c} ga-thin`} d={`M${x - 8} ${y - 2}a8 8 0 0 0 16 0M${x} ${y + 6}v7`} />
  </g>
);

/** Loudspeaker with sound coming out. */
const Speaker = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => (
  <g>
    <path class={c} d={`M${x - 8} ${y - 5}h6l8 -7v24l-8 -7h-6z`} />
    <path class={`${c} ga-thin`} d={`M${x + 11} ${y - 5}a7 7 0 0 1 0 10M${x + 15} ${y - 9}a12 12 0 0 1 0 18`} />
  </g>
);

/** Yagi (directional) antenna seen from above, pointing along `ang` degrees (0 = right). */
const Yagi = ({ x, y, ang = 0, c = 'ga-k' }: { x: number; y: number; ang?: number; c?: string }) => (
  <path class={c} transform={`rotate(${ang} ${x} ${y})`} d={`M${x - 16} ${y}h32M${x - 16} ${y - 13}v26M${x - 5} ${y - 11}v22M${x + 6} ${y - 9}v18M${x + 16} ${y - 7}v14`} />
);

/** Carrier whose height follows a slow envelope (an AM wave). */
function amPath(x0: number, x1: number, y: number, len: number, base: number, depth: number, envLen: number, sign: 1 | 0 | -1 = 0): string {
  let d = '';
  for (let x = x0; x <= x1; x += sign ? 2 : 0.5) {
    const env = base + depth * Math.sin(((x - x0) / envLen) * 2 * Math.PI);
    const yy = sign ? y - sign * env : y - env * Math.sin(((x - x0) / len) * 2 * Math.PI);
    d += `${x === x0 ? 'M' : 'L'}${x} ${yy.toFixed(1)}`;
  }
  return d;
}

/** Any curve y = f(x), sampled finely. */
function plot(x0: number, x1: number, f: (x: number) => number, step = 0.5): string {
  let d = '';
  for (let x = x0; x <= x1; x += step) d += `${x === x0 ? 'M' : 'L'}${x} ${f(x).toFixed(1)}`;
  return d;
}

/** A simple series loop with a battery on the left: x 36..204, y 36..112. The top wire is left to the caller. */
const Loop = () => (
  <g>
    <P d="M36 36V65M36 83V112H204V36" />
    <Batt x={36} y={65} />
    <T x={52} y={62} c="ga-tm">+</T>
  </g>
);

/** Coaxial cable cut across, with its four layers named. `hi` picks the layer drawn in the key color. */
function CoaxCut({ hi }: { hi: 'dielectric' | 'jacket' }) {
  const k = (name: string) => (hi === name ? 'ga-k' : 'ga-w');
  const tk = (name: string) => (hi === name ? 'ga-tk ga-tb' : '');
  return (
    <g>
      {hi === 'dielectric' ? <C x={62} y={70} r={33} c="ga-fk ga-soft" /> : null}
      <C x={62} y={70} r={46} c={`${k('jacket')} ${hi === 'jacket' ? 'ga-thick' : ''}`} />
      <C x={62} y={70} r={40} c="ga-w ga-dash" />
      <C x={62} y={70} r={33} c={`${k('dielectric')} ga-thin`} />
      <C x={62} y={70} r={7} c="ga-fw" />
      <P d="M92 35L122 24M100 56L122 52M84 78L122 80M67 74L122 108" c="ga-w ga-thin" />
      <T x={126} y={28} c={tk('jacket')}>outer jacket</T>
      <T x={126} y={56}>shield</T>
      <T x={126} y={84} c={tk('dielectric')}>dielectric</T>
      <T x={126} y={112}>center conductor</T>
    </g>
  );
}

/** A ground station, a satellite, and the two paths between them. */
function SatLink({ up, down, upL, downL, sat = 'ga-w' }: { up: string; down: string; upL: [string, string?]; downL: [string, string?]; sat?: string }) {
  const tc = (c: string) => (c.includes('ga-k') ? 'ga-tk' : c.includes('ga-s') ? 'ga-ts' : 'ga-tm');
  return (
    <g>
      <Earth />
      <Ant x={50} y={90} h={26} />
      <Ant x={190} y={90} h={26} />
      <Sat x={120} y={26} c={sat} />
      <Arr x1={58} y1={84} x2={106} y2={38} c={up} />
      <Arr x1={134} y1={38} x2={182} y2={84} c={down} />
      <T x={74} y={48} a="end" c={tc(up)}>{upL[0]}</T>
      {upL[1] ? <T x={66} y={64} a="end" c={tc(up)}>{upL[1]}</T> : null}
      <T x={166} y={48} c={tc(down)}>{downL[0]}</T>
      {downL[1] ? <T x={174} y={64} c={tc(down)}>{downL[1]}</T> : null}
    </g>
  );
}

/** Noise floor: a deterministic jagged line around y. */
const noise = (x0: number, x1: number, y: number) =>
  plot(x0, x1, (x) => y - 3 * Math.sin(x * 1.7) - 2 * Math.sin(x * 0.61 + 1) - 1.5 * Math.sin(x * 2.9 + 2), 3);

/** Water drop. */
const Drop = ({ x, y }: { x: number; y: number }) => (
  <path class="ga-fk" d={`M${x} ${y - 7}C${x + 6} ${y + 1} ${x + 4} ${y + 6} ${x} ${y + 6}C${x - 4} ${y + 6} ${x - 6} ${y + 1} ${x} ${y - 7}Z`} />
);

/** Mesh node: a small box with two antennas. */
const Node = ({ x, y }: { x: number; y: number }) => (
  <g>
    <path class="ga-w ga-thin" d={`M${x - 5} ${y - 5}v-8M${x + 5} ${y - 5}v-8`} />
    <rect x={x - 9} y={y - 5} width={18} height={10} rx={2} class="ga-w ga-fbg" />
  </g>
);

/* ---------- the drawings ---------- */

export const ART: Record<string, TermArt> = {
  /* ===== T7: station equipment ===== */

  'acid-core-solder': () => (
    <Art label="Two solder wires cut across. The one with an acid core is marked with a cross, not for radio work; the one with a rosin core is marked with a tick.">
      <C x={66} y={62} r={28} c="ga-k" />
      <C x={66} y={62} r={10} c="ga-fbad" />
      <Cross x={104} y={32} />
      <C x={174} y={62} r={28} />
      <C x={174} y={62} r={10} c="ga-fgood" />
      <Tick x={212} y={34} />
      <T x={66} y={110} a="middle" c="ga-tk ga-tb">acid core</T>
      <T x={66} y={126} a="middle" c="ga-tm">not for radio</T>
      <T x={174} y={110} a="middle">rosin core</T>
      <T x={174} y={126} a="middle" c="ga-tm">use this</T>
    </Art>
  ),

  ammeter: () => (
    <Art label="A battery, an ammeter marked A and a resistor in one loop. The ammeter sits in series, so the current flows through it.">
      <Loop />
      <P d="M36 36H85M111 36H128M188 36H204" />
      <P d={zig(128, 36)} />
      <Meter x={98} y={36} l="A" />
      <T x={98} y={68} a="middle" c="ga-tk">in series</T>
      <Arr x1={170} y1={100} x2={84} y2={100} c="ga-s" />
      <T x={127} y={90} a="middle" c="ga-ts">current</T>
    </Art>
  ),

  voltmeter: () => (
    <Art label="A battery and a resistor in a loop, with a voltmeter marked V connected in parallel: one lead on each end of the resistor.">
      <Loop />
      <P d="M36 36H90M150 36H204" />
      <P d={zig(90, 36)} />
      <P d="M78 36V76H107M162 36V76H133" c="ga-k" />
      <Dot x={78} y={36} />
      <Dot x={162} y={36} />
      <Meter x={120} y={76} l="V" />
      <T x={120} y={104} a="middle" c="ga-tk">in parallel</T>
    </Art>
  ),

  'series-connection': () => (
    <Art label="A meter and a part on one wire, one after the other. A long arrow shows the same current flowing through both.">
      <P d="M16 60H71M97 60H124M184 60H224" />
      <P d={zig(124, 60)} />
      <Meter x={84} y={60} l="A" />
      <T x={84} y={34} a="middle" c="ga-tk">meter</T>
      <T x={154} y={34} a="middle" c="ga-tm">part</T>
      <Arr x1={30} y1={92} x2={210} y2={92} c="ga-s" />
      <T x={120} y={114} a="middle" c="ga-ts">one path: same current in both</T>
    </Art>
  ),

  'parallel-connection': () => (
    <Art label="A part on a wire, with a meter connected across it: one lead on each end of the part, and the wire is not broken.">
      <P d="M16 84H90M150 84H224" />
      <P d={zig(90, 84)} />
      <P d="M76 84V36H107M164 84V36H133" c="ga-k" />
      <Dot x={76} y={84} />
      <Dot x={164} y={84} />
      <Meter x={120} y={36} l="V" />
      <T x={66} y={40} a="end" c="ga-tk">meter</T>
      <T x={120} y={110} a="middle" c="ga-tm">part</T>
      <T x={120} y={128} a="middle" c="ga-tk">one lead on each end</T>
    </Art>
  ),

  'electric-potential': () => (
    <Art label="A battery with a voltmeter across its two terminals. A double arrow between the two points is marked volts: the electrical push between them.">
      <P d="M60 61V40H110M60 79V100H110" />
      <Batt x={60} y={61} />
      <T x={76} y={58} c="ga-tm">+</T>
      <C x={114} y={40} r={4} />
      <C x={114} y={100} r={4} />
      <Arr x1={130} y1={48} x2={130} y2={92} c="ga-k" both />
      <T x={138} y={74} c="ga-tk ga-tb">volts</T>
      <P d="M118 40H196V57M118 100H196V83" c="ga-w ga-thin" />
      <Meter x={196} y={70} l="V" />
      <T x={60} y={124} a="middle" c="ga-tm">battery</T>
      <T x={196} y={124} a="middle" c="ga-tm">voltmeter</T>
    </Art>
  ),

  antenna: () => (
    <Art label="A transmitter sends RF power along a feed line to an antenna, which turns it into radio waves.">
      <Box x={10} y={80} w={80} h={28}>transmitter</Box>
      <P d="M90 94H130" />
      <Ant x={130} y={36} h={58} c="ga-k" />
      <P d={wave(148, 226, 44, 20, 10)} c="ga-s" />
      <T x={187} y={74} a="middle" c="ga-ts">radio waves</T>
      <T x={112} y={126} a="middle" c="ga-tm">RF power</T>
    </Art>
  ),

  'antenna-analyzer': () => (
    <Art label="An antenna analyzer connected to an antenna. Its screen plots SWR against frequency; the lowest point of the curve shows where the antenna is resonant.">
      <R x={16} y={26} w={130} h={74} c="ga-k" r={5} />
      <P d="M26 36Q81 146 136 36" c="ga-s" />
      <T x={81} y={60} a="middle" c="ga-tk">resonant</T>
      <Arr x1={81} y1={66} x2={81} y2={84} c="ga-k ga-thin" />
      <T x={16} y={19}>SWR</T>
      <T x={81} y={118} a="middle" c="ga-tm">frequency</T>
      <P d="M146 63H196" />
      <Ant x={196} y={22} h={41} />
      <T x={196} y={84} a="middle" c="ga-tm">antenna</T>
    </Art>
  ),

  'band-reject-filter': () => (
    <Art label="A filter response on a frequency axis: flat and high everywhere except one deep notch. A strong FM station inside the notch is blocked, and a 2 meter signal outside it passes.">
      <FAxis y={104} label="" />
      <P d="M80 104V46" c="ga-s ga-soft ga-thick" />
      <P d="M172 104V46" c="ga-s ga-thick" />
      <P d="M14 36H50C60 36 60 96 70 96H90C100 96 100 36 110 36H224" c="ga-k" />
      <T x={80} y={26} a="middle" c="ga-tk">blocked</T>
      <T x={172} y={26} a="middle" c="ga-tk">passes</T>
      <T x={80} y={122} a="middle" c="ga-tm">FM station</T>
      <T x={172} y={122} a="middle" c="ga-tm">2 m</T>
    </Art>
  ),

  carrier: () => (
    <Art label="A plain sine wave of constant height and spacing: a steady carrier with no information on it.">
      <P d={wave(14, 226, 54, 26, 26)} c="ga-k" />
      <T x={120} y={106} a="middle">steady strength and frequency</T>
      <T x={120} y={124} a="middle" c="ga-tm">no information yet</T>
    </Art>
  ),

  'coaxial-connector': () => (
    <Art label="The end of a coaxial cable fitted with a connector, about to plug into the socket on a piece of equipment.">
      <P d="M10 62H84M10 78H84" />
      <R x={84} y={54} w={48} h={32} c="ga-k" />
      <P d="M96 58V82M105 58V82M114 58V82" c="ga-k ga-thin" />
      <R x={132} y={59} w={14} h={22} c="ga-k" r={1} />
      <P d="M146 70H160" c="ga-k ga-thick" />
      <Arr x1={166} y1={70} x2={180} y2={70} c="ga-w ga-thin" />
      <R x={200} y={30} w={30} h={80} />
      <R x={186} y={61} w={14} h={18} r={1} />
      <T x={46} y={50} a="middle" c="ga-tm">coax</T>
      <T x={116} y={44} a="middle" c="ga-tk">connector</T>
      <T x={198} y={128} a="middle" c="ga-tm">equipment</T>
    </Art>
  ),

  'cold-solder-joint': () => (
    <Art label="Two solder joints on a circuit board. The good one is a smooth, shiny cone; the cold one is a rough, lumpy blob.">
      <P d="M14 100H226" />
      <P d="M66 40V112M174 40V112" c="ga-w ga-thin" />
      <P d="M44 100Q62 94 64 62L68 62Q70 94 88 100Z" c="ga-w ga-fbg" />
      <P d="M56 92q5 -8 6 -20" c="ga-w ga-thin" />
      <P d="M152 100q-6 -10 4 -14q-4 -10 8 -12q2 -10 12 -6q10 -6 12 6q10 2 6 12q8 6 0 14Z" c="ga-k ga-fbg" />
      <T x={66} y={26} a="middle" c="ga-tm">good</T>
      <T x={66} y={128} a="middle" c="ga-tm">bright, shiny</T>
      <T x={174} y={26} a="middle" c="ga-tk ga-tb">cold</T>
      <T x={174} y={128} a="middle" c="ga-tk">rough, lumpy</T>
    </Art>
  ),

  deviation: () => (
    <Art label="Two rows showing how far an FM signal swings in frequency. A soft voice gives a small swing inside the channel; a loud voice gives a wide swing that spills past the channel edges, called over-deviating.">
      <T x={154} y={19} a="middle" c="ga-tk">frequency swing</T>
      <P d="M114 28V114M194 28V114" c="ga-w ga-thin ga-dash" />
      <P d="M154 34V54M154 88V108" c="ga-w ga-thin" />
      <Arr x1={136} y1={44} x2={172} y2={44} c="ga-k" both />
      <Arr x1={94} y1={98} x2={214} y2={98} c="ga-bad" both />
      <T x={8} y={48}>soft voice</T>
      <T x={8} y={102}>loud voice</T>
      <T x={8} y={120} c="ga-tm">over-deviating</T>
      <T x={154} y={130} a="middle" c="ga-tm">channel</T>
    </Art>
  ),

  dielectric: () => (
    <Art label="A coaxial cable cut across, showing four layers from outside to inside: outer jacket, shield, dielectric and center conductor. The dielectric, the insulation between the center conductor and the shield, is highlighted.">
      <CoaxCut hi="dielectric" />
    </Art>
  ),

  'outer-jacket': () => (
    <Art label="A coaxial cable stripped back in steps: outer jacket, shield, dielectric and center conductor. Sunlight falls on the outer jacket, the plastic covering that protects the parts inside.">
      <C x={26} y={22} r={7} c="ga-s" />
      <Arr x1={36} y1={30} x2={48} y2={46} c="ga-s ga-thin" />
      <Arr x1={30} y1={34} x2={34} y2={46} c="ga-s ga-thin" />
      <T x={52} y={26} c="ga-ts">sunlight (UV)</T>
      <R x={14} y={52} w={90} h={40} c="ga-k" />
      <R x={104} y={57} w={36} h={30} r={1} />
      <P d="M110 57l12 30M122 57l12 30M122 57l-12 30M134 57l-12 30" c="ga-w ga-thin" />
      <R x={140} y={62} w={36} h={20} r={1} />
      <P d="M176 72H214" c="ga-w ga-thick" />
      <T x={59} y={110} a="middle" c="ga-tk ga-tb">outer jacket</T>
      <T x={124} y={110} a="middle" c="ga-tm">shield</T>
      <P d="M158 84V114" c="ga-w ga-thin" />
      <T x={158} y={128} a="middle" c="ga-tm">dielectric</T>
      <P d="M196 68V50" c="ga-w ga-thin" />
      <T x={228} y={44} a="end" c="ga-tm">center conductor</T>
    </Art>
  ),

  'moisture-contamination': () => (
    <Art label="A length of coaxial cable seen from the side with a crack in its jacket. Water drops fall into the crack and water spreads inside the cable.">
      <P d="M94 60H138Q148 78 136 96H94Q84 78 94 60Z" c="ga-fk ga-soft" />
      <P d="M14 58H104l4 7M226 58H126l-5 8M14 98H226" />
      <P d="M14 78H226" c="ga-w ga-thick" />
      <Drop x={112} y={26} />
      <Drop x={118} y={46} />
      <T x={100} y={30} a="end" c="ga-tk ga-tb">water</T>
      <T x={136} y={46} c="ga-tm">cracked jacket</T>
      <T x={120} y={122} a="middle" c="ga-tm">coax cable</T>
    </Art>
  ),

  'directional-wattmeter': () => (
    <Art label="A directional wattmeter in the feed line between a transmitter and an antenna. One arrow shows forward power going to the antenna and another shows reflected power coming back.">
      <Box x={10} y={54} w={40} h={32}>TX</Box>
      <P d="M50 70H86M154 70H200" />
      <R x={86} y={46} w={68} h={50} c="ga-k" r={5} />
      <P d="M98 84A24 24 0 0 1 142 84" c="ga-k ga-thin" />
      <P d="M120 86L132 64" c="ga-k" />
      <Ant x={200} y={36} h={34} />
      <Arr x1={60} y1={32} x2={176} y2={32} c="ga-s" />
      <T x={118} y={22} a="middle" c="ga-ts">forward</T>
      <Arr x1={176} y1={110} x2={60} y2={110} c="ga-s ga-thin" />
      <T x={118} y={128} a="middle" c="ga-ts">reflected</T>
    </Art>
  ),

  'dummy-load': () => (
    <Art label="A transmitter connected to a dummy load instead of an antenna: a 50 ohm resistor in a can with cooling fins. The power turns into heat and nothing goes on the air.">
      <Box x={10} y={52} w={40} h={32}>TX</Box>
      <P d="M50 68H102M162 68H180" />
      <P d={zig(102, 68)} c="ga-k" />
      <R x={84} y={48} w={96} h={62} c="ga-k" r={5} />
      <P d="M96 48V37M108 48V37M120 48V37M132 48V37M144 48V37M156 48V37M168 48V37" c="ga-k" />
      <P d="M108 30q-5 -4 0 -8q5 -4 0 -8M132 30q-5 -4 0 -8q5 -4 0 -8M156 30q-5 -4 0 -8q5 -4 0 -8" c="ga-s ga-thin" />
      <T x={190} y={26} c="ga-ts">heat</T>
      <T x={132} y={100} a="middle" c="ga-tk">50 Ω</T>
      <T x={120} y={130} a="middle" c="ga-tm">nothing goes on the air</T>
    </Art>
  ),

  'heat-sink': () => (
    <Art label="A hot part bolted to a heat sink, a metal block with a row of fins. Heat rises away from the fins.">
      <R x={60} y={78} w={120} h={11} c="ga-k" r={2} />
      <P d="M66 78V46M78 78V46M90 78V46M102 78V46M114 78V46M126 78V46M138 78V46M150 78V46M162 78V46M174 78V46" c="ga-k" />
      <Box x={88} y={89} w={64} h={24}>hot part</Box>
      <P d="M84 38q-5 -4 0 -9q5 -4 0 -9M120 38q-5 -4 0 -9q5 -4 0 -9M156 38q-5 -4 0 -9q5 -4 0 -9" c="ga-s ga-thin" />
      <T x={172} y={30} c="ga-ts">heat</T>
      <T x={52} y={66} a="end" c="ga-tk">fins</T>
    </Art>
  ),

  'ferrite-choke': () => (
    <Art label="A microphone cable running to a radio with a clip-on ferrite choke around it. Stray RF travelling along the cable stops at the choke.">
      <Mic x={26} y={70} />
      <P d="M36 70H158" />
      <Box x={158} y={52} w={68} h={36}>radio</Box>
      <P d={wave(40, 92, 54, 13, 5)} c="ga-s" />
      <R x={98} y={56} w={30} h={28} c="ga-k ga-fbg" r={7} />
      <P d="M98 70H128" c="ga-k ga-thin" />
      <Cross x={142} y={54} />
      <T x={66} y={40} a="middle" c="ga-ts">stray RF</T>
      <T x={113} y={106} a="middle" c="ga-tk">clip-on ferrite</T>
      <T x={26} y={106} a="middle" c="ga-tm">mic</T>
    </Art>
  ),

  filter: () => (
    <Art label="Three signals at different frequencies go into a filter. One comes out at full strength and the other two are blocked.">
      <P d="M14 96H80M172 96H226" c="ga-w ga-thin" />
      <P d="M28 96V56M46 96V56M64 96V56M199 96V56" c="ga-s ga-thick" />
      <P d="M184 96V56M214 96V56" c="ga-s ga-thick ga-soft" />
      <Arr x1={84} y1={76} x2={98} y2={76} />
      <Box x={102} y={60} w={50} h={32} c="ga-k" tc="ga-tk">filter</Box>
      <Arr x1={156} y1={76} x2={170} y2={76} />
      <T x={47} y={116} a="middle" c="ga-tm">in</T>
      <T x={199} y={116} a="middle" c="ga-tm">out</T>
      <T x={120} y={30} a="middle">passes some, blocks others</T>
    </Art>
  ),

  'fundamental-overload': () => (
    <Art label="A frequency axis. A receiver is tuned to one band, shown as a dashed box. A very strong signal far outside that band still gets into the receiver, because the receiver cannot reject it.">
      <FAxis y={100} label="" />
      <R x={30} y={52} w={66} h={48} c="ga-k ga-dash" />
      <P d="M63 100V76" c="ga-s" />
      <P d="M178 100V24" c="ga-s ga-thick" />
      <T x={168} y={38} a="end" c="ga-ts">strong signal</T>
      <Arr x1={170} y1={60} x2={102} y2={76} c="ga-bad" />
      <T x={140} y={92} a="middle" c="ga-tm">gets in</T>
      <T x={14} y={120} c="ga-tk">radio tuned here</T>
      <T x={226} y={120} a="end" c="ga-tm">outside its band</T>
    </Art>
  ),

  'good-amateur-practice': () => (
    <Art label="A station and its antenna next to the operator's own television, which shows a clear picture and a tick: check that your own station works properly first.">
      <Box x={10} y={62} w={76} h={30}>my station</Box>
      <P d="M86 77H108" />
      <Ant x={108} y={30} h={47} />
      <Rays x={110} y={36} />
      <R x={150} y={38} w={64} h={50} c="ga-k" r={5} />
      <P d="M156 80l16 -22l12 14l10 -10l14 18" c="ga-k ga-thin" />
      <P d="M170 96h24M182 88v8" c="ga-k" />
      <Tick x={222} y={30} />
      <T x={182} y={112} a="middle" c="ga-tk">own TV: clear</T>
      <T x={120} y={130} a="middle" c="ga-tm">check your own station first</T>
    </Art>
  ),

  'harmful-interference': () => (
    <Art label="A radio signal passing between two stations is broken in the middle by a burst of jagged interference, interrupting the contact.">
      <Ant x={22} y={40} h={50} />
      <Ant x={218} y={40} h={50} />
      <P d={wave(38, 94, 52, 28, 12)} c="ga-s" />
      <P d={wave(146, 202, 52, 28, 12)} c="ga-s" />
      <P d="M92 52l6 -22l6 40l7 -46l7 50l6 -40l6 34l6 -24l4 8" c="ga-k ga-thick" />
      <T x={120} y={104} a="middle" c="ga-tk ga-tb">interference</T>
      <T x={120} y={124} a="middle" c="ga-tm">contact interrupted</T>
    </Art>
  ),

  harmonics: () => (
    <Art label="A frequency axis with a tall wanted signal at frequency f and smaller unwanted signals at exactly two times f and three times f: the harmonics.">
      <FAxis y={100} label="" />
      <P d="M50 100V34" c="ga-s ga-thick" />
      <P d="M110 100V70M170 100V82" c="ga-k ga-thick" />
      <T x={50} y={24} a="middle" c="ga-ts">wanted</T>
      <T x={140} y={54} a="middle" c="ga-tk ga-tb">harmonics</T>
      <T x={50} y={120} a="middle">f</T>
      <T x={110} y={120} a="middle">2 × f</T>
      <T x={170} y={120} a="middle">3 × f</T>
    </Art>
  ),

  'impedance-match': () => (
    <Art label="Two rows. Matched, SWR 1 to 1: all the power passes from the feed line into the antenna. Mismatched, SWR 4 to 1: part of the power is reflected back.">
      <T x={14} y={19} c="ga-tk ga-tb">matched: SWR 1:1</T>
      <Tick x={136} y={14} />
      <Box x={14} y={26} w={72} h={26} c="ga-k">feed line</Box>
      <Box x={150} y={26} w={72} h={26} c="ga-k">antenna</Box>
      <Arr x1={92} y1={39} x2={144} y2={39} c="ga-s" />
      <T x={14} y={84} c="ga-tm">mismatched: SWR 4:1</T>
      <Cross x={150} y={79} />
      <Box x={14} y={92} w={72} h={26}>feed line</Box>
      <Box x={150} y={92} w={72} h={26}>antenna</Box>
      <Arr x1={92} y1={99} x2={144} y2={99} c="ga-s" />
      <Arr x1={144} y1={112} x2={92} y2={112} c="ga-bad" />
    </Art>
  ),

  mixer: () => (
    <Art label="A mixer, drawn as a circle with a cross. A signal at frequency f1 and an oscillator signal at f2 go in; new signals at f1 plus f2 and f1 minus f2 come out.">
      <Arr x1={24} y1={62} x2={98} y2={62} c="ga-s" />
      <T x={58} y={50} a="middle" c="ga-ts">signal f1</T>
      <C x={120} y={62} r={18} c="ga-k" />
      <P d="M107 49l26 26M133 49l-26 26" c="ga-k" />
      <Arr x1={120} y1={124} x2={120} y2={84} c="ga-s" />
      <T x={130} y={116} c="ga-ts">f2 (oscillator)</T>
      <Arr x1={142} y1={62} x2={200} y2={62} c="ga-s" />
      <T x={184} y={46} a="middle" c="ga-tk">f1 + f2</T>
      <T x={184} y={84} a="middle" c="ga-tk">f1 − f2</T>
    </Art>
  ),

  multimeter: () => (
    <Art label="A multimeter with a display, a dial that selects V, A or ohms, and two probe leads. It measures voltage, current and resistance.">
      <R x={66} y={8} w={80} h={104} c="ga-k" r={8} />
      <R x={76} y={16} w={60} h={20} />
      <P d="M86 26h8M100 26h8M114 26h8" c="ga-w ga-thin" />
      <T x={84} y={56} a="middle" c="ga-tk">V</T>
      <T x={106} y={52} a="middle">A</T>
      <T x={128} y={56} a="middle">Ω</T>
      <C x={106} y={74} r={14} />
      <P d="M106 74L96 64" c="ga-k ga-thick" />
      <C x={92} y={102} r={3.5} />
      <C x={120} y={102} r={3.5} />
      <P d="M92 106C90 132 50 134 34 112M120 106C122 132 162 134 178 114" c="ga-w ga-thin" />
      <P d="M34 112L24 92M178 114L190 96" c="ga-k" />
      <T x={160} y={28}>voltage</T>
      <T x={160} y={46}>current</T>
      <T x={160} y={64}>resistance</T>
    </Art>
  ),

  ohmmeter: () => (
    <Art label="An ohmmeter connected across a resistor that is not powered. The meter sends a small current through the resistor and measures the voltage that results.">
      <P d="M56 57V34H120M180 34H204V106H56V83" />
      <P d={zig(120, 34)} />
      <Meter x={56} y={70} l="Ω" />
      <Arr x1={72} y1={48} x2={110} y2={48} c="ga-s" />
      <T x={138} y={68} a="middle" c="ga-ts">small current</T>
      <T x={138} y={86} a="middle" c="ga-tm">measures the voltage</T>
      <T x={130} y={126} a="middle" c="ga-tm">circuit not powered</T>
    </Art>
  ),

  oscillator: () => (
    <Art label="An oscillator block with a steady sine wave coming out of it at one set frequency.">
      <R x={24} y={42} w={84} h={56} c="ga-k" r={5} />
      <P d={wave(46, 86, 60, 20, 7)} c="ga-k ga-thin" />
      <T x={66} y={88} a="middle" c="ga-tk">oscillator</T>
      <Arr x1={112} y1={70} x2={130} y2={70} />
      <P d={wave(138, 226, 70, 22, 16)} c="ga-s" />
      <T x={182} y={40} a="middle" c="ga-tm">signal out</T>
      <T x={176} y={112} a="middle" c="ga-ts">one set frequency</T>
    </Art>
  ),

  ptt: () => (
    <Art label="A transceiver with its PTT line running through a pressed switch to ground. Grounding the PTT line switches the transceiver from receive to transmit.">
      <T x={52} y={30} a="middle" c="ga-tm">transceiver</T>
      <Box x={14} y={38} w={76} h={36}>RX → TX</Box>
      <P d="M90 56H130M170 56H200V84" />
      <C x={134} y={56} r={3.5} />
      <C x={166} y={56} r={3.5} />
      <P d="M138 56H162" c="ga-k" />
      <Arr x1={150} y1={28} x2={150} y2={48} c="ga-k" />
      <T x={150} y={20} a="middle" c="ga-tk ga-tb">PTT pressed</T>
      <Gnd x={200} y={84} />
      <T x={200} y={108} a="middle" c="ga-tm">ground</T>
      <T x={14} y={128} c="ga-tm">grounded PTT: transmit</T>
    </Art>
  ),

  'radio-frequency-interference': () => (
    <Art label="A noise source sends unwanted radio energy toward a radio or TV, whose screen fills with jagged lines.">
      <R x={12} y={50} w={48} h={44} />
      <P d="M40 58l-10 16h12l-8 14" c="ga-s" />
      <T x={36} y={112} a="middle" c="ga-tm">source</T>
      <P d="M68 72l4 -9l8 18l8 -18l8 18l8 -18l8 18l8 -18l8 18l4 -9" c="ga-k" />
      <Arr x1={132} y1={72} x2={148} y2={72} c="ga-k" />
      <T x={106} y={44} a="middle" c="ga-tk ga-tb">unwanted RF</T>
      <R x={156} y={42} w={68} h={52} r={5} />
      <P d="M164 56l6 -4l6 8l6 -8l6 8l6 -8l6 8l6 -8l6 4M164 68l6 4l6 -8l6 8l6 -8l6 8l6 -8l6 8l6 -4M164 80l6 -4l6 8l6 -8l6 8l6 -8l6 8l6 -8l6 4" c="ga-bad ga-thin" />
      <T x={190} y={112} a="middle" c="ga-tm">radio or TV</T>
    </Art>
  ),

  receiver: () => (
    <Art label="A radio signal arrives at an antenna, goes into a receiver, and comes out of a loudspeaker as sound.">
      <P d={wave(10, 44, 40, 14, 7)} c="ga-s" />
      <Ant x={58} y={34} h={36} />
      <P d="M58 70H84" />
      <Box x={84} y={54} w={76} h={32} c="ga-k" tc="ga-tk">receiver</Box>
      <Arr x1={164} y1={70} x2={182} y2={70} />
      <Speaker x={198} y={70} />
      <T x={48} y={106} a="middle" c="ga-ts">radio signal</T>
      <T x={188} y={106} a="middle" c="ga-tm">sound or data</T>
    </Art>
  ),

  transmitter: () => (
    <Art label="A voice goes from a microphone into a transmitter, which generates the radio signal and sends it to the antenna.">
      <Mic x={24} y={70} />
      <Arr x1={38} y1={70} x2={54} y2={70} />
      <Box x={58} y={54} w={84} h={32} c="ga-k" tc="ga-tk">transmitter</Box>
      <P d="M142 70H170" />
      <Ant x={170} y={34} h={36} />
      <P d={wave(184, 228, 40, 14, 7)} c="ga-s" />
      <T x={24} y={106} a="middle" c="ga-tm">voice</T>
      <T x={186} y={106} a="middle" c="ga-ts">radio signal</T>
    </Art>
  ),

  resonant: () => (
    <Art label="A dipole antenna with a wave drawn over it that fits its length exactly. At the feed point in the middle the antenna acts like a pure resistance.">
      <P d="M30 66Q120 -4 210 66" c="ga-s" />
      <P d="M30 72H114M126 72H210" c="ga-k ga-thick" />
      <P d="M114 72V86L118 92V124M126 72V86L122 92V124" c="ga-w ga-thin" />
      <T x={120} y={21} a="middle" c="ga-ts">wave fits the antenna</T>
      <T x={108} y={100} a="end" c="ga-tm">tuned to the</T>
      <T x={108} y={116} a="end" c="ga-tm">frequency in use</T>
      <T x={132} y={100} c="ga-tk">feed point =</T>
      <T x={132} y={116} c="ga-tk">pure resistance</T>
    </Art>
  ),

  'rf-power-amplifier': () => (
    <Art label="A transceiver feeds a small signal into an RF power amplifier, drawn as a triangle. A much bigger signal comes out and goes to the antenna.">
      <Box x={8} y={56} w={78} h={28}>transceiver</Box>
      <P d={wave(90, 114, 70, 12, 4)} c="ga-s" />
      <P d="M118 46L118 94L160 70Z" c="ga-k" />
      <P d={wave(164, 198, 70, 17, 16)} c="ga-s" />
      <P d="M198 70H214" />
      <Ant x={214} y={30} h={40} />
      <T x={139} y={36} a="middle" c="ga-tk ga-tb">amplifier</T>
      <T x={98} y={112} a="middle" c="ga-tm">low power</T>
      <T x={184} y={112} a="middle" c="ga-ts">more power</T>
    </Art>
  ),

  selectivity: () => (
    <Art label="Three signals close together on a frequency axis. The receiver's narrow passband surrounds only the wanted one in the middle; the two neighbors are rejected.">
      <FAxis y={100} />
      <P d="M82 100V58M158 100V58" c="ga-s ga-soft ga-thick" />
      <P d="M120 100V52" c="ga-s ga-thick" />
      <P d="M98 100L103 40H137L142 100" c="ga-k" />
      <T x={120} y={30} a="middle" c="ga-ts">wanted</T>
      <T x={72} y={62} a="end" c="ga-tm">rejected</T>
      <T x={168} y={62} c="ga-tm">rejected</T>
    </Art>
  ),

  sensitivity: () => (
    <Art label="A very weak signal barely rising above the noise, with a magnifying glass over it: a sensitive receiver can still detect it.">
      <P d={noise(14, 226, 100)} c="ga-w ga-thin" />
      <P d="M120 100V80" c="ga-s ga-thick" />
      <C x={120} y={88} r={22} c="ga-k" />
      <P d="M136 104L152 122" c="ga-k ga-thick" />
      <T x={120} y={50} a="middle" c="ga-ts">weak signal</T>
      <T x={40} y={82} a="middle" c="ga-tm">noise</T>
      <T x={200} y={82} a="middle" c="ga-tk">detected</T>
    </Art>
  ),

  'solid-state': () => (
    <Art label="A transistor symbol, the heart of solid-state equipment, beside a vacuum tube that is crossed out.">
      <C x={70} y={64} r={26} c="ga-k" />
      <P d="M62 48V80" c="ga-k ga-thick" />
      <P d="M28 64H62M62 56L84 42V20M84 86V108" c="ga-k" />
      <Arr x1={62} y1={72} x2={84} y2={86} c="ga-k" />
      <T x={70} y={128} a="middle" c="ga-tk ga-tb">transistor</T>
      <P d="M158 46a18 18 0 0 1 36 0v38a6 6 0 0 1 -6 6h-24a6 6 0 0 1 -6 -6z" />
      <P d="M166 52h20M168 82l8 -8l8 8" c="ga-w ga-thin" />
      <P d="M166 64h20" c="ga-w ga-thin ga-dash" />
      <P d="M152 24L200 104M200 24L152 104" c="ga-bad ga-thin" />
      <T x={176} y={128} a="middle" c="ga-tm">vacuum tube</T>
    </Art>
  ),

  'spurious-emissions': () => (
    <Art label="A frequency axis with the intended signal in the middle and several small unwanted signals scattered at other frequencies on both sides: spurious emissions.">
      <FAxis y={100} />
      <P d="M92 100Q98 42 120 42Q142 42 148 100" c="ga-s" />
      <P d="M36 100V78M62 100V88M186 100V72M210 100V86" c="ga-k ga-thick" />
      <T x={120} y={30} a="middle" c="ga-ts">intended signal</T>
      <T x={48} y={64} a="middle" c="ga-tk">spurious</T>
      <T x={198} y={58} a="middle" c="ga-tk">spurious</T>
    </Art>
  ),

  swr: () => (
    <Art label="A transmitter, feed line and antenna with a forward arrow and a smaller reflected arrow. Below, an SWR scale: 1 to 1 is a perfect match and 4 to 1 is a mismatch.">
      <Box x={14} y={30} w={36} h={28}>TX</Box>
      <P d="M50 44H196" />
      <Ant x={196} y={18} h={26} />
      <Arr x1={64} y1={32} x2={172} y2={32} c="ga-s" />
      <T x={118} y={22} a="middle" c="ga-ts">forward</T>
      <Arr x1={172} y1={58} x2={128} y2={58} c="ga-bad" />
      <T x={120} y={62} a="end" c="ga-tm">reflected</T>
      <P d="M30 98H210" c="ga-w ga-thick" />
      <P d="M30 98H62" c="ga-good ga-thick" />
      <P d="M124 98H210" c="ga-bad ga-thick" />
      <P d="M30 90V106M170 90V106" c="ga-k" />
      <T x={120} y={88} a="middle" c="ga-tk ga-tb">SWR</T>
      <T x={14} y={122}>1:1 perfect match</T>
      <T x={226} y={122} a="end">4:1 mismatch</T>
    </Art>
  ),

  'swr-meter': () => (
    <Art label="An SWR meter in the line between a radio and an antenna. Its needle points to 1 to 1, a perfect match; a mark further along the scale reads 4 to 1, a mismatch.">
      <P d="M16 58H70M170 58H224" />
      <R x={70} y={20} w={100} h={78} c="ga-k ga-fbg" r={6} />
      <P d="M84 66.8A44 44 0 0 1 156 66.8" c="ga-k ga-thin" />
      <P d="M84 66.8l-5 -4M142 53.9l3 -6" c="ga-k ga-thin" />
      <P d="M120 92L90 71" c="ga-s" />
      <Dot x={120} y={92} c="ga-fk" r={3} />
      <T x={84} y={42} a="middle">1:1</T>
      <T x={152} y={42} a="middle">4:1</T>
      <T x={150} y={90} a="middle" c="ga-tk ga-tb">SWR</T>
      <T x={40} y={76} a="middle" c="ga-tm">radio</T>
      <T x={198} y={76} a="middle" c="ga-tm">antenna</T>
      <T x={120} y={116} a="middle" c="ga-tm">1:1 = perfect match</T>
      <T x={120} y={131} a="middle" c="ga-tm">4:1 = mismatch</T>
    </Art>
  ),

  transverter: () => (
    <Art label="A transceiver working on one band is connected to a transverter, which converts its signals in both directions to another band at the antenna.">
      <Box x={8} y={50} w={78} h={30}>transceiver</Box>
      <Arr x1={90} y1={65} x2={106} y2={65} both />
      <Box x={110} y={50} w={78} h={30} c="ga-k" tc="ga-tk">transverter</Box>
      <P d="M188 65H214" />
      <Ant x={214} y={24} h={41} />
      <T x={47} y={102} a="middle" c="ga-tm">one band</T>
      <T x={170} y={102} a="middle" c="ga-tk">another band</T>
      <P d={wave(16, 80, 120, 32, 6)} c="ga-s" />
      <P d={wave(138, 204, 120, 11, 6)} c="ga-s" />
    </Art>
  ),

  /* ===== T8: signals and emissions ===== */

  am: () => (
    <Art label="Top: an AM wave, a fast carrier whose height rises and falls with the voice. Bottom: its spectrum, a carrier with a sideband on each side.">
      <P d={amPath(14, 226, 40, 7, 14, 8, 106, 1)} c="ga-k ga-thin ga-dash" />
      <P d={amPath(14, 226, 40, 7, 14, 8, 106, -1)} c="ga-k ga-thin ga-dash" />
      <P d={amPath(14, 226, 40, 7, 14, 8, 106)} c="ga-s ga-thin" />
      <P d="M60 126H180" c="ga-w ga-thin" />
      <P d="M120 126V92" c="ga-s ga-thick" />
      <P d="M80 126L112 108V126M128 126V108L160 126" c="ga-k" />
      <T x={120} y={84} a="middle" c="ga-ts">carrier</T>
      <T x={74} y={120} a="end" c="ga-tk">sideband</T>
      <T x={166} y={120} c="ga-tk">sideband</T>
    </Art>
  ),

  ssb: () => (
    <Art label="A spectrum on a frequency axis. The carrier and one sideband are dashed because they are not sent; the other sideband is solid, sent on its own, and about 3 kilohertz wide.">
      <FAxis y={102} label="" />
      <P d="M50 102L102 60V102" c="ga-w ga-thin ga-dash" />
      <P d="M110 102V38" c="ga-w ga-dash" />
      <P d="M118 102V60L170 102Z" c="ga-fs ga-soft" />
      <P d="M118 102V60L170 102" c="ga-k" />
      <T x={70} y={48} a="middle" c="ga-tm">not sent</T>
      <T x={150} y={48} a="middle" c="ga-tk ga-tb">sent</T>
      <P d="M118 108V118M170 108V118M118 113H170" c="ga-k ga-thin" />
      <T x={144} y={132} a="middle" c="ga-tk">about 3 kHz</T>
    </Art>
  ),

  'upper-sideband': () => (
    <Art label="A carrier on a frequency axis with a sideband on each side. The lower sideband sits just below the carrier frequency and the upper sideband, highlighted, sits just above it.">
      <FAxis y={100} />
      <P d="M120 100V36" c="ga-w ga-thick" />
      <P d="M60 100L112 62V100" c="ga-w" />
      <P d="M128 100V62L180 100Z" c="ga-fk ga-soft" />
      <P d="M128 100V62L180 100" c="ga-k" />
      <T x={120} y={26} a="middle" c="ga-tm">carrier</T>
      <T x={76} y={56} a="middle" c="ga-tm">lower</T>
      <T x={164} y={56} a="middle" c="ga-tk ga-tb">upper</T>
    </Art>
  ),

  modulation: () => (
    <Art label="A slow speech wave and a fast, steady carrier are combined. The result is a modulated signal: the carrier now changes with the speech.">
      <T x={42} y={21} a="middle" c="ga-tm">speech</T>
      <P d={wave(12, 72, 42, 40, 11)} c="ga-w" />
      <T x={42} y={74} a="middle" c="ga-tk ga-tl">+</T>
      <P d={wave(12, 72, 96, 8, 11)} c="ga-s ga-thin" />
      <T x={42} y={126} a="middle" c="ga-tm">carrier</T>
      <Arr x1={84} y1={68} x2={108} y2={68} c="ga-k" />
      <P d={amPath(120, 228, 68, 8, 14, 10, 108)} c="ga-s ga-thin" />
      <T x={174} y={118} a="middle" c="ga-tk">modulated signal</T>
    </Art>
  ),

  pm: () => (
    <Art label="A dashed plain carrier and a solid phase-modulated wave of the same height. The solid wave's peaks arrive early in one part and late in another: its timing shifts while its height stays the same.">
      <P d={wave(14, 226, 50, 24, 18)} c="ga-w ga-thin ga-dash" />
      <P d={plot(14, 226, (x) => 50 - 18 * Math.sin(((x - 14) / 24) * 2 * Math.PI + 1.4 * Math.sin(((x - 14) / 212) * 2 * Math.PI)))} c="ga-s" />
      <T x={67} y={90} a="middle" c="ga-tk ga-tb">early</T>
      <T x={173} y={90} a="middle" c="ga-tk ga-tb">late</T>
      <T x={120} y={110} a="middle" c="ga-tm">dashed: plain carrier</T>
      <T x={120} y={128} a="middle" c="ga-ts">PM: timing shifts, height stays</T>
    </Art>
  ),

  psk: () => (
    <Art label="A sine wave of constant height that suddenly flips its phase at two marked moments. Each phase flip carries data.">
      <P d={plot(14, 226, (x) => 58 - (x >= 78 && x < 142 ? -1 : 1) * 18 * Math.sin(((x - 14) / 16) * 2 * Math.PI))} c="ga-s" />
      <P d="M78 30V92M142 30V92" c="ga-k ga-thin ga-dash" />
      <T x={78} y={22} a="middle" c="ga-tk ga-tb">flip</T>
      <T x={142} y={22} a="middle" c="ga-tk ga-tb">flip</T>
      <T x={120} y={116} a="middle" c="ga-tm">each phase shift carries data</T>
    </Art>
  ),

  bandwidth: () => (
    <Art label="Four signals side by side on a frequency axis, each wider than the last: CW 150 hertz, SSB 3 kilohertz, FM 10 to 15 kilohertz, and fast-scan TV about 6 megahertz. Not to scale.">
      <T x={14} y={20} c="ga-tm">not to scale</T>
      <FAxis y={92} label="" x1={232} />
      <P d="M30 92V52" c="ga-s ga-thick" />
      <R x={50} y={52} w={16} h={40} c="ga-fs ga-soft" r={0} />
      <R x={50} y={52} w={16} h={40} c="ga-s" r={0} />
      <R x={84} y={52} w={50} h={40} c="ga-fs ga-soft" r={0} />
      <R x={84} y={52} w={50} h={40} c="ga-s" r={0} />
      <R x={150} y={52} w={74} h={40} c="ga-fs ga-soft" r={0} />
      <R x={150} y={52} w={74} h={40} c="ga-s" r={0} />
      <T x={30} y={44} a="middle">CW</T>
      <T x={58} y={44} a="middle">SSB</T>
      <T x={109} y={44} a="middle">FM</T>
      <T x={187} y={44} a="middle">fast-scan TV</T>
      <T x={30} y={110} a="middle" c="ga-tk">150 Hz</T>
      <T x={58} y={127} a="middle" c="ga-tk">3 kHz</T>
      <T x={109} y={110} a="middle" c="ga-tk">10 to 15 kHz</T>
      <T x={187} y={127} a="middle" c="ga-tk">about 6 MHz</T>
    </Art>
  ),

  'capture-effect': () => (
    <Art label="A strong signal and a weak signal arrive at an FM receiver on the same channel. Only the strong one is heard; the weak one is hidden.">
      <Ant x={24} y={18} h={24} />
      <Ant x={24} y={82} h={24} />
      <P d={wave(40, 112, 30, 18, 10)} c="ga-s ga-thick" />
      <P d={wave(40, 112, 94, 18, 4)} c="ga-s ga-thin" />
      <T x={76} y={58} a="middle" c="ga-ts">strong</T>
      <T x={76} y={118} a="middle" c="ga-tm">weak</T>
      <Box x={124} y={46} w={82} h={32} c="ga-k">FM receiver</Box>
      <Arr x1={114} y1={34} x2={130} y2={44} c="ga-s" />
      <Cross x={126} y={92} />
      <Arr x1={165} y1={80} x2={165} y2={98} c="ga-k" />
      <T x={165} y={116} a="middle" c="ga-tk">only the strong one</T>
    </Art>
  ),

  'amateur-satellite': () => (
    <Art label="A satellite in orbit above the Earth relays a signal sent up from one amateur station down to another.">
      <SatLink up="ga-s" down="ga-s" upL={['up']} downL={['down']} sat="ga-k" />
      <T x={120} y={66} a="middle" c="ga-tk">relay</T>
      <T x={120} y={82} a="middle" c="ga-tk">in orbit</T>
    </Art>
  ),

  uplink: () => (
    <Art label="A ground station, a satellite and a second ground station. The path from the ground up to the satellite is highlighted: the uplink.">
      <SatLink up="ga-k ga-thick" down="ga-w ga-thin" upL={['uplink']} downL={['downlink']} />
    </Art>
  ),

  downlink: () => (
    <Art label="A ground station, a satellite and a second ground station. The path from the satellite down to the ground is highlighted: the downlink.">
      <SatLink up="ga-w ga-thin" down="ga-k ga-thick" upL={['uplink']} downL={['downlink']} />
    </Art>
  ),

  'u-v-mode': () => (
    <Art label="A satellite with its uplink labelled 70 centimeters, UHF, and its downlink labelled 2 meters, VHF: U/V mode.">
      <SatLink up="ga-k" down="ga-k" upL={['uplink', '70 cm, UHF']} downL={['downlink', '2 m, VHF']} />
      <T x={120} y={82} a="middle" c="ga-tk ga-tl">U / V</T>
    </Art>
  ),

  'doppler-shift': () => (
    <Art label="A satellite moving to the right. Toward the station it is approaching, its waves are squeezed together, a higher frequency; toward the station it is leaving, they are stretched out, a lower frequency.">
      <Sat x={120} y={26} />
      <Arr x1={150} y1={26} x2={178} y2={26} c="ga-k" />
      <T x={184} y={30} c="ga-tk">moving</T>
      <P d="M10 116H230" />
      <Ant x={30} y={92} h={24} />
      <Ant x={210} y={92} h={24} />
      <g transform="translate(132 42) rotate(35)"><path class="ga-s" d={wave(0, 82, 0, 9, 5)} /></g>
      <g transform="translate(108 42) rotate(145)"><path class="ga-s" d={wave(0, 82, 0, 21, 5)} /></g>
      <T x={12} y={132} c="ga-ts">lower frequency</T>
      <T x={228} y={132} a="end" c="ga-ts">higher frequency</T>
    </Art>
  ),

  leo: () => (
    <Art label="The Earth with a satellite on a circular orbit close around it. One trip around takes around 100 minutes.">
      <C x={120} y={58} r={30} c="ga-fw ga-soft" />
      <C x={120} y={58} r={30} />
      <C x={120} y={58} r={44} c="ga-k" />
      <Dot x={151} y={27} r={5} />
      <P d="M71 52l5 -8l6 7" c="ga-k" />
      <T x={120} y={62} a="middle">Earth</T>
      <T x={120} y={126} a="middle" c="ga-tk">one orbit: around 100 minutes</T>
    </Art>
  ),

  'spin-fading': () => (
    <Art label="A spinning satellite, and a graph of its signal strength over time that rises and falls regularly as the satellite and its antennas rotate.">
      <Sat x={44} y={46} />
      <P d="M22 68A26 12 0 0 0 66 68l-2 -8M66 68l-8 2" c="ga-k" />
      <T x={44} y={102} a="middle" c="ga-tk">spinning</T>
      <P d="M100 28V104" c="ga-w ga-thin" />
      <Arr x1={100} y1={104} x2={228} y2={104} c="ga-w ga-thin" />
      <P d={wave(104, 220, 64, 40, 26)} c="ga-s" />
      <T x={96} y={20} c="ga-tm">signal strength</T>
      <T x={164} y={124} a="middle" c="ga-ts">regular rise and fall</T>
    </Art>
  ),

  'satellite-beacon': () => (
    <Art label="A satellite sends a signal down to a ground station. A tag on the signal reads status information: the satellite's beacon.">
      <Sat x={44} y={34} c="ga-k" />
      <R x={84} y={12} w={130} h={26} />
      <T x={149} y={29} a="middle" c="ga-tk">status information</T>
      <P d="M84 28L72 32" c="ga-w ga-thin" />
      <g transform="translate(60 50) rotate(21)"><path class="ga-s" d={wave(0, 124, 0, 16, 5)} /></g>
      <P d="M130 114H230" />
      <Ant x={190} y={90} h={24} />
      <T x={190} y={131} a="middle" c="ga-tm">station</T>
    </Art>
  ),

  telemetry: () => (
    <Art label="A satellite with a battery and a thermometer beside it sends its measurements down by radio. Two different ground stations receive them: anyone may listen.">
      <Sat x={40} y={34} />
      <R x={74} y={24} w={18} h={10} c="ga-k" r={1} />
      <P d="M94 27v4" c="ga-k" />
      <P d="M106 20v14" c="ga-k" />
      <Dot x={106} y={36} r={4} />
      <T x={118} y={34} c="ga-tk">measurements</T>
      <Arr x1={48} y1={50} x2={102} y2={84} c="ga-s ga-thin" />
      <Arr x1={56} y1={48} x2={186} y2={86} c="ga-s ga-thin" />
      <P d="M70 114H230" />
      <Ant x={112} y={90} h={24} />
      <Ant x={198} y={90} h={24} />
      <T x={150} y={131} a="middle" c="ga-tm">anyone may receive it</T>
    </Art>
  ),

  'satellite-tracking-program': () => (
    <Art label="A computer screen showing a satellite's wavy track across a map, beside a list of what the program gives: position, pass time, azimuth, elevation and Doppler shift.">
      <R x={10} y={14} w={128} h={84} c="ga-k" r={5} />
      <P d="M74 98v8M58 106h32" c="ga-k" />
      <P d="M18 56H130" c="ga-w ga-thin ga-dash" />
      <P d={wave(18, 130, 56, 56, 22)} c="ga-s" />
      <Dot x={88} y={34} r={5} />
      <T x={152} y={28}>position</T>
      <T x={152} y={48}>pass time</T>
      <T x={152} y={68}>azimuth</T>
      <T x={152} y={88}>elevation</T>
      <T x={152} y={108}>Doppler shift</T>
      <T x={74} y={128} a="middle" c="ga-tm">satellite on a map</T>
    </Art>
  ),

  'keplerian-elements': () => (
    <Art label="The Earth with a satellite on a tilted oval orbit. A card of orbit numbers describes that orbit and feeds a tracking program.">
      <C x={58} y={74} r={18} />
      <ellipse cx={58} cy={74} rx={46} ry={24} class="ga-s ga-thin" transform="rotate(-25 58 74)" />
      <Dot x={99.7} y={54.6} c="ga-fs" r={4.5} />
      <T x={58} y={128} a="middle" c="ga-tm">the orbit</T>
      <Arr x1={108} y1={50} x2={124} y2={46} c="ga-w ga-thin" />
      <R x={128} y={14} w={98} h={66} c="ga-k" />
      <T x={177} y={32} a="middle" c="ga-tk">orbit numbers</T>
      <P d="M138 44h18M162 44h52M138 56h18M162 56h40M138 68h18M162 68h48" c="ga-k ga-thin" />
      <Arr x1={177} y1={82} x2={177} y2={96} />
      <Box x={122} y={100} w={110} h={26}>tracking program</Box>
    </Art>
  ),

  'linear-transponder': () => (
    <Art label="A satellite transponder. A slice of one band holding several signals goes in, and the whole slice comes out again on another band.">
      <Sat x={123} y={32} />
      <P d="M12 92H70M176 92H232" c="ga-w ga-thin" />
      <P d="M22 92V62M38 92V74M56 92V56M186 92V62M202 92V74M220 92V56" c="ga-s ga-thick" />
      <Arr x1={74} y1={72} x2={84} y2={72} />
      <Box x={88} y={56} w={72} h={32} c="ga-k" tc="ga-tk">transponder</Box>
      <Arr x1={164} y1={72} x2={174} y2={72} />
      <T x={41} y={110} a="middle" c="ga-tm">one band</T>
      <T x={201} y={110} a="middle" c="ga-tm">other band</T>
      <T x={120} y={130} a="middle" c="ga-tm">every signal in the slice is relayed</T>
    </Art>
  ),

  azimuth: () => (
    <Art label="A compass seen from above with north, east, south and west. An arrow from the center shows where the antenna points, and an arc measures its angle around the horizon from north: the azimuth.">
      <C x={84} y={72} r={42} />
      <P d="M84 72V32" c="ga-w ga-thin ga-dash" />
      <P d="M84 50A22 22 0 0 1 103 61" c="ga-k ga-thin" />
      <Arr x1={84} y1={72} x2={116} y2={53.5} c="ga-k ga-thick" />
      <Dot x={84} y={72} c="ga-fw" />
      <T x={84} y={22} a="middle">N</T>
      <T x={84} y={131} a="middle">S</T>
      <T x={132} y={76}>E</T>
      <T x={36} y={76} a="end">W</T>
      <T x={156} y={46} c="ga-tk">compass</T>
      <T x={156} y={62} c="ga-tk">direction,</T>
      <T x={156} y={78} c="ga-tk">in degrees</T>
      <T x={156} y={110} c="ga-tm">top view</T>
    </Art>
  ),

  elevation: () => (
    <Art label="Side view. A station on the ground points up at a satellite; an arc marks the angle between the horizon and the pointing direction: the elevation.">
      <P d="M14 104H226" />
      <Dot x={40} y={104} c="ga-fw" r={4} />
      <Sat x={178} y={24} />
      <Arr x1={40} y1={104} x2={148} y2={40} c="ga-k ga-thick" />
      <P d="M84 104A44 44 0 0 0 78 81.5" c="ga-k" />
      <T x={92} y={97} c="ga-tk ga-tb">angle</T>
      <T x={226} y={98} a="end" c="ga-tm">horizon</T>
      <T x={120} y={126} a="middle" c="ga-tk">angle up from the horizon</T>
    </Art>
  ),

  erp: () => (
    <Art label="Transmitter power goes into a directional antenna. The antenna's gain concentrates it into a strong beam in its best direction: the effective radiated power.">
      <Box x={8} y={56} w={70} h={28}>TX power</Box>
      <P d="M78 70H96" />
      <Yagi x={112} y={70} c="ga-w" />
      <P d="M132 70C152 40 216 44 224 70C216 96 152 100 132 70Z" c="ga-fs ga-soft" />
      <P d="M132 70C152 40 216 44 224 70C216 96 152 100 132 70Z" c="ga-s" />
      <T x={110} y={40} a="middle" c="ga-tm">+ antenna gain</T>
      <T x={182} y={75} a="middle" c="ga-tk ga-tl">ERP</T>
      <T x={120} y={126} a="middle" c="ga-tm">strength in the best direction</T>
    </Art>
  ),

  'fast-scan-tv': () => (
    <Art label="A camera sends a signal about 6 megahertz wide to a television showing a moving ball: full-motion video.">
      <R x={12} y={50} w={32} h={24} />
      <P d="M44 62l12 -8v16z" />
      <P d={wave(62, 126, 62, 16, 8)} c="ga-s" />
      <T x={84} y={30} a="middle" c="ga-ts">about 6 MHz wide</T>
      <R x={134} y={36} w={84} h={56} c="ga-k" r={6} />
      <P d="M162 100h28M176 92v8" c="ga-k" />
      <C x={192} y={64} r={8} />
      <P d="M152 56h20M146 64h26M152 72h20" c="ga-w ga-thin" />
      <T x={30} y={94} a="middle" c="ga-tm">camera</T>
      <T x={170} y={122} a="middle" c="ga-tk">full-motion video</T>
    </Art>
  ),

  ntsc: () => (
    <Art label="A television showing a test pattern of vertical bars in different colors: an analog color TV signal.">
      <R x={60} y={14} w={120} h={86} c="ga-k" r={6} />
      <R x={72} y={24} w={16} h={66} c="ga-fw" r={0} />
      <R x={88} y={24} w={16} h={66} c="ga-fs" r={0} />
      <R x={104} y={24} w={16} h={66} c="ga-fgood" r={0} />
      <R x={120} y={24} w={16} h={66} c="ga-fk" r={0} />
      <R x={136} y={24} w={16} h={66} c="ga-fbad" r={0} />
      <R x={152} y={24} w={16} h={66} c="ga-fw ga-soft" r={0} />
      <P d="M104 108h32M120 100v8" c="ga-k" />
      <T x={120} y={129} a="middle" c="ga-tk">analog color TV signal</T>
    </Art>
  ),

  contesting: () => (
    <Art label="One station in the middle with lines to many other stations all around it, and a clock: contacting as many stations as possible in a set period.">
      <P d="M104 60L22 34M104 60L18 84M104 60L50 116M104 60L112 122M104 60L152 104M104 60L62 22M104 60L150 30M104 60L184 86" c="ga-s ga-thin" />
      <Dot x={22} y={34} c="ga-fw" r={4} />
      <Dot x={18} y={84} c="ga-fw" r={4} />
      <Dot x={50} y={116} c="ga-fw" r={4} />
      <Dot x={112} y={122} c="ga-fw" r={4} />
      <Dot x={152} y={104} c="ga-fw" r={4} />
      <Dot x={62} y={22} c="ga-fw" r={4} />
      <Dot x={150} y={30} c="ga-fw" r={4} />
      <Dot x={184} y={86} c="ga-fw" r={4} />
      <C x={104} y={60} r={9} c="ga-k ga-fbg" />
      <Dot x={104} y={60} r={3.5} />
      <C x={208} y={30} r={14} c="ga-k" />
      <P d="M208 30V20M208 30h7" c="ga-k" />
      <T x={230} y={62} a="end" c="ga-tk">set period</T>
      <T x={230} y={128} a="end" c="ga-ts">many contacts</T>
    </Art>
  ),

  'directional-antenna': () => (
    <Art label="A directional antenna seen from above. Its pattern has one large lobe in front, where it is strong, and only a small lobe behind, where it is weak.">
      <P d="M88 70C120 30 208 40 214 70C208 100 120 110 88 70Z" c="ga-fs ga-soft" />
      <P d="M88 70C120 30 208 40 214 70C208 100 120 110 88 70Z" c="ga-s" />
      <P d="M52 70C40 62 26 64 24 70C26 76 40 78 52 70Z" c="ga-s ga-thin" />
      <Yagi x={70} y={70} />
      <Arr x1={112} y1={70} x2={192} y2={70} c="ga-s" />
      <T x={152} y={30} a="middle" c="ga-ts">strong this way</T>
      <T x={32} y={50} a="middle" c="ga-tm">weak</T>
    </Art>
  ),

  'radio-direction-finding': () => (
    <Art label="Two directional antennas at different places each point toward the strongest signal. Their two bearing lines cross at the signal source.">
      <P d="M56 89L160 44M193 86L172 46" c="ga-k ga-thin ga-dash" />
      <Yagi x={40} y={96} ang={-23.3} />
      <Yagi x={200} y={100} ang={-116.6} />
      <Dot x={168} y={40} c="ga-fs" r={5} />
      <P d="M156 32a14 14 0 0 1 24 0M152 26a20 20 0 0 1 32 0" c="ga-s ga-thin" />
      <T x={100} y={30} a="middle" c="ga-ts">signal source</T>
      <T x={112} y={130} a="middle" c="ga-tk">two bearings cross at the source</T>
    </Art>
  ),

  'hidden-transmitter-hunt': () => (
    <Art label="A person holds a directional antenna and points it toward a transmitter hidden in a bush, following its signal.">
      <C x={34} y={58} r={6} />
      <P d="M34 64V92L26 112M34 92L42 112M34 72L62 78" />
      <Yagi x={80} y={78} />
      <C x={196} y={80} r={22} c="ga-w ga-dash" />
      <T x={196} y={85} a="middle" c="ga-ts ga-tl">?</T>
      <P d="M166 68a20 20 0 0 0 0 24M154 60a34 34 0 0 0 0 40" c="ga-s" />
      <T x={12} y={30} c="ga-tk">directional antenna</T>
      <T x={228} y={126} a="end" c="ga-tm">hidden transmitter</T>
    </Art>
  ),

  'grid-locator': () => (
    <Art label="A map with a coastline, divided into squares by a grid. One square is highlighted and tagged with a code made of letters and numbers.">
      <P d="M40 34V126M80 34V126M120 34V126M160 34V126M200 34V126M40 34H200M40 64.7H200M40 95.3H200M40 126H200" c="ga-w ga-thin" />
      <P d="M40 104C70 84 90 114 120 88S170 50 200 62" c="ga-w" />
      <R x={120} y={64.7} w={40} h={30.6} c="ga-fk ga-soft" r={0} />
      <R x={120} y={64.7} w={40} h={30.6} c="ga-k" r={0} />
      <Dot x={140} y={80} r={3} />
      <T x={120} y={22} a="middle" c="ga-tk">code: letters + numbers</T>
      <P d="M140 64V28" c="ga-k ga-thin" />
    </Art>
  ),

  echolink: () => (
    <Art label="A computer connects through the internet to a repeater, which transmits by radio. No radio is needed to start the transmission.">
      <T x={120} y={22} a="middle" c="ga-tk">no radio needed to start</T>
      <PC x={30} y={70} c="ga-k" />
      <P d="M50 72H72M143 72H166" c="ga-k" />
      <Cloud x={110} y={72} />
      <Tower x={178} y={96} h={48} />
      <Rays x={180} y={50} />
      <T x={10} y={116} c="ga-tm">computer or phone</T>
      <T x={186} y={116} a="middle" c="ga-tm">repeater</T>
    </Art>
  ),

  irlp: () => (
    <Art label="A handheld radio sends DTMF tones to a repeater. That repeater is connected through the internet to another repeater far away.">
      <T x={140} y={22} a="middle" c="ga-tk">repeaters linked by internet</T>
      <HT x={20} y={82} />
      <Arr x1={32} y1={70} x2={68} y2={56} c="ga-s" />
      <T x={46} y={46} a="middle" c="ga-ts">DTMF</T>
      <Tower x={80} y={98} h={50} />
      <P d="M86 82H102M175 82H200" c="ga-k" />
      <Cloud x={140} y={82} />
      <Tower x={206} y={98} h={50} />
      <T x={80} y={116} a="middle" c="ga-tm">repeater</T>
      <T x={200} y={116} a="middle" c="ga-tm">repeater</T>
    </Art>
  ),

  gateway: () => (
    <Art label="Two amateur stations reach a gateway station by radio. The gateway is wired to the internet.">
      <Ant x={22} y={40} h={22} />
      <Ant x={22} y={92} h={22} />
      <P d="M36 46L98 40M36 98L98 46" c="ga-s ga-thin ga-dash" />
      <T x={62} y={30} a="middle" c="ga-ts">radio</T>
      <Ant x={112} y={30} h={34} c="ga-k" />
      <Box x={80} y={64} w={64} h={30} c="ga-k" tc="ga-tk">gateway</Box>
      <P d="M144 79H160" c="ga-k" />
      <Cloud x={198} y={79} />
    </Art>
  ),

  voip: () => (
    <Art label="A voice goes into a microphone, is turned into digital packets, crosses the internet, and comes out of a loudspeaker as voice again.">
      <T x={120} y={22} a="middle" c="ga-tk">voice carried over the internet</T>
      <Mic x={18} y={68} />
      <P d={wave(30, 58, 66, 14, 6)} c="ga-s ga-thin" />
      <R x={66} y={61} w={10} h={10} c="ga-fk" r={1} />
      <R x={80} y={61} w={10} h={10} c="ga-fk" r={1} />
      <R x={94} y={61} w={10} h={10} c="ga-fk" r={1} />
      <Cloud x={148} y={66} />
      <Arr x1={184} y1={66} x2={196} y2={66} />
      <Speaker x={210} y={66} />
      <T x={34} y={104} a="middle" c="ga-tm">voice</T>
      <T x={86} y={104} a="middle" c="ga-tk">digital</T>
      <T x={212} y={104} a="middle" c="ga-tm">voice</T>
    </Art>
  ),

  'ieee-802-11': () => (
    <Art label="A Wi-Fi router sends packets of digital data by radio to a computer.">
      <R x={20} y={78} w={56} h={20} c="ga-k" />
      <P d="M30 78V56M66 78V56" c="ga-k" />
      <P d="M40 62a11 11 0 0 1 16 0M33 54a21 21 0 0 1 30 0" c="ga-s" />
      <T x={48} y={118} a="middle" c="ga-tk ga-tb">Wi-Fi</T>
      <R x={96} y={66} w={14} h={10} c="ga-fs" r={1} />
      <R x={120} y={66} w={14} h={10} c="ga-fs" r={1} />
      <R x={144} y={66} w={14} h={10} c="ga-fs" r={1} />
      <T x={127} y={52} a="middle" c="ga-ts">digital data</T>
      <PC x={196} y={72} />
      <T x={196} y={104} a="middle" c="ga-tm">computer</T>
    </Art>
  ),

  'mesh-network': () => (
    <Art label="Six Wi-Fi nodes joined by radio links into a web. An arrowed path shows data hopping from node to node across the network.">
      <P d="M36 44L110 30L196 46M36 44L70 96L150 92L212 100L196 46M110 30L70 96M196 46L150 92" c="ga-k ga-thin" />
      <Arr x1={48} y1={36} x2={96} y2={27} c="ga-s" />
      <Arr x1={116} y1={42} x2={143} y2={82} c="ga-s" />
      <Arr x1={162} y1={88} x2={199} y2={93} c="ga-s" />
      <Node x={36} y={44} />
      <Node x={110} y={30} />
      <Node x={196} y={46} />
      <Node x={70} y={96} />
      <Node x={150} y={92} />
      <Node x={212} y={100} />
      <T x={120} y={130} a="middle" c="ga-tm">Wi-Fi gear: data hops node to node</T>
    </Art>
  ),

  'packet-radio': () => (
    <Art label="Small packets of data travel by radio between two stations. One packet is opened up below: it holds a call sign, the data and a checksum.">
      <Ant x={24} y={18} h={26} />
      <Ant x={216} y={18} h={26} />
      <R x={50} y={24} w={24} h={12} c="ga-fs" r={1} />
      <R x={90} y={24} w={24} h={12} c="ga-fs" r={1} />
      <R x={130} y={24} w={24} h={12} c="ga-fs" r={1} />
      <R x={170} y={24} w={24} h={12} c="ga-fs" r={1} />
      <P d="M90 40L20 80M114 40L220 80" c="ga-w ga-thin ga-dash" />
      <Box x={20} y={82} w={72} h={28} c="ga-k">call sign</Box>
      <Box x={92} y={82} w={58} h={28} c="ga-k">data</Box>
      <Box x={150} y={82} w={70} h={28} c="ga-k">checksum</Box>
      <T x={120} y={130} a="middle" c="ga-tm">inside one packet</T>
    </Art>
  ),

  checksum: () => (
    <Art label="A packet made of a data block and a checksum. The receiver works the number out again: if it is the same the data is good, if it is different an error is found.">
      <Box x={20} y={16} w={126} h={30}>data</Box>
      <Box x={146} y={16} w={74} h={30} c="ga-k" tc="ga-tk">checksum</Box>
      <T x={120} y={70} a="middle" c="ga-tm">receiver works it out again</T>
      <Tick x={34} y={94} />
      <T x={50} y={98}>same number: data is good</T>
      <Cross x={35} y={116} />
      <T x={50} y={121}>different: error found</T>
    </Art>
  ),

  arq: () => (
    <Art label="Three steps between a sender and a receiver. A packet arrives with errors; the receiver asks for it to be sent again; the packet is sent again and arrives correctly.">
      <P d="M28 30V124M204 30V124" c="ga-w ga-thin" />
      <T x={28} y={21} a="middle" c="ga-tm">sends</T>
      <T x={204} y={21} a="middle" c="ga-tm">receives</T>
      <Arr x1={34} y1={50} x2={198} y2={50} c="ga-s" />
      <T x={116} y={42} a="middle" c="ga-tm">packet has errors</T>
      <Cross x={220} y={50} />
      <Arr x1={198} y1={82} x2={34} y2={82} c="ga-k" />
      <T x={116} y={74} a="middle" c="ga-tk ga-tb">send it again</T>
      <Arr x1={34} y1={114} x2={198} y2={114} c="ga-s" />
      <T x={116} y={106} a="middle" c="ga-tm">sent again</T>
      <Tick x={219} y={114} />
    </Art>
  ),

  aprs: () => (
    <Art label="A handheld radio sends packets carrying its GPS position. On a map, pins show where each station is.">
      <HT x={26} y={72} />
      <R x={46} y={60} w={14} h={10} c="ga-fs" r={1} />
      <R x={66} y={60} w={14} h={10} c="ga-fs" r={1} />
      <Arr x1={84} y1={65} x2={98} y2={65} c="ga-s" />
      <T x={8} y={108} c="ga-ts">GPS position</T>
      <R x={104} y={18} w={122} h={92} c="ga-k" />
      <P d="M145 18V110M186 18V110M104 49H226M104 80H226" c="ga-w ga-thin ga-soft" />
      <P d="M106 98C140 84 160 104 224 40" c="ga-w ga-thin ga-dash" />
      <P d="M132 88l-5 -10a5.5 5.5 0 1 1 10 0zM170 82l-5 -10a5.5 5.5 0 1 1 10 0zM204 54l-5 -10a5.5 5.5 0 1 1 10 0z" c="ga-fk" />
      <T x={165} y={129} a="middle" c="ga-tk">map of stations</T>
    </Art>
  ),

  'earth-moon-earth': () => (
    <Art label="A station on the Earth sends a signal up to the Moon. It bounces off and a very weak echo comes back down to another station on the Earth.">
      <P d="M6 124A80 80 0 0 1 134 124" />
      <Ant x={40} y={72} h={24} />
      <Ant x={100} y={72} h={24} />
      <C x={202} y={34} r={20} c="ga-k" />
      <C x={196} y={28} r={4} c="ga-k ga-thin" />
      <C x={208} y={42} r={3} c="ga-k ga-thin" />
      <Arr x1={50} y1={66} x2={178} y2={36} c="ga-s" />
      <Arr x1={182} y1={46} x2={110} y2={70} c="ga-s ga-thin" />
      <T x={202} y={74} a="middle" c="ga-tk ga-tb">Moon</T>
      <T x={150} y={88} c="ga-ts">weak echo</T>
      <T x={70} y={124} a="middle" c="ga-tm">Earth</T>
    </Art>
  ),

  'weak-signal-operation': () => (
    <Art label="A signal leaves one station strong and shrinks along a long path until it is very faint at the other station. SSB voice and FT8 are modes used for this.">
      <P d="M10 78H230" />
      <Ant x={22} y={34} h={44} />
      <Ant x={218} y={34} h={44} />
      <P d={plot(38, 204, (x) => 48 - (18 * Math.exp(-(x - 38) / 60) + 1.2) * Math.sin(((x - 38) / 14) * 2 * Math.PI))} c="ga-s" />
      <T x={204} y={26} a="end" c="ga-ts">very faint</T>
      <T x={120} y={100} a="middle" c="ga-tm">long or difficult path</T>
      <T x={120} y={124} a="middle" c="ga-tk">modes: SSB voice, FT8</T>
    </Art>
  ),

  'wsjt-x': () => (
    <Art label="A computer screen with a waterfall display of faint signal traces and decoded lines of text, beside a list: FT8, Moon bounce, meteor scatter and weak beacons.">
      <R x={10} y={14} w={108} h={86} c="ga-k" r={5} />
      <P d="M64 100v8M48 108h32" c="ga-k" />
      <P d="M30 22V60M96 22V60" c="ga-s ga-thin ga-dash" />
      <P d="M52 22V60" c="ga-s ga-thin" />
      <P d="M72 22V60" c="ga-s ga-thin ga-soft" />
      <P d="M10 66H118M20 78h64M20 88h46" c="ga-w ga-thin" />
      <T x={64} y={128} a="middle" c="ga-tm">waterfall</T>
      <T x={132} y={30} c="ga-tk ga-tb">FT8</T>
      <T x={132} y={52}>Moon bounce</T>
      <T x={132} y={74}>meteor scatter</T>
      <T x={132} y={96}>weak beacons</T>
    </Art>
  ),
};
