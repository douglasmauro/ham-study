import type { ComponentChildren } from 'preact';
import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Test instruments and soldering (question group T7D, all 11 questions).
 * Every exam fact comes from a T7D question and its keyed answer; the ids are in each step's
 * `covers`. Ohm's law (resistance = voltage divided by current) agrees with T5D. The charging
 * curve on the capacitor card is drawn qualitatively: its percentages are illustration only.
 */

/* ---------- picture parts ---------- */

const zig = (x: number, y: number) => `M${x} ${y}l5 -10l10 20l10 -20l10 20l10 -20l10 20l5 -10`;

/** Battery as in exam figure T-1, upright: long and short plates. (x, y) is the top plate. */
const Batt = ({ x, y }: { x: number; y: number }) => (
  <path class="ga-w" d={`M${x - 10} ${y}h20M${x - 5} ${y + 6}h10M${x - 10} ${y + 12}h20M${x - 5} ${y + 18}h10`} />
);

/** Round meter with a letter on its face. */
function Meter({ x, y, c = 'ga-k', children }: { x: number; y: number; c?: string; children: ComponentChildren }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} class={`${c} ga-fbg`} />
      <T x={x} y={y + 5} a="middle" c="ga-tk ga-tl">{children}</T>
    </g>
  );
}

/** Three meters, each named after its unit. T7D01, T7D04 */
function MeterTrio() {
  const m = [
    [44, 'V', 'voltmeter', 'volts'],
    [120, 'A', 'ammeter', 'amperes'],
    [196, 'Ω', 'ohmmeter', 'ohms'],
  ] as const;
  return (
    <Art label="Three meters side by side. A voltmeter, marked V, measures volts. An ammeter, marked A, measures amperes. An ohmmeter, marked Ω, measures ohms.">
      {m.map(([x, l, name, unit]) => (
        <>
          <circle cx={x} cy={48} r={22} class="ga-k ga-fbg" />
          <text x={x} y={56} class="ga-t ga-tk ga-tl ga-tb" text-anchor="middle">{l}</text>
          <T x={x} y={96} a="middle" c="ga-tk ga-tb">{name}</T>
          <T x={x} y={114} a="middle" c="ga-tm">{unit}</T>
        </>
      ))}
    </Art>
  );
}

/**
 * A battery and a resistor in a loop with two meters: meter 1 in the wire (series) and
 * meter 2 across the resistor (parallel). `want` is the meter the card asks for. T7D02, T7D03
 */
function TwoMeters({ want, picked, solved, onPick }: PicProps & { want: 'm1' | 'm2' }) {
  const tone = (id: string) => (picked !== id ? 'ga-k' : id === want && solved ? 'ga-good' : 'ga-bad');
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  return (
    <Art label={`A battery and a resistor in a loop. Meter 1 sits in the wire, so the current flows through it: in series. Meter 2 has one lead on each end of the resistor: in parallel.${solved ? ' Meter 1 is the ammeter, marked A. Meter 2 is the voltmeter, marked V.' : ''}`}>
      <path class="ga-w" d="M36 36V65M36 83V112H204V36H190M36 36H71M97 36H130" />
      <Batt x={36} y={65} />
      <T x={50} y={62} c="ga-tm">+</T>
      <path class="ga-w" d={zig(130, 36)} />
      <path class={tone('m2')} d="M130 36V76H147M190 36V76H173" />
      <circle cx={130} cy={36} r={3} class="ga-fk" />
      <circle cx={190} cy={36} r={3} class="ga-fk" />
      <Meter x={84} y={36} c={tone('m1')}>{solved ? 'A' : '1'}</Meter>
      <Meter x={160} y={76} c={tone('m2')}>{solved ? 'V' : '2'}</Meter>
      <T x={84} y={16} a="middle" c="ga-tm">meter 1</T>
      <T x={160} y={105} a="middle" c="ga-tm">meter 2</T>
      <T x={160} y={20} a="middle" c="ga-tm">resistor</T>
      {solved && <T x={120} y={132} a="middle" c="ga-tk ga-tb">{want === 'm2' ? 'meter 2 is across the part: in parallel' : 'meter 1 is in the wire: in series'}</T>}
      {onPick && <rect x="64" y="4" width="40" height="50" fill="transparent" style={hit} onClick={() => onPick('m1')} />}
      {onPick && <rect x="128" y="56" width="64" height="52" fill="transparent" style={hit} onClick={() => onPick('m2')} />}
    </Art>
  );
}
const VoltPick = (p: PicProps) => <TwoMeters {...p} want="m2" />;
const AmpPick = (p: PicProps) => <TwoMeters {...p} want="m1" />;

