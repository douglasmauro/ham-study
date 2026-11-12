import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * RF exposure (question group T0C, all 13 questions).
 * Every exam fact comes from a T0C question and its keyed answer; the ids are in each step's
 * `covers`. No exposure-limit values are shown: the pool gives none. Pictures are sketches,
 * not to scale. Facts added beyond the pool (listed in the report): X-rays are ionizing;
 * exposure falls quickly with distance; the body absorbs RF best where its size suits the wave.
 */

/* ---------- picture helpers ---------- */

const r1 = (v: number) => +v.toFixed(1);

/** A stick figure standing on (x, y), about 38 units tall. Same shape as the glossary's. */
function Person({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) {
  return <path class={c} d={`M${x - 5} ${y - 33}a5 5 0 1 0 10 0a5 5 0 1 0 -10 0M${x} ${y - 28}V${y - 12}M${x - 8} ${y - 17}L${x} ${y - 24}L${x + 8} ${y - 17}M${x - 6} ${y}L${x} ${y - 12}L${x + 6} ${y}`} />;
}

/** An arc of radius r centred on (cx, cy), opening to the right, spanning +-half radians. */
function sweep(cx: number, cy: number, r: number, half: number): string {
  const dx = r * Math.cos(half), dy = r * Math.sin(half);
  return `M${r1(cx + dx)} ${r1(cy - dy)}A${r} ${r} 0 0 1 ${r1(cx + dx)} ${r1(cy + dy)}`;
}

/* ---------- pictures ---------- */

/** A beam antenna with its pattern: one person in front of it, one behind. Either person can be tapped. T0C04 */
function BeamPattern({ picked, solved, onPick }: PicProps) {
  const tone = (id: string) => (picked !== id ? 'ga-w' : id === 'front' && solved ? 'ga-good' : 'ga-bad');
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  return (
    <Art label="A beam antenna on a short mast. Its radiation pattern is a long lobe pointing to the right and only a small lobe to the left. One person stands in front of the beam, inside the long lobe. Another stands behind it.">
      <path class="ga-w ga-thin" d="M8 112H232" />
      <path class="ga-fs ga-soft" d="M128 78C160 48 214 52 222 78C214 104 160 108 128 78Z" />
      <path class="ga-s" d="M128 78C160 48 214 52 222 78C214 104 160 108 128 78Z" />
      <path class="ga-s ga-thin" d="M92 78C84 72 72 72 72 78C72 84 84 84 92 78Z" />
      <path class="ga-k ga-thick" d="M110 112V78M92 78H128" />
      <path class="ga-k" d="M96 68V88M108 70V86M120 72V84" />
      <Person x={184} y={112} c={`${tone('front')} ga-thick`} />
      <Person x={40} y={112} c={`${tone('back')} ga-thick`} />
      <T x={184} y={24} a="middle" c="ga-tb">in front</T>
      <T x={184} y={40} a="middle" c="ga-tm">inside the beam</T>
      <T x={40} y={24} a="middle" c="ga-tb">behind</T>
      <T x={40} y={40} a="middle" c="ga-tm">the antenna</T>
      <T x={120} y={132} a="middle" c="ga-ts">the beam points to the right</T>
      {onPick && <rect x="158" y="60" width="52" height="56" style={hit} onClick={() => onPick('front')} />}
      {onPick && <rect x="14" y="60" width="52" height="56" style={hit} onClick={() => onPick('back')} />}
    </Art>
  );
}

const STRONG_UNTIL = 4; // slider positions 1 to 4 stand in the strong field
const personX = (v: number) => 30 + v * 19;
const exposureWord = (v: number) => (v <= 2 ? 'very high' : v <= STRONG_UNTIL ? 'high' : v <= 6 ? 'lower' : 'low');

/** An antenna, its field fading with distance, and a person the slider moves. `value` is the distance in steps. T0C04, T0C08 */
function Distance({ value = 1, solved }: PicProps) {
  const x = personX(value);
  const bar = Math.max(3, 96 / (value * value));
  const inside = value <= STRONG_UNTIL;
  return (
    <Art label={`An antenna with radio waves spreading out, drawn heavy close to it and faint farther away. A person stands ${value} steps away, ${inside ? 'inside the strong field near the antenna' : 'outside the strong field'}. A bar at the top shows their exposure: ${exposureWord(value)}.`}>
      <rect class="ga-fs ga-soft" x="24" y="44" width="92" height="68" />
      <T x={70} y={130} a="middle" c="ga-ts ga-tb">strong field</T>
      <path class="ga-w ga-thin" d="M8 112H232" />
      <path class="ga-w ga-thick" d="M24 112V40" />
      <path class="ga-s ga-thick" d={sweep(24, 62, 16, 0.6) + sweep(24, 62, 30, 0.6)} />
      <path class="ga-s" d={sweep(24, 62, 64, 0.5)} />
      <path class="ga-s ga-thin" d={sweep(24, 62, 98, 0.42)} />
      <path class="ga-s ga-thin ga-soft" d={sweep(24, 62, 132, 0.36) + sweep(24, 62, 164, 0.3)} />
      <Person x={x} y={112} c={`${solved ? 'ga-good' : inside ? 'ga-k' : 'ga-w'} ga-thick`} />
      <T x={132} y={20} c="ga-tm">exposure</T>
      <rect class="ga-w ga-thin" x="132" y="26" width="98" height="10" />
      <rect class={inside ? 'ga-fbad' : 'ga-fgood'} x="133" y="27" width={r1(bar)} height="8" />
      {!inside && <T x={Math.min(x, 188)} y={132} a="middle" c="ga-tm">{`${value} steps away`}</T>}
    </Art>
  );
}

/** Transmissions along a time line across the averaging time, with the average marked. `value` is the duty cycle in percent. T0C03, T0C10, T0C11 */
function DutyBars({ value = 100, solved }: PicProps) {
  const top = 46, base = 92, x0 = 64, slot = 39;
  const on = (slot * value) / 100;
  const avg = base - ((base - top) * value) / 100;
  return (
    <Art label={`A time line across one averaging time, split into four stretches. The transmitter is on for ${value} percent of each stretch and off for the rest. Every transmission reaches the same peak. A dashed line shows the average, which sits at ${value} percent of the peak.`}>
      <path class="ga-w ga-thin" d={`M${x0} 26V20H220V26`} />
      <T x={142} y={14} a="middle" c="ga-tm">one averaging time</T>
      {[0, 1, 2, 3].map((i) => <rect class="ga-fs" x={r1(x0 + i * slot)} y={top} width={r1(Math.max(on, 1))} height={base - top} />)}
      <path class="ga-w" d={`M${x0} ${base}H220`} />
      <path class={`${solved ? 'ga-good' : 'ga-k'} ga-thick ga-dash`} d={`M${x0} ${r1(avg)}H220`} />
      <T x={8} y={r1(avg) + 4} c="ga-tk ga-tb">average</T>
      <T x={x0} y={40} c="ga-ts">each burst: the same peak</T>
      <T x={x0} y={108} c="ga-tm">time</T>
      <T x={142} y={130} a="middle" c="ga-tk ga-tb">{`on the air ${value}% of the time`}</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconAtom = () => <Mini><circle class="ls-mw" cx="24" cy="24" r="6" /><circle class="ls-mw ls-mthin" cx="24" cy="24" r="16" /><path class="ls-ms" d="M2 40C6 32 10 32 14 40S22 48 26 40" /></Mini>;
const IconDistance = () => <Mini><path class="ls-mk" d="M8 42V8" /><path class="ls-ms ls-mthin" d="M14 16A10 10 0 0 1 14 32M20 10A18 18 0 0 1 20 38" /><path class="ls-mw" d="M38 18a3 3 0 1 0 0.1 0M38 24V34M33 42L38 34L43 42" /></Mini>;
const IconBars = () => <Mini><rect class="ls-mw" x="6" y="12" width="8" height="28" /><rect class="ls-mk" x="20" y="32" width="8" height="8" /><rect class="ls-mw" x="34" y="20" width="8" height="20" /></Mini>;
const IconDuty = () => <Mini><path class="ls-ms" d="M4 36V14H14V36H24V14H34V36H44" /><path class="ls-mk ls-mthin" d="M4 26H44" /></Mini>;
const IconCheck = () => <Mini><rect class="ls-mw" x="8" y="6" width="32" height="38" rx="3" /><path class="ls-mk" d="M15 18L19 22L27 14M15 32L19 36L27 28" /></Mini>;
const IconHand = () => <Mini><path class="ls-mk" d="M24 4V30" /><path class="ls-mw" d="M14 44V30C14 26 20 26 20 30V36" /><path class="ls-ms ls-mthin" d="M30 10L36 6M30 18L38 18" /></Mini>;

/* ---------- the lesson ---------- */

export const T0C_RF_EXPOSURE: Lesson = {
  id: 't0c-rf-exposure',
  title: 'RF exposure',
  blurb: 'Why strong radio energy can harm you, what makes exposure higher or lower, and how to keep everyone near your station safe.',
  sub: 'T0',
  groups: ['T0C'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t0c-rf-exposure',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T0C01', 'T0C04', 'T0C02', 'T0C10', 'T0C07', 'T0C13'],
    },
    {
      type: 'card',
      id: 'kinds',
      idea: 'RF is non-ionizing, but it heats',
      covers: ['T0C01', 'T0C12'],
      picture: { art: 'non-ionizing-radiation' },
      heading: 'Two families of radiation',
      text: [
        'Ionizing radiation, such as X-rays and the rays from radioactive material, carries enough energy to knock electrons off atoms. It can cause chemical changes in cells and damage DNA.',
        'Radio signals are non-ionizing: they do not have that much energy, however strong they are. That does not make them harmless. Strong RF heats body tissue, the way a microwave oven heats food.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Put each one in its family. Tap an item, then tap the family.',
        slots: [
          { id: 'ion', label: 'Ionizing', sub: 'can damage DNA', rule: 'Ionizing radiation has enough energy to change cells and damage DNA. Radio signals do not.' },
          { id: 'non', label: 'Non-ionizing', sub: 'cannot damage DNA', rule: 'Non-ionizing radiation is too weak to strip electrons. Radioactive rays and X-rays are not in this family.' },
        ],
        items: [
          { id: 'hand', label: 'Your handheld radio\'s signal', slot: 'non', why: 'Radio signals are non-ionizing. They still heat tissue if they are strong enough.' },
          { id: 'rad', label: 'Radioactive material', slot: 'ion', why: 'Radioactivity is ionizing. It can cause chemical changes in cells and damage DNA.' },
          { id: 'hf', label: 'A strong 14 MHz signal', slot: 'non', why: 'Even a powerful radio signal is non-ionizing. Its danger is heating, not DNA damage.' },
          { id: 'xray', label: 'An X-ray', slot: 'ion', why: 'X-rays are ionizing. They have enough energy to knock electrons off atoms.' },
        ],
      },
      remember: 'Radio signals are non-ionizing radiation: they cannot cause chemical changes in cells or damage DNA. They are not perfectly safe, because strong RF heats body tissue.',
    },
    {
      type: 'card',
      id: 'factors',
      idea: 'What sets a person\'s exposure',
      covers: ['T0C04'],
      picture: { draw: BeamPattern },
      heading: 'Four things set how much RF reaches a person',
      text: [
        'RF exposure is how much radio energy reaches a person. It depends on the power level, the frequency, the distance from the antenna, and the antenna\'s radiation pattern.',
        'The radiation pattern is the shape of where an antenna sends its energy. A beam antenna sends most of it one way, so where a person stands around it matters.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Both people are the same distance from the antenna. Which one gets more RF? Tap a person, or tap an answer.',
        options: [
          { id: 'back', label: 'The person behind the antenna', why: 'Behind the beam there is only a small lobe. Most of the energy goes the other way.' },
          { id: 'front', label: 'The person in front of the beam', right: true, why: 'Yes. They stand inside the long lobe, where the antenna sends most of its energy.' },
        ],
      },
      remember: 'RF exposure depends on the frequency and power level of the RF field, the distance from the antenna, and the antenna\'s radiation pattern.',
    },
    {
      type: 'card',
      id: 'distance',
      idea: 'Distance cuts exposure',
      covers: ['T0C04', 'T0C08'],
      picture: { draw: Distance },
      heading: 'Distance is your friend',
      text: [
        'The field is strongest right next to the antenna and weakens quickly as you move away. The antenna is the part that radiates, not the radio box on your desk.',
        'So to cut the RF reaching people, move the antenna: higher, or farther from where people sit and walk. Moving the transmitter while the antenna stays put changes nothing.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Move the person away from the antenna until they are out of the strong field.',
        label: 'Distance',
        min: 1,
        max: 10,
        step: 1,
        start: 1,
        readouts: (v) => [{ label: 'Distance', value: `${v} ${v === 1 ? 'step' : 'steps'}` }, { label: 'Exposure', value: exposureWord(v) }],
        goal: (v) => v > STRONG_UNTIL,
        hint: () => 'Still inside the strong field next to the antenna. Move farther away.',
        done: 'Out of the strong field. Each step back lowered the exposure. How far is far enough depends on power, frequency and the antenna, which is what an evaluation works out.',
      },
      remember: 'To reduce RF exposure, relocate antennas: higher, or farther from people.',
    },
    {
      type: 'card',
      id: 'frequency',
      idea: 'The limit depends on frequency',
      covers: ['T0C02', 'T0C05'],
      picture: { art: 'mpe' },
      heading: 'The body soaks up some frequencies more',
      text: [
        'The FCC sets a maximum permissible exposure, or MPE: the most RF a person may be exposed to. It is not the same at every frequency.',
        'Your body takes in RF energy better at some frequencies than others, a bit like an antenna that works best on the wave that fits its size. Where the body absorbs the most, the limit is strictest. Of 3.5, 50, 440 and 1296 MHz, that is 50 MHz.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Why is the exposure limit lowest at 50 MHz in the picture?',
        options: [
          { id: 'abs', label: 'The body absorbs more RF energy there', right: true, why: 'Yes. Limits vary because the body absorbs more RF at some frequencies than at others.' },
          { id: 'energy', label: 'Lower frequencies carry more energy', why: 'That is not the reason. The limits follow how well the body absorbs each frequency.' },
          { id: 'skin', label: 'Higher frequencies cannot enter the body', why: 'That is not why. The limits follow how much the body absorbs, and 1296 MHz has a higher limit than 50 MHz.' },
        ],
      },
      remember: 'Exposure limits vary with frequency because the body absorbs more RF energy at some frequencies than others. Of 3.5, 50, 440 and 1296 MHz, 50 MHz has the lowest limit.',
    },
    {
      type: 'card',
      id: 'duty',
      idea: 'Duty cycle and the average',
      covers: ['T0C03', 'T0C10', 'T0C11'],
      picture: { draw: DutyBars },
      heading: 'Duty cycle: how much of the time you transmit',
      text: [
        'Heating builds up over time, so exposure is averaged over a set period called the averaging time. Duty cycle is the percentage of that time the transmitter is transmitting.',
        'Transmit less of the time and the average exposure drops, even though each transmission is just as strong. Because the limits use the average, a lower duty cycle allows a higher power density, meaning a stronger field while you are on the air.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Lower the duty cycle from 100 percent to 50 percent and watch the average.',
        label: 'Duty cycle',
        min: 10,
        max: 100,
        step: 10,
        start: 100,
        readouts: (v) => [{ label: 'Duty cycle', value: `${v}%` }, { label: 'Average exposure', value: `${v}%` }],
        goal: (v) => v === 50,
        hint: (v) => (v > 50 ? 'Still more than half the time. Lower the duty cycle.' : 'That is below half. Raise it back to 50 percent.'),
        done: 'At 50 percent you are on the air half the time, so the average is half. The peak did not change. Going from 100 to 50 percent doubles the allowable power density.',
      },
      remember: 'Duty cycle is the percentage of time a transmitter is transmitting. It affects the average exposure. From 100 to 50 percent, the allowable power density increases by a factor of 2.',
    },
    {
      type: 'card',
      id: 'evaluate',
      idea: 'Evaluate your station, and redo it after changes',
      covers: ['T0C06', 'T0C09', 'T0C13'],
      picture: { art: 'rf-exposure-evaluation' },
      heading: 'Checking your station is your job',
      text: [
        'You, the station licensee, must make sure no one is exposed to RF above the FCC limits. The FCC sets the limits but does not check your station. Check it by calculation based on FCC OET Bulletin 65, by computer modeling, or by measuring field strength with calibrated equipment.',
        'A check is only good for the station as it was. Change anything in the transmitter or antenna system and the fields change too.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You add an amplifier and move your antenna closer to the patio. What should you do?',
        options: [
          { id: 'fcc', label: 'Tell the FCC about the change', why: 'You do not report station changes to the FCC. Keeping the station within the limits is up to you.' },
          { id: 'swr', label: 'Check that the SWR is still low', why: 'SWR only shows how well the antenna matches the feed line. It says nothing about exposure.' },
          { id: 'redo', label: 'Evaluate the station again', right: true, why: 'Yes. Re-evaluate whenever an item in the transmitter or antenna system changes.' },
        ],
      },
      remember: 'Evaluate by calculation (FCC OET Bulletin 65), computer modeling or calibrated measurement. Re-evaluate after any transmitter or antenna change. The licensee is responsible.',
    },
    {
      type: 'card',
      id: 'burn',
      idea: 'Never touch a transmitting antenna',
      covers: ['T0C07'],
      picture: { art: 'rf-burn' },
      heading: 'Touching a transmitting antenna burns',
      text: [
        'While you transmit, RF current flows on the antenna. Skin that touches it takes that current through one small spot, which heats fast. The result is an RF burn, painful and sometimes deep.',
        'Never touch an antenna while it is transmitting, and do not transmit while anyone could touch it.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You are on the air when a friend reaches out to straighten your antenna. What is the danger to them?',
        options: [
          { id: 'none', label: 'None, because RF is non-ionizing', why: 'Non-ionizing does not mean safe. RF current at the point of contact heats the skin and burns it.' },
          { id: 'burn', label: 'An RF burn to their skin', right: true, why: 'Yes. Stop transmitting before anyone touches the antenna.' },
          { id: 'ion', label: 'Ionizing radiation from the antenna', why: 'An antenna does not give off ionizing radiation. The danger is a burn from heating.' },
        ],
      },
      remember: 'Touching an antenna during a transmission can cause an RF burn to the skin.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T0C01', 'T0C12', 'T0C04', 'T0C08', 'T0C03', 'T0C10', 'T0C11', 'T0C13'],
      questions: [
        {
          q: 'A friend says radio waves are non-ionizing, so they are perfectly safe. What is right?',
          review: 'kinds',
          covers: ['T0C01', 'T0C12'],
          choices: [
            { label: 'They are right. RF cannot hurt you', why: 'RF is not perfectly safe. Strong RF heats body tissue, which is why there are exposure limits.' },
            { label: 'RF cannot damage DNA, but strong RF heats body tissue', right: true, why: 'Non-ionizing means no DNA damage, but heating is still a real hazard.' },
            { label: 'RF damages DNA, just like radioactivity', why: 'RF does not have enough energy to damage DNA. That is what non-ionizing means.' },
          ],
        },
        {
          q: 'Your family sits in the yard right in front of your beam antenna. Which change lowers the RF reaching them?',
          review: 'distance',
          covers: ['T0C04', 'T0C08'],
          choices: [
            { label: 'Move the radio to a room farther from the yard', why: 'The radio box is not what radiates. The antenna is, and it has not moved.' },
            { label: 'Move the antenna higher or farther from the yard', right: true, why: 'More distance between people and the antenna means less exposure.' },
            { label: 'Transmit for more of the time', why: 'More time on the air raises the average exposure.' },
          ],
        },
        {
          q: 'You used to transmit all the time. Now you transmit only half of each averaging period at the same power. What happens to the average exposure?',
          review: 'duty',
          covers: ['T0C03', 'T0C10', 'T0C11'],
          choices: [
            { label: 'It doubles', why: 'Less time on the air cannot raise the average. It lowers it.' },
            { label: 'It stays the same', why: 'The peak stays the same, but the average falls because you are off half the time.' },
            { label: 'It is cut in half', right: true, why: 'A 50 percent duty cycle gives half the average, which is why twice the power density is then allowed.' },
          ],
        },
        {
          q: 'Your antenna is near a neighbor\'s garden. Whose job is it to keep their RF exposure under the FCC limits?',
          review: 'evaluate',
          covers: ['T0C13'],
          choices: [
            { label: 'The FCC\'s', why: 'The FCC sets the limits, but it does not check each station.' },
            { label: 'The neighbor\'s', why: 'The neighbor cannot know when or how you transmit. It is not their job.' },
            { label: 'Yours, as the station licensee', right: true, why: 'The licensee controls the station, so the licensee is responsible.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T0C01', 'T0C02', 'T0C03', 'T0C04', 'T0C05', 'T0C06', 'T0C07', 'T0C08', 'T0C09', 'T0C10', 'T0C11', 'T0C12', 'T0C13'],
      facts: [
        { icon: IconAtom, text: 'RF is non-ionizing: it cannot cause chemical changes in cells or damage DNA. It is not perfectly safe, because strong RF heats body tissue.', covers: ['T0C01', 'T0C12'] },
        { icon: IconDistance, text: 'Exposure depends on power, frequency, distance and the antenna\'s radiation pattern. To reduce it, relocate antennas.', covers: ['T0C04', 'T0C08'] },
        { icon: IconBars, text: 'Limits vary with frequency because the body absorbs more RF at some frequencies. Of 3.5, 50, 440 and 1296 MHz, 50 MHz has the lowest limit.', covers: ['T0C02', 'T0C05'] },
        { icon: IconDuty, text: 'Duty cycle is the percentage of time a transmitter is transmitting. It affects the average exposure: from 100 to 50 percent, allowable power density doubles.', covers: ['T0C03', 'T0C10', 'T0C11'] },
        { icon: IconCheck, text: 'Evaluate by OET Bulletin 65 calculation, computer modeling or calibrated measurement, and again after any change. The licensee is responsible.', covers: ['T0C06', 'T0C09', 'T0C13'] },
        { icon: IconHand, text: 'Touching an antenna during a transmission can cause an RF burn.', covers: ['T0C07'] },
      ],
    },
  ],
};
export default T0C_RF_EXPOSURE;
