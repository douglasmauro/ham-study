import type { ComponentChildren, VNode } from 'preact';

/* Small drawings in the house style, all on a 240 x 160 canvas.
   Classes: cd-w wire, cd-t outline, cd-a signal path, cd-k the part being taught.
   Schematic symbols follow the official figures T-1, T-2 and T-3. */

function A({ children }: { children: ComponentChildren }): VNode {
  return <svg class="cd-art" viewBox="0 0 240 160" aria-hidden="true">{children}</svg>;
}

/** A sine wave path from x0 to x1. `period` may vary along the way for FM. */
function sine(x0: number, x1: number, y: number, amp: number, period: number | ((x: number) => number)): string {
  let d = '';
  let ph = 0;
  for (let x = x0; x <= x1; x += 1) {
    const p = typeof period === 'number' ? period : period(x);
    d += `${x === x0 ? 'M' : 'L'}${x} ${(y - amp * Math.sin(ph)).toFixed(1)}`;
    ph += (2 * Math.PI) / p;
  }
  return d;
}
const head = (x: number, y: number, dir: 'r' | 'l' | 'u' | 'd', s = 7) =>
  dir === 'r' ? `M${x} ${y}l${-s} ${-s * 0.7}M${x} ${y}l${-s} ${s * 0.7}`
  : dir === 'l' ? `M${x} ${y}l${s} ${-s * 0.7}M${x} ${y}l${s} ${s * 0.7}`
  : dir === 'u' ? `M${x} ${y}l${-s * 0.7} ${s}M${x} ${y}l${s * 0.7} ${s}`
  : `M${x} ${y}l${-s * 0.7} ${-s}M${x} ${y}l${s * 0.7} ${-s}`;
const ZIG = 'l8 -14l16 28l16 -28l16 28l16 -28l8 14'; // 80 wide resistor body

/* ---------- schematic symbols (T6) ---------- */
export const symResistor = () => <A><path class="cd-w" d="M30 80H80M160 80H210" /><path class="cd-k" d={`M80 80${ZIG}`} /></A>;
export const symCapacitor = () => <A><path class="cd-w" d="M30 80H112M128 80H210" /><path class="cd-k cd-th" d="M112 50V110" /><path class="cd-k cd-th" d="M136 50Q120 80 136 110" /></A>;
export const symBattery = () => <A><path class="cd-w" d="M120 16V56M120 104V144" /><path class="cd-k cd-th" d="M90 56H150M106 72H134M90 88H150M106 104H134" /></A>;
export const symLamp = () => <A><path class="cd-w" d="M30 112H98M142 112H210" /><path class="cd-k" d="M98 112V84a22 22 0 0 1 44 0V112M98 112H110M130 112H142M110 112V92a10 10 0 0 1 20 0V112" /></A>;
export const symTransistor = () => (
  <A>
    <path class="cd-w" d="M30 80H104M140 50V16M140 110V144" />
    <circle class="cd-k" cx="120" cy="80" r="36" />
    <path class="cd-k cd-th" d="M104 56V104" />
    <path class="cd-k" d="M104 70L140 50M104 90L140 110" />
    <path class="cd-fk cd-k" d="M140 110L126 109L132 97Z" />
  </A>
);
export const symDiode = () => <A><path class="cd-w" d="M30 80H100M138 80H210" /><path class="cd-fk cd-k" d="M100 58V102L138 80Z" /><path class="cd-k cd-th" d="M138 58V102" /></A>;
export const symLed = () => (
  <A>
    <path class="cd-w" d="M30 96H100M138 96H210" />
    <path class="cd-fk cd-k" d="M100 74V118L138 96Z" /><path class="cd-k cd-th" d="M138 74V118" />
    <path class="cd-a" d={`M124 62L140 42${head(140, 42, 'u', 6)}M144 68L160 48${head(160, 48, 'u', 6)}`} />
  </A>
);
export const symVarResistor = () => (
  <A>
    <path class="cd-w" d="M30 70H80M160 70H210M120 122H184V70" />
    <path class="cd-k" d={`M80 70${ZIG}`} />
    <path class="cd-k" d={`M120 122V90${head(120, 88, 'u', 8)}`} />
    <circle class="cd-fm" cx="184" cy="70" r="4" />
  </A>
);
export const symTransformer = () => (
  <A>
    <path class="cd-w" d="M46 40H96M46 120H96M144 40H194M144 120H194" />
    <path class="cd-k" d="M96 40a10 10 0 0 1 0 20a10 10 0 0 1 0 20a10 10 0 0 1 0 20a10 10 0 0 1 0 20" />
    <path class="cd-k" d="M144 40a10 10 0 0 0 0 20a10 10 0 0 0 0 20a10 10 0 0 0 0 20a10 10 0 0 0 0 20" />
    <path class="cd-k" d="M116 38V122M124 38V122" />
  </A>
);
export const symVarInductor = () => (
  <A>
    <path class="cd-w" d="M110 14V40M110 120V148M156 80V132H110" />
    <path class="cd-k" d="M110 40a10 10 0 0 0 0 20a10 10 0 0 0 0 20a10 10 0 0 0 0 20a10 10 0 0 0 0 20" />
    <path class="cd-k" d={`M156 80H118${head(116, 80, 'l', 8)}`} />
    <circle class="cd-fm" cx="110" cy="132" r="4" />
  </A>
);
export const symAntenna = () => <A><path class="cd-w" d="M120 146V74" /><path class="cd-k" d="M94 30H146L120 74ZM120 30V74" /></A>;
export const symSpst = () => (
  <A>
    <path class="cd-w" d="M30 84H92M148 84H210" />
    <circle class="cd-k" cx="98" cy="84" r="6" /><circle class="cd-k" cx="142" cy="84" r="6" />
    <path class="cd-k" d="M103 80L142 60" />
  </A>
);

