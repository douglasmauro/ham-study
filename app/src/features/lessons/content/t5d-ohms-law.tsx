import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 7: Ohm's law and simple circuits (question group T5D, all 14 questions).
 * Every fact below comes from a T5D question and its keyed answer; the ids are in each
 * step's `covers`. The intro is the hand-animated `ohms-law` clip (12 volts across 4 ohms
 * is 3 amperes; 8 ohms halves it to 1.5 amperes), and the first card picks up those numbers.
 */

/* ---------- pictures ---------- */

/** The resistor zigzag of the glossary drawings: starts at (x, y) and runs 60 units to the right. */
const zig = (x: number, y: number) => `M${x} ${y}l5 -10l10 20l10 -20l10 20l10 -20l10 20l5 -10`;

const amps = (ohms: number) => String(+(12 / ohms).toFixed(2));

/** A 12 volt battery and one resistor. `value` is the resistance in ohms; more dots mean more current. T5D01, T5D05 */
function Flow({ value = 4, solved }: PicProps) {
  const i = 12 / value;
  const count = Math.round(i * 3);
  const dots: [number, number][] = [];
  for (let k = 0; k < count; k += 1) {
    const d = ((k + 0.5) * 236) / count; // along the right wire (66 units) and then the bottom wire (170 units)
    dots.push(d < 66 ? [206, 40 + d] : [206 - (d - 66), 106]);
  }
  return (
    <Art label={`A 12 volt battery connected to a ${value} ohm resistor in one loop. The current is ${amps(value)} amperes.`}>
      <path class="ga-w" d="M36 61V34H96M156 34H206V106H36V79" />
      <path class="ga-w" d="M22 61H50M29 67H43M22 73H50M29 79H43" />
      <path class="ga-k" d={zig(96, 34)} />
      {dots.map(([x, y]) => <circle class="ga-fs" cx={x} cy={y} r="3" />)}
      <T x={58} y={74} c="ga-tb">12 V</T>
      <T x={126} y={16} a="middle" c="ga-tk ga-tb">{`${value} Ω`}</T>
      <text x="126" y="76" class={`ga-t ga-tl ${solved ? 'ga-tk' : 'ga-ts'}`} text-anchor="middle">{`${amps(value)} A`}</text>
      <T x={126} y={92} a="middle" c="ga-tm">of current</T>
      <T x={120} y={132} a="middle" c="ga-tm">more resistance, less current</T>
    </Art>
  );
}

type Letter = 'E' | 'I' | 'R';
const CELL: Record<Letter, string> = {
  E: 'M64 10L89.5 55H38.5Z',
  I: 'M38.5 55H64V98H14Z',
  R: 'M64 55H89.5L114 98H64Z',
};
const AT: Record<Letter, [number, number]> = { E: [64, 46], I: [46, 88], R: [82, 88] };
const SAYS: Record<Letter, { form: string; how: [string, string]; units: string; spoken: string }> = {
  E: { form: 'E = I × R', how: ['I is beside R,', 'so multiply'], units: 'volts = amperes × ohms', spoken: 'The E is covered. What is left is I beside R: voltage equals current times resistance.' },
  I: { form: 'I = E ÷ R', how: ['E sits over R,', 'so divide'], units: 'amperes = volts ÷ ohms', spoken: 'The I is covered. What is left is E over R: current equals voltage divided by resistance.' },
  R: { form: 'R = E ÷ I', how: ['E sits over I,', 'so divide'], units: 'ohms = volts ÷ amperes', spoken: 'The R is covered. What is left is E over I: resistance equals voltage divided by current.' },
};
const LETTERS: Letter[] = ['E', 'I', 'R'];

