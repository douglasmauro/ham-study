/* Step pictures in the house style: flat, rounded strokes, wires in muted,
   the signal path in accent, the part being taught in the step's topic color. */
import type { ComponentChildren } from 'preact';

export function Svg({ label, h = 140, children }: { label: string; h?: number; children: ComponentChildren }) {
  return <svg viewBox={`0 0 320 ${h}`} role="img" aria-label={label}>{children}</svg>;
}

function T({ x, y, c = '', anchor = 'middle', children }: { x: number; y: number; c?: string; anchor?: string; children: ComponentChildren }) {
  return <text x={x} y={y} text-anchor={anchor} class={`ms-t ${c}`}>{children}</text>;
}

function Arrow({ x1, y1, x2, y2, c = '' }: { x1: number; y1: number; x2: number; y2: number; c?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (da: number) => `${x2 - 9 * Math.cos(a + da)} ${y2 - 9 * Math.sin(a + da)}`;
  return <path class={`ms-l ${c}`} d={`M${x1} ${y1}L${x2} ${y2}M${p(0.5)}L${x2} ${y2}L${p(-0.5)}`} />;
}

function House({ x, y, c = '' }: { x: number; y: number; c?: string }) {
  return <path class={`ms-l ${c}`} d={`M${x - 14} ${y}v-16l14 -12l14 12v16zM${x - 4} ${y}v-9h8v9`} />;
}

function Tower({ x, y, h = 50, c = '' }: { x: number; y: number; h?: number; c?: string }) {
  return (
    <path class={`ms-l ${c}`}
      d={`M${x - 9} ${y}L${x} ${y - h}L${x + 9} ${y}M${x - 6} ${y - h / 3}h12M${x - 3} ${y - (2 * h) / 3}h6M${x} ${y - h}v-10`} />
  );
}

function Handheld({ x, y, c = '' }: { x: number; y: number; c?: string }) {
  return <path class={`ms-l ${c}`} d={`M${x - 7} ${y}v-22h14v22zM${x - 3} ${y - 22}v-12M${x - 3} ${y - 15}h6`} />;
}

function Radio({ x, y, c = '' }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <rect class={`ms-l ${c}`} x={x - 24} y={y - 26} width="48" height="26" rx="4" />
      <circle class={`ms-l thin ${c}`} cx={x - 11} cy={y - 13} r="6" />
      <path class={`ms-l thin ${c}`} d={`M${x + 2} ${y - 17}h14M${x + 2} ${y - 10}h14`} />
    </g>
  );
}

function Person({ x, y, c = '' }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <circle class={`ms-l ${c}`} cx={x} cy={y - 24} r="4.5" />
      <path class={`ms-l ${c}`} d={`M${x} ${y - 19}v11M${x - 6} ${y - 14}h12M${x} ${y - 8}l-5 8M${x} ${y - 8}l5 8`} />
    </g>
  );
}

function Tree({ x, y, h = 70 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <path class="ms-l" d={`M${x} ${y}v${-h + 16}`} />
      <circle class="ms-l" cx={x} cy={y - h + 4} r="13" />
    </g>
  );
}

function Bubble({ x, y, w, lines, c = '' }: { x: number; y: number; w: number; lines: string[]; c?: string }) {
  const h = 14 + lines.length * 16;
  return (
    <g>
      <rect class="ms-f" x={x} y={y} width={w} height={h} rx="10" />
      <rect class={`ms-l thin ${c}`} x={x} y={y} width={w} height={h} rx="10" />
      {lines.map((l, i) => <T x={x + w / 2} y={y + 20 + i * 16} c={`b ${c}`}>{l}</T>)}
    </g>
  );
}

/* ---------- mission 1: reach North Carolina ---------- */