/* ---------- antennas and feed lines (T9) ---------- */
export const antYagi = () => (
  <A>
    <path class="cd-w" d="M104 80V150" />
    <path class="cd-k" d="M44 80H186M52 36V124M118 50V110M150 54V106M182 58V102" />
    <path class="cd-a" d="M84 44V116" />
    <path class="cd-a" d={`M196 80H228${head(228, 80, 'r')}`} />
  </A>
);
export const antDipolePattern = () => (
  <A>
    <ellipse class="cd-a cd-d" cx="120" cy="44" rx="40" ry="30" />
    <ellipse class="cd-a cd-d" cx="120" cy="116" rx="40" ry="30" />
    <path class="cd-k cd-th" d="M40 80H114M126 80H200" />
    <circle class="cd-fm" cx="120" cy="80" r="4" />
    <path class="cd-a" d={`M120 62V26${head(120, 24, 'u')}M120 98V134${head(120, 136, 'd')}`} />
  </A>
);
export const antQuarterWave = () => (
  <A>
    <path class="cd-k cd-th" d="M100 24V104" />
    <path class="cd-w" d="M100 104L56 134M100 104L144 134M100 104V146" />
    <path class="cd-a cd-thin" d="M160 24V104M152 24H168M152 104H168" />
    <text x="174" y="62">19 in</text><text class="cd-tm" x="174" y="80">2 m band</text>
  </A>
);
export const antRubberDuck = () => (
  <A>
    <rect class="cd-w" x="92" y="64" width="56" height="88" rx="10" />
    <rect class="cd-w cd-thin" x="102" y="76" width="36" height="20" rx="4" />
    <path class="cd-w cd-thin" d="M104 110H136M104 122H136M104 134H136" />
    <path class="cd-k" stroke-width="8" d="M106 62V20" />
  </A>
);
export const antLoadingCoil = () => (
  <A>
    <path class="cd-w" d="M50 136H190M120 136V112" />
    <path class="cd-t" d="M120 14V64" />
    <path class="cd-k" d="M120 64c22 0 22 12 0 12c-22 0 -22 12 0 12c22 0 22 12 0 12c-22 0 -22 12 0 12" />
  </A>
);
export const antShorten = () => (
  <A>
    <path class="cd-k cd-th" d="M70 70H114M126 70H170" />
    <path class="cd-w cd-d" d="M30 70H62M178 70H210" />
    <circle class="cd-fm" cx="120" cy="70" r="4" />
    <path class="cd-w" d="M120 74V120" />
    <path class="cd-a" d={`M30 96H62${head(64, 96, 'r')}M210 96H178${head(176, 96, 'l')}`} />
    <text x="120" y="146" text-anchor="middle">cut shorter: frequency ?</text>
  </A>
);
export const antCoax = () => (
  <A>
    <rect class="cd-w cd-fr" x="16" y="56" width="84" height="48" rx="6" />
    <rect class="cd-w" x="100" y="60" width="44" height="40" />
    <path class="cd-w cd-thin" d="M104 60L120 100M116 60L132 100M128 60L144 100M120 60L104 100M132 60L116 100M144 60L128 100" />
    <rect class="cd-k cd-soft" x="144" y="66" width="40" height="28" />
    <path class="cd-a cd-th" d="M184 80H224" />
  </A>
);
export const antPl259 = () => (
  <A>
    <path class="cd-w" stroke-width="12" d="M14 80H62" />
    <rect class="cd-k" x="62" y="64" width="46" height="32" rx="3" />
    <rect class="cd-k" x="108" y="54" width="54" height="52" rx="4" />
    <path class="cd-k cd-thin" d="M118 54V106M128 54V106M138 54V106M148 54V106" />
    <rect class="cd-k" x="162" y="62" width="14" height="36" />
    <path class="cd-a cd-th" d="M176 80H206" />
  </A>
);
export const antTuner = () => (
  <A>
    <rect class="cd-w" x="10" y="64" width="56" height="40" rx="6" /><text x="38" y="89" text-anchor="middle">Radio</text>
    <path class="cd-a" d="M66 84H92M150 84H190V60" />
    <rect class="cd-k" x="92" y="56" width="58" height="56" rx="6" />
    <circle class="cd-k" cx="108" cy="84" r="8" /><circle class="cd-k" cx="134" cy="84" r="8" />
    <path class="cd-k cd-thin" d="M108 84L112 78M134 84L130 78" />
    <path class="cd-w" d="M172 22H208L190 60ZM190 22V60" />
    <text class="cd-tm" x="121" y="132" text-anchor="middle">50 Ω in, ? Ω out</text>
  </A>
);
export const antHorizontal = () => (
  <A>
    <path class="cd-w" d="M120 70V150" />
    <path class="cd-k cd-th" d="M40 70H114M126 70H200" />
    <circle class="cd-fm" cx="120" cy="70" r="4" />
    <path class="cd-a" d={`M60 38H180${head(182, 38, 'r')}${head(58, 38, 'l')}`} />
    <text class="cd-ta" x="120" y="28" text-anchor="middle">electric field</text>
  </A>
);

