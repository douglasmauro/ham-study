import { Arrow, Art, Mini, T, wave } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 1: Wavelength and frequency (question group T3B, all 12 questions).
 * Every fact below comes from a T3B question and its keyed answer; the ids are in each
 * step's `covers`. Band examples (28.4 MHz on 10 meters, 52 MHz on 6 meters, 146 MHz on
 * 2 meters, 440 MHz on 70 centimeters) agree with the T1B band questions.
 */

/* ---------- pictures ---------- */

/** Head-on view of a wave: the two fields as crossed arrows. Either arrow can be tapped. T3B01, T3B02 */
function CrossedFields({ picked, solved, onPick }: PicProps) {
  const tone = (id: string, base: string) => (picked !== id ? base : id === 'e' && solved ? 'ga-good' : id === 'e' ? base : 'ga-bad');
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  return (
    <Art label="A radio wave seen head-on. The electric field is an arrow pointing up and down. The magnetic field is an arrow pointing side to side, at right angles to it.">
      <path class="ga-w ga-thin" d="M84 70V58H96" />
      <Arrow x1={84} y1={122} x2={84} y2={18} c={`${tone('e', 'ga-k')} ga-thick`} both h={8} />
      <Arrow x1={22} y1={70} x2={146} y2={70} c={`${tone('m', 'ga-w')} ga-thick`} both h={8} />
      <T x={98} y={28} c="ga-tk ga-tb">electric field</T>
      <T x={98} y={44} c="ga-tk">up and down</T>
      <T x={150} y={92} c="ga-tb">magnetic field</T>
      <T x={150} y={108}>side to side</T>
      <T x={22} y={134} c="ga-tm">wave coming straight at you</T>
      {onPick && <rect x="60" y="10" width="48" height="50" style={hit} onClick={() => onPick('e')} />}
      {onPick && <rect x="60" y="80" width="48" height="44" style={hit} onClick={() => onPick('e')} />}
      {onPick && <rect x="14" y="52" width="46" height="36" style={hit} onClick={() => onPick('m')} />}
      {onPick && <rect x="108" y="52" width="130" height="62" style={hit} onClick={() => onPick('m')} />}
    </Art>
  );
}

/** Two waves of very different frequency racing to the same antenna. T3B12 */
function Race({ solved }: PicProps) {
  const end = solved ? 196 : 92;
  return (
    <Art label={solved
      ? 'A long 7 megahertz wave and a short 440 megahertz wave reach the far antenna at the same moment.'
      : 'A long 7 megahertz wave and a short 440 megahertz wave leave an antenna together, heading for a far antenna.'}>
      <path class="ga-w ga-thick" d="M20 112V30" />
      <path class="ga-w" d="M12 112H28" />
      <path class={`${solved ? 'ga-good' : 'ga-k'} ga-dash`} d="M206 30V112" />
      <path class="ga-s" d={wave(26, end, 52, 66, 11)} />
      <Arrow x1={end} y1={52} x2={end + 8} y2={52} />
      <path class="ga-s" d={wave(26, end, 92, 11, 11)} />
      <Arrow x1={end} y1={92} x2={end + 8} y2={92} />
      <T x={30} y={30} c="ga-ts ga-tb">7 MHz</T>
      <T x={30} y={120} c="ga-ts ga-tb">440 MHz</T>
      <T x={206} y={22} a="middle" c="ga-tm">other station</T>
      {solved && <T x={124} y={134} a="middle" c="ga-tk ga-tb">same speed: they arrive together</T>}
    </Art>
  );
}

const PX_PER_M = 200 / 6; // the ruler is to scale: 6 meters across

/** A wave above a ruler in meters. `value` is the frequency in MHz. T3B05, T3B06 */
function WaveOnRuler({ value = 50, solved }: PicProps) {
  const len = (300 / value) * PX_PER_M;
  let d = '';
  for (let x = 20; x <= 220; x += 1) d += `${x === 20 ? 'M' : 'L'}${x} ${(52 - 20 * Math.sin(((x - 20) / len) * 2 * Math.PI)).toFixed(1)}`;
  const meters = 300 / value;
  return (
    <Art label={`A ${value} megahertz wave above a ruler marked in meters. One wave is ${meters.toFixed(2)} meters long.`}>
      <path class="ga-s" d={d} />
      <path class={`${solved ? 'ga-good' : 'ga-k'}`} d={`M20 84V94M20 89H${(20 + len).toFixed(1)}M${(20 + len).toFixed(1)} 84V94`} />
      <T x={Math.max(20 + len / 2, 52)} y={106} a="middle" c="ga-tk ga-tb">{`one wave: ${meters.toFixed(2)} m`}</T>
      <path class="ga-w ga-thin" d={`M20 116H220${[0, 1, 2, 3, 4, 5, 6].map((m) => `M${(20 + m * PX_PER_M).toFixed(1)} 112V120`).join('')}`} />
      {[0, 1, 2, 3, 4, 5, 6].map((m) => <T x={20 + m * PX_PER_M} y={134} a="middle" c="ga-tm">{m}</T>)}
      <T x={232} y={120} a="end" c="ga-tm">m</T>
    </Art>
  );
}

