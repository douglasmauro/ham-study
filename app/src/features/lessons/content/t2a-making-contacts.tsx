import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Making contacts (question group T2A, all 11 questions).
 * Every exam fact below comes from a T2A question and its keyed answer; the ids are in each
 * step's `covers`. The band edges (2 meters: 144 to 148 MHz, 70 centimeters: 420 to 450 MHz)
 * and the 446.000 MHz 70 centimeter calling frequency come from the T2A explanations. The
 * repeater pairs 146.940 / 146.340 MHz and 147.000 / 147.600 MHz are ordinary 600 kHz
 * examples, worked out by hand. People and call signs: Doug, KJ7ABC, and his friend Jeff, K7DEF.
 */

/* ---------- drawing helpers ---------- */

const r1 = (v: number) => +v.toFixed(1);

/** A handheld radio, 14 x 24, top centre at (x, y), with its antenna above. */
function HT({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) {
  return <path class={c} d={`M${x - 7} ${y}h14v24h-14ZM${x + 4} ${y}v-12M${x - 3} ${y + 7}h6`} />;
}

/** A lattice tower standing on `base`, `h` tall, with a short antenna on top. */
function Tower({ x, base, h, c = 'ga-w' }: { x: number; base: number; h: number; c?: string }) {
  const w = 10;
  const half = (t: number) => w - (w - 3) * t;
  let d = `M${x - w} ${base}L${x - 3} ${base - h}M${x + w} ${base}L${x + 3} ${base - h}`;
  const n = Math.max(3, Math.round(h / 14));
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n, s = i % 2 ? 1 : -1;
    d += `M${r1(x + s * half(t0))} ${r1(base - h * t0)}L${r1(x - s * half(t1))} ${r1(base - h * t1)}`;
  }
  d += `M${x} ${base - h}v-10`;
  return <path class={c} d={d} />;
}

