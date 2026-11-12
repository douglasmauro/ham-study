import { Arrow, Art, Mini, T, fineWave } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Satellites (question group T8B, all 12 questions).
 * Every exam fact below comes from a T8B question and its keyed answer; the ids are in each
 * step's `covers`. The Doppler card uses an example downlink of 145.900 MHz shifting by up to
 * 3 kHz, which is the right size for a low Earth orbit satellite on the 2 meter band; the
 * pool gives no figure for it and the lesson does not ask the learner to remember one.
 */

/* ---------- pictures ---------- */

/** Kilohertz of Doppler shift at each of the five positions in the pass. */
const SHIFT = [3, 2, 0, -2, -3];
/** Length of the drawn wave at each position: bunched up when approaching, stretched when leaving. */
const WAVELEN = [5, 6, 8, 11, 13];

const heard = (v: number) => `145.${900 + SHIFT[v]} MHz`;

/** A satellite crossing the sky above a station. `value` is its position in the pass, 0 to 4. T8B07 */
function Pass({ value = 0, solved }: PicProps) {
  const v = Math.max(0, Math.min(4, Math.round(value)));
  const sx = 40 + v * 40;
  const t = (sx - 30) / 180;
  const sy = 62 - 96 * t * (1 - t);
  const x0 = sx;
  const y0 = sy + 9;
  const len = Math.hypot(120 - x0, 86 - y0);
  const ang = (Math.atan2(86 - y0, 120 - x0) * 180) / Math.PI;
  const s = SHIFT[v];
  const note = s > 0 ? 'coming toward you: heard higher' : s < 0 ? 'moving away: heard lower' : 'closest: no shift';
  return (
    <Art label={`A satellite crossing the sky from left to right above a station on the ground. ${s > 0 ? 'It is coming toward the station, its waves arrive bunched together and the station hears a higher frequency.' : s < 0 ? 'It is moving away from the station, its waves arrive stretched out and the station hears a lower frequency.' : 'It is at its closest, moving neither toward the station nor away, and the station hears the frequency that was sent.'}`}>
      <T x={120} y={16} a="middle" c={s === 0 ? 'ga-tm ga-tb' : 'ga-tk ga-tb'}>{note}</T>
      <path class="ga-w ga-thin ga-dash" d="M30 62Q120 14 210 62" />
      <g transform={`translate(${x0.toFixed(1)} ${y0.toFixed(1)}) rotate(${ang.toFixed(1)})`}>
        <path class="ga-s" d={fineWave(0, len, 0, WAVELEN[v], 4)} />
      </g>
      <rect class="ga-fbg" x={sx - 17} y={sy - 5} width="34" height="10" />
      <rect class={solved ? 'ga-good' : 'ga-k'} x={sx - 5} y={sy - 5} width="10" height="10" rx="1" />
      <path class={`${solved ? 'ga-good' : 'ga-k'} ga-thin`} d={`M${sx - 17} ${sy - 3}H${sx - 7}V${sy + 3}H${sx - 17}ZM${sx + 7} ${sy - 3}H${sx + 17}V${sy + 3}H${sx + 7}Z`} />
      <Arrow x1={sx + 20} y1={sy} x2={sx + 31} y2={sy} c="ga-w ga-thin" h={5} />
      <path class="ga-w" d="M14 118H226M120 118V100M111 88H129L120 100Z" />
      <T x={134} y={112} c="ga-tm">you</T>
      <T x={120} y={134} a="middle" c="ga-ts ga-tb">{`heard: ${heard(v)}`}</T>
    </Art>
  );
}

/**
 * What comes down from a linear transponder: the beacon, your signal and three other users.
 * `value` is your uplink power, 1 to 9. Above 5 your signal towers over the beacon and the
 * other users shrink. T8B02, T8B12
 */