/** Home and the far station over the curve of the Earth: a local repeater circle and a long HF hop. */
export function PathPic({ far, showHop, note, sun }: { far: string; showHop: boolean; note?: string; sun?: boolean }) {
  return (
    <Svg h={152} label={`Home on the left, ${far} far to the right beyond the horizon, the ionosphere above.${showHop ? ' A signal goes up from home, bends back in the ionosphere and comes down at the far station.' : ''}`}>
      <path class="ms-l dash topic" d="M8 34Q160 2 312 34" />
      <T x={160} y={14} c="topic b">{note ?? 'ionosphere'}</T>
      {sun && (
        <g>
          <circle class="ms-l accent" cx="34" cy="48" r="9" />
          <path class="ms-l accent thin" d="M34 31v4M34 61v4M17 48h4M47 48h4M22 36l3 3M46 60l-3 -3M22 60l3 -3M46 36l-3 3" />
        </g>
      )}
      <path class="ms-l" d="M4 132Q160 84 316 132" />
      <House x={36} y={121} c="text" />
      <T x={36} y={146} c="b">Home</T>
      <Tower x={96} y={108} h={30} />
      <path class="ms-l thin dash" d="M60 112Q96 60 134 100" />
      <T x={146} y={100} c="dimt" anchor="start">repeater: local</T>
      <House x={284} y={121} c="text" />
      <T x={262} y={146} c="b">{far}</T>
      {showHop && <path class="ms-l accent ms-flow" d="M42 90L160 26L278 90" />}
      {!showHop && <T x={160} y={56} c="accent b">how do you get there?</T>}
    </Svg>
  );
}

/** A carrier with a sideband each side. The used one lights up once the step is solved. */
export function SidebandPic({ freq, solved }: { freq: string; solved: boolean }) {
  return (
    <Svg h={132} label={`A voice signal has a lower sideband below the carrier at ${freq} megahertz and an upper sideband above it. Each is about 3 kilohertz wide.${solved ? ' The upper sideband is the one in use.' : ''}`}>
      <path class="ms-l" d="M16 96H304" />
      <path class="ms-l dash" d="M160 30V96" />
      <T x={160} y={20} c="b">carrier {freq} MHz</T>
      <path class="ms-l" d="M152 96V56L92 96" />
      <path class={`ms-l ${solved ? 'topic thick' : ''}`} d="M168 96V56L228 96" />
      <T x={104} y={50} c={solved ? 'dimt' : ''}>lower</T>
      <T x={104} y={64} c={solved ? 'dimt' : ''}>sideband</T>
      <T x={222} y={50} c={solved ? 'topic b' : ''}>upper</T>
      <T x={222} y={64} c={solved ? 'topic b' : ''}>sideband</T>
      <path class="ms-l thin" d="M168 106v6h60v-6" />
      <T x={198} y={128} c="dimt">about 3 kHz</T>
      <T x={22} y={128} c="dimt" anchor="start">lower frequency</T>
      <T x={298} y={128} c="dimt" anchor="end">higher</T>
    </Svg>
  );
}

/** A half-wave dipole: two equal legs either side of a center feed point. */
export function DipolePic({ total, leg }: { total: string; leg: string }) {
  return (
    <Svg h={124} label={`Dipole antenna: two equal legs either side of a center feed point, coax hanging down to the radio. End to end ${total}. Each leg ${leg}.`}>
      <path class="ms-l thin" d="M18 22v8M302 22v8M18 26H302" />
      <T x={160} y={14} c="b">{total} end to end</T>
      <circle class="ms-l" cx="12" cy="46" r="5" />
      <circle class="ms-l" cx="308" cy="46" r="5" />
      <path class="ms-l topic thick" d="M18 46H152M168 46H302" />
      <rect class="ms-f" x="152" y="38" width="16" height="16" rx="3" />
      <rect class="ms-l text thin" x="152" y="38" width="16" height="16" rx="3" />
      <path class="ms-l" d="M160 54V116" />
      <T x={85} y={72} c="topic b">{leg}</T>
      <T x={235} y={72} c="topic b">{leg}</T>
      <T x={170} y={110} c="dimt" anchor="start">coax to radio</T>
      <T x={170} y={90} c="dimt" anchor="start">feed point in the middle</T>
    </Svg>
  );
}

