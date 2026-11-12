import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 16: Antennas (question group T9A, all 11 questions).
 * Every exam fact below comes from a T9A question and its keyed answer; the ids are in each
 * step's `covers`. Lengths use only what the pool states (a half-wave dipole, a quarter-wave
 * vertical of 19 inches on 2 meters) and the shortcut from the wavelength lesson
 * (wavelength in meters = 300 divided by megahertz). All lengths are approximate.
 */

/* ---------- pictures ---------- */

const n1 = (v: number) => +v.toFixed(1);

/** Part of a circle around (cx, cy), from angle a0 to a1 in degrees (0 = right, 90 = down). */
function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number) => `${n1(cx + r * Math.cos((a * Math.PI) / 180))} ${n1(cy + r * Math.sin((a * Math.PI) / 180))}`;
  return `M${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}`;
}

/** Resonant frequency in MHz of a half-wave dipole `len` meters long: the wave is twice the wire. */
const dipoleMhz = (len: number) => Math.round(300 / (2 * len));

/** A dipole whose length follows the slider. `value` is the wire length in meters. T9A05 */
function DipoleLength({ value = 3, solved }: PicProps) {
  const half = value * 20; // 40 units per meter
  const l = 120 - half, r = 120 + half;
  return (
    <Art label={`A dipole about ${value} meters long, fed at its center. It is half of a ${value * 2} meter wave, so it is resonant near ${dipoleMhz(value)} megahertz.`}>
      <T x={120} y={18} a="middle" c="ga-tk ga-tb">{`about ${value} m of wire`}</T>
      <path class="ga-w ga-thin" d={`M${l} 24V34M${l} 29H${r}M${r} 24V34`} />
      <path class="ga-s ga-thin" d={`M${l} 72Q120 28 ${r} 72`} />
      <path class={`${solved ? 'ga-good' : 'ga-k'} ga-thick`} d={`M${l} 76H117M123 76H${r}`} />
      <path class="ga-w ga-thin" d="M117 76V114M123 76V114" />
      <T x={130} y={106} c="ga-tm">feed line</T>
      <T x={120} y={132} a="middle" c="ga-ts ga-tb">{`fits half of a ${value * 2} m wave`}</T>
    </Art>
  );
}

