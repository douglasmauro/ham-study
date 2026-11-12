import { Art, Mini, T } from '../drawkit';
import type { Lesson } from '../types';

/*
 * Lesson 6: Capacitance, inductance and power (question group T5C, all 12 questions).
 * Every fact below comes from a T5C question and its keyed answer; the ids are in each
 * step's `covers`. The intro is the hand-animated `power` clip (P = I x E, 13.8 V x 10 A,
 * 120 W at 12 V). The power cards come first because they follow straight on from it.
 */

/* ---------- pictures ---------- */

const CELL = {
  top: 'M64 10L89.5 55H38.5Z',
  left: 'M38.5 55H64V98H14Z',
  right: 'M64 55H89.5L114 98H64Z',
};

/** The power triangle with the I corner covered: what is left, P over E, is the sum to do. T5C11 */
function CoverCurrent() {
  return (
    <Art label="The power triangle with P on top and I and E below. The I is covered. What is left is P over E: current equals power divided by voltage.">
      <path class="ga-fw ga-soft" d={CELL.left} />
      <path class="ga-fk ga-soft" d={CELL.top} />
      <path class="ga-fk ga-soft" d={CELL.right} />
      <path class="ga-k" d="M64 10L114 98H14ZM38.5 55H89.5M64 55V98" />
      <T x={64} y={46} c="ga-tl ga-tk" a="middle">P</T>
      <T x={46} y={88} c="ga-tl ga-tm" a="middle">I</T>
      <T x={82} y={88} c="ga-tl ga-tk" a="middle">E</T>
      <T x={138} y={30} c="ga-tm">Want I?</T>
      <T x={138} y={46} c="ga-tm">Cover the I.</T>
      <T x={138} y={76} c="ga-tl ga-tk">I = P ÷ E</T>
      <T x={138} y={96} c="ga-ts">P sits over E,</T>
      <T x={138} y={111} c="ga-ts">so divide</T>
      <T x={120} y={132} c="ga-tm" a="middle">amperes = watts ÷ volts</T>
    </Art>
  );
}

const BIG = { fontSize: '30px' };

