import { Art, Mini, T, fineWave, wave } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 2: How radio signals travel (question group T3A, all 12 questions).
 * Every exam fact below comes from a T3A question and its keyed answer; the ids are in each
 * step's `covers`. Facts added for teaching that the pool does not state: FM and repeater work
 * uses vertical antennas, a 2 meter wave is about 6 feet long, and the feet in the first
 * card's activity are an example, not a rule.
 */

/* ---------- pictures ---------- */

const n1 = (v: number) => +v.toFixed(1);

/** How far apart the two copies are, as a phase, after moving the antenna `feet` feet (an example). */
const lag = (feet: number) => Math.PI * (1 - feet / 3);
/** Strength of the two copies added together, 0 (cancel) to 1 (fully in step). */
const combined = (feet: number) => Math.abs(Math.cos(lag(feet) / 2));

/** Two copies of one signal and their sum. `value` is how far the antenna has moved, in feet. T3A01 */
function TwoCopies({ value = 0, solved }: PicProps) {
  const ph = lag(value);
  const L = 53;
  const line = (y: number, amp: number, f: (t: number) => number) => {
    let d = '';
    for (let x = 14; x <= 226; x += 1) d += `${x === 14 ? 'M' : 'L'}${x} ${n1(y - amp * f(((x - 14) / L) * 2 * Math.PI))}`;
    return d;
  };
  const s = combined(value);
  return (
    <Art label={`Two copies of the same signal reach the antenna: one direct, one reflected. Added together they give a signal at ${Math.round(s * 100)} percent of full strength.`}>
      <T x={14} y={13} c="ga-ts">direct copy</T>
      <path class="ga-s ga-thin" d={line(27, 8, Math.sin)} />
      <T x={14} y={51} c="ga-ts">reflected copy, a little late</T>
      <path class="ga-s ga-thin" d={line(65, 8, (t) => Math.sin(t + ph))} />
      <T x={14} y={93} c="ga-tk ga-tb">added together: what you receive</T>
      <path class="ga-w ga-thin ga-dash" d="M14 115H226" />
      <path class={`${solved ? 'ga-good' : 'ga-k'} ga-thick`} d={line(115, 7, (t) => Math.sin(t) + Math.sin(t + ph))} />
    </Art>
  );
}

const tiltGain = (deg: number) => Math.cos((deg * Math.PI) / 180) ** 2;

/** A vertical repeater antenna, its vertical wave, and a handheld the learner tilts. `value` is the tilt in degrees. T3A04 */
function Tilt({ value = 90, solved }: PicProps) {
  const g = Math.max(tiltGain(value), 0.04);
  return (
    <Art label={`A repeater with a vertical antenna sends a vertical wave to a handheld radio tilted ${value} degrees from upright. The signal meter shows ${Math.round(tiltGain(value) * 100)} percent.`}>
      <path class="ga-w" d="M10 116H230" />
      <path class="ga-w ga-thick" d="M30 116V44" />
      <path class="ga-s" d={wave(46, 142, 76, 48, 14)} />
      <path class="ga-s ga-thin" d="M58 94V58M54 63L58 58L62 63M54 89L58 94L62 89" />
      <g transform={`rotate(${value} 184 84)`}>
        <rect class="ga-fbg" x="176" y="74" width="16" height="30" rx="3" />
        <rect class="ga-k" x="176" y="74" width="16" height="30" rx="3" />
        <path class="ga-k ga-thick" d="M184 74V40" />
      </g>
      <T x={12} y={132} c="ga-tm">repeater: vertical</T>
      <T x={228} y={132} a="end" c="ga-tm">your handheld</T>
      <T x={12} y={18} c="ga-tm">signal</T>
      <rect class="ga-w ga-thin" x="52" y="9" width="120" height="11" rx="3" />
      <rect class={solved ? 'ga-fgood' : 'ga-fk'} x="54" y="11" width={n1(116 * g)} height="7" rx="2" />
    </Art>
  );
}

