import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 3: Reaching beyond the horizon (question group T3C, all 11 questions).
 * Every exam fact below comes from a T3C question and its keyed answer; the ids are in each
 * step's `covers`. The intro is the hand-animated clip "propagation". Facts added for teaching
 * that the pool does not state: the sunspot cycle takes about 11 years, sunspots are dark
 * patches on the Sun, an aurora is also called the northern lights, and 14 MHz is an HF
 * frequency (used as the example in the third card).
 */

/* ---------- pictures ---------- */

/** One station sends HF and UHF up at the ionosphere. Once answered, HF comes back down and UHF goes on into space. T3C01, T3C02 */
function TwoSignals({ picked, solved }: PicProps) {
  const uhfOut = solved || picked === 'uhf';
  return (
    <Art label={solved
      ? 'A station sends two signals up toward the ionosphere. The HF signal is bent back and comes down far beyond the horizon. The UHF signal passes straight through and goes out to space.'
      : 'A station sends two signals, HF and UHF, up toward the ionosphere. Where each one goes next is not shown yet.'}>
      <path class="ga-fw ga-soft" d="M0 132Q120 100 240 132V140H0Z" />
      <path class="ga-w" d="M0 132Q120 100 240 132" />
      <path class="ga-fk ga-soft" d="M0 50Q120 18 240 50V68Q120 36 0 68Z" />
      <path class="ga-k" d="M0 68Q120 36 240 68" />
      <T x={232} y={48} a="end" c="ga-tk ga-tb">ionosphere</T>
      <path class="ga-w" d="M30 125V112M24 104L30 112L36 104M24 104H36" />
      <path class="ga-w" d="M210 125V112M204 104L210 112L216 104M204 104H216" />
      {solved
        ? <><path class="ga-good" d="M36 102L120 53L204 100" /><Arrow x1={190} y1={92} x2={204} y2={100} c="ga-good" /></>
        : <path class="ga-s" d="M36 102L84 74" />}
      {uhfOut
        ? <Arrow x1={34} y1={100} x2={96} y2={10} c={solved ? 'ga-s' : 'ga-bad'} />
        : <path class="ga-s" d="M34 100L52 74" />}
      <T x={10} y={88} c="ga-ts ga-tb">UHF</T>
      <T x={72} y={98} c="ga-ts ga-tb">HF</T>
      {uhfOut && <T x={104} y={16} c="ga-tm">out to space</T>}
      {solved && <T x={120} y={135} a="middle" c="ga-tk ga-tb">HF comes back down</T>}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconHorizon = () => <Mini><path class="ls-mw" d="M4 40Q24 20 44 40" /><path class="ls-ms" d="M10 26Q28 16 42 34" /><path class="ls-mk" d="M10 34V24" /></Mini>;
const IconSky = () => <Mini><path class="ls-mk" d="M4 14Q24 2 44 14" /><path class="ls-ms" d="M8 40L24 9L40 40" /><path class="ls-mw" d="M4 44Q24 36 44 44" /></Mini>;
const IconSun = () => <Mini><circle class="ls-ms" cx="24" cy="24" r="9" /><path class="ls-ms ls-mthin" d="M24 5V10M24 38V43M5 24H10M38 24H43M11 11L14 14M34 34L37 37M37 11L34 14M11 37L14 34" /><circle class="ls-mk ls-mthin" cx="21" cy="22" r="1.500" /><circle class="ls-mk ls-mthin" cx="27" cy="27" r="1.500" /></Mini>;
const IconPatch = () => <Mini><path class="ls-mw ls-mthin" d="M4 16Q24 6 44 16" /><path class="ls-mk" d="M17 10H31" /><path class="ls-ms" d="M8 40L24 12L40 40" /></Mini>;
const IconDuct = () => <Mini><path class="ls-mk" d="M4 18Q24 8 44 18" /><path class="ls-mw" d="M4 40Q24 30 44 40" /><path class="ls-ms" d="M6 34L15 17L24 31L33 17L42 34" /></Mini>;
const IconTrail = () => <Mini><path class="ls-mk" d="M18 14L36 6" /><path class="ls-ms" d="M8 40L24 12L40 40" /><path class="ls-mw" d="M4 44H44" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't3c-propagation',
  title: 'Reaching beyond the horizon',
  blurb: 'Why HF goes around the world, why VHF and UHF mostly stay local, and the special conditions that carry them far.',
  sub: 'T3',
  groups: ['T3C'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'propagation',
      intro: 'Start with a one-minute clip. After it you will try each idea yourself.',
      covers: ['T3C01', 'T3C02', 'T3C11'],
    },
    {
      type: 'card',
      id: 'horizon',
      idea: 'The radio horizon is past the visual horizon',
      covers: ['T3C11'],
      picture: { art: 'radio-horizon' },
      heading: 'Radio sees a little past the horizon',
      text: [
        'VHF and UHF signals travel in nearly straight lines, so the curve of the Earth gets in the way. The farthest point they normally reach is called the radio horizon.',
        'It is a little farther away than the horizon you can see. Air is thicker near the ground than higher up, and that bends radio waves slightly downward, so they follow the curve of the Earth a short way. Bending like this is called refraction.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Why can a VHF signal be heard a little beyond the farthest point you can see?',
        options: [
          { id: 'fast', label: 'Radio waves travel faster than light', why: 'Radio waves travel at the speed of light, never faster. You saw that in the first lesson.' },
          { id: 'bend', label: 'The atmosphere bends radio waves slightly', right: true, why: 'Yes. The atmosphere refracts radio waves slightly, so they curve a little way around the Earth.' },
          { id: 'strong', label: 'Radio waves are stronger than light', why: 'Strength is not the reason. The path of the wave is bent slightly by the atmosphere.' },
        ],
      },
      remember: 'The radio horizon for VHF and UHF is more distant than the visual horizon because the atmosphere refracts radio waves slightly.',
    },
    {
      type: 'card',
      id: 'knife',
      idea: 'Knife-edge diffraction gets past obstructions',
      covers: ['T3C05'],
      picture: { art: 'knife-edge-diffraction' },
      heading: 'Over the top of a ridge',
      text: [
        'A hill or a building in the way does not always stop a signal. When a radio wave passes a sharp edge, such as a ridge line or a rooftop, part of it bends down behind the edge. Bending around an edge is called diffraction.',
        'The edge acts like the blade of a knife, so this is called knife-edge diffraction. It lets some signal reach a station hidden behind the obstruction.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A sharp ridge stands between you and another station on VHF. Some of your signal still reaches them. How?',
        options: [
          { id: 'rock', label: 'It passes straight through the ridge', why: 'A ridge of rock and earth blocks the straight path. The signal gets there by bending over the top.' },
          { id: 'edge', label: 'It bends over the sharp top of the ridge', right: true, why: 'Yes. This is knife-edge diffraction: the wave bends down behind a sharp edge.' },
          { id: 'speed', label: 'It speeds up to get around the ridge', why: 'Radio waves do not change speed to get around things. The wave bends at the sharp edge.' },
        ],
      },
      remember: 'Knife-edge diffraction may allow radio signals to travel beyond obstructions between the transmitting and receiving stations.',
    },
    {
      type: 'card',
      id: 'sky',
      idea: 'The ionosphere returns HF, not UHF',
      covers: ['T3C01', 'T3C02'],
      picture: { draw: TwoSignals },
      heading: 'The ionosphere returns HF, but not UHF',
      text: [
        'The clip showed the big difference between the bands. The ionosphere bends HF signals back to Earth, so long-distance contacts by way of the ionosphere are far more common on HF than on VHF and higher frequencies.',
        'UHF signals are usually not propagated by the ionosphere. They go straight through it. That is why a simplex UHF signal, one sent directly from station to station with no repeater, is rarely heard beyond its radio horizon.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'One station sends two signals up toward the ionosphere: HF on 14 MHz and UHF on 440 MHz. Which one comes back down far beyond the horizon?',
        options: [
          { id: 'uhf', label: 'The UHF signal, 440 MHz', why: 'UHF signals are usually not propagated by the ionosphere. This one passes through and goes out to space.' },
          { id: 'hf', label: 'The HF signal, 14 MHz', right: true, why: 'Yes. The ionosphere bends HF back to Earth, far beyond the horizon. The UHF signal goes on out to space.' },
          { id: 'both', label: 'Both of them', why: 'Only one does. UHF signals are usually not propagated by the ionosphere.' },
        ],
      },
      remember: 'Long-distance ionospheric propagation is far more common on HF. UHF signals are usually not propagated by the ionosphere, so simplex UHF is rarely heard beyond the radio horizon.',
    },
    {
      type: 'card',
      id: 'daytime',
      idea: '10 meters needs daylight and sunspots',
      covers: ['T3C09'],
      picture: { art: 'f-region' },
      heading: 'The Sun switches 10 meters on',
      text: [
        'The highest part of the ionosphere is called the F region. It returns signals over the longest distances, and it gets its charge from the Sun. The stronger the charge, the higher the frequency it can send back.',
        'The 10 meter band is at the top of HF, so it needs a strongly charged F region. That takes daylight and an active Sun. Sunspots, dark patches on the Sun, are the sign of an active Sun. So 10 meters is generally best from dawn to shortly after sunset, during periods of high sunspot activity.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You want a long-distance contact on 10 meters by way of the F region. When is your best chance?',
        options: [
          { id: 'nh', label: 'Midnight, in a year with many sunspots', why: 'After dark the F region loses charge and usually cannot return 10 meter signals, even with many sunspots.' },
          { id: 'dl', label: 'Midday, in a year with few sunspots', why: 'Daylight is right, but with few sunspots the F region is often too weak to return 10 meter signals.' },
          { id: 'dh', label: 'Midday, in a year with many sunspots', right: true, why: 'Yes. Daylight and high sunspot activity together charge the F region enough to return 10 meter signals.' },
          { id: 'nl', label: 'Midnight, in a year with few sunspots', why: 'Darkness and few sunspots give the weakest F region. That is the worst time for 10 meters.' },
        ],
      },
      remember: 'Long-distance 10 meter propagation via the F region is generally best from dawn to shortly after sunset during periods of high sunspot activity.',
    },
    {
      type: 'card',
      id: 'sunspots',
      idea: '6 and 10 meters at the sunspot peak',
      covers: ['T3C10'],
      picture: { art: 'sunspot-cycle' },
      heading: 'At the sunspot peak, 6 meters joins in',
      text: [
        'The number of sunspots rises and falls in a cycle that takes about 11 years. At the peak of the cycle the F region is at its strongest.',
        'Then it may return signals on 10 meters and even on 6 meters, the lowest VHF band, over long distances. That is as high as it goes. Shorter waves such as 1.25 meters, 70 centimeters and 23 centimeters still pass straight through.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'It is the peak of the sunspot cycle. What can the F region do with each band? Tap a band, then tap the result.',
        slots: [
          { id: 'back', label: 'Sent back', sub: 'long distance', rule: 'Only 10 meters and 6 meters are low enough in frequency for the F region to return.' },
          { id: 'thru', label: 'Goes through', sub: 'out to space', rule: 'At the peak, 10 meters and 6 meters are low enough in frequency for the F region to return.' },
        ],
        items: [
          { id: 'a', label: '70 centimeters', slot: 'thru', why: 'Yes. 70 centimeters is too high in frequency for the F region, even at the peak.' },
          { id: 'b', label: '10 meters', slot: 'back', why: 'Yes. 10 meters may give long-distance contacts by the F region at the sunspot peak.' },
          { id: 'c', label: '23 centimeters', slot: 'thru', why: 'Yes. 23 centimeters goes straight through the ionosphere.' },
          { id: 'd', label: '6 meters', slot: 'back', why: 'Yes. At the sunspot peak, even 6 meters may be returned by the F region.' },
        ],
      },
      remember: 'During the peak of the sunspot cycle, the 6 and 10 meter bands may provide long-distance communications via the F region.',
    },
    {
      type: 'card',
      id: 'sporadic',
      idea: 'Sporadic E: occasional strong signals',
      covers: ['T3C04'],
      picture: { art: 'sporadic-e' },
      heading: 'Sporadic E: a surprise opening',
      text: [
        'Below the F region lies the E region. Now and then a small, dense patch of charge forms in it. The patch can reflect signals that would normally pass through: on 10 meters, on 6 meters and sometimes on 2 meters.',
        'This is called sporadic E, because the patches come and go without warning. While one lasts, strong signals arrive from far beyond the radio horizon.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'On 6 meters you suddenly hear a strong station from far beyond the horizon. Later it is gone. What most likely carried it?',
        options: [
          { id: 'los', label: 'A straight line-of-sight path', why: 'Line of sight ends near the radio horizon. This station is far beyond it.' },
          { id: 'es', label: 'A dense patch in the E region: sporadic E', right: true, why: 'Yes. Sporadic E brings occasional strong signals from beyond the radio horizon on 10, 6 and 2 meters.' },
          { id: 'bend', label: 'The slight bending that sets the radio horizon', why: 'That bending only reaches a little past the horizon you can see, and it is there all the time.' },
        ],
      },
      remember: 'Sporadic E is the propagation most commonly associated with occasional strong signals on the 10, 6 and 2 meter bands from beyond the radio horizon.',
    },
    {
      type: 'card',
      id: 'ducting',
      idea: 'Tropospheric ducting and temperature inversions',
      covers: ['T3C06', 'T3C08'],
      picture: { art: 'tropospheric-ducting' },
      heading: 'Ducting: a pipe made of air',
      text: [
        'The troposphere is the lowest part of the atmosphere, where the weather is. Normally air gets cooler as you go up. Sometimes a layer of warm air settles on top of cooler air. That is a temperature inversion.',
        'The boundary bends VHF and UHF waves back down, and they are guided along between it and the ground, like water in a pipe. This is tropospheric ducting. It carries VHF and UHF signals over the horizon, to about 300 miles on a regular basis.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What in the air can open a duct for your 2 meter signal?',
        options: [
          { id: 'storm', label: 'Lightning in a thunderstorm', why: 'Lightning makes static noise. It does not form a duct.' },
          { id: 'spots', label: 'A large number of sunspots', why: 'Sunspots affect the ionosphere, far above the troposphere where ducting happens.' },
          { id: 'inv', label: 'A layer of warm air above cooler air', right: true, why: 'Yes. That is a temperature inversion, and temperature inversions cause tropospheric ducting.' },
        ],
      },
      remember: 'Tropospheric ducting, caused by temperature inversions in the atmosphere, allows over-the-horizon VHF and UHF communications to about 300 miles on a regular basis.',
    },
    {
      type: 'card',
      id: 'scatter',
      idea: 'Aurora and meteor scatter',
      covers: ['T3C03', 'T3C07'],
      picture: { art: 'meteor-scatter' },
      heading: 'Two more reflectors in the sky',
      text: [
        'An aurora, the northern lights, is a moving curtain of charged particles. VHF signals can bounce off it. The curtain never holds still, so signals received by auroral backscatter are distorted, with a raspy sound.',
        'Meteors burning up leave short-lived trails of charged gas. Bouncing a signal off those trails is called meteor scatter. Of the VHF and UHF bands, the trails reflect the lowest frequencies best, so the best band for meteor scatter is 6 meters.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'You have now met four ways VHF gets beyond the horizon. Match each clue to its name. Tap a clue, then tap the name.',
        slots: [
          { id: 'es', label: 'Sporadic E', rule: 'Sporadic E is a dense patch in the E region that brings occasional strong signals.' },
          { id: 'duct', label: 'Tropospheric ducting', rule: 'Ducting is caused by a temperature inversion: warm air above cool air.' },
          { id: 'aur', label: 'Auroral backscatter', rule: 'Signals off an aurora are known by their distorted, raspy sound.' },
          { id: 'met', label: 'Meteor scatter', rule: 'Meteor scatter uses short-lived trails and works best on 6 meters.' },
        ],
        items: [
          { id: 'a', label: 'Raspy, distorted sound', slot: 'aur', why: 'Yes. Signals received via auroral backscatter are distorted, with a raspy sound.' },
          { id: 'b', label: 'Warm air above cool air', slot: 'duct', why: 'Yes. A temperature inversion causes tropospheric ducting.' },
          { id: 'c', label: 'Trails that last moments, best on 6 meters', slot: 'met', why: 'Yes. Meteor trails are short-lived, and 6 meters is the best band for meteor scatter.' },
          { id: 'd', label: 'Occasional strong signals on 10, 6 and 2 meters', slot: 'es', why: 'Yes. That is sporadic E.' },
        ],
      },
      remember: 'VHF signals received via auroral backscatter are distorted, with a raspy sound. The best band for meteor scatter is 6 meters.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T3C01', 'T3C03', 'T3C06', 'T3C08', 'T3C09', 'T3C10'],
      questions: [
        {
          q: 'A friend says their UHF handheld cannot reach the next state because it is too weak. What is the real reason?',
          review: 'sky',
          covers: ['T3C01'],
          choices: [
            { label: 'A rule limits how far a UHF signal may travel', why: 'There is no such rule. The limit comes from the path the signal takes.' },
            { label: 'UHF signals usually pass through the ionosphere instead of coming back down', right: true, why: 'UHF signals are usually not propagated by the ionosphere, so they are rarely heard beyond the radio horizon.' },
            { label: 'UHF waves travel more slowly than HF waves', why: 'All radio waves travel at the same speed. The difference is that the ionosphere does not send UHF back.' },
          ],
        },
        {
          q: 'It is noon, at the peak of the sunspot cycle. Which of these bands has the best chance of a long-distance contact by the F region?',
          review: 'sunspots',
          covers: ['T3C09', 'T3C10'],
          choices: [
            { label: '10 meters', right: true, why: 'Daylight and high sunspot activity are the best conditions for 10 meters by the F region.' },
            { label: '70 centimeters', why: '70 centimeters is too high in frequency. It passes through the F region even at the peak.' },
            { label: '23 centimeters', why: '23 centimeters goes straight through the ionosphere.' },
          ],
        },
        {
          q: 'The forecast shows a layer of warm air sitting over cool air across your region. What might you notice on 2 meters?',
          review: 'ducting',
          covers: ['T3C06', 'T3C08'],
          choices: [
            { label: 'Nothing. Weather never changes how far VHF goes', why: 'It can. A temperature inversion can form a duct that guides VHF a long way.' },
            { label: 'Raspy, distorted signals', why: 'A raspy sound is the mark of signals bounced off an aurora, not of ducting.' },
            { label: 'Stations a few hundred miles away', right: true, why: 'A temperature inversion can cause tropospheric ducting, which carries VHF and UHF to about 300 miles.' },
          ],
        },
        {
          q: 'You hear a VHF signal with a rough, raspy buzz to it. What did it most likely bounce off?',
          review: 'scatter',
          covers: ['T3C03'],
          choices: [
            { label: 'A meteor trail', why: 'Meteor trails give short bursts of signal. The raspy sound is the mark of an aurora.' },
            { label: 'An aurora', right: true, why: 'Signals received via auroral backscatter are distorted, with a raspy sound.' },
            { label: 'A sharp ridge', why: 'A ridge bends a signal over its edge. It does not make it raspy.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T3C01', 'T3C02', 'T3C03', 'T3C04', 'T3C05', 'T3C06', 'T3C07', 'T3C08', 'T3C09', 'T3C10', 'T3C11'],
      facts: [
        { icon: IconHorizon, text: 'The atmosphere refracts radio waves slightly, so the radio horizon is past the visual horizon. Knife-edge diffraction carries signals beyond obstructions.', covers: ['T3C05', 'T3C11'] },
        { icon: IconSky, text: 'Long-distance ionospheric propagation is far more common on HF. UHF is usually not propagated by the ionosphere, so it is rarely heard beyond the radio horizon.', covers: ['T3C01', 'T3C02'] },
        { icon: IconSun, text: '10 meters by the F region: best from dawn to shortly after sunset with high sunspot activity. At the sunspot peak, 6 and 10 meters may go long distance.', covers: ['T3C09', 'T3C10'] },
        { icon: IconPatch, text: 'Sporadic E: occasional strong signals on 10, 6 and 2 meters from beyond the radio horizon.', covers: ['T3C04'] },
        { icon: IconDuct, text: 'Tropospheric ducting, caused by temperature inversions, carries VHF and UHF to about 300 miles.', covers: ['T3C06', 'T3C08'] },
        { icon: IconTrail, text: 'Auroral backscatter sounds distorted and raspy. Meteor scatter works best on 6 meters.', covers: ['T3C03', 'T3C07'] },
      ],
    },
  ],
};
export default LESSON;
