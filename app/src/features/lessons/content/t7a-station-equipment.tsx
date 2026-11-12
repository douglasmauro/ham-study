import { Arrow, Art, Mini, T, fineWave, wave } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Inside your radio (question group T7A, all 11 questions).
 * The lesson follows a signal through the blocks of a radio, one job per block.
 * Every exam fact comes from a T7A question and its keyed answer; the ids are in each
 * step's `covers`. 146.520 MHz (the 2 meter FM calling frequency) agrees with T2A02.
 */

/* ---------- pictures ---------- */

const mhz = (v: number) => (v / 1000).toFixed(3);

/** One VFO feeding both halves of a transceiver. `value` is the frequency in kHz. T7A05, T7A11 */
function VfoDial({ value = 146460, solved }: PicProps) {
  const x = 30 + ((value - 146400) / 240) * 180;
  const f = mhz(value);
  const box = solved ? 'ga-good' : 'ga-w';
  return (
    <Art label={`A tuning scale with a pointer at ${f} megahertz. Below it one block, the VFO, feeds two blocks: the receiver and the transmitter. Both are on ${f} megahertz.`}>
      <path class="ga-w ga-thin" d={`M30 26H210${[0, 1, 2, 3, 4, 5, 6].map((i) => `M${30 + i * 30} 21V31`).join('')}`} />
      <path class="ga-fk" d={`M${x.toFixed(1)} 20l-6 -11h12z`} />
      <rect class="ga-fk ga-soft" x="86" y="42" width="68" height="34" rx="5" />
      <rect class="ga-k" x="86" y="42" width="68" height="34" rx="5" />
      <T x={98} y={64} c="ga-tk ga-tb">VFO</T>
      <path class="ga-s ga-thin" d={fineWave(126, 148, 59, 11, 7)} />
      <Arrow x1={98} y1={78} x2={66} y2={94} />
      <Arrow x1={142} y1={78} x2={174} y2={94} />
      <rect class={box} x="12" y="96" width="92" height="38" rx="5" />
      <T x={58} y={111} a="middle" c="ga-tm">receiver</T>
      <T x={58} y={127} a="middle" c="ga-ts ga-tb ga-mono">{f}</T>
      <rect class={box} x="136" y="96" width="92" height="38" rx="5" />
      <T x={182} y={111} a="middle" c="ga-tm">transmitter</T>
      <T x={182} y={127} a="middle" c="ga-ts ga-tb ga-mono">{f}</T>
    </Art>
  );
}

