import type { ComponentType, VNode } from 'preact';
import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 10: Reading a schematic (question group T6C, all 12 questions).
 * The component numbers and names are the keyed answers of T6C02 to T6C11:
 *   figure T-1: 1 resistor, 2 transistor, 3 lamp, 4 battery
 *   figure T-2: 4 transformer, 6 capacitor, 8 light emitting diode, 9 variable resistor
 *   figure T-3: 3 variable inductor, 4 antenna
 * The symbols drawn here copy the shapes in the official figures (app/public/figures).
 */

/* ---------- schematic symbols, each in a 60 x 40 box with its leads on y = 20 ---------- */

const ZIG = 'M0 20H9l3-9 6 18 6-18 6 18 6-18 6 18 3-9H60';
const COIL = 'M0 20H12a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0H60';
const FILL: Record<string, string> = { 'ga-k': 'ga-fk', 'ga-w': 'ga-fw', 'ga-good': 'ga-fgood', 'ga-bad': 'ga-fbad' };

type Draw = (c: string) => VNode;
const line = (d: string, c: string) => <path d={d} class={c} />;
const solid = (d: string, c: string) => <path d={d} class={`${c} ${FILL[c] ?? 'ga-fw'}`} style="stroke-width:1.6" />;

const SYMS = {
  /** T-1 component 1 */
  res: (c) => line(ZIG, c),
  /** T-1 component 2 */
  bjt: (c) => (
    <g>
      <circle cx="31" cy="20" r="17" class={c} />
      {line('M0 20H23M23 15l15-9V-4M23 25l15 9V44', c)}
      <path d="M23 9V31" class={`${c} ga-thick`} />
      {solid('M37.5 33.6l-6.5-1.2 3.2-5z', c)}
    </g>
  ),
  /** T-1 component 3 */
  lamp: (c) => line('M0 20H26V13a4 4 0 0 1 8 0V20H60M21 20V11a9 9 0 0 1 18 0V20', c),
  /** T-1 component 4 */
  batt: (c) => line('M0 20H21M21 6V34M27 13V27M33 6V34M39 13V27M39 20H60', c),
  /** T-2 component 6: one straight plate and one curved plate */
  cap: (c) => line('M0 20H25M25 7V33M38 7Q30 20 38 33M34 20H60', c),
  coil: (c) => line(COIL, c),
  /** T-2 component 4: two windings and a core */
  xfmr: (c) => (
    <g>
      {line('M8 4H21a5.33 5.33 0 0 1 0 10.67a5.33 5.33 0 0 1 0 10.67a5.33 5.33 0 0 1 0 10.67H8', c)}
      {line('M52 4H39a5.33 5.33 0 0 0 0 10.67a5.33 5.33 0 0 0 0 10.67a5.33 5.33 0 0 0 0 10.67H52', c)}
      <path d="M28.5 4V36M31.5 4V36" class={c} style="stroke-width:1.6" />
    </g>
  ),
  /** T-2 component 9: zigzag, an arrow touching it, and the arrow wired to one end */
  pot: (c) => (
    <g>
      {line(`${ZIG}M30 42V35M30 42H54V20`, c)}
      {solid('M30 30l-3 5.5h6z', c)}
      <circle cx="54" cy="20" r="2.2" class={`${c} ${FILL[c] ?? 'ga-fw'}`} />
    </g>
  ),
  /** T-3 component 3: coil, an arrow touching it, and the arrow wired to one end */
  varcoil: (c) => (
    <g>
      {line(`${COIL}M24 40V27M24 40H54V20`, c)}
      {solid('M24 21.5l-3 5.5h6z', c)}
      <circle cx="54" cy="20" r="2.2" class={`${c} ${FILL[c] ?? 'ga-fw'}`} />
    </g>
  ),
  /** T-3 component 2: two plates crossed by an arrow */
  varcap: (c) => (
    <g>
      {line('M0 20H26M26 7V33M34 7V33M34 20H60M15 34L43 8', c)}
      {solid('M46 5l-7 1.500 4.500 4.800z', c)}
    </g>
  ),
  /** T-2 component 8: a diode with arrows pointing away */
  led: (c) => (
    <g>
      {line('M0 20H60M39 10V30', c)}
      {solid('M23 10L39 20L23 30Z', c)}
      <path d="M38 6l7-5M45 1h-4M45 1v4M47 9l7-5M54 4h-4M54 4v4" class={c} style="stroke-width:1.6" />
    </g>
  ),
} satisfies Record<string, Draw>;