function Downlink({ value = 9, solved }: PicProps) {
  const mine = value * 8;
  const squeeze = value > 5 ? Math.max(0.12, 1 - (value - 5) * 0.22) : 1;
  const others = [[84, 30], [156, 36], [190, 26]] as const;
  const tone = solved ? 'ga-good' : value > 5 ? 'ga-bad' : 'ga-s';
  return (
    <Art label={`The signals coming down from a satellite, drawn as bars. The beacon is a bar of fixed height. ${value > 5 ? 'Your signal is taller than the beacon and the bars of the other users have shrunk.' : value < 5 ? 'Your signal is shorter than the beacon. The other users are at full height.' : 'Your signal is the same height as the beacon, and the other users are at full height.'}`}>
      <T x={14} y={16} c="ga-tm">on the downlink</T>
      <path class="ga-w ga-thin" d="M14 108H226" />
      <path class="ga-k ga-thin ga-dash" d="M30 68H226" />
      <path class="ga-k ga-thick" d="M42 108V68" />
      <T x={42} y={124} a="middle" c="ga-tk ga-tb">beacon</T>
      {others.map(([x, h]) => <path class="ga-w ga-thick" d={`M${x} 108V${(108 - h * squeeze).toFixed(1)}`} />)}
      <T x={173} y={124} a="middle" c="ga-tm">other users</T>
      <path class={`${tone} ga-thick`} d={`M120 108V${108 - mine}`} />
      <T x={120} y={124} a="middle" c="ga-tb">you</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconOrbit = () => <Mini><circle class="ls-mw" cx="24" cy="24" r="9" /><circle class="ls-mk ls-mthin" cx="24" cy="24" r="18" /><circle class="ls-ms" cx="37" cy="11" r="2.500" /></Mini>;
const IconUpDown = () => <Mini><path class="ls-mk" d="M8 40L20 12M13 14L20 12L22 19" /><path class="ls-ms" d="M28 12L40 40M33 38L40 40L42 33" /></Mini>;
const IconTrack = () => <Mini><rect class="ls-mw" x="5" y="9" width="38" height="26" rx="3" /><path class="ls-ms ls-mthin" d="M9 22C13 12 17 12 21 22S29 32 33 22S37 14 39 18" /><path class="ls-mw" d="M18 42H30" /></Mini>;
const IconDoppler = () => <Mini><path class="ls-ms" d="M4 24C5.500 14 7 14 8.500 24S11.500 34 13 24S16 14 17.500 24S21 34 23 24S27.500 12 30 24S36 36 39 24S42.500 16 44 20" /></Mini>;
const IconBeacon = () => <Mini><rect class="ls-mk" x="6" y="8" width="10" height="10" rx="1" /><path class="ls-ms ls-mthin" d="M18 20C22 18 22 24 26 22S30 28 34 26S38 32 40 32" /><path class="ls-mw" d="M40 42V34M35 30H45L40 36Z" /></Mini>;
const IconShare = () => <Mini><path class="ls-mw ls-mthin" d="M4 40H44M6 22H44" /><path class="ls-mk" d="M10 40V22" /><path class="ls-ms" d="M24 40V22" /><path class="ls-mw" d="M34 40V28M41 40V30" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't8b-satellites',
  title: 'Satellites',
  blurb: 'How to talk through a relay in orbit: uplink and downlink, tracking, Doppler shift and sharing the power.',
  sub: 'T8',
  groups: ['T8B'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t8b-satellites',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T8B02', 'T8B03', 'T8B07', 'T8B08', 'T8B10'],
    },
    {
      type: 'card',
      id: 'relay',
      idea: 'A relay in low Earth orbit',
      covers: ['T8B04', 'T8B10'],
      picture: { art: 'leo' },
      heading: 'A satellite is a relay in low Earth orbit',
      text: [
        'An amateur satellite is a relay in space. It hears your signal and sends it back down, so stations far beyond your horizon can hear you. Satellites use the modes you already know: SSB, FM, and CW or data are all common.',
        'Most of them fly in low Earth orbit, LEO for short. That close to the Earth a satellite has to move fast. Its period, the time for one trip around, is about 100 minutes, and it crosses your sky in a few minutes.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A LEO satellite is right over your head. About how long will it take to go once around the Earth?',
        options: [
          { id: 'sec', label: 'About 100 seconds', why: 'Nothing in orbit is that quick. One trip around in low Earth orbit takes around 100 minutes.' },
          { id: 'min', label: 'About 100 minutes', right: true, why: 'Yes. LEO means Low Earth Orbit, and its period is around 100 minutes.' },
          { id: 'day', label: 'About 24 hours', why: 'A satellite that takes a whole day is in a far higher orbit. In low Earth orbit the period is around 100 minutes.' },
        ],
      },
      remember: 'LEO means Low Earth Orbit, which has a period of around 100 minutes. SSB, FM and CW or data are all commonly used by amateur satellites.',
    },
    {
      type: 'card',
      id: 'updown',
      idea: 'Uplink, downlink and U/V mode',
      covers: ['T8B08'],
      picture: { art: 'u-v-mode' },
      heading: 'Up on one band, down on another',
      text: [
        'The signal you send up to the satellite is the uplink. The signal it sends back down is the downlink. The two are on different bands, so the satellite can listen and talk at the same time.',
        'A two-letter code names the bands, uplink first. U stands for UHF, the 70 centimeter band. V stands for VHF, the 2 meter band. So U/V mode means the uplink is on 70 centimeters and the downlink is on 2 meters.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A satellite is in U/V mode. Which band do you transmit on to reach it?',
        options: [
          { id: '2m', label: 'The 2 meter band', why: 'The 2 meter band is V, the second letter. The second letter is the downlink, where you listen.' },
          { id: '70cm', label: 'The 70 centimeter band', right: true, why: 'Yes. U comes first, so the uplink is on UHF: the 70 centimeter band. The downlink is on 2 meters.' },
          { id: '10m', label: 'The 10 meter band', why: 'U and V stand for UHF and VHF. The 10 meter band is HF, so it is neither letter.' },
        ],
      },
      remember: 'U/V mode: the satellite uplink is in the 70 centimeter band and the downlink is in the 2 meter band.',
    },
    {
      type: 'card',
      id: 'tracking',
      idea: 'What a tracking program needs and provides',
      covers: ['T8B03', 'T8B06'],
      picture: { art: 'satellite-tracking-program' },
      heading: 'A tracking program tells you when and where',
      text: [
        'A LEO satellite is in your sky for only a few minutes, so you need to know when it is coming. A satellite tracking program works that out. Its input is the Keplerian elements: a set of numbers that describes the orbit.',
        'It provides a map of where the satellite is right now. It gives the time, azimuth (compass direction) and elevation (angle above the horizon) for the start, highest point and end of a pass. And it gives the frequency you will hear, corrected for Doppler shift, which the next card explains.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'What goes into the program, and what does it provide? Tap an item, then tap where it goes.',
        slots: [
          { id: 'in', label: 'Input', sub: 'what the program needs', rule: 'The program works this out for you. All it needs is a description of the orbit.' },
          { id: 'out', label: 'Output', sub: 'what the program provides', rule: 'The program cannot work this out. It has to be given the numbers that describe the orbit.' },
        ],
        items: [
          { id: 'a', label: 'Map of the satellite', slot: 'out', why: 'A tracking program provides maps showing the real-time position of the satellite track over the Earth.' },
          { id: 'b', label: 'Keplerian elements', slot: 'in', why: 'The Keplerian elements describe the orbit. They are the input to a tracking program.' },
          { id: 'c', label: 'Time and direction of a pass', slot: 'out', why: 'It provides the time, azimuth and elevation of the start, maximum altitude and end of a pass.' },
          { id: 'd', label: 'Frequency with Doppler shift', slot: 'out', why: 'It provides the apparent frequency of the satellite transmission, including the effects of Doppler shift.' },
        ],
      },
      remember: 'Input: the Keplerian elements. Provided: real-time maps, the time, azimuth and elevation of a pass, and the apparent frequency including Doppler shift.',
    },
    {
      type: 'card',
      id: 'doppler',
      idea: 'Doppler shift',
      covers: ['T8B07'],
      picture: { draw: Pass },
      heading: 'Doppler shift: the frequency slides as it passes',
      text: [
        'A siren sounds higher as it races toward you and lower as it speeds away. Radio does the same. A LEO satellite moves so fast that the frequency you observe is not quite the one it sends.',
        'This is Doppler shift: an observed change in signal frequency caused by relative motion between the satellite and the Earth station. In practice you retune a little during the pass to follow the signal.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'This satellite sends on 145.900 MHz the whole time. Slide it all the way across the sky and watch the frequency you hear.',
        label: 'Position in the pass',
        min: 0,
        max: 4,
        step: 1,
        start: 0,
        readouts: (v) => [{ label: 'Satellite sends', value: '145.900 MHz' }, { label: 'You hear', value: heard(v) }],
        goal: (v) => v === 4,
        hint: (v) => (v < 2
          ? 'It is coming toward you, so you hear it a little high. Keep sliding.'
          : v === 2
            ? 'At its closest it is moving neither toward you nor away. No shift. Keep sliding.'
            : 'Now it is moving away, so you hear it a little low. Slide to the end of the pass.'),
        done: 'The satellite never changed its frequency. Its motion relative to you did the rest: high while it came toward you, low as it moved away. That is Doppler shift.',
      },
      remember: 'Doppler shift is an observed change in signal frequency caused by relative motion between the satellite and the Earth station.',
    },
    {
      type: 'card',
      id: 'beacon',
      idea: 'Beacons and telemetry',
      covers: ['T8B01', 'T8B05', 'T8B11'],
      picture: { art: 'satellite-beacon' },
      heading: 'The beacon: a satellite reporting on itself',
      text: [
        'A satellite beacon is a transmission from the satellite that contains status information. Nobody has to call it. It is simply there whenever the satellite is in range.',
        'The measurements it carries are called telemetry. They report the health and status of the satellite, such as its battery voltage and temperatures. No license is needed just to listen, so anyone is permitted to receive it.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your neighbor has no license, but her receiver picks up a satellite beacon. Is she permitted to receive its telemetry?',
        options: [
          { id: 'lic', label: 'No, only licensed amateurs', why: 'A license is for transmitting. Receiving amateur satellite telemetry is open to everyone.' },
          { id: 'key', label: 'Only with a key from the control operator', why: 'No key is involved. Amateur telemetry is not hidden from the public.' },
          { id: 'any', label: 'Yes, anyone may receive it', right: true, why: 'Yes. Anyone is permitted to receive telemetry from an amateur radio satellite.' },
        ],
      },
      remember: 'A beacon is a transmission from a satellite that contains status information. Its telemetry reports the health and status of the satellite, and anyone may receive it.',
    },
    {
      type: 'card',
      id: 'power',
      idea: 'How much uplink power to use',
      covers: ['T8B02', 'T8B12'],
      picture: { draw: Downlink },
      heading: 'Share the satellite: use just enough power',
      text: [
        'Many satellites carry a linear transponder: a relay that sends down a whole slice of band, every signal in it, from one small shared transmitter. Too much effective radiated power (transmitter power plus antenna gain) on your uplink blocks access by other users.',
        'The test is easy. Listen to your own signal on the downlink. It should be about the same strength as the beacon: then your power is neither too low nor too high.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'You start with far too much power. Set your uplink power so that your signal on the downlink matches the beacon.',
        label: 'Your uplink power',
        min: 1,
        max: 9,
        step: 1,
        start: 9,
        readouts: (v) => [
          { label: 'Your signal', value: v > 5 ? 'Too strong' : v < 5 ? 'Too weak' : 'Matches' },
          { label: 'Other users', value: v > 7 ? 'Blocked' : v > 5 ? 'Squeezed' : 'Fine' },
        ],
        goal: (v) => v === 5,
        hint: (v) => (v > 5
          ? 'Your signal is still stronger than the beacon, and it is taking power away from the other users. Turn it down.'
          : 'Now your signal is weaker than the beacon and will be hard to hear. Turn it up a little.'),
        done: 'That is it. Your signal on the downlink is about the same strength as the beacon, and the other users are back.',
      },
      remember: 'Too much uplink power blocks access by other users. With a linear transponder, your signal on the downlink should be about the same strength as the beacon.',
    },
    {
      type: 'card',
      id: 'spin',
      idea: 'Spin fading',
      covers: ['T8B09'],
      picture: { art: 'spin-fading' },
      heading: 'Spin fading: the satellite is turning',
      text: [
        'Many satellites slowly spin or tumble as they fly. As the satellite turns, its antennas point toward you, then away, then toward you again.',
        'The result is spin fading: the signal gets stronger and weaker in a regular rhythm. It is caused by rotation of the satellite and its antennas, not by anything wrong with your station.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A satellite signal swells and fades every few seconds, in a steady rhythm. What is the cause?',
        options: [
          { id: 'dop', label: 'Doppler shift', why: 'Doppler shift changes the frequency you hear, not how strong the signal is.' },
          { id: 'spin', label: 'The satellite and its antennas are rotating', right: true, why: 'Yes. Spin fading is caused by rotation of the satellite and its antennas.' },
          { id: 'pwr', label: 'Your uplink power is too high', why: 'Too much uplink power blocks other users. It does not make the signal you receive fade in a rhythm.' },
        ],
      },
      remember: 'Spin fading is caused by rotation of the satellite and its antennas.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T8B02', 'T8B04', 'T8B07', 'T8B08', 'T8B12'],
      questions: [
        {
          q: 'A friend says amateur satellites only relay FM voice. Is that right?',
          review: 'relay',
          covers: ['T8B04'],
          choices: [
            { label: 'Yes, satellites are FM repeaters and nothing else', why: 'Some satellites do relay FM, but it is not the only mode in common use.' },
            { label: 'No. SSB, FM, and CW or data are all commonly used', right: true, why: 'All of these modes are commonly used by amateur radio satellites.' },
            { label: 'No, they only send CW', why: 'CW is used, but so are SSB, FM and data.' },
          ],
        },
        {
          q: 'A satellite is listed as U/V. You want to hear it. Which band do you tune your receiver to?',
          review: 'updown',
          covers: ['T8B08'],
          choices: [
            { label: 'The 2 meter band', right: true, why: 'The second letter is the downlink. V is VHF, the 2 meter band.' },
            { label: 'The 70 centimeter band', why: 'U, the 70 centimeter band, is the first letter: the uplink. You transmit there and listen on the other band.' },
            { label: 'Either one, the satellite sends on both', why: 'The satellite listens on one band and sends on the other. In U/V mode it sends on 2 meters.' },
          ],
        },
        {
          q: 'As a satellite rises, you hear it slightly above its listed frequency. A few minutes later you hear it slightly below. What happened?',
          review: 'doppler',
          covers: ['T8B07'],
          choices: [
            { label: 'The satellite retuned its transmitter', why: 'The satellite sent on the same frequency all along. Only the frequency you observed changed.' },
            { label: 'Spin fading', why: 'Spin fading changes how strong the signal is, not its frequency.' },
            { label: 'Doppler shift, because the satellite is moving past you', right: true, why: 'Relative motion between the satellite and your station changes the frequency you observe: high as it approaches, low as it leaves.' },
          ],
        },
        {
          q: 'On a linear transponder satellite, your own voice comes back down much louder than the beacon. What should you do?',
          review: 'power',
          covers: ['T8B02', 'T8B12'],
          choices: [
            { label: 'Nothing. Louder is better', why: 'The satellite shares its power among everyone. A signal that loud is blocking access by other users.' },
            { label: 'Turn your power down until you match the beacon', right: true, why: 'Your signal on the downlink should be about the same strength as the beacon. More than that blocks other users.' },
            { label: 'Turn your power up so it stays that way', why: 'You already have too much. More power would push the other users out completely.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T8B01', 'T8B02', 'T8B03', 'T8B04', 'T8B05', 'T8B06', 'T8B07', 'T8B08', 'T8B09', 'T8B10', 'T8B11', 'T8B12'],
      facts: [
        { icon: IconOrbit, text: 'LEO is Low Earth Orbit, with a period of around 100 minutes. Satellites commonly use SSB, FM, and CW or data.', covers: ['T8B04', 'T8B10'] },
        { icon: IconUpDown, text: 'U/V mode: the uplink is in the 70 centimeter band and the downlink is in the 2 meter band.', covers: ['T8B08'] },
        { icon: IconTrack, text: 'A tracking program takes the Keplerian elements. It provides maps, the time, azimuth and elevation of a pass, and the frequency including Doppler shift.', covers: ['T8B03', 'T8B06'] },
        { icon: IconDoppler, text: 'Doppler shift is a change in observed frequency caused by relative motion. Spin fading is caused by rotation of the satellite and its antennas.', covers: ['T8B07', 'T8B09'] },
        { icon: IconBeacon, text: 'A beacon is a satellite transmission with status information. Its telemetry gives health and status, and anyone may receive it.', covers: ['T8B01', 'T8B05', 'T8B11'] },
        { icon: IconShare, text: 'Too much uplink power blocks other users. Your downlink signal should be about as strong as the beacon.', covers: ['T8B02', 'T8B12'] },
      ],
    },
  ],
};
export default LESSON;
