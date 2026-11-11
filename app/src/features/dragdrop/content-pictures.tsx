import type { PlaceSpec } from './Place';
import { At, Ground, SYM } from './symbols';

/*
 * Label and build activities. Pictures are inline SVG in the house style:
 * wires in the muted color, the part being taught in the topic color, the
 * signal or current path in amber. Pool question ids are noted beside each fact.
 */

// ---------------------------------------------------------------- Label the picture

/** T6: the circuit of exam figure T-1, redrawn. */
export const labelFigureT1: PlaceSpec = {
  how: 'This is the circuit from exam figure T-1. Drag each name onto its box, or tap a name and then a box.',
  view: [350, 262],
  alt: 'A circuit like exam figure T-1: two input terminals, a zigzag symbol, a circle with three leads, a dome-shaped symbol and a stack of long and short lines.',
  art: () => (
    <g class="dd-art">
      <g class="dd-wire">
        <path d="M8 140H19M29 140H55M115 140H121M8 172H19M24 177V204" />
        <circle cx="24" cy="140" r="5" />
        <circle cx="24" cy="172" r="5" />
        <path d="M187.25 115.5V80H222M282 80H318V108M318 168V212M187.25 164.5V212" />
        <Ground x={24} y={204} />
        <Ground x={187.25} y={212} />
        <Ground x={318} y={212} />
      </g>
      <g class="dd-topic">
        <At x={55} y={120}>{SYM.resistor}</At>
        <At x={120.75} y={105} scale={1.75}>{SYM.transistor}</At>
        <At x={222} y={60}>{SYM.lamp}</At>
        <At x={288} y={118} turn={90}>{SYM.battery}</At>
      </g>
    </g>
  ),
  spots: [
    { id: 'r', x: 39, y: 62, w: 92, line: [85, 127] },
    { id: 'q', x: 62, y: 208, w: 92, line: [160, 168] },
    { id: 'lamp', x: 206, y: 6, w: 92, line: [252, 60] },
    { id: 'bat', x: 208, y: 116, w: 90 },
  ],
  pieces: [
    { id: 'r', text: 'Resistor', spot: 'r', why: 'The zigzag line is a resistor. It is component 1 in figure T-1.' }, // T6C02
    { id: 'q', text: 'Transistor', spot: 'q', why: 'The circle with three leads is a transistor, component 2 in figure T-1. Here it controls the flow of current.' }, // T6C03, T6D10
    { id: 'lamp', text: 'Lamp', spot: 'lamp', why: 'The dome is a lamp. It is component 3 in figure T-1.' }, // T6C04
    { id: 'bat', text: 'Battery', spot: 'bat', why: 'The stack of long and short lines is a battery. It is component 4 in figure T-1.' }, // T6C05
  ],
};

const cell = (i: number) => ({ cx: 87.5 + (i % 2) * 175, top: 4 + Math.floor(i / 2) * 132 });
const SHEET: { id: string; text: string; sym: keyof typeof SYM; why: string }[] = [
  { id: 'cap', text: 'Capacitor', sym: 'capacitor', why: 'Two plates with a gap between them: a capacitor. It is component 6 in figure T-2.' }, // T6C06
  { id: 'led', text: 'Light emitting diode', sym: 'led', why: 'A diode with arrows of light leaving it: a light emitting diode. It is component 8 in figure T-2.' }, // T6C07
  { id: 'pot', text: 'Variable resistor', sym: 'variableResistor', why: 'A resistor with an arrow touching it: a variable resistor. It is component 9 in figure T-2.' }, // T6C08
  { id: 'xfmr', text: 'Transformer', sym: 'transformer', why: 'Two coils side by side: a transformer. It is component 4 in figure T-2.' }, // T6C09
  { id: 'vind', text: 'Variable inductor', sym: 'variableInductor', why: 'A coil with an arrow touching it: a variable inductor. It is component 3 in figure T-3.' }, // T6C10
  { id: 'ant', text: 'Antenna', sym: 'antenna', why: 'A triangle on a stem: an antenna. It is component 4 in figure T-3.' }, // T6C11
];

/** T6: six symbols from exam figures T-2 and T-3. */
export const labelSymbols: PlaceSpec = {
  how: 'These symbols come from exam figures T-2 and T-3. Drag each name under its symbol, or tap a name and then a box.',
  view: [350, 400],
  alt: 'Six schematic symbols: two plates, a diode with arrows, a zigzag with an arrow, two coils side by side, a coil with an arrow, and a triangle on a stem.',
  art: () => (
    <g class="dd-art dd-topic">
      {SHEET.map((s, i) => {
        const { cx, top } = cell(i);
        return <At key={s.id} x={cx - 48} y={top + 8} scale={1.6}>{SYM[s.sym]}</At>;
      })}
    </g>
  ),
  spots: SHEET.map((s, i) => {
    const { cx, top } = cell(i);
    return { id: s.id, x: cx - 68, y: top + 80, w: 136 };
  }),
  pieces: SHEET.map((s) => ({ id: s.id, text: s.text, spot: s.id, why: s.why })),
};