/** Two bands, each a wave with its length marked: the band name is the length. T3B07 */
function BandNames() {
  const s = 18; // px per meter
  return (
    <Art label="Two waves drawn to the same scale. At 28.4 megahertz one wave is about 10 meters long: the 10 meter band. At 146 megahertz one wave is about 2 meters long: the 2 meter band.">
      <T x={20} y={16} c="ga-ts ga-tb">28.4 MHz</T>
      <path class="ga-s" d={wave(20, 20 + 10.56 * s, 36, 10.56 * s, 11)} />
      <path class="ga-k" d={`M20 54V62M20 58H${20 + 10.56 * s}M${20 + 10.56 * s} 54V62`} />
      <T x={115} y={74} a="middle" c="ga-tk ga-tb">about 10 m: the 10 meter band</T>
      <T x={20} y={92} c="ga-ts ga-tb">146 MHz</T>
      <path class="ga-s" d={wave(20, 20 + 10.56 * s, 108, 2.05 * s, 9)} />
      <path class="ga-k" d={`M20 122V130M20 126H${n1(20 + 2.05 * s)}M${n1(20 + 2.05 * s)} 122V130`} />
      <T x={66} y={131} c="ga-tk ga-tb">about 2 m: the 2 meter band</T>
    </Art>
  );
}
const n1 = (v: number) => v.toFixed(1);

