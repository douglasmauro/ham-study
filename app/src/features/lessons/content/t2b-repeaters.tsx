import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Repeaters and FM operating (question group T2B, all 14 questions).
 * Every exam fact below comes from a T2B question and its keyed answer; the ids are in each
 * step's `covers`. The intro is the hand-animated `repeater` clip, which also reviews the
 * offsets taught in T2A. People and call signs: Doug, KJ7ABC, and his friend Jeff, K7DEF.
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

const Cross = ({ x, y }: { x: number; y: number }) => <path class="ga-bad ga-thick" d={`M${x - 6} ${y - 6}l12 12M${x + 6} ${y - 6}l-12 12`} />;

/* ---------- pictures ---------- */

/** Doug hears the repeater, but it ignores him. Three settings to check. T2B04 */
function CantGetIn({ solved }: PicProps) {
  const chips = [['offset', 14], ['CTCSS tone', 88], ['DCS code', 162]] as const;
  return (
    <Art label="Doug hears the repeater's output clearly, but his own signal does not get in: the repeater ignores him. Three settings to check: the offset, the CTCSS tone and the DCS code.">
      <path class="ga-w ga-thin" d="M8 96H232" />
      <Tower x={204} base={96} h={66} />
      <HT x={28} y={62} c="ga-k" />
      <Arrow x1={190} y1={38} x2={42} y2={58} c="ga-k ga-thick" />
      <T x={112} y={36} a="middle" c="ga-tk ga-tb">Doug hears it</T>
      <Arrow x1={42} y1={78} x2={188} y2={78} c="ga-s ga-dash" />
      <Cross x={160} y={78} />
      <T x={100} y={70} a="middle" c="ga-ts">it ignores Doug</T>
      {chips.map(([label, x]) => (
        <>
          <rect class={solved ? 'ga-good' : 'ga-w ga-thin'} x={x} y="106" width="64" height="24" rx="5" />
          <T x={x + 32} y={122} a="middle" c={solved ? 'ga-tb' : 'ga-tm'}>{label}</T>
        </>
      ))}
    </Art>
  );
}

/** With reverse on, Doug listens on the input and hears Jeff directly. T2B01, T2B09 */
function ReverseCheck({ solved }: PicProps) {
  return (
    <Art label={`Jeff transmits up to the repeater on its input, and the repeater sends him out on its output to Doug. With reverse on, Doug listens on the input instead and hears Jeff directly.${solved ? ' So they can move to a simplex channel.' : ''}`}>
      <Tower x={120} base={66} h={44} />
      <HT x={26} y={76} c="ga-k" />
      <HT x={214} y={76} />
      <Arrow x1={204} y1={70} x2={134} y2={34} c="ga-s" />
      <Arrow x1={106} y1={34} x2={36} y2={70} c="ga-w" />
      <T x={210} y={36} a="end" c="ga-ts ga-tb">input</T>
      <T x={30} y={36} c="ga-tm">output</T>
      <Arrow x1={200} y1={92} x2={42} y2={92} c={`${solved ? 'ga-good' : 'ga-k'} ga-dash ga-thick`} />
      <T x={120} y={84} a="middle" c="ga-tk ga-tb">reverse: heard directly</T>
      <T x={26} y={118} a="middle" c="ga-tm">Doug</T>
      <T x={214} y={118} a="middle" c="ga-tm">Jeff</T>
      <T x={120} y={134} a="middle" c={solved ? 'ga-tk ga-tb' : 'ga-tm'}>{solved ? 'so they can use simplex' : 'Doug hears Jeff directly'}</T>
    </Art>
  );
}

