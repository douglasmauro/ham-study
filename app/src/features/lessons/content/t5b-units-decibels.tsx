import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Units, prefixes and decibels (question group T5B, all 13 questions).
 * Every conversion and decibel value below comes from a T5B question and its keyed answer
 * or is the same sum with other numbers; the ids are in each step's `covers`.
 * The compute activity shows one division, so the "smaller unit, bigger number" direction
 * (a multiplication) is practised with a slider that moves the decimal point instead.
 */

/* ---------- pictures ---------- */

const RUNGS = ['giga', 'mega', 'kilo', 'unit', 'milli', 'micro', 'nano', 'pico'];

/** The prefix ladder: each rung is three decimal places. One side is lit, for going down or up. */
function Ladder({ dir, solved }: { dir: 'down' | 'up'; solved?: boolean }) {
  const down = dir === 'down';
  const lit = solved ? 'ga-good' : 'ga-k';
  const side = (on: boolean) => (on ? 'ga-tk ga-tb' : 'ga-tm');
  return (
    <Art label={`A ladder of metric prefixes, from giga at the top through mega, kilo, the plain unit, milli, micro and nano to pico at the bottom. Each rung is three decimal places. ${down
      ? 'Going down a rung, to a smaller unit, the decimal point moves three places to the right.'
      : 'Going up a rung, to a bigger unit, the decimal point moves three places to the left.'}`}>
      <path class="ga-w ga-thin" d={`M96 6V132M144 6V132${RUNGS.slice(1).map((_, i) => `M96 ${22.5 + i * 15.5}H144`).join('')}`} />
      {RUNGS.map((name, i) => (
        <T x={120} y={17.5 + i * 15.5} a="middle" c={name === 'unit' ? 'ga-tk ga-tb' : name === 'nano' ? 'ga-tm' : ''}>{name}</T>
      ))}
      <Arrow x1={86} y1={126} x2={86} y2={12} c={down ? 'ga-w ga-thin' : lit} h={7} />
      <T x={42} y={44} a="middle" c={side(!down)}>up a rung:</T>
      <T x={42} y={62} a="middle" c={side(!down)}>point moves</T>
      <T x={42} y={80} a="middle" c={side(!down)}>3 places</T>
      <T x={42} y={98} a="middle" c={side(!down)}>left</T>
      <Arrow x1={154} y1={12} x2={154} y2={126} c={down ? lit : 'ga-w ga-thin'} h={7} />
      <T x={198} y={44} a="middle" c={side(down)}>down a rung:</T>
      <T x={198} y={62} a="middle" c={side(down)}>point moves</T>
      <T x={198} y={80} a="middle" c={side(down)}>3 places</T>
      <T x={198} y={98} a="middle" c={side(down)}>right</T>
    </Art>
  );
}
const LadderDown = ({ solved }: PicProps) => <Ladder dir="down" solved={solved} />;
const LadderUp = ({ solved }: PicProps) => <Ladder dir="up" solved={solved} />;

/** Hz, kHz, MHz and GHz in a row, a thousand apart. T5B02, T5B13 */
function HertzRow() {
  const xs = [14, 72, 130, 188];
  return (
    <Art label="Four boxes in a row: hertz, kilohertz, megahertz and gigahertz. Each step to the right is a unit a thousand times bigger, so you divide the number by 1000. Each step to the left multiplies the number by 1000.">
      <T x={120} y={20} a="middle" c="ga-tk ga-tb">a step right: divide by 1000</T>
      <Arrow x1={24} y1={34} x2={216} y2={34} c="ga-k" h={7} />
      {['Hz', 'kHz', 'MHz', 'GHz'].map((u, i) => (
        <>
          <rect class="ga-fk ga-soft" x={xs[i]} y="50" width="38" height="30" rx="4" />
          <rect class="ga-k" x={xs[i]} y="50" width="38" height="30" rx="4" />
          <T x={xs[i] + 19} y={70} a="middle" c="ga-tb">{u}</T>
        </>
      ))}
      <Arrow x1={216} y1={96} x2={24} y2={96} c="ga-s" h={7} />
      <T x={120} y={120} a="middle" c="ga-ts ga-tb">a step left: multiply by 1000</T>
    </Art>
  );
}