/** An SWR meter whose needle follows the live reading, above the wire being trimmed. */
export function SwrPic({ swr, legScale, change }: { swr: number; legScale: number; change: string }) {
  // Scale runs from 1:1 at the left to 4:1 at the right.
  const angle = -60 + ((Math.min(swr, 4) - 1) / 3) * 120;
  const mark = (v: number) => {
    const a = ((-60 + ((v - 1) / 3) * 120 - 90) * Math.PI) / 180;
    return { x1: 96 + 62 * Math.cos(a), y1: 100 + 62 * Math.sin(a), x2: 96 + 72 * Math.cos(a), y2: 100 + 72 * Math.sin(a), tx: 96 + 84 * Math.cos(a), ty: 104 + 84 * Math.sin(a) };
  };
  const half = 60 * legScale;
  const state = swr <= 1.25 ? 'good' : 'accent';
  return (
    <Svg h={168} label={`SWR meter reading ${swr.toFixed(1)} to 1. Wire length change: ${change}.`}>
      <path class="ms-l" d="M34 64A72 72 0 0 1 158 64" />
      {[1, 2, 3, 4].map((v) => { const m = mark(v); return (
        <g>
          <path class="ms-l thin" d={`M${m.x1} ${m.y1}L${m.x2} ${m.y2}`} />
          <T x={m.tx} y={m.ty} c="dimt">{v === 1 ? '1:1' : v === 4 ? '4:1' : `${v}`}</T>
        </g>
      ); })}
      <g class="ms-needle" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '96px 100px' }}>
        <path class={`ms-l thick ${state}`} d="M96 100V44" />
      </g>
      <circle class="ms-f muted" cx="96" cy="100" r="5" />
      <T x={96} y={124} c="dimt">SWR meter</T>
      <T x={250} y={50} c="dimt">reading</T>
      <text x="250" y="78" text-anchor="middle" class={`ms-t mono ${state}`} style={{ fontSize: '24px' }}>{swr.toFixed(1)}:1</text>
      <T x={250} y={100} c={state === 'good' ? 'good b' : 'dimt'}>{state === 'good' ? 'close to a match' : '1:1 is a perfect match'}</T>
      <path class="ms-l topic thick" d={`M${160 - 6 - half} 146H154M166 146H${166 + half}`} />
      <path class="ms-l dash thin" d="M94 138v16M226 138v16" />
      <rect class="ms-l text thin" x="154" y="140" width="12" height="12" rx="3" />
      <T x={160} y={166} c="b">each leg: {change}</T>
    </Svg>
  );
}

/** A talk bubble from your station, and an identification timer. */
export function TalkPic({ lines, caption, solved, timer }: { lines: string[]; caption: string; solved: boolean; timer?: string }) {
  const shown = solved ? lines : ['?'];
  return (
    <Svg h={128} label={solved ? `You say: ${lines.join(' ')}. ${timer ?? ''}` : `Your radio is ready. What do you say? ${caption}`}>
      <Radio x={40} y={104} c="text" />
      <path class="ms-l accent thin" d="M70 84q8 -8 0 -16M78 90q14 -14 0 -28" />
      <Bubble x={98} y={solved ? 22 : 38} w={210} lines={shown} c={solved ? 'accent' : ''} />
      <T x={196} y={118} c={solved && timer ? 'topic b' : 'dimt'}>{solved && timer ? timer : caption}</T>
    </Svg>
  );
}

/** The back yard: house, trees, a person and a power line. The antenna appears once placed. */
export function YardPic({ solved }: { solved: boolean }) {
  return (
    <Svg h={148} label={solved ? 'The dipole hangs high between two trees, well above a person in the yard and far from the power line.' : 'A back yard with a house, two trees, a person on the ground and a power line at the far side.'}>
      <path class="ms-l" d="M6 136H314" />
      <House x={34} y={136} c="text" />
      <Tree x={92} y={136} h={104} />
      <Tree x={214} y={136} h={104} />
      <Person x={153} y={136} c="text" />
      <path class="ms-l" d="M288 136V56M276 64h24" />
      <path class="ms-l thin" d="M300 64Q312 72 320 66M276 64Q268 72 258 60" />
      <T x={288} y={48} c="b">power line</T>
      {solved && (
        <g>
          <path class="ms-l topic thick" d="M100 38H148M158 38H206" />
          <rect class="ms-l text thin" x="148" y="33" width="10" height="10" rx="2" />
          <path class="ms-l" d="M153 43Q150 80 62 110" />
          <Arrow x1={153} y1={100} x2={153} y2={52} c="accent thin" />
          <T x={160} y={80} c="accent b" anchor="start">distance</T>
        </g>
      )}
      {!solved && <T x={153} y={14} c="accent b">where does the wire go?</T>}
    </Svg>
  );
}

