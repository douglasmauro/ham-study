import type { ComponentChildren, VNode } from 'preact';
import { Art, T, wave, type TermArt } from './kit';

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

type Kids = { children?: ComponentChildren };

const FILL: Record<string, string> = {
  'ga-k': 'ga-fk', 'ga-w': 'ga-fw', 'ga-s': 'ga-fs', 'ga-good': 'ga-fgood', 'ga-bad': 'ga-fbad',
};
const fillOf = (c: string) => FILL[c.split(' ')[0]] ?? 'ga-fw';

/**
 * Schematic symbols drawn to match exam figures T-1, T-2 and T-3. Each sits in a
 * 60 x 40 box with its leads on the line y = 20. `c` is the stroke class and
 * `st` an inline stroke-width that undoes the scale, so lines stay one weight.
 */
type Draw = (c: string, st: string, thin: string) => VNode;
const P = (d: string, c: string, st: string) => <path d={d} class={c} style={st} />;

const ZIG = 'M0 20H9l3-9 6 18 6-18 6 18 6-18 6 18 3-9H60';
const COIL = 'M0 20H12a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0H60';

const SYMS = {
  /** T-1 component 1 */
  res: (c, st) => P(ZIG, c, st),
  /** T-2 component 9: zigzag, an arrow touching it, and the arrow wired to one end */
  pot: (c, st, thin) => (
    <g>
      {P(`${ZIG}M30 42V35M30 42H54V20`, c, st)}
      {P('M30 30l-3 5.5h6z', `${c} ${fillOf(c)}`, thin)}
      <circle cx="54" cy="20" r="2.2" class={`${c} ${fillOf(c)}`} style={st} />
    </g>
  ),
  /** T-2 component 6: one straight plate and one curved plate */
  cap: (c, st) => P('M0 20H25M25 7V33M38 7Q30 20 38 33M34 20H60', c, st),
  coil: (c, st) => P(COIL, c, st),
  /** T-3 component 3: coil, an arrow touching it, and the arrow wired to one end */
  varcoil: (c, st, thin) => (
    <g>
      {P(`${COIL}M24 40V27M24 40H54V20`, c, st)}
      {P('M24 21.5l-3 5.5h6z', `${c} ${fillOf(c)}`, thin)}
      <circle cx="54" cy="20" r="2.2" class={`${c} ${fillOf(c)}`} style={st} />
    </g>
  ),
  /** T-2 component 5 */
  diode: (c, st) => (
    <g>
      {P('M0 20H60M39 10V30', c, st)}
      {P('M23 10L39 20L23 30Z', `${c} ${fillOf(c)}`, st)}
    </g>
  ),
  /** T-2 component 8: a diode with arrows pointing away */
  led: (c, st, thin) => (
    <g>
      {P('M0 20H60M39 10V30', c, st)}
      {P('M23 10L39 20L23 30Z', `${c} ${fillOf(c)}`, st)}
      {P('M38 6l7-5M45 1h-4M45 1v4M47 9l7-5M54 4h-4M54 4v4', c, thin)}
    </g>
  ),
  /** T-1 component 2, with collector and emitter leads carried out of the circle */
  bjt: (c, st, thin) => (
    <g>
      <circle cx="31" cy="20" r="17" class={c} style={st} />
      {P('M0 20H23M23 15l15-9V-6M23 25l15 9V46', c, st)}
      {P('M23 9V31', `${c} ga-thick`, '')}
      {P('M37.5 33.6l-6.5-1.2 3.2-5z', `${c} ${fillOf(c)}`, thin)}
    </g>
  ),
  /** Field-effect transistor (not in the exam figures): gate arrow, drain and source */
  fet: (c, st, thin) => (
    <g>
      <circle cx="31" cy="20" r="17" class={c} style={st} />
      {P('M0 20H16M24 13H38V-6M24 27H38V46', c, st)}
      {P('M24 9V31', `${c} ga-thick`, '')}
      {P('M22.5 20l-6.5-3.6v7.2z', `${c} ${fillOf(c)}`, thin)}
    </g>
  ),
  /** T-1 component 3 */
  lamp: (c, st) => P('M0 20H26V13a4 4 0 0 1 8 0V20H60M21 20V11a9 9 0 0 1 18 0V20', c, st),
  /** T-1 component 4: alternating long and short lines */
  batt: (c, st) => P('M0 20H21M21 6V34M27 13V27M33 6V34M39 13V27M39 20H60', c, st),
  /** T-2 component 4: two windings and a core */
  xfmr: (c, st, thin) => (
    <g>
      {P('M8 4H21a5.33 5.33 0 0 1 0 10.67a5.33 5.33 0 0 1 0 10.67a5.33 5.33 0 0 1 0 10.67H8', c, st)}
      {P('M52 4H39a5.33 5.33 0 0 0 0 10.67a5.33 5.33 0 0 0 0 10.67a5.33 5.33 0 0 0 0 10.67H52', c, st)}
      {P('M28.5 4V36M31.5 4V36', c, thin)}
    </g>
  ),
} satisfies Record<string, Draw>;

type SymName = keyof typeof SYMS;

