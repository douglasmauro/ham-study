import type { AntennaPic, DecibelPic, Letter, PrefixPic, RatioPic, Rung, WavePic, Worked } from './types';

/* House style: flat, 2 to 3 px strokes, rounded caps. Outlines in --muted / --text,
   the movement or signal in --accent, the part being taught in the topic color. */
const MUTED = 'var(--muted)';
const TEXT = 'var(--text)';
const TEXT2 = 'var(--text-2)';
const ACCENT = 'var(--accent)';
const LINE = 'var(--line-strong)';
const SURFACE = 'var(--surface)';
const W = 280; // viewBox width; drawn close to 1:1 on a 390 px phone

const ABBR: Record<string, string> = { volts: 'V', amperes: 'A', ohms: 'ohms', watts: 'W' };
const UNIT: Record<Letter, string> = { E: 'volts', I: 'amperes', R: 'ohms', P: 'watts' };
const WORD: Record<Letter, string> = { E: 'voltage', I: 'current', R: 'resistance', P: 'power' };

function Arrowhead({ x, y, dir, color }: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right'; color: string }) {
  const s = 6;
  const d = {
    right: `M${x - s} ${y - s}L${x} ${y}L${x - s} ${y + s}`,
    left: `M${x + s} ${y - s}L${x} ${y}L${x + s} ${y + s}`,
    down: `M${x - s} ${y - s}L${x} ${y}L${x + s} ${y - s}`,
    up: `M${x - s} ${y + s}L${x} ${y}L${x + s} ${y + s}`,
  }[dir];
  return <path d={d} fill="none" stroke={color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />;
}

/* ---------- Ohm's law and power triangles (T5C08-T5C11, T5D01-T5D12, T4A01) ---------- */
function Triangle({ w, color }: { w: Worked; color: string }) {
  const ohm = w.family === 'ohm';
  const [top, left, right]: Letter[] = ohm ? ['E', 'I', 'R'] : ['P', 'I', 'E'];
  const want = w.want as Letter;
  const val = (l: Letter) => {
    if (l === want) return '?';
    const g = w.given.find((x) => x.sym === l);
    return g ? `${g.value} ${ABBR[g.unit] ?? g.unit}` : UNIT[l];
  };
  // apex (140,12), base (36,160)-(244,160), divider at y=92
  const cells: Record<string, string> = {
    [top]: 'M140 12L83.8 92H196.2Z',
    [left]: 'M83.8 92L36 160H140V92Z',
    [right]: 'M196.2 92L244 160H140V92Z',
  };
  const pos: Record<string, [number, number]> = { [top]: [140, 66], [left]: [100, 128], [right]: [180, 128] };
  const multiply = want === top;
  const other = want === left ? right : left;
  const caption = multiply
    ? `Cover ${want} (${WORD[want]}). ${left} and ${right} are left side by side, so multiply: ${want} = ${left} × ${right}.`
    : `Cover ${want} (${WORD[want]}). ${top} is left on top of ${other}, so divide: ${want} = ${top} / ${other}.`;
  return (
    <>
      <svg viewBox={`0 0 ${W} 176`} role="img" aria-label={`${ohm ? "Ohm's law" : 'Power'} triangle: ${top} on top, ${left} and ${right} below. ${caption}`}>
        <path d={cells[want]} fill={color} fill-opacity="0.28" />
        <path d="M140 12L36 160H244Z" fill="none" stroke={MUTED} stroke-width="2.5" stroke-linejoin="round" />
        <path d="M83.8 92H196.2" stroke={multiply ? MUTED : ACCENT} stroke-width={multiply ? 2.5 : 3.5} stroke-linecap="round" />
        <path d="M140 92V160" stroke={multiply ? ACCENT : MUTED} stroke-width={multiply ? 3.5 : 2.5} stroke-linecap="round" />
        <path d={cells[want]} fill="none" stroke={color} stroke-width="3" stroke-linejoin="round" stroke-dasharray="7 6" />
        {[top, left, right].map((l) => (
          <g>
            <text x={pos[l][0]} y={pos[l][1]} text-anchor="middle" font-size="30" font-weight="700" fill={l === want ? color : TEXT} style={{ fontFamily: 'var(--display)' }}>{l}</text>
            <text x={pos[l][0]} y={pos[l][1] + 19} text-anchor="middle" font-size="13" font-weight="600" fill={l === want ? color : TEXT2}>{val(l)}</text>
          </g>
        ))}
        <text x="4" y="70" font-size="13" fill={multiply ? MUTED : ACCENT} font-weight="600">divide</text>
        <path d="M46 74L76 88" stroke={multiply ? MUTED : ACCENT} stroke-width="2" stroke-linecap="round" />
        <text x={W - 4} y="118" text-anchor="end" font-size="13" fill={multiply ? ACCENT : MUTED} font-weight="600">multiply</text>
        <text x="140" y="174" text-anchor="middle" font-size="13" fill={MUTED}>dashed = the letter you cover</text>
      </svg>
      <p class="wk-caption">{caption}</p>
    </>
  );
}

/* ---------- Metric prefix ladder (T5B01-T5B08, T5B12, T5B13) ---------- */
const RUNGS: { id: Rung; sym: string; means: string; exp: number }[] = [
  { id: 'giga', sym: 'G', means: 'billion', exp: 9 },
  { id: 'mega', sym: 'M', means: 'million', exp: 6 },
  { id: 'kilo', sym: 'k', means: 'thousand', exp: 3 },
  { id: 'base', sym: '', means: 'one', exp: 0 },
  { id: 'milli', sym: 'm', means: 'thousandth', exp: -3 },
  { id: 'micro', sym: 'µ', means: 'millionth', exp: -6 },
  { id: 'nano', sym: 'n', means: 'billionth', exp: -9 },
  { id: 'pico', sym: 'p', means: 'trillionth', exp: -12 },
];

/** Digits and decimal-point positions for moving the point `shift` places (right is positive). */
export function movePoint(value: string, shift: number): { digits: string[]; from: number; to: number; result: string } {
  const [int, frac = ''] = value.replace(/,/g, '').split('.');
  let digits = (int + frac).split('');
  let from = int.length;
  let to = from + shift;
  while (to > digits.length) digits.push('0');
  while (to < 1) { digits.unshift('0'); from++; to++; }
  const a = digits.slice(0, to).join('').replace(/^0+(?=\d)/, '');
  const b = digits.slice(to).join('');
  return { digits, from, to, result: b && /[1-9]/.test(b) ? `${a}.${b.replace(/0+$/, '')}` : a };
}

function Ladder({ p, color }: { p: PrefixPic; color: string }) {
  const fi = RUNGS.findIndex((r) => r.id === p.from);
  const ti = RUNGS.findIndex((r) => r.id === p.to);
  const places = Math.abs(RUNGS[fi].exp - RUNGS[ti].exp);
  const right = RUNGS[fi].exp > RUNGS[ti].exp; // to a smaller unit: bigger number, point moves right
  const rowH = 30;
  const y = (i: number) => 6 + i * rowH;
  const mid = (i: number) => y(i) + rowH / 2;
  const mv = movePoint(p.value, right ? places : -places);
  const n = mv.digits.length;
  const cw = Math.min(28, 240 / (n + 1));
  const x0 = W / 2 - ((n - 1) * cw) / 2;
  const gap = (k: number) => x0 + k * cw - cw / 2;
  const sy = y(8) + 16; // strip top
  const base = sy + 30;
  const step = right ? 1 : -1;
  const hops = Array.from({ length: places }, (_, k) => mv.from + k * step);
  const caption = `${p.fromUnit} to ${p.toUnit} is ${places / 3} rung${places > 3 ? 's' : ''} ${right ? 'down' : 'up'} the ladder, and each rung is 3 places. The point moves ${places} places to the ${right ? 'right' : 'left'}: ${p.value} becomes ${mv.result}.`;
  return (
    <>
      <svg viewBox={`0 0 ${W} ${base + 44}`} role="img" aria-label={`Metric prefix ladder from giga down to pico. ${caption}`}>
        {RUNGS.map((r, i) => {
          const isFrom = i === fi;
          const isTo = i === ti;
          return (
            <g>
              <rect x="4" y={y(i) + 2} width="192" height={rowH - 4} rx="8" fill={isTo ? color : SURFACE} fill-opacity={isTo ? 0.22 : 1}
                stroke={isTo ? color : isFrom ? TEXT : 'none'} stroke-width="2" />
              <text x="12" y={mid(i) + 5} font-size="14" font-weight={isFrom || isTo ? 700 : 500} fill={isFrom || isTo ? TEXT : TEXT2}>{r.id === 'base' ? 'base unit' : r.id}</text>
              <text x="82" y={mid(i) + 5} font-size="14" font-weight="700" fill={isTo ? color : TEXT2} text-anchor="middle">{r.sym}</text>
              <text x="98" y={mid(i) + 5} font-size="13" fill={MUTED}>{isFrom || isTo ? '' : r.means}</text>
              {(isFrom || isTo) && (
                <text x="188" y={mid(i) + 5} font-size="14" font-weight="700" text-anchor="end" fill={isTo ? color : TEXT}>{isFrom ? `from ${p.fromUnit}` : `to ${p.toUnit}`}</text>
              )}
            </g>
          );
        })}
        <path d={`M212 ${mid(fi)}V${mid(ti) + (right ? -3 : 3)}`} stroke={ACCENT} stroke-width="3" stroke-linecap="round" />
        <circle cx="212" cy={mid(fi)} r="4" fill={ACCENT} />
        <Arrowhead x={212} y={mid(ti)} dir={right ? 'down' : 'up'} color={ACCENT} />
        <text x="222" y={(mid(fi) + mid(ti)) / 2 - 3} font-size="13" font-weight="700" fill={ACCENT}>{places} places</text>
        <text x="222" y={(mid(fi) + mid(ti)) / 2 + 13} font-size="13" font-weight="700" fill={ACCENT}>{right ? 'right' : 'left'}</text>

        <path d={`M4 ${sy - 6}H${W - 4}`} stroke={LINE} stroke-width="1.5" stroke-linecap="round" />
        {mv.digits.map((d, i) => (
          <text x={x0 + i * cw} y={base} text-anchor="middle" font-size="24" font-weight="700" fill={TEXT} style={{ fontFamily: 'var(--mono)' }}>{d}</text>
        ))}
        <circle cx={gap(mv.from)} cy={base} r="3.5" fill="none" stroke={MUTED} stroke-width="2" />
        <circle cx={gap(mv.to)} cy={base} r="4" fill={color} />
        {hops.map((k) => (
          <path d={`M${gap(k)} ${base + 8}Q${gap(k) + (step * cw) / 2} ${base + 22} ${gap(k + step)} ${base + 8}`} fill="none" stroke={ACCENT} stroke-width="2.5" stroke-linecap="round" />
        ))}
        <Arrowhead x={gap(mv.to)} y={base + 7} dir="up" color={ACCENT} />
        <text x={W / 2} y={base + 40} text-anchor="middle" font-size="13" fill={MUTED}>ring = old point, dot = new point</text>
      </svg>
      <p class="wk-caption">{caption}</p>
    </>
  );
}

/* ---------- Decibel ladder (T5B09-T5B11) ---------- */
const DB_RUNGS = [
  { factor: 10, power: '× 10', words: 'ten times', db: '+10 dB' },
  { factor: 2, power: '× 2', words: 'double', db: '+3 dB' },
  { factor: 1, power: '× 1', words: 'no change', db: '0 dB' },
  { factor: 0.5, power: '÷ 2', words: 'half', db: '-3 dB' },
  { factor: 0.1, power: '÷ 10', words: 'one tenth', db: '-10 dB' },
];

function Decibels({ p, color }: { p: DecibelPic; color: string }) {
  const rowH = 30;
  const y = (i: number) => 26 + i * rowH;
  const used = new Set(p.hops.map((h) => h.factor));
  const powers = [p.from];
  for (const h of p.hops) powers.push(+(powers[powers.length - 1] * h.factor).toFixed(6));
  const n = powers.length;
  const bw = 60;
  const g = Math.min(80, (272 - bw * n) / (n - 1));
  const startX = (W - (bw * n + g * (n - 1))) / 2;
  const py = y(5) + 34;
  const total = p.hops.reduce((s, h) => s + h.db, 0);
  const sign = (d: number) => (d > 0 ? `+${d}` : `${d}`);
  const rung = (f: number) => DB_RUNGS.find((r) => r.factor === f)!;
  const caption = `${p.from} W to ${p.to} W is ${p.hops.map((h) => rung(h.factor).words).join(', then ')}. ${p.hops.length > 1 ? `Add the steps: ${sign(total)} dB.` : `That is ${sign(total)} dB.`}`;
  return (
    <>
      <svg viewBox={`0 0 ${W} ${py + 72}`} role="img" aria-label={`Decibel ladder: ten times the power is +10 dB, double is +3 dB, half is -3 dB, one tenth is -10 dB. ${caption}`}>
        <text x="20" y="16" font-size="13" font-weight="600" fill={MUTED}>Power changes by</text>
        <text x={W - 20} y="16" font-size="13" font-weight="600" fill={MUTED} text-anchor="end">Decibels</text>
        <path d={`M10 ${y(0)}V${y(5)}M${W - 10} ${y(0)}V${y(5)}`} stroke={MUTED} stroke-width="2.5" stroke-linecap="round" />
        {DB_RUNGS.map((r, i) => {
          const on = used.has(r.factor);
          return (
            <g>
              <rect x="10" y={y(i) + 3} width={W - 20} height={rowH - 6} rx="8" fill={on ? color : SURFACE} fill-opacity={on ? 0.22 : 1} stroke={on ? color : 'none'} stroke-width="2" />
              <text x="22" y={y(i) + 20} font-size="15" font-weight="700" fill={on ? TEXT : TEXT2}>{r.power}</text>
              <text x="78" y={y(i) + 20} font-size="13" fill={on ? TEXT2 : MUTED}>{r.words}</text>
              <text x={W - 22} y={y(i) + 20} font-size="15" font-weight="700" fill={on ? color : TEXT2} text-anchor="end">{r.db}</text>
            </g>
          );
        })}
        {powers.map((v, i) => {
          const x = startX + i * (bw + g);
          const last = i === n - 1;
          return (
            <g>
              <rect x={x} y={py} width={bw} height="34" rx="9" fill={SURFACE} stroke={last ? color : MUTED} stroke-width="2" />
              <text x={x + bw / 2} y={py + 22} text-anchor="middle" font-size="15" font-weight="700" fill={TEXT}>{v} W</text>
              {!last && (
                <g>
                  <path d={`M${x + bw + 5} ${py + 17}H${x + bw + g - 6}`} stroke={ACCENT} stroke-width="2.5" stroke-linecap="round" />
                  <Arrowhead x={x + bw + g - 5} y={py + 17} dir="right" color={ACCENT} />
                  <text x={x + bw + g / 2} y={py + 8} text-anchor="middle" font-size="13" font-weight="700" fill={TEXT2}>{rung(p.hops[i].factor).power}</text>
                  <text x={x + bw + g / 2} y={py + 36} text-anchor="middle" font-size="13" font-weight="700" fill={ACCENT}>{sign(p.hops[i].db)} dB</text>
                </g>
              )}
            </g>
          );
        })}
        <text x={W / 2} y={py + 64} text-anchor="middle" font-size="14" font-weight="700" fill={color}>total change: {sign(total)} dB</text>
      </svg>
      <p class="wk-caption">{caption}</p>
    </>
  );
}

/* ---------- Wavelength (T3B06, T1B03, T1B04) ---------- */
function sine(x0: number, x1: number, yMid: number, amp: number, period: number, phase0 = x0): string {
  let d = '';
  for (let x = x0; x <= x1 + 0.01; x += 2) {
    const yy = yMid - amp * Math.sin(((x - phase0) / period) * 2 * Math.PI);
    d += `${x === x0 ? 'M' : 'L'}${x.toFixed(1)} ${yy.toFixed(1)}`;
  }
  return d;
}

function Wave({ p, color }: { p: WavePic; color: string }) {
  const period = 120;
  const caption = `One wave at ${p.mhz} MHz is about 300 / ${p.mhz} = ${p.meters} meters long. Higher frequency, shorter wave.`;
  return (
    <>
      <svg viewBox={`0 0 ${W} 150`} role="img" aria-label={`A radio wave with one wavelength marked. ${caption}`}>
        <text x={W / 2} y="16" text-anchor="middle" font-size="14" font-weight="700" fill={TEXT}>{p.mhz} MHz</text>
        <path d={`M12 70H${W - 12}`} stroke={LINE} stroke-width="1.5" stroke-linecap="round" />
        <path d={sine(20, 260, 70, 30, period)} fill="none" stroke={ACCENT} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d={`M50 30V116M170 30V116`} stroke={color} stroke-width="2" stroke-linecap="round" stroke-dasharray="4 5" />
        <path d="M54 120H166" stroke={color} stroke-width="2.5" stroke-linecap="round" />
        <Arrowhead x={52} y={120} dir="left" color={color} />
        <Arrowhead x={168} y={120} dir="right" color={color} />
        <text x="110" y="142" text-anchor="middle" font-size="14" font-weight="700" fill={color}>one wavelength: about {p.meters} m</text>
      </svg>
      <p class="wk-caption">{caption}</p>
    </>
  );
}

/* ---------- Quarter-wave antenna (T9A08) ---------- */
function Antenna({ p, color }: { p: AntennaPic; color: string }) {
  const full = 200; // px for one full wave
  const q = full / p.fraction;
  const x0 = 62;
  const caption = `One full wave on this band is about ${p.meters} m. One quarter of it is ${p.meters / p.fraction} m, about ${p.inches} inches, so a 19-inch vertical is a quarter-wave.`;
  return (
    <>
      <svg viewBox={`0 0 ${W} 178`} role="img" aria-label={`A vertical antenna beside one full wave, with one quarter of the wave highlighted. ${caption}`}>
        {/* vertical antenna over a ground plane */}
        <path d="M30 122V36" stroke={color} stroke-width="3.5" stroke-linecap="round" />
        <path d="M12 122H48M30 122L14 138M30 122L46 138" stroke={MUTED} stroke-width="2.5" stroke-linecap="round" />
        <text x="30" y="20" text-anchor="middle" font-size="13" font-weight="700" fill={color}>1/4</text>
        <text x="30" y="158" text-anchor="middle" font-size="13" fill={MUTED}>antenna</text>
        {/* one full wave, first quarter highlighted */}
        <path d={`M${x0} 76H${x0 + full}`} stroke={LINE} stroke-width="1.5" stroke-linecap="round" />
        <path d={sine(x0, x0 + full, 76, 34, full)} fill="none" stroke={ACCENT} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <rect x={x0} y="36" width={q} height="80" rx="6" fill={color} fill-opacity="0.2" stroke={color} stroke-width="2" stroke-dasharray="5 5" />
        <path d={`M${x0 + 3} 128H${x0 + q - 3}`} stroke={color} stroke-width="2.5" stroke-linecap="round" />
        <text x={x0} y="146" font-size="13" font-weight="700" fill={color}>1/4 = {p.meters / p.fraction} m = {p.inches} in</text>
        <path d={`M${x0 + 3} 160H${x0 + full - 3}`} stroke={MUTED} stroke-width="2.5" stroke-linecap="round" />
        <Arrowhead x={x0 + 1} y={160} dir="left" color={MUTED} />
        <Arrowhead x={x0 + full - 1} y={160} dir="right" color={MUTED} />
        <text x={x0 + full / 2} y="176" text-anchor="middle" font-size="13" fill={TEXT2}>one full wave = {p.meters} m</text>
        <text x={x0 + full} y="28" text-anchor="end" font-size="13" fill={MUTED}>2-meter band</text>
      </svg>
      <p class="wk-caption">{caption}</p>
    </>
  );
}

/* ---------- Ratios: battery run time (T4A09) and duty cycle (T0C03) ---------- */
function Ratio({ p, color }: { p: RatioPic; color: string }) {
  if (p.kind === 'battery') {
    const caption = 'Ampere-hours divided by amperes: the amperes cancel and hours are left.';
    return (
      <>
        <svg viewBox={`0 0 ${W} 112`} role="img" aria-label={`A fraction: ampere-hours over amperes equals hours. ${caption}`}>
          {/* battery */}
          <rect x="10" y="34" width="46" height="60" rx="7" fill={SURFACE} stroke={MUTED} stroke-width="2.5" />
          <rect x="24" y="26" width="18" height="8" rx="3" fill={MUTED} />
          <rect x="16" y="58" width="34" height="30" rx="4" fill={color} fill-opacity="0.5" />
          <text x="33" y="52" text-anchor="middle" font-size="13" font-weight="700" fill={TEXT}>Ah</text>
          {/* fraction */}
          <text x="134" y="50" text-anchor="middle" font-size="16" font-weight="700" fill={TEXT}>ampere-hours</text>
          <path d="M78 60H190" stroke={ACCENT} stroke-width="3" stroke-linecap="round" />
          <text x="134" y="84" text-anchor="middle" font-size="16" font-weight="700" fill={TEXT}>amperes</text>
          <path d="M80 46H136M100 80H168" stroke={MUTED} stroke-width="2" stroke-linecap="round" />
          <text x="204" y="66" text-anchor="middle" font-size="18" font-weight="700" fill={TEXT2}>=</text>
          <text x="246" y="66" text-anchor="middle" font-size="17" font-weight="700" fill={color}>hours</text>
          <text x="134" y="108" text-anchor="middle" font-size="13" fill={MUTED}>crossed out = cancels</text>
        </svg>
        <p class="wk-caption">{caption}</p>
      </>
    );
  }
  void color; // both timelines show the transmitted signal, so both use the signal color
  const from = p.from ?? 100;
  const to = p.to ?? 50;
  const factor = from / to;
  const caption = `On ${to} percent of the time gives ${to / from === 0.5 ? 'half' : `${to / from} of`} the average exposure, so the allowed level while transmitting is ${factor} times higher.`;
  const blocks = [0, 1, 2, 3];
  return (
    <>
      <svg viewBox={`0 0 ${W} 150`} role="img" aria-label={`Two transmit timelines: on ${from} percent of the time and on ${to} percent of the time. ${caption}`}>
        <text x="10" y="16" font-size="13" font-weight="700" fill={TEXT2}>{from}% duty cycle: on all the time</text>
        <rect x="10" y="24" width="260" height="30" rx="6" fill={ACCENT} fill-opacity="0.75" />
        <text x="10" y="86" font-size="13" font-weight="700" fill={TEXT2}>{to}% duty cycle: on half the time</text>
        <rect x="10" y="94" width="260" height="30" rx="6" fill={SURFACE} stroke={LINE} stroke-width="1.5" />
        {blocks.map((b) => (
          <rect x={10 + b * 65} y="94" width={65 * (to / from)} height="30" rx="6" fill={ACCENT} fill-opacity="0.75" />
        ))}
        <text x="10" y="144" font-size="13" fill={MUTED}>time</text>
        <path d="M44 140H262" stroke={MUTED} stroke-width="2" stroke-linecap="round" />
        <Arrowhead x={264} y={140} dir="right" color={MUTED} />
      </svg>
      <p class="wk-caption">{caption}</p>
    </>
  );
}

export function Picture({ w, color }: { w: Worked; color: string }) {
  let body = null;
  if (w.family === 'ohm' || w.family === 'power') body = <Triangle w={w} color={color} />;
  else if (w.family === 'prefix') body = <Ladder p={w.pic as PrefixPic} color={color} />;
  else if (w.family === 'decibel') body = <Decibels p={w.pic as DecibelPic} color={color} />;
  else if (w.family === 'wave') body = <Wave p={w.pic as WavePic} color={color} />;
  else if (w.family === 'antenna') body = <Antenna p={w.pic as AntennaPic} color={color} />;
  else if (w.family === 'ratio') body = <Ratio p={w.pic as RatioPic} color={color} />;
  return body && <div class="wk-pic">{body}</div>;
}
