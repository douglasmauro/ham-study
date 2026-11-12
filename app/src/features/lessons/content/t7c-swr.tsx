import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: SWR and antenna measurements (question group T7C, all 11 questions).
 * Every exam fact comes from a T7C question and its keyed answer; the ids are in each
 * step's `covers`. The intro is the hand-animated `swr` clip. The 50 ohm feed line agrees
 * with T9B02. Reflected-power percentages are computed from the SWR, not taken from the pool.
 */

/* ---------- numbers ---------- */

/** SWR of a plain resistive antenna of `ohms` on a 50 ohm feed line. */
const swrOf = (ohms: number) => (ohms >= 50 ? ohms / 50 : 50 / ohms);
const ratio = (s: number) => `${Number.isInteger(s) ? s : s.toFixed(1)}:1`;
/** Share of the forward power that comes back, in percent. */
const reflected = (s: number) => Math.round(((s - 1) / (s + 1)) ** 2 * 100);

/** The made-up antenna of the analyzer card: lowest SWR at 146.4 MHz. `v` is in tenths of a MHz. */
const sweep = (v: number) => 1.1 + 0.5 * ((v - 1464) / 10) ** 2;
const f1 = (v: number) => (v / 10).toFixed(1);

/* ---------- pictures ---------- */

/** An SWR meter above a feed line. `value` is the antenna impedance in ohms. T7C04, T7C06 */
function MatchMeter({ value = 200, solved }: PicProps) {
  const s = swrOf(value);
  const pct = reflected(s);
  const ang = ((150 - ((Math.min(s, 4) - 1) / 3) * 120) * Math.PI) / 180;
  const at = (deg: number, r: number) => [120 + r * Math.cos((deg * Math.PI) / 180), 70 - r * Math.sin((deg * Math.PI) / 180)];
  const marks = [1, 2, 3, 4].map((m) => ({ m, deg: 150 - ((m - 1) / 3) * 120 }));
  const back = (120 * pct) / 36;
  const tone = solved ? 'ga-good' : 'ga-k';
  return (
    <Art label={`An SWR meter reading ${ratio(s)}. Below it, forward power travels from the transmitter along a 50 ohm feed line to a ${value} ohm antenna. ${pct === 0 ? 'No power is reflected.' : `${pct} percent of the power is reflected back.`}`}>
      <rect class="ga-w" x="62" y="6" width="116" height="78" rx="6" />
      <path class="ga-w ga-thin" d={`M${at(150, 38).map((n) => n.toFixed(1)).join(' ')}A38 38 0 0 1 ${at(30, 38).map((n) => n.toFixed(1)).join(' ')}`} />
      {marks.map(({ m, deg }) => {
        const [a, b] = at(deg, 34);
        const [c, d] = at(deg, 42);
        const [tx, ty] = at(deg, 51);
        return (
          <>
            <path class="ga-w ga-thin" d={`M${a.toFixed(1)} ${b.toFixed(1)}L${c.toFixed(1)} ${d.toFixed(1)}`} />
            <T x={+tx.toFixed(1)} y={+(ty + 4).toFixed(1)} a="middle" c={m === 1 ? 'ga-tb' : 'ga-tm'}>{`${m}:1`}</T>
          </>
        );
      })}
      <path class={`${tone} ga-thick`} d={`M120 70L${(120 + 34 * Math.cos(ang)).toFixed(1)} ${(70 - 34 * Math.sin(ang)).toFixed(1)}`} />
      <circle class={solved ? 'ga-fgood' : 'ga-fk'} cx="120" cy="70" r="4" />
      <rect class="ga-w" x="8" y="99" width="34" height="24" rx="4" />
      <T x={25} y={115} a="middle" c="ga-tb">TX</T>
      <path class="ga-w ga-thin" d="M42 111H212V96M204 90L212 100L220 90" />
      <Arrow x1={60} y1={104} x2={180} y2={104} />
      <T x={120} y={99} a="middle" c="ga-ts">forward</T>
      {back > 0 && <Arrow x1={180} y1={119} x2={180 - back} y2={119} c="ga-bad" />}
      <T x={60} y={134} c={solved ? 'ga-tk ga-tb' : 'ga-tm'}>{pct === 0 ? 'nothing reflected' : `reflected: ${pct}%`}</T>
      <T x={232} y={134} a="end" c="ga-tm">{`antenna ${value} Ω`}</T>
    </Art>
  );
}