/** How far the FM signal swings, against what the receiver accepts. `value` is voice level. T2B05 */
function Deviation({ value = 8 }: PicProps) {
  const half = value * 12;
  const fits = value <= 5 && value >= 3;
  const over = value > 5;
  const status = over ? 'too wide: loud words drop out' : value < 3 ? 'very small: Doug sounds quiet' : 'fits: every word gets through';
  return (
    <Art label={`Doug's FM signal swings ${over ? 'past the edges of' : 'inside'} the range Jeff's receiver accepts. ${status}.`}>
      <T x={120} y={18} a="middle" c="ga-tm">what Jeff's receiver accepts</T>
      <rect class="ga-fk ga-soft" x="60" y="28" width="120" height="44" />
      <path class="ga-k" d="M60 26V74M180 26V74" />
      <path class="ga-w ga-thin ga-dash" d="M120 28V72" />
      <Arrow x1={120} y1={50} x2={120 + half} y2={50} c={`${fits ? 'ga-good' : 'ga-s'} ga-thick`} />
      <Arrow x1={120} y1={50} x2={120 - half} y2={50} c={`${fits ? 'ga-good' : 'ga-s'} ga-thick`} />
      {over && <path class="ga-bad ga-thick" d={`M${120 - half} 50H60M180 50H${120 + half}`} />}
      <T x={120} y={92} a="middle" c="ga-tb">the swing: deviation</T>
      <T x={120} y={120} a="middle" c={fits ? 'ga-tk ga-tb' : 'ga-tb'}>{status}</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconSquelch = () => <Mini><path class="ls-mw" d="M6 24h8l10 -10v20l-10 -10" /><path class="ls-mk" d="M30 18l12 12M42 18l-12 12" /></Mini>;
const IconAccess = () => <Mini><path class="ls-mw" d="M10 12h12v26h-12ZM18 12v-6" /><path class="ls-ms" d="M26 26h8" /><path class="ls-mk" d="M38 18V36M34 22l4 -4l4 4" /></Mini>;
const IconReverse = () => <Mini><path class="ls-mk" d="M8 16H38M32 10l6 6l-6 6M40 32H10M16 26l-6 6l6 6" /></Mini>;
const IconLoud = () => <Mini><path class="ls-mw ls-mthin" d="M14 10V38M34 10V38" /><path class="ls-ms" d="M24 24H44M4 24H24" /><path class="ls-mk" d="M4 18v12M44 18v12" /></Mini>;
const IconDmr = () => <Mini><path class="ls-ms" d="M4 30h6v-12h6v12h8v-12h4v12h6v-12h6v12h4" /></Mini>;
const IconQ = () => <Mini><text class="ls-mt" x="24" y="30" text-anchor="middle">QSY</text></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't2b-repeaters',
  title: 'Repeaters and FM operating',
  blurb: 'Squelch and access tones, reverse, linked repeaters, DMR talkgroups and sharing a frequency.',
  sub: 'T2',
  groups: ['T2B'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'repeater',
      intro: 'Start with a one-minute clip on how a repeater works. After it you will try each idea yourself.',
      covers: ['T2B02', 'T2B04'],
    },
    {
      type: 'card',
      id: 'squelch',
      idea: 'Squelch mutes the receiver when no signal is present',
      covers: ['T2B13'],
      picture: { art: 'squelch' },
      heading: 'Squelch: silence until a signal arrives',
      text: [
        'With no signal coming in, an FM receiver makes a loud hiss. Doug leaves his radio on the repeater all afternoon, waiting for Jeff to call. He does not want hours of hiss.',
        'The squelch is a gate in the receiver. It mutes the audio while no signal is present and opens as soon as one arrives.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What does the squelch do for Doug?',
        options: [
          { id: 'clicks', label: 'Cleans up clicks in his Morse code signal', why: 'Key clicks come from a Morse transmitter switching too sharply. Squelch is a receiver feature and does not touch them.' },
          { id: 'mute', label: 'Keeps the speaker quiet until a signal arrives', right: true, why: 'Yes. Squelch mutes the receiver audio when no signal is present.' },
          { id: 'pops', label: 'Removes popping noise from car engines', why: 'Popping impulse noise is the job of a noise blanker. Squelch only mutes the audio when no signal is there.' },
        ],
      },
      remember: 'Squelch mutes the receiver audio when a signal is not present.',
    },
    {
      type: 'card',
      id: 'tones',
      idea: 'CTCSS, DCS and DTMF tones',
      covers: ['T2B02', 'T2B06'],
      picture: { art: 'ctcss' },
      heading: 'Tones that open a receiver, and keypad tones',
      text: [
        'Many repeaters stay shut unless your signal carries the right code. CTCSS is a steady tone, too low to hear, sent along with your voice the whole time you talk. A receiver set for that tone opens its squelch only when it hears it. DCS does the same job with a digital code.',
        'DTMF is different: the tones of a telephone keypad. Each key sends two audio tones at once. Repeaters use them for control commands.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Put each description with its name. Tap a description, then tap the name.',
        slots: [
          { id: 'ctcss', label: 'CTCSS', rule: 'CTCSS is one steady low tone sent under your voice.' },
          { id: 'dcs', label: 'DCS', rule: 'DCS is a digital code sent with your voice.' },
          { id: 'dtmf', label: 'DTMF', rule: 'DTMF is two keypad tones sent at once.' },
        ],
        items: [
          { id: 'a', label: 'A steady tone, too low to hear, under your voice', slot: 'ctcss', why: 'Right. CTCSS is a sub-audible tone sent along with your voice to open a receiver\'s squelch.' },
          { id: 'b', label: 'Two tones at once each time you press a key', slot: 'dtmf', why: 'Right. DTMF means dual-tone: each key sends two tones together.' },
          { id: 'c', label: 'A digital code sent along with your voice', slot: 'dcs', why: 'Right. DCS opens a receiver with a digital code instead of a tone.' },
          { id: 'd', label: 'The sounds of a touch-tone phone', slot: 'dtmf', why: 'Right. DTMF is the same system as a touch-tone telephone keypad.' },
        ],
      },
      remember: "CTCSS is a sub-audible tone sent with your voice to open a receiver's squelch. DTMF sends two tones at once.",
    },
    {
      type: 'card',
      id: 'cant-get-in',
      idea: 'Hearing a repeater but not getting in',
      covers: ['T2B04'],
      picture: { draw: CantGetIn },
      heading: 'You can hear the repeater, but it cannot hear you',
      text: [
        'Doug hears the repeater clearly, yet when he talks it stays silent. Hearing it only proves his receiver is set right. Getting in depends on what he transmits.',
        'Three settings change only his transmitted signal: the offset, which puts him on the input frequency, and the CTCSS tone or DCS code the repeater requires. Any one of them set wrong keeps him out.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which of these could keep Doug out of the repeater?',
        options: [
          { id: 'offset', label: 'Only a wrong offset', why: 'A wrong offset could do it, but it is not the only setting that can.' },
          { id: 'tone', label: 'Only a wrong CTCSS tone', why: 'A wrong tone could do it, but so could a wrong offset or a wrong DCS code.' },
          { id: 'all', label: 'A wrong offset, CTCSS tone or DCS code', right: true, why: 'Yes. Any one of these set wrong means the repeater never hears him, or ignores him.' },
        ],
      },
      remember: 'If you hear a repeater but cannot get in, check your offset and your CTCSS tone or DCS code.',
    },
    {
      type: 'card',
      id: 'reverse',
      idea: 'Reverse and simplex channels',
      covers: ['T2B01', 'T2B09'],
      picture: { draw: ReverseCheck },
      heading: 'Reverse: can you hear each other directly?',
      text: [
        "Normally Doug listens on the repeater's output and transmits on its input. The reverse function swaps them, so he listens on the repeater's input: the frequency Jeff transmits on.",
        'If Doug hears Jeff there, they are close enough to talk without the repeater. Band plans set aside simplex channels so stations within range of each other can talk without tying up a repeater.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug presses reverse and hears Jeff loud and clear. What should they do?',
        options: [
          { id: 'stay', label: 'Stay on the repeater, since it is there to be used', why: 'They do not need it. A simplex channel lets them talk directly and leaves the repeater free for others.' },
          { id: 'power', label: 'Keep reverse on, because it raises his power', why: 'Reverse does not change power. It only swaps the frequencies he listens and transmits on.' },
          { id: 'simplex', label: 'Move to a simplex channel', right: true, why: 'Yes. They hear each other directly, so they leave the repeater free for others.' },
        ],
      },
      remember: "Reverse lets you listen on a repeater's input frequency. Simplex channels let stations in range of each other talk without tying up a repeater.",
    },
    {
      type: 'card',
      id: 'linked',
      idea: 'Linked repeater networks',
      covers: ['T2B03'],
      picture: { art: 'linked-repeater-network' },
      heading: 'Linked repeaters: in at one, out at all',
      text: [
        'Some repeaters are joined together, by radio links or over the internet, into a linked network.',
        'A signal received by any one of them is transmitted by all of them. Doug talks into his local repeater and is heard across the whole area the network covers.',
      ],
      interaction: {
        kind: 'choice',
        prompt: "Doug's repeater is linked with two others in nearby towns. Jeff listens near the farthest one. Does Jeff hear Doug?",
        options: [
          { id: 'own', label: "No, only Doug's own repeater sends him out", why: 'That is a single repeater. In a linked network every repeater sends out what one receives.' },
          { id: 'all', label: 'Yes, every repeater in the network sends Doug out', right: true, why: 'Yes. Signals received by one repeater are transmitted by all the repeaters in the network.' },
          { id: 'control', label: 'Only if Jeff is the control operator', why: 'Who the control operator is has nothing to do with it. Linking is what carries the signal.' },
        ],
      },
      remember: 'In a linked repeater network, signals received by one repeater are transmitted by all the repeaters in the network.',
    },
    {
      type: 'card',
      id: 'loud',
      idea: 'Talking too loudly',
      covers: ['T2B05'],
      picture: { draw: Deviation },
      heading: 'Talking too loudly makes FM audio drop out',
      text: [
        "In FM, your voice swings the signal's frequency back and forth. The louder you speak, the wider the swing. That swing is called deviation.",
        "Jeff's receiver passes swings up to a certain width. Speak too loudly and, on your loudest words, the signal swings past it and the audio drops out. Too little deviation just makes you sound quiet.",
      ],
      interaction: {
        kind: 'slider',
        prompt: "Doug's audio drops out on loud words. Lower his voice until the swing fits inside what Jeff's receiver accepts.",
        label: 'Voice level',
        min: 1,
        max: 9,
        step: 1,
        start: 8,
        readouts: (v) => [
          { label: 'Voice', value: v > 5 ? 'too loud' : v < 3 ? 'very quiet' : 'normal' },
          { label: 'Swing', value: v > 5 ? 'too wide' : v < 3 ? 'very small' : 'fits' },
        ],
        goal: (v) => v >= 3 && v <= 5,
        hint: (v) => (v > 5 ? 'Still too loud. The swing goes past the edges, so his loudest words drop out. Lower it.' : 'Now the swing is very small and Doug sounds quiet. Raise it a little.'),
        done: 'That fits. At a normal speaking level the swing stays inside what the receiver accepts, so every word gets through.',
      },
      remember: 'Talking too loudly causes too much deviation, and FM audio drops out on voice peaks.',
    },
    {
      type: 'card',
      id: 'digital',
      idea: 'DMR talkgroups and the color code',
      covers: ['T2B07', 'T2B12', 'T2B14'],
      picture: { art: 'talkgroup' },
      heading: 'DMR: talkgroups and the color code',
      text: [
        'DMR is a digital voice system. Many conversations share one DMR repeater, sorted into talkgroups. A talkgroup is an identifier, a number, that tags traffic so you hear only the groups you chose. To join one, you program its ID into your radio.',
        'A DMR repeater also has a color code: an access code that must be programmed into your radio to use that repeater. It does the job a CTCSS tone does on FM.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which one is it? Tap a description, then tap talkgroup or color code.',
        slots: [
          { id: 'tg', label: 'Talkgroup', rule: 'A talkgroup is an ID that sorts traffic, and you join one by programming its ID.' },
          { id: 'cc', label: 'Color code', rule: 'The color code is the access code a particular repeater requires.' },
        ],
        items: [
          { id: 'a', label: 'Must match the repeater, or it ignores you', slot: 'cc', why: 'Right. Without the right color code programmed in, the repeater will not respond.' },
          { id: 'b', label: 'Sorts traffic so you hear only your group', slot: 'tg', why: 'Right. A talkgroup organizes traffic so you are not bothered by everything else.' },
          { id: 'c', label: 'Does the job a CTCSS tone does on FM', slot: 'cc', why: 'Right. Like a CTCSS tone, the color code is what lets you into the repeater.' },
          { id: 'd', label: 'You join one by programming its ID', slot: 'tg', why: "Right. Program the group's ID or code into your radio and you are in." },
        ],
      },
      remember: 'A talkgroup is a DMR identifier that sorts traffic: join one by programming its ID into your radio. The color code is an access code your radio needs to use a particular DMR repeater.',
    },
    {
      type: 'card',
      id: 'qsignals',
      idea: 'QRM, QSY and sharing a frequency',
      covers: ['T2B08', 'T2B10', 'T2B11'],
      picture: { art: 'q-signal' },
      heading: 'Sharing a frequency: QRM and QSY',
      text: [
        'Q signals are three-letter shorthand. QRM means interference from other stations: think M for man-made. QRN is static from nature, such as lightning: N for natural. QSY means changing frequency.',
        "No amateur station owns a frequency, not even the one that was there first. If Doug and another station keep interfering with each other, they talk it over and agree how to use it. Often one says: \"Let's QSY.\"",
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which Q signal fits? Tap what Doug wants to say, then tap the Q signal.',
        slots: [
          { id: 'qrm', label: 'QRM', rule: 'QRM is interference from other stations.' },
          { id: 'qrn', label: 'QRN', rule: 'QRN is static from natural sources.' },
          { id: 'qsy', label: 'QSY', rule: 'QSY means changing frequency.' },
        ],
        items: [
          { id: 'a', label: 'Another station is talking over Jeff', slot: 'qrm', why: 'Right. QRM is interference from other stations. M for man-made.' },
          { id: 'b', label: "Let's move to another frequency", slot: 'qsy', why: 'Right. QSY means changing frequency.' },
          { id: 'c', label: 'Lightning crashes are loud tonight', slot: 'qrn', why: 'Right. QRN is natural static. N for natural.' },
        ],
      },
      remember: 'QRM is interference from other stations. QSY means changing frequency. Stations that interfere with each other negotiate continued use of the frequency.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T2B02', 'T2B04', 'T2B05', 'T2B07', 'T2B08', 'T2B14'],
      questions: [
        {
          q: 'Doug can hear a repeater, but it never responds when he talks. His offset is right. What should he check next?',
          review: 'cant-get-in',
          covers: ['T2B04', 'T2B02'],
          choices: [
            { label: 'His squelch setting', why: 'Squelch only changes what Doug hears. The repeater never sees it.' },
            { label: 'His CTCSS tone or DCS code', right: true, why: 'The repeater may require a tone or code, and his must match it.' },
            { label: 'His volume', why: 'Volume only changes what Doug hears, not what he transmits.' },
          ],
        },
        {
          q: 'Jeff talks on a DMR talkgroup. How does Doug join it?',
          review: 'digital',
          covers: ['T2B07', 'T2B14'],
          choices: [
            { label: "Program the talkgroup's ID into his radio", right: true, why: 'A talkgroup is picked by its ID. Program it in and Doug hears that group.' },
            { label: 'Ask the repeater control operator to sign him up', why: 'No sign-up is needed. The talkgroup is chosen in his own radio.' },
            { label: "Send the talkgroup's DTMF tone", why: 'DTMF tones are analog keypad tones. Talkgroups are picked by an ID number.' },
          ],
        },
        {
          q: 'Doug and another station keep transmitting over each other on the same frequency. What should happen?',
          review: 'qsignals',
          covers: ['T2B08'],
          choices: [
            { label: 'Whoever was there first keeps it', why: 'Being first gives no special right. No amateur station owns a frequency.' },
            { label: 'They talk it over and agree how to use it', right: true, why: 'Neither has a better claim, so they negotiate: take turns, or one moves.' },
            { label: 'Both turn on a CTCSS tone and carry on', why: 'A tone only hides the other signal from your speaker. Both still transmit on top of each other.' },
          ],
        },
        {
          q: "Jeff says Doug's audio cuts out on his loudest words. What should Doug do?",
          review: 'loud',
          covers: ['T2B05'],
          choices: [
            { label: 'Turn his transmit power up', why: 'More power makes the signal stronger. It does not make the swing smaller.' },
            { label: 'Switch on reverse', why: 'Reverse only swaps the frequencies he listens and transmits on.' },
            { label: 'Speak more quietly', right: true, why: 'Talking too loudly causes too much deviation. A normal voice keeps the swing inside what the receiver accepts.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T2B01', 'T2B02', 'T2B03', 'T2B04', 'T2B05', 'T2B06', 'T2B07', 'T2B08', 'T2B09', 'T2B10', 'T2B11', 'T2B12', 'T2B13', 'T2B14'],
      facts: [
        { icon: IconSquelch, text: "Squelch mutes the receiver when no signal is present. CTCSS is a sub-audible tone sent with your voice to open a receiver's squelch. DTMF sends two tones at once.", covers: ['T2B13', 'T2B02', 'T2B06'] },
        { icon: IconAccess, text: 'Hear a repeater but cannot get in? Check your offset, your CTCSS tone and your DCS code.', covers: ['T2B04'] },
        { icon: IconReverse, text: "Reverse listens on a repeater's input. Simplex channels let nearby stations talk without tying up a repeater. In a linked network, what one repeater hears, all of them send out.", covers: ['T2B01', 'T2B09', 'T2B03'] },
        { icon: IconLoud, text: 'Talking too loudly causes too much deviation, and FM audio drops out on voice peaks.', covers: ['T2B05'] },
        { icon: IconDmr, text: 'A DMR talkgroup is an ID that sorts traffic: program its ID to join. The color code is an access code needed to use a particular DMR repeater.', covers: ['T2B07', 'T2B14', 'T2B12'] },
        { icon: IconQ, text: 'QRM is interference from other stations. QSY means changing frequency. Stations that interfere negotiate use of the frequency.', covers: ['T2B10', 'T2B11', 'T2B08'] },
      ],
    },
  ],
};
export default LESSON;
