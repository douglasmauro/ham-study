import type { ComponentType } from 'preact';
import { Arrow, Art, Mini, T, fineWave } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 11: What parts do in a circuit (question group T6D, all 11 questions).
 * Every fact below comes from a T6D question and its keyed answer; the ids are in each
 * step's `covers`. Figure T-1 is the official exam figure (app/public/figures/T-1.png):
 * component 2 is the transistor, 3 the lamp and 4 the battery, as keyed in T6C03 to T6C05.
 */

/* ---------- pictures ---------- */

interface Spot { id: string; x: number; y: number; w: number; h: number }

/**
 * An official exam figure, cropped to its drawing. `box` is the part of the 900 x 600
 * image to show (240:140 wide to tall). `spots` are tappable areas, in image pixels.
 */
function figure(n: 1 | 2 | 3, box: [number, number, number], label: string, spots: Spot[], right: string): ComponentType<PicProps> {
  const [bx, by, bw] = box;
  const bh = (bw * 140) / 240;
  return function Figure({ picked, solved, onPick }: PicProps) {
    return (
      <Art label={label}>
        <svg x="0" y="0" width="240" height="140" viewBox={`${bx} ${by} ${bw} ${bh}`}>
          <image href={`./figures/T-${n}.png`} x="0" y="0" width="900" height="600" />
          {spots.map((s) => {
            const on = picked === s.id || (solved && s.id === right);
            const c = solved && s.id === right ? 'ga-good' : on ? 'ga-bad' : 'ga-w ga-dash';
            return (
              <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="14" class={c} style={{ strokeWidth: on ? 7 : 3, pointerEvents: 'all', cursor: onPick ? 'pointer' : 'default' }}
                onClick={onPick ? () => onPick(s.id) : undefined} />
            );
          })}
        </svg>
      </Art>
    );
  };
}

/** Figure T-1 with the transistor, the lamp and the battery tappable. T6D10 */
const FigureT1 = figure(1, [195, 142, 510],
  'Exam figure T-1. A resistor, component 1, leads to the side lead of a transistor, component 2. The transistor sits in a loop with a lamp, component 3, and a battery, component 4.',
  [
    { id: '2', x: 424, y: 220, w: 108, h: 126 },
    { id: '3', x: 526, y: 144, w: 68, h: 70 },
    { id: '4', x: 570, y: 242, w: 92, h: 66 },
  ], '2');

/** A front panel with an indicator light and a meter. T6D04, T6D07 */
function PanelLights() {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const r = (a * Math.PI) / 180;
    return `M${(62 + 15 * Math.cos(r)).toFixed(1)} ${(58 + 15 * Math.sin(r)).toFixed(1)}L${(62 + 22 * Math.cos(r)).toFixed(1)} ${(58 + 22 * Math.sin(r)).toFixed(1)}`;
  }).join('');
  return (
    <Art label="The front panel of a power supply. On the left an LED glows to show that the power is on. On the right a meter displays the voltage as a number: 13.8 volts.">
      <rect class="ga-w" x="10" y="14" width="220" height="92" rx="10" />
      <circle class="ga-fs" cx="62" cy="58" r="9" />
      <path class="ga-s ga-thin" d={rays} />
      <T x={62} y={96} a="middle" c="ga-tm">ON</T>
      <rect class="ga-k" x="124" y="38" width="88" height="40" rx="6" />
      <text x="168" y="64" class="ga-t ga-tk ga-tl ga-mono" text-anchor="middle">13.8 V</text>
      <T x={62} y={126} a="middle" c="ga-ts ga-tb">LED: a light</T>
      <T x={168} y={126} a="middle" c="ga-tk ga-tb">meter: a number</T>
    </Art>
  );
}

