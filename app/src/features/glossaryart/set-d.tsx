import type { ComponentChildren, VNode } from 'preact';
import { Art, T, wave, type TermArt } from './kit';

/* Drawings for FCC rules (T1), operating procedures (T2) and safety (T0). */

/* ---------- shared shapes ---------- */

const r1 = (n: number) => +n.toFixed(1);

function headD(x: number, y: number, a: number, s = 7): string {
  return `M${r1(x - s * Math.cos(a - 0.5))} ${r1(y - s * Math.sin(a - 0.5))}L${x} ${y}L${r1(x - s * Math.cos(a + 0.5))} ${r1(y - s * Math.sin(a + 0.5))}`;
}

/** A straight arrow; `both` adds a head at the start too. */
function Arrow({ x1, y1, x2, y2, c = 'ga-w', both = false }: { x1: number; y1: number; x2: number; y2: number; c?: string; both?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return <path class={c} d={`M${x1} ${y1}L${x2} ${y2}${headD(x2, y2, a)}${both ? headD(x1, y1, a + Math.PI) : ''}`} />;
}

/** A standing stick figure, 38 units tall, feet at (x, y). */
function Person({ x, y, c = 'ga-w', s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  const u = (n: number) => r1(n * s);
  return <path class={c} d={`M${x - u(5)} ${y - u(33)}a${u(5)} ${u(5)} 0 1 0 ${u(10)} 0a${u(5)} ${u(5)} 0 1 0 ${-u(10)} 0M${x} ${y - u(28)}V${y - u(12)}M${x - u(8)} ${y - u(17)}L${x} ${y - u(24)}L${x + u(8)} ${y - u(17)}M${x - u(6)} ${y}L${x} ${y - u(12)}L${x + u(6)} ${y}`} />;
}

/** A finely sampled sine burst, for short wavelengths. */
function fine(x0: number, x1: number, y: number, length: number, amp: number): string {
  let d = '';
  for (let x = x0; x <= x1 + 0.01; x += 0.5) d += `${x === x0 ? 'M' : 'L'}${x} ${r1(y - amp * Math.sin(((x - x0) / length) * 2 * Math.PI))}`;
  return d;
}

/** A handheld radio; (x, y) is the top centre of its body, the antenna rises 12 above. */
function HT({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) {
  return <path class={c} d={`M${x - 7} ${y}h14v24h-14ZM${x + 4} ${y}v-12M${x - 3} ${y + 7}h6`} />;
}

/** A desk radio, 40 x 22, top left at (x, y). */
function Rig({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) {
  return <path class={c} d={`M${x} ${y}h40v22h-40ZM${x + 5} ${y + 8}h14M${x + 28} ${y + 11}a4 4 0 1 0 8 0a4 4 0 1 0 -8 0`} />;
}

/** A lattice tower standing on `base`, `h` tall, with a short antenna on top. */
function Tower({ x, base, h, c = 'ga-w', w = 10, ant = true }: { x: number; base: number; h: number; c?: string; w?: number; ant?: boolean }) {
  const half = (t: number) => w - (w - 3) * t;
  let d = `M${x - w} ${base}L${x - 3} ${base - h}M${x + w} ${base}L${x + 3} ${base - h}`;
  const n = Math.max(3, Math.round(h / 14));
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n, s = i % 2 ? 1 : -1;
    d += `M${r1(x + s * half(t0))} ${r1(base - h * t0)}L${r1(x - s * half(t1))} ${r1(base - h * t1)}`;
  }
  if (ant) d += `M${x} ${base - h}v-10`;
  return <path class={c} d={d} />;
}

/** Radio waves leaving the point (x, y) to the right (dir 1) or left (dir -1). */
function Arcs({ x, y, dir = 1, n = 3, c = 'ga-s', r0 = 7, step = 6 }: { x: number; y: number; dir?: number; n?: number; c?: string; r0?: number; step?: number }) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const r = r0 + i * step, dx = dir * r * 0.77, dy = r * 0.64;
    d += `M${r1(x + dx)} ${r1(y - dy)}A${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${r1(x + dx)} ${r1(y + dy)}`;
  }
  return <path class={c} d={d} />;
}

const Tick = ({ x, y }: { x: number; y: number }) => <path class="ga-good" d={`M${x - 5} ${y}l4 4l7 -9`} />;
const Cross = ({ x, y, s = 5, c = 'ga-bad' }: { x: number; y: number; s?: number; c?: string }) => <path class={c} d={`M${x - s} ${y - s}l${2 * s} ${2 * s}M${x + s} ${y - s}l${-2 * s} ${2 * s}`} />;

const groundD = (x: number, y: number) => `M${x} ${y}v8M${x - 9} ${y + 8}h18M${x - 6} ${y + 12}h12M${x - 3} ${y + 16}h6`;
const Ground = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => <path class={c} d={groundD(x, y)} />;

/** The surface of the soil with a few hatch marks under it. */
function Soil({ y, x0 = 6, x1 = 234 }: { y: number; x0?: number; x1?: number }) {
  let d = `M${x0} ${y}H${x1}`;
  for (let x = x0 + 12; x < x1; x += 18) d += `M${x} ${y}l-5 6`;
  return <path class="ga-w ga-thin" d={d} />;
}

/** One big letter (for call signs and Q signals), centred on x. */
function Big({ x, y, ch, c = 'ga-tk', s = 1.8 }: { x: number; y: number; ch: string; c?: string; s?: number }) {
  return <text class={`ga-t ga-tl ga-mono ${c}`} text-anchor="middle" transform={`translate(${x} ${y}) scale(${s})`}>{ch}</text>;
}
const BigWord = ({ x, y, word, gap = 18, c = 'ga-tk', s = 1.8 }: { x: number; y: number; word: string; gap?: number; c?: string; s?: number }) => (
  <>{word.split('').map((ch, i) => <Big x={x + i * gap} y={y} ch={ch} c={c} s={s} />)}</>
);

/** A government building with columns, 60 wide and 50 tall, standing on `y`. */
function Building({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) {
  return <path class={c} d={`M${x - 26} ${y - 36}L${x} ${y - 50}L${x + 26} ${y - 36}ZM${x - 18} ${y - 36}V${y - 6}M${x - 6} ${y - 36}V${y - 6}M${x + 6} ${y - 36}V${y - 6}M${x + 18} ${y - 36}V${y - 6}M${x - 28} ${y - 6}H${x + 28}M${x - 30} ${y}H${x + 30}`} />;
}

/** A database cylinder centred on x, top at y. */
function Cyl({ x, y, w = 44, h = 40, c = 'ga-w' }: { x: number; y: number; w?: number; h?: number; c?: string }) {
  const a = w / 2;
  return <path class={c} d={`M${x - a} ${y}a${a} 7 0 1 0 ${w} 0a${a} 7 0 1 0 ${-w} 0v${h}a${a} 7 0 0 0 ${w} 0v${-h}M${x - a} ${y + h / 2}a${a} 7 0 0 0 ${w} 0`} />;
}

/** A loudspeaker pointing right, left edge at x, centred on y. */
const Speaker = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => <path class={c} d={`M${x} ${y - 5}h6l8 -8v26l-8 -8h-6Z`} />;

/** A speech bubble with its tail at the lower left. */
function Bubble({ x, y, w, h, c = 'ga-k' }: { x: number; y: number; w: number; h: number; c?: string }) {
  return <path class={c} d={`M${x + 6} ${y}h${w - 12}q6 0 6 6v${h - 12}q0 6 -6 6h${-(w - 24)}l-12 8l2 -8h-2q-6 0 -6 -6v${-(h - 12)}q0 -6 6 -6Z`} />;
}

/** The three boxes HF, VHF, UHF with one of them picked out. */
function Ranges({ hi }: { hi: 0 | 1 | 2 }) {
  return (
    <>
      {['HF', 'VHF', 'UHF'].map((n, i) => (
        <>
          <rect class={i === hi ? 'ga-k' : 'ga-w ga-thin'} x={20 + i * 67} y="8" width="66" height="18" rx="3" />
          <T x={53 + i * 67} y={21} a="middle" c={i === hi ? 'ga-tk ga-tb' : 'ga-tm'}>{n}</T>
        </>
      ))}
      <path class="ga-fk" d={`M${49 + hi * 67} 29h8l-4 6Z`} />
    </>
  );
}

/* ---------- bands and frequencies ---------- */

const tenMeters: TermArt = () => {
  const fx = (f: number) => r1(20 + ((f - 28) * 200) / 1.7);
  return (
    <Art label="The 10-meter band in the HF range, from 28.000 to 29.700 megahertz, with the beacon segment 28.200 to 28.300 and the Technician phone segment 28.300 to 28.500 marked.">
      <Ranges hi={0} />
      <T x={20} y={50}>28.000</T>
      <T x={220} y={50} a="end">29.700 MHz</T>
      <rect class="ga-fs" x={fx(28.2)} y="58" width={r1(fx(28.3) - fx(28.2))} height="16" />
      <rect class="ga-fk" x={fx(28.3)} y="58" width={r1(fx(28.5) - fx(28.3))} height="16" />
      <rect class="ga-w" x="20" y="58" width="200" height="16" />
      <path class="ga-k ga-thin" d="M67 76V96" />
      <T x={73} y={100} c="ga-tk">Tech phone 28.300–28.500</T>
      <path class="ga-s ga-thin" d="M49 76V118" />
      <T x={55} y={122} c="ga-ts">beacons 28.200–28.300</T>
    </Art>
  );
};

const twoMeters: TermArt = () => (
  <Art label="The 2-meter band in the VHF range, from 144 to 148 megahertz, with the CW-only segment 144.0 to 144.1 at its lower end and 146.52 megahertz marked inside it.">
    <Ranges hi={1} />
    <T x={20} y={50}>144</T>
    <T x={220} y={50} a="end">148 MHz</T>
    <rect class="ga-fk" x="20" y="58" width="5" height="16" />
    <rect class="ga-w" x="20" y="58" width="200" height="16" />
    <path class="ga-s" d="M146 54V78" />
    <T x={146} y={94} a="middle" c="ga-ts">146.52</T>
    <path class="ga-k ga-thin" d="M22 76V112" />
    <T x={28} y={116} c="ga-tk">CW only 144.0–144.1</T>
  </Art>
);

const seventyCm: TermArt = () => (
  <Art label="The 70-centimeter band in the UHF range, from 420 to 450 megahertz, with a 5 megahertz repeater offset drawn to scale between two frequencies.">
    <Ranges hi={2} />
    <T x={20} y={50}>420</T>
    <T x={220} y={50} a="end">450 MHz</T>
    <rect class="ga-w" x="20" y="58" width="200" height="16" />
    <path class="ga-s" d="M100 54V78M133 54V78" />
    <path class="ga-k" d="M100 84v8H133v-8" />
    <T x={142} y={96} c="ga-tk">5 MHz</T>
    <T x={120} y={122} a="middle" c="ga-tm">common repeater offset: 5 MHz</T>
  </Art>
);

const band: TermArt = () => (
  <Art label="A frequency line with two blocks picked out: the 6-meter band from 50 to 54 megahertz and the 2-meter band from 144 to 148 megahertz.">
    <Arrow x1={14} y1={80} x2={226} y2={80} />
    <rect class="ga-fk ga-soft" x="40" y="56" width="44" height="24" />
    <rect class="ga-k" x="40" y="56" width="44" height="24" />
    <rect class="ga-fk ga-soft" x="140" y="56" width="60" height="24" />
    <rect class="ga-k" x="140" y="56" width="60" height="24" />
    <T x={62} y={46} a="middle" c="ga-tk ga-tb">6 meters</T>
    <T x={170} y={46} a="middle" c="ga-tk ga-tb">2 meters</T>
    <T x={62} y={98} a="middle">50–54</T>
    <T x={170} y={98} a="middle">144–148 MHz</T>
    <T x={120} y={124} a="middle" c="ga-tm">a band = a range of frequencies</T>
  </Art>
);

const bandEdge: TermArt = () => (
  <Art label="A band edge drawn as a line on the frequency axis. One signal sits with its whole width inside the band, which is right. Another is set so close that part of it spills past the edge, which is wrong.">
    <rect class="ga-fbad ga-soft" x="170" y="26" width="56" height="70" />
    <Arrow x1={14} y1={96} x2={228} y2={96} />
    <path class="ga-k ga-thick" d="M170 26V104" />
    <T x={170} y={18} a="middle" c="ga-tk ga-tb">band edge</T>
    <T x={14} y={40} c="ga-tm">inside the band</T>
    <path class="ga-s" d="M66 96C81 96 81 52 96 52C111 52 111 96 126 96" />
    <path class="ga-bad ga-dash" d="M148 96C162 96 162 58 176 58C190 58 190 96 204 96" />
    <Tick x={50} y={114} />
    <T x={60} y={118}>all inside</T>
    <Cross x={148} y={114} />
    <T x={158} y={118}>spills over</T>
  </Art>
);

const hf: TermArt = () => (
  <Art label="The radio spectrum as a bar. The HF part runs from 3 to 30 megahertz, followed by VHF and UHF. Near the top of HF a mark shows 10 meters, the only HF band with Technician phone.">
    <path class="ga-s ga-thin" d="M123 48V34" />
    <T x={123} y={28} a="middle">10 m: Technician phone</T>
    <rect class="ga-fk ga-soft" x="20" y="50" width="110" height="22" />
    <rect class="ga-fs" x="121" y="50" width="4" height="22" />
    <rect class="ga-k" x="20" y="50" width="110" height="22" />
    <rect class="ga-w ga-thin" x="130" y="50" width="48" height="22" />
    <rect class="ga-w ga-thin" x="178" y="50" width="48" height="22" />
    <T x={70} y={66} a="middle" c="ga-tk ga-tb">HF</T>
    <T x={154} y={66} a="middle" c="ga-tm">VHF</T>
    <T x={202} y={66} a="middle" c="ga-tm">UHF</T>
    <T x={20} y={90}>3 MHz</T>
    <T x={130} y={90} a="middle">30 MHz</T>
    <T x={120} y={114} a="middle" c="ga-tm">high frequency</T>
    <T x={120} y={130} a="middle" c="ga-tm">Technicians: 200 W PEP here</T>
  </Art>
);

const mhz: TermArt = () => (
  <Art label="One megahertz equals one million hertz, shown over a radio wave. Below, 300 divided by 146.52 megahertz gives about 2 meters, and 300 divided by 52.525 megahertz gives about 6 meters.">
    <T x={120} y={24} a="middle" c="ga-tk ga-tl">1 MHz = 1 000 000 Hz</T>
    <path class="ga-s" d={wave(20, 220, 52, 10, 10)} />
    <T x={120} y={84} a="middle" c="ga-tm">a million cycles each second</T>
    <T x={120} y={108} a="middle">300 ÷ 146.52 MHz ≈ 2 meters</T>
    <T x={120} y={125} a="middle">300 ÷ 52.525 MHz ≈ 6 meters</T>
  </Art>
);

const frequency: TermArt = () => (
  <Art label="A radio wave with its cycles counted over one second, which gives the frequency in hertz. Below, a dial scale with a pointer shows that a frequency is also a place on the dial.">
    <path class="ga-s" d={wave(30, 210, 36, 30, 12)} />
    <path class="ga-w ga-thin" d="M30 56v6H210v-6" />
    <T x={120} y={78} a="middle">cycles each second = hertz</T>
    <path class="ga-w" d="M30 106H210" />
    <path class="ga-w ga-thin" d="M30 106v6M50 106v6M70 106v6M90 106v6M110 106v6M130 106v6M150 106v6M170 106v6M190 106v6M210 106v6" />
    <path class="ga-fk" d="M130 103l-6 -11h12Z" />
    <T x={120} y={130} a="middle" c="ga-tm">also its place on the dial</T>
  </Art>
);

const freqPrivileges: TermArt = () => (
  <Art label="A band strip in which some segments are filled and ticked as allowed for your license class, and the others are left empty and crossed as not allowed.">
    <rect class="ga-fk" x="60" y="50" width="40" height="20" />
    <rect class="ga-fk" x="150" y="50" width="70" height="20" />
    <rect class="ga-w" x="20" y="50" width="200" height="20" />
    <path class="ga-w ga-thin" d="M60 50V70M100 50V70M150 50V70" />
    <Cross x={40} y={36} />
    <Tick x={80} y={36} />
    <Cross x={125} y={36} />
    <Tick x={185} y={36} />
    <T x={120} y={94} a="middle">where your license class</T>
    <T x={120} y={110} a="middle">lets you transmit</T>
  </Art>
);

const bandPlan: TermArt = () => (
  <Art label="One band divided by agreement into segments for different uses, with a simplex segment picked out. A band plan is a voluntary guideline beyond the FCC rules.">
    <T x={120} y={24} a="middle" c="ga-tm">one band, shared by agreement</T>
    <rect class="ga-fk ga-soft" x="80" y="36" width="70" height="24" />
    <rect class="ga-w" x="20" y="36" width="200" height="24" />
    <path class="ga-k" d="M80 36V60M150 36V60" />
    <T x={50} y={52} a="middle" c="ga-tm">a mode</T>
    <T x={115} y={52} a="middle" c="ga-tk ga-tb">simplex</T>
    <T x={185} y={52} a="middle" c="ga-tm">other use</T>
    <T x={120} y={86} a="middle" c="ga-tk ga-tb">band plan: who uses what</T>
    <T x={120} y={108} a="middle" c="ga-tm">a voluntary guideline,</T>
    <T x={120} y={124} a="middle" c="ga-tm">beyond the FCC rules</T>
  </Art>
);

const natCalling: TermArt = () => (
  <Art label="A radio display reading 146.520 megahertz, with three handheld radios all tuned to it: the national calling frequency for FM simplex on 2 meters.">
    <rect class="ga-k" x="50" y="14" width="140" height="34" rx="6" />
    <T x={120} y={37} a="middle" c="ga-tk ga-tl ga-mono">146.520 MHz</T>
    <path class="ga-w ga-thin ga-dash" d="M54 68L96 50M124 66V50M194 68L146 50" />
    <HT x={50} y={82} />
    <HT x={120} y={82} />
    <HT x={190} y={82} />
    <T x={120} y={128} a="middle" c="ga-tm">2 m FM simplex: call here first</T>
  </Art>
);

/* ---------- call signs and identification ---------- */

const callSign: TermArt = () => (
  <Art label="The example call sign KF1XXX in large letters, with its parts labelled: letters, one digit, letters. A call sign is assigned by the FCC and is unique to one station.">
    <T x={120} y={20} a="middle" c="ga-tm">assigned by the FCC</T>
    <BigWord x={60} y={62} word="KF" />
    <Big x={120} y={62} ch="1" c="ga-ts" />
    <BigWord x={162} y={62} word="XXX" />
    <path class="ga-w ga-thin" d="M50 72v6h38v-6M111 72v6h18v-6M152 72v6h56v-6" />
    <T x={69} y={96} a="middle">letters</T>
    <T x={120} y={96} a="middle">digit</T>
    <T x={180} y={96} a="middle">letters</T>
    <T x={120} y={124} a="middle" c="ga-tm">unique to one station</T>
  </Art>
);

const groupD: TermArt = () => (
  <Art label="The Group D call sign format shown on KF1XXX: two letters, one digit, then three letters. The shorter formats KA1X and W1XX are not Group D.">
    <T x={120} y={20} a="middle" c="ga-tk ga-tb">Group D format</T>
    <BigWord x={50} y={62} word="KF" />
    <Big x={120} y={62} ch="1" c="ga-ts" />
    <BigWord x={172} y={62} word="XXX" />
    <path class="ga-w ga-thin" d="M40 72v6h38v-6M111 72v6h18v-6M162 72v6h56v-6" />
    <T x={59} y={96} a="middle">2 letters</T>
    <T x={120} y={96} a="middle">1 digit</T>
    <T x={190} y={96} a="middle">3 letters</T>
    <T x={120} y={124} a="middle" c="ga-tm">KA1X and W1XX: not Group D</T>
  </Art>
);

const stationId: TermArt = () => (
  <Art label="A clock face with a 10-minute slice marked, next to a radio saying a call sign: identify at least every 10 minutes and at the end of the contact.">
    <path class="ga-fk ga-soft" d="M62 60V28A32 32 0 0 1 89.7 44Z" />
    <circle class="ga-k" cx="62" cy="60" r="32" />
    <path class="ga-k" d="M62 60V28M62 60L89.7 44" />
    <path class="ga-w ga-thin" d="M62 88v-5M34 60h5M90 60h-5" />
    <T x={62} y={112} a="middle" c="ga-tk ga-tb">every 10 minutes</T>
    <HT x={132} y={62} />
    <Bubble x={150} y={30} w={80} h={28} />
    <T x={190} y={49} a="middle" c="ga-tb ga-mono">KF1XXX</T>
    <T x={186} y={90} a="middle">your call sign</T>
    <T x={186} y={112} a="middle" c="ga-tm">and at the end</T>
  </Art>
);

const tactical: TermArt = () => (
  <Art label="A radio saying the tactical call sign Race Headquarters, which shows the station's role. The FCC call sign must still be given every 10 minutes.">
    <HT x={26} y={44} />
    <Bubble x={46} y={18} w={170} h={32} />
    <T x={131} y={39} a="middle" c="ga-tk ga-tb">Race Headquarters</T>
    <T x={120} y={82} a="middle" c="ga-tm">shows the station's role</T>
    <T x={120} y={106} a="middle">still give your FCC call sign</T>
    <T x={120} y={123} a="middle">every 10 minutes</T>
  </Art>
);

const selfAssigned: TermArt = () => (
  <Art label="The call sign KL7CC followed by a slash and W3. The slash and W3 are the self-assigned indicator you add. On phone the separator may be said as stroke, slant or slash.">
    <T x={166} y={24} a="middle" c="ga-tk ga-tb">added by you</T>
    <BigWord x={52} y={64} word="KL7CC" c="ga-tm" gap={17} />
    <BigWord x={148} y={64} word="/W3" gap={18} />
    <path class="ga-w ga-thin" d="M42 74v6h88v-6" />
    <path class="ga-k ga-thin" d="M139 74v6h56v-6" />
    <T x={86} y={98} a="middle" c="ga-tm">call sign</T>
    <T x={120} y={124} a="middle">say: stroke, slant or slash</T>
  </Art>
);

const vanity: TermArt = () => (
  <Art label="Two call sign plates. The top one is handed out by the FCC in sequence. The bottom one, the vanity call sign, is one you choose yourself.">
    <T x={10} y={41} c="ga-tm">FCC assigns:</T>
    <rect class="ga-w" x="112" y="22" width="116" height="30" rx="5" />
    <T x={170} y={41} a="middle" c="ga-tm">next in sequence</T>
    <T x={10} y={87} c="ga-tk ga-tb">vanity:</T>
    <rect class="ga-fk ga-soft" x="112" y="68" width="116" height="30" rx="5" />
    <rect class="ga-k" x="112" y="68" width="116" height="30" rx="5" />
    <T x={170} y={87} a="middle" c="ga-tk ga-tb">you choose</T>
    <T x={120} y={124} a="middle" c="ga-tm">any licensed amateur may pick one</T>
  </Art>
);

const phonetic: TermArt = () => (
  <Art label="The letters A, B and C, each with its phonetic word under it: Alfa, Bravo, Charlie. Spelling by voice this way is encouraged on phone.">
    <T x={120} y={20} a="middle" c="ga-tm">spell it out by voice</T>
    <Big x={50} y={62} ch="A" s={2} />
    <Big x={120} y={62} ch="B" s={2} />
    <Big x={190} y={62} ch="C" s={2} />
    <path class="ga-w ga-thin" d="M50 70v8M120 70v8M190 70v8" />
    <T x={50} y={96} a="middle" c="ga-tb">Alfa</T>
    <T x={120} y={96} a="middle" c="ga-tb">Bravo</T>
    <T x={190} y={96} a="middle" c="ga-tb">Charlie</T>
    <T x={120} y={124} a="middle" c="ga-tm">encouraged on phone</T>
  </Art>
);

/* ---------- the service, the FCC and licenses ---------- */

const service: TermArt = () => (
  <Art label="Three pictograms for the purposes of the Amateur Radio Service: two radios talking for communicate, a small circuit for experiment, and an open book for train. It is licensed and non-commercial.">
    <T x={120} y={18} a="middle" c="ga-tk ga-tb">Amateur Radio Service</T>
    <HT x={24} y={46} c="ga-k" />
    <HT x={66} y={46} c="ga-k" />
    <Arcs x={36} y={40} n={2} r0={4} step={4} />
    <Arcs x={62} y={40} dir={-1} n={2} r0={4} step={4} />
    <path class="ga-k" d="M104 46h6l3 -6l6 12l6 -12l6 12l3 -6h6V70H104Z" />
    <circle class="ga-fbg" cx="122" cy="70" r="6" />
    <circle class="ga-k" cx="122" cy="70" r="6" />
    <path class="ga-k" d="M198 48C190 42 180 42 174 46V70C180 66 190 66 198 72C206 66 216 66 222 70V46C216 42 206 42 198 48V72" />
    <T x={45} y={94} a="middle">communicate</T>
    <T x={127} y={94} a="middle">experiment</T>
    <T x={198} y={94} a="middle">train</T>
    <T x={120} y={122} a="middle" c="ga-tm">licensed, non-commercial</T>
  </Art>
);

const fcc: TermArt = () => (
  <Art label="A government building labelled FCC with three arrows to what it does for amateur radio: makes the rules, grants licenses, and enforces the rules.">
    <Building x={46} y={92} c="ga-k" />
    <T x={46} y={114} a="middle" c="ga-tk ga-tb">FCC</T>
    <Arrow x1={84} y1={58} x2={104} y2={42} />
    <Arrow x1={84} y1={70} x2={104} y2={70} />
    <Arrow x1={84} y1={82} x2={104} y2={98} />
    <T x={112} y={44}>makes the rules</T>
    <T x={112} y={74}>grants licenses</T>
    <T x={112} y={104}>enforces the rules</T>
  </Art>
);

const part97: TermArt = () => (
  <Art label="A rule book with Part 97 on its cover: the FCC rules for amateur radio, which open with the basis and purpose and contain the definitions.">
    <rect class="ga-fk ga-soft" x="20" y="24" width="66" height="84" rx="3" />
    <rect class="ga-k" x="20" y="24" width="66" height="84" rx="3" />
    <path class="ga-k ga-thin" d="M30 24V108" />
    <T x={58} y={62} a="middle" c="ga-tk ga-tb">Part</T>
    <T x={58} y={82} a="middle" c="ga-tk ga-tl">97</T>
    <T x={100} y={38}>FCC rules for</T>
    <T x={100} y={54}>amateur radio</T>
    <path class="ga-w" d="M100 78h6M100 98h6" />
    <T x={112} y={82} c="ga-tm">basis and purpose</T>
    <T x={112} y={102} c="ga-tm">definitions</T>
  </Art>
);

const licenseClass: TermArt = () => (
  <Art label="Three steps of a staircase, each higher than the last: Technician, General and Amateur Extra. A higher license class gives more frequencies.">
    <path class="ga-fk ga-soft" d="M14 106V88H84V68H154V48H226V106Z" />
    <path class="ga-k" d="M14 106V88H84V68H154V48H226V106Z" />
    <path class="ga-k ga-thin" d="M84 88V106M154 68V106" />
    <T x={49} y={80} a="middle">Technician</T>
    <T x={119} y={60} a="middle">General</T>
    <T x={190} y={24} a="middle">Amateur</T>
    <T x={190} y={40} a="middle">Extra</T>
    <T x={120} y={126} a="middle" c="ga-tm">higher class = more frequencies</T>
  </Art>
);

const technician: TermArt = () => (
  <Art label="A license card marked Technician, the entry-level class, with two power bars: 200 watts PEP on HF and 1500 watts PEP above 30 megahertz.">
    <rect class="ga-fk ga-soft" x="10" y="12" width="80" height="34" rx="5" />
    <rect class="ga-k" x="10" y="12" width="80" height="34" rx="5" />
    <T x={50} y={33} a="middle" c="ga-tk ga-tb">Technician</T>
    <T x={100} y={33} c="ga-tm">entry-level license</T>
    <T x={10} y={70}>HF: 200 W PEP</T>
    <rect class="ga-fs" x="10" y="76" width="27" height="9" rx="2" />
    <T x={10} y={108}>above 30 MHz: 1500 W PEP</T>
    <rect class="ga-fs" x="10" y="114" width="200" height="9" rx="2" />
  </Art>
);

const licenseGrant: TermArt = () => (
  <Art label="The FCC issues a license, shown as a document with a tick, and records it in the ULS database. Once it is listed there it is granted and you may transmit.">
    <Building x={40} y={90} />
    <Arrow x1={76} y1={66} x2={90} y2={66} />
    <rect class="ga-fk ga-soft" x="96" y="38" width="46" height="56" rx="3" />
    <rect class="ga-k" x="96" y="38" width="46" height="56" rx="3" />
    <path class="ga-k ga-thin" d="M104 50h30M104 60h30M104 70h18" />
    <Tick x={128} y={82} />
    <Arrow x1={148} y1={66} x2={166} y2={66} />
    <Cyl x={198} y={48} />
    <T x={40} y={110} a="middle">FCC</T>
    <T x={119} y={110} a="middle" c="ga-tk ga-tb">license</T>
    <T x={198} y={110} a="middle">ULS</T>
    <T x={120} y={130} a="middle" c="ga-tm">listed in the ULS = granted</T>
  </Art>
);

const uls: TermArt = () => (
  <Art label="A database cylinder labelled ULS next to a list of licenses in which your license appears with a tick: being listed in the FCC's license database is the proof of the grant.">
    <Cyl x={50} y={36} w={56} h={50} c="ga-k" />
    <T x={50} y={112} a="middle" c="ga-tk ga-tb">ULS</T>
    <rect class="ga-w" x="104" y="28" width="124" height="66" rx="4" />
    <path class="ga-w ga-thin" d="M114 42h70M114 82h84" />
    <rect class="ga-fk ga-soft" x="108" y="50" width="116" height="22" />
    <T x={116} y={65}>your license</T>
    <Tick x={208} y={62} />
    <T x={166} y={112} a="middle" c="ga-tm">FCC license database</T>
    <T x={120} y={130} a="middle">listed here = proof of grant</T>
  </Art>
);

const licenseTerm: TermArt = () => (
  <Art label="A bar for the ten-year license term from granted to expires, with the last part marked: renewal may be requested from 90 days before the expiration date.">
    <path class="ga-k ga-thin" d="M214 50V30" />
    <T x={220} y={24} a="end" c="ga-tk">renew from 90 days before</T>
    <rect class="ga-fk" x="208" y="52" width="12" height="16" />
    <rect class="ga-w" x="20" y="52" width="200" height="16" />
    <T x={20} y={86}>granted</T>
    <T x={220} y={86} a="end">expires</T>
    <T x={120} y={88} a="middle" c="ga-tk ga-tl">10 years</T>
    <T x={120} y={120} a="middle" c="ga-tm">the normal license term</T>
  </Art>
);

const grace: TermArt = () => (
  <Art label="A timeline. The license is valid, then expires, then a two-year grace period follows. During the grace period you can renew without a new exam, but you may not transmit until it is renewed.">
    <path class="ga-w ga-thick" d="M14 56H96" />
    <path class="ga-k ga-thick" d="M96 56H206" />
    <path class="ga-w" d="M96 46V66M206 46V66" />
    <path class="ga-w ga-thin ga-dash" d="M206 56H228" />
    <T x={52} y={40} a="middle" c="ga-tm">valid</T>
    <T x={151} y={40} a="middle" c="ga-tk ga-tb">2-year grace</T>
    <T x={96} y={84} a="middle">expires</T>
    <Tick x={30} y={104} />
    <T x={42} y={108}>renew without a new exam</T>
    <Cross x={31} y={121} />
    <T x={42} y={126}>may not transmit yet</T>
  </Art>
);

const email: TermArt = () => (
  <Art label="The FCC sends an email, shown as an envelope, to you. You must keep a working email address on file with the FCC.">
    <Building x={42} y={92} />
    <Arrow x1={78} y1={68} x2={94} y2={68} />
    <path class="ga-fk ga-soft" d="M100 50h48v36h-48Z" />
    <path class="ga-k" d="M100 50h48v36h-48ZM100 50L124 70L148 50" />
    <Arrow x1={154} y1={68} x2={178} y2={68} />
    <Person x={200} y={96} />
    <T x={42} y={110} a="middle">FCC</T>
    <T x={124} y={104} a="middle" c="ga-tk ga-tb">email</T>
    <T x={200} y={110} a="middle">you</T>
    <T x={120} y={130} a="middle" c="ga-tm">keep a working address on file</T>
  </Art>
);

const clubStation: TermArt = () => (
  <Art label="A clubhouse with an antenna on its roof, the club station, next to four people: the club must have at least four members.">
    <path class="ga-fk ga-soft" d="M22 100V62L54 40L86 62V100Z" />
    <path class="ga-k" d="M22 100V62L54 40L86 62V100ZM46 100V78h16V100M54 40V22M42 22h24" />
    <T x={54} y={118} a="middle" c="ga-tk ga-tb">club station</T>
    <Person x={122} y={100} />
    <Person x={148} y={100} />
    <Person x={174} y={100} />
    <Person x={200} y={100} />
    <T x={161} y={118} a="middle">at least 4 members</T>
    <T x={161} y={44} a="middle" c="ga-tm">its own call sign</T>
  </Art>
);

const itu: TermArt = () => (
  <Art label="A globe labelled ITU: the United Nations agency that coordinates radio between countries.">
    <circle class="ga-fk ga-soft" cx="48" cy="60" r="30" />
    <circle class="ga-k" cx="48" cy="60" r="30" />
    <ellipse class="ga-k ga-thin" cx="48" cy="60" rx="12" ry="30" />
    <path class="ga-k ga-thin" d="M18 60H78M23 44Q48 52 73 44M23 76Q48 68 73 76" />
    <T x={48} y={112} a="middle" c="ga-tk ga-tb">ITU</T>
    <T x={92} y={46}>United Nations agency</T>
    <T x={92} y={68} c="ga-tm">coordinates radio</T>
    <T x={92} y={84} c="ga-tm">between countries</T>
  </Art>
);

/* ---------- who is in control ---------- */

const controlOp: TermArt = () => (
  <Art label="A person, the control operator, sitting at the controls of a station whose antenna is transmitting. The control operator is responsible for every transmission.">
    <T x={66} y={50} a="middle" c="ga-tk ga-tb">control operator</T>
    <Person x={66} y={102} c="ga-k" />
    <path class="ga-w" d="M88 90H160M94 90V102M154 90V102" />
    <Rig x={100} y={68} />
    <path class="ga-w ga-thin" d="M140 74H196V44" />
    <path class="ga-w" d="M186 28L196 44L206 28" />
    <Arcs x={206} y={40} n={2} />
    <T x={120} y={126} a="middle" c="ga-tm">responsible for every transmission</T>
  </Art>
);

const controlPoint: TermArt = () => (
  <Art label="A ring drawn around the desk where the operator works the controls: the control point. The antenna and transmitter stand far away, which does not matter.">
    <T x={70} y={30} a="middle" c="ga-tk ga-tb">control point</T>
    <circle class="ga-fk ga-soft" cx="72" cy="78" r="38" />
    <circle class="ga-k ga-dash" cx="72" cy="78" r="38" />
    <Person x={52} y={100} />
    <path class="ga-w" d="M64 92H106" />
    <Rig x={64} y={70} />
    <path class="ga-w ga-thin ga-dash" d="M114 78H184" />
    <Tower x={204} base={104} h={60} />
    <T x={232} y={120} a="end" c="ga-tm">the antenna can</T>
    <T x={232} y={134} a="end" c="ga-tm">be far away</T>
  </Art>
);

const licensee: TermArt = () => (
  <Art label="The station licensee, holding the license, designates another person at the radio as control operator. Both are responsible for proper operation.">
    <Person x={40} y={100} c="ga-k" />
    <rect class="ga-fk ga-soft" x="54" y="62" width="20" height="26" rx="2" />
    <rect class="ga-k" x="54" y="62" width="20" height="26" rx="2" />
    <path class="ga-k ga-thin" d="M59 70h10M59 77h10" />
    <Arrow x1={84} y1={74} x2={142} y2={74} />
    <T x={113} y={64} a="middle" c="ga-tm">designates</T>
    <Person x={160} y={100} />
    <path class="ga-w" d="M172 92H226" />
    <Rig x={178} y={70} />
    <T x={8} y={118} c="ga-tk ga-tb">station licensee</T>
    <T x={232} y={118} a="end">control operator</T>
    <T x={120} y={134} a="middle" c="ga-tm">both are responsible</T>
  </Art>
);

const autoControl: TermArt = () => (
  <Art label="A repeater tower run by an automatic controller box, while the control point is drawn as an empty dashed figure: under automatic control nobody needs to be there.">
    <path class="ga-w ga-thin" d="M14 104H150" />
    <Tower x={46} base={104} h={66} />
    <Arcs x={52} y={28} n={2} />
    <Arcs x={40} y={28} dir={-1} n={2} />
    <path class="ga-w ga-thin" d="M58 92H92" />
    <rect class="ga-fk ga-soft" x="92" y="76" width="50" height="28" rx="4" />
    <rect class="ga-k" x="92" y="76" width="50" height="28" rx="4" />
    <T x={117} y={94} a="middle" c="ga-tk ga-tb">auto</T>
    <Person x={186} y={96} c="ga-w ga-soft" />
    <path class="ga-w ga-thin ga-dash" d="M166 50h40v46h-40Z" />
    <T x={46} y={122} a="middle">repeater</T>
    <T x={186} y={114} a="middle">control point:</T>
    <T x={186} y={130} a="middle" c="ga-tm">nobody needed</T>
  </Art>
);

const remoteControl: TermArt = () => (
  <Art label="A control operator with a laptop on the left, joined by a control link to a distant station with its tower on the right: remote control, for example over the internet.">
    <Person x={24} y={100} />
    <path class="ga-w" d="M40 88H72M46 88V68H68V88" />
    <path class="ga-k ga-dash" d="M78 76H146" />
    <path class="ga-k" d={headD(150, 76, 0)} />
    <T x={112} y={64} a="middle" c="ga-tk ga-tb">control link</T>
    <Rig x={156} y={66} />
    <path class="ga-w ga-thin" d="M196 78H206" />
    <Tower x={216} base={100} h={62} />
    <T x={8} y={118}>control operator</T>
    <T x={232} y={118} a="end">station</T>
    <T x={120} y={134} a="middle" c="ga-tm">for example over the internet</T>
  </Art>
);

const telecommand: TermArt = () => (
  <Art label="A person with a control box sends one-way commands to a model aircraft: telecommand. Signals that control model craft need no identification on the air.">
    <Person x={30} y={100} />
    <rect class="ga-k" x="42" y="66" width="22" height="14" rx="2" />
    <path class="ga-k" d="M53 66V52" />
    <path class="ga-s ga-dash" d="M66 56L146 40" />
    <path class="ga-s" d={headD(150, 39, -0.2)} />
    <path class="ga-w" d="M158 40H208M178 40L170 24h9l11 16M178 40l-8 14h9l11 -14M204 40v-11h6v11" />
    <T x={128} y={100} a="middle" c="ga-tk ga-tb">one-way commands</T>
    <T x={186} y={70} a="middle" c="ga-tm">model craft</T>
    <T x={120} y={124} a="middle" c="ga-tm">no ID needed for model craft</T>
  </Art>
);

const thirdParty: TermArt = () => (
  <Art label="Three figures. A third party on the left gives a message to the licensed control operator in the middle, who sends it by radio to another amateur on the right.">
    <Person x={36} y={96} />
    <Arrow x1={50} y1={70} x2={86} y2={70} />
    <Person x={102} y={96} c="ga-k" />
    <path class="ga-w" d="M112 88H160" />
    <Rig x={116} y={66} />
    <path class="ga-s ga-dash" d="M162 62H186" />
    <path class="ga-s" d={headD(190, 62, 0)} />
    <Person x={208} y={96} />
    <T x={8} y={114}>third party</T>
    <T x={118} y={114} a="middle" c="ga-tk ga-tb">operator</T>
    <T x={232} y={114} a="end">other ham</T>
    <T x={120} y={132} a="middle" c="ga-tm">a message on someone's behalf</T>
  </Art>
);

const freqCoord: TermArt = () => (
  <Art label="A volunteer frequency coordinator with a clipboard stands between two repeater towers and recommends channels to each so they do not interfere. Local amateurs choose the coordinator, not the FCC.">
    <T x={120} y={20} a="middle" c="ga-tk ga-tb">recommends channels</T>
    <Tower x={32} base={96} h={52} />
    <Tower x={208} base={96} h={52} />
    <Person x={116} y={96} c="ga-k" />
    <rect class="ga-k" x="126" y="64" width="14" height="18" rx="2" />
    <Arrow x1={100} y1={72} x2={52} y2={62} c="ga-k ga-thin" />
    <Arrow x1={146} y1={72} x2={188} y2={62} c="ga-k ga-thin" />
    <T x={120} y={114} a="middle" c="ga-tm">a volunteer, chosen by</T>
    <T x={120} y={130} a="middle" c="ga-tm">local amateurs, not the FCC</T>
  </Art>
);

/* ---------- what you may and may not send ---------- */

const broadcasting: TermArt = () => (
  <Art label="A tower transmitting to members of the general public, with a cross over the signal: that is broadcasting, which amateurs may not do.">
    <path class="ga-w ga-thin" d="M14 100H226" />
    <Tower x={40} base={100} h={60} />
    <Arcs x={46} y={30} />
    <path class="ga-s ga-dash" d="M76 40L138 70" />
    <Cross x={106} y={55} s={9} c="ga-bad ga-thick" />
    <Person x={154} y={100} />
    <Person x={180} y={100} />
    <Person x={206} y={100} />
    <T x={180} y={54} a="middle">general public</T>
    <T x={120} y={124} a="middle">amateurs may not broadcast</T>
  </Art>
);

const business: TermArt = () => (
  <Art label="A radio transmitting toward a dollar sign that is crossed out: no trade, no sales and no business for an employer on amateur radio.">
    <HT x={50} y={48} />
    <Arcs x={62} y={40} />
    <Arrow x1={88} y1={56} x2={118} y2={56} c="ga-s" />
    <circle class="ga-k" cx="150" cy="56" r="22" />
    <T x={150} y={62} a="middle" c="ga-tk ga-tl">$</T>
    <Cross x={150} y={56} s={18} c="ga-bad ga-thick" />
    <T x={120} y={106} a="middle">no trade, no sales,</T>
    <T x={120} y={123} a="middle">no business for an employer</T>
  </Art>
);

const compensation: TermArt = () => (
  <Art label="An operator at a radio and a banknote that is crossed out: a control operator may not be paid for operating the station.">
    <Person x={40} y={96} />
    <path class="ga-w" d="M54 88H112" />
    <Rig x={62} y={66} />
    <Arrow x1={160} y1={70} x2={124} y2={70} />
    <rect class="ga-k" x="166" y="54" width="56" height="32" rx="3" />
    <T x={194} y={76} a="middle" c="ga-tk ga-tl">$</T>
    <Cross x={194} y={70} s={14} c="ga-bad ga-thick" />
    <T x={194} y={44} a="middle" c="ga-tk ga-tb">pay</T>
    <T x={120} y={122} a="middle">no pay for operating</T>
  </Art>
);

const encoded: TermArt = () => (
  <Art label="A plain message goes through a lock and comes out scrambled. Hiding the meaning this way is not allowed, except for control commands to space stations or model craft.">
    <rect class="ga-w" x="12" y="34" width="58" height="26" rx="3" />
    <T x={41} y={52} a="middle" c="ga-mono">HELLO</T>
    <Arrow x1={76} y1={47} x2={92} y2={47} />
    <rect class="ga-fk ga-soft" x="100" y="40" width="30" height="22" rx="3" />
    <path class="ga-k" d="M100 40h30v22h-30ZM106 40v-7a9 9 0 0 1 18 0v7" />
    <Arrow x1={138} y1={47} x2={154} y2={47} />
    <rect class="ga-w" x="162" y="34" width="66" height="26" rx="3" />
    <T x={195} y={52} a="middle" c="ga-mono">XQ#ZK</T>
    <T x={120} y={90} a="middle">hidden meaning: not allowed,</T>
    <T x={120} y={108} a="middle" c="ga-tm">except control commands to</T>
    <T x={120} y={124} a="middle" c="ga-tm">space stations or model craft</T>
  </Art>
);

const indecent: TermArt = () => (
  <Art label="A radio with a speech bubble full of swearing symbols and a cross beside it: any indecent or obscene language is prohibited.">
    <HT x={38} y={58} />
    <Bubble x={58} y={26} w={110} h={34} />
    <T x={113} y={49} a="middle" c="ga-tk ga-tl ga-mono">#@!%&amp;</T>
    <Cross x={198} y={44} s={12} c="ga-bad ga-thick" />
    <T x={120} y={108} a="middle">any such language is prohibited</T>
    <T x={120} y={125} a="middle" c="ga-tm">there is no list of banned words</T>
  </Art>
);

const music: TermArt = () => (
  <Art label="A radio transmitting musical notes with a cross beside them: amateur stations normally may not transmit music.">
    <HT x={46} y={52} />
    <Arcs x={58} y={44} />
    <ellipse class="ga-fk" cx="118" cy="72" rx="7" ry="5" />
    <ellipse class="ga-fk" cx="150" cy="64" rx="7" ry="5" />
    <path class="ga-k" d="M124 72V44M156 64V36" />
    <path class="ga-k ga-thick" d="M124 44L156 36" />
    <Cross x={196} y={54} s={12} c="ga-bad ga-thick" />
    <T x={120} y={106} a="middle">no music on the air</T>
    <T x={120} y={123} a="middle" c="ga-tm">(one exception: spacecraft relay)</T>
  </Art>
);

const willful: TermArt = () => (
  <Art label="Two stations in contact, with a third station deliberately sending a jamming signal down onto their signal. Jamming on purpose is always prohibited.">
    <HT x={24} y={66} />
    <HT x={216} y={66} />
    <path class="ga-s" d={wave(40, 200, 78, 26, 6)} />
    <HT x={120} y={20} c="ga-bad" />
    <path class="ga-bad" d="M104 46l-6 9h8l-6 10M120 50l-6 8h8l-6 9M136 46l-6 9h8l-6 10" />
    <Cross x={38} y={112} />
    <T x={50} y={116}>jamming on purpose:</T>
    <T x={50} y={132} c="ga-tm">always prohibited</T>
  </Art>
);

const secondary: TermArt = () => (
  <Art label="A shared stretch of frequencies with a large block for the primary service and a smaller block for amateurs. The primary service has priority; amateurs are secondary and must not interfere with it.">
    <T x={20} y={24} c="ga-tm">shared frequencies</T>
    <rect class="ga-fw ga-soft" x="34" y="36" width="96" height="24" />
    <rect class="ga-fk ga-soft" x="156" y="36" width="52" height="24" />
    <rect class="ga-k" x="156" y="36" width="52" height="24" />
    <rect class="ga-w" x="20" y="36" width="200" height="24" />
    <T x={82} y={52} a="middle">primary</T>
    <T x={182} y={52} a="middle" c="ga-tk ga-tb">ham</T>
    <T x={120} y={84} a="middle">the primary service has priority</T>
    <T x={120} y={106} a="middle" c="ga-tk ga-tb">amateurs are secondary:</T>
    <T x={120} y={123} a="middle" c="ga-tk">must not interfere</T>
  </Art>
);

const international: TermArt = () => (
  <Art label="Two stations in different countries on the curve of the Earth, joined by a radio signal arching between them. Permitted content is remarks of a personal character and talk incidental to amateur radio.">
    <path class="ga-w" d="M10 104Q120 76 230 104" />
    <Tower x={50} base={96} h={34} />
    <Tower x={190} base={96} h={34} />
    <path class="ga-s ga-dash" d="M56 50Q120 2 184 50" />
    <T x={120} y={52} a="middle" c="ga-tk ga-tb">across borders</T>
    <T x={120} y={72} a="middle" c="ga-tm">personal remarks</T>
    <T x={52} y={124} a="middle">one country</T>
    <T x={182} y={124} a="middle">another country</T>
  </Art>
);

/* ---------- space, sea and special stations ---------- */

function Sat({ x, y, c = 'ga-k' }: { x: number; y: number; c?: string }) {
  return <path class={c} d={`M${x - 10} ${y - 8}h20v16h-20ZM${x - 34} ${y - 6}h20v12h-20ZM${x + 14} ${y - 6}h20v12h-20ZM${x - 24} ${y - 6}v12M${x + 24} ${y - 6}v12M${x - 14} ${y}h4M${x + 10} ${y}h4`} />;
}

const iss: TermArt = () => (
  <Art label="The International Space Station above the curve of the Earth, with a radio on the ground sending a signal up to it. Any Technician or higher licensee may contact it on VHF.">
    <path class="ga-w" d="M10 128Q120 100 230 128" />
    <HT x={56} y={90} />
    <path class="ga-s ga-dash" d="M68 80L146 48" />
    <path class="ga-s" d={headD(150, 46, -0.39)} />
    <Sat x={184} y={36} />
    <T x={184} y={64} a="middle" c="ga-tk ga-tb">ISS</T>
    <T x={8} y={24}>Technician or higher,</T>
    <T x={8} y={40}>on VHF</T>
  </Art>
);

const spaceStation: TermArt = () => (
  <Art label="A satellite above a dashed line drawn 50 kilometers over the Earth's surface: an amateur station more than 50 kilometers up is a space station.">
    <path class="ga-w" d="M10 126Q120 98 230 126" />
    <T x={120} y={132} a="middle" c="ga-tm">Earth</T>
    <path class="ga-w ga-thin ga-dash" d="M14 72H226" />
    <Arrow x1={40} y1={114} x2={40} y2={76} both />
    <T x={50} y={98}>50 km</T>
    <Sat x={150} y={44} />
    <T x={150} y={22} a="middle" c="ga-tk ga-tb">space station</T>
    <T x={226} y={90} a="end" c="ga-tm">more than 50 km up</T>
  </Art>
);

const maritime: TermArt = () => (
  <Art label="A boat at sea with an antenna on its mast sending radio waves: maritime mobile, operating from a US-documented vessel in international waters with the master's permission.">
    <path class="ga-w" d={wave(8, 232, 96, 30, 3)} />
    <path class="ga-fk ga-soft" d="M70 76H170L156 92H84Z" />
    <path class="ga-k" d="M70 76H170L156 92H84ZM104 76V58h32V76M120 58V24" />
    <Arcs x={126} y={26} />
    <Arcs x={114} y={26} dir={-1} />
    <T x={120} y={116} a="middle">US-documented vessel at sea,</T>
    <T x={120} y={132} a="middle" c="ga-tm">with the master's permission</T>
  </Art>
);

const auxiliary: TermArt = () => (
  <Art label="A remote repeater receiver on the left sends a one-way point-to-point link to the main repeater transmitter on the right. That link is an auxiliary station.">
    <path class="ga-w ga-thin" d="M8 100H232" />
    <Tower x={40} base={100} h={50} />
    <Tower x={196} base={100} h={64} />
    <Arrow x1={54} y1={48} x2={180} y2={40} c="ga-k" />
    <T x={116} y={26} a="middle" c="ga-tk ga-tb">point-to-point link</T>
    <T x={116} y={66} a="middle" c="ga-tm">one way</T>
    <T x={8} y={118}>remote receiver</T>
    <T x={232} y={118} a="end">main repeater</T>
    <T x={232} y={134} a="end">transmitter</T>
  </Art>
);

const beacon: TermArt = () => (
  <Art label="A beacon tower transmitting by itself while two distant radios listen to judge propagation. On HF, automatic beacons are found from 28.200 to 28.300 megahertz.">
    <path class="ga-w ga-thin" d="M8 100H232" />
    <Tower x={46} base={100} h={58} c="ga-k" />
    <Arcs x={52} y={32} />
    <Arcs x={40} y={32} dir={-1} />
    <T x={84} y={24} c="ga-tk ga-tb">beacon</T>
    <path class="ga-s ga-thin ga-dash" d="M80 40L132 66M80 36L192 64" />
    <HT x={142} y={76} />
    <HT x={202} y={76} />
    <T x={120} y={118} a="middle">others check propagation</T>
    <T x={120} y={134} a="middle" c="ga-tm">HF: 28.200–28.300 MHz</T>
  </Art>
);

/* ---------- modes ---------- */

const cw: TermArt = () => (
  <Art label="A Morse key next to a signal that is switched on and off in short and long bursts. CW-only segments are 50.0 to 50.1 and 144.0 to 144.1 megahertz.">
    <T x={14} y={26} c="ga-tk ga-tl">CW</T>
    <path class="ga-k" d="M14 70H64M30 70V58M20 60L58 50" />
    <circle class="ga-fk" cx="58" cy="46" r="5" />
    <path class="ga-s ga-thin" d="M80 46H86M96 46H108M138 46H150M160 46H172M202 46H214M224 46H230" />
    <path class="ga-s" d={fine(86, 96, 46, 5, 12) + fine(108, 138, 46, 5, 12) + fine(150, 160, 46, 5, 12) + fine(172, 202, 46, 5, 12) + fine(214, 224, 46, 5, 12)} />
    <T x={154} y={82} a="middle">signal on and off = Morse</T>
    <T x={120} y={110} a="middle" c="ga-tm">CW only: 50.0–50.1 MHz</T>
    <T x={120} y={127} a="middle" c="ga-tm">and 144.0–144.1 MHz</T>
  </Art>
);

const phone: TermArt = () => (
  <Art label="A microphone, a voice wave and a radio with its antenna transmitting: phone means voice. Technician phone on HF is 28.300 to 28.500 megahertz.">
    <rect class="ga-fk ga-soft" x="32" y="24" width="18" height="34" rx="9" />
    <rect class="ga-k" x="32" y="24" width="18" height="34" rx="9" />
    <path class="ga-k" d="M26 48a15 15 0 0 0 30 0M41 63V76M31 76H51" />
    <path class="ga-s" d="M66 50q4 -14 8 0t8 0q4 -22 8 0t8 0q4 -10 8 0t8 0q4 -18 8 0t8 0" />
    <Rig x={142} y={40} />
    <path class="ga-w ga-thin" d="M182 46H204V30" />
    <path class="ga-w" d="M196 18L204 30L212 18" />
    <Arcs x={214} y={28} n={2} />
    <T x={41} y={94} a="middle">microphone</T>
    <T x={162} y={94} a="middle">radio</T>
    <T x={120} y={114} a="middle" c="ga-tk ga-tb">voice on the air</T>
    <T x={120} y={131} a="middle" c="ga-tm">Tech HF phone: 28.300–28.500 MHz</T>
  </Art>
);

const pep: TermArt = () => {
  let d = '';
  for (let x = 14; x <= 226; x += 1) {
    const env = 5 + 23 * Math.pow(Math.abs(Math.sin(((x - 14) / 212) * Math.PI * 3)), 0.8) * (0.72 + 0.28 * Math.cos(((x - 120) / 106) * Math.PI));
    d += `${x === 14 ? 'M' : 'L'}${x} ${r1(64 - env * Math.sin((x - 14) * 1.25))}`;
  }
  return (
    <Art label="A voice signal whose strength rises and falls, with a dashed line touching its highest peaks: peak envelope power. Technician limits are 200 watts PEP on HF and 1500 watts PEP above 30 megahertz.">
      <T x={226} y={24} a="end" c="ga-tk ga-tb">PEP: power at the peaks</T>
      <path class="ga-k ga-dash" d="M14 35H226" />
      <path class="ga-s ga-thin" d={d} />
      <T x={120} y={112} a="middle">Technician: 200 W PEP on HF,</T>
      <T x={120} y={129} a="middle">1500 W PEP above 30 MHz</T>
    </Art>
  );
};

const sidebands: TermArt = () => (
  <Art label="A spectrum with the carrier as a line in the middle and a sideband on each side of it, lower and upper. The sidebands give the signal its width.">
    <Arrow x1={14} y1={96} x2={228} y2={96} />
    <path class="ga-fk ga-soft" d="M60 96L72 56H108L112 96ZM128 96L132 56H168L180 96Z" />
    <path class="ga-k" d="M60 96L72 56H108L112 96M128 96L132 56H168L180 96" />
    <path class="ga-w ga-thick" d="M120 96V30" />
    <T x={120} y={22} a="middle" c="ga-tm">carrier</T>
    <T x={88} y={114} a="middle" c="ga-tk ga-tb">lower</T>
    <T x={154} y={114} a="middle" c="ga-tk ga-tb">upper</T>
    <T x={120} y={132} a="middle" c="ga-tm">sidebands give the signal its width</T>
  </Art>
);

const ft8: TermArt = () => (
  <Art label="A computer running FT8 connected to a radio whose antenna picks up a weak signal. Technicians may use it on 10 meters, 6 meters and 2 meters.">
    <rect class="ga-fk ga-soft" x="20" y="32" width="58" height="40" rx="3" />
    <rect class="ga-k" x="20" y="32" width="58" height="40" rx="3" />
    <path class="ga-k" d="M12 78H86" />
    <T x={49} y={57} a="middle" c="ga-tk ga-tb">FT8</T>
    <path class="ga-w ga-thin" d="M86 78H96V64H106" />
    <Rig x={106} y={52} />
    <path class="ga-w ga-thin" d="M146 58H166V40" />
    <path class="ga-w" d="M158 28L166 40L174 28" />
    <path class="ga-s ga-thin" d={wave(182, 230, 34, 12, 3)} />
    <T x={206} y={22} a="middle" c="ga-ts">weak</T>
    <T x={49} y={96} a="middle">computer</T>
    <T x={126} y={96} a="middle">radio</T>
    <T x={120} y={116} a="middle" c="ga-tk">digital mode for weak signals</T>
    <T x={120} y={132} a="middle" c="ga-tm">Tech: 10 m, 6 m and 2 m</T>
  </Art>
);

/* ---------- repeaters ---------- */

const repeater: TermArt = () => (
  <Art label="A repeater on a hilltop. A radio on one side of the hill transmits up to it, the repeater listens and at the same time retransmits on another frequency to a radio on the far side.">
    <path class="ga-w ga-thin" d="M6 110H234" />
    <path class="ga-w" d="M70 110Q120 42 170 110" />
    <Tower x={120} base={76} h={44} c="ga-k" />
    <HT x={22} y={84} />
    <HT x={218} y={84} />
    <Arrow x1={34} y1={78} x2={106} y2={36} c="ga-s" />
    <Arrow x1={134} y1={36} x2={206} y2={78} c="ga-k" />
    <T x={12} y={34} c="ga-ts">listens</T>
    <T x={228} y={34} a="end" c="ga-tk ga-tb">retransmits</T>
    <T x={120} y={128} a="middle" c="ga-tm">reaches farther than you can directly</T>
  </Art>
);

/** A radio and a repeater with the path to the repeater (input) or back from it (output) picked out. */
function RepeaterPair({ which }: { which: 'in' | 'out' }) {
  const inC = which === 'in' ? 'ga-k ga-thick' : 'ga-w ga-thin ga-dash';
  const outC = which === 'out' ? 'ga-k ga-thick' : 'ga-w ga-thin ga-dash';
  return (
    <>
      <path class="ga-w ga-thin" d="M8 100H232" />
      <HT x={28} y={76} />
      <Tower x={196} base={100} h={62} />
      <Arrow x1={42} y1={62} x2={180} y2={34} c={inC} />
      <Arrow x1={180} y1={56} x2={46} y2={86} c={outC} />
      <T x={100} y={38} a="middle" c={which === 'in' ? 'ga-tk ga-tb' : 'ga-tm'}>input</T>
      <T x={136} y={90} a="middle" c={which === 'out' ? 'ga-tk ga-tb' : 'ga-tm'}>output</T>
    </>
  );
}

const repInput: TermArt = () => (
  <Art label="A radio and a repeater. The path from the radio up to the repeater is picked out: the input frequency, on which you transmit and the repeater listens.">
    <RepeaterPair which="in" />
    <T x={120} y={118} a="middle">you transmit on it,</T>
    <T x={120} y={134} a="middle">the repeater listens on it</T>
  </Art>
);

const repOutput: TermArt = () => (
  <Art label="A radio and a repeater. The path from the repeater down to the radio is picked out: the output frequency, on which the repeater transmits and you listen.">
    <RepeaterPair which="out" />
    <T x={120} y={118} a="middle">the repeater transmits on it,</T>
    <T x={120} y={134} a="middle">you listen on it</T>
  </Art>
);

const repOffset: TermArt = () => (
  <Art label="Two marks on a frequency line, one where the repeater listens and one where it transmits, with the gap between them labelled offset. Common offsets are 600 kilohertz on 2 meters and 5 megahertz on 70 centimeters.">
    <Arrow x1={20} y1={70} x2={224} y2={70} />
    <path class="ga-s" d="M80 70V36M160 70V36" />
    <T x={80} y={26} a="middle">listens</T>
    <T x={160} y={26} a="middle">transmits</T>
    <path class="ga-k" d="M80 78v8H160v-8" />
    <T x={120} y={104} a="middle" c="ga-tk ga-tb">offset</T>
    <T x={120} y={126} a="middle" c="ga-tm">2 m: 600 kHz · 70 cm: 5 MHz</T>
  </Art>
);

const reverse: TermArt = () => (
  <Art label="Two boxes, transmit frequency and receive frequency, with a double arrow between them: the reverse function swaps the two so that you listen on the repeater's input.">
    <rect class="ga-w" x="16" y="30" width="84" height="28" rx="4" />
    <rect class="ga-w" x="140" y="30" width="84" height="28" rx="4" />
    <T x={58} y={48} a="middle">transmit</T>
    <T x={182} y={48} a="middle">receive</T>
    <Arrow x1={106} y1={44} x2={134} y2={44} c="ga-k" both />
    <T x={120} y={22} a="middle" c="ga-tk ga-tb">swap</T>
    <T x={120} y={84} a="middle" c="ga-tk">reverse swaps the two,</T>
    <T x={120} y={106} a="middle" c="ga-tm">so you listen on the</T>
    <T x={120} y={122} a="middle" c="ga-tm">repeater's input frequency</T>
  </Art>
);

const linked: TermArt = () => (
  <Art label="Three repeater towers joined by links. A radio near the first one transmits, and all three repeaters send the signal out.">
    <path class="ga-w ga-thin" d="M8 96H232" />
    <Tower x={60} base={96} h={48} />
    <Tower x={130} base={96} h={48} />
    <Tower x={200} base={96} h={48} />
    <path class="ga-k ga-thick" d="M68 58H122M138 58H192" />
    <Arcs x={66} y={40} n={2} />
    <Arcs x={136} y={40} n={2} />
    <Arcs x={206} y={40} n={2} />
    <HT x={20} y={72} />
    <Arrow x1={30} y1={62} x2={48} y2={50} c="ga-s ga-thin" />
    <T x={120} y={116} a="middle">heard by one repeater,</T>
    <T x={120} y={132} a="middle">sent out by all of them</T>
  </Art>
);

const simplex: TermArt = () => (
  <Art label="Two handheld radios talking directly to each other on one frequency, in both directions, taking turns. No repeater is involved.">
    <HT x={36} y={48} c="ga-k" />
    <HT x={204} y={48} c="ga-k" />
    <Arrow x1={54} y1={60} x2={186} y2={60} c="ga-s" both />
    <T x={120} y={46} a="middle" c="ga-ts">one frequency</T>
    <T x={120} y={82} a="middle">both ways, taking turns</T>
    <T x={120} y={110} a="middle" c="ga-tm">direct: no repeater</T>
  </Art>
);

/* ---------- squelch and access tones ---------- */

function Gate({ children }: { children: ComponentChildren }) {
  return (
    <>
      {children}
      <Arrow x1={116} y1={56} x2={132} y2={56} />
      <rect class="ga-w" x="138" y="34" width="54" height="44" rx="4" />
      <T x={165} y={53} a="middle">squelch</T>
      <T x={165} y={69} a="middle" c="ga-tk ga-tb">opens</T>
      <Arrow x1={194} y1={56} x2={206} y2={56} />
      <Speaker x={212} y={56} />
    </>
  );
}

const voiceD = 'M14 40q4 -12 8 0t8 0q4 -18 8 0t8 0q4 -8 8 0t8 0q4 -16 8 0t8 0q4 -10 8 0t8 0q4 -14 8 0t8 0';

const ctcss: TermArt = () => (
  <Art label="A voice wave with a slow, low tone running under it. Together they reach a receiver whose squelch opens because the tone is there: CTCSS.">
    <Gate>
      <T x={14} y={20} c="ga-ts">voice</T>
      <path class="ga-s" d={voiceD} />
      <path class="ga-k" d={wave(14, 110, 74, 48, 7)} />
      <T x={14} y={100} c="ga-tk ga-tb">sub-audible tone</T>
    </Gate>
    <T x={120} y={128} a="middle" c="ga-tm">the tone rides along with the voice</T>
  </Art>
);

const dcs: TermArt = () => (
  <Art label="A voice wave with a digital code of square pulses sent along with it. The receiver's squelch opens because it sees the right code: DCS.">
    <Gate>
      <T x={14} y={20} c="ga-ts">voice</T>
      <path class="ga-s" d={voiceD} />
      <path class="ga-k" d="M14 80h10v-12h8v12h14v-12h6v12h10v-12h14v12h8v-12h8v12h18" />
      <T x={14} y={100} c="ga-tk ga-tb">digital code</T>
    </Gate>
    <T x={120} y={128} a="middle" c="ga-tm">the right code opens the receiver</T>
  </Art>
);

const squelch: TermArt = () => (
  <Art label="Two rows. With no signal there is only noise, the squelch switch is open and the speaker is quiet. With a signal present the switch closes and audio comes out.">
    <T x={14} y={18} c="ga-tm">no signal: only noise</T>
    <path class="ga-w ga-thin" d="M14 42l4 -6l4 9l4 -12l4 14l4 -8l4 5l4 -11l4 13l4 -7l4 6l4 -10l4 9l4 -5l4 7l4 -9l4 8l4 -4" />
    <path class="ga-w" d="M96 40H112M134 40H150" />
    <path class="ga-k" d="M112 40L132 28" />
    <circle class="ga-fk" cx="112" cy="40" r="3" />
    <circle class="ga-fk" cx="134" cy="40" r="3" />
    <Speaker x={160} y={40} />
    <T x={186} y={44} c="ga-tm">muted</T>
    <T x={14} y={82} c="ga-tm">signal present</T>
    <path class="ga-s" d={wave(14, 86, 106, 18, 9)} />
    <path class="ga-w" d="M96 106H112M134 106H150" />
    <path class="ga-k" d="M112 106H134" />
    <circle class="ga-fk" cx="112" cy="106" r="3" />
    <circle class="ga-fk" cx="134" cy="106" r="3" />
    <Speaker x={160} y={106} />
    <Arcs x={176} y={106} n={2} c="ga-s ga-thin" r0={5} step={5} />
    <T x={196} y={110}>audio</T>
  </Art>
);

const dtmf: TermArt = () => {
  const keys: VNode[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const on = r === 1 && c === 1;
    keys.push(<rect class={on ? 'ga-fk' : 'ga-w ga-thin'} x={18 + c * 20} y={20 + r * 17} width="15" height="12" rx="2" />);
  }
  return (
    <Art label="A telephone-style keypad with one key pressed, which sends two audio tones of different pitch at the same time: DTMF.">
      {keys}
      <Arrow x1={82} y1={52} x2={100} y2={52} />
      <path class="ga-w ga-thin" d="M108 28V76" />
      <path class="ga-s" d={wave(114, 224, 38, 32, 8)} />
      <path class="ga-s" d={wave(114, 224, 66, 16, 8)} />
      <T x={46} y={104} a="middle" c="ga-tm">one key</T>
      <T x={168} y={104} a="middle" c="ga-tk ga-tb">two tones at once</T>
    </Art>
  );
};

/* ---------- DMR ---------- */

const diamond = (x: number, y: number) => `M${x} ${y - 7}l7 7l-7 7l-7 -7Z`;

const colorCode: TermArt = () => (
  <Art label="Two rows. In the first the radio's code, a diamond, matches the repeater's diamond and the repeater responds. In the second the radio sends a different code and the repeater does not respond.">
    <HT x={22} y={26} />
    <path class="ga-fk" d={diamond(46, 40)} />
    <Arrow x1={60} y1={40} x2={148} y2={40} c="ga-s" />
    <T x={104} y={30} a="middle">code matches</T>
    <path class="ga-fk" d={diamond(164, 40)} />
    <Tower x={190} base={58} h={34} />
    <Tick x={218} y={42} />
    <HT x={22} y={90} />
    <circle class="ga-fk" cx="46" cy="104" r="6" />
    <Arrow x1={60} y1={104} x2={148} y2={104} c="ga-s ga-dash" />
    <T x={104} y={94} a="middle">wrong code</T>
    <path class="ga-fk" d={diamond(164, 104)} />
    <Tower x={190} base={122} h={34} />
    <Cross x={218} y={104} />
  </Art>
);

const dmr: TermArt = () => (
  <Art label="A handheld radio sending a stream of digital pulses to a repeater: DMR, digital voice. Talkgroups sort the traffic and a color code opens the repeater.">
    <path class="ga-w ga-thin" d="M8 92H232" />
    <HT x={26} y={68} />
    <path class="ga-s" d="M46 62h10v-12h8v12h12v-12h6v12h10v-12h14v12h8v-12h8v12h12v-12h8v12h10" />
    <Arrow x1={158} y1={56} x2={174} y2={56} c="ga-s" />
    <Tower x={196} base={92} h={54} />
    <T x={104} y={36} a="middle" c="ga-ts">digital voice</T>
    <T x={104} y={84} a="middle" c="ga-tk ga-tl">DMR</T>
    <T x={120} y={112} a="middle" c="ga-tm">talkgroups sort the traffic,</T>
    <T x={120} y={128} a="middle" c="ga-tm">a color code opens the repeater</T>
  </Art>
);

const talkgroup: TermArt = () => (
  <Art label="One repeater with four radios. Two radios set to the same talkgroup are joined through it and hear each other; the two radios of another talkgroup are joined separately and are not heard by the first pair.">
    <Tower x={120} base={84} h={44} />
    <HT x={26} y={30} c="ga-k" />
    <HT x={214} y={30} c="ga-k" />
    <path class="ga-k ga-dash" d="M38 40L112 50M128 50L202 40" />
    <T x={120} y={18} a="middle" c="ga-tk ga-tb">one talkgroup</T>
    <HT x={26} y={88} />
    <HT x={214} y={88} />
    <path class="ga-w ga-thin ga-dash" d="M38 96L110 74M130 74L202 96" />
    <T x={120} y={108} a="middle" c="ga-tm">another talkgroup</T>
    <T x={120} y={130} a="middle" c="ga-tm">each hears only its own</T>
  </Art>
);

/* ---------- calling, Q signals, interference ---------- */

const cq: TermArt = () => (
  <Art label="A radio calling CQ, with waves going out toward three unknown stations marked with question marks: CQ means calling any station.">
    <Bubble x={10} y={12} w={54} h={30} />
    <T x={37} y={33} a="middle" c="ga-tk ga-tl">CQ</T>
    <HT x={40} y={72} c="ga-k" />
    <Arcs x={56} y={64} n={4} />
    <HT x={150} y={26} />
    <T x={166} y={42} c="ga-tm">?</T>
    <HT x={196} y={62} />
    <T x={212} y={78} c="ga-tm">?</T>
    <HT x={150} y={98} />
    <T x={166} y={114} c="ga-tm">?</T>
    <T x={8} y={126} c="ga-tk ga-tb">calling any station</T>
  </Art>
);

const procedural: TermArt = () => (
  <Art label="The letters CQ, an equals sign, and the meaning: calling any station. A procedural signal is a short signal with an agreed meaning.">
    <T x={120} y={22} a="middle" c="ga-tm">short signal, agreed meaning</T>
    <Big x={40} y={72} ch="C" s={2} />
    <Big x={62} y={72} ch="Q" s={2} />
    <T x={92} y={68} a="middle" c="ga-tl">=</T>
    <T x={112} y={60}>calling any</T>
    <T x={112} y={78}>station</T>
    <HT x={108} y={100} />
    <Arcs x={122} y={104} n={2} />
  </Art>
);

const qSignal: TermArt = () => (
  <Art label="Two Q signals with a tiny scene each. QRM: a signal overlapped by another, meaning interference from other stations. QSY: a marker moving along the dial, meaning changing frequency.">
    <BigWord x={20} y={44} word="QRM" gap={15} s={1.5} />
    <path class="ga-s" d={wave(72, 128, 38, 18, 7)} />
    <path class="ga-bad ga-thin" d={wave(72, 128, 38, 11, 7, 1)} />
    <T x={138} y={42}>interference</T>
    <BigWord x={20} y={100} word="QSY" gap={15} s={1.5} />
    <path class="ga-w" d="M72 104H128M82 100v8M118 100v8" />
    <path class="ga-k" d={`M82 94Q100 76 116 92${headD(118, 94, 0.9, 6)}`} />
    <T x={138} y={92}>changing</T>
    <T x={138} y={108}>frequency</T>
  </Art>
);

const qrm: TermArt = () => (
  <Art label="QRM. A wanted signal reaching a radio is overlapped by the signals of two other stations: interference from other stations.">
    <BigWord x={24} y={36} word="QRM" />
    <T x={86} y={24}>interference from</T>
    <T x={86} y={40}>other stations</T>
    <path class="ga-s" d={wave(14, 176, 82, 28, 8)} />
    <path class="ga-bad ga-thin" d={wave(50, 176, 74, 13, 7)} />
    <path class="ga-bad ga-thin ga-dash" d={wave(30, 176, 90, 19, 7)} />
    <Rig x={184} y={70} />
    <T x={120} y={124} a="middle" c="ga-tm">the wanted signal is covered up</T>
  </Art>
);

const qsy: TermArt = () => (
  <Art label="QSY. A dial scale on which the marker jumps from the old frequency to a new one: changing frequency.">
    <BigWord x={24} y={34} word="QSY" />
    <T x={232} y={26} a="end" c="ga-tk ga-tb">changing frequency</T>
    <path class="ga-w" d="M20 88H220" />
    <path class="ga-w ga-thin" d="M30 88v6M50 88v6M70 88v6M90 88v6M110 88v6M130 88v6M150 88v6M170 88v6M190 88v6M210 88v6" />
    <path class="ga-w ga-thin" d="M70 84l-6 -11h12Z" />
    <path class="ga-fk" d="M170 84l-6 -11h12Z" />
    <path class="ga-k" d={`M74 66Q120 38 164 64${headD(166, 66, 0.75)}`} />
    <T x={70} y={112} a="middle" c="ga-tm">old</T>
    <T x={170} y={112} a="middle">new frequency</T>
  </Art>
);

const interference: TermArt = () => (
  <Art label="A wanted signal travelling to a radio while an unwanted signal from another station cuts across it and reaches the same radio: interference.">
    <HT x={22} y={40} />
    <path class="ga-s" d={wave(38, 174, 52, 26, 7)} />
    <T x={104} y={30} a="middle" c="ga-ts">wanted signal</T>
    <Rig x={184} y={42} />
    <HT x={22} y={96} />
    <path class="ga-bad" d="M40 104l12 -12l4 7l12 -12l4 7l12 -12l4 7l12 -12l4 7l12 -12l4 7l12 -12l4 7l12 -12l4 7l12 -11" />
    <T x={124} y={118} a="middle">unwanted signal</T>
  </Art>
);

/* ---------- nets and traffic ---------- */

const NET_PTS: [number, number][] = [[212, 62], [166, 98], [74, 98], [28, 62], [74, 26], [166, 26]];

const net: TermArt = () => (
  <Art label="Six stations arranged in a ring around a net control station in the middle, all joined to it: a net, an organized meeting on the air.">
    <ellipse class="ga-k ga-dash" cx="120" cy="62" rx="92" ry="36" />
    {NET_PTS.map(([x, y]) => <path class="ga-w ga-thin" d={`M120 62L${x} ${y}`} />)}
    {NET_PTS.map(([x, y]) => (
      <>
        <circle class="ga-fbg" cx={x} cy={y} r="7" />
        <circle class="ga-k" cx={x} cy={y} r="7" />
      </>
    ))}
    <circle class="ga-fbg" cx="120" cy="62" r="16" />
    <circle class="ga-w" cx="120" cy="62" r="16" />
    <T x={120} y={66} a="middle">NCS</T>
    <T x={120} y={128} a="middle" c="ga-tm">stations meeting on the air</T>
  </Art>
);

const ncs: TermArt = () => (
  <Art label="The net control station in the middle with arrows going out to six stations around it: it calls the net to order and directs who transmits.">
    {NET_PTS.map(([x, y]) => {
      const a = Math.atan2(y - 62, x - 120), d = Math.hypot(x - 120, y - 62);
      return <Arrow x1={r1(120 + 20 * Math.cos(a))} y1={r1(62 + 20 * Math.sin(a))} x2={r1(120 + (d - 11) * Math.cos(a))} y2={r1(62 + (d - 11) * Math.sin(a))} c="ga-k ga-thin" />;
    })}
    {NET_PTS.map(([x, y]) => <circle class="ga-w" cx={x} cy={y} r="7" />)}
    <circle class="ga-fk ga-soft" cx="120" cy="62" r="17" />
    <circle class="ga-k" cx="120" cy="62" r="17" />
    <T x={120} y={66} a="middle" c="ga-tk ga-tb">NCS</T>
    <T x={120} y={128} a="middle" c="ga-tm">directs who transmits</T>
  </Art>
);

const checkIn: TermArt = () => (
  <Art label="One station sends its call sign to the net control station in the middle, which ticks it on its list: checking in to a net.">
    <circle class="ga-w" cx="124" cy="60" r="16" />
    <T x={124} y={64} a="middle">NCS</T>
    <T x={124} y={32} a="middle" c="ga-tm">net control</T>
    <HT x={32} y={78} c="ga-k" />
    <Arrow x1={46} y1={80} x2={104} y2={66} c="ga-k" />
    <T x={8} y={54} c="ga-tk ga-tb">your call sign</T>
    <path class="ga-w ga-thin ga-dash" d="M140 60H170" />
    <rect class="ga-w" x="172" y="30" width="56" height="62" rx="3" />
    <Tick x={184} y={46} />
    <path class="ga-w ga-thin" d="M196 46h24M196 62h24M196 78h24" />
    <Tick x={184} y={62} />
    <T x={120} y={126} a="middle" c="ga-tm">announce yourself to be counted</T>
  </Art>
);

const traffic: TermArt = () => (
  <Art label="Three stations in a row with a written message passing from the first to the second to the third: traffic, formal messages exchanged by net stations.">
    <T x={120} y={20} a="middle" c="ga-tk ga-tb">formal messages</T>
    <HT x={26} y={72} />
    <HT x={120} y={72} />
    <HT x={214} y={72} />
    <Arrow x1={42} y1={84} x2={104} y2={84} c="ga-s" />
    <Arrow x1={136} y1={84} x2={198} y2={84} c="ga-s" />
    <rect class="ga-fk ga-soft" x="62" y="44" width="22" height="28" rx="2" />
    <rect class="ga-k" x="62" y="44" width="22" height="28" rx="2" />
    <path class="ga-k ga-thin" d="M67 52h12M67 58h12M67 64h8" />
    <rect class="ga-k ga-thin ga-dash" x="156" y="44" width="22" height="28" rx="2" />
    <T x={120} y={124} a="middle" c="ga-tm">passed from station to station</T>
  </Art>
);

const radiogram: TermArt = () => (
  <Art label="A radiogram form with its parts in order: the preamble at the top with the check in it, then the address, the text and the signature.">
    <rect class="ga-w" x="30" y="10" width="180" height="104" rx="3" />
    <rect class="ga-fk ga-soft" x="30" y="10" width="180" height="24" />
    <path class="ga-k" d="M30 34H210M150 10V34" />
    <T x={38} y={27} c="ga-tk ga-tb">preamble</T>
    <T x={180} y={27} a="middle" c="ga-tk">check</T>
    <T x={38} y={52} c="ga-tm">address</T>
    <path class="ga-w ga-thin" d="M92 48H200" />
    <T x={38} y={76} c="ga-tm">text</T>
    <path class="ga-fw ga-soft" d="M92 66h22v8h-22ZM120 66h22v8h-22ZM148 66h22v8h-22ZM176 66h22v8h-22Z" />
    <T x={38} y={102} c="ga-tm">signature</T>
    <path class="ga-w ga-thin" d="M104 98H200" />
    <T x={120} y={132} a="middle" c="ga-tm">formal message, standard form</T>
  </Art>
);

const preamble: TermArt = () => (
  <Art label="A message form with its top section picked out: the preamble, which holds the information needed to track the message. The address and phone number below are not part of it.">
    <rect class="ga-w" x="12" y="12" width="104" height="114" rx="3" />
    <rect class="ga-fk ga-soft" x="12" y="12" width="104" height="30" />
    <path class="ga-k" d="M12 42H116V12M12 12H116M12 12V42" />
    <path class="ga-k ga-thin" d="M20 22h60M20 32h40" />
    <path class="ga-w ga-thin" d="M20 54h70M20 64h50" />
    <path class="ga-fw ga-soft" d="M20 78h24v8h-24ZM50 78h24v8h-24ZM80 78h24v8h-24ZM20 94h24v8h-24Z" />
    <path class="ga-w ga-thin" d="M56 116h50" />
    <T x={126} y={24} c="ga-tk ga-tb">preamble:</T>
    <T x={126} y={40}>info to track</T>
    <T x={126} y={56}>the message</T>
    <T x={126} y={86} c="ga-tm">address and</T>
    <T x={126} y={102} c="ga-tm">phone number:</T>
    <T x={126} y={118} c="ga-tm">not part of it</T>
  </Art>
);

const check: TermArt = () => (
  <Art label="A radiogram form. An arrow runs from the words of the text up to the check box in the header: the check is the number of words in the text.">
    <rect class="ga-w" x="30" y="10" width="180" height="92" rx="3" />
    <path class="ga-w ga-thin" d="M30 38H210M40 24h60" />
    <rect class="ga-fk ga-soft" x="134" y="14" width="68" height="20" rx="3" />
    <rect class="ga-k" x="134" y="14" width="68" height="20" rx="3" />
    <T x={168} y={29} a="middle" c="ga-tk ga-tb">check</T>
    <path class="ga-fw" d="M42 54h24v8h-24ZM72 54h24v8h-24ZM102 54h24v8h-24ZM42 76h24v8h-24ZM72 76h24v8h-24Z" />
    <path class="ga-k ga-thin" d="M132 50v38" />
    <Arrow x1={134} y1={69} x2={168} y2={69} c="ga-k ga-thin" />
    <Arrow x1={168} y1={69} x2={168} y2={40} c="ga-k" />
    <T x={120} y={124} a="middle">check = number of words in the text</T>
  </Art>
);

const winlink: TermArt = () => (
  <Art label="A radio sends a message by radio to a relay station, which delivers it as email: Winlink, with email addresses built from amateur call signs.">
    <path class="ga-w ga-thin" d="M8 84H232" />
    <Rig x={16} y={62} />
    <path class="ga-w ga-thin" d="M56 68H66V40" />
    <Arrow x1={74} y1={46} x2={110} y2={46} c="ga-s" />
    <Tower x={130} base={84} h={46} />
    <Arrow x1={148} y1={60} x2={170} y2={60} />
    <path class="ga-fk ga-soft" d="M178 44h48v34h-48Z" />
    <path class="ga-k" d="M178 44h48v34h-48ZM178 44L202 62L226 44" />
    <T x={36} y={102} a="middle">your radio</T>
    <T x={130} y={102} a="middle" c="ga-tm">relay</T>
    <T x={202} y={102} a="middle" c="ga-tk ga-tb">email</T>
    <T x={120} y={126} a="middle" c="ga-tm">address built from a call sign</T>
  </Art>
);

/* ---------- emergency service ---------- */

const ares: TermArt = () => (
  <Art label="Three volunteers with radios next to a registration list with ticks for their skills and their gear: ARES, licensed amateurs registered for public service.">
    <Person x={30} y={96} c="ga-k" />
    <Person x={70} y={96} c="ga-k" />
    <Person x={110} y={96} c="ga-k" />
    <HT x={48} y={34} />
    <HT x={90} y={34} />
    <rect class="ga-w" x="146" y="26" width="82" height="70" rx="3" />
    <path class="ga-w" d="M174 26v-6h26v6" />
    <Tick x={160} y={52} />
    <T x={172} y={56}>skills</T>
    <Tick x={160} y={78} />
    <T x={172} y={82}>gear</T>
    <T x={70} y={114} a="middle" c="ga-tk ga-tb">volunteers</T>
    <T x={187} y={114} a="middle">registered</T>
    <T x={120} y={132} a="middle" c="ga-tm">ready for public service</T>
  </Art>
);

const races: TermArt = () => (
  <Art label="A civil defense agency, drawn as a shield with a tick, certifies an operator with a radio: RACES, for civil defense communications in national emergencies.">
    <path class="ga-fk ga-soft" d="M26 22h44v28q0 26 -22 38q-22 -12 -22 -38Z" />
    <path class="ga-k" d="M26 22h44v28q0 26 -22 38q-22 -12 -22 -38Z" />
    <path class="ga-good" d="M38 52l8 8l14 -18" />
    <Arrow x1={78} y1={62} x2={124} y2={62} />
    <T x={101} y={52} a="middle" c="ga-tm">certifies</T>
    <Person x={142} y={96} />
    <HT x={166} y={64} />
    <Arcs x={180} y={58} n={2} />
    <T x={48} y={108} a="middle" c="ga-tk ga-tb">civil defense</T>
    <T x={48} y={124} a="middle" c="ga-tk ga-tb">agency</T>
    <T x={172} y={112} a="middle">RACES operator</T>
    <T x={172} y={128} a="middle" c="ga-tm">national emergencies</T>
  </Art>
);

const emergency: TermArt = () => (
  <Art label="A warning triangle and a radio transmitting. When life or property is in immediate danger you may transmit outside the frequency privileges of your license class, shown as a signal placed beyond your own segment.">
    <path class="ga-bad" d="M36 22L64 72H8Z" />
    <path class="ga-bad ga-thick" d="M36 40V56M36 64v1" />
    <HT x={100} y={44} c="ga-k" />
    <Arcs x={114} y={38} />
    <Arcs x={94} y={38} dir={-1} />
    <rect class="ga-fk ga-soft" x="156" y="50" width="34" height="16" />
    <rect class="ga-k" x="156" y="50" width="34" height="16" />
    <rect class="ga-w ga-thin ga-dash" x="190" y="50" width="38" height="16" />
    <path class="ga-s" d="M210 44V72" />
    <Tick x={210} y={32} />
    <T x={173} y={82} a="middle" c="ga-tm">yours</T>
    <T x={120} y={103} a="middle">life or property in danger:</T>
    <T x={120} y={118} a="middle" c="ga-tm">you may transmit outside</T>
    <T x={120} y={133} a="middle" c="ga-tm">your privileges</T>
  </Art>
);

/* ---------- electrical safety ---------- */

/** Hot and neutral wires from the supply to a radio, with a gap in the hot lead from x 84 to 136 for a part. */
function PowerPair() {
  return (
    <>
      <path class="ga-w" d="M16 46H84M136 46H180M16 86H180" />
      <rect class="ga-w" x="180" y="34" width="48" height="64" rx="4" />
      <T x={204} y={70} a="middle">radio</T>
      <T x={16} y={36}>hot</T>
      <T x={16} y={104} c="ga-tm">neutral</T>
    </>
  );
}

const fuse: TermArt = () => (
  <Art label="A fuse placed in the hot lead between the supply and the radio, with the thin metal strip inside it. The strip melts on an overload and removes power.">
    <PowerPair />
    <rect class="ga-fbg" x="84" y="36" width="52" height="20" rx="4" />
    <rect class="ga-k" x="84" y="36" width="52" height="20" rx="4" />
    <path class="ga-k ga-thin" d="M84 46q13 -9 26 0t26 0" />
    <T x={110} y={74} a="middle" c="ga-tk ga-tb">fuse</T>
    <T x={120} y={124} a="middle" c="ga-tm">thin metal melts on overload</T>
  </Art>
);

const breaker: TermArt = () => (
  <Art label="A circuit breaker drawn as a switch in the hot lead between the supply and the radio. It has opened by itself to cut the power and can be reset.">
    <PowerPair />
    <path class="ga-k" d="M84 46L128 28" />
    <circle class="ga-fk" cx="84" cy="46" r="3.5" />
    <circle class="ga-fk" cx="136" cy="46" r="3.5" />
    <T x={110} y={74} a="middle" c="ga-tk ga-tb">breaker</T>
    <T x={120} y={124} a="middle" c="ga-tm">opens on overload, can be reset</T>
  </Art>
);

const overload: TermArt = () => (
  <Art label="A wire carrying too much current, with heat rising from it as a hazard. Further along, a fuse of the correct rating has opened and cut the power.">
    <path class="ga-w ga-thick" d="M14 64H150" />
    <Arrow x1={26} y1={78} x2={62} y2={78} c="ga-s ga-thick" />
    <Arrow x1={84} y1={78} x2={120} y2={78} c="ga-s ga-thick" />
    <path class="ga-bad" d="M40 54q-6 -6 0 -12t0 -12M74 54q-6 -6 0 -12t0 -12M108 54q-6 -6 0 -12t0 -12" />
    <T x={74} y={20} a="middle" c="ga-tb">overheats</T>
    <rect class="ga-k" x="150" y="54" width="52" height="20" rx="4" />
    <path class="ga-k ga-thin" d="M150 64h14M188 64h14" />
    <path class="ga-w ga-thick" d="M202 64H228" />
    <T x={176} y={46} a="middle" c="ga-tk ga-tb">fuse opens</T>
    <T x={120} y={106} a="middle">too much current: fire risk</T>
    <T x={120} y={124} a="middle" c="ga-tm">a correct fuse cuts the power</T>
  </Art>
);

const hotWire: TermArt = () => (
  <Art label="The end of a three-wire 120 volt AC cable with its wires fanned out. The hot wire, marked with a shock symbol, has black insulation; the other two are neutral and ground.">
    <rect class="ga-w" x="12" y="50" width="56" height="36" rx="10" />
    <path class="ga-k ga-thick" d="M68 60C98 60 98 32 128 32H150" />
    <path class="ga-w" d="M68 68H150M68 76C98 76 98 104 128 104H150" />
    <path class="ga-bad" d="M134 8l-7 9h8l-7 9" />
    <T x={158} y={36} c="ga-tk ga-tb">hot: black</T>
    <T x={158} y={72} c="ga-tm">neutral</T>
    <T x={158} y={108} c="ga-tm">ground</T>
    <T x={12} y={128} c="ga-tm">120 V AC three-wire cable</T>
  </Art>
);

const threeWire: TermArt = () => (
  <Art label="A three-prong plug and its cord running to a piece of equipment. The third wire is picked out: it joins the ground pin of the plug to the metal case.">
    <T x={66} y={38} a="middle" c="ga-tk ga-tb">ground pin</T>
    <path class="ga-w ga-thick" d="M96 56h-16M96 84h-16" />
    <path class="ga-k ga-thick" d="M96 70h-22" />
    <rect class="ga-w" x="96" y="48" width="30" height="44" rx="5" />
    <path class="ga-w" d="M126 64H166M126 76H166" />
    <path class="ga-k" d="M96 70H172" />
    <circle class="ga-fk" cx="172" cy="70" r="4" />
    <rect class="ga-w" x="166" y="40" width="62" height="60" rx="4" />
    <T x={202} y={62} a="middle">metal</T>
    <T x={202} y={88} a="middle">case</T>
    <T x={120} y={124} a="middle" c="ga-tk">the third wire grounds the case</T>
  </Art>
);

const safetyGround: TermArt = () => (
  <Art label="Three pieces of station equipment, each with a wire from its metal case down to one shared bar that is connected to ground: a common safety ground. The ground wire is green or bare.">
    <rect class="ga-w" x="18" y="16" width="54" height="30" rx="4" />
    <rect class="ga-w" x="93" y="16" width="54" height="30" rx="4" />
    <rect class="ga-w" x="168" y="16" width="54" height="30" rx="4" />
    <T x={45} y={35} a="middle">radio</T>
    <T x={120} y={35} a="middle">supply</T>
    <T x={195} y={35} a="middle">tuner</T>
    <path class="ga-k" d="M45 46V72M195 46V72M120 46V72" />
    <path class="ga-k ga-thick" d="M30 72H210" />
    <Ground x={120} y={72} c="ga-k" />
    <T x={120} y={112} a="middle" c="ga-tk ga-tb">one common safety ground</T>
    <T x={120} y={129} a="middle" c="ga-tm">ground wire: green or bare</T>
  </Art>
);

const shock: TermArt = () => (
  <Art label="A hazard: a person touching a live wire, with current running through the body to the ground. The current can heat tissue, disrupt cells and contract muscles.">
    <path class="ga-bad ga-thick" d="M14 24H112" />
    <T x={14} y={42} c="ga-tm">live wire</T>
    <Person x={104} y={92} />
    <path class="ga-w" d="M104 68L112 26" />
    <path class="ga-bad ga-thin" d="M124 30l-7 13h9l-7 13h9l-7 13h9l-7 13" />
    <path class="ga-w ga-thin" d="M60 92H180" />
    <T x={132} y={50} c="ga-tb">hazard: current</T>
    <T x={132} y={66}>through the body</T>
    <T x={120} y={114} a="middle" c="ga-tm">heats tissue, disrupts cells,</T>
    <T x={120} y={130} a="middle" c="ga-tm">contracts muscles</T>
  </Art>
);

function Battery({ c = 'ga-w', y = 54 }: { c?: string; y?: number }) {
  return <path class={c} d={`M60 ${y}h120v50h-120ZM82 ${y}v-9h14v9M144 ${y}v-9h14v9`} />;
}

const storageBattery: TermArt = () => (
  <Art label="A 12-volt storage battery with its plus and minus terminals: rechargeable, and it stores a large amount of energy.">
    <path class="ga-fk ga-soft" d="M60 54h120v50h-120Z" />
    <Battery c="ga-k" />
    <T x={89} y={36} a="middle" c="ga-tb">+</T>
    <T x={151} y={36} a="middle" c="ga-tb">−</T>
    <T x={120} y={84} a="middle" c="ga-tk ga-tl">12 V</T>
    <T x={120} y={126} a="middle" c="ga-tm">rechargeable, stores much energy</T>
  </Art>
);

const shortCircuit: TermArt = () => (
  <Art label="A hazard to avoid: a piece of metal lying across both terminals of a 12-volt battery, with sparks. A short circuit like this can cause burns, fire or an explosion.">
    <T x={120} y={16} a="middle">metal across both terminals</T>
    <path class="ga-s ga-thin" d="M82 38l-5 -9M89 36v-10M96 38l5 -9M144 38l-5 -9M151 36v-10M158 38l5 -9" />
    <Battery y={62} />
    <path class="ga-bad ga-thick" d="M74 48H166" />
    <T x={120} y={92} a="middle">12 V</T>
    <Cross x={38} y={126} />
    <T x={128} y={130} a="middle">burns, fire or explosion</T>
  </Art>
);

const outGassing: TermArt = () => (
  <Art label="A hazard: a battery being charged too fast, with bubbles of gas escaping from it. The gas may be flammable.">
    <Battery y={64} />
    <Arrow x1={14} y1={90} x2={54} y2={90} c="ga-s ga-thick" />
    <T x={8} y={58}>charging</T>
    <T x={8} y={74}>too fast</T>
    <circle class="ga-bad ga-thin" cx="112" cy="44" r="4" />
    <circle class="ga-bad ga-thin" cx="124" cy="28" r="5" />
    <circle class="ga-bad ga-thin" cx="136" cy="46" r="3" />
    <circle class="ga-bad ga-thin" cx="146" cy="18" r="4" />
    <circle class="ga-bad ga-thin" cx="130" cy="12" r="3" />
    <T x={162} y={32} c="ga-tb">gas</T>
    <T x={120} y={132} a="middle">gas escapes: may be flammable</T>
  </Art>
);

/* ---------- grounding and lightning ---------- */

const groundRod: TermArt = () => (
  <Art label="A ground rod driven down into the soil, with a clamp at its top and a wire running to the equipment above ground. A tower needs an eight-foot rod for each leg.">
    <rect class="ga-w" x="24" y="14" width="46" height="26" rx="4" />
    <T x={47} y={31} a="middle">gear</T>
    <path class="ga-w" d="M70 28H120V44" />
    <Soil y={54} />
    <path class="ga-k ga-thick" d="M120 44V120l0 6" />
    <rect class="ga-fk" x="113" y="42" width="14" height="8" rx="2" />
    <T x={134} y={84} c="ga-tk ga-tb">ground rod</T>
    <T x={134} y={100} c="ga-tm">into the soil</T>
    <T x={12} y={88} c="ga-tm">tower: 8 ft rod</T>
    <T x={12} y={104} c="ga-tm">for each leg</T>
  </Art>
);

const bonding: TermArt = () => (
  <Art label="Three ground rods in the soil joined to each other at the top by a heavy wire: bonding all the grounds together.">
    <T x={120} y={20} a="middle" c="ga-tk ga-tb">bond all grounds together</T>
    <T x={120} y={40} a="middle">heavy wire or strap</T>
    <path class="ga-k ga-thin" d="M120 44V54" />
    <Soil y={70} />
    <path class="ga-w ga-thick" d="M50 58V124M120 58V124M190 58V124" />
    <path class="ga-k ga-thick" d="M50 60H190" />
    <path class="ga-fk" d="M44 55h12v10h-12ZM114 55h12v10h-12ZM184 55h12v10h-12Z" />
    <T x={85} y={108} a="middle" c="ga-tm">rod</T>
    <T x={155} y={108} a="middle" c="ga-tm">rod</T>
  </Art>
);

const grounding: TermArt = () => (
  <Art label="Two ground wires from equipment down to earth. The first runs short and straight, which is right. The second wanders with sharp bends, which is wrong for a lightning ground.">
    <rect class="ga-w" x="30" y="12" width="44" height="20" rx="3" />
    <rect class="ga-w" x="150" y="12" width="44" height="20" rx="3" />
    <path class="ga-k ga-thick" d="M52 32V86" />
    <Ground x={52} y={84} c="ga-k" />
    <path class="ga-bad ga-dash" d="M172 32V46H204V62H146V76H172V86" />
    <Ground x={172} y={84} />
    <Tick x={22} y={120} />
    <T x={32} y={124}>short, direct</T>
    <Cross x={134} y={120} />
    <T x={144} y={124}>sharp bends</T>
  </Art>
);

const lightningProt: TermArt = () => (
  <Art label="Lightning striking the top of a tower and being led down the tower and its ground wires into the earth: lightning protection gives it a path to earth.">
    <path class="ga-bad" d="M108 6L90 16H102L84 26H94L68 34" />
    <Tower x={62} base={96} h={58} />
    <Arrow x1={88} y1={48} x2={88} y2={88} c="ga-s" />
    <path class="ga-w ga-thin" d="M8 96H140" />
    <Ground x={52} y={96} c="ga-k" />
    <Ground x={72} y={96} c="ga-k" />
    <T x={104} y={56}>gives lightning a</T>
    <T x={104} y={72} c="ga-tk ga-tb">path to earth</T>
    <T x={120} y={132} a="middle" c="ga-tm">short, direct ground connections</T>
  </Art>
);

const arrester: TermArt = () => (
  <Art label="A feed line from an outdoor antenna passing through a lightning arrester just before it enters the building. The arrester sits on a grounded panel and diverts a surge to ground.">
    <path class="ga-w" d="M30 104V30M20 18L30 30L40 18" />
    <path class="ga-bad" d="M58 8l-9 9h8l-9 9" />
    <path class="ga-w" d="M30 62H100M132 62H178" />
    <rect class="ga-fk ga-soft" x="100" y="52" width="32" height="20" rx="3" />
    <rect class="ga-k" x="100" y="52" width="32" height="20" rx="3" />
    <path class="ga-k" d="M116 72V88" />
    <Ground x={116} y={86} c="ga-k" />
    <path class="ga-w ga-thick" d="M152 14V110" />
    <Rig x={178} y={51} />
    <T x={116} y={42} a="middle" c="ga-tk ga-tb">arrester</T>
    <T x={196} y={32} a="middle" c="ga-tm">indoors</T>
    <T x={120} y={130} a="middle" c="ga-tm">on a grounded panel at the entry</T>
  </Art>
);

const localCode: TermArt = () => (
  <Art label="A book titled local electrical code with an arrow to a tower and its ground connection: local electrical codes set the grounding requirements for a tower, not FCC Part 97.">
    <rect class="ga-fk ga-soft" x="12" y="20" width="84" height="76" rx="3" />
    <rect class="ga-k" x="12" y="20" width="84" height="76" rx="3" />
    <path class="ga-k ga-thin" d="M22 20V96" />
    <T x={59} y={48} a="middle" c="ga-tk ga-tb">local</T>
    <T x={59} y={64} a="middle" c="ga-tk ga-tb">electrical</T>
    <T x={59} y={80} a="middle" c="ga-tk ga-tb">code</T>
    <Arrow x1={104} y1={62} x2={150} y2={62} />
    <T x={127} y={52} a="middle" c="ga-tm">sets</T>
    <Tower x={184} base={92} h={62} />
    <Ground x={184} y={92} />
    <T x={54} y={116} a="middle" c="ga-tm">(not Part 97)</T>
    <T x={180} y={128} a="middle">tower grounding</T>
  </Art>
);

/* ---------- towers ---------- */

const tower: TermArt = () => (
  <Art label="A tall lattice tower holding a beam antenna high above the ground, steadied by guy lines. Its hazards are falls, power lines and lightning.">
    <path class="ga-w ga-thin" d="M8 118H232" />
    <path class="ga-w ga-thin" d="M66 62L22 118M66 62L110 118" />
    <Tower x={66} base={118} h={90} c="ga-k" w={13} ant={false} />
    <path class="ga-k" d="M40 22H92M46 14v16M58 12v20M74 11v22M86 14v16" />
    <T x={126} y={36} c="ga-tk ga-tb">antennas up high</T>
    <T x={126} y={62} c="ga-tm">hazards: falls,</T>
    <T x={126} y={78} c="ga-tm">power lines,</T>
    <T x={126} y={94} c="ga-tm">lightning</T>
  </Art>
);

/** A climber on the right side of a tower at x, feet at y, tied to the tower. */
function Climber({ x, y, hi = false }: { x: number; y: number; hi?: boolean }) {
  return (
    <>
      <Person x={x + 22} y={y} />
      <path class={hi ? 'ga-k' : 'ga-w ga-thin'} d={`M${x + 16} ${y - 13}h12M${x + 17} ${y - 23}l10 10M${x + 27} ${y - 23}l-10 10`} />
      <path class={hi ? 'ga-k ga-thick' : 'ga-w'} d={`M${x + 16} ${y - 13}L${x + 5} ${y - 20}`} />
    </>
  );
}

const harness: TermArt = () => (
  <Art label="A climber on a tower wearing a climbing harness that is tied off to the tower: the harness is worn and attached at all times.">
    <Tower x={40} base={128} h={114} w={14} ant={false} />
    <Person x={92} y={108} s={1.7} />
    <path class="ga-k" d="M83 86h18M84 64L100 86M100 64L84 86M84 86l-4 10M100 86l4 10" />
    <path class="ga-k ga-thick" d="M83 86L48 76" />
    <circle class="ga-fk" cx="48" cy="76" r="4" />
    <T x={132} y={50} c="ga-tk ga-tb">harness</T>
    <path class="ga-k ga-thin" d="M128 52L104 70" />
    <T x={132} y={92}>tied off to the</T>
    <T x={132} y={108}>tower, always</T>
  </Art>
);

const helper: TermArt = () => (
  <Art label="A climber up on a tower and a second person standing on the ground watching: the helper or observer. Never climb without one.">
    <path class="ga-w ga-thin" d="M8 116H232" />
    <Tower x={50} base={116} h={102} w={13} ant={false} />
    <Climber x={50} y={66} />
    <Person x={176} y={116} c="ga-k" />
    <path class="ga-w ga-thin ga-dash" d="M166 82L88 46" />
    <T x={176} y={66} a="middle" c="ga-tk ga-tb">helper</T>
    <T x={232} y={134} a="end" c="ga-tm">never climb without one</T>
  </Art>
);

const guyLine: TermArt = () => (
  <Art label="A tower held steady by tensioned guy lines running from the tower down to anchors in the ground on both sides.">
    <path class="ga-w ga-thin" d="M8 110H232" />
    <Tower x={120} base={110} h={90} ant={false} />
    <path class="ga-k" d="M116 40L30 110M124 40L210 110M114 72L30 110M126 72L210 110" />
    <path class="ga-fw" d="M22 106h16v10h-16ZM202 106h16v10h-16Z" />
    <T x={196} y={54} a="middle" c="ga-tk ga-tb">guy line</T>
    <T x={8} y={40}>holds the</T>
    <T x={8} y={56}>tower steady</T>
    <T x={30} y={132} a="middle" c="ga-tm">anchor</T>
    <T x={210} y={132} a="middle" c="ga-tm">anchor</T>
  </Art>
);

const turnbuckle: TermArt = () => (
  <Art label="A turnbuckle in a guy line: a frame with a threaded eye bolt at each end. A safety wire is threaded through the frame and both eyes so that vibration cannot loosen it.">
    <T x={120} y={20} a="middle" c="ga-tk ga-tb">turnbuckle</T>
    <path class="ga-w" d="M8 62H30M210 62H232" />
    <circle class="ga-w" cx="37" cy="62" r="7" />
    <circle class="ga-w" cx="203" cy="62" r="7" />
    <path class="ga-w" d="M44 62H84M156 62H196" />
    <path class="ga-w ga-thin" d="M52 58v8M60 58v8M68 58v8M76 58v8M164 58v8M172 58v8M180 58v8M188 58v8" />
    <path class="ga-k ga-thick" d="M84 50H156V74H84Z" />
    <path class="ga-good ga-thin" d="M37 55C60 34 96 40 106 62S150 88 203 69" />
    <T x={120} y={104} a="middle">safety wire: stops it loosening</T>
    <T x={120} y={121} a="middle" c="ga-tm">from vibration</T>
  </Art>
);

const crankUp: TermArt = () => (
  <Art label="Two views of a crank-up tower. Retracted, with its sections nested, it is marked with a tick. Raised, with its sections extended, it is marked with a cross: do not climb it then unless safety locks are installed.">
    <path class="ga-w ga-thin" d="M8 108H232" />
    <path class="ga-k" d="M34 108V70H62V108M38 70V62H58V70M42 62V56H54V62M34 108L62 89L34 70" />
    <Tick x={96} y={72} />
    <T x={72} y={98}>retracted</T>
    <path class="ga-k" d="M146 108V76H174V108M150 76V44H170V76M154 44V14H166V44M146 108L174 92L146 76M150 76L170 60L150 44M154 44L166 29L154 14" />
    <Cross x={206} y={70} />
    <T x={184} y={98}>raised</T>
    <T x={120} y={128} a="middle" c="ga-tm">climb only when retracted or locked</T>
  </Art>
);

const powerLine: TermArt = () => (
  <Art label="A power pole seen end-on with its wires as dots, and an antenna mast nearby. A dashed arc shows where the mast would reach if it fell; the gap from that arc to the wires must be at least 10 feet.">
    <path class="ga-w ga-thin" d="M8 112H232" />
    <path class="ga-w" d="M40 112V30M24 36H56" />
    <circle class="ga-fbad" cx="26" cy="31" r="3.5" />
    <circle class="ga-fbad" cx="40" cy="25" r="3.5" />
    <circle class="ga-fbad" cx="54" cy="31" r="3.5" />
    <T x={8} y={14} c="ga-tb">power lines</T>
    <path class="ga-k ga-thick" d="M180 112V26" />
    <path class="ga-k" d="M170 26h20" />
    <path class="ga-w ga-thin ga-dash" d="M180 26A86 86 0 0 0 94 112M180 112L107.4 65.9" />
    <Arrow x1={101} y1={62} x2={61} y2={36} c="ga-good" both />
    <T x={50} y={84} c="ga-tb">≥ 10 ft</T>
    <T x={188} y={76} c="ga-tm">mast</T>
    <T x={120} y={130} a="middle" c="ga-tm">if it falls, still 10 feet clear</T>
  </Art>
);

const utilityPole: TermArt = () => (
  <Art label="A utility pole carrying high-voltage lines, with an antenna fixed to it crossed out: never attach an antenna to a utility pole, because it could touch the power lines.">
    <path class="ga-w ga-thin" d="M8 118H232" />
    <path class="ga-w ga-thick" d="M70 118V26" />
    <path class="ga-w" d="M46 34H94" />
    <path class="ga-bad" d="M48 30Q28 40 8 34M92 30Q160 46 232 32" />
    <circle class="ga-fbad" cx="48" cy="30" r="3.5" />
    <circle class="ga-fbad" cx="92" cy="30" r="3.5" />
    <T x={232} y={22} a="end" c="ga-tb">high-voltage lines</T>
    <path class="ga-w" d="M70 88H92M92 98V46" />
    <Cross x={92} y={70} s={8} c="ga-bad ga-thick" />
    <T x={116} y={78}>never put an</T>
    <T x={116} y={94}>antenna here</T>
  </Art>
);

/* ---------- RF exposure ---------- */

const rf: TermArt = () => (
  <Art label="An antenna sending radio waves out on both sides: RF, radio frequency energy. It is non-ionizing, but strong RF heats body tissue.">
    <path class="ga-w ga-thick" d="M46 116V40" />
    <path class="ga-w ga-thin" d="M20 116H72" />
    <Arcs x={50} y={40} n={4} />
    <Arcs x={42} y={40} n={4} dir={-1} />
    <T x={94} y={36} c="ga-tk ga-tb">RF = radio frequency</T>
    <T x={94} y={64} c="ga-tm">non-ionizing, but</T>
    <T x={94} y={80} c="ga-tm">strong RF heats</T>
    <T x={94} y={96} c="ga-tm">body tissue</T>
  </Art>
);

const rfBurn: TermArt = () => (
  <Art label="A hazard to avoid: a hand touching an antenna while it is transmitting, with a burn mark where they meet. Never touch an antenna during a transmission.">
    <path class="ga-w ga-thick" d="M70 112V22" />
    <Arcs x={64} y={30} dir={-1} />
    <Arcs x={76} y={30} />
    <path class="ga-w ga-thick" d="M170 86H124" />
    <rect class="ga-w" x="100" y="74" width="24" height="24" rx="7" />
    <path class="ga-w ga-thick" d="M100 80H76" />
    <path class="ga-w" d="M110 74l-5 -9" />
    <path class="ga-bad" d="M64 72l-9 -5M62 80h-11M64 88l-9 5M78 70l4 -8M78 90l4 8" />
    <T x={150} y={60} a="middle" c="ga-tb">RF burn</T>
    <Cross x={22} y={126} />
    <T x={128} y={130} a="middle">never touch while transmitting</T>
  </Art>
);

function sweep(cx: number, cy: number, r: number, half: number): string {
  const dx = r * Math.cos(half), dy = r * Math.sin(half);
  return `M${r1(cx + dx)} ${r1(cy - dy)}A${r} ${r} 0 0 1 ${r1(cx + dx)} ${r1(cy + dy)}`;
}

const rfExposure: TermArt = () => (
  <Art label="An antenna with waves that are drawn heavy close to it and fainter farther away. A person near the antenna gets strong RF exposure; a person far away gets weak exposure.">
    <path class="ga-w ga-thin" d="M8 112H232" />
    <path class="ga-w ga-thick" d="M24 112V40" />
    <path class="ga-s ga-thick" d={sweep(24, 62, 16, 0.6) + sweep(24, 62, 30, 0.6)} />
    <path class="ga-s" d={sweep(24, 62, 64, 0.5)} />
    <path class="ga-s ga-thin" d={sweep(24, 62, 98, 0.42)} />
    <path class="ga-s ga-thin ga-soft" d={sweep(24, 62, 132, 0.36) + sweep(24, 62, 164, 0.3)} />
    <Person x={70} y={112} />
    <Person x={208} y={112} />
    <T x={70} y={130} a="middle" c="ga-tb">near: strong</T>
    <T x={200} y={130} a="middle" c="ga-tm">far: weak</T>
  </Art>
);

const rfEval: TermArt = () => (
  <Art label="A checklist of the three accepted ways to do an RF exposure evaluation: calculate using FCC OET Bulletin 65, use computer modeling, or measure field strength. Redo it after any change to the station.">
    <T x={12} y={20} c="ga-tk ga-tb">RF exposure check, any of:</T>
    <rect class="ga-w ga-thin" x="8" y="30" width="224" height="78" rx="4" />
    <Tick x={24} y={46} />
    <T x={38} y={50}>calculate (OET Bulletin 65)</T>
    <Tick x={24} y={70} />
    <T x={38} y={74}>computer modeling</T>
    <Tick x={24} y={94} />
    <T x={38} y={98}>measure field strength</T>
    <path class="ga-w" d="M212 102V76" />
    <Arcs x={208} y={76} dir={-1} n={2} c="ga-s ga-thin" r0={5} step={5} />
    <T x={12} y={128} c="ga-tm">redo after any station change</T>
  </Art>
);

const mpe: TermArt = () => (
  <Art label="A bar chart of the exposure limit at four frequencies: 3.5, 50, 440 and 1296 megahertz. The bar at 50 megahertz is the shortest: that band has the lowest maximum permissible exposure. Bar heights are only a sketch.">
    <T x={130} y={18} a="middle" c="ga-tm">exposure limit by frequency</T>
    <path class="ga-w" d="M30 96H226" />
    <rect class="ga-fw ga-soft" x="42" y="34" width="26" height="62" />
    <rect class="ga-fk" x="90" y="80" width="26" height="16" />
    <rect class="ga-fw ga-soft" x="138" y="72" width="26" height="24" />
    <rect class="ga-fw ga-soft" x="186" y="54" width="26" height="42" />
    <T x={55} y={112} a="middle">3.5</T>
    <T x={103} y={112} a="middle" c="ga-tk ga-tb">50</T>
    <T x={151} y={112} a="middle">440</T>
    <T x={199} y={112} a="middle">1296</T>
    <T x={120} y={131} a="middle" c="ga-tk">50 MHz: lowest exposure limit</T>
  </Art>
);

const powerDensity: TermArt = () => (
  <Art label="An antenna sending radio energy through a marked window of area: power density is the RF power passing through a given area.">
    <path class="ga-w ga-thick" d="M28 112V40" />
    <Arcs x={34} y={46} />
    <Arrow x1={78} y1={50} x2={212} y2={50} c="ga-s ga-thin" />
    <Arrow x1={78} y1={66} x2={212} y2={66} c="ga-s ga-thin" />
    <Arrow x1={78} y1={82} x2={212} y2={82} c="ga-s ga-thin" />
    <path class="ga-fk ga-soft" d="M136 42L166 30V92L136 104Z" />
    <path class="ga-k" d="M136 42L166 30V92L136 104Z" />
    <T x={151} y={20} a="middle" c="ga-tk ga-tb">area</T>
    <T x={130} y={128} a="middle" c="ga-tm">RF power through a given area</T>
  </Art>
);

const dutyCycle: TermArt = () => (
  <Art label="Two rows of bars over time. At 100 percent the transmitter is on all the time. At 50 percent it is on half the time and off half the time. A lower duty cycle means lower average exposure.">
    <T x={12} y={32} c="ga-tb">100 %</T>
    <rect class="ga-fs" x="70" y="20" width="150" height="16" />
    <T x={12} y={66} c="ga-tb">50 %</T>
    <path class="ga-fs" d="M70 54h15v16h-15ZM100 54h15v16h-15ZM130 54h15v16h-15ZM160 54h15v16h-15ZM190 54h15v16h-15Z" />
    <path class="ga-w ga-thin" d="M70 70H220" />
    <T x={120} y={94} a="middle" c="ga-tk ga-tb">percent of time transmitting</T>
    <T x={120} y={114} a="middle" c="ga-tm">lower duty cycle =</T>
    <T x={120} y={130} a="middle" c="ga-tm">lower average exposure</T>
  </Art>
);

const averagingTime: TermArt = () => (
  <Art label="Bursts of transmitting along a time line, with a bracket over the whole stretch labelled averaging time and a dashed line for the average level over it.">
    <T x={120} y={22} a="middle" c="ga-tk ga-tb">averaging time</T>
    <path class="ga-k" d="M24 40v-8H216v8" />
    <path class="ga-fs" d="M34 50h28v32h-28ZM92 50h20v32h-20ZM150 50h40v32h-40Z" />
    <Arrow x1={20} y1={82} x2={224} y2={82} />
    <path class="ga-w ga-thin ga-dash" d="M24 68H216" />
    <T x={120} y={104} a="middle">exposure is averaged over it</T>
    <T x={120} y={124} a="middle" c="ga-tm">dashed line: the average</T>
  </Art>
);

function Atom({ y }: { y: number }) {
  return (
    <>
      <circle class="ga-w ga-thin" cx="60" cy={y} r="28" />
      <circle class="ga-fk" cx="60" cy={y} r="7" />
    </>
  );
}

const ionizing: TermArt = () => (
  <Art label="A high-energy ray hits an atom and knocks an electron off it: ionizing radiation, as from radioactive material. It can cause chemical changes in cells and damage DNA. Radio signals are not this type.">
    <Atom y={72} />
    <path class="ga-bad" d={wave(8, 50, 30, 7, 5)} />
    <path class="ga-bad" d={`M50 30L62 40${headD(64, 42, 0.7, 6)}`} />
    <Arrow x1={72} y1={40} x2={104} y2={24} c="ga-bad ga-thin" />
    <circle class="ga-fw" cx="112" cy="20" r="4" />
    <T x={122} y={24} c="ga-tb">electron stripped</T>
    <T x={104} y={62}>radioactive material,</T>
    <T x={104} y={78}>not radio</T>
    <T x={120} y={128} a="middle" c="ga-tm">can change cells, damage DNA</T>
  </Art>
);

const nonIonizing: TermArt = () => (
  <Art label="A long radio wave passing an atom whose electron stays in place: non-ionizing radiation. Radio signals have too little energy to strip electrons, though strong RF can still heat the body.">
    <path class="ga-s" d={wave(8, 150, 22, 48, 8)} />
    <T x={160} y={26} c="ga-ts">radio wave</T>
    <Atom y={78} />
    <circle class="ga-fw" cx="88" cy="78" r="4" />
    <T x={104} y={66} c="ga-tb">electrons stay put</T>
    <T x={104} y={82} c="ga-tm">too little energy</T>
    <T x={104} y={98} c="ga-tm">to strip them</T>
    <T x={120} y={130} a="middle" c="ga-tm">it can still heat the body</T>
  </Art>
);

/* ---------- the set ---------- */

/** Drawings keyed by glossary term id (the `id` field in the glossary data). */
export const ART: Record<string, TermArt> = {
  // T1: FCC rules
  '10-meter-band': tenMeters,
  '2-meter-band': twoMeters,
  'amateur-radio-service': service,
  'automatic-control': autoControl,
  'auxiliary-station': auxiliary,
  band,
  'band-edge': bandEdge,
  beacon,
  broadcasting,
  'business-communications': business,
  'call-sign': callSign,
  'club-station': clubStation,
  compensation,
  'control-operator': controlOp,
  'control-point': controlPoint,
  cw,
  'email-address-requirement': email,
  'encoded-messages': encoded,
  fcc,
  'frequency-coordinator': freqCoord,
  ft8,
  'grace-period': grace,
  'group-d-call-sign': groupD,
  hf,
  'indecent-or-obscene-language': indecent,
  'international-communications': international,
  iss,
  itu,
  'license-class': licenseClass,
  'license-grant': licenseGrant,
  'license-term': licenseTerm,
  'maritime-mobile': maritime,
  mhz,
  music,
  'part-97': part97,
  pep,
  phone,
  'phonetic-alphabet': phonetic,
  'remote-control': remoteControl,
  'secondary-service': secondary,
  'self-assigned-indicator': selfAssigned,
  sidebands,
  'space-station': spaceStation,
  'station-identification': stationId,
  'station-licensee': licensee,
  'tactical-call-sign': tactical,
  'technician-class': technician,
  telecommand,
  'third-party-communications': thirdParty,
  uls,
  'vanity-call-sign': vanity,
  'willful-interference': willful,
  // T2: operating procedures
  '70-centimeter-band': seventyCm,
  ares,
  'band-plan': bandPlan,
  check,
  'check-in': checkIn,
  'color-code': colorCode,
  cq,
  ctcss,
  dcs,
  dmr,
  dtmf,
  'emergency-communications': emergency,
  frequency,
  'frequency-privileges': freqPrivileges,
  interference,
  'linked-repeater-network': linked,
  'national-calling-frequency': natCalling,
  net,
  'net-control-station': ncs,
  preamble,
  'procedural-signal': procedural,
  'q-signal': qSignal,
  qrm,
  qsy,
  races,
  radiogram,
  repeater,
  'repeater-input-frequency': repInput,
  'repeater-offset': repOffset,
  'repeater-output-frequency': repOutput,
  'reverse-function': reverse,
  simplex,
  squelch,
  talkgroup,
  traffic,
  winlink,
  // T0: safety
  'averaging-time': averagingTime,
  bonding,
  'circuit-breaker': breaker,
  'climbing-harness': harness,
  'crank-up-tower': crankUp,
  'duty-cycle': dutyCycle,
  'electrical-shock': shock,
  fuse,
  'ground-rod': groundRod,
  grounding,
  'guy-line': guyLine,
  'helper-or-observer': helper,
  'hot-wire': hotWire,
  'ionizing-radiation': ionizing,
  'lightning-arrester': arrester,
  'lightning-protection': lightningProt,
  'local-electrical-code': localCode,
  mpe,
  'non-ionizing-radiation': nonIonizing,
  'out-gassing': outGassing,
  'overhead-power-line': powerLine,
  overload,
  'power-density': powerDensity,
  rf,
  'rf-burn': rfBurn,
  'rf-exposure': rfExposure,
  'rf-exposure-evaluation': rfEval,
  'safety-ground': safetyGround,
  'short-circuit': shortCircuit,
  'storage-battery': storageBattery,
  'three-wire-cord': threeWire,
  tower,
  turnbuckle,
  'utility-pole': utilityPole,
};