/** A symbol centered on (x, y), scaled by s and turned r degrees. */
function Sym({ n, x, y, s = 1, r = 0, c = 'ga-k' }: { n: SymName; x: number; y: number; s?: number; r?: number; c?: string }) {
  const st = `stroke-width:${(2.5 / s).toFixed(2)}`;
  const thin = `stroke-width:${(1.6 / s).toFixed(2)}`;
  return <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-30 -20)`}>{SYMS[n](c, st, thin)}</g>;
}

/** A line with a solid arrowhead at (x2, y2). */
function Arrow({ x1, y1, x2, y2, c = 'ga-s', h = 7 }: { x1: number; y1: number; x2: number; y2: number; c?: string; h?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const bx = x2 - h * Math.cos(a);
  const by = y2 - h * Math.sin(a);
  const px = -Math.sin(a) * h * 0.5;
  const py = Math.cos(a) * h * 0.5;
  const f = (v: number) => v.toFixed(1);
  return (
    <g>
      <path d={`M${x1} ${y1}L${f(bx)} ${f(by)}`} class={c} />
      <path d={`M${f(x2)} ${f(y2)}L${f(bx + px)} ${f(by + py)}L${f(bx - px)} ${f(by - py)}Z`} class={`${c} ${fillOf(c)}`} style="stroke-width:1.5" />
    </g>
  );
}

/** Small solid dots, used for moving charge. */
function Dots({ pts, r = 3, c = 'ga-fs' }: { pts: [number, number][]; r?: number; c?: string }) {
  return <g>{pts.map(([x, y]) => <circle cx={x} cy={y} r={r} class={c} />)}</g>;
}
const row = (x0: number, x1: number, step: number, y: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let x = x0; x <= x1; x += step) out.push([x, y]);
  return out;
};

/** Short rays of light around (x, y), between two angles in degrees (0 = right, -90 = up). */
function Rays({ x, y, r1, r2, from, to, n, c = 'ga-s' }: { x: number; y: number; r1: number; r2: number; from: number; to: number; n: number; c?: string }) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = ((from + ((to - from) * i) / Math.max(1, n - 1)) * Math.PI) / 180;
    d += `M${(x + r1 * Math.cos(a)).toFixed(1)} ${(y + r1 * Math.sin(a)).toFixed(1)}L${(x + r2 * Math.cos(a)).toFixed(1)} ${(y + r2 * Math.sin(a)).toFixed(1)}`;
  }
  return <path d={d} class={c} />;
}

/** A switch terminal: a small open circle. */
const Term = ({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) => <circle cx={x} cy={y} r="4" class={c} />;

const Check = ({ x, y }: { x: number; y: number }) => <path d={`M${x - 7} ${y}l5 5 9-11`} class="ga-good" />;
const Cross = ({ x, y, r = 6 }: { x: number; y: number; r?: number }) => <path d={`M${x - r} ${y - r}l${2 * r} ${2 * r}M${x + r} ${y - r}l${-2 * r} ${2 * r}`} class="ga-bad" />;

/**
 * A one-loop circuit: battery on the left (x = 20), a lamp or resistor in the top
 * wire (centered on x = 75) and a return wire. `gap` leaves room on the right
 * side (x = 130) for a meter.
 */
function Loop({ y0 = 44, y1 = 112, top = 'lamp', gap = false }: { y0?: number; y1?: number; top?: SymName; gap?: boolean }) {
  const my = (y0 + y1) / 2;
  const right = gap ? `V${my - 14}M130 ${my + 14}V${y1}` : `V${y1}`;
  return (
    <g>
      <path class="ga-w" d={`M20 ${my - 30}V${y0}H45M105 ${y0}H130${right}H20V${my + 30}`} />
      <Sym n="batt" x={20} y={my} r={90} c="ga-w" />
      <Sym n={top} x={75} y={y0} c="ga-w" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Metric prefixes                                                     */
/* ------------------------------------------------------------------ */

const LADDER: [string, string, string][] = [
  ['G', 'giga', 'one billion'],
  ['M', 'mega', 'one million'],
  ['k', 'kilo', 'one thousand'],
  ['', 'the unit', 'one'],
  ['m', 'milli', 'one thousandth'],
  ['µ', 'micro', 'one millionth'],
  ['p', 'pico', 'one trillionth'],
];

/** The prefix ladder from giga down to pico, with one rung (or all of them) highlighted. */
function Ladder({ hi }: { hi?: string }) {
  const label = hi
    ? `A ladder of metric prefixes from giga at the top to pico at the bottom, with ${hi} highlighted: ${LADDER.find((r) => r[1] === hi)?.[2]}.`
    : 'A ladder of metric prefixes: giga one billion, mega one million, kilo one thousand, the plain unit, milli one thousandth, micro one millionth, pico one trillionth.';
  return (
    <Art label={label}>
      <path d="M22 12V128" class="ga-w ga-thin" />
      <path d="M22 8l-4 7h8zM22 132l-4-7h8z" class="ga-w ga-fw ga-thin" />
      {LADDER.map(([sym, name, words], i) => {
        const y = 22 + i * 17;
        const on = hi ? name === hi : sym !== '';
        const tc = on ? 'ga-tk ga-tb' : 'ga-tm';
        return (
          <g>
            {hi && on && <rect x="32" y={y - 12.5} width="198" height="17" rx="5" class="ga-k ga-thin" />}
            <T x={48} y={y} c={`${tc} ga-tb`} a="middle">{sym}</T>
            <T x={64} y={y} c={tc}>{name}</T>
            <T x={224} y={y} c={tc} a="end">{words}</T>
          </g>
        );
      })}
    </Art>
  );
}

/** One big tile equals many small tiles: a larger unit and the smaller unit it is made of. */
function Many({ label, big, small, hi, note }: { label: string; big: string; small: string; hi: 'big' | 'small'; note?: string }) {
  const tiles: VNode[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    tiles.push(<rect x={138 + c * 12} y={22 + r * 12} width="8" height="8" rx="1.5" class={hi === 'small' ? 'ga-fk' : 'ga-fw'} />);
  }
  return (
    <Art label={label}>
      <rect x="28" y="20" width="48" height="48" rx="6" class={hi === 'big' ? 'ga-k' : 'ga-w'} />
      <T x={52} y={49} c={`ga-tl ${hi === 'big' ? 'ga-tk' : 'ga-tm'}`} a="middle">1</T>
      <T x={108} y={50} c="ga-tl ga-tm" a="middle">=</T>
      {tiles}
      <T x={52} y={88} c={hi === 'big' ? 'ga-tk ga-tb' : 'ga-tm'} a="middle">{big}</T>
      <T x={166} y={88} c={hi === 'small' ? 'ga-tk ga-tb' : 'ga-tm'} a="middle">{small}</T>
      {note && <path d="M40 104H200" class="ga-w ga-thin ga-soft" />}
      {note && <T x={120} y={124} a="middle">{note}</T>}
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* Units and formulas                                                  */
/* ------------------------------------------------------------------ */

/** A component symbol with the letter of its unit, the quantity and the unit name. */
function UnitArt({ label, sym, letter, q, unit, formula }: { label: string; sym: SymName; letter: string; q: string; unit: string; formula?: string }) {
  const dy = formula ? 0 : 12;
  return (
    <Art label={label}>
      <Sym n={sym} x={72} y={66 + dy} s={1.6} c="ga-w" />
      <T x={72} y={30 + dy} c="ga-tl ga-tk" a="middle">{letter}</T>
      <T x={136} y={58 + dy} c="ga-tm">{q}</T>
      <T x={136} y={76 + dy} c="ga-tk ga-tb">{unit}</T>
      {formula && <T x={120} y={126} a="middle">{formula}</T>}
    </Art>
  );
}

/** The cover-up triangle for a three-letter formula, with its three forms beside it. */
function Triangle({ label, top, left, right, forms, legend }: { label: string; top: string; left: string; right: string; forms: string[]; legend: string }) {
  return (
    <Art label={label}>
      <path d="M64 10L114 98H14ZM38.5 55H89.5M64 55V98" class="ga-k" />
      <T x={64} y={46} c="ga-tl ga-tk" a="middle">{top}</T>
      <T x={46} y={88} c="ga-tl ga-tk" a="middle">{left}</T>
      <T x={82} y={88} c="ga-tl ga-tk" a="middle">{right}</T>
      {forms.map((f, i) => <T x={138} y={36 + i * 26} c={`ga-tl ${i === 0 ? 'ga-tk' : ''}`}>{f}</T>)}
      <T x={120} y={126} c="ga-tm" a="middle">{legend}</T>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* Components                                                          */
/* ------------------------------------------------------------------ */

/** Schematic symbol on the left, a sketch of the real part on the right, one line of text below. */
function Pair({ label, sym, s = 1.5, sy = 52, right = 'real part', note, children }: Kids & { label: string; sym: SymName; s?: number; sy?: number; right?: string; note?: string }) {
  return (
    <Art label={label}>
      <Sym n={sym} x={66} y={sy} s={s} />
      <T x={66} y={102} c="ga-tm" a="middle">symbol</T>
      {children}
      <T x={178} y={102} c="ga-tm" a="middle">{right}</T>
      {note && <T x={120} y={128} a="middle">{note}</T>}
    </Art>
  );
}

/** A diode drawn in two halves so the anode side or the cathode side can be highlighted. */
function DiodeEnds({ hi }: { hi: 'anode' | 'cathode' }) {
  const a = hi === 'anode' ? 'ga-k' : 'ga-w';
  const k = hi === 'cathode' ? 'ga-k' : 'ga-w';
  const y = hi === 'anode' ? 56 : 44;
  return (
    <Art label={hi === 'anode'
      ? 'A diode symbol with the anode highlighted: the lead on the triangle side, where current flows in. The cathode is the bar side.'
      : 'A diode symbol with the cathode highlighted: the lead on the bar side. Below, a real diode whose stripe marks the cathode lead.'}>
      <path d={`M40 ${y}H104`} class={a} />
      <path d={`M104 ${y - 18}L136 ${y}L104 ${y + 18}Z`} class={`${a} ${fillOf(a)}`} />
      <path d={`M136 ${y - 18}V${y + 18}M136 ${y}H200`} class={k} />
      <T x={66} y={y + 30} c={hi === 'anode' ? 'ga-tk ga-tb' : 'ga-tm'} a="middle">anode</T>
      <T x={174} y={y + 30} c={hi === 'cathode' ? 'ga-tk ga-tb' : 'ga-tm'} a="middle">cathode</T>
      {hi === 'anode' && (
        <g>
          <Arrow x1={14} y1={56} x2={34} y2={56} />
          <Arrow x1={206} y1={56} x2={226} y2={56} />
          <T x={66} y={116} c="ga-ts" a="middle">current in</T>
          <T x={174} y={116} c="ga-tm" a="middle">current out</T>
        </g>
      )}
      {hi === 'cathode' && (
        <g>
          <path d="M56 104H92M148 104H184" class="ga-w" />
          <rect x="92" y="94" width="56" height="20" rx="4" class="ga-w" />
          <rect x="132" y="94" width="7" height="20" class="ga-fk" />
          <T x={120} y={132} c="ga-tk" a="middle">stripe on the package = cathode</T>
        </g>
      )}
    </Art>
  );
}

/** A transistor symbol with its three electrodes named. */
function Tri3({ label, sym, names, hi }: { label: string; sym: 'bjt' | 'fet'; names: [string, string, string]; hi: 'sym' | 'names' }) {
  const tc = hi === 'names' ? 'ga-tk ga-tb' : 'ga-tm';
  return (
    <Art label={label}>
      <Sym n={sym} x={118} y={68} s={1.7} c={hi === 'sym' ? 'ga-k' : 'ga-w'} />
      <T x={61} y={72} c={tc} a="end">{names[0]}</T>
      <T x={141} y={30} c={tc}>{names[1]}</T>
      <T x={141} y={114} c={tc}>{names[2]}</T>
    </Art>
  );
}

/** An amplifier triangle with a small wave going in and a larger one coming out. */
function Amp({ gain }: { gain: boolean }) {
  return (
    <Art label={gain
      ? 'An amplifier with a small input wave and a larger output wave; markers show the two heights, and gain is how much larger the output is.'
      : 'An amplifier, drawn as a triangle, takes in a small wave and puts out a larger wave.'}>
      <path d={wave(24, 64, 62, 20, 6)} class="ga-s" />
      <path d="M68 62H92M148 62H172" class="ga-w" />
      <path d="M92 30V94L148 62Z" class={gain ? 'ga-w' : 'ga-k'} />
      <path d={wave(176, 216, 62, 20, 24)} class="ga-s" />
      {gain && <path d="M14 56V68M10 56H18M10 68H18M226 38V86M222 38H230M222 86H230" class="ga-k" />}
      <T x={44} y={96} c="ga-tm" a="middle">{gain ? 'input' : 'small in'}</T>
      <T x={196} y={110} c="ga-tm" a="middle">{gain ? 'output' : 'larger out'}</T>
      {gain
        ? <T x={120} y={131} c="ga-tk ga-tb" a="middle">gain = how much larger</T>
        : <T x={120} y={20} c="ga-tk ga-tb" a="middle">amplifier</T>}
    </Art>
  );
}

/** A battery sketch with a recharge mark: allowed or crossed out. */
function Chem({ label, name, shape, ok }: { label: string; name: string; shape: 'cell' | 'car' | 'pack'; ok: boolean }) {
  return (
    <Art label={label}>
      {shape === 'cell' && (
        <g>
          <rect x="54" y="30" width="40" height="76" rx="6" class="ga-k" />
          <rect x="66" y="22" width="16" height="8" rx="2" class="ga-k ga-fk" />
          <T x={74} y={52} c="ga-tm" a="middle">+</T>
          <T x={74} y={98} c="ga-tm" a="middle">{'−'}</T>
        </g>
      )}
      {shape === 'car' && (
        <g>
          <rect x="36" y="46" width="76" height="60" rx="5" class="ga-k" />
          <rect x="48" y="36" width="14" height="10" rx="2" class="ga-k ga-fk" />
          <rect x="86" y="36" width="14" height="10" rx="2" class="ga-k ga-fk" />
          <path d="M36 62H112" class="ga-k ga-thin" />
          <T x={55} y={90} c="ga-tm" a="middle">+</T>
          <T x={93} y={90} c="ga-tm" a="middle">{'−'}</T>
        </g>
      )}
      {shape === 'pack' && (
        <g>
          <rect x="42" y="30" width="64" height="76" rx="8" class="ga-k" />
          <path d="M56 30V22M68 30V22M80 30V22M92 30V22" class="ga-k" />
          <path d="M54 50H94" class="ga-k ga-thin" />
          <T x={62} y={84} c="ga-tm" a="middle">+</T>
          <T x={86} y={84} c="ga-tm" a="middle">{'−'}</T>
        </g>
      )}
      <path d="M154 52a20 20 0 0 1 36 -4M190 68a20 20 0 0 1 -36 4" class={ok ? 'ga-good' : 'ga-w'} />
      <path d="M192 38l-1 12-10-5zM152 82l1-12 10 5z" class={ok ? 'ga-good ga-fgood' : 'ga-w ga-fw'} style="stroke-width:1.5" />
      {!ok && <Cross x={172} y={60} r={16} />}
      <T x={172} y={104} c="ga-tk ga-tb" a="middle">{ok ? 'rechargeable' : 'not rechargeable'}</T>
      <T x={74} y={129} c="ga-tm" a="middle">{name}</T>
    </Art>
  );
}

/** Rectified wave: only the positive half-cycles. */
function humps(x0: number, x1: number, y: number, length: number, amp: number): string {
  let d = '';
  for (let x = x0; x <= x1; x += 1) {
    const v = Math.max(0, Math.sin(((x - x0) / length) * 2 * Math.PI));
    d += `${x === x0 ? 'M' : 'L'}${x} ${(y - amp * v).toFixed(1)}`;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/* The drawings                                                        */
/* ------------------------------------------------------------------ */

export const ART: Record<string, TermArt> = {
  /* ---------- T5: electrical principles ---------- */

  ac: () => (
    <Art label="Two graphs side by side. AC is a wave that swings above and below the zero line, positive then negative. DC is a flat line that stays on one side.">
      <path d="M12 64H114M130 64H228" class="ga-w ga-thin" />
      <path d={wave(14, 110, 64, 48, 26)} class="ga-k" />
      <path d="M132 40H226" class="ga-w ga-thick" />
      <T x={62} y={20} c="ga-tk ga-tb" a="middle">AC</T>
      <T x={179} y={20} c="ga-tm ga-tb" a="middle">DC</T>
      <T x={104} y={46} c="ga-tm" a="middle">+</T>
      <T x={20} y={90} c="ga-tm" a="middle">{'−'}</T>
      <T x={62} y={118} c="ga-tk" a="middle">reverses</T>
      <T x={62} y={132} c="ga-tk" a="middle">direction</T>
      <T x={179} y={118} c="ga-tm" a="middle">one direction</T>
    </Art>
  ),

  ampere: () => (
    <Art label="A simple circuit of a battery and a lamp with a meter marked A in the loop: the meter counts the current in amperes.">
      <Loop gap />
      <circle cx="130" cy="78" r="14" class="ga-k" />
      <T x={130} y={82.5} c="ga-tk ga-tb" a="middle">A</T>
      <Dots pts={row(44, 108, 16, 112)} />
      <T x={154} y={64} c="ga-ts">current,</T>
      <T x={154} y={82} c="ga-tk ga-tb">in amperes</T>
      <T x={154} y={100} c="ga-tm">(amps, A)</T>
    </Art>
  ),

  volt: () => (
    <Art label="A battery symbol with a meter marked V connected across its two ends: the meter reads the push of the battery in volts.">
      <Sym n="batt" x={76} y={46} s={1.5} c="ga-w" />
      <path d="M31 46V104H62M90 104H121V46" class="ga-w" />
      <circle cx="76" cy="104" r="14" class="ga-k" />
      <T x={76} y={108.5} c="ga-tk ga-tb" a="middle">V</T>
      <T x={46} y={34} c="ga-tm" a="middle">+</T>
      <T x={108} y={34} c="ga-tm" a="middle">{'−'}</T>
      <T x={140} y={50} c="ga-tm">voltage:</T>
      <T x={140} y={66} c="ga-tm">electrical push,</T>
      <T x={140} y={86} c="ga-tk ga-tb">in volts (V)</T>
    </Art>
  ),

  ohm: () => (
    <UnitArt label="A resistor symbol with the ohm sign above it: resistance is measured in ohms, and ohms equal volts divided by amperes."
      sym="res" letter={'Ω'} q="resistance," unit="in ohms" formula={'ohms = volts ÷ amperes'} />
  ),

  farad: () => (
    <UnitArt label="A capacitor symbol with the letter F above it: capacitance is measured in farads."
      sym="cap" letter="F" q="capacitance," unit="in farads" />
  ),

  henry: () => (
    <UnitArt label="An inductor coil symbol with the letter H above it: inductance is measured in henrys."
      sym="coil" letter="H" q="inductance," unit="in henrys" />
  ),

  watt: () => (
    <Art label="A lit lamp symbol: the power it uses is measured in watts, and watts equal volts times amperes.">
      <Sym n="lamp" x={72} y={72} s={1.6} c="ga-w" />
      <Rays x={72} y={56} r1={22} r2={32} from={-155} to={-25} n={6} />
      <T x={136} y={58} c="ga-tm">power,</T>
      <T x={136} y={76} c="ga-tk ga-tb">in watts (W)</T>
      <T x={120} y={126} a="middle">{'watts = volts × amperes'}</T>
    </Art>
  ),

  hertz: () => (
    <Art label="One complete wave cycle drawn over a span marked one second: one cycle each second is one hertz.">
      <path d="M16 72H224" class="ga-w ga-thin" />
      <path d={wave(30, 210, 72, 180, 30)} class="ga-s" />
      <path d="M30 112H210M30 106V118M210 106V118" class="ga-k" />
      <T x={120} y={130} c="ga-tk" a="middle">1 second</T>
      <T x={120} y={20} c="ga-tk ga-tb" a="middle">1 cycle each second = 1 Hz</T>
    </Art>
  ),

  decibel: () => (
    <Art label="Three pairs of bars comparing power before and after. Twice the power is 3 dB, one quarter of the power is minus 6 dB, and ten times the power is 10 dB.">
      {[
        { y: 26, a: 30, b: 60, t: 'power × 2', d: '3 dB' },
        { y: 68, a: 60, b: 15, t: 'power ÷ 4', d: '−6 dB' },
        { y: 110, a: 12, b: 120, t: 'power × 10', d: '10 dB' },
      ].map((r) => (
        <g>
          <rect x="14" y={r.y - 12} width={r.a} height="9" rx="2" class="ga-fw" />
          <rect x="14" y={r.y + 2} width={r.b} height="9" rx="2" class="ga-fs" />
          <T x={152} y={r.y - 2} c="ga-tm">{r.t}</T>
          <T x={152} y={r.y + 14} c="ga-tk ga-tb">{r.d}</T>
        </g>
      ))}
    </Art>
  ),

  current: () => (
    <Art label="A length of wire with electrons moving along it, and an arrow for the flow: current, written I and measured in amperes.">
      <T x={120} y={26} c="ga-ts" a="middle">moving electrons</T>
      <path d="M14 42H226M14 78H226" class="ga-w" />
      {[40, 80, 120, 160, 200].map((x) => (
        <g>
          <circle cx={x} cy="60" r="8" class="ga-s" />
          <path d={`M${x - 3.5} 60h7`} class="ga-s ga-thin" />
        </g>
      ))}
      <Arrow x1={60} y1={98} x2={180} y2={98} c="ga-k ga-thick" h={10} />
      <T x={120} y={124} c="ga-tk ga-tb" a="middle">current (I), in amperes</T>
    </Art>
  ),

  electron: () => (
    <Art label="A large circle with a minus sign, an electron with its negative charge; beside it small electrons move along a wire, making a current.">
      <circle cx="60" cy="56" r="22" class="ga-k" />
      <path d="M50 56H70" class="ga-k ga-thick" />
      <T x={60} y={100} c="ga-tk ga-tb" a="middle">electron</T>
      <T x={60} y={118} c="ga-tm" a="middle">negative charge</T>
      <T x={178} y={32} c="ga-tm" a="middle">in a wire</T>
      <path d="M130 44H226M130 68H226" class="ga-w" />
      <Dots pts={row(146, 212, 22, 56)} r={4.5} />
      <Arrow x1={144} y1={86} x2={214} y2={86} />
      <T x={178} y={108} c="ga-ts" a="middle">current</T>
    </Art>
  ),

  voltage: () => (
    <Art label="A battery in a loop with a resistor. An arrow beside the battery marks voltage, the push; dots on the wire mark the current that flows as a result.">
      <path d="M36 40V28H204V40M204 100V108H36V100" class="ga-w" />
      <Sym n="batt" x={36} y={70} r={90} c="ga-w" />
      <Sym n="res" x={204} y={70} r={90} c="ga-w" />
      <Arrow x1={62} y1={94} x2={62} y2={46} c="ga-k ga-thick" h={10} />
      <T x={76} y={64} c="ga-tk ga-tb">voltage (E):</T>
      <T x={76} y={82} c="ga-tk">the push</T>
      <Dots pts={row(72, 180, 18, 108)} />
      <T x={120} y={130} c="ga-ts" a="middle">current: the flow that results</T>
    </Art>
  ),

  resistance: () => (
    <Art label="Two wires, each with a resistor. With low resistance many current dots get through; with high resistance only a few do.">
      <path d="M76 24H226M76 80H226" class="ga-w" />
      <Sym n="res" x={46} y={24} />
      <Sym n="res" x={46} y={80} />
      <Dots pts={row(92, 218, 14, 24)} />
      <Dots pts={[[110, 80], [190, 80]]} />
      <T x={16} y={48} c="ga-tk ga-tb">low resistance</T>
      <T x={224} y={48} c="ga-ts" a="end">more current</T>
      <T x={16} y={104} c="ga-tk ga-tb">high resistance</T>
      <T x={224} y={104} c="ga-ts" a="end">less current</T>
      <T x={120} y={130} c="ga-tm" a="middle">resistance (R) opposes current</T>
    </Art>
  ),

  impedance: () => (
    <Art label="A large AC wave meets a block marked Z, the impedance, and a smaller wave comes out: impedance opposes AC current and is measured in ohms.">
      <path d={wave(14, 84, 64, 35, 22)} class="ga-s" />
      <rect x="92" y="40" width="56" height="48" rx="6" class="ga-k" />
      <T x={120} y={69} c="ga-tl ga-tk" a="middle">Z</T>
      <path d={wave(156, 226, 64, 35, 8)} class="ga-s" />
      <T x={120} y={26} c="ga-tk ga-tb" a="middle">impedance</T>
      <T x={49} y={106} c="ga-ts" a="middle">AC current</T>
      <T x={191} y={106} c="ga-ts" a="middle">less flows</T>
      <T x={120} y={130} c="ga-tm" a="middle">opposes AC current, in ohms</T>
    </Art>
  ),

  power: () => (
    <Art label="Two lamps. The dim one uses energy slowly, a few watts; the bright one uses energy fast, more watts. Power is the rate at which energy is used.">
      <Sym n="lamp" x={62} y={70} s={1.3} c="ga-w" />
      <Sym n="lamp" x={178} y={70} s={1.3} c="ga-w" />
      <Rays x={62} y={56} r1={20} r2={26} from={-120} to={-60} n={3} c="ga-s ga-thin" />
      <Rays x={178} y={56} r1={20} r2={36} from={-160} to={-20} n={7} />
      <T x={62} y={96} c="ga-tm" a="middle">fewer watts</T>
      <T x={178} y={96} c="ga-tk ga-tb" a="middle">more watts</T>
      <T x={120} y={126} a="middle">power (P): how fast energy is used</T>
    </Art>
  ),

  energy: () => (
    <Art label="A battery and a lit lamp in a loop, with an arrow carrying energy from the battery to the lamp: the source supplies energy and the lamp uses it.">
      <Loop y0={52} y1={116} />
      <Rays x={75} y={42} r1={15} r2={24} from={-150} to={-30} n={5} />
      <Arrow x1={40} y1={100} x2={66} y2={66} c="ga-k ga-thick" h={10} />
      <T x={146} y={48} c="ga-tk ga-tb">energy</T>
      <T x={146} y={70} c="ga-tm">battery</T>
      <T x={146} y={85} c="ga-tm">supplies it,</T>
      <T x={146} y={105} c="ga-tm">lamp uses it</T>
    </Art>
  ),

  capacitance: () => (
    <Art label="Two facing plates, one positive and one negative, with arrows for the electric field between them: capacitance is the ability to store energy in an electric field, measured in farads.">
      <path d="M14 62H44M88 62H116" class="ga-w" />
      <path d="M44 26V98M88 26V98" class="ga-k ga-thick" />
      {[38, 54, 70, 86].map((y) => <Arrow x1={50} y1={y} x2={83} y2={y} c="ga-s ga-thin" h={6} />)}
      <T x={30} y={40} c="ga-tm" a="middle">+</T>
      <T x={102} y={40} c="ga-tm" a="middle">{'−'}</T>
      <T x={66} y={122} c="ga-ts" a="middle">electric field</T>
      <T x={130} y={42} c="ga-tk ga-tb">capacitance:</T>
      <T x={130} y={60} c="ga-tm">energy stored in</T>
      <T x={130} y={75} c="ga-tm">an electric field</T>
      <T x={130} y={98} c="ga-tk">in farads</T>
    </Art>
  ),

  inductance: () => (
    <Art label="A coil of wire with loops of magnetic field around it: inductance is the ability to store energy in a magnetic field, measured in henrys.">
      <ellipse cx="64" cy="62" rx="30" ry="20" class="ga-s ga-thin ga-dash" />
      <ellipse cx="64" cy="62" rx="46" ry="34" class="ga-s ga-thin ga-dash" />
      <Sym n="coil" x={64} y={66} s={1.5} />
      <T x={64} y={122} c="ga-ts" a="middle">magnetic field</T>
      <T x={130} y={42} c="ga-tk ga-tb">inductance:</T>
      <T x={130} y={60} c="ga-tm">energy stored in</T>
      <T x={130} y={75} c="ga-tm">a magnetic field</T>
      <T x={130} y={98} c="ga-tk">in henrys</T>
    </Art>
  ),

  cycle: () => (
    <Art label="A wave with its first complete cycle highlighted and bracketed: a swing one way, then the other way, and back to the start.">
      <path d="M14 60H226" class="ga-w ga-thin" />
      <path d={wave(120, 226, 60, 106, 24)} class="ga-w" />
      <path d={wave(14, 120, 60, 106, 24)} class="ga-k ga-thick" />
      <T x={40} y={24} c="ga-tm" a="middle">one way</T>
      <T x={94} y={100} c="ga-tm" a="middle">the other</T>
      <path d="M14 112H120M14 107V117M120 107V117" class="ga-k" />
      <T x={67} y={132} c="ga-tk ga-tb" a="middle">one cycle</T>
    </Art>
  ),

  'rf-current': () => (
    <Art label="Two waves on the same time scale: ordinary AC swinging slowly, and RF current, alternating current that swings at a much higher, radio frequency.">
      <path d={wave(14, 226, 30, 106, 13)} class="ga-w" />
      <T x={14} y={62} c="ga-tm">ordinary AC: low frequency</T>
      <path d={wave(14, 226, 90, 10, 13)} class="ga-k" />
      <T x={14} y={124} c="ga-tk ga-tb">RF current: radio frequency</T>
    </Art>
  ),

  conductor: () => (
    <Art label="A metal wire with current dots moving freely along it: a conductor lets current flow easily because it has many free electrons.">
      <T x={120} y={24} c="ga-tk ga-tb" a="middle">metal wire</T>
      <path d="M14 38H226M14 70H226" class="ga-k" />
      <Dots pts={row(28, 200, 22, 54)} r={4} />
      <Arrow x1={70} y1={88} x2={170} y2={88} />
      <Check x={50} y={110} />
      <T x={66} y={114} c="ga-ts">current flows easily</T>
      <T x={120} y={133} c="ga-tm" a="middle">many free electrons</T>
    </Art>
  ),

  insulator: () => (
    <Art label="A wire carrying current dots up to a block of glass, where they stop; nothing comes out the other side. An insulator lets almost no current flow.">
      <path d="M14 56H84M156 56H226" class="ga-w" />
      <rect x="84" y="30" width="72" height="52" rx="6" class="ga-k" />
      <path d="M96 70L120 42M112 72L144 40M130 72L146 54" class="ga-k ga-thin ga-soft" />
      <T x={120} y={24} c="ga-tk ga-tb" a="middle">glass</T>
      <Dots pts={row(24, 74, 16, 56)} r={4} />
      <Cross x={50} y={110} />
      <T x={66} y={114} c="ga-ts">almost no current flows</T>
    </Art>
  ),

  circuit: () => (
    <Art label="A battery and a lit lamp joined by wire in a closed loop, with arrows going all the way around: a circuit is a complete path that current can flow around.">
      <Loop y0={50} y1={114} />
      <Rays x={75} y={40} r1={15} r2={24} from={-150} to={-30} n={5} />
      <Arrow x1={110} y1={50} x2={122} y2={50} />
      <Arrow x1={130} y1={76} x2={130} y2={92} />
      <Arrow x1={96} y1={114} x2={58} y2={114} />
      <Arrow x1={20} y1={50} x2={34} y2={50} />
      <T x={146} y={62} c="ga-tk ga-tb">a complete</T>
      <T x={146} y={78} c="ga-tk ga-tb">path</T>
      <T x={146} y={100} c="ga-ts">current flows</T>
      <T x={146} y={115} c="ga-ts">all the way</T>
      <T x={146} y={130} c="ga-ts">around</T>
    </Art>
  ),

  'series-circuit': () => (
    <Art label="A battery and two resistors joined end to end in one loop, with evenly spaced current dots all the way around: one path, so the current is the same everywhere.">
      <path d="M24 38V34H55M115 34H125M185 34H216V106H24V98" class="ga-w" />
      <Sym n="batt" x={24} y={68} r={90} c="ga-w" />
      <Sym n="res" x={85} y={34} />
      <Sym n="res" x={155} y={34} />
      <Dots pts={[...row(48, 200, 19, 106), [216, 60], [216, 84]]} />
      <T x={124} y={68} c="ga-tk ga-tb" a="middle">end to end, one path</T>
      <T x={124} y={86} c="ga-ts" a="middle">same current through all</T>
    </Art>
  ),

  'parallel-circuit': () => (
    <Art label="A battery with two resistors connected side by side between the same top and bottom wires: each branch has the same voltage across it.">
      <path d="M30 40V34H190V40M110 34V40M110 100V106M190 100V106H30V100" class="ga-w" />
      <Sym n="batt" x={30} y={70} r={90} c="ga-w" />
      <Sym n="res" x={110} y={70} r={90} />
      <Sym n="res" x={190} y={70} r={90} />
      <Dots pts={[[110, 34], [110, 106]]} c="ga-fw" />
      <T x={120} y={20} c="ga-tk ga-tb" a="middle">side by side</T>
      <path d="M134 40V100M130 40H138M130 100H138" class="ga-s ga-thin" />
      <T x={142} y={74} c="ga-ts">same</T>
      <path d="M214 40V100M210 40H218M210 100H218" class="ga-s ga-thin" />
      <T x={120} y={128} c="ga-ts" a="middle">same voltage across every branch</T>
    </Art>
  ),

  'ohm-s-law': () => (
    <Triangle label="The Ohm's law triangle with E on top and I and R below, beside the three forms: E equals I times R, I equals E divided by R, R equals E divided by I."
      top="E" left="I" right="R"
      forms={['E = I × R', 'I = E ÷ R', 'R = E ÷ I']}
      legend="E = volts, I = amperes, R = ohms" />
  ),

  'power-formula': () => (
    <Triangle label="The power triangle with P on top and I and E below, beside the forms: P equals I times E, I equals P divided by E, E equals P divided by I."
      top="P" left="I" right="E"
      forms={['P = I × E', 'I = P ÷ E', 'E = P ÷ I']}
      legend="P = watts, I = amperes, E = volts" />
  ),

  /* ---------- T5B: prefixes and unit sizes ---------- */

  'metric-prefix': () => <Ladder />,
  giga: () => <Ladder hi="giga" />,
  mega: () => <Ladder hi="mega" />,
  kilo: () => <Ladder hi="kilo" />,
  milli: () => <Ladder hi="milli" />,
  micro: () => <Ladder hi="micro" />,
  pico: () => <Ladder hi="pico" />,

  kilovolt: () => (
    <Many label="One large tile, one kilovolt, equals a grid of many small tiles, 1000 volts."
      big="1 kilovolt" small="1000 volts" hi="big" note="kilo = one thousand" />
  ),
  microvolt: () => (
    <Many label="One large tile, one volt, equals a grid of many small tiles, one million microvolts: a microvolt is one one-millionth of a volt."
      big="1 volt" small="1,000,000 microvolts" hi="small" note="micro = one millionth" />
  ),
  milliampere: () => (
    <Many label="One large tile, one ampere, equals a grid of many small tiles, 1000 milliamperes. Example: 1.5 amperes is 1500 milliamperes."
      big="1 ampere" small="1000 milliamperes" hi="small" note="1.5 A = 1500 mA" />
  ),
  milliwatt: () => (
    <Many label="One large tile, one watt, equals a grid of many small tiles, 1000 milliwatts. Example: 500 milliwatts is 0.5 watts."
      big="1 watt" small="1000 milliwatts" hi="small" note="500 mW = 0.5 W" />
  ),
  microfarad: () => (
    <Many label="One large tile, one microfarad, equals a grid of many small tiles, one million picofarads. A microfarad is one millionth of a farad."
      big="1 microfarad" small="1,000,000 picofarads" hi="big" note="one millionth of a farad" />
  ),
  picofarad: () => (
    <Many label="One large tile, one microfarad, equals a grid of many small tiles, one million picofarads. A picofarad is one trillionth of a farad."
      big="1 microfarad" small="1,000,000 picofarads" hi="small" note="one trillionth of a farad" />
  ),
  khz: () => (
    <Many label="One large tile, one kilohertz, equals a grid of many small tiles, 1000 hertz. Example: 1,500,000 hertz is 1500 kilohertz."
      big="1 kHz" small="1000 Hz" hi="big" note="1,500,000 Hz = 1500 kHz" />
  ),
  ghz: () => (
    <Many label="One large tile, one gigahertz, equals a grid of many small tiles, 1000 megahertz. Example: 2425 megahertz is 2.425 gigahertz."
      big="1 GHz" small="1000 MHz" hi="big" note="2425 MHz = 2.425 GHz" />
  ),

  /* ---------- T6: components ---------- */

  component: () => (
    <Art label="Three schematic symbols in a row, each a single part of a circuit: a resistor, a capacitor and a transistor.">
      <T x={120} y={20} c="ga-tm" a="middle">single parts of a circuit</T>
      <Sym n="res" x={42} y={64} />
      <Sym n="cap" x={120} y={64} />
      <Sym n="bjt" x={196} y={64} s={0.9} />
      <T x={42} y={118} c="ga-tk" a="middle">resistor</T>
      <T x={120} y={118} c="ga-tk" a="middle">capacitor</T>
      <T x={198} y={118} c="ga-tk" a="middle">transistor</T>
    </Art>
  ),

  resistor: () => (
    <Pair label="The resistor schematic symbol, a zigzag line, beside a sketch of a real resistor: a small cylinder with colored bands and a wire lead at each end."
      sym="res" note="opposes the flow of current">
      <path d="M134 52H152M204 52H222" class="ga-w" />
      <rect x="152" y="41" width="52" height="22" rx="8" class="ga-w" />
      <path d="M164 42V62M174 41V63M184 41V63" class="ga-s" />
    </Pair>
  ),

  potentiometer: () => (
    <Pair label="The variable resistor symbol, a zigzag with an arrow touching it, beside a sketch of a knob with a turn arrow: turning the knob changes the resistance."
      sym="pot" sy={46} right="knob" note="turn it: the resistance changes">
      <circle cx="178" cy="58" r="20" class="ga-w" />
      <path d="M178 58L190 43" class="ga-w ga-thick" />
      <path d="M150 42a32 32 0 0 1 52 -4" class="ga-s" />
      <path d="M207 44l-9-3 7-6z" class="ga-s ga-fs" style="stroke-width:1.5" />
    </Pair>
  ),

  capacitor: () => (
    <Pair label="The capacitor schematic symbol, two facing plates with a gap, beside a sketch of the inside of the part: two conductive plates with an insulator between them."
      sym="cap" right="inside" note="two plates, insulator between">
      <path d="M134 52H160M196 52H222" class="ga-w" />
      <path d="M160 28V76M196 28V76" class="ga-w ga-thick" />
      <rect x="168" y="30" width="20" height="44" rx="2" class="ga-fs ga-soft" />
      <rect x="168" y="30" width="20" height="44" rx="2" class="ga-s ga-thin ga-dash" />
    </Pair>
  ),

  inductor: () => (
    <Pair label="The inductor schematic symbol, a row of loops, beside a sketch of a real coil of wire."
      sym="coil" right="coil of wire" note="stores energy in a magnetic field">
      <path d="M134 68H148M208 68H222" class="ga-w" />
      {[154, 166, 178, 190, 202].map((x) => <ellipse cx={x} cy="52" rx="7" ry="17" class="ga-w" />)}
    </Pair>
  ),

  'variable-inductor': () => (
    <Art label="The variable inductor schematic symbol: the loops of a coil with an arrow touching it, meaning the inductance can be adjusted.">
      <Sym n="varcoil" x={78} y={54} s={1.7} />
      <T x={150} y={48} c="ga-tm">coil loops</T>
      <T x={150} y={70} c="ga-tk ga-tb">+ arrow =</T>
      <T x={150} y={86} c="ga-tk ga-tb">adjustable</T>
      <T x={120} y={128} a="middle">the inductance can be changed</T>
    </Art>
  ),

  transformer: () => (
    <Art label="The transformer schematic symbol, two coils side by side, with a large 120 volt AC wave going in on one side and a smaller AC wave coming out on the other.">
      <Sym n="xfmr" x={120} y={64} s={1.7} />
      <path d={wave(12, 60, 64, 24, 22)} class="ga-s" />
      <path d={wave(180, 228, 64, 24, 8)} class="ga-s" />
      <T x={38} y={24} c="ga-ts" a="middle">120 V AC</T>
      <T x={202} y={24} c="ga-ts" a="middle">lower AC</T>
      <T x={120} y={128} c="ga-tm" a="middle">changes an AC voltage up or down</T>
    </Art>
  ),

  diode: () => (
    <Art label="The diode schematic symbol, a triangle pointing at a bar, with anode and cathode marked. Current passes in the direction the triangle points and is blocked the other way.">
      <Sym n="diode" x={120} y={46} s={1.8} />
      <T x={78} y={34} c="ga-tm" a="middle">anode</T>
      <T x={172} y={34} c="ga-tm" a="middle">cathode</T>
      <Arrow x1={24} y1={92} x2={96} y2={92} />
      <Check x={34} y={114} />
      <T x={48} y={118} c="ga-ts">passes</T>
      <Arrow x1={216} y1={92} x2={144} y2={92} c="ga-w" />
      <Cross x={180} y={92} r={7} />
      <T x={180} y={118} c="ga-tm" a="middle">blocked</T>
    </Art>
  ),

  anode: () => <DiodeEnds hi="anode" />,
  cathode: () => <DiodeEnds hi="cathode" />,

  led: () => (
    <Pair label="The LED schematic symbol, a diode with small arrows pointing away from it, beside a sketch of a real LED giving off light."
      sym="led" sy={58} note="forward current makes it light">
      <path d="M164 70V48a14 14 0 0 1 28 0V70M160 70H196M172 70V90M184 70V84" class="ga-w" />
      <Rays x={178} y={48} r1={20} r2={29} from={-160} to={-20} n={6} />
    </Pair>
  ),

  'forward-current': () => (
    <Art label="An LED symbol with an arrow running through it in the direction the triangle points: forward current, the direction in which a diode conducts, which makes an LED light.">
      <Sym n="led" x={120} y={58} s={1.8} c="ga-w" />
      <Arrow x1={70} y1={92} x2={170} y2={92} c="ga-k ga-thick" h={10} />
      <T x={120} y={114} c="ga-tk ga-tb" a="middle">forward current</T>
      <T x={120} y={131} c="ga-tm" a="middle">the way a diode conducts</T>
    </Art>
  ),

  'forward-voltage-drop': () => (
    <Art label="A conducting diode with a voltage bar on each side. The bar after the diode is slightly shorter than the bar before it: the difference is the forward voltage drop.">
      <path d="M14 82H226" class="ga-w" />
      <Sym n="diode" x={120} y={82} s={1.3} c="ga-w" />
      <rect x="30" y="30" width="16" height="44" rx="2" class="ga-fs" />
      <rect x="194" y="42" width="16" height="32" rx="2" class="ga-fs" />
      <path d="M50 30H214" class="ga-w ga-thin ga-dash" />
      <path d="M220 30V42M216 30H224M216 42H224" class="ga-k" />
      <T x={120} y={22} c="ga-tk ga-tb" a="middle">small voltage drop</T>
      <T x={38} y={104} c="ga-tm" a="middle">before</T>
      <T x={202} y={104} c="ga-tm" a="middle">after</T>
      <T x={120} y={130} c="ga-tm" a="middle">lost while the diode conducts</T>
    </Art>
  ),

  transistor: () => (
    <Art label="The transistor schematic symbol. A small signal arrow enters at the side lead and a much heavier arrow runs past the other two leads: a small signal controls a larger current.">
      <Sym n="bjt" x={120} y={66} s={1.7} />
      <Arrow x1={16} y1={66} x2={62} y2={66} c="ga-s ga-thin" h={6} />
      <T x={14} y={50} c="ga-ts">small signal</T>
      <Arrow x1={176} y1={28} x2={176} y2={106} c="ga-s ga-thick" h={11} />
      <T x={188} y={62} c="ga-ts">larger</T>
      <T x={188} y={78} c="ga-ts">current</T>
      <T x={14} y={90} c="ga-tm">controls</T>
    </Art>
  ),

  'bipolar-junction-transistor': () => (
    <Tri3 label="The bipolar junction transistor schematic symbol with its three electrodes named: base at the side, collector at the top and emitter, the lead with the arrow, at the bottom."
      sym="bjt" names={['base', 'collector', 'emitter']} hi="sym" />
  ),
  'emitter-base-and-collector': () => (
    <Tri3 label="A bipolar junction transistor symbol with the names of its three electrodes highlighted: base at the side, collector at the top and emitter, the lead with the arrow, at the bottom."
      sym="bjt" names={['base', 'collector', 'emitter']} hi="names" />
  ),
  fet: () => (
    <Tri3 label="A field-effect transistor schematic symbol with its three electrodes named: gate at the side, drain at the top and source at the bottom."
      sym="fet" names={['gate', 'drain', 'source']} hi="sym" />
  ),
  'gate-drain-and-source': () => (
    <Tri3 label="A field-effect transistor symbol with the names of its three electrodes highlighted: gate at the side, drain at the top and source at the bottom."
      sym="fet" names={['gate', 'drain', 'source']} hi="names" />
  ),

  electrode: () => (
    <Art label="A diode symbol and a transistor symbol with a dot on the end of every lead: the electrodes, two on a diode and three on a transistor.">
      <T x={120} y={20} c="ga-tk ga-tb" a="middle">electrodes: the terminals</T>
      <Sym n="diode" x={60} y={68} s={1.2} c="ga-w" />
      <Dots pts={[[24, 68], [96, 68]]} r={5} c="ga-fk" />
      <Sym n="bjt" x={176} y={68} s={1.1} c="ga-w" />
      <Dots pts={[[143, 68], [184.8, 39.4], [184.8, 96.6]]} r={5} c="ga-fk" />
      <T x={60} y={128} c="ga-tm" a="middle">diode: 2</T>
      <T x={176} y={128} c="ga-tm" a="middle">transistor: 3</T>
    </Art>
  ),

  amplifier: () => <Amp gain={false} />,
  gain: () => <Amp gain />,

  battery: () => (
    <Pair label="The battery schematic symbol, a stack of alternating long and short lines, beside a sketch of a real battery cell with plus and minus ends."
      sym="batt" note="a chemical reaction makes voltage">
      <rect x="146" y="38" width="60" height="28" rx="5" class="ga-w" />
      <rect x="206" y="46" width="6" height="12" rx="1.5" class="ga-w ga-fw" />
      <T x={196} y={56.5} c="ga-tm" a="middle">+</T>
      <T x={157} y={56.5} c="ga-tm" a="middle">{'−'}</T>
    </Pair>
  ),

  'carbon-zinc': () => (
    <Chem label="A battery cell labelled carbon-zinc beside a recharge symbol that is crossed out: this chemistry is not rechargeable."
      name="carbon-zinc" shape="cell" ok={false} />
  ),
  'lead-acid': () => (
    <Chem label="A car battery, a box with two posts, labelled lead-acid, beside a recharge symbol: this chemistry is rechargeable."
      name="lead-acid (car battery)" shape="car" ok />
  ),
  'lithium-ion': () => (
    <Chem label="A flat battery pack labelled lithium-ion beside a recharge symbol: this chemistry is rechargeable."
      name="lithium-ion" shape="pack" ok />
  ),
  'nickel-metal-hydride': () => (
    <Chem label="A battery cell labelled nickel-metal hydride beside a recharge symbol: this chemistry is rechargeable."
      name="nickel-metal hydride" shape="cell" ok />
  ),

  'rechargeable-battery': () => (
    <Art label="A charger pushing current back into a battery, shown by an arrow pointing into the cell, which fills up again so it can be used again.">
      <rect x="14" y="42" width="60" height="40" rx="6" class="ga-w" />
      <T x={44} y={66} c="ga-tm" a="middle">charger</T>
      <Arrow x1={78} y1={62} x2={112} y2={62} c="ga-s ga-thick" h={10} />
      <rect x="118" y="44" width="84" height="36" rx="6" class="ga-k" />
      <rect x="202" y="54" width="7" height="16" rx="2" class="ga-k ga-fk" />
      <rect x="125" y="51" width="16" height="22" rx="2" class="ga-fk" />
      <rect x="145" y="51" width="16" height="22" rx="2" class="ga-fk" />
      <rect x="165" y="51" width="16" height="22" rx="2" class="ga-fk ga-soft" />
      <T x={95} y={30} c="ga-ts" a="middle">current back in</T>
      <T x={160} y={102} c="ga-tk ga-tb" a="middle">refilled with energy</T>
      <T x={120} y={128} c="ga-tm" a="middle">then it can be used again</T>
    </Art>
  ),

  lamp: () => (
    <Pair label="The lamp schematic symbol from figure T-1, a small dome on the wire, beside a sketch of a light bulb giving off light."
      sym="lamp" sy={62} right="light bulb" note="gives off light when current flows">
      <circle cx="178" cy="46" r="16" class="ga-w" />
      <path d="M171 60V74H185V60M172 50l4-8 4 8 4-8" class="ga-w ga-thin" />
      <path d="M171 80H185" class="ga-w" />
      <Rays x={178} y={46} r1={21} r2={29} from={-200} to={20} n={8} />
    </Pair>
  ),

  meter: () => (
    <Art label="A hand-held meter with two test leads and a display reading 13.8 V: a meter shows an electrical quantity as a number.">
      <rect x="70" y="12" width="100" height="78" rx="8" class="ga-k" />
      <rect x="82" y="22" width="76" height="28" rx="4" class="ga-w ga-thin" />
      <T x={120} y={42} c="ga-tl ga-mono" a="middle">13.8 V</T>
      <circle cx="120" cy="70" r="10" class="ga-w" />
      <path d="M120 70L126 63" class="ga-w" />
      <path d="M98 90V96Q98 106 84 106H40M142 90V96Q142 106 156 106H200" class="ga-w" />
      <path d="M40 106H26M200 106H214" class="ga-s ga-thick" />
      <T x={120} y={130} c="ga-tm" a="middle">displays a value as a number</T>
    </Art>
  ),

  'integrated-circuit': () => (
    <Art label="A chip package with a row of pins along each side; inside it, faintly, a resistor, a diode and a transistor: many components combined in one package.">
      <T x={120} y={20} c="ga-tk ga-tb" a="middle">one package</T>
      {[82, 98, 114, 130, 146, 162].map((x) => <path d={`M${x} 30V40M${x} 98V108`} class="ga-w ga-thick" />)}
      <rect x="66" y="40" width="108" height="58" rx="5" class="ga-k" />
      <path d="M66 61a8 8 0 0 1 0 16" class="ga-k" />
      <Sym n="res" x={104} y={56} s={0.5} c="ga-w" />
      <Sym n="diode" x={146} y={56} s={0.5} c="ga-w" />
      <Sym n="bjt" x={124} y={80} s={0.4} c="ga-w" />
      <T x={120} y={130} c="ga-tm" a="middle">many components inside</T>
    </Art>
  ),

  switch: () => (
    <Art label="Two switch symbols. Open: the arm is lifted off its contact and no current flows. Closed: the arm joins the two contacts and current dots flow through.">
      <path d="M12 34H30M80 34H98" class="ga-w" />
      <Term x={34} y={34} c="ga-k" /><Term x={76} y={34} c="ga-k" />
      <path d="M38 32L70 16" class="ga-k" />
      <T x={112} y={30} c="ga-tk ga-tb">open:</T>
      <T x={112} y={46} c="ga-tm">no current</T>
      <path d="M12 98H30M80 98H98" class="ga-w" />
      <Term x={34} y={98} c="ga-k" /><Term x={76} y={98} c="ga-k" />
      <path d="M38 97H72" class="ga-k" />
      <Dots pts={[[18, 98], [55, 97], [92, 98]]} r={3.5} />
      <T x={112} y={94} c="ga-tk ga-tb">closed:</T>
      <T x={112} y={110} c="ga-ts">current flows</T>
    </Art>
  ),

  spst: () => (
    <Art label="The single-pole single-throw switch symbol as in figure T-2: one moving arm and one contact, a simple on-off switch for a single circuit.">
      <path d="M30 66H76M164 66H210" class="ga-w" />
      <Term x={80} y={66} c="ga-k" /><Term x={160} y={66} c="ga-k" />
      <path d="M84 64L152 40" class="ga-k" />
      <T x={120} y={22} c="ga-tk ga-tb" a="middle">single-pole single-throw</T>
      <T x={80} y={92} c="ga-tm" a="middle">1 arm</T>
      <T x={160} y={92} c="ga-tm" a="middle">1 contact</T>
      <T x={120} y={126} a="middle">on or off, for a single circuit</T>
    </Art>
  ),

  spdt: () => (
    <Art label="A single-pole double-throw switch symbol: one arm on the left that can connect to either of two contacts on the right, so a single circuit is switched between two others.">
      <path d="M20 68H62M164 44H220M164 92H220" class="ga-w" />
      <Term x={66} y={68} c="ga-k" /><Term x={160} y={44} c="ga-k" /><Term x={160} y={92} c="ga-k" />
      <path d="M70 66L152 46" class="ga-k" />
      <path d="M70 70L152 90" class="ga-k ga-thin ga-dash" />
      <T x={44} y={92} c="ga-tm" a="middle">1 circuit</T>
      <T x={222} y={72} c="ga-tm" a="end">2 others</T>
      <T x={120} y={20} c="ga-tk ga-tb" a="middle">single-pole double-throw</T>
      <T x={120} y={128} a="middle">one circuit to either of two</T>
    </Art>
  ),

  pole: () => (
    <Art label="Two switches. Single-pole: one arm, so one circuit is switched. Double-pole: two arms linked together, so two circuits are switched at once. The arms are highlighted.">
      <path d="M16 60H32M92 60H108" class="ga-w" />
      <Term x={36} y={60} /><Term x={88} y={60} />
      <path d="M40 58L82 42" class="ga-k ga-thick" />
      <T x={62} y={106} c="ga-tm" a="middle">single-pole</T>
      <T x={62} y={124} c="ga-tk ga-tb" a="middle">1 circuit</T>
      <path d="M132 40H148M208 40H224M132 78H148M208 78H224" class="ga-w" />
      <Term x={152} y={40} /><Term x={204} y={40} /><Term x={152} y={78} /><Term x={204} y={78} />
      <path d="M156 38L198 22M156 76L198 60" class="ga-k ga-thick" />
      <path d="M178 32V66" class="ga-w ga-thin ga-dash" />
      <T x={178} y={106} c="ga-tm" a="middle">double-pole</T>
      <T x={178} y={124} c="ga-tk ga-tb" a="middle">2 circuits</T>
    </Art>
  ),

  throw: () => (
    <Art label="Two switches. Single-throw: the arm has one contact it can connect to. Double-throw: the arm can connect to either of two contacts. The contacts are highlighted.">
      <path d="M16 60H32M92 60H108" class="ga-w" />
      <Term x={36} y={60} /><Term x={88} y={60} c="ga-k ga-thick" />
      <path d="M40 58L82 42" class="ga-w" />
      <T x={62} y={106} c="ga-tm" a="middle">single-throw</T>
      <T x={62} y={124} c="ga-tk ga-tb" a="middle">1 position</T>
      <path d="M132 60H148M208 40H224M208 80H224" class="ga-w" />
      <Term x={152} y={60} /><Term x={204} y={40} c="ga-k ga-thick" /><Term x={204} y={80} c="ga-k ga-thick" />
      <path d="M156 58L197 43" class="ga-w" />
      <T x={178} y={106} c="ga-tm" a="middle">double-throw</T>
      <T x={178} y={124} c="ga-tk ga-tb" a="middle">2 positions</T>
    </Art>
  ),

  relay: () => (
    <Art label="A relay: a coil on the left and a switch on the right joined by a dashed line. A small current through the coil moves the switch contacts, so it is an electrically controlled switch.">
      <path d="M18 38H56M18 110H56" class="ga-w" />
      <Sym n="coil" x={56} y={74} s={1.2} r={90} c="ga-w" />
      <Dots pts={[[24, 38], [40, 38]]} />
      <T x={14} y={24} c="ga-ts">small current in</T>
      <T x={30} y={78} c="ga-tm" a="middle">coil</T>
      <path d="M70 74H150" class="ga-w ga-thin ga-dash" />
      <path d="M112 90H136M204 90H226" class="ga-w" />
      <Term x={140} y={90} c="ga-k" /><Term x={200} y={90} c="ga-k" />
      <path d="M144 88L192 66" class="ga-k" />
      <T x={170} y={116} c="ga-tk ga-tb" a="middle">switch contacts</T>
      <T x={170} y={50} c="ga-tm" a="middle">moved by the coil</T>
    </Art>
  ),

  rectifier: () => (
    <Art label="An AC wave swinging both ways goes into a diode, and only the humps on one side come out: a rectifier changes alternating current into a varying direct current.">
      <path d="M14 66H80M160 66H226" class="ga-w ga-thin" />
      <path d={wave(14, 80, 66, 33, 22)} class="ga-s" />
      <Sym n="diode" x={120} y={66} />
      <path d={humps(160, 226, 66, 33, 22)} class="ga-s" />
      <T x={120} y={24} c="ga-tk ga-tb" a="middle">rectifier</T>
      <T x={47} y={112} c="ga-tm" a="middle">AC in</T>
      <T x={193} y={112} c="ga-tm" a="middle">varying DC</T>
      <T x={120} y={132} c="ga-tm" a="middle">one direction only</T>
    </Art>
  ),

  regulator: () => (
    <Art label="An uneven voltage line from a power supply enters a box marked regulator, and a level line comes out: the regulator controls the amount of voltage.">
      <path d={wave(14, 86, 58, 26, 9)} class="ga-s" />
      <rect x="92" y="38" width="56" height="48" rx="6" class="ga-k" />
      <path d="M154 62H226" class="ga-s ga-thick" />
      <T x={120} y={26} c="ga-tk ga-tb" a="middle">regulator</T>
      <T x={50} y={104} c="ga-tm" a="middle">from supply</T>
      <T x={190} y={104} c="ga-tm" a="middle">controlled</T>
      <T x={120} y={129} c="ga-tm" a="middle">controls the amount of voltage</T>
    </Art>
  ),

  'resonant-circuit': () => (
    <Art label="Two small circuits, each made of an inductor and a capacitor: on the left joined in series, on the right joined in parallel. Either one is a resonant circuit.">
      <T x={120} y={18} c="ga-tk ga-tb" a="middle">inductor + capacitor</T>
      <Sym n="coil" x={40} y={66} s={0.8} />
      <Sym n="cap" x={88} y={66} s={0.8} />
      <T x={64} y={124} c="ga-tm" a="middle">in series</T>
      <path d="M134 66H154M202 66H222M154 46V86M202 46V86" class="ga-w" />
      <Sym n="coil" x={178} y={46} s={0.8} />
      <Sym n="cap" x={178} y={86} s={0.8} />
      <T x={178} y={124} c="ga-tm" a="middle">in parallel</T>
    </Art>
  ),

  schematic: () => (
    <Art label="A small schematic: battery, resistor and lamp symbols joined by lines in a loop. A schematic uses standard symbols and shows how the components are connected.">
      <path d="M40 38V30H70M130 30H140M200 30H214V104H40V98" class="ga-w" />
      <Sym n="batt" x={40} y={68} r={90} />
      <Sym n="res" x={100} y={30} />
      <Sym n="lamp" x={170} y={30} />
      <T x={128} y={66} c="ga-tk ga-tb" a="middle">standard symbols</T>
      <T x={128} y={84} c="ga-tm" a="middle">lines = connections</T>
      <T x={120} y={130} c="ga-tm" a="middle">shows how the parts connect</T>
    </Art>
  ),

  'schematic-symbol': () => (
    <Art label="Four schematic symbols with their names: a zigzag for a resistor, two facing plates for a capacitor, loops for an inductor, and two coils side by side for a transformer.">
      <Sym n="res" x={64} y={28} />
      <T x={64} y={56} c="ga-tm" a="middle">resistor</T>
      <Sym n="cap" x={176} y={28} />
      <T x={176} y={56} c="ga-tm" a="middle">capacitor</T>
      <Sym n="coil" x={64} y={98} />
      <T x={64} y={126} c="ga-tm" a="middle">inductor</T>
      <Sym n="xfmr" x={176} y={90} s={0.8} />
      <T x={176} y={126} c="ga-tm" a="middle">transformer</T>
    </Art>
  ),

  semiconductor: () => (
    <Art label="Three blocks in order of how well they conduct: an insulator with almost no moving charge, a semiconductor in the middle with some, and a metal with a lot.">
      <rect x="14" y="38" width="64" height="46" rx="6" class="ga-w" />
      <rect x="88" y="38" width="64" height="46" rx="6" class="ga-k" />
      <rect x="162" y="38" width="64" height="46" rx="6" class="ga-w" />
      <Dots pts={[[46, 61]]} />
      <Dots pts={[[104, 52], [136, 52], [120, 61], [104, 70], [136, 70]]} />
      <Dots pts={[...row(174, 214, 13.3, 50), ...row(174, 214, 13.3, 61), ...row(174, 214, 13.3, 72)]} />
      <T x={120} y={26} c="ga-tk ga-tb" a="middle">semiconductor</T>
      <T x={46} y={102} c="ga-tm" a="middle">insulator</T>
      <T x={194} y={102} c="ga-tm" a="middle">metal</T>
      <Arrow x1={60} y1={116} x2={180} y2={116} c="ga-w ga-thin" h={6} />
      <T x={120} y={134} c="ga-tm" a="middle">conducts better</T>
    </Art>
  ),

  'shielded-wire': () => (
    <Art label="A cable cut back in steps to show its layers: an outer jacket, a conductive shield wrapped around the inside, and the inner conductor. Unwanted signals from outside are stopped by the shield.">
      <rect x="14" y="48" width="100" height="44" rx="4" class="ga-w" />
      <rect x="114" y="54" width="44" height="32" class="ga-k" />
      <path d="M118 86L134 54M130 86L146 54M142 86L158 54M118 54L134 86M130 54L146 86M142 54L158 86" class="ga-k ga-thin" />
      <rect x="158" y="61" width="30" height="18" class="ga-w ga-thin" />
      <path d="M188 70H226" class="ga-s ga-thick" />
      <T x={136} y={44} c="ga-tk ga-tb" a="middle">shield</T>
      <T x={226} y={100} c="ga-ts" a="end">inner conductor</T>
      <Arrow x1={30} y1={14} x2={42} y2={42} c="ga-w ga-thin" h={6} />
      <Arrow x1={56} y1={14} x2={68} y2={42} c="ga-w ga-thin" h={6} />
      <T x={78} y={22} c="ga-tm">unwanted signals</T>
      <T x={120} y={128} c="ga-tm" a="middle">the shield keeps them out</T>
    </Art>
  ),
};