/** Three bars to scale: a power, twice it and ten times it. T5B09, T5B11 */
function DbBars() {
  return (
    <Art label="Three bars drawn to scale. The first is the starting power. The second is twice as long: double the power, a gain of 3 decibels. The third is ten times as long: ten times the power, a gain of 10 decibels.">
      <T x={14} y={20} c="ga-tm">the power you start with</T>
      <rect class="ga-fw" x="14" y="26" width="20" height="10" rx="2" />
      <T x={14} y={62} c="ga-tb">2 times the power</T>
      <T x={226} y={62} a="end" c="ga-tk ga-tb">3 dB</T>
      <rect class="ga-fk" x="14" y="68" width="40" height="10" rx="2" />
      <T x={14} y={104} c="ga-tb">10 times the power</T>
      <T x={226} y={104} a="end" c="ga-tk ga-tb">10 dB</T>
      <rect class="ga-fk" x="14" y="110" width="200" height="10" rx="2" />
    </Art>
  );
}

const DB_RUNGS: [string, string][] = [['+10 dB', '10 times the power'], ['+6 dB', '4 times'], ['+3 dB', '2 times'], ['0 dB', 'no change'], ['−3 dB', 'one half'], ['−6 dB', 'one quarter'], ['−10 dB', 'one tenth']];

