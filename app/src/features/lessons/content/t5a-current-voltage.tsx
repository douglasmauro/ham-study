import { Arrow, Art, Mini, T, fineWave } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Current, voltage and resistance (question group T5A, all 11 questions).
 * Every exam fact below comes from a T5A question and its keyed answer; the ids are in each
 * step's `covers`. The water-in-a-pipe comparison is the one the pool explanations use.
 */

/* ---------- pictures ---------- */

/** A metal wire with loose electrons beside a block of glass with held electrons. T5A07, T5A08 */
function TwoMaterials() {
  return (
    <Art label="On the left a metal wire: its free electrons drift along, so current flows. On the right a block of glass: its electrons are held in place, so almost no current flows.">
      <T x={62} y={18} a="middle" c="ga-tk ga-tb">metal</T>
      <path class="ga-k" d="M14 36H110M14 64H110" />
      {[26, 44, 62, 80, 98].map((x) => <circle class="ga-fs" cx={x} cy="50" r="4" />)}
      <Arrow x1={30} y1={82} x2={94} y2={82} />
      <T x={62} y={104} a="middle" c="ga-tb">free electrons</T>
      <T x={62} y={122} a="middle" c="ga-tm">current flows</T>
      <path class="ga-w ga-thin ga-dash" d="M120 12V128" />
      <T x={178} y={18} a="middle" c="ga-tb">glass</T>
      <rect class="ga-w" x="134" y="32" width="88" height="36" rx="4" />
      {[150, 169, 188, 207].map((x) => (
        <>
          <circle class="ga-w ga-thin" cx={x} cy="50" r="7" />
          <circle class="ga-fw" cx={x} cy="50" r="3" />
        </>
      ))}
      <T x={178} y={104} a="middle" c="ga-tb">held electrons</T>
      <T x={178} y={122} a="middle" c="ga-tm">almost no current</T>
    </Art>
  );
}