/** A transmitter facing a 4:1 mismatch: after the activity it has turned its power down. T7C05 */
function Foldback({ solved }: PicProps) {
  return (
    <Art label={solved
      ? 'A transmitter connected to an antenna with an SWR of 4 to 1. It has reduced its forward power, so less power is reflected back into its output transistors.'
      : 'A transmitter connected to an antenna with an SWR of 4 to 1. Forward power goes out, and a large reflected arrow comes back into the output transistors of the transmitter.'}>
      <T x={58} y={20} a="middle" c="ga-tm">transmitter</T>
      <rect class="ga-fk ga-soft" x="12" y="28" width="92" height="56" rx="6" />
      <rect class={solved ? 'ga-good' : 'ga-k'} x="12" y="28" width="92" height="56" rx="6" />
      <T x={58} y={52} a="middle" c="ga-tb">output</T>
      <T x={58} y={68} a="middle" c="ga-tb">transistors</T>
      <path class="ga-w ga-thin" d="M104 56H206V34M198 28L206 38L214 28" />
      <T x={206} y={20} a="middle" c="ga-tb">SWR 4:1</T>
      <Arrow x1={114} y1={46} x2={solved ? 150 : 190} y2={46} c={solved ? 'ga-s' : 'ga-s ga-thick'} h={solved ? 6 : 8} />
      <Arrow x1={190} y1={68} x2={solved ? 164 : 114} y2={68} c={solved ? 'ga-bad' : 'ga-bad ga-thick'} h={solved ? 6 : 8} />
      <T x={150} y={90} a="middle" c="ga-tm">{solved ? 'less comes back' : 'reflected power'}</T>
      <T x={120} y={124} a="middle" c={solved ? 'ga-tk ga-tb' : 'ga-tb'}>{solved ? 'power turned down: transistors safe' : 'full power into a bad match'}</T>
    </Art>
  );
}