/** The decibel ladder: gains above zero, losses below. T5B09, T5B10, T5B11 */
function DbLadder() {
  return (
    <Art label="A decibel ladder. Plus 3 decibels is twice the power, plus 6 is four times and plus 10 is ten times. Zero decibels is no change. Minus 3 decibels is one half of the power, minus 6 is one quarter and minus 10 is one tenth.">
      <path class="ga-w ga-thin" d={`M100 12V128${DB_RUNGS.map((_, i) => `M94 ${17 + i * 17.5}H106`).join('')}`} />
      {DB_RUNGS.map(([db, means], i) => {
        const y = 21 + i * 17.5;
        const tone = i < 3 ? 'ga-tk' : i === 3 ? 'ga-tm' : 'ga-ts';
        return (
          <>
            <T x={86} y={y} a="end" c={`${tone} ga-tb`}>{db}</T>
            <T x={114} y={y} c={i === 3 ? 'ga-tm' : ''}>{means}</T>
          </>
        );
      })}
      <Arrow x1={20} y1={60} x2={20} y2={16} c="ga-k" h={6} />
      <Arrow x1={20} y1={82} x2={20} y2={126} c="ga-s" h={6} />
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconPrefix = () => <Mini><text class="ls-mt" x="24" y="20" text-anchor="middle">k M</text><text class="ls-mt" x="24" y="40" text-anchor="middle">m µ</text></Mini>;
const IconDown = () => <Mini><path class="ls-mw" d="M10 10H24M10 24H24M10 38H24" /><path class="ls-mk" d="M36 8V40M29 33L36 40L43 33" /></Mini>;
const IconUp = () => <Mini><path class="ls-mw" d="M10 10H24M10 24H24M10 38H24" /><path class="ls-mk" d="M36 40V8M29 15L36 8L43 15" /></Mini>;
const IconHz = () => <Mini><path class="ls-ms" d="M4 24C8 8 12 8 16 24S24 40 28 24S36 8 40 24" /><path class="ls-mw ls-mthin" d="M4 42H44" /></Mini>;
const IconCap = () => <Mini><path class="ls-mw" d="M4 24H19M29 24H44" /><path class="ls-mk" d="M19 10V38M29 10V38" /></Mini>;
const IconDb = () => <Mini><path class="ls-mw" d="M6 12H12" /><path class="ls-mk" d="M6 24H18M6 36H42" /></Mini>;

/* ---------- the lesson ---------- */

const moved = (v: number) => (v === 0 ? '1.5' : v < 4 ? `${15 * 10 ** (v - 1)}` : (15 * 10 ** (v - 1)).toLocaleString('en-US'));

const LESSON: Lesson = {
  id: 't5b-units-decibels',
  title: 'Units, prefixes and decibels',
  blurb: 'Kilo, mega, milli and micro, how to change from one to another, and what a decibel compares.',
  sub: 'T5',
  groups: ['T5B'],
  minutes: 9,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t5b-units-decibels',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T5B01', 'T5B02', 'T5B03', 'T5B04', 'T5B09', 'T5B11'],
    },
    {
      type: 'card',
      id: 'prefixes',
      idea: 'What the metric prefixes mean',
      covers: ['T5B03', 'T5B04'],
      picture: { art: 'metric-prefix' },
      heading: 'A prefix stands for a number',
      text: [
        'Radio uses very big and very small numbers. To keep them short, a metric prefix goes in front of the unit. Kilo (k) means one thousand, mega (M) means one million and giga (G) means one billion.',
        'For small amounts, milli (m) means one thousandth, micro (µ) means one millionth and pico (p) means one trillionth. So one kilovolt is one thousand volts, and one microvolt is one one-millionth of a volt.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'What does each prefix mean? Tap a prefix, then tap its meaning.',
        slots: [
          { id: 'k', label: 'One thousand', sub: '1000', rule: 'One thousand is kilo.' },
          { id: 'M', label: 'One million', sub: '1,000,000', rule: 'One million is mega.' },
          { id: 'm', label: 'One thousandth', sub: '0.001', rule: 'One thousandth is milli.' },
          { id: 'u', label: 'One millionth', sub: '0.000001', rule: 'One millionth is micro.' },
        ],
        items: [
          { id: 'milli', label: 'milli', slot: 'm', why: 'Milli means one thousandth. A milliampere is one thousandth of an ampere.' },
          { id: 'mega', label: 'mega', slot: 'M', why: 'Mega means one million. A megahertz is one million hertz.' },
          { id: 'micro', label: 'micro', slot: 'u', why: 'Micro means one millionth. A microvolt is one one-millionth of a volt.' },
          { id: 'kilo', label: 'kilo', slot: 'k', why: 'Kilo means one thousand. A kilovolt is one thousand volts.' },
        ],
      },
      remember: 'One kilovolt is one thousand volts. One microvolt is one one-millionth of a volt.',
    },
    {
      type: 'card',
      id: 'down',
      idea: 'To a smaller unit: the point moves right',
      covers: ['T5B01', 'T5B07'],
      picture: { draw: LadderDown },
      heading: 'Smaller unit, bigger number',
      text: [
        'Changing prefix never changes the amount, only how it is written. Think of a ladder. Each rung down is a unit a thousand times smaller, so it takes a thousand times as many of them: the decimal point moves three places to the right.',
        'Example: 3.525 MHz in kilohertz. Kilo is one rung below mega, so move the point three places right: 3525 kHz.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'How many milliamperes is 1.5 amperes? Milli is one rung below the plain unit. Move the decimal point to the right until the number is in milliamperes.',
        label: 'Decimal point',
        min: 0,
        max: 6,
        step: 1,
        start: 0,
        readouts: (v) => [{ label: 'Places moved right', value: `${v}` }, { label: 'The number reads', value: moved(v) }],
        goal: (v) => v === 3,
        hint: (v) => (v < 3 ? `${v === 1 ? 'One place is' : `${v} places are`} not enough. One rung down is three places.` : `${v} places is too far. One rung down is only three places.`),
        done: 'Three places right: 1.5 amperes is 1500 milliamperes. Same current, smaller unit, bigger number.',
      },
      remember: 'To change to a smaller unit, move the decimal point right, three places for each rung. 1.5 amperes = 1500 milliamperes. 3.525 MHz = 3525 kHz.',
    },
    {
      type: 'card',
      id: 'up',
      idea: 'To a bigger unit: the point moves left',
      covers: ['T5B05', 'T5B06', 'T5B12'],
      picture: { draw: LadderUp },
      heading: 'Bigger unit, smaller number',
      text: [
        'Going up the ladder is the reverse. Each rung up is a unit a thousand times bigger, so you need fewer of them: divide by 1000, which moves the decimal point three places to the left.',
        'Example: 500 milliwatts in watts. The plain unit is one rung above milli. 500 ÷ 1000 = 0.5, so 500 milliwatts is 0.5 watts.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'A power supply delivers 3000 milliamperes. How many amperes is that?',
            left: 'amperes',
            top: '3000 mA',
            bottom: '1000',
            accept: [3, 3],
            traps: [
              { range: [0.3, 0.3], why: 'That moves the point four places. One rung is three places.' },
              { range: [30, 30], why: 'That moves the point only two places. One rung is three places.' },
            ],
            hint: 'Not quite. Start from 3000 and move the decimal point three places to the left.',
            answer: '3',
            working: ['3000 ÷ 1000 = 3', '3000 milliamperes is 3 amperes. One rung up, three places left.'],
          },
          {
            prompt: 'A radio dial shows 28400 kHz. What is that in megahertz?',
            left: 'MHz',
            top: '28400 kHz',
            bottom: '1000',
            accept: [28.39, 28.41],
            traps: [
              { range: [2.84, 2.84], why: 'That moves the point four places. Kilo to mega is one rung: three places.' },
              { range: [284, 284], why: 'That moves the point only two places. Kilo to mega is one rung: three places.' },
            ],
            hint: 'Not quite. Start from 28400 and move the decimal point three places to the left.',
            answer: '28.4',
            working: ['28400 ÷ 1000 = 28.4', '28400 kHz is 28.400 MHz, a frequency in the 10 meter band.'],
          },
        ],
      },
      remember: 'To change to a bigger unit, move the decimal point left. 500 milliwatts = 0.5 watts. 3000 milliamperes = 3 amperes. 28400 kHz = 28.400 MHz.',
    },
    {
      type: 'card',
      id: 'hertz',
      idea: 'Hz, kHz, MHz and GHz',
      covers: ['T5B02', 'T5B13'],
      picture: { draw: HertzRow },
      heading: 'The same frequency, written four ways',
      text: [
        'You will use this most with frequency. Hertz, kilohertz, megahertz and gigahertz are each a thousand times the one before, and radios and band charts switch freely between them.',
        'Example: 7,100,000 Hz. One step up divides by 1000 and gives 7100 kHz. One more step gives 7.1 MHz. All three are the same frequency.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Find the same frequency in another unit. Tap a frequency, then tap its match.',
        slots: [
          { id: 'a', label: '1500 kHz', rule: '1500 kHz is 1500 thousand hertz, or one and a half megahertz.' },
          { id: 'b', label: '2.425 GHz', rule: '2.425 GHz is a thousand times as many megahertz.' },
          { id: 'c', label: '146.52 MHz', rule: '146.52 MHz is a thousand times as many kilohertz.' },
        ],
        items: [
          { id: 'hz', label: '1,500,000 Hz', slot: 'a', why: '1,500,000 ÷ 1000 = 1500. So 1,500,000 Hz is 1500 kHz.' },
          { id: 'mhz', label: '2425 MHz', slot: 'b', why: '2425 ÷ 1000 = 2.425. So 2425 MHz is 2.425 GHz.' },
          { id: 'khz', label: '146,520 kHz', slot: 'c', why: '146,520 ÷ 1000 = 146.52. So 146,520 kHz is 146.52 MHz.' },
          { id: 'mhz2', label: '1.5 MHz', slot: 'a', why: '1.5 × 1000 = 1500. So 1.5 MHz is 1500 kHz.' },
        ],
      },
      remember: '1,500,000 Hz = 1500 kHz. 2425 MHz = 2.425 GHz.',
    },
    {
      type: 'card',
      id: 'pico',
      idea: 'Picofarads to microfarads',
      covers: ['T5B08'],
      picture: { art: 'picofarad' },
      heading: 'Pico to micro is a million',
      text: [
        'A capacitor is a part you will meet in the next lesson. Its size is measured in farads, but real ones are tiny fractions of a farad: microfarads (µF) and picofarads (pF).',
        'On the ladder, pico is two rungs below micro. Two rungs is six places, a factor of one million. So picofarads divided by 1,000,000 gives microfarads. Example: 2,000,000 pF is 2 µF.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'A capacitor is marked 1,000,000 pF. How many microfarads is that?',
            left: 'µF',
            top: '1,000,000 pF',
            bottom: '1,000,000',
            accept: [1, 1],
            traps: [
              { range: [1000, 1000], why: 'That divides by one thousand. Pico to micro is two rungs: divide by one million.' },
              { range: [0.001, 0.001], why: 'That is too small. A million picofarads make exactly one microfarad.' },
            ],
            hint: 'Not quite. How many times does one million fit into one million?',
            answer: '1',
            working: ['1,000,000 ÷ 1,000,000 = 1', '1,000,000 picofarads is 1 microfarad.'],
          },
          {
            prompt: 'And a smaller one: 500,000 pF. How many microfarads?',
            left: 'µF',
            top: '500,000 pF',
            bottom: '1,000,000',
            accept: [0.5, 0.5],
            traps: [
              { range: [500, 500], why: 'That divides by one thousand. Pico to micro is two rungs: divide by one million.' },
              { range: [5, 5], why: 'Too big. 500,000 is only half of a million, so the answer is less than 1.' },
            ],
            hint: 'Not quite. 500,000 is half of one million.',
            answer: '0.5',
            working: ['500,000 ÷ 1,000,000 = 0.5', 'Half a million picofarads is half a microfarad.'],
          },
        ],
      },
      remember: '1,000,000 picofarads = 1 microfarad.',
    },
    {
      type: 'card',
      id: 'db-up',
      idea: 'Decibels: 3 dB doubles, 10 dB is ten times',
      covers: ['T5B09', 'T5B11'],
      picture: { draw: DbBars },
      heading: 'Decibels compare two powers',
      text: [
        'A decibel, written dB, is not an amount of power. It says how many times bigger one power is than another. Two values are worth knowing by heart: twice the power is 3 dB, and ten times the power is 10 dB.',
        'So first divide the new power by the old one. Example: going from 5 watts to 10 watts is 10 ÷ 5 = 2 times the power. Double is 3 dB.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'An amplifier raises your power from 20 watts to 200 watts. How many times bigger is the new power?',
            left: 'times',
            top: '200 W',
            bottom: '20 W',
            accept: [10, 10],
            traps: [
              { range: [180, 180], why: 'That is the number of watts added. Decibels go by how many times bigger: divide.' },
              { range: [4000, 4000], why: 'That is 200 times 20. Divide the new power by the old one.' },
              { range: [0.1, 0.1], why: 'That is the old power over the new. Put the new power on top.' },
            ],
            hint: 'Not quite. Ask how many 20s fit into 200.',
            answer: '10',
            working: ['200 ÷ 20 = 10', 'Ten times the power is 10 dB.'],
          },
          {
            prompt: 'Another radio goes from 25 watts to 50 watts. How many times bigger?',
            left: 'times',
            top: '50 W',
            bottom: '25 W',
            accept: [2, 2],
            traps: [
              { range: [25, 25], why: 'That is the number of watts added. Decibels go by how many times bigger: divide.' },
              { range: [0.5, 0.5], why: 'That is the old power over the new. Put the new power on top.' },
            ],
            hint: 'Not quite. Ask how many 25s fit into 50.',
            answer: '2',
            working: ['50 ÷ 25 = 2', 'Twice the power is 3 dB. It is the same 3 dB as going from 5 watts to 10 watts.'],
          },
        ],
      },
      remember: 'Doubling the power, such as 5 watts to 10 watts, is about 3 dB. Ten times the power, such as 20 watts to 200 watts, is 10 dB.',
    },
    {
      type: 'card',
      id: 'db-down',
      idea: 'Losses are negative, and decibels add',
      covers: ['T5B09', 'T5B10', 'T5B11'],
      picture: { draw: DbLadder },
      heading: 'Losses are negative, and decibels add up',
      text: [
        'When power goes down, the decibels are negative. Half the power is −3 dB.',
        'Decibels add. Take a drop from 12 watts to 3 watts. Halve 12 and you have 6. Halve again and you have 3. Two halvings is −3 dB and −3 dB: −6 dB, one quarter of the power. In the same way two doublings, 4 times the power, is +6 dB.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'How many decibels is each change? Tap a change, then tap its decibels.',
        slots: [
          { id: 'p3', label: '+3 dB', sub: 'double', rule: '+3 dB means the power doubled.' },
          { id: 'p10', label: '+10 dB', sub: 'ten times', rule: '+10 dB means ten times the power.' },
          { id: 'm3', label: '−3 dB', sub: 'one half', rule: '−3 dB means the power fell to one half.' },
          { id: 'm6', label: '−6 dB', sub: 'one quarter', rule: '−6 dB means the power fell to one quarter.' },
        ],
        items: [
          { id: 'a', label: '40 W to 10 W', slot: 'm6', why: '40 halves to 20, and 20 halves to 10. Two halvings: −6 dB.' },
          { id: 'b', label: '4 W to 8 W', slot: 'p3', why: '8 ÷ 4 = 2. Twice the power is +3 dB.' },
          { id: 'c', label: '100 W to 50 W', slot: 'm3', why: '50 is half of 100. Half the power is −3 dB.' },
          { id: 'd', label: '5 W to 50 W', slot: 'p10', why: '50 ÷ 5 = 10. Ten times the power is +10 dB.' },
        ],
      },
      remember: 'A drop to one quarter of the power, such as 12 watts to 3 watts, is about −6 dB.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T5B01', 'T5B03', 'T5B04', 'T5B06', 'T5B07', 'T5B09', 'T5B11'],
      questions: [
        {
          q: 'Which of these is the biggest voltage?',
          review: 'prefixes',
          covers: ['T5B03', 'T5B04'],
          choices: [
            { label: '1 microvolt', why: 'Micro means one millionth. That is the smallest of the three.' },
            { label: '1 millivolt', why: 'Milli means one thousandth. That is still less than one volt.' },
            { label: '1 kilovolt', right: true, why: 'Kilo means one thousand, so one kilovolt is one thousand volts.' },
          ],
        },
        {
          q: 'A repeater is listed as 146.52 MHz. What is that in kilohertz?',
          review: 'down',
          covers: ['T5B07'],
          choices: [
            { label: '0.14652 kHz', why: 'The point went the wrong way. Kilohertz are smaller than megahertz, so the number must get bigger.' },
            { label: '146,520 kHz', right: true, why: 'One rung down, so the point moves three places right: 146.52 becomes 146,520.' },
            { label: '1465.2 kHz', why: 'That moves the point only one place. One rung is three places.' },
          ],
        },
        {
          q: 'A battery charger is rated at 2500 milliamperes. How many amperes is that?',
          review: 'up',
          covers: ['T5B01', 'T5B06'],
          choices: [
            { label: '2.5 amperes', right: true, why: '2500 ÷ 1000 = 2.5. One rung up, three places left.' },
            { label: '25 amperes', why: 'That moves the point only two places. Milli to the plain unit is three places.' },
            { label: '2,500,000 amperes', why: 'The point went the wrong way. Amperes are bigger than milliamperes, so the number must get smaller.' },
          ],
        },
        {
          q: 'You turn your transmitter up from 10 watts to 100 watts. What is the change in decibels?',
          review: 'db-up',
          covers: ['T5B09', 'T5B11'],
          choices: [
            { label: '3 dB', why: '3 dB is only double. Double 10 watts would be 20 watts.' },
            { label: '10 dB', right: true, why: '100 ÷ 10 = 10. Ten times the power is 10 dB.' },
            { label: '90 dB', why: 'That is the number of watts added. Decibels go by how many times bigger, not by watts added.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T5B01', 'T5B02', 'T5B03', 'T5B04', 'T5B05', 'T5B06', 'T5B07', 'T5B08', 'T5B09', 'T5B10', 'T5B11', 'T5B12', 'T5B13'],
      facts: [
        { icon: IconPrefix, text: 'Kilo is a thousand, mega a million, milli a thousandth, micro a millionth. One kilovolt is 1000 volts. One microvolt is one one-millionth of a volt.', covers: ['T5B03', 'T5B04'] },
        { icon: IconDown, text: 'To a smaller unit the point moves right: 1.5 amperes = 1500 milliamperes, and 3.525 MHz = 3525 kHz.', covers: ['T5B01', 'T5B07'] },
        { icon: IconUp, text: 'To a bigger unit the point moves left: 500 milliwatts = 0.5 watts, 3000 milliamperes = 3 amperes, 28400 kHz = 28.400 MHz.', covers: ['T5B05', 'T5B06', 'T5B12'] },
        { icon: IconHz, text: '1,500,000 Hz = 1500 kHz. 2425 MHz = 2.425 GHz.', covers: ['T5B02', 'T5B13'] },
        { icon: IconCap, text: '1,000,000 picofarads = 1 microfarad.', covers: ['T5B08'] },
        { icon: IconDb, text: 'Twice the power is 3 dB. Ten times is 10 dB. One quarter is −6 dB.', covers: ['T5B09', 'T5B10', 'T5B11'] },
      ],
    },
  ],
};
export default LESSON;