/** The Ohm's law triangle with one letter covered. Without `cover` it follows the letter tapped. T5D01, T5D02, T5D03 */
function Tri({ cover, picked, onPick }: PicProps & { cover?: Letter }) {
  const c = cover ?? (LETTERS.find((l) => l === picked) ?? null);
  const say = c ? SAYS[c] : null;
  const hit = { pointerEvents: 'all' as const, cursor: 'pointer' };
  return (
    <Art label={`The Ohm's law triangle with E on top and I and R below. ${say ? say.spoken : 'Cover the letter you want and the other two show the sum.'}`}>
      {LETTERS.map((l) => <path class={`${c === l ? 'ga-fw' : 'ga-fk'} ga-soft`} d={CELL[l]} style={c ? undefined : { opacity: 0 }} />)}
      <path class="ga-k" d="M64 10L114 98H14ZM38.5 55H89.5M64 55V98" />
      {LETTERS.map((l) => <T x={AT[l][0]} y={AT[l][1]} c={`ga-tl ${c === l ? 'ga-tm' : 'ga-tk'}`} a="middle">{l}</T>)}
      {say && c ? (
        <>
          <T x={138} y={30} c="ga-tm">{`Want ${c}?`}</T>
          <T x={138} y={46} c="ga-tm">{`Cover the ${c}.`}</T>
          <T x={138} y={76} c="ga-tl ga-tk">{say.form}</T>
          <T x={138} y={96} c="ga-ts">{say.how[0]}</T>
          <T x={138} y={111} c="ga-ts">{say.how[1]}</T>
          <T x={120} y={132} c="ga-tm" a="middle">{say.units}</T>
        </>
      ) : (
        <>
          <T x={138} y={40} c="ga-tb">E: voltage</T>
          <T x={138} y={60} c="ga-tb">I: current</T>
          <T x={138} y={80} c="ga-tb">R: resistance</T>
          <T x={120} y={126} c="ga-tm" a="middle">cover the letter you want</T>
        </>
      )}
      {onPick && LETTERS.map((l) => <path d={CELL[l]} style={hit} onClick={() => onPick(l)} />)}
    </Art>
  );
}
const CoverE = () => <Tri cover="E" />;
const CoverI = () => <Tri cover="I" />;
const CoverR = () => <Tri cover="R" />;

/* ---------- recap icons ---------- */