/** HF, VHF and UHF side by side with their edges in MHz. T3B08, T3B09, T3B10 */
function ThreeRanges() {
  const seg = [['HF', 22, 44], ['VHF', 88, 22], ['UHF', 154, 8.25]] as const;
  return (
    <Art label="A frequency scale split into three ranges. HF runs from 3 to 30 megahertz, VHF from 30 to 300 megahertz and UHF from 300 to 3000 megahertz. The waves get shorter as frequency rises.">
      {seg.map(([name, x, len]) => (
        <>
          <path class="ga-s ga-thin" d={wave(x, x + 66, 28, len, 11)} />
          <rect class="ga-fk ga-soft" x={x} y="52" width="66" height="30" />
          <rect class="ga-k" x={x} y="52" width="66" height="30" />
          <text x={x + 33} y={72} class="ga-t ga-tk ga-tl" text-anchor="middle">{name}</text>
        </>
      ))}
      <T x={22} y={102} a="middle" c="ga-tb">3</T>
      <T x={88} y={102} a="middle" c="ga-tb">30</T>
      <T x={154} y={102} a="middle" c="ga-tb">300</T>
      <T x={216} y={102} a="middle" c="ga-tb">3000</T>
      <T x={120} y={126} a="middle" c="ga-tm">megahertz (MHz): ten times more each step</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconFields = () => <Mini><path class="ls-mk" d="M24 6V42" /><path class="ls-mw" d="M6 24H42" /><path class="ls-mw ls-mthin" d="M24 17H31V24" /></Mini>;
const IconPolar = () => <Mini><path class="ls-mw" d="M12 42V10" /><path class="ls-mk" d="M30 40V8M24 14L30 8L36 14M24 34L30 40L36 34" /></Mini>;
const IconSpeed = () => <Mini><path class="ls-ms" d="M6 16H38M32 10L38 16L32 22M6 32H38M32 26L38 32L32 38" /><path class="ls-mk ls-mthin" d="M43 6V42" /></Mini>;
const IconShorter = () => <Mini><path class="ls-ms" d="M4 24C7 10 11 10 14 24S21 38 23 24S28 12 30 24S34 34 35.500 24S39 16 40 24S42.500 30 44 24" /></Mini>;
const IconFormula = () => (
  <Mini>
    <text class="ls-mt" x="24" y="19" text-anchor="middle">300</text>
    <path class="ls-mk" d="M8 25H40" />
    <text class="ls-mt" x="24" y="41" text-anchor="middle">MHz</text>
  </Mini>
);
const IconRanges = () => <Mini><rect class="ls-mk" x="4" y="16" width="12" height="16" rx="2" /><rect class="ls-mk" x="18" y="16" width="12" height="16" rx="2" /><rect class="ls-mk" x="32" y="16" width="12" height="16" rx="2" /><path class="ls-mw ls-mthin" d="M4 40H44" /></Mini>;

/* ---------- the lesson ---------- */

const m = (mhz: number) => (300 / mhz).toFixed(2);

export const T3B_WAVELENGTH_FREQUENCY: Lesson = {
  id: 't3b-wavelength-frequency',
  title: 'Wavelength and frequency',
  blurb: 'What a radio wave is, how fast it travels, and how its frequency sets its length.',
  sub: 'T3',
  groups: ['T3B'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'wavelength',
      intro: 'Start with a one-minute clip. After it you will try each idea yourself.',
      covers: ['T3B04', 'T3B05', 'T3B06', 'T3B07', 'T3B11', 'T3B12'],
    },
    {
      type: 'card',
      id: 'fields',
      idea: 'The two fields of a radio wave',
      covers: ['T3B01', 'T3B03'],
      picture: { art: 'electromagnetic-wave' },
      heading: 'A radio wave is two fields travelling together',
      text: [
        'An antenna does not push air the way a speaker does. It sends energy out as two invisible fields: an electric field and a magnetic field.',
        'The two always travel together, and they sit at right angles to each other, like the two strokes of a plus sign.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'In the picture the electric field swings up and down. How does the magnetic field sit?',
        options: [
          { id: 'par', label: 'Parallel to it, swinging the same way', why: 'The two fields are never parallel. One is always turned 90 degrees from the other.' },
          { id: 'perp', label: 'At right angles to it', right: true, why: 'Yes. The electric field and the magnetic field are at right angles to each other.' },
        ],
      },
      remember: 'The two parts of a radio wave are an electric field and a magnetic field. They are at right angles to each other.',
    },
    {
      type: 'card',
      id: 'polarization',
      idea: 'Polarization follows the electric field',
      covers: ['T3B02'],
      picture: { draw: CrossedFields },
      heading: 'Polarization is the direction of the electric field',
      text: [
        'Every radio wave has a polarization. It is named after the way the electric field points: up and down is vertical, side to side is horizontal.',
        'Why it matters: two stations hear each other best when their antennas are turned the same way.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which field tells you the polarization of this wave? Tap it in the picture, or tap an answer.',
        options: [
          { id: 'm', label: 'The magnetic field', why: 'The magnetic field sits at right angles to the electric field. It is not the one that names the polarization.' },
          { id: 'e', label: 'The electric field', right: true, why: 'Yes. This electric field points up and down, so the wave is vertically polarized.' },
        ],
      },
      remember: 'Polarization is the orientation of the electric field.',
    },
    {
      type: 'card',
      id: 'speed',
      idea: 'All radio waves travel at the speed of light',
      covers: ['T3B04', 'T3B11', 'T3B12'],
      picture: { draw: Race },
      heading: 'Every radio wave travels at the speed of light',
      text: [
        'Radio waves and light are the same kind of wave. In free space, which just means open space with nothing in the way, they all travel at one speed: the speed of light.',
        'That speed is about 300,000,000 meters per second. It is the same for every radio wave.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A 7 MHz wave and a 440 MHz wave leave the antenna at the same instant. Which reaches the other station first?',
        options: [
          { id: 'lo', label: 'The 7 MHz wave', why: 'A longer wave is not a faster wave. Frequency changes the length of a wave, not its speed.' },
          { id: 'hi', label: 'The 440 MHz wave', why: 'A higher frequency does not make a wave faster. It only makes the wave shorter.' },
          { id: 'same', label: 'They arrive together', right: true, why: 'Right. All radio frequencies travel at the same speed in free space: the speed of light.' },
        ],
      },
      remember: 'A radio wave in free space travels at the speed of light: about 300,000,000 meters per second, whatever its frequency.',
    },
    {
      type: 'card',
      id: 'shorter',
      idea: 'Higher frequency, shorter wavelength',
      covers: ['T3B05'],
      picture: { draw: WaveOnRuler },
      heading: 'Higher frequency, shorter wave',
      text: [
        'Frequency is how many cycles the wave makes each second. It is measured in hertz, and one megahertz (MHz) is a million hertz. Wavelength is the length of one cycle.',
        'Shake a rope slowly and you get long ripples. Shake it faster and the ripples bunch up. The speed is fixed, so more cycles each second leaves less room for each one.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Raise the frequency until one wave is exactly 2 meters long.',
        label: 'Frequency',
        min: 50,
        max: 300,
        step: 10,
        start: 50,
        readouts: (v) => [{ label: 'Frequency', value: `${v} MHz` }, { label: 'One wave', value: `${m(v)} m` }],
        goal: (v) => v === 150,
        hint: (v) => (v < 150 ? `${m(v)} meters is too long. Raise the frequency to shorten the wave.` : `${m(v)} meters is too short. Lower the frequency to stretch the wave.`),
        done: 'There: 150 MHz makes a 2 meter wave. You started at 50 MHz with a 6 meter wave. Three times the frequency, one third the length.',
      },
      remember: 'Wavelength gets shorter as frequency increases.',
    },
    {
      type: 'card',
      id: 'formula',
      idea: '300 divided by megahertz gives meters',
      covers: ['T3B06'],
      heading: 'The shortcut: 300 divided by megahertz',
      text: [
        'You do not need a ruler. Wavelength in meters equals 300 divided by the frequency in megahertz.',
        'The 300 comes from the speed of the wave: 300 million meters per second. Megahertz means millions of hertz, so the millions cancel.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'A repeater is on 146 MHz. About how many meters long is its wave? A whole number is fine.',
            left: 'meters',
            top: '300',
            bottom: '146 MHz',
            accept: [1.9, 2.2],
            traps: [
              { range: [0.4, 0.6], why: 'That is 146 divided by 300. Turn it over: 300 goes on top.' },
              { range: [43000, 44000], why: 'That is 300 times 146. Divide instead: 300 on top, megahertz below.' },
            ],
            hint: 'Not quite. Ask how many times 146 fits into 300.',
            answer: '2',
            working: ['300 ÷ 146 = 2.05', 'About 2 meters. That is why hams call this the 2 meter band.'],
          },
          {
            prompt: 'Now a lower frequency: 50 MHz. How many meters?',
            left: 'meters',
            top: '300',
            bottom: '50 MHz',
            accept: [5.9, 6.1],
            traps: [
              { range: [0.1, 0.2], why: 'That is 50 divided by 300. Turn it over: 300 goes on top.' },
              { range: [15000, 15000], why: 'That is 300 times 50. Divide instead: 300 on top, megahertz below.' },
            ],
            hint: 'Not quite. Ask how many 50s fit into 300.',
            answer: '6',
            working: ['300 ÷ 50 = 6', '6 meters: the 6 meter band. Lower frequency, longer wave.'],
          },
        ],
      },
      remember: 'Wavelength in meters = 300 divided by frequency in megahertz.',
    },
    {
      type: 'card',
      id: 'bands',
      idea: 'Bands are named by wavelength',
      covers: ['T3B07'],
      picture: { draw: BandNames },
      heading: 'Why bands have names like "2 meters"',
      text: [
        'A band is a stretch of frequencies that hams may use. A band is identified two ways: by its frequency, or by its approximate wavelength in meters.',
        'So a radio on 146 MHz is "on 2 meters". The names are rounded. Very short waves are named in centimeters: the band near 440 MHz is called 70 centimeters.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your radio shows 52 MHz. Which band are you on? Use 300 divided by megahertz.',
        options: [
          { id: '2', label: 'The 2 meter band', why: '300 ÷ 52 is not 2. The 2 meter band is up near 146 MHz.' },
          { id: '6', label: 'The 6 meter band', right: true, why: 'Yes. 300 ÷ 52 is about 5.8, and the band is named 6 meters.' },
          { id: '10', label: 'The 10 meter band', why: '300 ÷ 52 is not 10. The 10 meter band is down near 28 MHz.' },
        ],
      },
      remember: 'Besides frequency, amateur bands are identified by their approximate wavelength in meters.',
    },
    {
      type: 'card',
      id: 'ranges',
      idea: 'HF, VHF and UHF',
      covers: ['T3B08', 'T3B09', 'T3B10'],
      picture: { draw: ThreeRanges },
      heading: 'Three ranges to know: HF, VHF and UHF',
      text: [
        'The radio spectrum is cut into big ranges. HF means high frequency, VHF means very high frequency and UHF means ultra high frequency.',
        'The edges are easy to keep: 3, 30, 300 and 3000 MHz. Most handheld ham radios work on VHF and UHF.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Put each frequency in its range. Tap a frequency, then tap the range.',
        slots: [
          { id: 'hf', label: 'HF', sub: '3 to 30 MHz', rule: 'HF only covers 3 to 30 MHz.' },
          { id: 'vhf', label: 'VHF', sub: '30 to 300 MHz', rule: 'VHF only covers 30 to 300 MHz.' },
          { id: 'uhf', label: 'UHF', sub: '300 to 3000 MHz', rule: 'UHF only covers 300 to 3000 MHz.' },
        ],
        items: [
          { id: 'a', label: '146 MHz', slot: 'vhf', why: '146 is between 30 and 300, so it is VHF. This is the 2 meter band.' },
          { id: 'b', label: '28.4 MHz', slot: 'hf', why: '28.4 is between 3 and 30, so it is HF. This is the 10 meter band.' },
          { id: 'c', label: '440 MHz', slot: 'uhf', why: '440 is between 300 and 3000, so it is UHF. This is the 70 centimeter band.' },
          { id: 'd', label: '52 MHz', slot: 'vhf', why: '52 is between 30 and 300, so it is VHF. This is the 6 meter band.' },
        ],
      },
      remember: 'HF is 3 to 30 MHz. VHF is 30 to 300 MHz. UHF is 300 to 3000 MHz.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T3B01', 'T3B02', 'T3B04', 'T3B05', 'T3B06', 'T3B09', 'T3B12'],
      questions: [
        {
          q: 'A wave is vertically polarized. Which part of it points up and down?',
          review: 'polarization',
          covers: ['T3B01', 'T3B02'],
          choices: [
            { label: 'Its magnetic field', why: 'The magnetic field is at right angles to the electric field, and polarization is not named after it.' },
            { label: 'Its electric field', right: true, why: 'Polarization is the direction of the electric field, so a vertical wave has a vertical electric field.' },
            { label: 'The path it travels along', why: 'Polarization is not about where the wave is going. It is the direction of the electric field.' },
          ],
        },
        {
          q: 'Light from a lamp and a signal from your radio both cross open space. Which one is faster?',
          review: 'speed',
          covers: ['T3B04', 'T3B12'],
          choices: [
            { label: 'The light', why: 'Light is not faster. Radio waves travel at the speed of light too.' },
            { label: 'The radio signal', why: 'The radio signal is not faster. Both move at the speed of light.' },
            { label: 'Neither. They travel at the same speed', right: true, why: 'Radio waves travel at the speed of light, about 300,000,000 meters per second.' },
          ],
        },
        {
          q: 'You tune from 50 MHz, where one wave is 6 meters long, up to 150 MHz. How long is one wave now?',
          review: 'formula',
          covers: ['T3B05', 'T3B06'],
          choices: [
            { label: '18 meters', why: 'The wave does not grow when the frequency goes up. It shrinks.' },
            { label: 'Still 6 meters', why: 'Wavelength changes whenever frequency changes. Higher frequency means a shorter wave.' },
            { label: '2 meters', right: true, why: '300 ÷ 150 = 2. Higher frequency, shorter wave.' },
          ],
        },
        {
          q: 'A handheld radio is set to 446 MHz. Which range is it using?',
          review: 'ranges',
          covers: ['T3B09'],
          choices: [
            { label: 'HF', why: 'HF is 3 to 30 MHz. 446 MHz is far above that.' },
            { label: 'VHF', why: 'VHF stops at 300 MHz. 446 MHz is above it.' },
            { label: 'UHF', right: true, why: 'UHF is 300 to 3000 MHz, and 446 is inside it.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T3B01', 'T3B02', 'T3B03', 'T3B04', 'T3B05', 'T3B06', 'T3B07', 'T3B08', 'T3B09', 'T3B10', 'T3B11', 'T3B12'],
      facts: [
        { icon: IconFields, text: 'A radio wave is an electric field and a magnetic field, at right angles to each other.', covers: ['T3B01', 'T3B03'] },
        { icon: IconPolar, text: 'Polarization is the orientation of the electric field.', covers: ['T3B02'] },
        { icon: IconSpeed, text: 'Every radio wave travels at the speed of light, about 300,000,000 meters per second, whatever its frequency.', covers: ['T3B04', 'T3B11', 'T3B12'] },
        { icon: IconShorter, text: 'Wavelength gets shorter as frequency increases.', covers: ['T3B05'] },
        { icon: IconFormula, text: 'Wavelength in meters = 300 divided by frequency in MHz. Bands are named by that approximate wavelength.', covers: ['T3B06', 'T3B07'] },
        { icon: IconRanges, text: 'HF is 3 to 30 MHz. VHF is 30 to 300 MHz. UHF is 300 to 3000 MHz.', covers: ['T3B08', 'T3B09', 'T3B10'] },
      ],
    },
  ],
};