type SymName = keyof typeof SYMS;

/* ---------- pictures ---------- */

interface RowItem { id: string; sym: SymName; name: string[]; say: string }

/**
 * A row of symbols tagged A, B, C... that can each be tapped. Once the activity is
 * solved the tags turn into the names of the parts.
 */
function symbolRow(items: RowItem[], right: string, caption: string): ComponentType<PicProps> {
  const step = items.length === 4 ? 57 : 76;
  const k = items.length === 4 ? 0.85 : 0.95; // symbol scale
  const x0 = 120 - (step * (items.length - 1)) / 2;
  return function SymbolRow({ picked, solved, onPick }: PicProps) {
    const label = solved
      ? `Schematic symbols with their names: ${items.map((it) => `${it.say} is a ${it.name.join(' ')}`).join('; ')}.`
      : `Schematic symbols tagged with letters: ${items.map((it, i) => `${'ABCD'[i]}, ${it.say}`).join('; ')}.`;
    return (
      <Art label={label}>
        {items.map((it, i) => {
          const x = x0 + i * step;
          const c = solved && it.id === right ? 'ga-good' : picked === it.id && !solved ? 'ga-bad' : 'ga-k';
          return (
            <g>
              <g transform={`translate(${x - 30 * k} ${54 - 20 * k}) scale(${k})`}>{SYMS[it.sym](c)}</g>
              {solved
                ? it.name.map((w, k) => <T x={x} y={100 + k * 14} a="middle" c={it.id === right ? 'ga-tb' : 'ga-tm'}>{w}</T>)
                : <T x={x} y={102} a="middle" c="ga-tm ga-tb">{'ABCD'[i]}</T>}
              {onPick && <rect x={x - step / 2 + 1} y="10" width={step - 2} height="104" style={{ pointerEvents: 'all', cursor: 'pointer' }} onClick={() => onPick(it.id)} />}
            </g>
          );
        })}
        {!solved && <T x={120} y={132} a="middle" c="ga-tm">{caption}</T>}
      </Art>
    );
  };
}

const FourSymbols = symbolRow([
  { id: 'a', sym: 'lamp', name: ['lamp'], say: 'a small dome with a loop inside' },
  { id: 'b', sym: 'res', name: ['resistor'], say: 'a zigzag line' },
  { id: 'c', sym: 'batt', name: ['battery'], say: 'a stack of long and short lines' },
  { id: 'd', sym: 'bjt', name: ['transistor'], say: 'a circle with three leads and an arrow on one lead' },
], 'd', 'four symbols from figure T-1');

const PlatesAndCoils = symbolRow([
  { id: 'a', sym: 'coil', name: ['inductor'], say: 'one row of loops' },
  { id: 'b', sym: 'cap', name: ['capacitor'], say: 'two lines facing each other across a gap' },
  { id: 'c', sym: 'xfmr', name: ['transformer'], say: 'two coils side by side with two lines between them' },
], 'c', 'plates and coils');

const AddedArrows = symbolRow([
  { id: 'a', sym: 'pot', name: ['variable', 'resistor'], say: 'a zigzag with an arrow touching it' },
  { id: 'b', sym: 'led', name: ['light emitting', 'diode'], say: 'a triangle pointing at a bar, with two small arrows pointing away' },
  { id: 'c', sym: 'varcoil', name: ['variable', 'inductor'], say: 'loops with an arrow touching them' },
], 'c', 'look at the arrows');

interface Spot { id: string; x: number; y: number; w: number; h: number }

/**
 * An official exam figure, cropped to its drawing. `box` is the part of the 900 x 600
 * image to show (it must be 240:140 wide to tall). `spots` are tappable areas, in image pixels.
 */