/* ---------- signals (T8) ---------- */
export const sigCw = () => (
  <A>
    <path class="cd-w cd-thin" d="M14 80H226" />
    {[[24, 40], [58, 110], [128, 144], [162, 214]].map(([a, b]) => <path class="cd-k" d={sine(a, b, 80, 30, 8)} />)}
  </A>
);
export const sigUsb = () => (
  <A>
    <path class="cd-w" d={`M20 126H222${head(222, 126, 'r')}`} />
    <path class="cd-w cd-d" d="M110 126V34" />
    <path class="cd-w cd-d cd-thin" d="M104 126V70L64 110V126" />
    <path class="cd-k cd-soft" d="M116 126V70L156 110V126Z" />
    <text class="cd-tm" x="110" y="26" text-anchor="middle">carrier</text>
    <text class="cd-tm" x="216" y="146" text-anchor="end">frequency</text>
  </A>
);
export const sigFm = () => (
  <A>
    <path class="cd-w cd-thin" d="M14 80H226" />
    <path class="cd-k" d={sine(16, 224, 80, 36, (x) => 14 - 9 * Math.sin((x - 16) / 33))} />
  </A>
);
export const sigLadder = () => (
  <A>
    <path class="cd-w cd-thin" d={`M20 140H222${head(222, 140, 'r')}`} />
    <rect class="cd-k cd-soft" x="117" y="22" width="6" height="26" rx="2" />
    <rect class="cd-k cd-soft" x="100" y="62" width="40" height="26" rx="4" />
    <rect class="cd-k cd-soft" x="34" y="102" width="172" height="26" rx="4" />
    <text class="cd-tm" x="20" y="40">A</text><text class="cd-tm" x="20" y="80">B</text><text class="cd-tm" x="20" y="120">C</text>
  </A>
);
const Sat = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect class="cd-k cd-fs" x={x - 10} y={y - 8} width="20" height="16" rx="3" />
    <path class="cd-k" d={`M${x - 10} ${y}h-8M${x + 10} ${y}h8`} />
    <rect class="cd-k cd-soft" x={x - 34} y={y - 6} width="16" height="12" /><rect class="cd-k cd-soft" x={x + 18} y={y - 6} width="16" height="12" />
  </g>
);
export const sigDoppler = () => (
  <A>
    <path class="cd-a" d="M166 24a40 40 0 0 1 0 44M176 16a56 56 0 0 1 0 60M186 8a72 72 0 0 1 0 76" />
    <path class="cd-a cd-d" d="M74 24a40 40 0 0 0 0 44M52 12a60 60 0 0 0 0 68M30 2a80 80 0 0 0 0 88" />
    <Sat x={120} y={46} />
    <path class="cd-t" d={`M96 78H140${head(142, 78, 'r')}`} />
    <path class="cd-w" d="M120 152V124M106 108H134L120 124Z" />
    <path class="cd-w" d="M60 152H180" />
  </A>
);
export const sigUv = () => (
  <A>
    <Sat x={176} y={30} />
    <path class="cd-w" d="M20 150H110M52 150V118M38 100H66L52 118Z" />
    <path class="cd-a" d={`M66 104L148 44${head(150, 42, 'r', 0)}`} /><path class="cd-a" d="M150 42l-11 1M150 42l-4 10" />
    <path class="cd-k" d="M176 52L92 126" /><path class="cd-k" d="M92 126l11 -2M92 126l3 -11" />
    <text class="cd-ta" x="70" y="62" text-anchor="middle">70 cm up</text>
    <text class="cd-tk" x="178" y="104" text-anchor="middle">2 m down</text>
  </A>
);
export const sigLeo = () => (
  <A>
    <circle class="cd-w cd-fr" cx="120" cy="82" r="40" />
    <path class="cd-w cd-thin" d="M84 70Q120 86 156 70M82 92Q120 108 158 92" />
    <circle class="cd-k cd-d" cx="120" cy="82" r="58" />
    <rect class="cd-fk" x="155" y="30" width="14" height="10" rx="2" transform="rotate(40 162 35)" />
    <path class="cd-a" d="M174 48A60 60 0 0 1 180 86" /><path class="cd-a" d={head(180, 88, 'd', 6)} />
  </A>
);
export const sigSpin = () => (
  <A>
    <rect class="cd-k cd-fs" x="104" y="26" width="32" height="32" rx="4" />
    <path class="cd-k" d="M104 30L84 14M136 30L156 14M104 54L84 70M136 54L156 70" />
    <path class="cd-a" d="M150 42a30 14 0 1 1 -8 -10" /><path class="cd-a" d="M142 32l-2 -10M142 32l-10 3" />
    <path class="cd-w cd-thin" d="M14 124H226" />
    <path class="cd-a" d={(() => { let d = ''; for (let x = 16; x <= 224; x++) d += `${x === 16 ? 'M' : 'L'}${x} ${(124 - (6 + 16 * Math.abs(Math.sin((x - 16) / 33))) * Math.sin(x / 1.6)).toFixed(1)}`; return d; })()} stroke-width="1.5" />
  </A>
);
export const sigGrid = () => (
  <A>
    <rect class="cd-w" x="24" y="20" width="192" height="120" rx="4" />
    <path class="cd-w cd-thin" d="M88 20V140M152 20V140M24 80H216" />
    <rect class="cd-k cd-soft" x="88" y="80" width="64" height="60" />
    <text class="cd-tm" x="56" y="55" text-anchor="middle">CN78</text><text class="cd-tm" x="120" y="55" text-anchor="middle">CN88</text><text class="cd-tm" x="184" y="55" text-anchor="middle">CN98</text>
    <text class="cd-tm" x="56" y="115" text-anchor="middle">CN77</text><text class="cd-tk" x="120" y="115" text-anchor="middle">CN87</text><text class="cd-tm" x="184" y="115" text-anchor="middle">CN97</text>
  </A>
);
export const sigRdf = () => (
  <A>
    <g transform="rotate(-24 70 110)">
      <path class="cd-k" d="M34 110H120M44 86V134M70 92V128M96 96V124M118 100V120" />
    </g>
    <path class="cd-w" d="M62 114V152" />
    <path class="cd-a cd-d" d="M128 84L176 62" />
    <path class="cd-a" d="M184 76a18 18 0 0 1 -12 -28M176 88a32 32 0 0 1 -20 -46" />
    <circle class="cd-t" cx="204" cy="46" r="16" /><text x="204" y="51" text-anchor="middle">?</text>
  </A>
);