/** One second of an alternating current. `value` is the number of complete cycles in it. T5A04, T5A06 */
function CyclesInSecond({ value = 1, solved }: PicProps) {
  return (
    <Art label={`One second of an alternating current. It makes ${value} complete ${value === 1 ? 'cycle' : 'cycles'} in that second, so its frequency is ${value} hertz.`}>
      <path class="ga-w ga-thin" d="M20 50H220" />
      <path class="ga-s" d={fineWave(20, 220, 50, 200 / value, 26)} />
      <T x={10} y={32} a="middle" c="ga-tm">+</T>
      <T x={10} y={76} a="middle" c="ga-tm">−</T>
      <path class={solved ? 'ga-good' : 'ga-k'} d="M20 88V98M20 93H220M220 88V98" />
      <T x={120} y={110} a="middle" c="ga-tm">one second</T>
      <T x={120} y={130} a="middle" c="ga-tk ga-tb">{`${value} ${value === 1 ? 'cycle' : 'cycles'} each second = ${value} Hz`}</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconCurrent = () => <Mini><path class="ls-mw" d="M4 14H44M4 34H44" /><path class="ls-ms" d="M10 24H36M30 18L36 24L30 30" /></Mini>;
const IconPush = () => <Mini><path class="ls-mw" d="M10 12V36M17 18V30" /><path class="ls-mk" d="M34 40V8M27 15L34 8L41 15" /></Mini>;
const IconMetal = () => <Mini><path class="ls-mk" d="M4 12H44M4 26H44" /><path class="ls-ms" d="M12 19H13M24 19H25M36 19H37" /><rect class="ls-mw" x="8" y="34" width="32" height="10" rx="2" /></Mini>;
const IconAc = () => <Mini><path class="ls-mw ls-mthin" d="M4 24H44" /><path class="ls-ms" d="M4 24C9 4 15 4 20 24S31 44 36 24S41 10 44 14" /></Mini>;
const IconResist = () => <Mini><path class="ls-mk" d="M4 24H10L13 14L19 34L25 14L31 34L35 24H44" /></Mini>;
const IconPower = () => <Mini><path class="ls-mk" d="M16 40V30A8 8 0 0 1 32 30V40M10 40H38" /><path class="ls-ms" d="M24 6V14M9 14L14 19M39 14L34 19" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't5a-current-voltage',
  title: 'Current, voltage and resistance',
  blurb: 'What flows in a wire, what pushes it, what holds it back, and the unit for each.',
  sub: 'T5',
  groups: ['T5A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t5a-current-voltage',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T5A01', 'T5A02', 'T5A03', 'T5A04', 'T5A05', 'T5A06', 'T5A09', 'T5A10', 'T5A11'],
    },
    {
      type: 'card',
      id: 'current',
      idea: 'Current is the flow of electrons',
      covers: ['T5A01', 'T5A03'],
      picture: { art: 'current' },
      heading: 'Current is electrons flowing',
      text: [
        'Electrons are tiny charged particles found in every material. When they move along a wire, that flow of electrons is called current.',
        'Think of water in a pipe. Current is how much flows past each second. It is measured in amperes, or amps for short.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your radio draws 2 amperes from its battery. What does that number measure?',
        options: [
          { id: 'life', label: 'How long the battery will last', why: 'Amperes do not count time. They say how much is flowing right now.' },
          { id: 'flow', label: 'The current: how much electron flow', right: true, why: 'Yes. Current is the flow of electrons, and amperes are its unit.' },
        ],
      },
      remember: 'The flow of electrons in a circuit is called current. Current is measured in amperes.',
    },
    {
      type: 'card',
      id: 'voltage',
      idea: 'Voltage is the push',
      covers: ['T5A05'],
      picture: { art: 'voltage' },
      heading: 'Voltage is the push that makes them flow',
      text: [
        'Water flows through a pipe only when the pressure is higher at one end than at the other. Electrons are the same. The electrical pressure is called voltage, and it is measured in volts.',
        'A battery keeps a difference in voltage between its two terminals. That difference is what causes electrons to flow. No difference, no flow.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Both ends of a wire touch the same battery terminal, so there is no difference in voltage between them. Does current flow through the wire?',
        options: [
          { id: 'yes', label: 'Yes. The wire is touching a battery', why: 'Touching a battery is not enough. Electrons flow only when there is a difference in voltage between the two ends.' },
          { id: 'no', label: 'No. Nothing is pushing the electrons', right: true, why: 'Right. A difference in voltage is what causes electron flow. With no difference there is no push.' },
        ],
      },
      remember: 'A difference in voltage causes electron flow.',
    },
    {
      type: 'card',
      id: 'conductors',
      idea: 'Conductors and insulators',
      covers: ['T5A07', 'T5A08'],
      picture: { draw: TwoMaterials },
      heading: 'Conductors let current through. Insulators do not',
      text: [
        'A conductor is a material that current flows through easily. Metals are generally good conductors because they have many free electrons: loose electrons that can drift from atom to atom. A few other things conduct too, such as sea water.',
        'An insulator holds its electrons tightly, so almost no current flows. Glass is a good insulator. So is the plastic jacket on a wire, which keeps the current inside.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Conductor or insulator? Tap a material, then tap where it goes.',
        slots: [
          { id: 'con', label: 'Conductor', sub: 'current flows easily', rule: 'A conductor lets current flow easily.' },
          { id: 'ins', label: 'Insulator', sub: 'almost no current', rule: 'An insulator lets almost no current through.' },
        ],
        items: [
          { id: 'cu', label: 'Copper wire', slot: 'con', why: 'Copper is a metal. Metals have many free electrons, so they conduct well.' },
          { id: 'gl', label: 'Glass', slot: 'ins', why: 'Glass holds its electrons tightly. It is a good insulator.' },
          { id: 'ss', label: 'Stainless steel', slot: 'con', why: 'Stainless steel is a metal, with many free electrons. It conducts.' },
          { id: 'sw', label: 'Sea water', slot: 'con', why: 'Sea water is not a metal, but it does conduct electricity.' },
        ],
      },
      remember: 'Metals are good conductors because they have many free electrons. Glass is a good insulator.',
    },
    {
      type: 'card',
      id: 'ac',
      idea: 'Alternating current reverses direction',
      covers: ['T5A09'],
      picture: { art: 'ac' },
      heading: 'Direct current goes one way. Alternating current reverses',
      text: [
        'Current from a battery always flows the same way. That is direct current, or DC.',
        'Alternating current, or AC, flows one way, then turns around and flows the other way, again and again. Call one direction positive and the other negative: AC alternates between the two. The power in a wall outlet is AC, and so is a radio signal.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which of these currents is alternating current?',
        options: [
          { id: 'pulse', label: 'It flows forward, stops, then flows forward again', why: 'Switching on and off is not reversing. This current only ever goes one way, so it is still direct current.' },
          { id: 'rev', label: 'It flows forward, then backward, again and again', right: true, why: 'Yes. Alternating current alternates between positive and negative directions.' },
        ],
      },
      remember: 'Alternating current alternates between positive and negative directions.',
    },
    {
      type: 'card',
      id: 'frequency',
      idea: 'Frequency is cycles each second, in hertz',
      covers: ['T5A04', 'T5A06'],
      picture: { draw: CyclesInSecond },
      heading: 'Frequency counts the cycles each second',
      text: [
        'One swing forward and one swing back make one complete cycle. Frequency is the number of times each second that an alternating current makes a complete cycle.',
        'The unit of frequency is the hertz, written Hz. One hertz is one cycle each second. Radio signals make millions of cycles each second.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Raise the frequency until the current makes 4 complete cycles in one second.',
        label: 'Frequency',
        min: 1,
        max: 6,
        step: 1,
        start: 1,
        readouts: (v) => [{ label: 'Cycles each second', value: `${v}` }, { label: 'Frequency', value: `${v} Hz` }],
        goal: (v) => v === 4,
        hint: (v) => (v < 4 ? `That is ${v} ${v === 1 ? 'cycle' : 'cycles'} in the second. Raise the frequency to fit more in.` : `That is ${v} cycles in the second. Lower the frequency to fit fewer in.`),
        done: 'There: 4 complete cycles in one second is a frequency of 4 hertz.',
      },
      remember: 'Frequency is the number of times per second that an alternating current makes a complete cycle. Its unit is the hertz.',
    },
    {
      type: 'card',
      id: 'resistance',
      idea: 'Resistance opposes every kind of current',
      covers: ['T5A11'],
      picture: { art: 'resistance' },
      heading: 'Resistance opposes the flow',
      text: [
        'Resistance is the opposition to the flow of current, like a narrow stretch of pipe holding back water. More resistance means less current. It is measured in ohms.',
        'Resistance does not care what kind of current it is. It opposes direct current, alternating current, and RF current, which is alternating current that reverses at radio frequencies.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'An RF current flows through a resistor inside your radio. Does the resistor oppose it?',
        options: [
          { id: 'dc', label: 'No. Resistance only opposes direct current', why: 'Resistance is not limited to direct current. It opposes current that reverses as well.' },
          { id: 'fast', label: 'No. RF reverses too quickly to be opposed', why: 'How quickly the current reverses makes no difference. Resistance opposes it all the same.' },
          { id: 'all', label: 'Yes. Resistance opposes every kind of current', right: true, why: 'Right. Resistance opposes direct current, alternating current and RF current alike.' },
        ],
      },
      remember: 'Resistance opposes all current flow: direct current, alternating current and RF current.',
    },
    {
      type: 'card',
      id: 'power',
      idea: 'Power is the rate of using energy, in watts',
      covers: ['T5A01', 'T5A02', 'T5A06', 'T5A10'],
      picture: { art: 'power' },
      heading: 'Power is how fast energy is used',
      text: [
        'Power is the rate at which electrical energy is used: how fast, not how much in total. It is measured in watts. A 50 watt transmitter uses energy ten times as fast as a 5 watt handheld.',
        'Do not confuse watts with watt-hours. A watt-hour is an amount of energy, the total used over time. That makes four units so far. Sort them out below.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each unit to what it measures. Tap a unit, then tap what it measures.',
        slots: [
          { id: 'i', label: 'Current', sub: 'the flow of electrons', rule: 'Current is measured in amperes.' },
          { id: 'e', label: 'Voltage', sub: 'the push', rule: 'Voltage is measured in volts.' },
          { id: 'p', label: 'Power', sub: 'how fast energy is used', rule: 'Power is measured in watts.' },
          { id: 'f', label: 'Frequency', sub: 'cycles each second', rule: 'Frequency is measured in hertz.' },
        ],
        items: [
          { id: 'w', label: 'Watts', slot: 'p', why: 'Watts measure power, the rate at which electrical energy is used.' },
          { id: 'a', label: 'Amperes', slot: 'i', why: 'Amperes measure current, the flow of electrons.' },
          { id: 'h', label: 'Hertz', slot: 'f', why: 'Hertz measure frequency. One hertz is one cycle each second.' },
          { id: 'v', label: 'Volts', slot: 'e', why: 'Volts measure voltage, the push that makes electrons flow.' },
        ],
      },
      remember: 'Power is the rate at which electrical energy is used. Power is measured in watts.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T5A02', 'T5A03', 'T5A04', 'T5A05', 'T5A06', 'T5A07', 'T5A08', 'T5A10'],
      questions: [
        {
          q: 'Picture water moving through a garden hose. Which electrical quantity is like the water pressure that makes it move?',
          review: 'voltage',
          covers: ['T5A03', 'T5A05'],
          choices: [
            { label: 'Current', why: 'Current is like the moving water itself, not the pressure behind it.' },
            { label: 'Voltage', right: true, why: 'Voltage is the push. A difference in voltage is what causes electrons to flow.' },
            { label: 'Power', why: 'Power is how fast energy is used. It is not the push that starts the flow.' },
          ],
        },
        {
          q: 'A cable has copper inside and a plastic jacket outside. Why does the copper carry the current?',
          review: 'conductors',
          covers: ['T5A07', 'T5A08'],
          choices: [
            { label: 'Copper is heavier than plastic', why: 'Weight has nothing to do with it. What matters is whether electrons are free to move.' },
            { label: 'Copper has many free electrons', right: true, why: 'Metals are good conductors because they have many free electrons.' },
            { label: 'Plastic has too many free electrons', why: 'It is the other way round. An insulator such as plastic holds its electrons tightly.' },
          ],
        },
        {
          q: 'A current makes 50 complete cycles every second. How would you state its frequency?',
          review: 'frequency',
          covers: ['T5A04', 'T5A06'],
          choices: [
            { label: '50 amperes', why: 'Amperes measure how much current flows, not how often it reverses.' },
            { label: '50 watts', why: 'Watts measure power, the rate of using energy.' },
            { label: '50 hertz', right: true, why: 'Frequency is cycles each second, and its unit is the hertz.' },
          ],
        },
        {
          q: 'One lamp is marked 10 watts and another 100 watts. What does the larger number tell you?',
          review: 'power',
          covers: ['T5A02', 'T5A10'],
          choices: [
            { label: 'It uses electrical energy faster', right: true, why: 'Watts measure power, and power is the rate at which electrical energy is used.' },
            { label: 'It has more resistance', why: 'Resistance is measured in ohms, not watts.' },
            { label: 'Its current reverses more often', why: 'How often a current reverses is its frequency, measured in hertz.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T5A01', 'T5A02', 'T5A03', 'T5A04', 'T5A05', 'T5A06', 'T5A07', 'T5A08', 'T5A09', 'T5A10', 'T5A11'],
      facts: [
        { icon: IconCurrent, text: 'Current is the flow of electrons. It is measured in amperes.', covers: ['T5A01', 'T5A03'] },
        { icon: IconPush, text: 'A difference in voltage causes electron flow.', covers: ['T5A05'] },
        { icon: IconMetal, text: 'Metals conduct well because they have many free electrons. Glass is a good insulator.', covers: ['T5A07', 'T5A08'] },
        { icon: IconAc, text: 'Alternating current alternates between positive and negative directions. Frequency is its complete cycles per second, in hertz.', covers: ['T5A04', 'T5A06', 'T5A09'] },
        { icon: IconResist, text: 'Resistance opposes all current: direct current, alternating current and RF current.', covers: ['T5A11'] },
        { icon: IconPower, text: 'Power is the rate at which electrical energy is used. It is measured in watts.', covers: ['T5A02', 'T5A10'] },
      ],
    },
  ],
};
export default LESSON;