/** T9: a half-wave dipole. */
export const labelDipole: PlaceSpec = {
  view: [350, 290],
  alt: 'A half-wave dipole: two wires end to end, held up by a support at each end, with a cable hanging from the middle. Arrows point away from the wire at right angles.',
  art: () => (
    <g class="dd-art">
      <path class="dd-thin" d="M4 100H24M326 100H346" />
      <g class="dd-ink">
        <circle cx="30" cy="100" r="5" />
        <circle cx="320" cy="100" r="5" />
      </g>
      <path class="dd-topic" d="M36 100H164M186 100H314" stroke-width="4" />
      <path class="dd-wire" d="M175 108V272" stroke-width="4" />
      <rect class="dd-body" x="164" y="92" width="22" height="16" rx="3" />
      <text x="185" y="270">to the radio</text>
      <g class="dd-signal">
        <path d="M70 88V58M63 66l7-9 7 9M280 88V58M273 66l7-9 7 9" />
      </g>
      <path class="dd-thin" d="M230 40L272 54" />
    </g>
  ),
  spots: [
    { id: 'max', x: 120, y: 8, line: [78, 54] },
    { id: 'wire', x: 14, y: 150, line: [100, 105] },
    { id: 'feed', x: 226, y: 150, line: [186, 110] },
    { id: 'coax', x: 40, y: 216, line: [171, 238] },
  ],
  pieces: [
    { id: 'max', text: 'Strongest signal', spot: 'max', why: 'A half-wave dipole radiates its strongest signal broadside to the antenna, at right angles to the wire.' }, // T9A10
    { id: 'wire', text: 'Wire element', spot: 'wire', why: 'The wires are the part that radiates. Shortening them raises the resonant frequency.' }, // T9A05
    { id: 'feed', text: 'Feed point', spot: 'feed', why: 'The feed point is at the center, where the feed line joins the two wires.' },
    { id: 'coax', text: 'Coax feed line', spot: 'coax', why: 'Coaxial cable is the most common feed line. Most coax used in amateur radio is 50 ohms.' }, // T9B03, T9B02
  ],
};

// ---------------------------------------------------------------- Build it

/** T5: a simple series circuit that lights a lamp. */
export const buildSeriesCircuit: PlaceSpec = {
  how: 'Fill the four gaps to light the lamp. Drag a part into a gap, or tap a part and then a gap. Two parts do not belong.',
  view: [350, 300],
  alt: 'A loop of wire with a lamp on the right side and four gaps: one on the left side, two along the top and one along the bottom.',
  art: ({ done }) => (
    <g class="dd-art">
      <path class="dd-wire" d="M60 128V50H62M172 50H178M288 50H290V124M290 176V250H230M120 250H60V172" />
      <circle class="dd-signal-fill dd-when-on dd-pulse" cx="290" cy="150" r="30" opacity=".3" style={{ fillOpacity: 0.28 }} />
      <g class={done ? 'dd-signal' : 'dd-topic'}>
        <At x={260} y={130} turn={90} scale={1}>{SYM.lamp}</At>
      </g>
      <path class="dd-flow" d="M60 128V50H290V250H60V172" />
      <text class="dd-strong" x="190" y="146" text-anchor="middle">{done ? 'Lamp is lit' : 'Lamp is off'}</text>
      <text x="190" y="164" text-anchor="middle">{done ? 'Current flows' : 'The loop has gaps'}</text>
    </g>
  ),
  spots: [
    { id: 'src', x: 5, y: 128, prompt: 'Power source', need: 'a power source' },
    { id: 'fuse', x: 62, y: 28, prompt: 'Overload protection', need: 'something that removes power if there is an overload' },
    { id: 'sw', x: 178, y: 28, prompt: 'On and off', need: 'something that turns the circuit on and off' },
    { id: 'res', x: 120, y: 228, prompt: 'Limits the current', need: 'something that opposes the flow of current' },
  ],
  pieces: [
    { id: 'bat', text: 'Battery', spot: 'src', icon: SYM.battery, why: 'The battery is the power source. Its voltage is what makes current flow.' }, // T6C05, T5A05
    { id: 'fuse', text: 'Fuse', spot: 'fuse', icon: SYM.fuse, why: 'A fuse removes power in case of an overload.' }, // T0A04
    { id: 'sw', text: 'Switch', spot: 'sw', icon: SYM.switchOpen, iconOn: SYM.switchClosed, why: 'A single-pole single-throw switch turns the circuit on and off.' }, // T6A09 (symbol)
    { id: 'res', text: 'Resistor', spot: 'res', icon: SYM.resistor, why: 'A resistor opposes the flow of current.' }, // T6A01
    { id: 'vm', text: 'Voltmeter', icon: SYM.voltmeter, why: 'A voltmeter is connected in parallel with a part, not in the loop.' }, // T7D02
    { id: 'glass', text: 'Glass rod', icon: SYM.rod, why: 'Glass is a good insulator, so no current would flow through it.' }, // T5A08
  ],
  doneText: 'The loop is complete, so the lamp lights. In a series circuit the same current flows through every part.', // T5D13
};