/** The two receiver qualities side by side. T7A01, T7A04 */
function TwoQualities() {
  return (
    <Art label="Two small pictures. Sensitivity: a weak signal just rising above the noise is still heard. Selectivity: of three signals close together, the receiver passes only the middle one.">
      <T x={62} y={18} a="middle" c="ga-tk ga-tb">sensitivity</T>
      <path class="ga-w ga-thin" d="M12 84l5 -4l5 5l5 -6l5 4l5 -3l5 5l5 -5M72 84l5 -5l5 4l5 -3l5 5l5 -6l5 4l5 -3l5 4" />
      <path class="ga-s" d="M52 84L62 56L72 84" />
      <circle class="ga-k" cx="62" cy="70" r="20" />
      <T x={62} y={112} a="middle">hears a weak</T>
      <T x={62} y={127} a="middle">signal</T>
      <path class="ga-w ga-thin ga-dash" d="M120 10V130" />
      <T x={178} y={18} a="middle" c="ga-tk ga-tb">selectivity</T>
      <path class="ga-w ga-thin" d="M132 90H224" />
      <path class="ga-w ga-thick" d="M154 90V52M202 90V52" />
      <path class="ga-s ga-thick" d="M178 90V46" />
      <path class="ga-k" d="M164 90L168 38H188L192 90" />
      <T x={178} y={112} a="middle">picks one signal</T>
      <T x={178} y={127} a="middle">from many</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconBox = () => <Mini><rect class="ls-mk" x="5" y="12" width="38" height="24" rx="3" /><path class="ls-ms" d="M12 24H20M17 20L21 24L17 28M36 24H28M31 20L27 24L31 28" /></Mini>;
const IconOsc = () => <Mini><circle class="ls-mk" cx="24" cy="24" r="17" /><path class="ls-ms" d="M12 24C15 12 21 12 24 24S33 36 36 24" /></Mini>;
const IconMod = () => <Mini><path class="ls-mk ls-mthin" d="M4 14C14 4 22 4 24 14S34 24 44 14" /><path class="ls-ms" d={wave(4, 44, 34, 8, 6)} /></Mini>;
const IconMix = () => <Mini><circle class="ls-mk" cx="24" cy="24" r="14" /><path class="ls-mk ls-mthin" d="M14 14L34 34M34 14L14 34" /><path class="ls-ms" d="M2 24H8M40 24H46" /></Mini>;
const IconAmp = () => <Mini><path class="ls-mk" d="M12 8V40L40 24Z" /><path class="ls-ms" d="M2 24H10M42 24H46" /></Mini>;
const IconRx = () => <Mini><path class="ls-mw" d="M8 38V20M40 38V20" /><path class="ls-ms" d="M24 38V8" /><path class="ls-mk ls-mthin" d="M15 38L18 4H30L33 38" /><path class="ls-mw ls-mthin" d="M4 38H44" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't7a-station-equipment',
  title: 'Inside your radio',
  blurb: 'The blocks inside a radio, the one job each of them does, and two words that describe a good receiver.',
  sub: 'T7',
  groups: ['T7A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t7a-station-equipment',
      intro: 'Start with a short clip. After it you will follow a signal through the radio, one block at a time.',
      covers: ['T7A01', 'T7A02', 'T7A03', 'T7A04', 'T7A05', 'T7A08', 'T7A10'],
    },
    {
      type: 'card',
      id: 'transceiver',
      idea: 'A transceiver is a transmitter and a receiver',
      covers: ['T7A02'],
      picture: { art: 'transceiver' },
      heading: 'A transceiver is two radios in one box',
      text: [
        'A transmitter sends: it turns your voice into a radio signal for the antenna. A receiver listens: it turns a radio signal from the antenna back into sound.',
        'Nearly every ham radio has both in one box, sharing one antenna. The name is the two words run together: transmitter plus receiver makes transceiver.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A handheld radio lets you talk to a friend and hear the reply. What is inside it?',
        options: [
          { id: 'tx', label: 'Only a transmitter', why: 'A transmitter can only send. You could talk, but you would never hear the reply.' },
          { id: 'rx', label: 'Only a receiver', why: 'A receiver can only listen. You would hear your friend but could not answer.' },
          { id: 'both', label: 'A transmitter and a receiver', right: true, why: 'Yes. It sends and it listens, so it holds both. That makes it a transceiver.' },
        ],
      },
      remember: 'A transceiver is a device that combines a receiver and a transmitter.',
    },
    {
      type: 'card',
      id: 'ptt',
      idea: 'PTT switches from receive to transmit',
      covers: ['T7A07'],
      picture: { art: 'ptt' },
      heading: 'PTT switches the radio from receive to transmit',
      text: [
        'A transceiver spends most of its time receiving. PTT means push to talk: it is the control that tells the radio to stop listening and start sending.',
        'The PTT input is a wire into the radio. Pressing the button connects that wire to ground, the common zero-volt point of the radio. While it is grounded the radio transmits. Let go and it receives again.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You plug a foot switch into the PTT input. Stepping on it grounds the input. What does the transceiver do?',
        options: [
          { id: 'tone', label: 'It sends out a tuning tone', why: 'PTT does not make a tone. It only changes the radio from receiving to transmitting.' },
          { id: 'tx', label: 'It switches from receive to transmit', right: true, why: 'Yes. Grounding the PTT input switches the transceiver from receive to transmit.' },
          { id: 'cw', label: 'It sends one Morse code dot', why: 'A Morse key plugs into a different input. PTT just switches the radio to transmit.' },
        ],
      },
      remember: 'The PTT input switches the transceiver from receive to transmit when grounded.',
    },
    {
      type: 'card',
      id: 'vfo',
      idea: 'The oscillator and the VFO',
      covers: ['T7A05', 'T7A11'],
      picture: { draw: VfoDial },
      heading: 'An oscillator makes the signal. The VFO tunes it',
      text: [
        'Every radio signal starts in an oscillator: a circuit that generates a signal at a specific frequency. It is the first block in the chain.',
        'A variable frequency oscillator, or VFO, is an oscillator you can tune. The tuning knob on a transceiver turns the VFO, and the VFO sets the frequency for both halves of the radio.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Tune the VFO to 146.520 MHz, the 2 meter FM calling frequency. Watch the receiver and the transmitter.',
        label: 'VFO frequency',
        min: 146400,
        max: 146640,
        step: 20,
        start: 146460,
        readouts: (v) => [{ label: 'Receive', value: `${mhz(v)} MHz` }, { label: 'Transmit', value: `${mhz(v)} MHz` }],
        goal: (v) => v === 146520,
        hint: (v) => (v < 146520 ? `${mhz(v)} MHz is too low. Turn the VFO up.` : `${mhz(v)} MHz is too high. Turn the VFO down.`),
        done: 'There: 146.520 MHz. You moved one control, and the receive frequency and the transmit frequency moved together.',
      },
      remember: 'An oscillator generates a signal at a specific frequency. The VFO sets the receive and transmit frequency.',
    },
    {
      type: 'card',
      id: 'modulation',
      idea: 'Modulation puts speech on the carrier',
      covers: ['T7A08'],
      picture: { art: 'modulation' },
      heading: 'Modulation puts your voice on the signal',
      text: [
        'The steady signal from the oscillator is called the carrier. RF means radio frequency, so it is an RF carrier. On its own it says nothing.',
        'The next block combines your speech with the carrier, so the carrier changes in step with your voice. Combining the two is called modulation. The receiver at the other end undoes it to get the speech back.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your microphone signal and the carrier go into a block. Out comes a carrier that changes with your voice. What just happened?',
        options: [
          { id: 'osc', label: 'Oscillation', why: 'Oscillation is what makes the plain carrier in the first place. It does not add speech to it.' },
          { id: 'mod', label: 'Modulation', right: true, why: 'Yes. Combining speech with an RF carrier signal is modulation.' },
          { id: 'amp', label: 'Amplification', why: 'Amplifying only makes a signal stronger. It does not combine speech with a carrier.' },
        ],
      },
      remember: 'Modulation is combining speech with an RF carrier signal.',
    },
    {
      type: 'card',
      id: 'mixer',
      idea: 'A mixer changes the frequency of a signal',
      covers: ['T7A03'],
      picture: { art: 'mixer' },
      heading: 'A mixer moves a signal to another frequency',
      text: [
        'Radios often need the same signal on a different frequency. The block that does this is the mixer.',
        'A mixer takes two inputs: the signal, and a second signal from an oscillator. Out come copies of the signal at new frequencies: the sum of the two and the difference between them. The information riding on the signal is unchanged.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A receiver needs to move an incoming 146 MHz signal down to a lower frequency. Which block converts it?',
        options: [
          { id: 'osc', label: 'An oscillator', why: 'An oscillator only generates a signal of its own. It helps the mixer, but the mixer does the converting.' },
          { id: 'amp', label: 'An amplifier', why: 'An amplifier makes a signal stronger. The signal comes out on the same frequency it went in on.' },
          { id: 'mix', label: 'A mixer', right: true, why: 'Yes. A mixer is used to convert a signal from one frequency to another.' },
        ],
      },
      remember: 'A mixer converts a signal from one frequency to another.',
    },
    {
      type: 'card',
      id: 'transverter',
      idea: 'A transverter moves a transceiver to another band',
      covers: ['T7A06'],
      picture: { art: 'transverter' },
      heading: 'A transverter puts your radio on another band',
      text: [
        'Suppose your transceiver does not cover a band you want to use. A transverter is a separate box, connected between the transceiver and the antenna, that solves this.',
        'It converts the RF output of the transceiver up or down to the other band. It also converts what arrives on that band back to a frequency your transceiver can hear. So it works in both directions.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You own a 10 meter transceiver and want to use it to talk and listen on the 2 meter band. What do you add?',
        options: [
          { id: 'amp', label: 'An RF power amplifier', why: 'A power amplifier makes your signal stronger on the same band. It cannot move the radio to another band.' },
          { id: 'tv', label: 'A transverter', right: true, why: 'Yes. A transverter converts the RF input and output of a transceiver to another band.' },
          { id: 'vfo', label: 'A second VFO', why: 'A VFO only tunes within the bands the radio already covers. It cannot add a band.' },
        ],
      },
      remember: 'A transverter converts the RF input and output of a transceiver to another band.',
    },
    {
      type: 'card',
      id: 'amplifier',
      idea: 'The RF power amplifier and its mode switch',
      covers: ['T7A09', 'T7A10'],
      picture: { art: 'rf-power-amplifier' },
      heading: 'An RF power amplifier adds power',
      text: [
        'An amplifier makes a signal stronger. An RF power amplifier is added to the output of a transceiver to increase the transmitted output power. It is the last block before the antenna.',
        'Some VHF power amplifiers have a switch marked SSB and CW-FM. Those are modes: ways of putting information on a signal. The switch does not pick your mode, your transceiver does that. It sets the amplifier up to work properly with the mode you are using.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your transceiver is sending SSB. You move the amplifier switch from CW-FM to SSB. What did that do?',
        options: [
          { id: 'mode', label: 'It changed the mode of your signal', why: 'The mode is chosen on the transceiver. The amplifier only makes that signal stronger.' },
          { id: 'set', label: 'It set the amplifier to work properly with SSB', right: true, why: 'Yes. The switch sets the amplifier for proper operation in the selected mode.' },
          { id: 'band', label: 'It moved the amplifier to another part of the band', why: 'The switch does not change frequency. It sets how the amplifier treats the signal it is given.' },
        ],
      },
      remember: 'An RF power amplifier increases the transmitted output power. Its SSB or CW-FM switch sets the amplifier for proper operation in the selected mode.',
    },
    {
      type: 'card',
      id: 'receiver',
      idea: 'Sensitivity and selectivity',
      covers: ['T7A01', 'T7A04'],
      picture: { draw: TwoQualities },
      heading: 'A good receiver is sensitive and selective',
      text: [
        'Now the other direction. Two words describe how well a receiver does its job. Sensitivity is its ability to detect that a signal is there at all, even a very weak one.',
        'Selectivity is its ability to discriminate between several signals, so you hear the one you tuned to and not its neighbors. Filters inside the receiver provide it.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which quality is each of these? Tap one, then tap the quality.',
        slots: [
          { id: 'sens', label: 'Sensitivity', sub: 'detecting a signal', rule: 'Sensitivity is about detecting a signal, however weak.' },
          { id: 'sel', label: 'Selectivity', sub: 'telling signals apart', rule: 'Selectivity is about telling one signal from the others near it.' },
        ],
        items: [
          { id: 'a', label: 'Hearing a faint, distant station', slot: 'sens', why: 'Detecting a faint signal is sensitivity.' },
          { id: 'b', label: 'Separating two stations close together', slot: 'sel', why: 'Telling two signals apart is selectivity.' },
          { id: 'c', label: 'Noticing a very weak signal is there', slot: 'sens', why: 'Detecting the presence of a signal is sensitivity.' },
          { id: 'd', label: 'Ignoring a strong signal next door', slot: 'sel', why: 'Rejecting the neighbor and keeping the wanted signal is selectivity.' },
        ],
      },
      remember: 'Sensitivity is the ability of a receiver to detect the presence of a signal. Selectivity is its ability to discriminate between multiple signals.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T7A01', 'T7A04', 'T7A06', 'T7A07', 'T7A10', 'T7A11'],
      questions: [
        {
          q: 'You turn the main tuning knob on your transceiver. Which circuit are you adjusting?',
          review: 'vfo',
          covers: ['T7A11'],
          choices: [
            { label: 'The VFO', right: true, why: 'The variable frequency oscillator sets the receive and transmit frequency, and the tuning knob turns it.' },
            { label: 'The RF power amplifier', why: 'The power amplifier changes how strong the signal is, not what frequency it is on.' },
            { label: 'The PTT input', why: 'PTT switches between receive and transmit. It does not tune the radio.' },
          ],
        },
        {
          q: 'You hold down the PTT button on a handheld radio. What changes?',
          review: 'ptt',
          covers: ['T7A07'],
          choices: [
            { label: 'The radio moves to another band', why: 'Moving to another band is tuning, or the job of a transverter. PTT does not change frequency.' },
            { label: 'The radio switches from receive to transmit', right: true, why: 'PTT means push to talk. It switches the transceiver from receive to transmit.' },
            { label: 'The receiver becomes more sensitive', why: 'While PTT is held the radio is transmitting, not receiving.' },
          ],
        },
        {
          q: 'Two stations are close together on the dial and you hear both at once. Which receiver quality is lacking?',
          review: 'receiver',
          covers: ['T7A01', 'T7A04'],
          choices: [
            { label: 'Sensitivity', why: 'Sensitivity is about detecting a signal. The receiver is detecting both, it just cannot tell them apart.' },
            { label: 'Selectivity', right: true, why: 'Selectivity is the ability to discriminate between signals. More of it would let you hear only one.' },
            { label: 'Output power', why: 'Output power belongs to the transmitter. It has no effect on what you hear.' },
          ],
        },
        {
          q: 'Your signal is on the right band but too weak to reach a distant station. Which box, added after the transceiver, gives it more power?',
          review: 'amplifier',
          covers: ['T7A06', 'T7A10'],
          choices: [
            { label: 'A transverter', why: 'A transverter moves the signal to another band. It is not there to add power.' },
            { label: 'A mixer', why: 'A mixer changes the frequency of a signal. It does not make it stronger.' },
            { label: 'An RF power amplifier', right: true, why: 'An RF power amplifier on the output of a transceiver increases the transmitted output power.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T7A01', 'T7A02', 'T7A03', 'T7A04', 'T7A05', 'T7A06', 'T7A07', 'T7A08', 'T7A09', 'T7A10', 'T7A11'],
      facts: [
        { icon: IconBox, text: 'A transceiver combines a receiver and a transmitter. Grounding its PTT input switches it from receive to transmit.', covers: ['T7A02', 'T7A07'] },
        { icon: IconOsc, text: 'An oscillator generates a signal at a specific frequency. The VFO sets the receive and transmit frequency.', covers: ['T7A05', 'T7A11'] },
        { icon: IconMod, text: 'Modulation is combining speech with an RF carrier signal.', covers: ['T7A08'] },
        { icon: IconMix, text: 'A mixer converts a signal from one frequency to another. A transverter converts the RF input and output of a transceiver to another band.', covers: ['T7A03', 'T7A06'] },
        { icon: IconAmp, text: 'An RF power amplifier increases transmitted output power. Its SSB or CW-FM switch sets it for proper operation in the selected mode.', covers: ['T7A09', 'T7A10'] },
        { icon: IconRx, text: 'Sensitivity: detecting the presence of a signal. Selectivity: discriminating between multiple signals.', covers: ['T7A01', 'T7A04'] },
      ],
    },
  ],
};
export default LESSON;