function figure(n: 1 | 2 | 3, box: [number, number, number], label: string, spots: Spot[] = [], right = ''): ComponentType<PicProps> {
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

const FigureT1 = figure(1, [195, 142, 510],
  'Exam figure T-1. Component 1 is a zigzag line, component 2 a circle with three leads and an arrow, component 3 a small dome, component 4 a stack of long and short lines, and component 5 three slanted strokes at the end of a wire.');

const FigureT2 = figure(2, [296, 160, 520],
  'The right-hand part of exam figure T-2, showing components 4 to 10. Component 4 is two coils side by side, component 6 a straight line facing a curved line, component 8 a triangle and bar with two small arrows pointing away, and component 9 a zigzag with an arrow touching it.');

const FigureT3 = figure(3, [106, 46, 686],
  'Exam figure T-3. Component 2 is two plates crossed by an arrow, component 3 a column of loops with an arrow touching it, and component 4 a triangle pointing down at the top of a wire.',
  [
    { id: '2', x: 328, y: 138, w: 86, h: 100 },
    { id: '3', x: 380, y: 244, w: 122, h: 144 },
    { id: '4', x: 560, y: 46, w: 80, h: 90 },
  ], '3');

/* ---------- recap icons ---------- */

const IconSchematic = () => <Mini><path class="ls-mw" d="M8 38V10H16M32 10H40V38H8" /><path class="ls-mk" d="M16 10l2-5 4 10 4-10 4 10 2-5" /></Mini>;
const IconT1 = () => <Mini><circle class="ls-mk" cx="25" cy="24" r="13" /><path class="ls-mk" d="M5 24H19M19 16V32M19 21l10-6M19 27l10 6" /></Mini>;
const IconPlates = () => <Mini><path class="ls-mk" d="M4 14H12M12 5V23M18 5Q13 14 18 23M16 14H24" /><path class="ls-mk ls-mthin" d="M28 26a4 4 0 0 1 0 8a4 4 0 0 1 0 8M44 26a4 4 0 0 0 0 8a4 4 0 0 0 0 8" /><path class="ls-mw ls-mthin" d="M34.500 25V43M37.500 25V43" /></Mini>;
const IconArrow = () => <Mini><path class="ls-mk" d="M4 18H10l2-7 5 14 5-14 5 14 5-14 5 14 2-7H44" /><path class="ls-ms" d="M24 42V30M19 35l5-5 5 5" /></Mini>;
const IconLed = () => <Mini><path class="ls-mk" d="M4 28H44M28 18V38M14 18L28 28L14 38Z" /><path class="ls-ms ls-mthin" d="M30 13l7-7M37 6h-4M37 6v4M37 17l7-7M44 10h-4M44 10v4" /></Mini>;
const IconAntenna = () => <Mini><path class="ls-mk" d="M10 8H38L24 28ZM24 8V44" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't6c-schematics',
  title: 'Reading a schematic',
  blurb: 'What a schematic shows, and how to name the numbered parts in the three exam figures.',
  sub: 'T6',
  groups: ['T6C'],
  minutes: 9,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t6c-schematics',
      intro: 'Start with a short clip. After it you will read the three exam figures yourself.',
      covers: ['T6C01', 'T6C02', 'T6C06', 'T6C07', 'T6C08', 'T6C09', 'T6C10', 'T6C12'],
    },
    {
      type: 'card',
      id: 'schematic',
      idea: 'What a schematic shows',
      covers: ['T6C01', 'T6C12'],
      picture: { art: 'schematic' },
      heading: 'A schematic is a map of the connections',
      text: [
        'A schematic is an electrical diagram that uses a standard symbol for each component, and lines for the wires that join them.',
        'It works like a subway map. It gets the connections exactly right and ignores the rest: a line can be any length, and a symbol does not look like the real part.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which of these does a schematic show accurately?',
        options: [
          { id: 'len', label: 'How long each wire is', why: 'The lines are drawn to be easy to read. Their length says nothing about the real wires.' },
          { id: 'conn', label: 'Which components are connected', right: true, why: 'Yes. Component connections are what a schematic represents accurately.' },
          { id: 'look', label: 'What each component looks like', why: 'Components are shown as standard symbols, which do not look like the real parts.' },
        ],
      },
      remember: 'An electrical diagram using standard component symbols is called a schematic. It accurately represents component connections.',
    },
    {
      type: 'card',
      id: 'four',
      idea: 'Resistor, transistor, lamp and battery symbols',
      covers: ['T6C02', 'T6C03', 'T6C04', 'T6C05'],
      picture: { draw: FourSymbols },
      heading: 'Four symbols to know by shape',
      text: [
        'A zigzag line is a resistor. A stack of long and short lines is a battery. A small dome with a loop inside, like a bulb, is a lamp.',
        'A transistor is a circle with three leads, and one of the leads carries a small arrow.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which symbol is the transistor? Tap it in the picture, or tap an answer.',
        options: [
          { id: 'a', label: 'Symbol A', why: 'A is the small dome with a loop inside: a lamp. It has only two leads.' },
          { id: 'b', label: 'Symbol B', why: 'B is the zigzag line: a resistor.' },
          { id: 'c', label: 'Symbol C', why: 'C is the stack of long and short lines: a battery.' },
          { id: 'd', label: 'Symbol D', right: true, why: 'Yes. A circle with three leads and an arrow on one lead is a transistor.' },
        ],
      },
      remember: 'Zigzag: resistor. Circle with three leads and an arrow: transistor. Small dome: lamp. Long and short lines: battery.',
    },
    {
      type: 'card',
      id: 't1',
      idea: 'The parts of figure T-1',
      covers: ['T6C02', 'T6C03', 'T6C04', 'T6C05'],
      picture: { draw: FigureT1 },
      heading: 'Name the parts of figure T-1',
      text: [
        'This is figure T-1 from the exam. The numbers are only tags. The exam asks what the component beside a number is.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each numbered component to its name. Tap a number, then tap the name.',
        slots: [
          { id: 'res', label: 'Resistor', sub: 'zigzag line', rule: 'A resistor is drawn as a zigzag line.' },
          { id: 'tra', label: 'Transistor', sub: 'circle, three leads', rule: 'A transistor is a circle with three leads and an arrow on one.' },
          { id: 'lamp', label: 'Lamp', sub: 'small dome', rule: 'A lamp is a small dome with a loop inside.' },
          { id: 'bat', label: 'Battery', sub: 'long and short lines', rule: 'A battery is a stack of long and short lines.' },
        ],
        items: [
          { id: '3', label: '3', slot: 'lamp', why: 'Component 3 in figure T-1 is the small dome with a loop inside: a lamp.' },
          { id: '1', label: '1', slot: 'res', why: 'Component 1 in figure T-1 is the zigzag line: a resistor.' },
          { id: '4', label: '4', slot: 'bat', why: 'Component 4 in figure T-1 is the stack of long and short lines: a battery.' },
          { id: '2', label: '2', slot: 'tra', why: 'Component 2 in figure T-1 is the circle with three leads and an arrow: a transistor.' },
        ],
      },
      remember: 'Figure T-1: component 1 is a resistor, 2 is a transistor, 3 is a lamp and 4 is a battery. The three slanted strokes at 5 are the ground symbol.',
    },
    {
      type: 'card',
      id: 'plates-coils',
      idea: 'Capacitor and transformer symbols',
      covers: ['T6C06', 'T6C09'],
      picture: { draw: PlatesAndCoils },
      heading: 'Two plates, one coil, two coils',
      text: [
        'Many symbols are a small sketch of what is inside the part. A capacitor is two plates that face each other and never touch, so its symbol is two lines with a gap. In the exam figure one line is straight and one is curved.',
        'A coil of wire is an inductor, drawn as a row of loops. Two coils side by side, with lines between them for the core they share, are a transformer.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which symbol is the transformer? Tap it in the picture, or tap an answer.',
        options: [
          { id: 'a', label: 'Symbol A', why: 'A is a single row of loops: one coil, an inductor. A transformer needs two coils.' },
          { id: 'b', label: 'Symbol B', why: 'B is two lines facing each other across a gap: a capacitor. It has no coils.' },
          { id: 'c', label: 'Symbol C', right: true, why: 'Yes. Two coils side by side, with lines between them for the core, are a transformer.' },
        ],
      },
      remember: 'Two lines facing each other across a gap: capacitor. Two coils side by side: transformer.',
    },
    {
      type: 'card',
      id: 'arrows',
      idea: 'Arrows: variable parts and the LED',
      covers: ['T6C07', 'T6C08', 'T6C10'],
      picture: { draw: AddedArrows },
      heading: 'What an added arrow means',
      text: [
        'An arrow touching a symbol means the part can be adjusted. A zigzag with an arrow touching it is a variable resistor. Loops with an arrow touching them are a variable inductor.',
        'Two small arrows pointing away mean something else: light coming out. A diode is a triangle pointing at a bar. Add the two arrows and it is a light emitting diode, or LED.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which symbol is the variable inductor? Tap it in the picture, or tap an answer.',
        options: [
          { id: 'a', label: 'Symbol A', why: 'A has an arrow touching it, so it is variable, but the zigzag makes it a variable resistor.' },
          { id: 'b', label: 'Symbol B', why: 'B is a diode with two small arrows pointing away: a light emitting diode. Those arrows show light, not adjustment.' },
          { id: 'c', label: 'Symbol C', right: true, why: 'Yes. Loops are an inductor, and the arrow touching them makes it a variable inductor.' },
        ],
      },
      remember: 'An arrow touching a symbol means variable. A diode with small arrows pointing away is a light emitting diode.',
    },
    {
      type: 'card',
      id: 't2',
      idea: 'The parts of figure T-2',
      covers: ['T6C06', 'T6C07', 'T6C08', 'T6C09'],
      picture: { draw: FigureT2 },
      heading: 'Name the parts of figure T-2',
      text: [
        'Figure T-2 has ten numbered components. The questions for this lesson ask you to name four of them: 4, 6, 8 and 9. Components 1, 2 and 3 are off the left edge here, so that the rest is large enough to read.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each numbered component to its name. Tap a number, then tap the name.',
        slots: [
          { id: 'cap', label: 'Capacitor', sub: 'two lines, a gap', rule: 'A capacitor is two lines facing each other across a gap.' },
          { id: 'led', label: 'Light emitting diode', sub: 'arrows away', rule: 'A light emitting diode is a triangle and bar with two small arrows pointing away.' },
          { id: 'xfmr', label: 'Transformer', sub: 'two coils', rule: 'A transformer is two coils side by side.' },
          { id: 'pot', label: 'Variable resistor', sub: 'zigzag, arrow', rule: 'A variable resistor is a zigzag with an arrow touching it.' },
        ],
        items: [
          { id: '9', label: '9', slot: 'pot', why: 'Component 9 in figure T-2 is a zigzag with an arrow touching it: a variable resistor. Component 7 has no arrow, so it is a plain resistor.' },
          { id: '4', label: '4', slot: 'xfmr', why: 'Component 4 in figure T-2 is two coils side by side with lines between them: a transformer.' },
          { id: '8', label: '8', slot: 'led', why: 'Component 8 in figure T-2 is a diode with two small arrows pointing away: a light emitting diode.' },
          { id: '6', label: '6', slot: 'cap', why: 'Component 6 in figure T-2 is a straight line facing a curved line across a gap: a capacitor.' },
        ],
      },
      remember: 'Figure T-2: component 4 is a transformer, 6 is a capacitor, 8 is a light emitting diode and 9 is a variable resistor.',
    },
    {
      type: 'card',
      id: 't3',
      idea: 'Figure T-3: variable inductor and antenna',
      covers: ['T6C10', 'T6C11'],
      picture: { draw: FigureT3 },
      heading: 'Figure T-3 ends in an antenna',
      text: [
        'One more symbol: a triangle pointing down with a line through its center, at the top of a wire, is an antenna. In figure T-3 it is component 4.',
        'Components 2 and 3 both carry an arrow, so both are variable. The shape under the arrow tells you which part each one is.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which component is the variable inductor? Tap it in the figure, or tap an answer.',
        options: [
          { id: '2', label: 'Component 2', why: 'Component 2 is two plates crossed by an arrow: a variable capacitor. An inductor is drawn as loops.' },
          { id: '3', label: 'Component 3', right: true, why: 'Yes. Component 3 is a column of loops with an arrow touching it: a variable inductor.' },
          { id: '4', label: 'Component 4', why: 'Component 4 is the triangle at the top of the wire: the antenna.' },
        ],
      },
      remember: 'Figure T-3: component 3 is a variable inductor and component 4 is an antenna.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T6C03', 'T6C08', 'T6C09', 'T6C11', 'T6C12'],
      questions: [
        {
          q: 'On a schematic the battery is drawn right beside the lamp. What does that tell you about the real circuit?',
          review: 'schematic',
          covers: ['T6C12'],
          choices: [
            { label: 'The two parts sit side by side', why: 'A schematic does not show where parts sit. It only shows how they are connected.' },
            { label: 'Only how the two are connected', right: true, why: 'A schematic accurately shows the connections between components, and nothing about their position.' },
            { label: 'The wire between them is short', why: 'Line lengths on a schematic say nothing about real wire lengths.' },
          ],
        },
        {
          q: 'A symbol is a zigzag line with an arrow touching it. What is the part?',
          review: 'arrows',
          covers: ['T6C08'],
          choices: [
            { label: 'A variable resistor', right: true, why: 'The zigzag is a resistor, and the arrow touching it means it is variable.' },
            { label: 'A variable inductor', why: 'A variable inductor is loops with an arrow. A zigzag is a resistor.' },
            { label: 'A light emitting diode', why: 'A light emitting diode is a triangle and bar with small arrows pointing away, not a zigzag.' },
          ],
        },
        {
          q: 'A symbol shows two separate coils side by side, with two straight lines between them. What is it?',
          review: 'plates-coils',
          covers: ['T6C09'],
          choices: [
            { label: 'A capacitor', why: 'A capacitor is two lines facing each other across a gap. It has no coils.' },
            { label: 'A variable inductor', why: 'A variable inductor is one coil with an arrow. This symbol has two coils and no arrow.' },
            { label: 'A transformer', right: true, why: 'Two coils side by side, with lines between them for the core, are a transformer.' },
          ],
        },
        {
          q: 'A wire runs up the page and ends in a triangle pointing down with a line through its center. What is at the top?',
          review: 't3',
          covers: ['T6C11'],
          choices: [
            { label: 'A lamp', why: 'A lamp is a small dome with a loop inside, not a triangle.' },
            { label: 'A transistor', why: 'A transistor is a circle with three leads and an arrow on one lead.' },
            { label: 'An antenna', right: true, why: 'A triangle pointing down with a line through it, at the top of a wire, is the antenna symbol.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T6C01', 'T6C02', 'T6C03', 'T6C04', 'T6C05', 'T6C06', 'T6C07', 'T6C08', 'T6C09', 'T6C10', 'T6C11', 'T6C12'],
      facts: [
        { icon: IconSchematic, text: 'A schematic is an electrical diagram using standard component symbols. It accurately shows component connections, not wire lengths or what parts look like.', covers: ['T6C01', 'T6C12'] },
        { icon: IconT1, text: 'Figure T-1: 1 is a resistor (zigzag), 2 a transistor (circle with an arrow), 3 a lamp (dome) and 4 a battery (long and short lines).', covers: ['T6C02', 'T6C03', 'T6C04', 'T6C05'] },
        { icon: IconPlates, text: 'Figure T-2: 6 is a capacitor (two lines with a gap) and 4 is a transformer (two coils side by side).', covers: ['T6C06', 'T6C09'] },
        { icon: IconArrow, text: 'An arrow touching a symbol means variable. Figure T-2, 9 is a variable resistor. Figure T-3, 3 is a variable inductor.', covers: ['T6C08', 'T6C10'] },
        { icon: IconLed, text: 'A diode with small arrows pointing away is a light emitting diode: component 8 in figure T-2.', covers: ['T6C07'] },
        { icon: IconAntenna, text: 'A triangle pointing down at the top of a wire is an antenna: component 4 in figure T-3.', covers: ['T6C11'] },
      ],
    },
  ],
};
export default LESSON;