/* ---------- mission 2: the repeater net ---------- */

/** You, the repeater on the hill and the far station. */
export function RepeaterPic({ solved, mode }: { solved: boolean; mode: string }) {
  return (
    <Svg label={`Your handheld radio sends up to a repeater on a hill. The repeater sends your signal out again to stations across town.${solved ? ` The mode is ${mode}.` : ''}`}>
      <path class="ms-l" d="M4 130H110Q160 60 210 130H316" />
      <Tower x={160} y={96} h={46} c="topic" />
      <Handheld x={34} y={128} c="text" />
      <T x={34} y={84} c="b">you</T>
      <Handheld x={286} y={128} c="text" />
      <T x={282} y={84} c="b">the net</T>
      <path class="ms-l accent ms-flow" d="M46 100L148 52" />
      <path class="ms-l accent ms-flow" d="M172 52L274 100" />
      <T x={160} y={22} c="topic b">repeater</T>
      <T x={88} y={62} c="accent b">in</T>
      <T x={234} y={62} c="accent b">out</T>
      {solved && <T x={160} y={124} c="good b">{mode}</T>}
    </Svg>
  );
}

/** The repeater's two frequencies and the gap between them. */
export function OffsetPic({ tx, out, diff, ok }: { tx: string; out: string; diff: string; ok: boolean }) {
  return (
    <Svg h={150} label={`The repeater transmits on ${out} megahertz. You transmit on ${tx} megahertz. The difference is ${diff}.`}>
      <Tower x={160} y={112} h={62} c="text" />
      <Arrow x1={62} y1={104} x2={140} y2={52} c="accent" />
      <Arrow x1={180} y1={52} x2={258} y2={104} c="topic" />
      <T x={62} y={124} c="accent b">you transmit</T>
      <text x="62" y="142" text-anchor="middle" class="ms-t mono accent" style={{ fontSize: '14px' }}>{tx}</text>
      <T x={258} y={124} c="topic b">repeater transmits</T>
      <text x="258" y="142" text-anchor="middle" class="ms-t mono topic" style={{ fontSize: '14px' }}>{out}</text>
      <T x={160} y={18} c="dimt">difference</T>
      <text x="160" y="36" text-anchor="middle" class={`ms-t mono ${ok ? 'good' : ''}`} style={{ fontSize: '15px' }}>{diff}</text>
    </Svg>
  );
}

/** Voice alone does not open the repeater; voice plus the right tone does. */
export function TonePic({ solved }: { solved: boolean }) {
  return (
    <Svg h={132} label={solved ? 'Your voice goes out with a low steady tone under it. The repeater hears the tone and opens.' : 'Your voice reaches the repeater, but the repeater stays closed.'}>
      <Handheld x={26} y={104} c="text" />
      <path class="ms-l accent" d="M48 56q6 -22 12 0t12 0q5 -30 10 0t10 0q6 -16 12 0t12 0q5 -26 10 0t10 0" />
      <T x={98} y={30} c="accent b">your voice</T>
      <path class={`ms-l ${solved ? 'topic' : 'dash'}`} d="M48 92q11 -12 22 0t22 0t22 0t22 0" />
      <T x={98} y={116} c={solved ? 'topic b' : 'dimt'}>{solved ? 'low steady tone' : 'what is missing?'}</T>
      <Arrow x1={166} y1={74} x2={206} y2={74} c={solved ? 'accent' : ''} />
      <Tower x={262} y={112} h={58} c="text" />
      <rect class="ms-f" x="216" y="62" width="24" height="22" rx="4" />
      <rect class={`ms-l thin ${solved ? 'good' : 'bad'}`} x="216" y="62" width="24" height="22" rx="4" />
      <path class={`ms-l thin ${solved ? 'good' : 'bad'}`} d={solved ? 'M221 62v-6a7 7 0 0 1 14 0' : 'M221 62v-6a7 7 0 0 1 14 0v6'} />
      <T x={228} y={102} c={solved ? 'good b' : 'bad b'}>{solved ? 'open' : 'closed'}</T>
    </Svg>
  );
}

