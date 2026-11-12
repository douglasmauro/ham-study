import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Resistors, capacitors, inductors and batteries (question group T6A, all 11 questions).
 * Every exam fact below comes from a T6A question and its keyed answer; the ids are in each
 * step's `covers`. The switch symbols match component 3 of the official Figure T-2, and the
 * adjustable resistor symbol matches component 9 of the same figure.
 */

/* ---------- pictures ---------- */

const ZIG: [number, number][] = [[30, 50], [35, 40], [45, 60], [55, 40], [65, 60], [75, 40], [85, 60], [90, 50]];
const f1 = (v: number) => +v.toFixed(1);

/** The zigzag cut at x: the part before the cut and the part after it, as two paths. */
function cutZig(x: number): [string, string] {
  const a: string[] = [];
  const b: string[] = [];
  for (let i = 0; i < ZIG.length - 1; i++) {
    const [x0, y0] = ZIG[i];
    const [x1, y1] = ZIG[i + 1];
    if (x >= x1) a.push(`M${x0} ${y0}L${x1} ${y1}`);
    else if (x <= x0) b.push(`M${x0} ${y0}L${x1} ${y1}`);
    else {
      const y = f1(y0 + ((y1 - y0) * (x - x0)) / (x1 - x0));
      a.push(`M${x0} ${y0}L${x} ${y}`);
      b.push(`M${x} ${y}L${x1} ${y1}`);
    }
  }
  return [a.join(''), b.join('')];
}

/** A potentiometer: its symbol with a contact that slides, and the knob that moves it. `value` is 0 to 10. T6A02, T6A03 */
function Pot({ value = 2, solved }: PicProps) {
  const x = 30 + 6 * value;
  const [used, rest] = cutZig(x);
  const ang = ((-135 + 27 * value) * Math.PI) / 180; // pointer angle, 0 is straight up
  const cx = 180;
  const cy = 54;
  const px = f1(cx + 17 * Math.sin(ang));
  const py = f1(cy - 17 * Math.cos(ang));
  const ticks = [-135, -67.5, 0, 67.5, 135].map((d) => {
    const r = (d * Math.PI) / 180;
    return `M${f1(cx + 28 * Math.sin(r))} ${f1(cy - 28 * Math.cos(r))}L${f1(cx + 33 * Math.sin(r))} ${f1(cy - 33 * Math.cos(r))}`;
  }).join('');
  return (
    <Art label={`A potentiometer. On the left is its symbol: a resistor zigzag with a sliding contact touching it. On the right is its knob. The knob is at ${value} out of 10, so ${value * 1000} ohms of the resistor is in the path.`}>
      <path class="ga-w" d="M12 50H30M90 50H110" />
      {rest && <path class="ga-w" d={rest} />}
      {used && <path class={solved ? 'ga-good' : 'ga-k'} d={used} />}
      <path class="ga-s" d={`M${f1(x)} 86H102V50`} />
      <Arrow x1={f1(x)} y1={86} x2={f1(x)} y2={66} c="ga-s" h={6} />
      <circle class="ga-fw" cx="102" cy="50" r="3" />
      <T x={61} y={110} a="middle" c="ga-tm">symbol</T>
      <circle class="ga-w" cx={cx} cy={cy} r="23" />
      <path class="ga-w ga-thin" d={ticks} />
      <path class="ga-s ga-thick" d={`M${cx} ${cy}L${px} ${py}`} />
      <T x={cx} y={110} a="middle" c="ga-tm">knob</T>
      <T x={120} y={130} a="middle" c="ga-tk ga-tb">the knob slides the contact</T>
    </Art>
  );
}