const SMALL = { fontSize: '10px' };
const IconTri = () => (
  <Mini>
    <path class="ls-mk ls-mthin" d="M24 2L46 44H2ZM13 23H35M24 23V44" />
    <text class="ls-mt" x="24" y="20" text-anchor="middle" style={SMALL}>E</text>
    <text class="ls-mt" x="16.500" y="39" text-anchor="middle" style={SMALL}>I</text>
    <text class="ls-mt" x="31.500" y="39" text-anchor="middle" style={SMALL}>R</text>
  </Mini>
);
const Over = ({ top, bottom }: { top: string; bottom: string }) => (
  <Mini>
    <text class="ls-mt" x="24" y="19" text-anchor="middle">{top}</text>
    <path class="ls-mk" d="M12 25H36" />
    <text class="ls-mt" x="24" y="42" text-anchor="middle">{bottom}</text>
  </Mini>
);
const IconEoverR = () => <Over top="E" bottom="R" />;
const IconEoverI = () => <Over top="E" bottom="I" />;
const IconItimesR = () => <Mini><text class="ls-mt" x="24" y="29.500" text-anchor="middle">I×R</text></Mini>;
const IconSeries = () => <Mini><path class="ls-mw" d="M9 14H5V38H43V14H39M21 14H27" /><rect class="ls-mk" x="9" y="9" width="12" height="10" rx="2" /><rect class="ls-mk" x="27" y="9" width="12" height="10" rx="2" /></Mini>;
const IconParallel = () => <Mini><path class="ls-mw" d="M5 8H43M5 40H43M17 8V16M17 32V40M33 8V16M33 32V40" /><rect class="ls-mk" x="12" y="16" width="10" height="16" rx="2" /><rect class="ls-mk" x="28" y="16" width="10" height="16" rx="2" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't5d-ohms-law',
  title: "Ohm's law and simple circuits",
  blurb: 'How voltage, current and resistance fit together, and what series and parallel circuits share.',
  sub: 'T5',
  groups: ['T5D'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'ohms-law',
      intro: 'Start with a one-minute clip. After it you will change a circuit yourself and work each kind of sum.',
      covers: ['T5D01', 'T5D02', 'T5D03', 'T5D05', 'T5D06'],
    },
    {
      type: 'card',
      id: 'flow',
      idea: 'More resistance, less current',
      covers: ['T5D01', 'T5D05'],
      picture: { draw: Flow },
      heading: 'More resistance, less current',
      text: [
        'Voltage is the push, current is the flow and resistance holds the flow back. Think of water in a pipe: more pressure moves more water, and a narrower pipe lets less through.',
        'Ohm\'s law puts a number on it. Current equals voltage divided by resistance. Here a 12 volt battery drives a 4 ohm resistor, so 12 ÷ 4 = 3 amperes flow.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'The battery stays at 12 volts. Raise the resistance until the current falls to 1.5 amperes.',
        label: 'Resistance',
        min: 2,
        max: 12,
        step: 1,
        start: 4,
        readouts: (v) => [{ label: 'Voltage', value: '12 V' }, { label: 'Resistance', value: `${v} Ω` }, { label: 'Current', value: `${amps(v)} A` }],
        goal: (v) => v === 8,
        hint: (v) => (v < 8 ? `${amps(v)} amperes is too much. Raise the resistance to hold the current back.` : `${amps(v)} amperes is too little. Lower the resistance to let more through.`),
        done: 'There: 12 ÷ 8 = 1.5 amperes. You started at 4 ohms with 3 amperes. Twice the resistance, half the current.',
      },
      remember: 'Current = voltage ÷ resistance. With the same voltage, more resistance means less current.',
    },
    {
      type: 'card',
      id: 'triangle',
      idea: 'The Ohm\'s law triangle',
      covers: ['T5D01', 'T5D02', 'T5D03'],
      picture: { draw: Tri },
      heading: 'One triangle holds all three formulas',
      text: [
        'In formulas, voltage is written E, current is I and resistance is R. Draw a triangle with E on top and I and R side by side below.',
        'Cover the letter you want to find. If the two left are side by side, multiply them. If one sits over the other, divide the top one by the bottom one.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You know the voltage and the resistance, and you want the current. Which letter do you cover? Tap it in the triangle, or tap an answer.',
        options: [
          { id: 'E', label: 'E, the voltage', why: 'Covering E leaves I beside R. That finds voltage: E = I × R. Cover the letter you want.' },
          { id: 'I', label: 'I, the current', right: true, why: 'Yes. Cover I and E sits over R, so current is voltage divided by resistance: I = E ÷ R.' },
          { id: 'R', label: 'R, the resistance', why: 'Covering R leaves E over I. That finds resistance: R = E ÷ I. Cover the letter you want.' },
        ],
      },
      remember: 'E = I × R. I = E ÷ R. R = E ÷ I.',
    },
    {
      type: 'card',
      id: 'current',
      idea: 'Current is voltage divided by resistance',
      covers: ['T5D01', 'T5D07', 'T5D08', 'T5D09'],
      picture: { draw: CoverI },
      heading: 'Finding current: volts divided by ohms',
      text: [
        'To find the current, cover the I. E sits over R, so divide the voltage by the resistance. The answer is in amperes.',
        'A worked example: 120 volts is applied to a resistance of 80 ohms. 120 ÷ 80 = 1.5, so the current is 1.5 amperes.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'A 100 ohm resistor is connected across 200 volts. How many amperes flow through it?',
            left: 'amperes',
            top: '200 V',
            bottom: '100 Ω',
            accept: [2, 2],
            traps: [
              { range: [0.5, 0.5], why: 'That is 100 divided by 200. Turn it over: volts go on top.' },
              { range: [20000, 20000], why: 'That is 200 times 100. To find current you divide: volts on top, ohms below.' },
              { range: [100, 100], why: 'That is 200 minus 100. Divide instead: volts on top, ohms below.' },
            ],
            hint: 'Not quite. Ask how many times 100 fits into 200.',
            answer: '2',
            working: ['200 ÷ 100 = 2', '2 amperes. I = E ÷ R.'],
          },
          {
            prompt: 'Now a 24 ohm resistor across 240 volts. How many amperes?',
            left: 'amperes',
            top: '240 V',
            bottom: '24 Ω',
            accept: [10, 10],
            traps: [
              { range: [0.1, 0.1], why: 'That is 24 divided by 240. Turn it over: volts go on top.' },
              { range: [5760, 5760], why: 'That is 240 times 24. To find current you divide: volts on top, ohms below.' },
            ],
            hint: 'Not quite. Ask how many times 24 fits into 240.',
            answer: '10',
            working: ['240 ÷ 24 = 10', '10 amperes. A big push through a small resistance gives a large current.'],
          },
        ],
      },
      remember: 'Current: I = E ÷ R. Amperes = volts ÷ ohms.',
    },
    {
      type: 'card',
      id: 'resistance',
      idea: 'Resistance is voltage divided by current',
      covers: ['T5D03', 'T5D04', 'T5D05', 'T5D06'],
      picture: { draw: CoverR },
      heading: 'Finding resistance: volts divided by amperes',
      text: [
        'To find the resistance, cover the R. E sits over I, so divide the voltage by the current. The answer is in ohms.',
        'A worked example: 3 amperes flow in a circuit connected to 90 volts. 90 ÷ 3 = 30, so the resistance is 30 ohms.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'A circuit draws 4 amperes from a 12 volt source. What is its resistance in ohms?',
            left: 'ohms',
            top: '12 V',
            bottom: '4 A',
            accept: [3, 3],
            traps: [
              { range: [48, 48], why: 'That is 12 times 4. To find resistance you divide: volts on top, amperes below.' },
              { range: [0.3, 0.34], why: 'That is 4 divided by 12. Turn it over: volts go on top.' },
              { range: [16, 16], why: 'That is 12 plus 4. Divide instead: volts on top, amperes below.' },
              { range: [8, 8], why: 'That is 12 minus 4. Divide instead: volts on top, amperes below.' },
            ],
            hint: 'Not quite. Ask how many times 4 fits into 12.',
            answer: '3',
            working: ['12 ÷ 4 = 3', '3 ohms. R = E ÷ I.'],
          },
          {
            prompt: 'The voltage is 12 volts and the current is 1.5 amperes. What is the resistance in ohms?',
            left: 'ohms',
            top: '12 V',
            bottom: '1.5 A',
            accept: [8, 8],
            traps: [
              { range: [18, 18], why: 'That is 12 times 1.5. To find resistance you divide: volts on top, amperes below.' },
              { range: [0.12, 0.13], why: 'That is 1.5 divided by 12. Turn it over: volts go on top.' },
              { range: [13.5, 13.5], why: 'That is 12 plus 1.5. Divide instead: volts on top, amperes below.' },
            ],
            hint: 'Not quite. Ask how many times 1.5 fits into 12. Two of them make 3.',
            answer: '8',
            working: ['12 ÷ 1.5 = 8', '8 ohms: the circuit you set up with the slider.'],
          },
        ],
      },
      remember: 'Resistance: R = E ÷ I. Ohms = volts ÷ amperes.',
    },
    {
      type: 'card',
      id: 'voltage',
      idea: 'Voltage is current times resistance',
      covers: ['T5D02', 'T5D10', 'T5D11', 'T5D12'],
      picture: { draw: CoverE },
      heading: 'Finding voltage: amperes times ohms',
      text: [
        'To find the voltage, cover the E. I and R are side by side, so multiply the current by the resistance. The answer is in volts.',
        'A worked example: 0.5 amperes flow through a 2 ohm resistor. 0.5 × 2 = 1, so the voltage across it is 1 volt.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'A current of 2 amperes flows through a 10 ohm resistor. How many volts are across it?',
            left: 'volts',
            top: '2 × 10',
            bottom: '',
            accept: [20, 20],
            traps: [
              { range: [0.2, 0.2], why: 'That is 2 divided by 10. Voltage is a multiplication: amperes times ohms.' },
              { range: [5, 5], why: 'That is 10 divided by 2. Voltage is a multiplication: amperes times ohms.' },
              { range: [12, 12], why: 'That is 10 plus 2. Multiply them instead: amperes times ohms.' },
              { range: [8, 8], why: 'That is 10 minus 2. Multiply them instead: amperes times ohms.' },
            ],
            hint: 'Not quite. Multiply the two numbers: 2 times 10.',
            answer: '20',
            working: ['2 × 10 = 20', '20 volts. E = I × R.'],
          },
          {
            prompt: 'The current through the same 10 ohm resistor drops to 1 ampere. How many volts are across it now?',
            left: 'volts',
            top: '1 × 10',
            bottom: '',
            accept: [10, 10],
            traps: [
              { range: [0.1, 0.1], why: 'That is 1 divided by 10. Voltage is a multiplication: amperes times ohms.' },
              { range: [11, 11], why: 'That is 10 plus 1. Multiply them instead: amperes times ohms.' },
              { range: [9, 9], why: 'That is 10 minus 1. Multiply them instead: amperes times ohms.' },
            ],
            hint: 'Not quite. Multiply the two numbers: 1 times 10.',
            answer: '10',
            working: ['1 × 10 = 10', '10 volts. Half the current through the same resistor, half the voltage.'],
          },
        ],
      },
      remember: 'Voltage: E = I × R. Volts = amperes × ohms.',
    },
    {
      type: 'card',
      id: 'series',
      idea: 'Series: the same current through every part',
      covers: ['T5D13'],
      picture: { art: 'series-circuit' },
      heading: 'In series, the current is the same everywhere',
      text: [
        'Join parts end to end in a single loop and you have a series circuit. There is only one path, like one pipe with no side branches.',
        'Whatever current flows through the first part must flow through all the others, so the current is always the same through every part. The voltage is shared out between them.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Two resistors are in series. 2 amperes flow through the first one. How much flows through the second?',
        options: [
          { id: '1', label: '1 ampere', why: 'The current has nowhere else to go. In series there is one path, so it does not split.' },
          { id: '2', label: '2 amperes', right: true, why: 'Yes. A series circuit has only one path, so the same current flows through every part.' },
          { id: '4', label: '4 amperes', why: 'Current does not build up along the loop. One path means the same current in every part.' },
        ],
      },
      remember: 'In a series circuit the current is always the same through all components.',
    },
    {
      type: 'card',
      id: 'parallel',
      idea: 'Parallel: the same voltage across every part',
      covers: ['T5D13', 'T5D14'],
      picture: { art: 'parallel-circuit' },
      heading: 'In parallel, the voltage is the same across each part',
      text: [
        'Connect parts side by side, each one across the same two wires, and you have a parallel circuit. Each part is joined to the same two points, so each has the same voltage across it.',
        'Here it is the current that divides: some goes through each branch. Why it matters: radios connected to one 12 volt supply are in parallel, so each one gets the full 12 volts.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which kind of circuit does each line describe? Tap one, then tap series or parallel.',
        slots: [
          { id: 's', label: 'Series', sub: 'one path', rule: 'Series has one path: the same current everywhere, with the voltage shared out.' },
          { id: 'p', label: 'Parallel', sub: 'side by side', rule: 'Parallel has branches: the same voltage across each, with the current divided.' },
        ],
        items: [
          { id: 'a', label: 'Same voltage across each part', slot: 'p', why: 'In a parallel circuit the voltage is the same across all components.' },
          { id: 'b', label: 'Same current through each part', slot: 's', why: 'In a series circuit the current is the same through all components.' },
          { id: 'c', label: 'Current divides', slot: 'p', why: 'In parallel the current divides among the branches.' },
          { id: 'd', label: 'Voltage is shared out', slot: 's', why: 'In series the voltage is divided among the parts.' },
        ],
      },
      remember: 'In a parallel circuit the voltage is always the same across all components.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T5D01', 'T5D02', 'T5D03', 'T5D13', 'T5D14'],
      questions: [
        {
          q: 'A 9 volt battery is connected to a 3 ohm resistor. How much current flows?',
          review: 'current',
          covers: ['T5D01'],
          choices: [
            { label: '27 amperes', why: 'That is 9 times 3. Current is voltage divided by resistance.' },
            { label: '3 amperes', right: true, why: 'I = E ÷ R, so 9 ÷ 3 = 3 amperes.' },
            { label: 'One third of an ampere', why: 'That is 3 divided by 9. The volts go on top: 9 ÷ 3.' },
          ],
        },
        {
          q: 'A current of 2 amperes flows through a 5 ohm resistor. What is the voltage across it?',
          review: 'voltage',
          covers: ['T5D02'],
          choices: [
            { label: '10 volts', right: true, why: 'E = I × R, so 2 × 5 = 10 volts.' },
            { label: '2.5 volts', why: 'That is 5 divided by 2. Voltage is current times resistance.' },
            { label: '7 volts', why: 'That is 5 plus 2. Voltage is current times resistance.' },
          ],
        },
        {
          q: 'A lamp on a 6 volt battery draws 2 amperes. What is the resistance of the lamp?',
          review: 'resistance',
          covers: ['T5D03'],
          choices: [
            { label: '12 ohms', why: 'That is 6 times 2. Resistance is voltage divided by current.' },
            { label: '4 ohms', why: 'That is 6 minus 2. Resistance is voltage divided by current.' },
            { label: '3 ohms', right: true, why: 'R = E ÷ I, so 6 ÷ 2 = 3 ohms.' },
          ],
        },
        {
          q: 'Three lamps are each wired straight across the same two battery terminals, side by side. What do all three have in common?',
          review: 'parallel',
          covers: ['T5D13', 'T5D14'],
          choices: [
            { label: 'The same current through each', why: 'The same current through every part is the mark of a series circuit. These lamps are in parallel.' },
            { label: 'The same voltage across each', right: true, why: 'Side by side is a parallel circuit, and in parallel the voltage is the same across every part.' },
            { label: 'Nothing. Each lamp is on its own', why: 'They share the same two points, so they share the same voltage.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T5D01', 'T5D02', 'T5D03', 'T5D04', 'T5D05', 'T5D06', 'T5D07', 'T5D08', 'T5D09', 'T5D10', 'T5D11', 'T5D12', 'T5D13', 'T5D14'],
      facts: [
        { icon: IconTri, text: 'Ohm\'s law triangle: E on top, I and R below. Cover the one you want.', covers: ['T5D01', 'T5D02', 'T5D03'] },
        { icon: IconEoverR, text: 'Current: I = E ÷ R. 120 volts across 80 ohms gives 1.5 amperes.', covers: ['T5D01', 'T5D07', 'T5D08', 'T5D09'] },
        { icon: IconEoverI, text: 'Resistance: R = E ÷ I. 90 volts at 3 amperes means 30 ohms.', covers: ['T5D03', 'T5D04', 'T5D05', 'T5D06'] },
        { icon: IconItimesR, text: 'Voltage: E = I × R. 2 amperes through 10 ohms gives 20 volts.', covers: ['T5D02', 'T5D10', 'T5D11', 'T5D12'] },
        { icon: IconSeries, text: 'Series circuit: the current is the same through all components.', covers: ['T5D13'] },
        { icon: IconParallel, text: 'Parallel circuit: the voltage is the same across all components.', covers: ['T5D14'] },
      ],
    },
  ],
};
export default LESSON;