/** A net: net control in the middle, stations around it, you among them. */
export function NetPic({ label, urgent, solved, arrow }: { label: string; urgent?: boolean; solved: boolean; arrow?: 'toYou' | 'toControl' }) {
  const spots = [[52, 34], [268, 34], [40, 108], [280, 108]];
  return (
    <Svg h={150} label={label}>
      {spots.map(([x, y]) => <path class="ms-l thin dash" d={`M160 66L${x} ${y}`} />)}
      {spots.map(([x, y]) => <circle class="ms-f muted" cx={x} cy={y} r="7" />)}
      <path class={`ms-l thin ${solved ? 'accent' : 'dash'}`} d="M160 66V112" />
      {solved && arrow === 'toYou' && <Arrow x1={160} y1={84} x2={160} y2={108} c="accent" />}
      {solved && arrow === 'toControl' && <Arrow x1={160} y1={108} x2={160} y2={84} c="accent" />}
      <circle class="ms-f" cx="160" cy="52" r="17" />
      <circle class="ms-l topic" cx="160" cy="52" r="17" />
      <T x={160} y={24} c="topic b">net control</T>
      <circle class={`ms-f ${urgent ? 'bad' : 'accent'}`} cx="160" cy="122" r="8" />
      <T x={160} y={146} c={urgent ? 'bad b' : 'accent b'}>{urgent ? 'you, with an emergency' : 'you'}</T>
      <T x={52} y={18} c="dimt">station</T>
      <T x={268} y={18} c="dimt">station</T>
    </Svg>
  );
}

/** A 30 minute contact with a pin at each identification. */
export function IdTimelinePic({ every, solved }: { every: number; solved: boolean }) {
  const x = (m: number) => 20 + (m / 30) * 280;
  const pins: number[] = [];
  for (let m = every; m < 30; m += every) pins.push(m);
  return (
    <Svg h={120} label={`A 30 minute conversation. You identify every ${every} minutes and again at the end.`}>
      <path class="ms-l" d="M20 70H300" />
      {[0, 10, 20, 30].map((m) => (
        <g>
          <path class="ms-l thin" d={`M${x(m)} 70v8`} />
          <T x={x(m)} y={96} c="dimt">{m}</T>
        </g>
      ))}
      <T x={160} y={114} c="dimt">minutes into the conversation</T>
      {pins.map((m) => (
        <g>
          <path class={`ms-l ${solved ? 'good' : 'accent'}`} d={`M${x(m)} 70V44`} />
          <circle class={`ms-f ${solved ? 'good' : 'accent'}`} cx={x(m)} cy="40" r="6" />
        </g>
      ))}
      <path class="ms-l topic" d={`M${x(30)} 70V44`} />
      <circle class="ms-f topic" cx={x(30)} cy="40" r="6" />
      <T x={x(30)} y={24} c="topic b" anchor="end">and at the end</T>
      <T x={20} y={24} c={solved ? 'good b' : 'accent b'} anchor="start">your call sign every {every} min</T>
    </Svg>
  );
}