/* ---------- meters and test gear (T7) ---------- */
function Gauge({ frac, ticks, name }: { frac: number; ticks: string[]; name: string }) {
  const cx = 120, cy = 124, r = 78;
  const pt = (f: number, rr: number) => {
    const a = Math.PI * (1 - (0.14 + 0.72 * f));
    return [cx + rr * Math.cos(a), cy - rr * Math.sin(a)];
  };
  const [a0x, a0y] = pt(0, r), [a1x, a1y] = pt(1, r), [nx, ny] = pt(frac, r - 8);
  return (
    <g>
      <rect class="cd-w" x="24" y="14" width="192" height="132" rx="12" />
      <path class="cd-w" d={`M${a0x.toFixed(1)} ${a0y.toFixed(1)}A${r} ${r} 0 0 1 ${a1x.toFixed(1)} ${a1y.toFixed(1)}`} />
      {ticks.map((t, i) => {
        const f = i / (ticks.length - 1);
        const [x1, y1] = pt(f, r), [x2, y2] = pt(f, r - 8), [tx, ty] = pt(f, r + 13);
        return <g><path class="cd-w cd-thin" d={`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`} /><text class="cd-tm" x={tx.toFixed(1)} y={(ty + 4).toFixed(1)} text-anchor="middle">{t}</text></g>;
      })}
      <path class="cd-k cd-th" d={`M${cx} ${cy}L${nx.toFixed(1)} ${ny.toFixed(1)}`} />
      <circle class="cd-fk" cx={cx} cy={cy} r="6" />
      <text x="120" y="98" text-anchor="middle">{name}</text>
    </g>
  );
}
const SWR_TICKS = ['1', '2', '3', '4', '5', '∞'];
export const tstSwr1 = () => <A><Gauge frac={0} ticks={SWR_TICKS} name="SWR" /></A>;
export const tstSwr4 = () => <A><Gauge frac={0.6} ticks={SWR_TICKS} name="SWR" /></A>;
const MeterDot = ({ x, y, l }: { x: number; y: number; l: string }) => (
  <g><circle class="cd-k cd-fs" cx={x} cy={y} r="17" /><text class="cd-tk" x={x} y={y + 5} text-anchor="middle" style={{ fontSize: '16px' }}>{l}</text></g>
);
export const tstVoltmeter = () => (
  <A>
    <path class="cd-w" d="M40 96V60H80M160 60H200V130H40V112" />
    <path class="cd-w cd-th" d="M26 96H54M32 112H48" />
    <path class="cd-w" d={`M80 60${ZIG}`} />
    <path class="cd-k" d="M72 60V22H103M137 22H168V60" />
    <circle class="cd-fk" cx="72" cy="60" r="4" /><circle class="cd-fk" cx="168" cy="60" r="4" />
    <MeterDot x={120} y={22} l="V" />
  </A>
);
export const tstAmmeter = () => (
  <A>
    <path class="cd-w" d="M40 96V50H70M150 50H173M207 50H214V130H40V112" />
    <path class="cd-w cd-th" d="M26 96H54M32 112H48" />
    <path class="cd-w" d={`M70 50${ZIG}`} />
    <MeterDot x={190} y={50} l="A" />
    <path class="cd-a cd-flow" d="M70 130H190" />
  </A>
);
export const tstDummy = () => (
  <A>
    <path class="cd-a cd-th" d="M14 90H56" />
    <rect class="cd-k" x="56" y="58" width="130" height="64" rx="8" />
    <path class="cd-k" d="M72 58V30M92 58V30M112 58V30M132 58V30M152 58V30M172 58V30" />
    <path class="cd-w" d="M70 90H86l5 -10l10 20l10 -20l10 20l10 -20l10 20l5 -10H172" />
    <text class="cd-tm" x="121" y="144" text-anchor="middle">50 Ω, no antenna</text>
  </A>
);
export const tstColdJoint = () => (
  <A>
    <path class="cd-w" d="M16 120H224" /><path class="cd-w cd-thin" d="M16 132H224" />
    <path class="cd-w" d="M70 120V40M170 120V40" />
    <path class="cd-t cd-fr" d="M44 120Q62 112 66 76H74Q78 112 96 120Z" />
    <path class="cd-k cd-fr" d="M142 120q-8 -10 4 -16q-8 -12 8 -16q-2 -14 14 -12q14 -4 14 10q14 6 4 18q10 8 2 16Z" />
    <text class="cd-tm" x="70" y="150" text-anchor="middle">A</text><text class="cd-tm" x="170" y="150" text-anchor="middle">B</text>
  </A>
);
export const tstOhmCap = () => (
  <A>
    <rect class="cd-w" x="20" y="16" width="120" height="96" rx="10" />
    <path class="cd-w" d="M40 84A44 44 0 0 1 120 84" />
    <path class="cd-k cd-th" d="M80 96L56 60" />
    <path class="cd-a" d="M70 46A34 34 0 0 1 104 56" /><path class="cd-a" d={head(105, 58, 'd', 6)} />
    <text x="80" y="108" text-anchor="middle">Ω</text>
    <path class="cd-w" d="M50 112V140H176M110 112V126H176" />
    <path class="cd-t cd-th" d="M176 118V148" /><path class="cd-t cd-th" d="M190 118Q180 133 190 148" />
    <text class="cd-tm" x="196" y="100" text-anchor="middle">big, empty</text>
  </A>
);
export const tstCoaxWater = () => (
  <A>
    <circle class="cd-a" cx="196" cy="34" r="12" />
    <path class="cd-a" d="M196 12V6M196 62V56M174 34H168M224 34H218M180 18L176 14M212 18L216 14M180 50L176 54M212 50L216 54" />
    <path class="cd-w cd-fr" d="M12 86H228V118H12Z" />
    <path class="cd-k" d="M96 86l8 12l-10 8l10 12M120 86l-6 10l10 10l-8 12" />
    <path class="cd-fk" d="M92 132q8 12 0 18q-8 -6 0 -18ZM124 130q8 12 0 18q-8 -6 0 -18Z" />
  </A>
);
export const tstFeedHeat = () => (
  <A>
    <rect class="cd-w" x="10" y="92" width="50" height="40" rx="6" /><text x="35" y="117" text-anchor="middle">TX</text>
    <path class="cd-k cd-th" d="M60 112H200V70" />
    <path class="cd-w" d="M182 30H218L200 70ZM200 30V70" />
    <path class="cd-a" d="M86 96q8 -10 0 -20q-8 -10 0 -20M120 96q8 -10 0 -20q-8 -10 0 -20M154 96q8 -10 0 -20q-8 -10 0 -20" />
  </A>
);
export const tstAnalyzer = () => (
  <A>
    <rect class="cd-k" x="40" y="26" width="110" height="120" rx="10" />
    <rect class="cd-w cd-fr" x="52" y="38" width="86" height="60" rx="4" />
    <path class="cd-a" d="M58 48C80 50 88 90 95 90C102 90 110 50 132 48" />
    <circle class="cd-w" cx="70" cy="122" r="8" /><circle class="cd-w" cx="120" cy="122" r="8" />
    <path class="cd-w" d="M150 60H196V52M178 14H214L196 52ZM196 14V52" />
  </A>
);