/** Three rows: what goes into each power supply stage, and what comes out. T6D01, T6D05, T6D06 */
function SupplyChain() {
  const humps = (x0: number, x1: number, y: number, len: number, amp: number) => {
    let d = '';
    for (let x = x0; x <= x1 + 0.01; x += 0.5) d += `${x === x0 ? 'M' : 'L'}${x} ${(y - amp * Math.max(0, Math.sin(((x - x0) / len) * 2 * Math.PI))).toFixed(1)}`;
    return d;
  };
  // each row: y of the zero line, name, the wave going in, the wave coming out
  const rows: [number, string, string, string][] = [
    [38, 'transformer', fineWave(14, 62, 38, 16, 14), fineWave(178, 226, 38, 16, 6)],
    [84, 'rectifier', fineWave(14, 62, 84, 16, 6), humps(178, 226, 84, 16, 9)],
    [126, 'regulator', fineWave(14, 62, 114, 16, 2.5), 'M178 114H226'],
  ];
  return (
    <Art label="Three stages of a power supply. A transformer takes in a large AC wave and gives out a smaller AC wave. A rectifier takes in AC and gives out humps on one side only: varying DC. A regulator takes in an uneven voltage and gives out a level one.">
      <T x={38} y={13} a="middle" c="ga-tm">goes in</T>
      <T x={202} y={13} a="middle" c="ga-tm">comes out</T>
      {rows.map(([y, name, a, b], i) => {
        const mid = i === 2 ? 116 : y; // the regulator's lines sit above its zero line
        return (
          <>
            <path class="ga-w ga-thin" d={`M12 ${y}H64M176 ${y}H228`} />
            <path class="ga-s" d={a} />
            <path class="ga-s" d={b} />
            <Arrow x1={70} y1={mid} x2={80} y2={mid} c="ga-w ga-thin" h={5} />
            <Arrow x1={160} y1={mid} x2={170} y2={mid} c="ga-w ga-thin" h={5} />
            <T x={120} y={mid + 4} a="middle" c="ga-tk ga-tb">{name}</T>
          </>
        );
      })}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconTransistor = () => <Mini><circle class="ls-mk" cx="25" cy="24" r="13" /><path class="ls-mk" d="M5 24H19M19 16V32M19 21l10-6M19 27l10 6" /></Mini>;
const IconRelay = () => <Mini><path class="ls-mw" d="M10 6V12a4 4 0 0 1 0 8a4 4 0 0 1 0 8a4 4 0 0 1 0 8V42" /><path class="ls-mk" d="M24 30H30M40 30H44M30 30L40 20" /><path class="ls-mw ls-mthin" d="M16 24H26" /></Mini>;
const IconPanel = () => <Mini><circle class="ls-ms" cx="11" cy="24" r="5" /><rect class="ls-mk" x="21" y="15" width="23" height="18" rx="3" /><path class="ls-mk ls-mthin" d="M26 24H39" /></Mini>;
const IconSupply = () => <Mini><path class="ls-ms" d="M4 16C7 4 11 4 14 16S21 28 24 16S31 4 34 16S41 28 44 16" /><path class="ls-mk" d="M6 38H42" /><path class="ls-mw ls-mthin" d="M24 24V32M20 28l4 4 4-4" /></Mini>;
const IconResonant = () => <Mini><path class="ls-mk" d="M4 24H8a4 4 0 0 1 8 0a4 4 0 0 1 8 0H30M30 14V34M36 14V34M36 24H44" /></Mini>;
const IconChip = () => <Mini><rect class="ls-mk" x="13" y="13" width="22" height="22" rx="3" /><path class="ls-mw ls-mthin" d="M6 18H13M6 24H13M6 30H13M35 18H42M35 24H42M35 30H42" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't6d-component-functions',
  title: 'What parts do in a circuit',
  blurb: 'The job each part does: controlling, switching, showing, supplying power and tuning.',
  sub: 'T6',
  groups: ['T6D'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t6d-component-functions',
      intro: 'Start with a short clip. After it you will match each part to its job.',
      covers: ['T6D01', 'T6D02', 'T6D04', 'T6D05', 'T6D06', 'T6D07', 'T6D08', 'T6D10', 'T6D11'],
    },
    {
      type: 'card',
      id: 'control',
      idea: 'A transistor controls current',
      covers: ['T6D10'],
      picture: { draw: FigureT1 },
      heading: 'In figure T-1 the transistor is in control',
      text: [
        'You named these parts in the last lesson. Now look at what each one does. The battery, component 4, supplies the electrical energy. The lamp, component 3, gives off light when current flows through it.',
        'The transistor, component 2, sits in the same loop. A small signal arriving through the resistor sets how much current the transistor lets through.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which component controls the flow of current through the lamp? Tap it in the figure, or tap an answer.',
        options: [
          { id: '2', label: 'Component 2', right: true, why: 'Yes. Component 2 is the transistor, and its function here is to control the flow of current.' },
          { id: '3', label: 'Component 3', why: 'Component 3 is the lamp. Its job is to give off light when current flows through it.' },
          { id: '4', label: 'Component 4', why: 'Component 4 is the battery. Its job is to supply electrical energy.' },
        ],
      },
      remember: 'The function of component 2 in figure T-1, the transistor, is to control the flow of current.',
    },
    {
      type: 'card',
      id: 'relay',
      idea: 'A relay is an electrically-controlled switch',
      covers: ['T6D02'],
      picture: { art: 'relay' },
      heading: 'A relay is a switch worked by electricity',
      text: [
        'An ordinary switch needs a finger. A relay has a coil of wire beside its switch contacts. Send a small current through the coil and it becomes a magnet that pulls the contacts open or closed.',
        'So one circuit can switch another. Why it matters: a small, safe current can turn a much bigger one on and off.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What is a relay?',
        options: [
          { id: 'amp', label: 'An amplifier that makes a signal larger', why: 'A relay does not amplify. Its contacts are either open or closed.' },
          { id: 'sw', label: 'A switch controlled by electricity', right: true, why: 'Yes. A relay is an electrically-controlled switch: current in the coil moves the contacts.' },
          { id: 'ind', label: 'A light that shows the power is on', why: 'That is an indicator. A relay gives off no light. It opens and closes a circuit.' },
        ],
      },
      remember: 'A relay is an electrically-controlled switch.',
    },
    {
      type: 'card',
      id: 'show',
      idea: 'LED indicators and meters',
      covers: ['T6D04', 'T6D07'],
      picture: { draw: PanelLights },
      heading: 'Two parts that tell you something',
      text: [
        'A visual indicator is a light that tells you something at a glance, such as "the power is on". The part commonly used for this is an LED, a light emitting diode.',
        'A light cannot tell you how much. For that you need a meter, which displays an electrical quantity such as voltage or current as a numeric value.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which part does each job? Tap a job, then tap the part.',
        slots: [
          { id: 'led', label: 'LED', sub: 'a visual indicator', rule: 'An LED only lights up. It cannot show a number.' },
          { id: 'meter', label: 'Meter', sub: 'a numeric value', rule: 'A meter displays a quantity as a number. It is not an indicator light.' },
        ],
        items: [
          { id: 'a', label: 'Power light', slot: 'led', why: 'A light that shows the power is on is a visual indicator, the usual job of an LED.' },
          { id: 'b', label: 'Shows 13.8 V', slot: 'meter', why: 'A voltage shown as 13.8 volts is a numeric value, so it comes from a meter.' },
          { id: 'c', label: 'Transmit light', slot: 'led', why: 'A light that glows while you transmit is a visual indicator: an LED.' },
          { id: 'd', label: 'Shows 2 A', slot: 'meter', why: 'A current shown as 2 amperes is a numeric value, so it comes from a meter.' },
        ],
      },
      remember: 'An LED is commonly used as a visual indicator. A meter displays an electrical quantity as a numeric value.',
    },
    {
      type: 'card',
      id: 'supply',
      idea: 'Transformer, rectifier and regulator',
      covers: ['T6D01', 'T6D05', 'T6D06'],
      picture: { draw: SupplyChain },
      heading: 'Three jobs inside a power supply',
      text: [
        'A wall socket gives 120 V AC, current that keeps reversing direction. A transformer changes it to a lower AC voltage. A rectifier then changes the alternating current into a varying direct current: it flows one way only, but still rises and falls.',
        'Last comes a regulator, a circuit that controls the amount of voltage coming from the power supply.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each job to the part that does it. Tap a job, then tap the part.',
        slots: [
          { id: 'x', label: 'Transformer', sub: 'AC in, AC out', rule: 'A transformer only changes one AC voltage into another AC voltage.' },
          { id: 'r', label: 'Rectifier', sub: 'AC in, DC out', rule: 'A rectifier changes AC into varying DC.' },
          { id: 'g', label: 'Regulator', sub: 'sets the voltage', rule: 'A regulator controls the amount of voltage from the supply.' },
        ],
        items: [
          { id: 'a', label: 'AC to varying DC', slot: 'r', why: 'A rectifier changes an alternating current into a varying direct current.' },
          { id: 'b', label: 'Controls the voltage', slot: 'g', why: 'A regulator controls the amount of voltage from a power supply.' },
          { id: 'c', label: '120 V AC to lower AC', slot: 'x', why: 'A transformer changes 120 V AC power to a lower AC voltage.' },
        ],
      },
      remember: 'Transformer: 120 V AC to a lower AC voltage. Rectifier: AC to varying DC. Regulator: controls the amount of voltage from a power supply.',
    },
    {
      type: 'card',
      id: 'resonant',
      idea: 'Inductor plus capacitor: a resonant circuit',
      covers: ['T6D08', 'T6D11'],
      picture: { art: 'resonant-circuit' },
      heading: 'A coil and a capacitor make a tuned circuit',
      text: [
        'An inductor stores energy in a magnetic field. A capacitor stores it in an electric field. Join the two and the energy swings back and forth between them at one natural frequency, like a child on a swing.',
        'That pair is called a resonant circuit, or a tuned circuit. The two parts can be joined in series or in parallel. Why it matters: tuned circuits are how a radio favors one frequency.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You have an inductor. Which part do you add to make a resonant circuit?',
        options: [
          { id: 'res', label: 'A resistor', why: 'A resistor only turns energy into heat. It cannot pass energy back and forth with the inductor.' },
          { id: 'cap', label: 'A capacitor', right: true, why: 'Yes. An inductor and a capacitor, in series or in parallel, form a resonant circuit.' },
          { id: 'pot', label: 'A variable resistor', why: 'A variable resistor is still a resistor. It only turns energy into heat.' },
        ],
      },
      remember: 'A resonant or tuned circuit is an inductor and a capacitor in series or parallel.',
    },
    {
      type: 'card',
      id: 'ic',
      idea: 'Integrated circuits',
      covers: ['T6D09'],
      picture: { art: 'integrated-circuit' },
      heading: 'An integrated circuit is many parts in one package',
      text: [
        'Transistors and diodes are semiconductors. A modern radio needs a great many of them, far too many to wire up one at a time.',
        'An integrated circuit, or IC, combines several semiconductors and other components into one package. It is the small black chip with a row of pins that you see on a circuit board.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A single small chip holds many transistors, diodes and resistors. What is it called?',
        options: [
          { id: 'ic', label: 'An integrated circuit', right: true, why: 'Yes. An integrated circuit combines several semiconductors and other components into one package.' },
          { id: 'rel', label: 'A relay', why: 'A relay is an electrically-controlled switch: a coil and contacts, not a package of semiconductors.' },
          { id: 'x', label: 'A transformer', why: 'A transformer is coils of wire. It contains no semiconductors.' },
        ],
      },
      remember: 'An integrated circuit combines several semiconductors and other components into one package.',
    },
    {
      type: 'card',
      id: 'shield',
      idea: 'Shielded wire',
      covers: ['T6D03'],
      picture: { art: 'shielded-wire' },
      heading: 'Shielded wire keeps unwanted signals out, and in',
      text: [
        'A plain wire acts a little like an antenna. It can pick up stray signals from nearby equipment, and it can leak its own signal to other things.',
        'Shielded wire has a layer of metal braid or foil wrapped around the inner wire. It prevents unwanted signals from coupling to the wire or from it. Coupling means a signal crossing over without a direct connection.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What is a reason to use shielded wire?',
        options: [
          { id: 'cur', label: 'So the wire can carry more current', why: 'Carrying more current takes a thicker wire. A shield does not help with that.' },
          { id: 'cpl', label: 'To stop unwanted signals getting onto or off the wire', right: true, why: 'Yes. Shielded wire prevents coupling of unwanted signals to or from the wire.' },
          { id: 'res', label: 'To lower the resistance of a power lead', why: 'Resistance depends on the thickness, length and material of the wire, not on a shield.' },
        ],
      },
      remember: 'Shielded wire is used to prevent coupling of unwanted signals to or from the wire.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T6D02', 'T6D03', 'T6D06', 'T6D11'],
      questions: [
        {
          q: 'One part of a power supply has AC going in and AC coming out, only at a lower voltage. Which part is it?',
          review: 'supply',
          covers: ['T6D06'],
          choices: [
            { label: 'The transformer', right: true, why: 'A transformer changes 120 V AC to a lower AC voltage. What comes out is still AC.' },
            { label: 'The rectifier', why: 'A rectifier gives out varying DC, not AC.' },
            { label: 'The regulator', why: 'A regulator controls the amount of voltage from the supply. It is not the part that steps AC down to lower AC.' },
          ],
        },
        {
          q: 'A small current from a push button has to switch a much larger current on and off. Which part lets one circuit switch another?',
          review: 'relay',
          covers: ['T6D02'],
          choices: [
            { label: 'A meter', why: 'A meter only displays a value as a number. It switches nothing.' },
            { label: 'An LED', why: 'An LED is a visual indicator. It lights up, but it does not switch a circuit.' },
            { label: 'A relay', right: true, why: 'A relay is an electrically-controlled switch: a small current in its coil moves the contacts.' },
          ],
        },
        {
          q: 'You wire a coil and a capacitor side by side, in parallel. What have you made?',
          review: 'resonant',
          covers: ['T6D11'],
          choices: [
            { label: 'A rectifier', why: 'A rectifier changes AC into varying DC. A coil and a capacitor do not do that.' },
            { label: 'A resonant circuit', right: true, why: 'An inductor and a capacitor form a resonant circuit, whether in series or in parallel.' },
            { label: 'Nothing useful. They must be in series', why: 'Series or parallel both work. Either way an inductor with a capacitor is a resonant circuit.' },
          ],
        },
        {
          q: 'A microphone cable keeps picking up buzz from a computer beside it. What kind of cable helps most?',
          review: 'shield',
          covers: ['T6D03'],
          choices: [
            { label: 'A thicker wire', why: 'A thicker wire carries more current, but it picks up stray signals just the same.' },
            { label: 'A shielded wire', right: true, why: 'The shield prevents unwanted signals from coupling to the wire.' },
            { label: 'A longer wire', why: 'A longer wire has more length to pick up unwanted signals, not less.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T6D01', 'T6D02', 'T6D03', 'T6D04', 'T6D05', 'T6D06', 'T6D07', 'T6D08', 'T6D09', 'T6D10', 'T6D11'],
      facts: [
        { icon: IconTransistor, text: 'The transistor, component 2 in figure T-1, controls the flow of current.', covers: ['T6D10'] },
        { icon: IconRelay, text: 'A relay is an electrically-controlled switch.', covers: ['T6D02'] },
        { icon: IconPanel, text: 'An LED is commonly used as a visual indicator. A meter displays an electrical quantity as a numeric value.', covers: ['T6D04', 'T6D07'] },
        { icon: IconSupply, text: 'A transformer changes 120 V AC to a lower AC voltage. A rectifier changes AC into varying DC. A regulator controls the amount of voltage from a power supply.', covers: ['T6D01', 'T6D05', 'T6D06'] },
        { icon: IconResonant, text: 'An inductor and a capacitor, in series or parallel, make a resonant or tuned circuit.', covers: ['T6D08', 'T6D11'] },
        { icon: IconChip, text: 'An integrated circuit combines several semiconductors and other components into one package. Shielded wire prevents coupling of unwanted signals to or from the wire.', covers: ['T6D03', 'T6D09'] },
      ],
    },
  ],
};
export default LESSON;