/** Two stations close together: straight across, or up through the repeater. */
export function SimplexPic({ solved }: { solved: boolean }) {
  return (
    <Svg h={148} label={solved ? 'You and your friend talk straight to each other on one frequency. The repeater stays free.' : 'You and your friend are close together. One path goes straight across, the other goes up through the repeater.'}>
      <Tower x={160} y={74} h={38} c={solved ? '' : 'text'} />
      <T x={160} y={12} c="dimt">{solved ? 'repeater: free for others' : 'repeater'}</T>
      <path class="ms-l thin dash" d="M70 92L148 52M172 52L250 92" />
      <House x={56} y={124} c="text" />
      <House x={264} y={124} c="text" />
      <T x={56} y={140} c="b">you</T>
      <T x={264} y={140} c="b">your friend</T>
      {solved ? <path class="ms-l accent ms-flow" d="M78 108H242" /> : <path class="ms-l thin dash" d="M78 108H242" />}
      <T x={160} y={100} c={solved ? 'accent b' : 'dimt'}>{solved ? 'simplex: one frequency' : 'straight across'}</T>
    </Svg>
  );
}

/* ---------- mission 3: power outage ---------- */

function Battery({ x, y, c = 'text' }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <rect class={`ms-l ${c}`} x={x - 30} y={y - 40} width="60" height="40" rx="4" />
      <path class={`ms-l ${c}`} d={`M${x - 18} ${y - 40}v-7M${x + 18} ${y - 40}v-7`} />
      <T x={x - 18} y={y - 52} c="b">+</T>
      <T x={x + 18} y={y - 52} c="b">−</T>
    </g>
  );
}

/** A battery feeding the radio, and a bar that shows how long it lasts. */
export function RuntimePic({ hours, ah, amps, solved }: { hours: number; ah: number; amps: number; solved: boolean }) {
  const w = Math.min(1, hours / 20) * 280;
  return (
    <Svg h={150} label={`A ${ah} ampere-hour battery feeds a radio that draws ${amps} amperes on average. Your estimate: ${hours} hours.`}>
      <Battery x={56} y={84} />
      <T x={56} y={68} c="topic b">{ah} Ah</T>
      <path class="ms-l accent ms-flow" d="M90 64H206" />
      <T x={148} y={54} c="accent b">{amps} A average</T>
      <Radio x={236} y={78} c="text" />
      <rect class="ms-f" x="20" y="108" width="280" height="12" rx="6" />
      <rect class={`ms-f ${solved ? 'good' : 'accent'}`} x="20" y="108" width={w} height="12" rx="6" />
      <T x={20} y={140} c="dimt" anchor="start">0 h</T>
      <T x={300} y={140} c="dimt" anchor="end">20 h</T>
      <T x={160} y={140} c={solved ? 'good b' : 'accent b'}>your estimate: {hours} h</T>
    </Svg>
  );
}

/** A 12 volt battery with bare terminals and a metal wrench nearby. */
export function ShortPic({ solved }: { solved: boolean }) {
  return (
    <Svg h={132} label={solved ? 'A metal wrench lies across both battery terminals: a short circuit, with sparks.' : 'A 12 volt battery with bare terminals. A metal wrench lies on the shelf just above it.'}>
      <path class="ms-l" d="M10 118H310" />
      <Battery x={130} y={118} />
      <T x={130} y={102} c="topic b">12 V</T>
      <g transform={solved ? 'translate(0 44)' : ''}>
        <path class={`ms-l thick ${solved ? 'bad' : ''}`} d="M100 26H160" />
        <circle class={`ms-l ${solved ? 'bad' : ''}`} cx="94" cy="26" r="6" />
        <circle class={`ms-l ${solved ? 'bad' : ''}`} cx="166" cy="26" r="6" />
      </g>
      {solved && <path class="ms-l bad thin" d="M84 56l-8 -6M82 68h-10M176 56l8 -6M178 68h10M130 54v-10" />}
      <T x={244} y={solved ? 62 : 30} c={solved ? 'bad b' : 'dimt'}>{solved ? 'short circuit' : 'metal wrench'}</T>
      {solved && <T x={244} y={78} c="bad">burns, fire,</T>}
      {solved && <T x={244} y={94} c="bad">explosion</T>}
    </Svg>
  );
}