/** A handheld used inside a car. Once solved, an antenna on the roof sends the signal out freely. T9A07 */
function InTheCar({ solved }: PicProps) {
  return (
    <Art label={solved
      ? 'A car with an antenna mounted on its roof. Outside the metal body, the antenna sends a strong signal in all directions.'
      : 'A handheld radio being used inside a car. The metal body surrounds its antenna and blocks most of the signal, so only a weak signal gets out.'}>
      <path class="ga-w" d="M10 122H230" />
      <g transform="translate(-22 0)">
        <path class="ga-w" d="M58 112H40V96Q40 90 48 89L74 85L90 66Q92 63 97 63H140Q145 63 148 66L164 85L192 89Q200 90 200 96V112H184M82 112H160" />
        <circle class="ga-w" cx="70" cy="112" r="10" />
        <circle class="ga-w" cx="172" cy="112" r="10" />
        <path class="ga-w ga-thin" d="M96 68H117V85H82ZM123 68H141L155 85H123Z" />
        <rect class={solved ? 'ga-w' : 'ga-k'} x="98" y="76" width="8" height="14" rx="2" />
        <path class={solved ? 'ga-w' : 'ga-k'} d="M102 76V69" />
      </g>
      {solved ? (
        <>
          <path class="ga-good ga-thick" d="M108 63V34" />
          <path class="ga-w ga-thin" d="M84 84Q108 92 108 64" />
          <path class="ga-s" d={[10, 18, 26].map((r) => arc(108, 46, r, -35, 35) + arc(108, 46, r, 145, 215)).join('')} />
          <T x={120} y={16} a="middle" c="ga-tk ga-tb">antenna outside: strong signal</T>
        </>
      ) : (
        <>
          <path class="ga-s ga-thin" d={`${arc(80, 72, 7, -50, 30)}${arc(80, 72, 13, -45, 25)}`} />
          <path class="ga-s ga-thin ga-dash" d={`${arc(80, 72, 112, -20, 4)}${arc(80, 72, 124, -18, 2)}`} />
          <T x={120} y={16} a="middle" c="ga-tk ga-tb">metal body blocks the signal</T>
          <T x={206} y={104} a="middle" c="ga-ts">weak</T>
        </>
      )}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconShort = () => <Mini><path class="ls-mw" d="M4 14H21M27 14H44" /><path class="ls-mk" d="M12 34H21M27 34H36" /><path class="ls-ms ls-mthin" d="M12 30Q24 20 36 30" /></Mini>;
const IconCoil = () => <Mini><path class="ls-mk" d="M24 44V34C32 32 32 28 24 27C32 25 32 21 24 20C32 18 32 14 24 13V4" /><path class="ls-mw" d="M10 44H38" /></Mini>;
const IconCar = () => <Mini><path class="ls-mw" d="M4 36V28L14 26L19 18H31L36 26L44 28V36Z" /><path class="ls-mk" d="M25 18V5" /><path class="ls-ms ls-mthin" d="M31 6Q35 10 31 14M19 6Q15 10 19 14" /></Mini>;
const IconBroadside = () => <Mini><path class="ls-mw" d="M4 24H44" /><path class="ls-mk" d="M24 6V42M19 11L24 6L29 11M19 37L24 42L29 37" /></Mini>;
const IconBeam = () => <Mini><path class="ls-mk" d="M10 10V38M20 12V36M30 15V33" /><path class="ls-mw ls-mthin" d="M10 24H30" /><path class="ls-ms" d="M34 24H44M39 19L44 24L39 29" /></Mini>;
const IconTall = () => <Mini><path class="ls-mw" d="M4 42H44M14 42V28" /><path class="ls-mk" d="M30 42V6" /><path class="ls-ms ls-mthin" d="M35 38Q44 34 44 30" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't9a-antennas',
  title: 'Antennas',
  blurb: 'How long an antenna should be, where it sends your signal, and what gain really means.',
  sub: 'T9',
  groups: ['T9A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t9a-antennas',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T9A01', 'T9A05', 'T9A06', 'T9A08', 'T9A10', 'T9A11'],
    },
    {
      type: 'card',
      id: 'resonance',
      idea: 'Shorter antenna, higher resonant frequency',
      covers: ['T9A05'],
      picture: { draw: DipoleLength },
      heading: 'An antenna is cut to fit its wave',
      text: [
        'An antenna works best when its length fits the wave it carries. The frequency where it fits is called its resonant frequency. The simplest antenna is the dipole: a wire about half a wavelength long, fed at its center.',
        'Think of a guitar string: a shorter string gives a higher note. A shorter dipole fits a shorter wave, and a shorter wave means a higher frequency.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Shorten the dipole until it is resonant near 150 MHz.',
        label: 'Dipole length',
        min: 0.5,
        max: 5,
        step: 0.5,
        start: 3,
        readouts: (v) => [{ label: 'Dipole length', value: `${v} m` }, { label: 'Resonant near', value: `${dipoleMhz(v)} MHz` }],
        goal: (v) => v === 1,
        hint: (v) => (v > 1
          ? `${dipoleMhz(v)} MHz is too low. Shorten the wire to raise the resonant frequency.`
          : `${dipoleMhz(v)} MHz is too high. Lengthen the wire to bring the resonant frequency down.`),
        done: 'There: about 1 meter of wire is half of a 2 meter wave, and 300 ÷ 2 = 150 MHz. You shortened the dipole and its resonant frequency went up.',
      },
      remember: 'Shortening a dipole increases its resonant frequency. Lengthening it lowers it.',
    },
    {
      type: 'card',
      id: 'quarter',
      idea: 'A 19 inch vertical is a quarter-wave on 2 meters',
      covers: ['T9A08'],
      picture: { art: 'quarter-wave-antenna' },
      heading: 'Why a 2 meter vertical is 19 inches long',
      text: [
        'A vertical antenna has a single upright element. The most common kind is the quarter-wave: its element is about a quarter of a wavelength long.',
        'On the 2 meter band a quarter of the wave is half a meter. That is a little under 20 inches, and a practical antenna is trimmed slightly shorter. So the 19 inch vertical you see on 2 meters is a resonant quarter-wave.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'Waves on the 2 meter band are about 2 meters long. How many meters is a quarter of one?',
            left: 'meters',
            top: '2 m',
            bottom: '4',
            accept: [0.5, 0.5],
            traps: [
              { range: [8, 8], why: 'That is 2 times 4. A quarter means divide by 4.' },
              { range: [2, 2], why: 'That is 4 divided by 2. The wavelength goes on top: 2 divided by 4.' },
            ],
            hint: 'Not quite. Cut 2 meters into 4 equal parts. How long is one part?',
            answer: '0.5',
            working: ['2 ÷ 4 = 0.5', 'Half a meter. Trimmed slightly, that is the 19 inch vertical.'],
          },
          {
            prompt: 'Now the 6 meter band. How many meters long is a quarter-wave vertical there?',
            left: 'meters',
            top: '6 m',
            bottom: '4',
            accept: [1.5, 1.5],
            traps: [
              { range: [24, 24], why: 'That is 6 times 4. A quarter means divide by 4.' },
              { range: [0.6, 0.7], why: 'That is 4 divided by 6. The wavelength goes on top: 6 divided by 4.' },
            ],
            hint: 'Not quite. Cut 6 meters into 4 equal parts. How long is one part?',
            answer: '1.5',
            working: ['6 ÷ 4 = 1.5', 'About one and a half meters. A longer wave needs a longer antenna.'],
          },
        ],
      },
      remember: 'A 19 inch vertical is often used on 2 meters because it is a resonant quarter-wave.',
    },
    {
      type: 'card',
      id: 'loading',
      idea: 'Loading and the short handheld antenna',
      covers: ['T9A02', 'T9A04'],
      picture: { art: 'antenna-loading' },
      heading: 'A coil makes a short antenna act longer',
      text: [
        'A full-sized antenna can be too long to carry. The fix is called loading: an inductor, which is a coil of wire, is inserted in the radiating element, the rod that sends out the wave. The coil makes a short antenna electrically longer.',
        'The short flexible antenna on a handheld radio is shortened this way. It is handy, but compared with a full-sized quarter-wave antenna it has low efficiency: less of your power leaves as radio waves.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A whip is too short to be resonant on your band. What can be inserted in it to make it electrically longer?',
        options: [
          { id: 'r', label: 'A resistor', why: 'A resistor does not make an antenna resonant. It only turns your power into heat.' },
          { id: 'l', label: 'An inductor (a coil)', right: true, why: 'Yes. Inserting inductors in the radiating element electrically lengthens it. That is loading.' },
          { id: 's', label: 'A spring at the base', why: 'A spring only lets the whip bend. It changes nothing electrically.' },
        ],
      },
      remember: 'Loading: inserting inductors in the radiating elements makes an antenna electrically longer. A handheld\'s short flexible antenna has low efficiency.',
    },
    {
      type: 'card',
      id: 'vehicle',
      idea: 'A vehicle shields a handheld inside it',
      covers: ['T9A07'],
      picture: { draw: InTheCar },
      heading: 'Inside a car, the metal body blocks your signal',
      text: [
        'Radio waves do not pass well through metal. Use a handheld inside a vehicle and the metal body acts as a shield around its antenna. Your signal strength is reduced, and the stations you hear are weaker too.',
        'The cure is an antenna mounted on the outside of the vehicle and connected to the radio by a cable.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You call a repeater from the passenger seat with your handheld. They say you are very weak. What helps most?',
        options: [
          { id: 'low', label: 'Holding the radio lower, below the windows', why: 'That puts even more metal around the antenna, so the shielding gets worse.' },
          { id: 'loud', label: 'Speaking louder', why: 'A louder voice does not change how much signal gets out of the car.' },
          { id: 'out', label: 'Connecting an antenna mounted outside the car', right: true, why: 'Yes. Outside, the metal body no longer shields the antenna.' },
        ],
      },
      remember: 'A handheld used inside a vehicle without an external antenna has reduced signal strength, because of the shielding effect of the vehicle.',
    },
    {
      type: 'card',
      id: 'polarization',
      idea: 'Antenna polarization is the electric field\'s orientation',
      covers: ['T9A03'],
      picture: { art: 'vertical-polarization' },
      heading: 'Polarization: which way the electric field points',
      text: [
        'You met polarization in the wavelength lesson: it is the orientation of a wave\'s electric field. The polarization of an antenna is described the same way.',
        'The electric field lines up with the antenna\'s element. An upright element gives vertical polarization. An element that lies level with the ground gives horizontal polarization.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A dipole is hung level between two trees, so its electric field lies level with the ground. What is its polarization?',
        options: [
          { id: 'v', label: 'Vertical', why: 'Vertical means the electric field points up and down. This wire, and its electric field, lie level.' },
          { id: 'h', label: 'Horizontal', right: true, why: 'Yes. The electric field is level with the ground, so the antenna is horizontally polarized.' },
          { id: 'd', label: 'It depends which way the signal travels', why: 'Polarization is not the direction of travel. It is the orientation of the electric field.' },
        ],
      },
      remember: 'The polarization of an antenna is described by the orientation of the electric field.',
    },
    {
      type: 'card',
      id: 'pattern',
      idea: 'A dipole is strongest broadside',
      covers: ['T9A10'],
      picture: { art: 'broadside' },
      heading: 'A dipole is strongest broadside to its wire',
      text: [
        'No real antenna sends its signal equally in every direction. A half-wave dipole radiates its strongest signal broadside to the antenna, which means at right angles to the wire.',
        'Off the ends of the wire it radiates least. So the way you hang a dipole decides who hears you best.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your dipole wire runs north to south. In which directions is your signal strongest?',
        options: [
          { id: 'ns', label: 'North and south', why: 'Those are the ends of the wire, where a dipole radiates least.' },
          { id: 'ew', label: 'East and west', right: true, why: 'Yes. East and west are broadside to a north to south wire, where a dipole is strongest.' },
          { id: 'all', label: 'The same in every direction', why: 'A dipole is not equal all around. It is weak off the ends of the wire.' },
        ],
      },
      remember: 'A half-wave dipole radiates its strongest signal broadside to the antenna.',
    },
    {
      type: 'card',
      id: 'gain',
      idea: 'Gain, beams and the Yagi',
      covers: ['T9A01', 'T9A06', 'T9A11'],
      picture: { art: 'antenna-gain' },
      heading: 'Gain: more signal one way, less another',
      text: [
        'An antenna cannot add power. It can only aim it, as the reflector in a flashlight aims the light of its bulb. Antenna gain is the increase in signal strength in a specified direction compared to a reference antenna.',
        'A beam antenna concentrates signals in one direction. The best known beam is the Yagi. Antennas that radiate all around, such as a J pole or a 5/8 wave vertical, have less gain. An isotropic antenna, an imaginary reference that radiates equally in every direction, has none.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You swap a vertical for a Yagi and aim it at a friend. Your radio still puts out 5 watts. Why does your friend now hear you better?',
        options: [
          { id: 'add', label: 'The Yagi adds power to your 5 watts', why: 'No antenna adds power. The radio still puts out 5 watts.' },
          { id: 'aim', label: 'The Yagi concentrates your signal toward your friend', right: true, why: 'Yes. A beam sends more of the same power one way and less the other ways. That increase is gain.' },
          { id: 'fast', label: 'The Yagi makes the wave travel faster', why: 'Every radio wave travels at the speed of light. An antenna cannot change that.' },
        ],
      },
      remember: 'Gain is the increase in signal strength in a specified direction compared to a reference antenna. A beam concentrates signals in one direction. A Yagi is a beam, with more gain than a J pole, a 5/8 wave vertical or an isotropic antenna.',
    },
    {
      type: 'card',
      id: 'five-eighths',
      idea: 'A 5/8-wave whip has more gain than a 1/4-wave',
      covers: ['T9A09'],
      picture: { art: '5-8-wave-antenna' },
      heading: 'A 5/8-wave whip: more gain for a mobile',
      text: [
        'A whip is a thin flexible rod antenna, the kind you see on vehicles. The basic one is a quarter-wave. A whip that is 5/8 of a wavelength long is taller, and it has more gain than the quarter-wave.',
        'It still radiates all around, which suits a car that keeps turning. Its gain comes from sending more of the signal out low toward the horizon, where the other stations are, and less of it up at the sky.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'On your car you replace a 1/4-wave whip with a 5/8-wave whip for the same band. What do you get?',
        options: [
          { id: 'short', label: 'A shorter antenna with more gain', why: 'Five eighths is more than a quarter, so the 5/8-wave whip is the taller one.' },
          { id: 'tall', label: 'A taller antenna with more gain', right: true, why: 'Yes. The 5/8-wave whip is taller and has more gain than a 1/4-wave antenna.' },
          { id: 'sky', label: 'A taller antenna that aims your signal up at the sky', why: 'It does the opposite: more of the signal goes out low toward the horizon.' },
        ],
      },
      remember: 'For VHF or UHF mobile service, a 5/8-wavelength whip has more gain than a 1/4-wave antenna.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T9A01', 'T9A02', 'T9A04', 'T9A05', 'T9A10', 'T9A11'],
      questions: [
        {
          q: 'You test a new dipole and find it is resonant a little below the band you want. What do you do to the wire?',
          review: 'resonance',
          covers: ['T9A05'],
          choices: [
            { label: 'Add some wire to each end', why: 'A longer dipole is resonant on a lower frequency. That moves it further from the band.' },
            { label: 'Trim it shorter', right: true, why: 'Shortening a dipole increases its resonant frequency, which brings it up into the band.' },
            { label: 'Add a coil to each side', why: 'Coils make an antenna electrically longer, which lowers the resonant frequency further.' },
          ],
        },
        {
          q: 'Why does a handheld usually get out better with a full-sized quarter-wave antenna than with its short flexible one?',
          review: 'loading',
          covers: ['T9A02', 'T9A04'],
          choices: [
            { label: 'The short flexible antenna has low efficiency', right: true, why: 'The short antenna is convenient, but less of the power is radiated. That is low efficiency.' },
            { label: 'The short flexible antenna only works for digital signals', why: 'An antenna works the same for analog and digital signals.' },
            { label: 'The full-sized antenna adds power to the transmitter', why: 'No antenna adds power. The full-sized one simply radiates more of what it is given.' },
          ],
        },
        {
          q: 'A dipole wire runs east to west. A station due east, straight off the end of the wire, hears you poorly. Why?',
          review: 'pattern',
          covers: ['T9A10'],
          choices: [
            { label: 'A dipole radiates least off its ends and most broadside', right: true, why: 'East is off the end of the wire. The strongest signal goes broadside, here north and south.' },
            { label: 'A dipole only radiates straight up', why: 'A dipole radiates its strongest signal broadside to the wire, not only upward.' },
            { label: 'A dipole sends the same signal in every direction, so the fault is elsewhere', why: 'A dipole is not equal in all directions. It is weak off its ends.' },
          ],
        },
        {
          q: 'A friend says his new beam antenna has gain, so his transmitter is now more powerful. Is he right?',
          review: 'gain',
          covers: ['T9A01', 'T9A11'],
          choices: [
            { label: 'Yes. Gain is power the antenna adds', why: 'An antenna adds no power. It can only send the power it is given in a chosen direction.' },
            { label: 'No. The beam concentrates the same power in one direction', right: true, why: 'Gain is the increase in signal strength in a specified direction compared to a reference antenna.' },
            { label: 'Yes, but only while receiving', why: 'Gain is never added power, on transmit or on receive. It is the signal being concentrated.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T9A01', 'T9A02', 'T9A03', 'T9A04', 'T9A05', 'T9A06', 'T9A07', 'T9A08', 'T9A09', 'T9A10', 'T9A11'],
      facts: [
        { icon: IconShort, text: 'Shortening a dipole increases its resonant frequency. A 19 inch vertical is a resonant quarter-wave on 2 meters.', covers: ['T9A05', 'T9A08'] },
        { icon: IconCoil, text: 'Loading means inserting inductors in the radiating element to make it electrically longer. A handheld\'s short flexible antenna has low efficiency.', covers: ['T9A02', 'T9A04'] },
        { icon: IconCar, text: 'Inside a vehicle, the shielding effect of the metal body reduces a handheld\'s signal strength. Use an antenna mounted outside.', covers: ['T9A07'] },
        { icon: IconBroadside, text: 'Antenna polarization is the orientation of the electric field. A half-wave dipole is strongest broadside to the antenna.', covers: ['T9A03', 'T9A10'] },
        { icon: IconBeam, text: 'Gain is the increase in signal strength in a specified direction compared to a reference antenna. A beam, such as a Yagi, concentrates signals in one direction and has high gain.', covers: ['T9A01', 'T9A06', 'T9A11'] },
        { icon: IconTall, text: 'A 5/8-wavelength whip has more gain than a 1/4-wave antenna.', covers: ['T9A09'] },
      ],
    },
  ],
};
export default LESSON;