/** Two switches side by side: A is single-throw, B is double-throw. Either can be tapped. T6A08, T6A09 */
function TwoSwitches({ picked, solved, onPick }: PicProps) {
  const tone = (id: string) => (picked !== id ? 'ga-k' : id === 'b' && solved ? 'ga-good' : id === 'b' ? 'ga-k' : 'ga-bad');
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  return (
    <Art label="Two switches. Switch A has one arm and one contact. Switch B has one arm that can rest on either of two contacts.">
      <T x={56} y={22} a="middle" c="ga-tl">A</T>
      <path class="ga-w" d="M10 68H24M88 68H102" />
      <path class={`${tone('a')} ga-thick`} d="M31 66L80 50" />
      <circle class={tone('a')} cx="28" cy="68" r="4" />
      <circle class={tone('a')} cx="84" cy="68" r="4" />
      <T x={56} y={106} a="middle" c="ga-tm">1 arm</T>
      <T x={56} y={122} a="middle" c="ga-tm">1 contact</T>

      <T x={180} y={22} a="middle" c="ga-tl">B</T>
      <path class="ga-w" d="M134 68H148M212 46H228M212 90H228" />
      <path class={`${tone('b')} ga-thick`} d="M155 66L204 49" />
      <path class={`${tone('b')} ga-thin ga-dash`} d="M155 70L204 87" />
      <circle class={tone('b')} cx="152" cy="68" r="4" />
      <circle class={tone('b')} cx="208" cy="46" r="4" />
      <circle class={tone('b')} cx="208" cy="90" r="4" />
      <T x={180} y={122} a="middle" c="ga-tm">1 arm, 2 contacts</T>
      {onPick && <rect x="4" y="6" width="112" height="124" style={hit} onClick={() => onPick('a')} />}
      {onPick && <rect x="124" y="6" width="112" height="124" style={hit} onClick={() => onPick('b')} />}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconResistor = () => <Mini><path class="ls-mk" d="M3 24H9L12 15L18 33L24 15L30 33L36 15L39 24H45" /></Mini>;
const IconPot = () => <Mini><path class="ls-mk" d="M3 18H9L12 9L18 27L24 9L30 27L36 9L39 18H45" /><path class="ls-ms" d="M24 44V31M19 36L24 31L29 36" /></Mini>;
const IconCap = () => <Mini><path class="ls-mw" d="M4 24H19M29 24H44" /><path class="ls-mk" d="M19 9V39M29 9V39" /></Mini>;
const IconCoil = () => <Mini><path class="ls-mk" d="M3 30H8A5.300 7 0 0 1 18.600 30A5.300 7 0 0 1 29.200 30A5.300 7 0 0 1 39.800 30H45" /></Mini>;
const IconSwitch = () => <Mini><path class="ls-mw" d="M3 28H10M40 28H45" /><path class="ls-mk" d="M15 26L34 15" /><circle class="ls-mk" cx="12" cy="28" r="3" /><circle class="ls-mk" cx="37" cy="28" r="3" /></Mini>;
const IconBattery = () => <Mini><rect class="ls-mk" x="5" y="14" width="34" height="20" rx="3" /><path class="ls-mk" d="M43 20V28" /><path class="ls-ms" d="M24 18L19 25H27L22 31" /></Mini>;

/* ---------- the lesson ---------- */

const ohms = (v: number) => (v === 0 ? '0 ohms' : `${v},000 ohms`);

const LESSON: Lesson = {
  id: 't6a-components',
  title: 'Resistors, capacitors, inductors and batteries',
  blurb: 'The basic parts inside every radio: what each one is made of and what it does.',
  sub: 'T6',
  groups: ['T6A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t6a-components',
      intro: 'Start with a short clip that names the parts. After it you will meet each one.',
      covers: ['T6A01', 'T6A02', 'T6A04', 'T6A05', 'T6A06', 'T6A07', 'T6A08'],
    },
    {
      type: 'card',
      id: 'resistor',
      idea: 'A resistor opposes current',
      covers: ['T6A01'],
      picture: { art: 'resistor' },
      heading: 'A resistor opposes the flow of current',
      text: [
        'A component is a single part of a circuit. The simplest one is the resistor. It is like a narrow section in a water pipe: the current still flows, but less of it gets through.',
        'It does this even for DC, direct current, the steady one-way current a battery gives. On a circuit drawing a resistor is a zigzag line.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You put a resistor in the path of the steady current from a battery. What does it do?',
        options: [
          { id: 'boost', label: 'It pushes the current along harder', why: 'A resistor never adds push. It only gets in the way of the current.' },
          { id: 'oppose', label: 'It opposes the current, so less flows', right: true, why: 'Yes. A resistor opposes the flow of current, in a DC circuit as much as any other.' },
          { id: 'none', label: 'Nothing. Resistors ignore steady current', why: 'A resistor works on steady DC too. That is exactly what the exam asks about.' },
        ],
      },
      remember: 'The component that opposes the flow of current in a DC circuit is the resistor.',
    },
    {
      type: 'card',
      id: 'pot',
      idea: 'A potentiometer is an adjustable resistor',
      covers: ['T6A02', 'T6A03'],
      picture: { draw: Pot },
      heading: 'A potentiometer is a resistor you can adjust',
      text: [
        'A potentiometer is a resistor with a sliding contact, moved by a knob. Turning the knob changes how much of the resistor is in the path, so it changes the resistance. Resistance is measured in ohms.',
        'Where you meet one: the volume knob on a radio is often a potentiometer.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Turn the knob until the resistance is 7,000 ohms.',
        label: 'Knob',
        min: 0,
        max: 10,
        step: 1,
        start: 2,
        readouts: (v) => [{ label: 'Knob', value: `${v} of 10` }, { label: 'Resistance', value: ohms(v) }],
        goal: (v) => v === 7,
        hint: (v) => (v < 7 ? `${ohms(v)} is too little. Turn the knob up to put more of the resistor in the path.` : `${ohms(v)} is too much. Turn the knob down to take some of the resistor out of the path.`),
        done: 'There: 7,000 ohms. The only thing the knob changed was the resistance.',
      },
      remember: 'A potentiometer controls resistance. It is often used as an adjustable volume control.',
    },
    {
      type: 'card',
      id: 'capacitor',
      idea: 'A capacitor: two plates, an electric field',
      covers: ['T6A04', 'T6A05'],
      picture: { art: 'capacitor' },
      heading: 'A capacitor stores energy in an electric field',
      text: [
        'A capacitor is two conductive surfaces, called plates, separated by an insulator. An insulator is a material that current cannot pass through, so the plates never touch.',
        'Connect a battery and charge piles up on the plates. An electric field forms across the gap, and the energy is stored in that field. The symbol shows it: two plates and a gap.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What sits between the two plates of a capacitor?',
        options: [
          { id: 'wire', label: 'A wire joining them', why: 'A wire would let current run straight across. The plates of a capacitor are kept apart.' },
          { id: 'ins', label: 'An insulator', right: true, why: 'Yes. A capacitor is conductive surfaces separated by an insulator.' },
          { id: 'coil', label: 'A coil of wire', why: 'A coil is a different part, which comes next. A capacitor has an insulator in its gap.' },
        ],
      },
      remember: 'A capacitor is conductive surfaces separated by an insulator. It stores energy in an electric field.',
    },
    {
      type: 'card',
      id: 'inductor',
      idea: 'An inductor: a coil, a magnetic field',
      covers: ['T6A01', 'T6A04', 'T6A05', 'T6A06', 'T6A07'],
      picture: { art: 'inductor' },
      heading: 'An inductor stores energy in a magnetic field',
      text: [
        'Current in a wire makes a magnetic field around the wire. Wind the wire into a coil and the field gets much stronger. That coil of wire is an inductor, and it stores energy in its magnetic field.',
        'So the two storage parts are a pair: a capacitor uses plates and an electric field, an inductor uses a coil and a magnetic field. Together they tune a radio to a frequency.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each description to its part. Tap a description, then tap the part.',
        slots: [
          { id: 'r', label: 'Resistor', rule: 'A resistor only opposes current. It stores nothing.' },
          { id: 'c', label: 'Capacitor', rule: 'A capacitor is plates and an insulator, with an electric field.' },
          { id: 'l', label: 'Inductor', rule: 'An inductor is a coil of wire, with a magnetic field.' },
        ],
        items: [
          { id: 'coil', label: 'A coil of wire', slot: 'l', why: 'An inductor is typically built as a coil of wire.' },
          { id: 'efield', label: 'Stores energy in an electric field', slot: 'c', why: 'The electric field sits in the gap between the plates of a capacitor.' },
          { id: 'oppose', label: 'Opposes the flow of current', slot: 'r', why: 'Opposing current is the whole job of a resistor.' },
          { id: 'mfield', label: 'Stores energy in a magnetic field', slot: 'l', why: 'The magnetic field around the coil of an inductor holds the energy.' },
          { id: 'plates', label: 'Plates with an insulator between', slot: 'c', why: 'Conductive surfaces separated by an insulator make a capacitor.' },
        ],
      },
      remember: 'An inductor is typically a coil of wire. It stores energy in a magnetic field.',
    },
    {
      type: 'card',
      id: 'spst',
      idea: 'Poles, throws and the SPST switch',
      covers: ['T6A09'],
      picture: { art: 'spst' },
      heading: 'A switch is named by its poles and throws',
      text: [
        'A switch has an arm that moves. Each arm is a pole: one pole switches one circuit. Each contact the arm can rest on is a throw.',
        'The simplest switch has one arm and one contact. It is called single-pole single-throw, SPST for short, and it is a plain on-off switch. In the exam drawing, Figure T-2, component 3 is this symbol.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What can a single-pole single-throw switch do?',
        options: [
          { id: 'two', label: 'Open or close two circuits at once', why: 'Two circuits would need two arms, which is two poles. This switch has a single pole.' },
          { id: 'one', label: 'Open or close a single circuit', right: true, why: 'Yes. One pole means one circuit, and one throw means it is simply on or off.' },
          { id: 'either', label: 'Send one circuit to either of two others', why: 'That needs two contacts for the arm to choose between, which is two throws. This switch has one.' },
        ],
      },
      remember: 'One arm and one contact is a single-pole single-throw (SPST) switch. It is component 3 in Figure T-2.',
    },
    {
      type: 'card',
      id: 'spdt',
      idea: 'The SPDT switch chooses between two',
      covers: ['T6A08'],
      picture: { draw: TwoSwitches },
      heading: 'Double-throw: one circuit, two places to go',
      text: [
        'Give the arm a second contact and you have a single-pole double-throw switch, SPDT. It is still one pole, so one circuit. But that circuit can now be switched to either of two others.',
        'On the air: an SPDT switch can connect one antenna to either of two radios.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You want one antenna to go to radio 1 or to radio 2. Which switch does that? Tap it in the picture, or tap an answer.',
        options: [
          { id: 'a', label: 'Switch A', why: 'Switch A has only one contact. It can turn one circuit on or off, but it cannot choose between two. It is the SPST.' },
          { id: 'b', label: 'Switch B', right: true, why: 'Yes. Switch B is the SPDT: a single circuit is switched between one of two other circuits.' },
        ],
      },
      remember: 'An SPDT switch switches a single circuit between one of two other circuits.',
    },
    {
      type: 'card',
      id: 'batteries',
      idea: 'Which batteries can be recharged',
      covers: ['T6A10', 'T6A11'],
      picture: { art: 'rechargeable-battery' },
      heading: 'Some batteries recharge, carbon-zinc does not',
      text: [
        'A battery makes its voltage with a chemical reaction. The materials inside are called its chemistry. In a rechargeable battery, pushing current back in reverses the reaction, so it can be used again.',
        'Nickel-metal hydride, nickel-cadmium, lithium-ion and lead-acid are all rechargeable. Carbon-zinc is not: once it is flat, it is finished.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Put each battery chemistry where it belongs. Tap a chemistry, then tap a box.',
        slots: [
          { id: 'yes', label: 'Rechargeable', sub: 'can be used again', rule: 'Carbon-zinc is the one chemistry here that cannot be recharged.' },
          { id: 'no', label: 'Not rechargeable', sub: 'use once', rule: 'Only carbon-zinc belongs here. The others can all be recharged.' },
        ],
        items: [
          { id: 'li', label: 'Lithium-ion', slot: 'yes', why: 'Lithium-ion is rechargeable. It is the usual pack in a handheld radio.' },
          { id: 'cz', label: 'Carbon-zinc', slot: 'no', why: 'Carbon-zinc is not rechargeable. It is the cheap throwaway kind.' },
          { id: 'pb', label: 'Lead-acid', slot: 'yes', why: 'Lead-acid is rechargeable. A car battery is lead-acid.' },
          { id: 'nimh', label: 'Nickel-metal hydride', slot: 'yes', why: 'Nickel-metal hydride is rechargeable.' },
          { id: 'nicd', label: 'Nickel-cadmium', slot: 'yes', why: 'Nickel-cadmium is rechargeable too.' },
        ],
      },
      remember: 'Rechargeable: nickel-metal hydride, lithium-ion and lead-acid, all of them. Not rechargeable: carbon-zinc.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T6A02', 'T6A03', 'T6A06', 'T6A07', 'T6A08', 'T6A09', 'T6A10', 'T6A11'],
      questions: [
        {
          q: 'You turn up the volume knob on a radio. What changes inside the potentiometer behind the knob?',
          review: 'pot',
          covers: ['T6A02', 'T6A03'],
          choices: [
            { label: 'Its resistance', right: true, why: 'A potentiometer is an adjustable resistor, so the knob changes its resistance.' },
            { label: 'Its magnetic field', why: 'A magnetic field belongs to an inductor. A potentiometer is a resistor, and the knob changes its resistance.' },
            { label: 'How much charge it stores', why: 'Storing charge is the job of a capacitor. A potentiometer changes resistance.' },
          ],
        },
        {
          q: 'A part is made by winding wire into a coil. Where does it store its energy?',
          review: 'inductor',
          covers: ['T6A06', 'T6A07'],
          choices: [
            { label: 'In an electric field', why: 'An electric field is where a capacitor stores energy, between its plates. A coil is an inductor.' },
            { label: 'In a magnetic field', right: true, why: 'A coil of wire is an inductor, and an inductor stores energy in a magnetic field.' },
            { label: 'In a chemical reaction', why: 'That describes a battery. A coil of wire is an inductor, which uses a magnetic field.' },
          ],
        },
        {
          q: 'A switch on your desk sends your microphone to radio 1 in one position and to radio 2 in the other. What type of switch is it?',
          review: 'spdt',
          covers: ['T6A08', 'T6A09'],
          choices: [
            { label: 'Single-pole single-throw (SPST)', why: 'A single-throw switch has one contact, so it can only be on or off. Choosing between two needs a second throw.' },
            { label: 'Single-pole double-throw (SPDT)', right: true, why: 'One circuit, the microphone, is switched to either of two others. That is single-pole double-throw.' },
          ],
        },
        {
          q: 'The lithium-ion pack in your handheld radio has run flat. What now?',
          review: 'batteries',
          covers: ['T6A10', 'T6A11'],
          choices: [
            { label: 'Recharge it', right: true, why: 'Lithium-ion is a rechargeable chemistry, so the pack can be charged and used again.' },
            { label: 'Throw it away. Lithium-ion cannot be recharged', why: 'That is carbon-zinc. Lithium-ion is rechargeable.' },
            { label: 'Throw it away. Only lead-acid can be recharged', why: 'Lead-acid is rechargeable, but so are lithium-ion and nickel-metal hydride.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T6A01', 'T6A02', 'T6A03', 'T6A04', 'T6A05', 'T6A06', 'T6A07', 'T6A08', 'T6A09', 'T6A10', 'T6A11'],
      facts: [
        { icon: IconResistor, text: 'A resistor opposes the flow of current, even in a DC circuit.', covers: ['T6A01'] },
        { icon: IconPot, text: 'A potentiometer is an adjustable resistor. It controls resistance and is often a volume control.', covers: ['T6A02', 'T6A03'] },
        { icon: IconCap, text: 'A capacitor is conductive surfaces separated by an insulator. It stores energy in an electric field.', covers: ['T6A04', 'T6A05'] },
        { icon: IconCoil, text: 'An inductor is typically a coil of wire. It stores energy in a magnetic field.', covers: ['T6A06', 'T6A07'] },
        { icon: IconSwitch, text: 'SPST opens or closes a single circuit (component 3 in Figure T-2). SPDT switches a single circuit between one of two others.', covers: ['T6A08', 'T6A09'] },
        { icon: IconBattery, text: 'Nickel-metal hydride, lithium-ion and lead-acid are rechargeable. Carbon-zinc is not.', covers: ['T6A10', 'T6A11'] },
      ],
    },
  ],
};
export default LESSON;
