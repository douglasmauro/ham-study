import { Art, Mini, T } from '../drawkit';
import type { Lesson } from '../types';

/*
 * Lesson: Diodes and transistors (question group T6B, all 12 questions).
 * Every exam fact below comes from a T6B question and its keyed answer; the ids are in each
 * step's `covers`. The bipolar transistor symbol matches component 2 of the official
 * Figure T-1. The exam figures have no field-effect transistor, so that symbol is the one
 * the glossary drawing uses.
 */

/* ---------- pictures ---------- */

/** The two transistor families side by side, each with the names of its three leads. T6B05, T6B12 */
function TwoFamilies() {
  return (
    <Art label="Two transistor symbols. On the left a bipolar junction transistor: base at the side, collector at the top, emitter at the bottom on the lead with the arrow. On the right a field-effect transistor: gate at the side, drain at the top, source at the bottom.">
      <T x={66} y={16} a="middle" c="ga-tb">bipolar junction</T>
      <g transform="translate(42 50) scale(1.1)">
        <circle class="ga-w" cx="31" cy="20" r="17" />
        <path class="ga-w" d="M0 20H23M23 15l15-9V-6M23 25l15 9V46" />
        <path class="ga-w ga-thick" d="M23 9V31" />
        <path class="ga-w ga-fw ga-thin" d="M37.500 33.600l-6.500-1.200 3.200-5z" />
      </g>
      <T x={38} y={76} a="end" c="ga-tk ga-tb">base</T>
      <T x={89} y={48} c="ga-tk ga-tb">collector</T>
      <T x={89} y={102} c="ga-tk ga-tb">emitter</T>

      <T x={178} y={16} a="middle" c="ga-tb">field-effect (FET)</T>
      <g transform="translate(150 50) scale(1.1)">
        <circle class="ga-w" cx="31" cy="20" r="17" />
        <path class="ga-w" d="M0 20H16M24 13H38V-6M24 27H38V46" />
        <path class="ga-w ga-thick" d="M24 9V31" />
        <path class="ga-w ga-fw ga-thin" d="M22.500 20l-6.500-3.600v7.200z" />
      </g>
      <T x={146} y={76} a="end" c="ga-ts ga-tb">gate</T>
      <T x={197} y={48} c="ga-ts ga-tb">drain</T>
      <T x={197} y={102} c="ga-ts ga-tb">source</T>
      <T x={120} y={130} a="middle" c="ga-tm">two families, three leads each</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconDiode = () => <Mini><path class="ls-mw" d="M3 24H15M33 24H45" /><path class="ls-mk" d="M15 13V35L32 24ZM33 13V35" /></Mini>;
const IconDrop = () => <Mini><path class="ls-mw" d="M9 40V8M15 40V8" /><path class="ls-mk" d="M33 40V22M39 40V22" /><path class="ls-ms ls-mthin" d="M20 8H36M36 8V16M32 12L36 16L40 12" /></Mini>;
const IconLed = () => <Mini><path class="ls-mw" d="M3 28H14M30 28H42" /><path class="ls-mk" d="M14 18V38L29 28ZM30 18V38" /><path class="ls-ms ls-mthin" d="M30 14L37 7M33 7H37V11M38 20L45 13M41 13H45V17" /></Mini>;
const IconTransistor = () => <Mini><circle class="ls-mw ls-mthin" cx="27" cy="24" r="17" /><path class="ls-mk" d="M4 24H20M20 14V34M20 19L33 11V4M20 29L33 37V44" /></Mini>;
const IconGain = () => <Mini><path class="ls-mk" d="M14 8V40L38 24Z" /><path class="ls-ms ls-mthin" d="M3 24H14" /><path class="ls-ms" d="M38 24H46" /></Mini>;
const IconNames = () => (
  <Mini>
    <text class="ls-mt" x="24" y="19" text-anchor="middle">EBC</text>
    <path class="ls-mw ls-mthin" d="M8 25H40" />
    <text class="ls-mt" x="24" y="41" text-anchor="middle">GDS</text>
  </Mini>
);

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't6b-semiconductors',
  title: 'Diodes and transistors',
  blurb: 'The one-way valve and the electronic switch: what diodes and transistors do, and the names of their leads.',
  sub: 'T6',
  groups: ['T6B'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t6b-semiconductors',
      intro: 'Start with a short clip on the two parts in this lesson. After it you will try each idea yourself.',
      covers: ['T6B02', 'T6B03', 'T6B06', 'T6B07', 'T6B09', 'T6B10', 'T6B11'],
    },
    {
      type: 'card',
      id: 'diode',
      idea: 'A diode is a one-way valve',
      covers: ['T6B02'],
      picture: { art: 'diode' },
      heading: 'A diode lets current flow in only one direction',
      text: [
        'A diode is a one-way valve for current. In the forward direction it conducts. Turn the current around and the diode blocks it.',
        'Diodes are made of semiconductor material, such as silicon. Why it matters: a power supply uses diodes to turn the back-and-forth current from a wall outlet into the one-way current a radio needs.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A diode is conducting. You take it out and put it back in the other way round. What happens to the current?',
        options: [
          { id: 'same', label: 'It flows just as before', why: 'A plain wire would do that. A diode passes current one way only, so turning it around matters.' },
          { id: 'block', label: 'The diode blocks it', right: true, why: 'Yes. A diode allows current to flow in only one direction, and this is now the wrong one.' },
          { id: 'more', label: 'More current flows', why: 'Turning a diode around never helps the current. In the reverse direction the diode blocks it.' },
        ],
      },
      remember: 'The component that allows current to flow in only one direction is the diode.',
    },
    {
      type: 'card',
      id: 'electrodes',
      idea: 'Anode, cathode and the stripe',
      covers: ['T6B06', 'T6B09'],
      picture: { art: 'cathode' },
      heading: 'The two ends are the anode and the cathode',
      text: [
        'An electrode is a terminal of a part, a place where current goes in or out. A diode has two: the anode and the cathode. When it conducts, current goes in at the anode and out at the cathode.',
        'A diode fitted backwards will not conduct, so the package has to show which end is which. The cathode end is often marked with a stripe. In the symbol, the cathode is the end with the bar.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You pick up a diode. There is a stripe painted around one end. Which lead is at that end?',
        options: [
          { id: 'anode', label: 'The anode', why: 'The anode is the unmarked end. The stripe is put on the other one.' },
          { id: 'cathode', label: 'The cathode', right: true, why: 'Yes. The cathode lead of a diode is often marked with a stripe.' },
          { id: 'either', label: 'Either. The stripe is only decoration', why: 'The stripe is there for a reason: a diode works one way round only, and the stripe marks its cathode.' },
        ],
      },
      remember: 'The electrodes of a diode are the anode and the cathode. A stripe on the package marks the cathode.',
    },
    {
      type: 'card',
      id: 'drop',
      idea: 'Forward voltage drop',
      covers: ['T6B01'],
      picture: { art: 'forward-voltage-drop' },
      heading: 'A conducting diode uses up a little voltage',
      text: [
        'A diode is not a perfect valve. While it conducts, a small voltage is lost across it. This is its forward voltage drop, and whatever comes after the diode gets that much less.',
        'The drop is lower in some diode types than in others. A common silicon diode drops about 0.7 volts. A type called a Schottky diode drops less, about 0.3 volts.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A 12 volt battery feeds a lamp through a diode that drops 0.7 volts. How much voltage reaches the lamp?',
        options: [
          { id: 'full', label: '12 volts', why: 'That would mean the diode costs nothing. Its forward voltage drop is taken away from what reaches the lamp.' },
          { id: 'less', label: '11.3 volts', right: true, why: 'Yes. 12 minus 0.7 is 11.3. A diode type with a lower drop would leave more for the lamp.' },
          { id: 'more', label: '12.7 volts', why: 'A diode never adds voltage. The drop is taken away: 12 minus 0.7.' },
        ],
      },
      remember: 'Forward voltage drop is lower in some diode types than in others.',
    },
    {
      type: 'card',
      id: 'led',
      idea: 'An LED lights with forward current',
      covers: ['T6B07'],
      picture: { art: 'led' },
      heading: 'An LED is a diode that gives off light',
      text: [
        'LED stands for light-emitting diode. It is a diode, so it conducts one way only. Current flowing through a diode in its conducting direction is called forward current.',
        'Forward current is what makes an LED emit light. Put it in backwards and it blocks the current and stays dark. The indicator lights on a radio are usually LEDs.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'The power light on a home-built radio is an LED. It stays dark, and the builder finds it was put in backwards. Why is it dark?',
        options: [
          { id: 'rev', label: 'Reverse current makes an LED dim', why: 'There is no reverse current to speak of. A diode blocks current in the reverse direction.' },
          { id: 'fwd', label: 'No forward current can flow through it', right: true, why: 'Yes. An LED emits light only when forward current flows, and backwards it blocks the current.' },
          { id: 'rf', label: 'It needs a radio signal to light', why: 'An LED does not need a radio signal. It needs forward current.' },
        ],
      },
      remember: 'Forward current causes an LED to emit light.',
    },
    {
      type: 'card',
      id: 'transistor',
      idea: 'A transistor is an electronic switch',
      covers: ['T6B03', 'T6B04'],
      picture: { art: 'transistor' },
      heading: 'A transistor lets a small signal control a large current',
      text: [
        'A transistor has three leads. Inside, it can consist of three regions of semiconductor material, one for each lead. A small signal on one lead controls a much larger current through the other two.',
        'Drive it fully on or fully off and it is a switch. Unlike the switches in the last lesson it has no arm and no contacts, so nothing moves. That makes it an electronic switch.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A circuit must turn a current on and off thousands of times a second, with no moving parts. Which part can do it?',
        options: [
          { id: 'pot', label: 'A potentiometer', why: 'A potentiometer is a resistor adjusted by a knob. Someone has to turn it, and it does not switch.' },
          { id: 'diode', label: 'A diode', why: 'A diode only decides the direction of current. It has no third lead for a signal to control it.' },
          { id: 'tr', label: 'A transistor', right: true, why: 'Yes. A transistor can be used as an electronic switch: a small signal turns the larger current on or off.' },
        ],
      },
      remember: 'A transistor can be used as an electronic switch. It can consist of three regions of semiconductor material.',
    },
    {
      type: 'card',
      id: 'gain',
      idea: 'Gain: output compared with input',
      covers: ['T6B10', 'T6B11'],
      picture: { art: 'gain' },
      heading: 'A transistor can make a signal bigger',
      text: [
        'Used part way between off and on, a transistor amplifies: a small signal goes in and a larger copy comes out. The extra power comes from the power supply. A transistor can provide power gain.',
        'Gain is the output relative to the input. It can be worked out for voltage, for current or for power. Example: 2 watts in and 20 watts out is a power gain of 20 divided by 2, which is 10.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'An amplifier takes in 5 watts and puts out 50 watts. What is its power gain?',
            left: 'gain',
            top: '50 W out',
            bottom: '5 W in',
            accept: [10, 10],
            traps: [
              { range: [0.1, 0.1], why: 'That is 5 divided by 50. Turn it over: the output goes on top.' },
              { range: [45, 45], why: 'That is 50 minus 5. Gain is a ratio, so divide the output by the input.' },
              { range: [250, 250], why: 'That is 50 times 5. Divide instead: output on top, input below.' },
            ],
            hint: 'Not quite. Ask how many times 5 fits into 50.',
            answer: '10',
            working: ['50 ÷ 5 = 10', 'The output power is 10 times the input power.'],
          },
          {
            prompt: 'Gain works the same way for voltage. A signal of 2 volts goes in and 6 volts comes out. What is the voltage gain?',
            left: 'gain',
            top: '6 V out',
            bottom: '2 V in',
            accept: [3, 3],
            traps: [
              { range: [0.33, 0.34], why: 'That is 2 divided by 6. Turn it over: the output goes on top.' },
              { range: [4, 4], why: 'That is 6 minus 2. Gain is a ratio, so divide the output by the input.' },
              { range: [12, 12], why: 'That is 6 times 2. Divide instead: output on top, input below.' },
            ],
            hint: 'Not quite. Ask how many times 2 fits into 6.',
            answer: '3',
            working: ['6 ÷ 2 = 3', 'Voltage, current or power: gain is always output relative to input.'],
          },
        ],
      },
      remember: 'A transistor can provide power gain. Gain is the output relative to the input, for voltage, current or power.',
    },
    {
      type: 'card',
      id: 'families',
      idea: 'Two transistor families and their lead names',
      covers: ['T6B05', 'T6B08', 'T6B12'],
      picture: { draw: TwoFamilies },
      heading: 'Two kinds of transistor, two sets of names',
      text: [
        'The exam wants the names of the leads. A bipolar junction transistor has an emitter, a base and a collector.',
        'The other kind is the FET, which stands for field effect transistor. Its leads are the gate, the drain and the source. A way to keep them apart: the FET is the one with a gate.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Put each lead name with its kind of transistor. Tap a name, then tap the kind.',
        slots: [
          { id: 'bjt', label: 'Bipolar junction', sub: 'transistor', rule: 'Its leads are the emitter, the base and the collector.' },
          { id: 'fet', label: 'Field-effect', sub: 'transistor (FET)', rule: 'Its leads are the gate, the drain and the source.' },
        ],
        items: [
          { id: 'gate', label: 'Gate', slot: 'fet', why: 'The gate is the control lead of a field-effect transistor.' },
          { id: 'base', label: 'Base', slot: 'bjt', why: 'The base is the control lead of a bipolar junction transistor.' },
          { id: 'drain', label: 'Drain', slot: 'fet', why: 'Gate, drain and source belong to the field-effect transistor.' },
          { id: 'emitter', label: 'Emitter', slot: 'bjt', why: 'Emitter, base and collector belong to the bipolar junction transistor.' },
          { id: 'source', label: 'Source', slot: 'fet', why: 'Gate, drain and source belong to the field-effect transistor.' },
          { id: 'collector', label: 'Collector', slot: 'bjt', why: 'Emitter, base and collector belong to the bipolar junction transistor.' },
        ],
      },
      remember: 'Bipolar junction transistor: emitter, base, collector. Field effect transistor (FET): gate, drain, source.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T6B02', 'T6B06', 'T6B07', 'T6B09', 'T6B10', 'T6B11', 'T6B12'],
      questions: [
        {
          q: 'You are soldering a diode onto a circuit board and it must go in the right way round. How do you find its cathode?',
          review: 'electrodes',
          covers: ['T6B06', 'T6B09'],
          choices: [
            { label: 'It is the longer end of the package', why: 'The two ends of the package are the same size. Look for the stripe.' },
            { label: 'It is the end with the stripe', right: true, why: 'The cathode of a diode is often marked with a stripe on the package.' },
            { label: 'It does not matter. A diode works both ways', why: 'A diode passes current one way only, so it does matter. The stripe marks the cathode.' },
          ],
        },
        {
          q: 'An LED on your radio is glowing. What is happening inside it?',
          review: 'led',
          covers: ['T6B02', 'T6B07'],
          choices: [
            { label: 'Current is flowing through it in the forward direction', right: true, why: 'Forward current is what makes an LED emit light.' },
            { label: 'Current is flowing through it backwards', why: 'A diode blocks current in the reverse direction, and an LED stays dark that way.' },
            { label: 'It is storing energy in a magnetic field', why: 'That is an inductor, a coil of wire. An LED is a diode that lights with forward current.' },
          ],
        },
        {
          q: 'An amplifier puts out 20 watts when 2 watts go in. What is its power gain?',
          review: 'gain',
          covers: ['T6B10', 'T6B11'],
          choices: [
            { label: '18', why: 'That is 20 minus 2. Gain is a ratio: output divided by input.' },
            { label: '10', right: true, why: '20 ÷ 2 = 10. Gain is the output relative to the input.' },
            { label: '0.1', why: 'That is 2 divided by 20, which is upside down. The output goes on top.' },
          ],
        },
        {
          q: 'On a circuit drawing, one lead of a transistor is labelled base. What are its other two leads called?',
          review: 'families',
          covers: ['T6B12'],
          choices: [
            { label: 'Drain and source', why: 'Drain and source go with a gate, on a field-effect transistor. A base belongs to the other kind.' },
            { label: 'Anode and cathode', why: 'Anode and cathode are the two electrodes of a diode, not of a transistor.' },
            { label: 'Emitter and collector', right: true, why: 'A base means a bipolar junction transistor: emitter, base and collector.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T6B01', 'T6B02', 'T6B03', 'T6B04', 'T6B05', 'T6B06', 'T6B07', 'T6B08', 'T6B09', 'T6B10', 'T6B11', 'T6B12'],
      facts: [
        { icon: IconDiode, text: 'A diode allows current to flow in only one direction. Its electrodes are the anode and the cathode, and a stripe marks the cathode.', covers: ['T6B02', 'T6B06', 'T6B09'] },
        { icon: IconDrop, text: 'Forward voltage drop is lower in some diode types than in others.', covers: ['T6B01'] },
        { icon: IconLed, text: 'Forward current causes an LED to emit light.', covers: ['T6B07'] },
        { icon: IconTransistor, text: 'A transistor can be used as an electronic switch. It can consist of three regions of semiconductor material.', covers: ['T6B03', 'T6B04'] },
        { icon: IconGain, text: 'A transistor can provide power gain. Gain is output relative to input, for voltage, current or power.', covers: ['T6B10', 'T6B11'] },
        { icon: IconNames, text: 'Bipolar junction: emitter, base, collector. FET, the field effect transistor: gate, drain, source.', covers: ['T6B05', 'T6B08', 'T6B12'] },
      ],
    },
  ],
};
export default LESSON;
