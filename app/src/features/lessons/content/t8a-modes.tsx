import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Modes: FM, SSB and CW (question group T8A, all 12 questions).
 * Every exam fact below comes from a T8A question and its keyed answer; the ids are in each
 * step's `covers`. The only bandwidth figures used are the pool's own: CW 150 Hz, SSB voice
 * 3 kHz, FM voice on VHF repeaters 10 to 15 kHz, AM fast-scan TV about 6 MHz.
 */

/* ---------- pictures ---------- */

/** A jagged noise floor along the bottom of the picture. Fixed shape, so it does not flicker. */
const NOISE = (() => {
  let d = '';
  for (let x = 14; x <= 226; x += 2) {
    const y = 104 + 3.5 * Math.sin(x * 1.7) + 2.5 * Math.sin(x * 0.61 + 1) + 1.5 * Math.sin(x * 3.3 + 2);
    d += `${x === 14 ? 'M' : 'L'}${x} ${y.toFixed(1)}`;
  }
  return d;
})();

/**
 * The same transmitter power drawn as a block above the noise. `value` is the width of the
 * signal in kHz: as the block gets narrower it gets taller, because its area stays the same.
 * T8A03, T8A07
 */
function Squeeze({ value = 15, solved }: PicProps) {
  const w = value * 10;
  const h = (14 * 15) / value;
  const x = 120 - w / 2;
  const top = 112 - h;
  return (
    <Art label={`A signal ${value} kilohertz wide drawn as a block standing on a line of background noise. ${value <= 3 ? 'Squeezed into 3 kilohertz, the block stands far above the noise.' : value >= 15 ? 'Spread over 15 kilohertz, the block barely rises above the noise.' : 'As the block gets narrower it stands taller above the noise.'}`}>
      <T x={120} y={20} a="middle" c="ga-tm">the same power, in less room</T>
      <rect class="ga-fs ga-soft" x={x} y={top} width={w} height={h} />
      <path class={solved ? 'ga-good' : 'ga-s'} d={`M${x} 112V${top}H${x + w}V112`} />
      <path class="ga-w ga-thin" d={NOISE} />
      <path class="ga-w ga-thin" d="M14 112H226" />
      <T x={16} y={92} c="ga-tm">noise</T>
      <path class="ga-k ga-thin" d={`M${x} 117V125M${x + w} 117V125M${x} 121H${x + w}`} />
      <T x={120} y={137} a="middle" c="ga-tk ga-tb">{`${value} kHz wide`}</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconFm = () => <Mini><path class="ls-ms" d="M4 24C6 10 9 10 11 24S16 38 18 24S21.500 12 23 24S26 36 27.500 24S31 10 34 24S40 38 44 24" /></Mini>;
const IconSsb = () => <Mini><path class="ls-mw ls-mthin" d="M4 40H44M22 40V10" /><path class="ls-mw ls-mthin" d="M6 40L18 22V40" /><path class="ls-mk" d="M26 40V22L40 40Z" /></Mini>;
const IconWidths = () => <Mini><path class="ls-mw ls-mthin" d="M4 40H44" /><path class="ls-ms" d="M7 40V14" /><rect class="ls-ms" x="12" y="14" width="5" height="26" /><rect class="ls-ms" x="21" y="14" width="9" height="26" /><rect class="ls-ms" x="34" y="14" width="10" height="26" /></Mini>;
const IconWeak = () => <Mini><path class="ls-mw ls-mthin" d="M4 38L8 35L12 39L16 34L20 38L28 38L32 34L36 39L40 35L44 38" /><path class="ls-mk" d="M21 38V8H27V38" /></Mini>;
const IconCapture = () => <Mini><path class="ls-ms" d="M4 16C7 4 10 4 13 16S19 28 22 16S28 4 31 16S37 28 40 16" /><path class="ls-mw ls-mthin" d="M4 36C6 32 8 32 10 36S14 40 16 36S20 32 22 36" /><path class="ls-mk" d="M32 31L42 41M42 31L32 41" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't8a-modes',
  title: 'Modes: FM, SSB and CW',
  blurb: 'How a voice rides on a radio signal, which mode is used where, and how much room each one takes.',
  sub: 'T8',
  groups: ['T8A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t8a-modes',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T8A01', 'T8A04', 'T8A05', 'T8A07'],
    },
    {
      type: 'card',
      id: 'fm',
      idea: 'FM or PM for repeaters and VHF packet',
      covers: ['T8A02', 'T8A04'],
      picture: { art: 'fm' },
      heading: 'FM is the mode of repeaters and handhelds',
      text: [
        'Modulation is the way a voice or data is put onto a radio signal. Each way of doing it is called a mode. FM, frequency modulation, shifts the frequency of the signal up and down in step with your voice.',
        'PM, phase modulation, is a close cousin that is used the same way. Voice repeaters on VHF and UHF use FM or PM. So does VHF packet radio, which sends data in small bundles through an ordinary VHF radio.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A club sets up a VHF packet radio station using an ordinary 2 meter mobile radio. Which modulation does it send?',
        options: [
          { id: 'ssb', label: 'SSB', why: 'SSB is a narrow voice mode for weak signals. It is not what an ordinary VHF radio or VHF packet uses.' },
          { id: 'fm', label: 'FM or PM', right: true, why: 'Yes. VHF packet goes through an ordinary VHF radio, and those use FM or PM, the same as voice repeaters.' },
          { id: 'am', label: 'AM', why: 'AM changes the strength of a signal instead of its frequency. It is not the common mode for VHF packet.' },
        ],
      },
      remember: 'FM or PM is the modulation commonly used for VHF and UHF voice repeaters, and for VHF packet radio.',
    },
    {
      type: 'card',
      id: 'ssb',
      idea: 'SSB is a form of AM',
      covers: ['T8A01'],
      picture: { art: 'am' },
      heading: 'Single sideband is a slimmed-down AM signal',
      text: [
        'AM, amplitude modulation, carries a voice by changing the strength of the signal. A full AM signal has three parts: a steady carrier in the middle and a sideband on each side. Each sideband is a complete copy of the voice.',
        'One copy is enough. Single sideband, or SSB, sends just one sideband and leaves out the rest. So SSB is a form of amplitude modulation.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Look at the three parts at the bottom of the picture. Which of them does an SSB transmitter leave out?',
        options: [
          { id: 'both', label: 'Both sidebands', why: 'The sidebands carry the voice. Leave out both and there is nothing left to hear.' },
          { id: 'one', label: 'The carrier and one sideband', right: true, why: 'Yes. One sideband is sent on its own. It is still a piece of an AM signal, which is why SSB counts as a form of AM.' },
          { id: 'carrier', label: 'Only the carrier', why: 'That would still send two copies of the voice. Single sideband sends just one.' },
        ],
      },
      remember: 'Single sideband is a form of amplitude modulation.',
    },
    {
      type: 'card',
      id: 'sideband',
      idea: 'Upper sideband on 10 meters, VHF and UHF',
      covers: ['T8A06'],
      picture: { art: 'upper-sideband' },
      heading: 'Which sideband? Upper, on 10 meters and above',
      text: [
        'The sideband just above the carrier frequency is the upper sideband. The one just below is the lower sideband. Either can carry the voice, but both stations must pick the same one or the voice comes out garbled.',
        'So hams follow a custom. On the 10 meter band and on every VHF and UHF band, SSB normally uses the upper sideband. Lower sideband is the custom on the lower HF bands, such as 40 and 80 meters.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You try SSB for the first time on the 2 meter band, which is VHF. Which sideband do you select?',
        options: [
          { id: 'lower', label: 'Lower sideband', why: 'Lower sideband is the custom on the lower HF bands. On VHF the other station will be on the upper sideband and could not understand you.' },
          { id: 'upper', label: 'Upper sideband', right: true, why: 'Yes. Upper sideband is normal for SSB on 10 meters, VHF and UHF.' },
          { id: 'both', label: 'Both at once', why: 'Sending both sidebands is plain AM. Single sideband sends one, and on VHF it is the upper one.' },
        ],
      },
      remember: 'Upper sideband is normally used for SSB on 10 meters, VHF and UHF.',
    },
    {
      type: 'card',
      id: 'bandwidth',
      idea: 'Bandwidth of CW, SSB, FM and fast-scan TV',
      covers: ['T8A05', 'T8A08', 'T8A09', 'T8A10', 'T8A11'],
      picture: { art: 'bandwidth' },
      heading: 'Every mode takes up room: its bandwidth',
      text: [
        'Bandwidth is how much room a signal takes up on the band, measured in hertz (Hz). A kilohertz (kHz) is 1000 hertz. The more a signal has to carry each second, the more room it needs.',
        'CW is Morse code sent by switching the signal on and off, and it needs only about 150 Hz. An SSB voice takes about 3 kHz. An FM voice on a VHF repeater takes between 10 and 15 kHz. AM fast-scan TV sends moving pictures and takes about 6 MHz, which is 6000 kHz.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Give each signal its bandwidth. The widths run from narrowest to widest. Tap a signal, then tap its width.',
        slots: [
          { id: 'cw', label: '150 Hz', sub: 'the narrowest', rule: '150 Hz is only enough for a signal that is simply switched on and off.' },
          { id: 'ssb', label: '3 kHz', sub: 'one copy of a voice', rule: '3 kHz is the room that one sideband of a voice needs.' },
          { id: 'fm', label: '10 to 15 kHz', sub: 'several times wider', rule: '10 to 15 kHz is the room a voice takes on a VHF repeater.' },
          { id: 'tv', label: 'About 6 MHz', sub: 'the widest by far', rule: 'About 6 MHz is the room that moving pictures need.' },
        ],
        items: [
          { id: 'a', label: 'FM voice', slot: 'fm', why: 'An FM voice signal on a VHF repeater is between 10 and 15 kHz wide.' },
          { id: 'b', label: 'CW', slot: 'cw', why: 'CW needs about 150 Hz. It is the narrowest of these signals.' },
          { id: 'c', label: 'AM fast-scan TV', slot: 'tv', why: 'AM fast-scan TV is about 6 MHz wide. That is 6000 kHz.' },
          { id: 'd', label: 'SSB voice', slot: 'ssb', why: 'A typical SSB voice signal is about 3 kHz wide.' },
        ],
      },
      remember: 'CW: 150 Hz, the narrowest. SSB voice: 3 kHz. FM voice on VHF repeaters: 10 to 15 kHz. AM fast-scan TV: about 6 MHz.',
    },
    {
      type: 'card',
      id: 'weak',
      idea: 'SSB is narrower than FM, so it suits weak signals',
      covers: ['T8A03', 'T8A07'],
      picture: { draw: Squeeze },
      heading: 'Narrow gets through: SSB for weak signals',
      text: [
        'Compared with FM, an SSB signal has a narrower bandwidth: about 3 kHz instead of 10 to 15 kHz. A narrow signal packs its power into less room, so it stands taller above the background noise.',
        'Why it matters: when the other station is far away and faint, SSB can still be understood where FM is lost in the hiss. That is why SSB is the voice mode often used for long-distance, weak-signal contacts on VHF and UHF.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'This signal is as wide as an FM voice. Squeeze the same power down to the width of an SSB voice: 3 kHz.',
        label: 'Signal width',
        min: 3,
        max: 15,
        step: 3,
        start: 15,
        readouts: (v) => [{ label: 'Width', value: `${v} kHz` }, { label: 'Power in each kHz', value: `× ${+(15 / v).toFixed(2)}` }],
        goal: (v) => v === 3,
        hint: (v) => `${v} kHz is still wider than an SSB voice. Keep narrowing it.`,
        done: 'There. Squeezed into 3 kHz, each kHz holds 5 times the power it did at 15 kHz, and the signal stands clear of the noise. A faint SSB signal can still be heard.',
      },
      remember: 'SSB has a narrower bandwidth than FM. It is often used for long-distance (weak signal) contacts on VHF and UHF.',
    },
    {
      type: 'card',
      id: 'capture',
      idea: 'FM receives only one signal at a time',
      covers: ['T8A12'],
      picture: { art: 'capture-effect' },
      heading: 'The price of FM: one signal at a time',
      text: [
        'FM has a habit called the capture effect. When two stations transmit on the same channel, an FM receiver locks onto the stronger one and the weaker one vanishes.',
        'On SSB you would hear both voices at once, mixed together. So a disadvantage of FM compared with single sideband is that only one signal can be received at a time.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A strong station and a weak station transmit at the same moment on the same FM channel. What comes out of your speaker?',
        options: [
          { id: 'mix', label: 'Both voices, mixed together', why: 'That is what an SSB receiver would give you. An FM receiver locks onto one signal only.' },
          { id: 'strong', label: 'Only the strong station', right: true, why: 'Yes. The FM receiver captures the stronger signal and hides the weaker one, so only one signal is received at a time.' },
          { id: 'weak', label: 'Only the weak station', why: 'The receiver locks onto the stronger signal, not the weaker one.' },
        ],
      },
      remember: 'A disadvantage of FM compared with SSB: only one signal can be received at a time.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T8A01', 'T8A04', 'T8A05', 'T8A06', 'T8A08', 'T8A09', 'T8A10', 'T8A11', 'T8A12'],
      questions: [
        {
          q: 'Single sideband is what is left when you take the carrier and one sideband away from which kind of signal?',
          review: 'ssb',
          covers: ['T8A01'],
          choices: [
            { label: 'An FM signal', why: 'FM changes the frequency of the signal. SSB is not cut from an FM signal.' },
            { label: 'An AM signal', right: true, why: 'An AM signal is a carrier and two sidebands. Keep one sideband and you have SSB, a form of amplitude modulation.' },
            { label: 'A CW signal', why: 'CW is a signal switched on and off for Morse code. It has no voice sidebands to keep.' },
          ],
        },
        {
          q: 'You turn the mode switch of a 70 centimeter radio to SSB. Which sideband do other hams expect you to use?',
          review: 'sideband',
          covers: ['T8A06'],
          choices: [
            { label: 'The upper sideband', right: true, why: '70 centimeters is a UHF band, and SSB on 10 meters, VHF and UHF normally uses the upper sideband.' },
            { label: 'The lower sideband', why: 'Lower sideband is the custom on the lower HF bands, not on UHF.' },
            { label: 'Whichever is quieter', why: 'Both stations must use the same sideband, so hams follow the custom: upper sideband on UHF.' },
          ],
        },
        {
          q: 'Which list runs from the narrowest signal to the widest?',
          review: 'bandwidth',
          covers: ['T8A05', 'T8A08', 'T8A09', 'T8A10', 'T8A11'],
          choices: [
            { label: 'SSB voice, CW, FM voice, fast-scan TV', why: 'CW is narrower than SSB voice: about 150 Hz against about 3 kHz.' },
            { label: 'CW, FM voice, SSB voice, fast-scan TV', why: 'SSB voice is narrower than FM voice: about 3 kHz against 10 to 15 kHz.' },
            { label: 'CW, SSB voice, FM voice, fast-scan TV', right: true, why: 'About 150 Hz, then 3 kHz, then 10 to 15 kHz, then about 6 MHz.' },
          ],
        },
        {
          q: 'Two friends call you at the same moment on a repeater. You hear the nearer one clearly and nothing at all from the other. Why?',
          review: 'capture',
          covers: ['T8A04', 'T8A12'],
          choices: [
            { label: 'Repeaters use FM, and an FM receiver takes only the strongest signal', right: true, why: 'With FM only one signal can be received at a time. The stronger one wins.' },
            { label: 'Repeaters use SSB, which is too narrow for two voices', why: 'Voice repeaters use FM or PM, not SSB. And SSB would let you hear both voices mixed together.' },
            { label: 'The second friend must have been on the wrong sideband', why: 'Sidebands belong to SSB. A repeater uses FM, where the stronger signal simply hides the weaker one.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T8A01', 'T8A02', 'T8A03', 'T8A04', 'T8A05', 'T8A06', 'T8A07', 'T8A08', 'T8A09', 'T8A10', 'T8A11', 'T8A12'],
      facts: [
        { icon: IconFm, text: 'FM or PM is used for VHF and UHF voice repeaters, and for VHF packet radio.', covers: ['T8A02', 'T8A04'] },
        { icon: IconSsb, text: 'Single sideband is a form of amplitude modulation. On 10 meters, VHF and UHF it normally uses the upper sideband.', covers: ['T8A01', 'T8A06'] },
        { icon: IconWidths, text: 'Bandwidths: CW 150 Hz (the narrowest), SSB voice 3 kHz, FM voice 10 to 15 kHz, AM fast-scan TV about 6 MHz.', covers: ['T8A05', 'T8A08', 'T8A09', 'T8A10', 'T8A11'] },
        { icon: IconWeak, text: 'SSB is narrower than FM, so it is the voice mode often used for long-distance (weak signal) contacts on VHF and UHF.', covers: ['T8A03', 'T8A07'] },
        { icon: IconCapture, text: 'A disadvantage of FM compared with SSB: only one signal can be received at a time.', covers: ['T8A12'] },
      ],
    },
  ],
};
export default LESSON;