/** kHz and MHz written large, with the letter that matters picked out. T5C06, T5C07 */
function Abbreviations() {
  return (
    <Art label="Two abbreviations written large. kHz, kilohertz, starts with a small k. MHz, megahertz, starts with a capital M. In both, hertz is a capital H and a small z.">
      <text x="50" y="48" class="ga-t ga-ts ga-tb" text-anchor="end" style={BIG}>k</text>
      <text x="52" y="48" class="ga-t ga-tk ga-tb" style={BIG}>Hz</text>
      <text x="162" y="48" class="ga-t ga-ts ga-tb" text-anchor="end" style={BIG}>M</text>
      <text x="164" y="48" class="ga-t ga-tk ga-tb" style={BIG}>Hz</text>
      <path class="ga-w ga-thin" d="M120 16V96" />
      <T x={62} y={70} a="middle" c="ga-tb">kilohertz</T>
      <T x={62} y={86} a="middle" c="ga-ts">small k for kilo</T>
      <T x={178} y={70} a="middle" c="ga-tb">megahertz</T>
      <T x={178} y={86} a="middle" c="ga-ts">capital M for mega</T>
      <T x={120} y={124} a="middle" c="ga-tk ga-tb">Hz: capital H, small z</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconCap = () => <Mini><path class="ls-mw" d="M4 24H18M30 24H44" /><path class="ls-mk" d="M18 8V40M30 8V40" /></Mini>;
const IconCoil = () => <Mini><path class="ls-mk" d="M4 28H8a5 7 0 0 1 10 0a5 7 0 0 1 10 0a5 7 0 0 1 10 0H44" /></Mini>;
const IconZ = () => <Mini><rect class="ls-mk" x="10" y="10" width="28" height="28" rx="5" /><text class="ls-mt" x="24" y="29.500" text-anchor="middle">Z</text></Mini>;
const IconHz = () => <Mini><text class="ls-mt" x="24" y="21" text-anchor="middle">kHz</text><text class="ls-mt" x="24" y="40" text-anchor="middle">MHz</text></Mini>;
const IconTri = ({ t, l, r }: { t: string; l: string; r: string }) => (
  <Mini>
    <path class="ls-mk ls-mthin" d="M24 2L46 44H2ZM13 23H35M24 23V44" />
    <text class="ls-mt" x="24" y="20" text-anchor="middle" style={{ fontSize: '10px' }}>{t}</text>
    <text class="ls-mt" x="16.500" y="39" text-anchor="middle" style={{ fontSize: '10px' }}>{l}</text>
    <text class="ls-mt" x="31.500" y="39" text-anchor="middle" style={{ fontSize: '10px' }}>{r}</text>
  </Mini>
);
const IconPower = () => <IconTri t="P" l="I" r="E" />;
const IconDivide = () => (
  <Mini>
    <text class="ls-mt" x="24" y="19" text-anchor="middle">P</text>
    <path class="ls-mk" d="M12 25H36" />
    <text class="ls-mt" x="24" y="42" text-anchor="middle">E</text>
  </Mini>
);

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't5c-capacitance-power',
  title: 'Capacitance, inductance and power',
  blurb: 'How to work out watts and amperes, two parts that store energy, and what impedance means.',
  sub: 'T5',
  groups: ['T5C'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'power',
      intro: 'Start with a short clip on power. After it you will work the sums yourself, then meet two parts that store energy.',
      covers: ['T5C08', 'T5C09', 'T5C11'],
    },
    {
      type: 'card',
      id: 'power',
      idea: 'Power is current times voltage',
      covers: ['T5C08', 'T5C09', 'T5C10'],
      picture: { art: 'power-formula' },
      heading: 'Power is current times voltage',
      text: [
        'Power is how fast energy is used, in watts. In a DC circuit, which is one fed by a steady supply such as a battery, the formula is P = I × E: power equals current in amperes times voltage in volts.',
        'A worked example: a radio draws 10 amperes from a 13.8 volt supply. 10 × 13.8 = 138, so it uses 138 watts.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'A small radio draws 2.5 amperes from a 12 volt battery. How many watts is that?',
            left: 'watts',
            top: '2.5 × 12',
            bottom: '',
            accept: [30, 30],
            traps: [
              { range: [4.8, 4.8], why: 'That is 12 divided by 2.5. Power is a multiplication: amperes times volts.' },
              { range: [0.2, 0.21], why: 'That is 2.5 divided by 12. Power is a multiplication: amperes times volts.' },
              { range: [14.5, 14.5], why: 'That is 12 plus 2.5. Multiply them instead: amperes times volts.' },
            ],
            hint: 'Not quite. Multiply the two numbers: 2.5 times 12.',
            answer: '30',
            working: ['2.5 × 12 = 30', '30 watts. P = I × E: amperes times volts gives watts.'],
          },
          {
            prompt: 'A 13.8 volt supply feeds a radio that draws 5 amperes. How many watts?',
            left: 'watts',
            top: '5 × 13.8',
            bottom: '',
            accept: [69, 69],
            traps: [
              { range: [2.7, 2.8], why: 'That is 13.8 divided by 5. Power is a multiplication: amperes times volts.' },
              { range: [0.36, 0.37], why: 'That is 5 divided by 13.8. Power is a multiplication: amperes times volts.' },
              { range: [18.8, 18.8], why: 'That is 13.8 plus 5. Multiply them instead: amperes times volts.' },
            ],
            hint: 'Not quite. Multiply the two numbers: 5 times 13.8.',
            answer: '69',
            working: ['5 × 13.8 = 69', '69 watts: half the current of the worked example, so half of its 138 watts.'],
          },
        ],
      },
      remember: 'Power in a DC circuit: P = I × E. Watts = amperes × volts.',
    },
    {
      type: 'card',
      id: 'current',
      idea: 'Current is power divided by voltage',
      covers: ['T5C11'],
      picture: { draw: CoverCurrent },
      heading: 'Turn it around to find the current',
      text: [
        'The triangle holds all three versions of the formula. Cover the letter you want. If the two left are side by side, multiply them. If one sits over the other, divide the top by the bottom.',
        'Cover I and P sits over E, so current is power divided by voltage. A 60 watt lamp on 12 volts draws 60 ÷ 12 = 5 amperes. Why it matters: this tells you how big a power supply your radio needs.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'A radio needs 120 watts and runs on 12 volts. How many amperes must the supply deliver?',
            left: 'amperes',
            top: '120 W',
            bottom: '12 V',
            accept: [10, 10],
            traps: [
              { range: [0.1, 0.1], why: 'That is 12 divided by 120. Turn it over: watts go on top.' },
              { range: [1440, 1440], why: 'That is 120 times 12. To find current you divide: watts on top, volts below.' },
              { range: [132, 132], why: 'That is 120 plus 12. Divide instead: watts on top, volts below.' },
            ],
            hint: 'Not quite. Ask how many times 12 fits into 120.',
            answer: '10',
            working: ['120 ÷ 12 = 10', '10 amperes. I = P ÷ E.'],
          },
          {
            prompt: 'The 30 watt radio from the last card runs on 12 volts. How many amperes does it draw?',
            left: 'amperes',
            top: '30 W',
            bottom: '12 V',
            accept: [2.5, 2.5],
            traps: [
              { range: [0.4, 0.4], why: 'That is 12 divided by 30. Turn it over: watts go on top.' },
              { range: [360, 360], why: 'That is 30 times 12. To find current you divide: watts on top, volts below.' },
            ],
            hint: 'Not quite. Divide 30 by 12. The answer is between 2 and 3.',
            answer: '2.5',
            working: ['30 ÷ 12 = 2.5', '2.5 amperes: the same radio as before, worked backwards.'],
          },
        ],
      },
      remember: 'Current = power ÷ voltage. 120 watts at 12 volts takes 10 amperes.',
    },
    {
      type: 'card',
      id: 'capacitance',
      idea: 'Capacitance: energy in an electric field',
      covers: ['T5C01', 'T5C02'],
      picture: { art: 'capacitance' },
      heading: 'Capacitance stores energy in an electric field',
      text: [
        'Now two parts that store energy instead of using it up. The first is a capacitor: two metal plates held apart. Charge them and an electric field forms between the plates, with energy stored in it.',
        'The ability to store energy in an electric field is called capacitance. It is measured in farads.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A part is marked in farads. What does it do?',
        options: [
          { id: 'heat', label: 'It opposes current and gets warm', why: 'That is resistance, measured in ohms. It uses energy up as heat and stores none.' },
          { id: 'elec', label: 'It stores energy in an electric field', right: true, why: 'Yes. The farad is the unit of capacitance, the ability to store energy in an electric field.' },
          { id: 'cycles', label: 'It counts cycles each second', why: 'Cycles each second is frequency, measured in hertz. Farads measure capacitance.' },
        ],
      },
      remember: 'Capacitance is the ability to store energy in an electric field. Its unit is the farad.',
    },
    {
      type: 'card',
      id: 'inductance',
      idea: 'Inductance: energy in a magnetic field',
      covers: ['T5C03', 'T5C04'],
      picture: { art: 'inductance' },
      heading: 'Inductance stores energy in a magnetic field',
      text: [
        'The second part is an inductor: a coil of wire. Current through the coil makes a magnetic field around it, and energy is stored in that field.',
        'The ability to store energy in a magnetic field is called inductance. It is measured in henrys. So: plates, electric field, farads. Coil, magnetic field, henrys.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which property does each of these belong to? Tap one, then tap capacitance or inductance.',
        slots: [
          { id: 'cap', label: 'Capacitance', sub: 'two plates', rule: 'Capacitance goes with an electric field and the farad.' },
          { id: 'ind', label: 'Inductance', sub: 'a coil', rule: 'Inductance goes with a magnetic field and the henry.' },
        ],
        items: [
          { id: 'mag', label: 'Magnetic field', slot: 'ind', why: 'Inductance is the ability to store energy in a magnetic field.' },
          { id: 'farad', label: 'Farad', slot: 'cap', why: 'The farad is the unit of capacitance.' },
          { id: 'elec', label: 'Electric field', slot: 'cap', why: 'Capacitance is the ability to store energy in an electric field.' },
          { id: 'henry', label: 'Henry', slot: 'ind', why: 'The henry is the unit of inductance.' },
        ],
      },
      remember: 'Inductance is the ability to store energy in a magnetic field. Its unit is the henry.',
    },
    {
      type: 'card',
      id: 'impedance',
      idea: 'Impedance opposes AC, in ohms',
      covers: ['T5C05', 'T5C12'],
      picture: { art: 'impedance' },
      heading: 'Impedance is the opposition to AC current',
      text: [
        'Resistance holds current back. With alternating current (AC), which is current that keeps swinging back and forth, coils and capacitors hold it back too. The total opposition to AC current flow is called impedance.',
        'Impedance is a kind of opposition, like resistance, so it has the same unit: the ohm. Why it matters: radios, feed lines and antennas each have an impedance, very often 50 ohms.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'An antenna is described as "50 somethings of impedance". Which unit is it?',
        options: [
          { id: 'f', label: '50 farads', why: 'Farads measure capacitance, the ability to store energy in an electric field.' },
          { id: 'h', label: '50 henrys', why: 'Henrys measure inductance, the ability to store energy in a magnetic field.' },
          { id: 'o', label: '50 ohms', right: true, why: 'Yes. Impedance is opposition to AC current, and opposition is measured in ohms.' },
        ],
      },
      remember: 'Impedance is the opposition to AC current flow. Its unit is the ohm.',
    },
    {
      type: 'card',
      id: 'abbreviations',
      idea: 'Writing kHz and MHz',
      covers: ['T5C06', 'T5C07'],
      picture: { draw: Abbreviations },
      heading: 'Write kHz and MHz with the right capitals',
      text: [
        'Frequencies are written with short forms, and the capitals matter. Hertz is always Hz: capital H, small z. Kilo, a thousand, is a small k. Mega, a million, is a capital M.',
        'So kilohertz is kHz and megahertz is MHz. A small m would mean milli, one thousandth, which is a very different size.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which of these are written correctly? Tap one, then tap where it goes.',
        slots: [
          { id: 'ok', label: 'Correct', rule: 'Only a small k or a capital M, followed by Hz, is correct.' },
          { id: 'no', label: 'Not correct', rule: 'That one follows the rule: a small k or a capital M, then Hz.' },
        ],
        items: [
          { id: 'a', label: 'KHz', slot: 'no', why: 'Kilo is a small k. A capital K is wrong.' },
          { id: 'b', label: 'MHz', slot: 'ok', why: 'Capital M for mega, then Hz. This is megahertz.' },
          { id: 'c', label: 'mHz', slot: 'no', why: 'A small m means milli, not mega. Megahertz needs a capital M.' },
          { id: 'd', label: 'kHz', slot: 'ok', why: 'Small k for kilo, then Hz. This is kilohertz.' },
          { id: 'e', label: 'Mhz', slot: 'no', why: 'Hertz is Hz with a capital H. A small h is wrong.' },
        ],
      },
      remember: 'Kilohertz is kHz. Megahertz is MHz.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T5C01', 'T5C03', 'T5C05', 'T5C08', 'T5C10', 'T5C11', 'T5C12'],
      questions: [
        {
          q: 'A power supply gives 12 volts and your radio draws 5 amperes from it. How much power is the radio using?',
          review: 'power',
          covers: ['T5C08', 'T5C10'],
          choices: [
            { label: '2.4 watts', why: 'That is 12 divided by 5. Power is amperes times volts.' },
            { label: '17 watts', why: 'That is 12 plus 5. Power is amperes times volts.' },
            { label: '60 watts', right: true, why: 'P = I × E, so 5 × 12 = 60 watts.' },
          ],
        },
        {
          q: 'A 24 watt lamp is connected to 12 volts. How much current flows through it?',
          review: 'current',
          covers: ['T5C11'],
          choices: [
            { label: '2 amperes', right: true, why: 'Current is power divided by voltage: 24 ÷ 12 = 2 amperes.' },
            { label: '0.5 amperes', why: 'That is 12 divided by 24. The watts go on top: 24 ÷ 12.' },
            { label: '288 amperes', why: 'That is 24 times 12. To find current, divide power by voltage.' },
          ],
        },
        {
          q: 'One part is a coil of wire. Another is two plates held apart. Which one stores energy in a magnetic field?',
          review: 'inductance',
          covers: ['T5C01', 'T5C03'],
          choices: [
            { label: 'The coil', right: true, why: 'A coil has inductance: it stores energy in a magnetic field.' },
            { label: 'The two plates', why: 'Two plates have capacitance. They store energy in an electric field, not a magnetic one.' },
            { label: 'Neither. Parts only use energy up', why: 'A resistor uses energy up as heat, but a coil and a capacitor both store it.' },
          ],
        },
        {
          q: 'What does the impedance of a circuit tell you?',
          review: 'impedance',
          covers: ['T5C05', 'T5C12'],
          choices: [
            { label: 'How much energy it can store', why: 'Storing energy is what capacitance and inductance describe.' },
            { label: 'How much it opposes AC current', right: true, why: 'Impedance is the opposition to AC current flow, measured in ohms.' },
            { label: 'How much power it can handle', why: 'Power handling is a rating in watts. Impedance is opposition, in ohms.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T5C01', 'T5C02', 'T5C03', 'T5C04', 'T5C05', 'T5C06', 'T5C07', 'T5C08', 'T5C09', 'T5C10', 'T5C11', 'T5C12'],
      facts: [
        { icon: IconPower, text: 'Power in a DC circuit: P = I × E. Watts = amperes × volts, so 13.8 volts at 10 amperes is 138 watts.', covers: ['T5C08', 'T5C09', 'T5C10'] },
        { icon: IconDivide, text: 'Current = power ÷ voltage. 120 watts at 12 volts takes 10 amperes.', covers: ['T5C11'] },
        { icon: IconCap, text: 'Capacitance is the ability to store energy in an electric field. Its unit is the farad.', covers: ['T5C01', 'T5C02'] },
        { icon: IconCoil, text: 'Inductance is the ability to store energy in a magnetic field. Its unit is the henry.', covers: ['T5C03', 'T5C04'] },
        { icon: IconZ, text: 'Impedance is the opposition to AC current flow. Its unit is the ohm.', covers: ['T5C05', 'T5C12'] },
        { icon: IconHz, text: 'Kilohertz is written kHz and megahertz is written MHz.', covers: ['T5C06', 'T5C07'] },
      ],
    },
  ],
};
export default LESSON;