/** T4: wiring a mobile station. */
export const buildMobileStation: PlaceSpec = {
  how: 'Wire a radio into a car. Drag a part into its slot, or tap a part and then a slot. Two parts do not belong.',
  view: [350, 290],
  alt: 'Side view of a car with a battery under the hood and a radio in the cabin. Slots mark the antenna, the feed line, the power wires and the negative return.',
  art: ({ filled }) => (
    <g class="dd-art">
      <path class="dd-wire" d="M22 218V180q0-12 14-14l50-8 30-40q4-6 12-6h90q10 0 16 8l28 40 40 8q10 2 10 14v36h-22a24 24 0 0 0-48 0h-128a24 24 0 0 0-48 0z" />
      <circle class="dd-wire" cx="90" cy="218" r="17" />
      <circle class="dd-wire" cx="266" cy="218" r="17" />
      {/* battery, radio, and the wiring between them */}
      <path class="dd-wire" d="M80 183H128M151 168V140M256 140H264V114" />
      <rect class="dd-body" x="28" y="172" width="52" height="22" rx="3" />
      <rect class="dd-body" x="128" y="168" width="46" height="26" rx="4" />
      <text class="dd-strong" x="151" y="186" text-anchor="middle">Radio</text>
      <text class="dd-strong" x="54" y="187.5" text-anchor="middle">Battery</text>
      {filled.ant && <path class="dd-topic" d="M264 112V66M258 112h12" />}
      <path class="dd-flow" d="M80 183H128M151 168V140H264V68" />
      <g class="dd-signal dd-when-on dd-pulse">
        <path d="M252 78a14 14 0 0 1 0-22M242 86a26 26 0 0 1 0-38M276 78a14 14 0 0 0 0-22M286 86a26 26 0 0 0 0-38" />
      </g>
    </g>
  ),
  spots: [
    { id: 'ant', x: 199, y: 8, w: 130, prompt: 'Antenna', need: 'an antenna that works well from a car' },
    { id: 'meter', x: 160, y: 118, w: 96, prompt: 'In the feed line', need: 'something that goes in the feed line' },
    { id: 'dc', x: 6, y: 62, w: 104, prompt: 'DC power wires', need: 'the wires that carry DC power to the radio', line: [104, 182] },
    { id: 'neg', x: 8, y: 242, w: 130, prompt: 'Negative return to', need: 'the place where the negative return connects', line: [50, 196] },
  ],
  pieces: [
    { id: 'roof', text: 'Roof antenna', spot: 'ant', why: 'An antenna mounted outside the vehicle is not shielded by the car body.' }, // T9A07
    { id: 'duck', text: 'Handheld antenna inside the car', why: 'Inside a vehicle the signal is weaker, because the vehicle shields it. A short flexible antenna also has low efficiency.' }, // T9A07, T9A04
    { id: 'meter', text: 'RF power meter', spot: 'meter', why: 'An RF power meter goes in the feed line, between the transmitter and the antenna.' }, // T4A05
    { id: 'heavy', text: 'Short, heavy wires', spot: 'dc', why: 'Short, heavy-gauge wires keep the voltage drop small when you transmit.' }, // T4A03
    { id: 'thin', text: 'Long, thin wires', why: 'Long, thin wires would drop more voltage when you transmit. DC power wires should be short and heavy-gauge.' }, // T4A03
    { id: 'gnd', text: 'Battery chassis ground', spot: 'neg', why: 'The negative power return of a mobile radio connects at the 12-volt battery chassis ground.' }, // T4A11
  ],
  doneText: 'The station is wired and ready to transmit.',
};