/* ---------- small pictures for true or false ---------- */
export const dial = (freq: string, mode: string) => () => (
  <A>
    <rect class="cd-w cd-fr" x="20" y="28" width="200" height="104" rx="12" />
    <rect class="cd-w cd-thin" x="34" y="42" width="172" height="52" rx="6" />
    <text class="cd-big" x="120" y="76" text-anchor="middle">{freq}</text>
    <text class="cd-tk" x="36" y="118">{mode}</text><text class="cd-tm" x="204" y="118" text-anchor="end">MHz</text>
  </A>
);
export const picClock10 = () => (
  <A>
    <circle class="cd-w" cx="120" cy="80" r="58" />
    <path class="cd-k cd-soft" d="M120 80V22A58 58 0 0 1 170.2 51Z" />
    <path class="cd-t" d="M120 80V34" /><path class="cd-a" d="M120 80L158 58" />
    <text class="cd-tk" x="176" y="30">10 min</text>
  </A>
);
export const picWavePair = () => (
  <A>
    <path class="cd-k" d={sine(20, 220, 30, 18, 20)} /><path class="cd-a" d={sine(20, 220, 112, 18, 66)} />
    <text class="cd-tk" x="120" y="68" text-anchor="middle">high frequency</text><text class="cd-ta" x="120" y="150" text-anchor="middle">low frequency</text>
  </A>
);
export const picFields = () => (
  <A>
    <path class="cd-k" d={`M90 120V32${head(90, 30, 'u')}`} />
    <path class="cd-a" d={`M90 120H196${head(198, 120, 'r')}`} />
    <path class="cd-w cd-thin" d="M90 104H106V120" />
    <text class="cd-tk" x="102" y="40">electric field</text><text class="cd-ta" x="150" y="144" text-anchor="middle">magnetic field</text>
  </A>
);
export const picCrossPol = () => (
  <A>
    <path class="cd-k cd-th" d="M50 30V110" /><path class="cd-w" d="M50 110V146M30 146H70" />
    <path class="cd-k cd-th" d="M160 60H220" /><path class="cd-w" d="M190 60V146M170 146H210" />
    <path class="cd-a cd-d" d="M66 66H150" />
    <text class="cd-tm" x="50" y="20" text-anchor="middle">vertical</text><text class="cd-tm" x="190" y="48" text-anchor="middle">horizontal</text>
  </A>
);
export const picSkip = () => (
  <A>
    <path class="cd-w" d="M10 150Q120 110 230 150" />
    <path class="cd-k cd-d" d="M10 50Q120 18 230 50" /><path class="cd-k cd-d cd-thin" d="M10 64Q120 32 230 64" />
    <path class="cd-a" d="M40 136L120 42L200 136" />
    <text class="cd-tk" x="120" y="16" text-anchor="middle">ionosphere</text>
  </A>
);
export const picRain = () => (
  <A>
    <path class="cd-w cd-fr" d="M70 70a22 22 0 0 1 8 -42a30 30 0 0 1 56 -4a24 24 0 0 1 30 46Z" />
    <path class="cd-k" d="M84 86l-8 16M112 86l-8 16M140 86l-8 16M98 112l-8 16M126 112l-8 16M154 112l-8 16" />
    <path class="cd-a" d={sine(14, 226, 146, 6, 20)} />
  </A>
);
export const picHorizon = () => (
  <A>
    <path class="cd-w cd-fr" d="M0 160Q120 60 240 160Z" />
    <path class="cd-w" d="M44 126V84M34 70H54L44 84Z" />
    <path class="cd-t cd-d" d="M44 80L150 98" /><path class="cd-a" d="M44 76Q130 70 196 122" />
    <text class="cd-tm" x="112" y="60">radio</text><text class="cd-tm" x="70" y="112">sight</text>
  </A>
);
export const picDuct = () => (
  <A>
    <path class="cd-w" d="M10 150Q120 120 230 150" />
    <path class="cd-k cd-d" d="M10 74Q120 50 230 74" />
    <path class="cd-a" d="M30 136Q60 70 90 72Q120 74 150 72Q180 70 210 136" />
    <text class="cd-tk" x="120" y="44" text-anchor="middle">warm air over cool air</text>
  </A>
);
export const picSeries = () => (
  <A>
    <path class="cd-w" d="M30 96V40H50M110 40H130M190 40H214V130H30V112" />
    <path class="cd-w cd-th" d="M16 96H44M22 112H38" />
    <path class="cd-k" d="M50 40l6 -10l12 20l12 -20l12 20l12 -20l6 10M130 40l6 -10l12 20l12 -20l12 20l12 -20l6 10" />
    <path class="cd-a cd-flow" d="M60 130H200" />
  </A>
);
export const picParallel = () => (
  <A>
    <path class="cd-w" d="M30 72V24H190V40M30 88V140H190V120M120 24V40M120 120V140" />
    <path class="cd-w cd-th" d="M16 72H44M22 88H38" />
    <path class="cd-k" d="M120 40l-10 6l20 12l-20 12l20 12l-20 12l20 12l-10 6M190 40l-10 6l20 12l-20 12l20 12l-20 12l20 12l-10 6" />
  </A>
);
export const picDb = () => (
  <A>
    <path class="cd-w" d="M20 140H220" />
    <rect class="cd-w cd-fr" x="56" y="90" width="44" height="50" /><rect class="cd-k cd-soft" x="140" y="40" width="44" height="100" />
    <text x="78" y="82" text-anchor="middle">5 W</text><text x="162" y="32" text-anchor="middle">10 W</text>
  </A>
);
export const picFuse = () => (
  <A>
    <path class="cd-w" d="M14 50H60M180 50H226M14 116H60M180 116H226" />
    <rect class="cd-w" x="60" y="34" width="120" height="32" rx="6" /><path class="cd-w cd-thin" d="M76 50H106M134 50H164" />
    <path class="cd-b" d="M108 44l8 12M116 44l-8 12" />
    <rect class="cd-k" x="60" y="100" width="120" height="32" rx="6" /><path class="cd-k cd-thin" d="M76 116H164" />
    <text x="120" y="24" text-anchor="middle">5 A, blown</text><text x="120" y="152" text-anchor="middle">20 A ?</text>
  </A>
);
export const picTower = () => (
  <A>
    <path class="cd-w" d="M10 150H230" />
    <path class="cd-w" d="M104 150L114 14H126L136 150M108 110L132 80M110 80L130 50M112 50L128 24M132 110L108 80M130 80L110 50" />
    <circle class="cd-k" cx="150" cy="62" r="7" /><path class="cd-k" d="M150 69V96M150 76L132 70M150 78L134 86M150 96L140 114M150 96L134 104" />
    <text class="cd-tm" x="196" y="90" text-anchor="middle">alone</text>
  </A>
);
export const picPole = () => (
  <A>
    <path class="cd-w" d="M10 150H230" />
    <path class="cd-w cd-th" d="M120 150V20" /><path class="cd-w" d="M84 34H156" />
    <path class="cd-b" d="M0 44Q44 56 88 34M240 44Q196 56 152 34" />
    <path class="cd-k" d="M120 84H170V40M152 40H188M158 52H182" />
  </A>
);
export const picCable = () => (
  <A>
    <path class="cd-w" stroke-width="20" d="M14 80H90" />
    <path class="cd-k cd-th" d="M90 72C130 72 130 36 170 36H226" />
    <path class="cd-w cd-th" d="M90 80H226" /><path class="cd-w cd-th" d="M90 88C130 88 130 124 170 124H226" />
    <text class="cd-tk" x="198" y="26" text-anchor="middle">black</text><text class="cd-tm" x="198" y="70" text-anchor="middle">white</text><text class="cd-tm" x="198" y="146" text-anchor="middle">green</text>
  </A>
);
export const picPsu = () => (
  <A>
    <rect class="cd-w" x="30" y="30" width="180" height="100" rx="10" />
    <path class="cd-w cd-d" d="M30 60H210" /><text class="cd-tm" x="120" y="50" text-anchor="middle">power supply: OFF</text>
    <path class="cd-k cd-th" d="M96 80H144" /><path class="cd-k cd-th" d="M96 96Q120 86 144 96" />
    <path class="cd-w" d="M120 66V80M120 91V118" />
    <path class="cd-a" d="M160 84l10 -8l-4 12l10 -6" />
  </A>
);
export const picBurn = () => (
  <A>
    <path class="cd-k cd-th" d="M80 20V110" /><path class="cd-w" d="M80 110L46 136M80 110L114 136M80 110V146" />
    <path class="cd-a" d="M98 40a30 30 0 0 1 0 40M110 30a46 46 0 0 1 0 60M62 40a30 30 0 0 0 0 40M50 30a46 46 0 0 0 0 60" />
    <rect class="cd-w" x="150" y="96" width="76" height="40" rx="6" /><text x="188" y="121" text-anchor="middle">TX on</text>
    <path class="cd-w" d="M150 116H120V136" />
  </A>
);
export const picDuty = () => (
  <A>
    <path class="cd-w cd-thin" d="M16 66H224M16 136H224" />
    <path class="cd-k" d="M20 66V30H220V66" /><text x="120" y="22" text-anchor="middle">on 100% of the time</text>
    <path class="cd-a" d="M20 136V100H70V136H120V100H170V136H220" /><text x="120" y="156" text-anchor="middle">on 50% of the time</text>
  </A>
);
export const picDna = () => (
  <A>
    <path class="cd-k" d={sine(60, 180, 100, 26, 60)} /><path class="cd-w" d={sine(60, 180, 100, -26, 60)} />
    <path class="cd-w cd-thin" d="M75 78V122M90 76V124M105 86V114M135 86V114M150 76V124M165 78V122" />
    <path class="cd-a" d={sine(20, 110, 34, 8, 18)} /><text class="cd-ta" x="150" y="38">radio wave</text>
  </A>
);