/** Rain across the path: a long wave passes almost untouched, microwaves come out weak. T3A07, T3A12 */
function RainPath() {
  const drops = [];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) drops.push(`M${170 + c * 12 + (r % 2) * 5} ${26 + r * 13}l-2 6`);
  let micro = '';
  for (let x = 14; x <= 226; x += 0.5) {
    const amp = x < 162 ? 9 : x > 212 ? 2.5 : 9 - ((x - 162) / 50) * 6.5;
    micro += `${x === 14 ? 'M' : 'L'}${x} ${n1(98 - amp * Math.sin(((x - 14) / 7) * 2 * Math.PI))}`;
  }
  return (
    <Art label="Rain falls across the path of two signals. A long 6 meter or 10 meter wave passes through with little effect. Microwaves, which are very short waves, come out much weaker.">
      <T x={188} y={15} a="middle" c="ga-tk ga-tb">rain or fog</T>
      <path class="ga-k ga-thin" d={drops.join('')} />
      <path class="ga-s" d={wave(14, 226, 44, 70, 11)} />
      <T x={14} y={72} c="ga-ts">10 m and 6 m: little effect</T>
      <path class="ga-s ga-thin" d={micro} />
      <T x={14} y={126} c="ga-ts">microwaves: weaker</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconPaths = () => <Mini><path class="ls-ms" d="M6 38H42" /><path class="ls-ms ls-mthin" d="M6 38L24 10L42 38" /><path class="ls-mk" d="M16 8H32" /></Mini>;
const IconFlutter = () => <Mini><path class="ls-ms" d="M4 34L9 12L14 34L19 14L24 34L29 12L34 34L39 14L44 34" /><path class="ls-mw ls-mthin" d="M4 42H44" /></Mini>;
const IconBounce = () => <Mini><path class="ls-mk" d="M12 8H36" /><path class="ls-ms" d="M6 40L24 10L42 40M36 36L42 40L43 33" /><path class="ls-mw" d="M20 40H28" /></Mini>;
const IconCross = () => <Mini><path class="ls-mk" d="M12 40V8" /><path class="ls-mw" d="M24 24H44" /><path class="ls-ms ls-mthin" d="M17 20L22 28" /></Mini>;
const IconRain = () => <Mini><path class="ls-mk ls-mthin" d="M14 6L11 14M26 6L23 14M38 6L35 14M20 18L17 26M32 18L29 26" /><path class="ls-ms" d={fineWave(4, 44, 38, 8, 5)} /></Mini>;
const IconSky = () => <Mini><path class="ls-mk" d="M4 14Q24 2 44 14" /><path class="ls-ms" d="M8 40L24 9L40 40" /><path class="ls-mw" d="M4 44Q24 36 44 44" /></Mini>;

/* ---------- the lesson ---------- */

const strength = (feet: number) => {
  const s = combined(feet);
  return s < 0.15 ? 'almost gone' : s < 0.6 ? 'weak' : s < 0.9 ? 'fair' : s < 0.99 ? 'strong' : 'strongest';
};
const tiltWord = (deg: number) => (deg === 0 ? 'upright' : deg === 90 ? 'on its side' : `tilted ${deg}°`);
const tiltSignal = (deg: number) => {
  const g = tiltGain(deg);
  return g > 0.99 ? 'strongest' : g > 0.7 ? 'strong' : g > 0.4 ? 'about half' : g > 0.2 ? 'weak' : 'very weak';
};

const LESSON: Lesson = {
  id: 't3a-signals-travel',
  title: 'How radio signals travel',
  blurb: 'Why a signal changes when you move a few feet, why antennas should match, and what trees, rain and the ionosphere do.',
  sub: 'T3',
  groups: ['T3A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t3a-signals-travel',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T3A01', 'T3A02', 'T3A04', 'T3A06', 'T3A07', 'T3A11', 'T3A12'],
    },
    {
      type: 'card',
      id: 'multipath',
      idea: 'Multipath: copies that add up or cancel',
      covers: ['T3A01'],
      picture: { draw: TwoCopies },
      heading: 'One signal, more than one path',
      text: [
        'On VHF and UHF a signal rarely reaches you by one path only. One copy comes straight to you. Others bounce off buildings and hills and arrive a moment later. This is multipath propagation. Propagation just means the way a signal travels.',
        'Where two copies arrive in step, they add up and the signal is strong. Where they arrive out of step, they cancel. A 2 meter wave is only about 6 feet long, so a strong spot and a dead spot can be a few feet apart.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Here the two copies cancel and your signal has almost vanished. Move the antenna until the signal is strongest.',
        label: 'Antenna position',
        min: 0,
        max: 5,
        step: 0.5,
        start: 0,
        readouts: (v) => [{ label: 'Antenna moved', value: `${v} ft` }, { label: 'Signal', value: strength(v) }],
        goal: (v) => v === 3,
        hint: (v) => (v < 3
          ? 'The two copies are still out of step. Keep moving the antenna.'
          : 'You have gone past the best spot. The copies are slipping out of step again, so move back a little.'),
        done: 'There. In this example, 3 feet was enough to bring the two copies into step. Same radio, same power, a different spot.',
      },
      remember: 'VHF signal strength can change greatly when the antenna moves only a few feet, because multipath propagation cancels or reinforces signals.',
    },
    {
      type: 'card',
      id: 'picket',
      idea: 'Picket fencing and data errors',
      covers: ['T3A06', 'T3A10'],
      picture: { art: 'picket-fencing' },
      heading: 'On the move, multipath makes a signal flutter',
      text: [
        'Now put the radio in a moving car. It drives through strong spots and dead spots one after another, so the signal chops in and out very quickly. Hams call this rapid flutter picket fencing, like sunlight flickering through the slats of a fence as you drive past.',
        'Multipath also hurts data. The late copies land on top of the direct signal and smear it, so the receiver misreads more of what was sent. Error rates are likely to increase.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A friend calls you from a car moving through the city. Their voice flutters rapidly in and out. What is the cause?',
        options: [
          { id: 'mic', label: 'They are holding the microphone too far away', why: 'That would make the voice quiet all the time. It would not chop in and out as the car moves.' },
          { id: 'multi', label: 'Multipath: the car is passing through spots where copies add and cancel', right: true, why: 'Yes. This rapid flutter on a mobile signal is called picket fencing, and multipath causes it.' },
          { id: 'power', label: 'Their radio keeps changing its power', why: 'A radio does not change power by itself many times a second. The flutter comes from the path, not the transmitter.' },
        ],
      },
      remember: 'Picket fencing is rapid flutter on mobile signals due to multipath propagation. Multipath also makes data error rates likely to increase.',
    },
    {
      type: 'card',
      id: 'reflect',
      idea: 'Using a reflection to get around a blockage',
      covers: ['T3A05'],
      picture: { art: 'reflection' },
      heading: 'Blocked? Bounce the signal',
      text: [
        'Reflections are not only a nuisance. VHF and UHF signals bounce well off large things such as buildings and hills.',
        'A directional antenna, also called a beam, sends most of its signal one way. Suppose buildings block the straight path to a repeater, a station on a high spot that relays your signal. You can turn the beam toward something that can reflect your signal to the repeater, like a pool player banking a shot off the cushion.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You have a beam antenna. Buildings block the line of sight to a distant repeater. What should you try?',
        options: [
          { id: 'side', label: 'Turn the antenna on its side', why: 'Turning the antenna over does not get a signal around a building. It only stops your antenna matching the one at the repeater.' },
          { id: 'bounce', label: 'Aim at something that reflects your signal to the repeater', right: true, why: 'Yes. A building or hill off to one side can bounce your signal around the blockage.' },
          { id: 'wait', label: 'Keep aiming straight at the repeater and wait', why: 'The buildings will still be there. Look for another route: one that reflects your signal to the repeater.' },
        ],
      },
      remember: 'If the direct path to a repeater is blocked, try to find a path that reflects signals to the repeater.',
    },
    {
      type: 'card',
      id: 'polarization',
      idea: 'Cross-polarized antennas lose signal',
      covers: ['T3A04'],
      picture: { draw: Tilt },
      heading: 'Antennas should be turned the same way',
      text: [
        'You met polarization in the last lesson: it is the direction of the electric field of a wave. An upright antenna sends a vertical wave. An antenna lying flat sends a horizontal one.',
        'On a line-of-sight path, where the signal goes straight from one antenna to the other, the wave keeps its polarization. If your antenna is turned at right angles to the wave, the two antennas are cross-polarized and you pick up much less of the signal.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'The repeater antenna is vertical, but your handheld is lying on its side. Tilt it until the signal is strongest.',
        label: 'Tilt',
        min: 0,
        max: 90,
        step: 15,
        start: 90,
        readouts: (v) => [{ label: 'Your antenna', value: tiltWord(v) }, { label: 'Signal', value: tiltSignal(v) }],
        goal: (v) => v === 0,
        hint: (v) => `Better, but the antenna is still ${v}° away from the repeater antenna. Keep going toward upright.`,
        done: 'Upright, your antenna matches the vertical wave from the repeater. On its side the two were cross-polarized, and the received signal strength was reduced.',
      },
      remember: 'Cross-polarized antennas on a line-of-sight VHF or UHF path reduce the received signal strength.',
    },
    {
      type: 'card',
      id: 'horizontal',
      idea: 'Horizontal for long-distance CW and SSB',
      covers: ['T3A03'],
      picture: { art: 'horizontal-polarization' },
      heading: 'Which way up? Follow the custom',
      text: [
        'Both stations have to match, so hams agree on a polarization for each kind of operating. FM voice and repeaters use vertical antennas. That is why a handheld is held upright.',
        'Long-distance contacts on VHF and UHF are made with weak signals, using CW (Morse code) and SSB (single sideband, a kind of voice). For these the custom is horizontal: antennas with their elements parallel to the ground.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which polarization does each one normally use? Tap a contact, then tap the polarization.',
        slots: [
          { id: 'v', label: 'Vertical', sub: 'antenna upright', rule: 'Vertical is the custom for FM and repeaters, not for long-distance CW and SSB.' },
          { id: 'h', label: 'Horizontal', sub: 'antenna flat', rule: 'Horizontal is the custom for long-distance CW and SSB, not for FM through a repeater.' },
        ],
        items: [
          { id: 'a', label: 'Long-distance SSB on 2 meters', slot: 'h', why: 'Yes. Long-distance SSB on VHF normally uses horizontal polarization.' },
          { id: 'b', label: 'Handheld through an FM repeater', slot: 'v', why: 'Yes. FM and repeater work uses vertical antennas, so the handheld is held upright.' },
          { id: 'c', label: 'Long-distance CW on 70 centimeters', slot: 'h', why: 'Yes. Long-distance CW on UHF normally uses horizontal polarization too.' },
        ],
      },
      remember: 'Long-distance CW and SSB contacts on the VHF and UHF bands normally use horizontal polarization.',
    },
    {
      type: 'card',
      id: 'absorb',
      idea: 'Trees and rain weaken the shortest waves',
      covers: ['T3A02', 'T3A07', 'T3A12'],
      picture: { draw: RainPath },
      heading: 'Trees and rain soak up the shortest waves',
      text: [
        'Some things in the path take energy out of a signal. This is absorption. Vegetation, meaning trees and other plants, absorbs UHF and microwave signals, so a weak signal that passes through thick trees may be too weak to receive well. Microwaves are the very shortest waves, at the top of UHF and above.',
        'Precipitation, meaning rain, snow and the like, can cut the range of microwave signals. Longer waves hardly notice. Fog and rain have little effect on the 10 meter and 6 meter bands, because a drop of water is tiny next to a wave several meters long.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'What happens to each signal? Tap a signal, then tap the result.',
        slots: [
          { id: 'weak', label: 'Weaker signal', sub: 'energy is absorbed', rule: 'Fog and rain have little effect on waves as long as 6 or 10 meters.' },
          { id: 'none', label: 'Little effect', sub: 'passes through', rule: 'UHF and microwave signals do lose strength in trees, and microwaves lose range in rain or snow.' },
        ],
        items: [
          { id: 'a', label: 'Microwaves through heavy rain', slot: 'weak', why: 'Yes. Precipitation can decrease range at microwave frequencies.' },
          { id: 'b', label: '6 meter signal through fog', slot: 'none', why: 'Yes. Fog has little effect on a wave 6 meters long.' },
          { id: 'c', label: 'UHF signal through thick trees', slot: 'weak', why: 'Yes. Vegetation absorbs UHF signals, so weak ones are hard to receive.' },
          { id: 'd', label: '10 meter signal through rain', slot: 'none', why: 'Yes. Rain has little effect on a wave 10 meters long.' },
        ],
      },
      remember: 'Vegetation absorbs UHF and microwave signals. Precipitation can decrease range at microwave frequencies. Fog and rain have little effect on 10 meter and 6 meter signals.',
    },
    {
      type: 'card',
      id: 'ionosphere',
      idea: 'The ionosphere reflects HF, and the signal fades',
      covers: ['T3A11', 'T3A08'],
      picture: { art: 'ionosphere' },
      heading: 'The ionosphere can send HF back down',
      text: [
        'High above the weather is a region of the atmosphere called the ionosphere. Sunlight gives it an electric charge, and that lets it reflect HF radio waves back to the ground a long way off. The next lesson is about this.',
        'The reflected signal usually comes down by several paths at once, and the ionosphere keeps shifting. It is multipath again. The copies combine at random, sometimes adding and sometimes cancelling, so the signal fades up and down with no regular pattern.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You are listening to a far-off station on HF. Its signal swells and fades with no pattern. What is the likely cause?',
        options: [
          { id: 'knob', label: 'The other operator keeps changing the power', why: 'Operators do not ride the power up and down. The change is happening along the path, in the ionosphere.' },
          { id: 'paths', label: 'Copies arriving by different paths are combining at random', right: true, why: 'Yes. The copies drift in and out of step as the ionosphere shifts, so the signal fades irregularly.' },
          { id: 'drift', label: 'The station is sliding to another frequency', why: 'Then you would have to retune to follow it. Fading is a change in strength, not in frequency.' },
        ],
      },
      remember: 'The ionosphere is the region of the atmosphere that can reflect HF radio waves. Irregular fading of those signals comes from random combining of signals arriving via different paths.',
    },
    {
      type: 'card',
      id: 'elliptical',
      idea: 'Either antenna works for ionosphere signals',
      covers: ['T3A09'],
      picture: { art: 'elliptical-polarization' },
      heading: 'After the ionosphere, either antenna will do',
      text: [
        'The ionosphere also twists a wave on its way through. The signal comes back down elliptically polarized: its electric field keeps turning, so it is a changing mix of vertical and horizontal.',
        'That makes life easier. Whichever way your antenna is turned, it picks up part of the wave. So for signals that travel by the ionosphere, either a vertical or a horizontal antenna may be used to transmit or to receive.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A far-off HF station uses a horizontal wire antenna. Your antenna is vertical. Its signal reaches you by the ionosphere. Can you use your antenna?',
        options: [
          { id: 'no', label: 'No. The two antennas are cross-polarized', why: 'Cross-polarization matters on a line-of-sight path. The ionosphere has turned this wave into a mix of vertical and horizontal.' },
          { id: 'yes', label: 'Yes. Either kind of antenna may be used', right: true, why: 'Right. The wave arrives elliptically polarized, so a vertical or a horizontal antenna picks up part of it.' },
          { id: 'flat', label: 'Only if you lay your antenna flat', why: 'There is no need. The wave arrives as a changing mix of vertical and horizontal, so the antennas do not have to match.' },
        ],
      },
      remember: 'Signals propagated by the ionosphere are elliptically polarized, so either vertically or horizontally polarized antennas may be used to transmit or receive.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T3A01', 'T3A04', 'T3A07', 'T3A09', 'T3A10', 'T3A12'],
      questions: [
        {
          q: 'You are parked and the repeater sounds weak. You roll the car forward a few feet and it is suddenly strong. What changed?',
          review: 'multipath',
          covers: ['T3A01'],
          choices: [
            { label: 'The repeater turned its power up', why: 'The repeater did nothing. Your antenna moved from a spot where the copies cancel to one where they add.' },
            { label: 'The direct and reflected copies of the signal now add up instead of cancelling', right: true, why: 'This is multipath. A few feet is enough to bring the copies into step.' },
            { label: 'You moved a few feet closer to the repeater', why: 'A few feet out of several miles makes no difference to distance. What changed is how the copies of the signal combine.' },
          ],
        },
        {
          q: 'You send a data message over a path with strong reflections from nearby buildings. What should you expect?',
          review: 'picket',
          covers: ['T3A10'],
          choices: [
            { label: 'Nothing. Data is not affected by reflections', why: 'Data is affected. Late copies land on top of the direct signal and smear it.' },
            { label: 'More errors in what is received', right: true, why: 'With multipath, error rates are likely to increase.' },
            { label: 'A faster connection, because there are more paths', why: 'Extra paths do not carry extra data. The late copies only get in the way.' },
          ],
        },
        {
          q: 'A storm brings heavy rain. Which of these signals is most likely to lose range?',
          review: 'absorb',
          covers: ['T3A07', 'T3A12'],
          choices: [
            { label: 'A 10 meter signal', why: 'Rain has little effect on a wave 10 meters long.' },
            { label: 'A 6 meter signal', why: 'Rain has little effect on a wave 6 meters long.' },
            { label: 'A microwave signal', right: true, why: 'Precipitation can decrease range at microwave frequencies, where the waves are very short.' },
          ],
        },
        {
          q: 'When does it matter most that two antennas are turned the same way?',
          review: 'polarization',
          covers: ['T3A04', 'T3A09'],
          choices: [
            { label: 'On a line-of-sight VHF or UHF path', right: true, why: 'There the wave keeps its polarization, so cross-polarized antennas lose signal strength.' },
            { label: 'When the signal comes by the ionosphere', why: 'The ionosphere mixes the polarization, so either a vertical or a horizontal antenna may be used.' },
            { label: 'Never. Antenna direction does not affect a signal', why: 'It does on a line-of-sight path. Cross-polarized antennas pick up much less signal.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T3A01', 'T3A02', 'T3A03', 'T3A04', 'T3A05', 'T3A06', 'T3A07', 'T3A08', 'T3A09', 'T3A10', 'T3A11', 'T3A12'],
      facts: [
        { icon: IconPaths, text: 'Multipath propagation cancels or reinforces signals, so VHF strength can change when the antenna moves a few feet.', covers: ['T3A01'] },
        { icon: IconFlutter, text: 'Picket fencing is rapid flutter on mobile signals due to multipath. Multipath also raises data error rates.', covers: ['T3A06', 'T3A10'] },
        { icon: IconBounce, text: 'Direct path to the repeater blocked? Find a path that reflects signals to it.', covers: ['T3A05'] },
        { icon: IconCross, text: 'Cross-polarized antennas reduce signal strength on a line-of-sight path. Long-distance CW and SSB on VHF and UHF use horizontal polarization.', covers: ['T3A03', 'T3A04'] },
        { icon: IconRain, text: 'Vegetation absorbs UHF and microwave signals. Precipitation cuts microwave range. Fog and rain have little effect on 10 and 6 meters.', covers: ['T3A02', 'T3A07', 'T3A12'] },
        { icon: IconSky, text: 'The ionosphere reflects HF. Those signals fade as paths combine at random, and arrive elliptically polarized, so either a vertical or a horizontal antenna works.', covers: ['T3A08', 'T3A09', 'T3A11'] },
      ],
    },
  ],
};
export default LESSON;