/** An ohmmeter charging a capacitor. `value` is time, 0 to 5. T7D10 */
const flow = (v: number) => Math.exp(-0.9 * v); // share of the first current still flowing
function CapCharge({ value = 0, solved }: PicProps) {
  const i = flow(value);
  const fillH = 48 * (1 - i);
  const px = 34 + 172 * (1 - i);
  return (
    <Art label={`An ohmmeter connected to a large capacitor. The capacitor is ${Math.round((1 - i) * 100)} percent charged, the current into it is ${i > 0.6 ? 'large' : i > 0.05 ? 'falling' : 'almost zero'}, and the meter's resistance reading is ${i > 0.6 ? 'low' : i > 0.05 ? 'rising' : 'high'}.`}>
      <path class="ga-w" d="M40 35V16H150V38M150 50V76H40V61" />
      <Meter x={40} y={48}>Ω</Meter>
      <path class="ga-w ga-thick" d="M136 38H164M136 52Q150 44 164 52" />
      <T x={140} y={92} a="middle" c="ga-tm">capacitor</T>
      {i > 0.03 && <path class="ga-s" d={`M62 26H${(70 + 60 * i).toFixed(1)}M${(64 + 60 * i).toFixed(1)} 21L${(70 + 60 * i).toFixed(1)} 26L${(64 + 60 * i).toFixed(1)} 31`} />}
      <T x={62} y={46} c="ga-ts">{i > 0.03 ? 'current' : 'no current'}</T>
      <rect class="ga-w" x="206" y="22" width="16" height="50" rx="2" />
      <rect class="ga-fk" x="207" y={(71 - fillH).toFixed(1)} width="14" height={fillH.toFixed(1)} />
      <T x={214} y={88} a="middle" c="ga-tm">charge</T>
      <path class="ga-w ga-thin" d="M34 114H206M34 109V119M206 109V119" />
      <path class={solved ? 'ga-fgood' : 'ga-fk'} d={`M${px.toFixed(1)} 112l-6 -10h12z`} />
      <T x={34} y={132} a="start" c="ga-tm">low</T>
      <T x={120} y={132} a="middle" c="ga-tk">resistance reading</T>
      <T x={206} y={132} a="end" c="ga-tm">high</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const MiniMeter = ({ x, y, l }: { x: number; y: number; l: string }) => (
  <><circle class="ls-mk" cx={x} cy={y} r="9" /><text class="ls-mt" x={x} y={y + 4} text-anchor="middle">{l}</text></>
);
const IconVolt = () => <Mini><path class="ls-mw" d="M4 16H44" /><path class="ls-mw ls-mthin" d="M12 16V34H15M36 16V34H33" /><MiniMeter x={24} y={34} l="V" /></Mini>;
const IconAmp = () => <Mini><path class="ls-mw" d="M4 24H15M33 24H44" /><MiniMeter x={24} y={24} l="A" /></Mini>;
const IconOhm = () => <Mini><MiniMeter x={24} y={20} l="Ω" /><path class="ls-mw ls-mthin" d="M10 40H38" /><path class="ls-mk ls-mthin" d="M24 34V44" /></Mini>;
const IconMulti = () => <Mini><rect class="ls-mk" x="12" y="4" width="24" height="40" rx="4" /><rect class="ls-mw" x="16" y="8" width="16" height="9" /><circle class="ls-mw" cx="24" cy="30" r="6" /></Mini>;
const IconCap = () => <Mini><path class="ls-ms" d="M6 40Q16 12 42 8" /><path class="ls-mw ls-mthin" d="M6 44H44M6 4V44" /></Mini>;
const IconSolder = () => <Mini><path class="ls-mw" d="M4 38H44" /><path class="ls-mk" d="M14 38Q24 18 34 38" /><path class="ls-ms ls-mthin" d="M30 6L22 20" /></Mini>;

/* ---------- the lesson ---------- */

export const T7D_TEST_INSTRUMENTS: Lesson = {
  id: 't7d-test-instruments',
  title: 'Test instruments and soldering',
  blurb: 'Which meter measures what, how each one connects, and how to make a good solder joint.',
  sub: 'T7',
  groups: ['T7D'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t7d-test-instruments',
      intro: 'Start with a short clip. After it you will connect each meter yourself.',
      covers: ['T7D01', 'T7D02', 'T7D03', 'T7D04', 'T7D05', 'T7D07', 'T7D08', 'T7D09', 'T7D11'],
    },
    {
      type: 'card',
      id: 'meters',
      idea: 'Each meter is named after its unit',
      covers: ['T7D01', 'T7D04'],
      picture: { draw: MeterTrio },
      heading: 'Three meters, each named after its unit',
      text: [
        'Voltage is the electrical push between two points. Its other name is electric potential, and it is measured in volts. Current is the flow of electricity, measured in amperes. Resistance is how much a part holds back the flow, measured in ohms.',
        'Each meter is named after its unit: a voltmeter reads volts, an ammeter reads amperes and an ohmmeter reads ohms.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Put each quantity with the meter that measures it. Tap a quantity, then tap the meter.',
        slots: [
          { id: 'v', label: 'Voltmeter', sub: 'volts', rule: 'A voltmeter measures voltage, the push.' },
          { id: 'a', label: 'Ammeter', sub: 'amperes', rule: 'An ammeter measures current, the flow.' },
          { id: 'o', label: 'Ohmmeter', sub: 'ohms', rule: 'An ohmmeter measures resistance.' },
        ],
        items: [
          { id: 'pot', label: 'Electric potential', slot: 'v', why: 'Electric potential is voltage, so a voltmeter measures it.' },
          { id: 'cur', label: 'Current', slot: 'a', why: 'Current is measured in amperes, with an ammeter.' },
          { id: 'res', label: 'Resistance', slot: 'o', why: 'Resistance is measured in ohms, with an ohmmeter.' },
          { id: 'push', label: 'Voltage', slot: 'v', why: 'Voltage is measured in volts, with a voltmeter.' },
        ],
      },
      remember: 'A voltmeter measures electric potential (voltage). An ammeter measures electric current.',
    },
    {
      type: 'card',
      id: 'voltmeter',
      idea: 'A voltmeter connects in parallel',
      covers: ['T7D02'],
      picture: { draw: VoltPick },
      heading: 'A voltmeter goes across the part: in parallel',
      text: [
        'Voltage is a difference between two points, so a voltmeter compares the two ends of a part. Touch one lead to each end. The circuit is not broken.',
        'That way of connecting, side by side with the part, is called in parallel.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which meter in this circuit is reading the voltage across the resistor? Tap a meter or an answer.',
        options: [
          { id: 'm1', label: 'Meter 1, in the wire', why: 'Meter 1 sits in the wire, so the current flows through it. That is how current is measured, not voltage.' },
          { id: 'm2', label: 'Meter 2, across the resistor', right: true, why: 'Yes. Meter 2 has one lead on each end of the resistor. It is connected in parallel, so it reads the voltage.' },
        ],
      },
      remember: 'A voltmeter is connected in parallel with the component.',
    },
    {
      type: 'card',
      id: 'ammeter',
      idea: 'An ammeter connects in series',
      covers: ['T7D03'],
      picture: { draw: AmpPick },
      heading: 'An ammeter goes in the wire: in series',
      text: [
        'Current is the flow. Think of a water meter: to count all the water, it has to be fitted into the pipe so the water runs through it. To measure current, you open the circuit and put the meter in the gap, so all the current flows through it.',
        'That way of connecting, one after the other on a single path, is called in series. A multimeter set to measure current connects the same way.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Same circuit. Which meter is reading the current? Tap a meter or an answer.',
        options: [
          { id: 'm2', label: 'Meter 2, across the resistor', why: 'Meter 2 sits beside the resistor, so the current does not have to pass through it. It reads voltage.' },
          { id: 'm1', label: 'Meter 1, in the wire', right: true, why: 'Yes. All the current flows through meter 1 on its way round. It is connected in series.' },
        ],
      },
      remember: 'To measure current, a meter is connected in series, so the current flows through it.',
    },
    {
      type: 'card',
      id: 'ohmmeter',
      idea: 'An ohmmeter needs the power off',
      covers: ['T7D05', 'T7D11'],
      picture: { art: 'ohmmeter' },
      heading: 'An ohmmeter brings its own current, so switch the power off',
      text: [
        'An ohmmeter has its own battery inside. It sends a small current through the part and measures the voltage that results. From the two it works out the resistance, using Ohm\'s law: resistance equals voltage divided by current.',
        'Any other voltage in the circuit would spoil that sum and could damage the meter. So before measuring resistance on a circuit board, make sure the circuit is not powered.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You want to check a resistor on your radio\'s circuit board with an ohmmeter. What do you do first?',
        options: [
          { id: 'on', label: 'Switch the radio on so the circuit is working', why: 'A working circuit has its own voltages. They spoil the reading and can damage the meter.' },
          { id: 'gnd', label: 'Connect the circuit to ground', why: 'The ohmmeter measures between its own two probes. Grounding the circuit is not what it needs.' },
          { id: 'off', label: 'Switch the radio off and unplug it', right: true, why: 'Yes. With no power, the only current is the meter\'s own, so the reading is right and the meter is safe.' },
        ],
      },
      remember: 'An ohmmeter applies a small current and measures the resulting voltage. Make sure the circuit is not powered before you measure.',
    },
    {
      type: 'card',
      id: 'multimeter',
      idea: 'A multimeter is three meters in one',
      covers: ['T7D06', 'T7D07'],
      picture: { art: 'multimeter' },
      heading: 'A multimeter: three meters in one box',
      text: [
        'A multimeter has a dial that picks the job: voltage, current or resistance. It cannot measure radio signals, such as signal strength or impedance at radio frequencies. Those need other instruments.',
        'Set the dial before you touch the probes. On the resistance setting the meter sends out its own small current and expects a dead circuit. Touching a live voltage on that setting can damage the meter.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your multimeter is left on the resistance setting, and you touch the probes to a live 12 volt supply. What can happen?',
        options: [
          { id: 'fine', label: 'It simply shows 12 volts', why: 'On the resistance setting the meter is not reading volts. It is sending out its own current.' },
          { id: 'dmg', label: 'The meter can be damaged', right: true, why: 'Yes. Measuring a voltage on the resistance setting can damage a multimeter. Turn the dial to volts first.' },
          { id: 'warm', label: 'Nothing, once the meter has warmed up', why: 'A multimeter does not need to warm up. The danger is the wrong setting, not the temperature.' },
        ],
      },
      remember: 'A multimeter measures voltage, current and resistance. Measuring voltage on the resistance setting can damage it.',
    },
    {
      type: 'card',
      id: 'capacitor',
      idea: 'A capacitor on an ohmmeter',
      covers: ['T7D10'],
      picture: { draw: CapCharge },
      heading: 'A discharged capacitor: the reading climbs',
      text: [
        'A capacitor stores electric charge. Touch an ohmmeter to a large, empty one and the meter\'s small current starts to fill it. At first a lot of current flows in, so the meter thinks the resistance is low.',
        'As the capacitor fills, less and less current flows. Less current means the meter shows more resistance.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Move time forward until the capacitor is full. Watch the resistance reading.',
        label: 'Time',
        min: 0,
        max: 5,
        step: 1,
        start: 0,
        readouts: (v) => {
          const i = flow(v);
          return [
            { label: 'Charge', value: `${Math.round((1 - i) * 100)}%` },
            { label: 'Reading', value: i > 0.6 ? 'low' : i > 0.05 ? 'rising' : 'high' },
          ];
        },
        goal: (v) => v === 5,
        hint: () => 'The capacitor is still filling and current is still flowing. Keep moving time forward.',
        done: 'Full. Almost no current flows now, so the meter reads a high resistance. The reading climbed the whole time.',
      },
      remember: 'An ohmmeter across a large, discharged capacitor shows increasing resistance with time.',
    },
    {
      type: 'card',
      id: 'solder',
      idea: 'Rosin-core solder and a shiny joint',
      covers: ['T7D08', 'T7D09'],
      picture: { art: 'cold-solder-joint' },
      heading: 'Soldering: the right solder and a shiny joint',
      text: [
        'Solder is a soft metal melted onto a joint to join wires and parts. Inside it is flux, a cleaner that helps it flow. Electronics use rosin-core solder, made with tin-lead or lead-free tin-copper. Never use acid-core solder: it is for plumbing, and its acid keeps eating the wires and parts.',
        'A good tin-lead joint is bright and shiny. A cold joint, one that was not hot enough or moved while it cooled, looks rough or lumpy, and it may not conduct well.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Sort each one. Tap it, then tap where it belongs.',
        slots: [
          { id: 'ok', label: 'Good for radio work', rule: 'This side is for good solder and good joints.' },
          { id: 'bad', label: 'Trouble', rule: 'This side is for solder or joints to avoid.' },
        ],
        items: [
          { id: 'rosin', label: 'Rosin-core solder', slot: 'ok', why: 'Rosin-core is the standard solder for electronics. Its flux is mild.' },
          { id: 'acid', label: 'Acid-core solder', slot: 'bad', why: 'Acid-core solder corrodes wires and parts. It is not for radio work.' },
          { id: 'shiny', label: 'Bright, shiny joint', slot: 'ok', why: 'Bright and shiny is what a good tin-lead joint looks like.' },
          { id: 'lumpy', label: 'Rough, lumpy joint', slot: 'bad', why: 'Rough or lumpy is a cold joint. Reheat it so the solder flows.' },
        ],
      },
      remember: 'Never use acid-core solder for radio work. A cold tin-lead joint looks rough or lumpy.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T7D03', 'T7D04', 'T7D11', 'T7D10', 'T7D08'],
      questions: [
        {
          q: 'You want to know how much current your radio draws from its power supply. How do you connect the meter?',
          review: 'ammeter',
          covers: ['T7D03', 'T7D04'],
          choices: [
            { label: 'Across the two supply terminals', why: 'Across the terminals is in parallel. That is how you measure voltage, not current.' },
            { label: 'In the wire, so the current flows through it', right: true, why: 'Current is measured in series: all of it has to pass through the meter.' },
            { label: 'From one supply terminal to ground', why: 'Current has to flow through the meter, so it goes in the wire, in series.' },
          ],
        },
        {
          q: 'You are about to measure a resistor that is still on a circuit board. What do you check first?',
          review: 'ohmmeter',
          covers: ['T7D05', 'T7D11'],
          choices: [
            { label: 'That the board has no power on it', right: true, why: 'The ohmmeter uses its own small current. Any other power spoils the reading and can harm the meter.' },
            { label: 'That the board is powered at the right voltage', why: 'There should be no power at all while you measure resistance.' },
            { label: 'That the board is running at the right frequency', why: 'The board should be off, so its frequency does not matter.' },
          ],
        },
        {
          q: 'You touch an ohmmeter to a big capacitor that has no charge in it. What does the reading do?',
          review: 'capacitor',
          covers: ['T7D10'],
          choices: [
            { label: 'It starts high and falls', why: 'It goes the other way. Current is largest at the start, so the reading starts low.' },
            { label: 'It starts low and climbs', right: true, why: 'As the capacitor fills, less current flows, so the resistance reading rises.' },
            { label: 'It holds still', why: 'The capacitor is charging, so the current and the reading change over time.' },
          ],
        },
        {
          q: 'Which solder belongs on your bench for building a radio kit?',
          review: 'solder',
          covers: ['T7D08'],
          choices: [
            { label: 'Acid-core solder', why: 'Acid-core solder corrodes wires and parts. It is for plumbing.' },
            { label: 'Rosin-core solder', right: true, why: 'Rosin-core is the standard for electronics. Its flux does not corrode the joint.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T7D01', 'T7D02', 'T7D03', 'T7D04', 'T7D05', 'T7D06', 'T7D07', 'T7D08', 'T7D09', 'T7D10', 'T7D11'],
      facts: [
        { icon: IconVolt, text: 'A voltmeter measures electric potential (voltage). It connects in parallel: one lead on each end of the part.', covers: ['T7D01', 'T7D02'] },
        { icon: IconAmp, text: 'An ammeter measures current. A meter measuring current connects in series, so the current flows through it.', covers: ['T7D03', 'T7D04'] },
        { icon: IconOhm, text: 'An ohmmeter applies a small current and measures the resulting voltage. The circuit must not be powered.', covers: ['T7D05', 'T7D11'] },
        { icon: IconMulti, text: 'A multimeter measures voltage, current and resistance. Measuring voltage on the resistance setting can damage it.', covers: ['T7D06', 'T7D07'] },
        { icon: IconCap, text: 'An ohmmeter across a large, discharged capacitor shows increasing resistance with time.', covers: ['T7D10'] },
        { icon: IconSolder, text: 'Never use acid-core solder for radio work. A cold tin-lead joint looks rough or lumpy; a good one is bright and shiny.', covers: ['T7D08', 'T7D09'] },
      ],
    },
  ],
};
export default T7D_TEST_INSTRUMENTS;