/** Two ways to wire the radio to the battery. */
export function WirePic({ solved }: { solved: boolean }) {
  return (
    <Svg h={150} label={solved ? 'The short, heavy wire is used. Little voltage is lost on the way to the radio.' : 'A battery and a radio, with two possible wires: a long thin one and a short heavy one.'}>
      <Battery x={48} y={96} />
      <Radio x={270} y={90} c="text" />
      <path class={`ms-l thin ${solved ? 'dash' : ''}`} d="M82 62Q110 6 136 30T180 30T224 30Q240 50 244 70" />
      <T x={160} y={14} c="dimt">long and thin</T>
      <path class={`ms-l thick ${solved ? 'accent' : ''}`} d="M82 78H244" />
      <T x={162} y={98} c={solved ? 'accent b' : 'dimt'}>short and heavy</T>
      <T x={160} y={132} c={solved ? 'good b' : 'dimt'}>{solved ? 'least voltage drop when you transmit' : 'the radio draws the most current when it transmits'}</T>
    </Svg>
  );
}

/** A blown 5 ampere fuse in the power lead, and the spares on hand. */
export function FusePic({ solved }: { solved: boolean }) {
  const fuse = (x: number, y: number, label: string, c: string, blown?: boolean) => (
    <g>
      <rect class={`ms-l ${c}`} x={x - 22} y={y - 8} width="44" height="16" rx="4" />
      <path class={`ms-l thin ${c}`} d={blown ? `M${x - 14} ${y}h8M${x + 6} ${y}h8` : `M${x - 14} ${y}h28`} />
      <T x={x} y={y + 28} c={`b ${c}`}>{label}</T>
    </g>
  );
  return (
    <Svg h={162} label={solved ? 'A new 5 ampere fuse sits in the power lead. The 20 ampere spare stays in the box.' : 'The power lead from battery to radio has a blown 5 ampere fuse. The spares are one 5 ampere fuse and one 20 ampere fuse.'}>
      <T x={20} y={18} c="dimt" anchor="start">battery</T>
      <T x={300} y={18} c="dimt" anchor="end">radio</T>
      <path class={`ms-l ${solved ? 'accent' : ''}`} d="M20 40H138M182 40H300" />
      {fuse(160, 40, solved ? '5 A, new' : '5 A, blown', solved ? 'good' : 'bad', !solved)}
      <rect class="ms-l thin dash" x="70" y="88" width="180" height="68" rx="8" />
      <T x={160} y={104} c="dimt">spares</T>
      {fuse(118, 118, '5 A', solved ? 'dimt' : 'topic')}
      {fuse(202, 118, '20 A', solved ? 'dimt' : 'topic')}
    </Svg>
  );
}

/** A formal message form: preamble, then the text, with a hard word to send. */
export function MessagePic({ word, spelled, solved }: { word: string; spelled: string[]; solved: boolean }) {
  return (
    <Svg h={150} label={solved ? `A formal message. The word ${word} is spelled out: ${spelled.join(' ')}.` : `A formal message with a preamble and a text. The text contains the unusual word ${word}.`}>
      <rect class="ms-f" x="14" y="8" width="292" height="134" rx="10" />
      <rect class="ms-l thin" x="14" y="8" width="292" height="134" rx="10" />
      <T x={28} y={30} c="topic b" anchor="start">Preamble</T>
      <T x={104} y={30} c="dimt" anchor="start">tracks the message</T>
      <path class="ms-l thin" d="M24 40H296" />
      <T x={28} y={60} c="topic b" anchor="start">Text</T>
      <T x={28} y={80} anchor="start">Shelter open at</T>
      <text x="126" y="80" class="ms-t mono accent" style={{ fontSize: '14px' }}>{word}</text>
      <T x={186} y={80} anchor="start">Road school</T>
      <path class="ms-l thin dash" d="M24 92H296" />
      {solved
        ? <><T x={160} y={112} c="good b">{spelled.slice(0, 3).join(' · ')}</T><T x={160} y={130} c="good b">{spelled.slice(3).join(' · ')}</T></>
        : <T x={160} y={120} c="accent b">how do you send {word} so it is copied right?</T>}
    </Svg>
  );
}