/** A speech bubble with a small tail on its left or right side, pointing at a radio. */
function Bubble({ x, y, w, h, side, c = 'ga-k' }: { x: number; y: number; w: number; h: number; side: 'left' | 'right'; c?: string }) {
  const r = 6, m = y + h / 2;
  const d = side === 'left'
    ? `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${m + 5}L${x - 8} ${m}L${x} ${m - 5}V${y + r}Q${x} ${y} ${x + r} ${y}Z`
    : `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${m - 5}L${x + w + 8} ${m}L${x + w} ${m + 5}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
  return <path class={c} d={d} />;
}

/* ---------- pictures ---------- */

/** Doug talks through a repeater: his input goes up, the output comes down. T2A07 */
function RepeaterPath() {
  return (
    <Art label="Doug's handheld radio and a repeater tower. Doug transmits up to the repeater on its input frequency, 600 kilohertz below. The repeater sends his signal back out on its output frequency, 146.940 megahertz.">
      <path class="ga-w ga-thin" d="M8 116H232" />
      <HT x={30} y={84} c="ga-k" />
      <Tower x={200} base={116} h={74} />
      <Arrow x1={44} y1={76} x2={186} y2={44} c="ga-s ga-thick" />
      <Arrow x1={186} y1={86} x2={46} y2={102} c="ga-k ga-thick" />
      <T x={108} y={40} a="middle" c="ga-ts ga-tb">input: 600 kHz lower</T>
      <T x={118} y={84} a="middle" c="ga-tk ga-tb">output: 146.940 MHz</T>
      <T x={30} y={132} a="middle" c="ga-tm">Doug</T>
      <T x={200} y={132} a="middle" c="ga-tm">repeater</T>
    </Art>
  );
}

/** The two bands drawn to their own width, each with its usual repeater gap. T2A01, T2A03 */
function OffsetSizes({ solved }: PicProps) {
  const two = 216 / 4; // px per MHz on the 2 meter bar
  const seventy = 216 / 30; // px per MHz on the 70 centimeter bar
  const a1 = 12 + 2.34 * two, b1 = 12 + 2.94 * two;
  const a2 = 12 + 22 * seventy, b2 = 12 + 27 * seventy;
  const hi = solved ? 'ga-good' : 'ga-k';
  return (
    <Art label="Two bars, each one band drawn to fill the same width. The 2 meter band, 144 to 148 megahertz, with a repeater pair 600 kilohertz apart. The 70 centimeter band, 420 to 450 megahertz, with a repeater pair 5 megahertz apart.">
      <T x={12} y={20} c="ga-tb">2 m band: 144 to 148 MHz</T>
      <rect class="ga-w ga-thin" x="12" y="28" width="216" height="14" rx="2" />
      <path class="ga-k ga-thick" d={`M${r1(a1)} 24V46M${r1(b1)} 24V46`} />
      <path class="ga-k ga-thin" d={`M${r1(a1)} 50v4H${r1(b1)}v-4`} />
      <T x={r1((a1 + b1) / 2)} y={68} a="middle" c="ga-tk ga-tb">600 kHz</T>
      <T x={12} y={88} c="ga-tb">70 cm band: 420 to 450 MHz</T>
      <rect class="ga-w ga-thin" x="12" y="96" width="216" height="14" rx="2" />
      <path class={`${hi} ga-thick`} d={`M${r1(a2)} 92V114M${r1(b2)} 92V114`} />
      <path class={`${hi} ga-thin`} d={`M${r1(a2)} 118v4H${r1(b2)}v-4`} />
      <T x={r1((a2 + b2) / 2)} y={135} a="middle" c={solved ? 'ga-tk ga-tb' : 'ga-tm'}>{solved ? '5 MHz' : '?'}</T>
      <T x={12} y={135} c="ga-tm">each bar is one whole band</T>
    </Art>
  );
}

/** Jeff calls CQ; Doug's reply appears in his bubble as he picks it. T2A05 */
const REPLIES: Record<string, string> = {
  right: 'K7DEF, this is KJ7ABC',
  mine: 'KJ7ABC answering K7DEF',
  cq: 'CQ, K7DEF',
  report: 'Good signal, KJ7ABC',
};
function Answering({ picked, solved }: PicProps) {
  const said = picked ? REPLIES[picked] : null;
  const tone = !said ? 'ga-w' : solved ? 'ga-good' : 'ga-bad';
  return (
    <Art label={`Jeff, on the left, calls: CQ CQ CQ, this is K7DEF. Doug, on the right, answers${said ? `: ${said}` : '. His words are not filled in yet'}.`}>
      <HT x={20} y={24} c="ga-k" />
      <T x={20} y={64} a="middle" c="ga-tm">Jeff</T>
      <Bubble x={40} y={14} w={192} h={30} side="left" />
      <T x={136} y={34} a="middle">CQ CQ CQ, this is K7DEF</T>
      <HT x={218} y={84} c="ga-k" />
      <T x={218} y={124} a="middle" c="ga-tm">Doug</T>
      <Bubble x={8} y={78} w={192} h={30} side="right" c={tone} />
      <T x={104} y={98} a="middle" c={said ? (solved ? 'ga-tb' : '') : 'ga-tm'}>{said ?? 'What does Doug say?'}</T>
    </Art>
  );
}

/** Doug and Jeff on either side of a repeater on a hill: everyone on it hears every call. T2A04, T2A09 */
function OnTheRepeater() {
  return (
    <Art label="Doug and Jeff on either side of a hill, too far apart to reach each other directly. A repeater on the hilltop hears Doug and sends him out to Jeff and to everyone else listening.">
      <path class="ga-w ga-thin" d="M8 112H232" />
      <path class="ga-w" d="M64 112Q120 46 176 112" />
      <Tower x={120} base={80} h={40} c="ga-k" />
      <HT x={26} y={84} c="ga-k" />
      <HT x={214} y={84} />
      <Arrow x1={38} y1={78} x2={106} y2={40} c="ga-s" />
      <Arrow x1={134} y1={40} x2={202} y2={78} c="ga-s" />
      <T x={26} y={130} a="middle" c="ga-tm">Doug</T>
      <T x={214} y={130} a="middle" c="ga-tm">Jeff</T>
      <T x={120} y={18} a="middle" c="ga-tk ga-tb">everyone on it hears every call</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconSimplex = () => <Mini><path class="ls-mw" d="M4 18h8v20h-8ZM10 18v-8M36 18h8v20h-8ZM42 18v-8" /><path class="ls-ms" d="M16 28H32" /></Mini>;
const IconOffset = () => <Mini><path class="ls-mw ls-mthin" d="M4 34H44" /><path class="ls-ms" d="M14 34V12M34 34V12" /><path class="ls-mk" d="M14 40H34" /></Mini>;
const IconPlan = () => <Mini><rect class="ls-mw" x="4" y="16" width="40" height="16" rx="2" /><path class="ls-mw ls-mthin" d="M16 16V32M30 16V32" /><path class="ls-mk" d="M23 10V38" /></Mini>;
const IconCq = () => <Mini><text class="ls-mt" x="24" y="30" text-anchor="middle">CQ</text><path class="ls-ms" d="M38 14Q44 24 38 34M6 14Q0 24 6 34" /></Mini>;
const IconOrder = () => <Mini><rect class="ls-mk" x="4" y="10" width="40" height="10" rx="2" /><rect class="ls-mw" x="4" y="28" width="40" height="10" rx="2" /><path class="ls-mw ls-mthin" d="M24 20V28" /></Mini>;
const IconListen = () => <Mini><path class="ls-mk" d="M8 30V22a16 16 0 0 1 32 0v8" /><rect class="ls-mk" x="6" y="28" width="8" height="12" rx="2" /><rect class="ls-mk" x="34" y="28" width="8" height="12" rx="2" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't2a-making-contacts',
  title: 'Making contacts',
  blurb: 'Simplex and repeaters, offsets, the band plan, and what to say when you call or answer.',
  sub: 'T2',
  groups: ['T2A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t2a-making-contacts',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T2A02', 'T2A05', 'T2A07', 'T2A08', 'T2A10', 'T2A11'],
    },
    {
      type: 'card',
      id: 'simplex',
      idea: 'Simplex: one frequency, taking turns',
      covers: ['T2A11'],
      picture: { art: 'simplex' },
      heading: 'Simplex: one frequency, taking turns',
      text: [
        'Doug and Jeff live a few miles apart. They set both radios to the same frequency. Doug talks while Jeff listens, then Jeff talks while Doug listens.',
        'Sending and receiving on the same frequency is called simplex. It is direct, radio to radio. A telephone is different: both people can talk at once over two separate paths. That is called full duplex.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug and Jeff send and receive on one frequency, taking turns. What is this called?',
        options: [
          { id: 'duplex', label: 'Full duplex', why: 'Full duplex means sending and receiving at the same moment on two frequencies, like a telephone call.' },
          { id: 'simplex', label: 'Simplex', right: true, why: 'Yes. Transmitting and receiving on the same frequency is simplex.' },
          { id: 'multi', label: 'Multiplex', why: 'Multiplex means combining several signals onto one channel. It is not the name for one-frequency operation.' },
        ],
      },
      remember: 'Simplex means transmitting and receiving on the same frequency.',
    },
    {
      type: 'card',
      id: 'offset',
      idea: 'The repeater offset',
      covers: ['T2A07'],
      picture: { draw: RepeaterPath },
      heading: 'A repeater listens on one frequency and transmits on another',
      text: [
        'A repeater is a station up high, often on a hilltop, so it can hear radios that cannot hear each other. It listens on one frequency, its input, and at the same moment sends what it hears out on another, its output.',
        'The difference between the two is the repeater offset. Doug listens on the output, and his radio shifts by the offset when he transmits. Remember that 600 kHz is 0.6 MHz.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'The repeater transmits on 146.940 MHz and listens 600 kHz lower. What frequency must Doug transmit on?',
            left: 'input',
            top: '146.94 − 0.6',
            bottom: '',
            accept: [146.335, 146.345],
            traps: [
              { range: [147.535, 147.545], why: 'That is 600 kHz above. This repeater listens 600 kHz below, so take it away.' },
              { range: [140.935, 140.945], why: 'That takes away 6 MHz. 600 kHz is only 0.6 MHz.' },
              { range: [146.875, 146.885], why: 'That takes away only 60 kHz. 600 kHz is 0.6 MHz, not 0.06.' },
            ],
            hint: 'Not quite. Start at 146.940 and take away 0.6.',
            answer: '146.34',
            working: ['146.940 − 0.6 = 146.340', 'Doug transmits on 146.340 MHz and the repeater sends him out on 146.940 MHz. The 600 kHz gap between them is the offset.'],
          },
        ],
      },
      remember: "The repeater offset is the difference between a repeater's transmit and receive frequencies.",
    },
    {
      type: 'card',
      id: 'offset-sizes',
      idea: 'Usual offsets: 600 kHz and 5 MHz',
      covers: ['T2A01', 'T2A03'],
      picture: { draw: OffsetSizes },
      heading: '600 kHz on 2 meters, 5 MHz on 70 centimeters',
      text: [
        'Each band has a usual offset. The 2 meter band, 144 to 148 MHz, is only 4 MHz wide, so its repeaters use a small gap: 600 kHz, up or down.',
        'The 70 centimeter band, 420 to 450 MHz, is much wider, so its repeaters use a bigger gap: 5 MHz, up or down.',
      ],
      interaction: {
        kind: 'choice',
        prompt: "Jeff's repeater is on 444.200 MHz, in the 70 centimeter band. What offset does it most likely use?",
        options: [
          { id: '600', label: 'Plus or minus 600 kHz', why: '600 kHz is the usual offset on 2 meters. This repeater is on 70 centimeters.' },
          { id: 'five', label: 'Plus or minus 5 MHz', right: true, why: 'Yes. On the wide 70 centimeter band the usual offset is 5 MHz, up or down.' },
          { id: '500', label: 'Plus or minus 500 kHz', why: '500 kHz is not a usual offset on either band. On 70 centimeters it is 5 MHz.' },
        ],
      },
      remember: 'A common repeater offset is plus or minus 600 kHz on 2 meters and plus or minus 5 MHz on 70 centimeters.',
    },
    {
      type: 'card',
      id: 'band-plan',
      idea: 'The band plan and the calling frequency',
      covers: ['T2A10', 'T2A02'],
      picture: { art: 'band-plan' },
      heading: 'The band plan: where each activity goes',
      text: [
        'FCC rules say which frequencies and modes you may use. On top of that, hams agree on a band plan: a voluntary guideline for where each mode or activity goes in a band, such as repeaters, simplex and weak-signal work.',
        'The band plan also marks meeting spots called calling frequencies, where stations listen for a call. On 2 meters, the national calling frequency for FM simplex is 146.520 MHz.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug is out hiking with no repeater in reach. He wants to find anyone on 2 meter FM simplex. Where does he call?',
        options: [
          { id: '145', label: '145.000 MHz', why: '145.000 MHz is inside the 2 meter band, but it is not the calling frequency.' },
          { id: '446', label: '446.000 MHz', why: '446.000 MHz is the FM calling frequency on 70 centimeters. The 2 meter band runs from 144 to 148 MHz.' },
          { id: '146', label: '146.520 MHz', right: true, why: 'Yes. 146.520 MHz is the national FM simplex calling frequency on 2 meters.' },
        ],
      },
      remember: 'A band plan is a voluntary guideline for using different modes or activities within a band. The 2 meter FM simplex calling frequency is 146.520 MHz.',
    },
    {
      type: 'card',
      id: 'cq',
      idea: 'CQ means calling any station',
      covers: ['T2A08', 'T2A06'],
      picture: { art: 'cq' },
      heading: 'CQ means calling any station',
      text: [
        'CQ is a procedural signal: a short call with an agreed meaning. It means calling any station. Anyone who hears it may answer.',
        'On simplex, people tuning by need a moment to notice you. So say CQ a few times, then "this is" and your call sign, then stop and listen. No answer? Call again.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug is on 146.520 MHz and wants anyone at all to answer. Which call works best?',
        options: [
          { id: 'once', label: '"KJ7ABC listening", said once, then change frequency', why: 'That short call is repeater style. Said once on simplex, people tuning by will miss it.' },
          { id: 'cq', label: '"CQ CQ CQ, this is KJ7ABC", then pause to listen', right: true, why: 'Yes. A few CQs let people tune you in, the call sign says who you are, and the pause lets them answer.' },
          { id: 'carrier', label: 'Hold the button ten seconds without talking, then give his call sign', why: 'A signal with no voice on it tells listeners nothing. It just occupies the frequency.' },
        ],
      },
      remember: 'CQ means calling any station. On simplex, say CQ a few times, then "this is" and your call sign, then pause to listen.',
    },
    {
      type: 'card',
      id: 'answering',
      idea: 'Answer with their call sign, then yours',
      covers: ['T2A05'],
      picture: { draw: Answering },
      heading: 'Answering: their call sign first, then yours',
      text: [
        'Now Jeff calls CQ and Doug wants to answer. Jeff needs to hear two things, in this order: that the reply is for him, then who is replying.',
        'So say the other station\'s call sign first, then your own. Signal reports and names come after that, once you are in contact.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Jeff calls "CQ CQ CQ, this is K7DEF." What does Doug say? Watch his bubble.',
        options: [
          { id: 'mine', label: '"KJ7ABC answering K7DEF"', why: 'The order is backwards. The station being answered is named first, then you.' },
          { id: 'cq', label: '"CQ, K7DEF"', why: 'CQ calls any station. Doug is answering one station, and he has not said who he is.' },
          { id: 'report', label: '"Good signal, KJ7ABC"', why: 'A signal report comes later. Without K7DEF first, Jeff cannot tell the reply is for him.' },
          { id: 'right', label: '"K7DEF, this is KJ7ABC"', right: true, why: 'Yes. Jeff\'s call sign shows the reply is for him, and Doug\'s says who is answering.' },
        ],
      },
      remember: "To answer a station calling CQ, give the other station's call sign, then your own.",
    },
    {
      type: 'card',
      id: 'repeater-calls',
      idea: 'Calling on a repeater',
      covers: ['T2A04', 'T2A09', 'T2A06'],
      picture: { draw: OnTheRepeater },
      heading: 'On a repeater, keep it short',
      text: [
        'Everyone on a repeater is already tuned to it, so CQ is not normally used there. To let people know you are around, give your call sign and the word listening: "KJ7ABC listening."',
        'To call a friend whose call sign you know, use the same order as an answer: his call sign, then yours. "K7DEF, this is KJ7ABC." No special words are needed.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each call to the situation it fits. Tap a call, then tap the situation.',
        slots: [
          { id: 'any', label: 'Simplex, anyone', sub: 'any station may answer', rule: 'On simplex you invite anyone with CQ a few times, then your call sign.' },
          { id: 'jeff', label: 'Repeater, Jeff', sub: 'Doug knows his call sign', rule: 'To call one station you know, say its call sign, then yours.' },
          { id: 'here', label: 'Repeater, anyone', sub: 'Doug is free to talk', rule: 'On a repeater you give your call sign and say listening.' },
        ],
        items: [
          { id: 'a', label: 'CQ CQ CQ, this is KJ7ABC', slot: 'any', why: 'Right. A few CQs, your call sign, then listen. That is the simplex way to call anyone.' },
          { id: 'b', label: 'K7DEF, this is KJ7ABC', slot: 'jeff', why: "Right. Jeff's call sign gets his attention, and Doug's identifies the station calling." },
          { id: 'c', label: 'KJ7ABC listening', slot: 'here', why: 'Right. On a repeater, your call sign and "listening" says you are there and would like a contact.' },
        ],
      },
      remember: 'On a repeater, call a station you know with its call sign, then yours. To look for a contact, say your call sign and "listening".',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T2A01', 'T2A05', 'T2A07', 'T2A08', 'T2A10', 'T2A11'],
      questions: [
        {
          q: 'Doug and Jeff can hear each other directly. They both send and receive on 146.520 MHz. How are they operating?',
          review: 'simplex',
          covers: ['T2A11'],
          choices: [
            { label: 'Through a repeater', why: 'A repeater would put their signals on two frequencies. They are using only one.' },
            { label: 'Simplex', right: true, why: 'Sending and receiving on the same frequency is simplex.' },
            { label: 'Full duplex', why: 'Full duplex needs two frequencies so both can talk at once. They take turns on one.' },
          ],
        },
        {
          q: 'A 2 meter repeater sends on 147.000 MHz. Which of these is most likely the frequency it listens on?',
          review: 'offset-sizes',
          covers: ['T2A01', 'T2A07'],
          choices: [
            { label: '147.000 MHz', why: 'A repeater cannot listen and transmit on the same frequency. It needs an offset.' },
            { label: '147.600 MHz', right: true, why: 'That is 600 kHz away, the usual 2 meter offset.' },
            { label: '152.000 MHz', why: 'That is 5 MHz away, the 70 centimeter offset. It is not even inside the 2 meter band.' },
          ],
        },
        {
          q: 'Doug hears "CQ CQ CQ, this is K7DEF." What does that call mean?',
          review: 'cq',
          covers: ['T2A08', 'T2A05'],
          choices: [
            { label: 'K7DEF would like a contact with any station', right: true, why: 'CQ means calling any station. Doug may answer: "K7DEF, this is KJ7ABC."' },
            { label: 'Only a station named earlier should answer', why: 'CQ is the opposite of that. It invites anyone who hears it.' },
            { label: 'K7DEF is checking how clear his audio is', why: 'CQ has nothing to do with audio quality. It is a general call.' },
          ],
        },
        {
          q: 'Who decides that one part of the 2 meter band is for simplex and another for repeaters?',
          review: 'band-plan',
          covers: ['T2A10'],
          choices: [
            { label: 'The FCC, by law', why: 'The FCC sets what is legal. Where each activity goes is a voluntary agreement on top of that.' },
            { label: 'Hams themselves, in a voluntary band plan', right: true, why: 'A band plan is a voluntary guideline for where modes and activities go in a band.' },
            { label: 'Each repeater owner, for their own area', why: 'A band plan is a shared guideline for everyone, not one owner\'s or one club\'s plan.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T2A01', 'T2A02', 'T2A03', 'T2A04', 'T2A05', 'T2A06', 'T2A07', 'T2A08', 'T2A09', 'T2A10', 'T2A11'],
      facts: [
        { icon: IconSimplex, text: 'Simplex means transmitting and receiving on the same frequency.', covers: ['T2A11'] },
        { icon: IconOffset, text: "A repeater's offset is the difference between its transmit and receive frequencies: usually 600 kHz on 2 meters and 5 MHz on 70 centimeters.", covers: ['T2A07', 'T2A01', 'T2A03'] },
        { icon: IconPlan, text: 'A band plan is a voluntary guideline for modes and activities in a band. The 2 meter FM simplex calling frequency is 146.520 MHz.', covers: ['T2A10', 'T2A02'] },
        { icon: IconCq, text: 'CQ means calling any station. On simplex, say CQ a few times, then "this is" and your call sign, then pause to listen.', covers: ['T2A08', 'T2A06'] },
        { icon: IconOrder, text: 'To answer a CQ, or to call a station you know: their call sign first, then yours.', covers: ['T2A05', 'T2A04'] },
        { icon: IconListen, text: 'On a repeater, show you are looking for a contact with your call sign and the word "listening".', covers: ['T2A09'] },
      ],
    },
  ],
};
export default LESSON;