/** What an antenna analyzer shows: SWR against frequency, with a marker. `value` is tenths of a MHz. T7C02 */
function SweepCurve({ value = 1440, solved }: PicProps) {
  const X = (v: number) => 24 + ((v - 1440) / 40) * 192;
  const Y = (s: number) => 104 - (s - 1) * 28;
  let d = '';
  for (let v = 1440; v <= 1480; v += 1) d += `${v === 1440 ? 'M' : 'L'}${X(v).toFixed(1)} ${Y(sweep(v)).toFixed(1)}`;
  const x = X(value);
  const y = Y(sweep(value));
  return (
    <Art label={`An antenna analyzer screen: a curve of SWR against frequency from 144 to 148 megahertz. The curve dips to its lowest point at 146.4 megahertz. A marker sits at ${f1(value)} megahertz, where the SWR is ${sweep(value).toFixed(1)} to 1.`}>
      <path class="ga-w ga-thin" d={`M24 14V104H216${[1, 2, 3].map((s) => `M20 ${Y(s)}H24`).join('')}${[1440, 1450, 1460, 1470, 1480].map((v) => `M${X(v)} 104V108`).join('')}`} />
      {[1, 2, 3].map((s) => <T x={15} y={Y(s) + 4} a="middle" c="ga-tm">{s}</T>)}
      <T x={30} y={20} c="ga-tm">SWR</T>
      {[1440, 1460, 1480].map((v) => <T x={X(v)} y={121} a="middle" c="ga-tm">{v / 10}</T>)}
      <T x={120} y={134} a="middle" c="ga-tm">frequency in MHz</T>
      <path class="ga-s" d={d} />
      <path class={`${solved ? 'ga-good' : 'ga-k'} ga-thin ga-dash`} d={`M${x.toFixed(1)} ${(y + 7).toFixed(1)}V104`} />
      <circle class={solved ? 'ga-good' : 'ga-k'} cx={x.toFixed(1)} cy={y.toFixed(1)} r="5" />
      {solved && <T x={X(1464)} y={62} a="middle" c="ga-tk ga-tb">resonant here</T>}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconMeter = () => <Mini><path class="ls-mw" d="M6 34A18 18 0 0 1 42 34" /><path class="ls-mk" d="M24 34L11 21" /><path class="ls-mw ls-mthin" d="M4 40H44" /></Mini>;
const IconShield = () => <Mini><path class="ls-mk" d="M24 5L40 11V24C40 33 33 40 24 43C15 40 8 33 8 24V11Z" /><path class="ls-ms" d="M17 24L22 29L31 18" /></Mini>;
const IconTools = () => <Mini><rect class="ls-mk" x="5" y="8" width="38" height="28" rx="3" /><path class="ls-ms" d="M10 14C16 34 22 34 24 28S32 16 38 14" /><path class="ls-mw ls-mthin" d="M16 42H32" /></Mini>;
const IconDummy = () => <Mini><path class="ls-mk" d="M4 30H10L13 22L19 38L25 22L31 38L35 30H44" /><path class="ls-ms ls-mthin" d="M14 14C12 11 16 9 14 6M24 14C22 11 26 9 24 6M34 14C32 11 36 9 34 6" /></Mini>;
const IconLoss = () => <Mini><path class="ls-ms" d="M4 20H40M34 14L40 20L34 26" /><path class="ls-mk ls-mthin" d="M14 38C12 35 16 33 14 30M24 38C22 35 26 33 24 30" /><path class="ls-mw ls-mthin" d="M4 44H44" /></Mini>;
const IconWater = () => <Mini><path class="ls-mk" d="M24 5C17 15 13 20 13 26A11 11 0 0 0 35 26C35 20 31 15 24 5Z" /><path class="ls-mw" d="M4 43H44" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't7c-swr',
  title: 'SWR and antenna measurements',
  blurb: 'What an SWR reading tells you, the tools that measure it, and how to look after your coax.',
  sub: 'T7',
  groups: ['T7C'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'swr',
      intro: 'Start with a one-minute clip. After it you will try each idea yourself.',
      covers: ['T7C04', 'T7C05', 'T7C06', 'T7C08'],
    },
    {
      type: 'card',
      id: 'match',
      idea: 'What an SWR reading means',
      covers: ['T7C04', 'T7C06'],
      picture: { draw: MatchMeter },
      heading: 'SWR tells you how good the match is',
      text: [
        'Impedance is how strongly a cable or an antenna opposes radio-frequency current. It is measured in ohms. Most ham feed lines are 50 ohms. If the antenna is 50 ohms too, the two are matched and the antenna takes all the power.',
        'If they differ, part of the power is reflected back toward the radio. SWR, the standing wave ratio, measures this. A reading of 1:1 is a perfect match. A higher first number, such as 4:1, means an impedance mismatch.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'This antenna is 200 ohms on a 50 ohm feed line. Change the antenna until the meter shows a perfect match.',
        label: 'Antenna impedance',
        min: 25,
        max: 200,
        step: 25,
        start: 200,
        readouts: (v) => [{ label: 'Antenna', value: `${v} Ω` }, { label: 'SWR', value: ratio(swrOf(v)) }],
        goal: (v) => v === 50,
        hint: (v) => (v > 50
          ? `SWR ${ratio(swrOf(v))}: still a mismatch. The antenna is more than 50 ohms. Bring it down.`
          : `SWR ${ratio(swrOf(v))}: a mismatch again. The antenna is now less than 50 ohms. Bring it back up.`),
        done: 'There: 50 ohms meets 50 ohms. The meter reads 1:1, a perfect match, and nothing is reflected. You started at 4:1, an impedance mismatch.',
      },
      remember: 'An SWR reading of 1:1 indicates a perfect impedance match between the antenna and the feed line. A reading of 4:1 indicates an impedance mismatch.',
    },
    {
      type: 'card',
      id: 'protect',
      idea: 'Why transmitters cut power at high SWR',
      covers: ['T7C05'],
      picture: { draw: Foldback },
      heading: 'High SWR makes your radio turn itself down',
      text: [
        'Solid-state means built with transistors. The last stage of a modern transmitter is an RF output amplifier made of power transistors, and they are the parts a bad match puts under stress.',
        'So most solid-state transmitters watch the SWR. When it rises beyond a certain level they reduce their output power. Why it matters on the air: with a poor antenna match your radio may be putting out far less power than you set.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'The SWR climbs to 4:1 and your 50 watt radio drops to a few watts by itself. Why?',
        options: [
          { id: 'fcc', label: 'An FCC rule requires less power at high SWR', why: 'There is no such rule. The radio does this by itself, for its own safety.' },
          { id: 'fix', label: 'Lower power brings the SWR down', why: 'SWR depends on the match between antenna and feed line. Turning the power down does not change it.' },
          { id: 'prot', label: 'To protect its RF output transistors', right: true, why: 'Yes. The transmitter reduces power to protect the RF output amplifier transistors.' },
        ],
      },
      remember: 'Most solid-state transmitters reduce output power as SWR increases, to protect the RF output amplifier transistors.',
    },
    {
      type: 'card',
      id: 'measure',
      idea: 'Instruments that measure SWR',
      covers: ['T7C08'],
      picture: { art: 'directional-wattmeter' },
      heading: 'Two instruments can tell you the SWR',
      text: [
        'An SWR meter goes in the feed line between the radio and the antenna and shows the SWR directly.',
        'A directional wattmeter goes in the same place. A wattmeter measures power, and directional means it can measure the power going each way: forward to the antenna, and reflected back from it. The SWR is worked out from those two readings.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You have no SWR meter. Which of these could you still use to determine your SWR?',
        options: [
          { id: 'volt', label: 'A voltmeter', why: 'A voltmeter measures voltage between two points. It cannot tell forward power from reflected power.' },
          { id: 'watt', label: 'A directional wattmeter', right: true, why: 'Yes. It measures forward and reflected power, and those two readings give the SWR.' },
          { id: 'ohm', label: 'An ohmmeter', why: 'An ohmmeter measures resistance with no power applied. It says nothing about reflected power.' },
        ],
      },
      remember: 'A directional wattmeter can be used to determine SWR.',
    },
    {
      type: 'card',
      id: 'analyzer',
      idea: 'The antenna analyzer finds resonance',
      covers: ['T7C02'],
      picture: { draw: SweepCurve },
      heading: 'An antenna analyzer finds where the antenna is resonant',
      text: [
        'An antenna is resonant at the frequency it is the right length for. That is where it accepts power best, so the SWR is usually lowest there.',
        'An antenna analyzer is a small instrument you connect in place of the radio. It tries one frequency after another and shows the SWR at each, so you can see whether the antenna is resonant on the frequency you want to use.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'You are the analyzer. Move across the 2 meter band and find the frequency where this antenna is resonant.',
        label: 'Frequency',
        min: 1440,
        max: 1480,
        step: 2,
        start: 1440,
        readouts: (v) => [{ label: 'Frequency', value: `${f1(v)} MHz` }, { label: 'SWR', value: `${sweep(v).toFixed(1)}:1` }],
        goal: (v) => v === 1464,
        hint: (v) => (v < 1464
          ? `SWR ${sweep(v).toFixed(1)}:1 and falling as you go up. Keep raising the frequency.`
          : `SWR ${sweep(v).toFixed(1)}:1. You have passed the lowest point. Come back down.`),
        done: 'There: the SWR is lowest at 146.4 MHz. That is where this antenna is resonant. If you wanted a different frequency, you would adjust the antenna and measure again.',
      },
      remember: 'An antenna analyzer is used to determine if an antenna is resonant at the desired operating frequency.',
    },
    {
      type: 'card',
      id: 'dummy',
      idea: 'The dummy load',
      covers: ['T7C01', 'T7C03'],
      picture: { art: 'dummy-load' },
      heading: 'A dummy load lets you test without going on the air',
      text: [
        'Sometimes you need to transmit just to test or adjust your radio. Doing that into an antenna would put a signal on the air and could interfere with others. A dummy load is connected in place of the antenna and turns the power into heat instead.',
        'A typical one is a 50 ohm resistor mounted on a heat sink, a block of metal fins that carries the heat away. The resistor is non-inductive: it is built to act as a plain resistance at radio frequencies, so the transmitter sees a good 50 ohm match.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You have repaired your transmitter and want to check its power output. Nobody should hear the test. What do you connect to it?',
        options: [
          { id: 'ant', label: 'Your antenna, on a quiet frequency', why: 'An antenna radiates whatever it is given. The test would still go out over the air.' },
          { id: 'dummy', label: 'A dummy load', right: true, why: 'Yes. Its purpose is to prevent transmitting signals over the air when making tests.' },
          { id: 'none', label: 'Nothing at all', why: 'With nothing connected there is no match at all, and the transmitter could be damaged. Give it a 50 ohm load.' },
        ],
      },
      remember: 'A dummy load prevents transmitting signals over the air when making tests. It is typically a 50 ohm non-inductive resistor mounted on a heat sink.',
    },
    {
      type: 'card',
      id: 'loss',
      idea: 'Feed line loss becomes heat',
      covers: ['T7C07', 'T7C11'],
      picture: { art: 'feed-line-loss' },
      heading: 'Power lost in the feed line turns into heat',
      text: [
        'Even with a perfect match, not all of your power reaches the antenna. Every foot of coax takes a little, and the power that is lost is converted into heat in the cable.',
        'The dielectric is the insulation between the center wire and the shield of coaxial cable. It can be solid plastic or a foam full of tiny bubbles. Foam-dielectric cable has less loss per foot than solid-dielectric cable.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You need a long run of coax and want as much power as possible to reach the antenna. Which dielectric do you pick?',
        options: [
          { id: 'solid', label: 'Solid dielectric', why: 'Solid dielectric loses more per foot, so more of your power would end up as heat in the cable.' },
          { id: 'foam', label: 'Foam dielectric', right: true, why: 'Yes. Foam-dielectric coax has less loss per foot than solid-dielectric coax.' },
          { id: 'same', label: 'It makes no difference', why: 'It does. The dielectric is one of the places where power is lost, and foam loses less.' },
        ],
      },
      remember: 'Power lost in a feed line is converted into heat. Foam-dielectric coax has less loss per foot than solid-dielectric coax.',
    },
    {
      type: 'card',
      id: 'water',
      idea: 'Water and sunlight ruin coax',
      covers: ['T7C09', 'T7C10'],
      picture: { art: 'moisture-contamination' },
      heading: 'Keep water out of your coax',
      text: [
        'Coax usually fails because of moisture contamination: water gets inside the cable. Once it is in, the loss goes up and the cable has to be replaced.',
        'The outer jacket is what keeps water out, and sunlight is its enemy. Ultraviolet light can damage the jacket until it cracks, and the cracks allow water to enter the cable. That is why outdoor coax should have a jacket that resists ultraviolet light.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'After years on the roof, the jacket of your coax is faded and cracked by the sun. What is the real danger?',
        options: [
          { id: 'res', label: 'The sun has changed the copper inside', why: 'Sunlight never reaches the conductors. The harm is to the jacket around them.' },
          { id: 'water', label: 'Water can now get into the cable', right: true, why: 'Yes. Ultraviolet light damages the jacket and lets water in, and moisture contamination makes coax fail.' },
          { id: 'mix', label: 'Sunlight will mix with your signal', why: 'Light and radio signals do not mix in a cable. The problem is water getting through the cracks.' },
        ],
      },
      remember: 'Moisture contamination causes coaxial cable to fail. The jacket should resist ultraviolet light, which can damage it and allow water to enter the cable.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T7C01', 'T7C02', 'T7C04', 'T7C05', 'T7C06', 'T7C09'],
      questions: [
        {
          q: 'Your SWR meter reads 1:1. What does that tell you?',
          review: 'match',
          covers: ['T7C04', 'T7C06'],
          choices: [
            { label: 'The antenna and the feed line are perfectly matched', right: true, why: '1:1 is a perfect impedance match. No power is reflected.' },
            { label: 'Half the power is being reflected', why: 'At 1:1 nothing is reflected. Reflected power shows up as a higher first number, such as 4:1.' },
            { label: 'No power is leaving the transmitter', why: 'The meter shows the match, not the amount of power. 1:1 is the best reading there is.' },
          ],
        },
        {
          q: 'Your radio is set to 50 watts but puts out much less, and the SWR is very high. What is the radio doing?',
          review: 'protect',
          covers: ['T7C05'],
          choices: [
            { label: 'Saving battery power', why: 'This is not about the battery. The radio is reacting to the high SWR.' },
            { label: 'Protecting its output transistors', right: true, why: 'Most solid-state transmitters reduce power when SWR is high, to protect the RF output amplifier transistors.' },
            { label: 'Trying to lower the SWR', why: 'Less power does not change the SWR. Only a better match between antenna and feed line does.' },
          ],
        },
        {
          q: 'You have built a new antenna and want to know whether it is resonant on the frequency you plan to use. Which tool tells you?',
          review: 'analyzer',
          covers: ['T7C02'],
          choices: [
            { label: 'A dummy load', why: 'A dummy load replaces the antenna for testing a transmitter. It tells you nothing about the antenna.' },
            { label: 'A longer feed line', why: 'More feed line only adds loss. It does not measure anything.' },
            { label: 'An antenna analyzer', right: true, why: 'An antenna analyzer shows whether an antenna is resonant at the desired operating frequency.' },
          ],
        },
        {
          q: 'You want to transmit for a minute to adjust your radio, without sending a signal over the air. Where should the power go?',
          review: 'dummy',
          covers: ['T7C01'],
          choices: [
            { label: 'Into a dummy load', right: true, why: 'A dummy load takes the power in place of the antenna and turns it into heat, so nothing goes over the air.' },
            { label: 'Into the antenna, at low power', why: 'Low power is still a signal on the air. A dummy load keeps the test off the air.' },
            { label: 'Into an antenna analyzer', why: 'An analyzer is a measuring instrument for antennas. It is not built to absorb transmitter power.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T7C01', 'T7C02', 'T7C03', 'T7C04', 'T7C05', 'T7C06', 'T7C07', 'T7C08', 'T7C09', 'T7C10', 'T7C11'],
      facts: [
        { icon: IconMeter, text: 'SWR 1:1 is a perfect impedance match between antenna and feed line. A reading such as 4:1 is an impedance mismatch.', covers: ['T7C04', 'T7C06'] },
        { icon: IconShield, text: 'Most solid-state transmitters reduce power as SWR rises, to protect the RF output amplifier transistors.', covers: ['T7C05'] },
        { icon: IconTools, text: 'A directional wattmeter can determine SWR. An antenna analyzer shows whether an antenna is resonant at the desired frequency.', covers: ['T7C02', 'T7C08'] },
        { icon: IconDummy, text: 'A dummy load, a 50 ohm non-inductive resistor on a heat sink, prevents transmitting signals over the air when making tests.', covers: ['T7C01', 'T7C03'] },
        { icon: IconLoss, text: 'Power lost in a feed line is converted into heat. Foam-dielectric coax has less loss per foot than solid-dielectric coax.', covers: ['T7C07', 'T7C11'] },
        { icon: IconWater, text: 'Moisture contamination makes coax fail. Ultraviolet light can damage the jacket and allow water to enter the cable.', covers: ['T7C09', 'T7C10'] },
      ],
    },
  ],
};
export default LESSON;
