import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 17: Feed lines and connectors (question group T9B, all 12 questions).
 * Every exam fact below comes from a T9B question and its keyed answer; the ids are in each
 * step's `covers`. The pool gives no loss figures, so the loss picture is qualitative:
 * it shows the direction of the change (more loss at higher frequency), not amounts.
 */

/* ---------- pictures ---------- */

const FREQS = [7, 28, 50, 146, 440]; // MHz, one per slider position
const OUT = [19, 17, 15, 11, 6]; // height of the signal that comes out: illustrative only
const LOSS = ['lowest', 'low', 'higher', 'higher still', 'highest'];
const rangeOf = (mhz: number) => (mhz < 30 ? 'HF' : mhz < 300 ? 'VHF' : 'UHF');

/** The same coax at five frequencies: the signal that comes out gets thinner. `value` is 0 to 4. T9B05 */
function LossByFrequency({ value = 0, solved }: PicProps) {
  const out = OUT[value];
  return (
    <Art label={`A radio feeding an antenna through coaxial cable at ${FREQS[value]} megahertz. Some of the signal is lost as heat in the cable. The higher the frequency, the less comes out at the antenna.`}>
      <T x={60} y={14} c="ga-ts">signal in</T>
      <T x={186} y={14} a="end" c={solved ? 'ga-tk ga-tb' : 'ga-ts'}>what comes out</T>
      <path class="ga-fs" d={`M60 22L184 ${33 - out / 2}V${33 + out / 2}L60 44Z`} />
      <rect class="ga-w" x="14" y="58" width="40" height="26" rx="4" />
      <T x={34} y={75} a="middle">radio</T>
      <path class="ga-k ga-thick" d="M54 71H206" />
      <path class="ga-w" d="M206 71V46M196 46H216L206 58Z" />
      <T x={120} y={64} a="middle" c="ga-tk">the same coax</T>
      <path class="ga-s ga-thin" d={Array.from({ length: value + 1 }, (_, i) => `M${120 - value * 11 + i * 22} 82q4 5 0 10t0 10`).join('')} />
      <T x={120} y={126} a="middle" c="ga-ts ga-tb">lost as heat</T>
    </Art>
  );
}

/** Three feed lines seen end on, from most loss to least. Each can be tapped. T9B10, T9B11 */
function ThreeCables({ picked, solved, onPick }: PicProps) {
  const tone = (id: string) => (picked !== id ? 'ga-k' : id === 'c' && solved ? 'ga-good' : 'ga-bad');
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  const cables = [
    { id: 'a', x: 48, r: 9, dot: 2, name: 'RG-58', note: 'thin' },
    { id: 'b', x: 120, r: 16, dot: 3.5, name: 'RG-213', note: 'thick' },
    { id: 'c', x: 192, r: 22, dot: 5, name: 'hardline', note: 'air inside' },
  ];
  return (
    <Art label="Three feed lines seen end on. RG-58 is thin, RG-213 is thick, and air-insulated hardline is thickest with mostly air inside. Loss falls from RG-58 to RG-213 to hardline.">
      <T x={120} y={14} a="middle" c="ga-tm">less loss</T>
      <Arrow x1={70} y1={24} x2={170} y2={24} c="ga-w ga-thin" h={5} />
      {cables.map((c) => (
        <>
          <circle class={`${tone(c.id)}${c.id === 'c' ? ' ga-thick' : ''}`} cx={c.x} cy={66} r={c.r} />
          <circle class="ga-fs" cx={c.x} cy={66} r={c.dot} />
          <T x={c.x} y={108} a="middle" c="ga-tb">{c.name}</T>
          <T x={c.x} y={124} a="middle" c="ga-tm">{c.note}</T>
          {onPick && <rect x={c.x - 34} y="38" width="68" height="92" style={hit} onClick={() => onPick(c.id)} />}
        </>
      ))}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconCoax = () => <Mini><circle class="ls-mk" cx="24" cy="24" r="16" /><circle class="ls-mw ls-mthin" cx="24" cy="24" r="9" /><circle class="ls-ms" cx="24" cy="24" r="2" /></Mini>;
const IconLoss = () => <Mini><path class="ls-ms" d="M6 10V24L42 19V15Z" /><path class="ls-mk" d="M6 32H42" /><path class="ls-mw ls-mthin" d="M16 37q3 3 0 6M24 37q3 3 0 6M32 37q3 3 0 6" /></Mini>;
const IconPlug = () => <Mini><path class="ls-mw" d="M4 24H14" /><rect class="ls-mk" x="14" y="14" width="18" height="20" rx="2" /><path class="ls-mk ls-mthin" d="M20 14V34M26 14V34" /><path class="ls-ms" d="M32 24H44" /></Mini>;
const IconTape = () => <Mini><path class="ls-mw" d="M4 30H12M36 30H44" /><rect class="ls-mk" x="12" y="22" width="24" height="16" rx="8" /><path class="ls-ms ls-mthin" d="M12 6L9 14M24 6L21 14M36 6L33 14" /></Mini>;
const IconMatch = () => <Mini><path class="ls-ms" d="M4 16H38M32 10L38 16L32 22" /><path class="ls-mw" d="M38 34H12M18 28L12 34L18 40" /><path class="ls-mk ls-mthin" d="M44 6V42" /></Mini>;
const IconTuner = () => <Mini><path class="ls-mw" d="M2 24H12M36 24H46" /><rect class="ls-mk" x="12" y="12" width="24" height="24" rx="3" /><circle class="ls-mk ls-mthin" cx="24" cy="24" r="6" /><path class="ls-ms ls-mthin" d="M24 24L28 20" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't9b-feed-lines',
  title: 'Feed lines and connectors',
  blurb: 'The cable between your radio and your antenna: why coax, where signal is lost, and how to keep the match good.',
  sub: 'T9',
  groups: ['T9B'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t9b-feed-lines',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T9B01', 'T9B02', 'T9B03', 'T9B05', 'T9B08', 'T9B12'],
    },
    {
      type: 'card',
      id: 'coax',
      idea: 'Coax: easy to use, and 50 ohms',
      covers: ['T9B02', 'T9B03'],
      picture: { art: 'coaxial-cable' },
      heading: 'Coax is the feed line most hams use',
      text: [
        'A feed line carries your signal between the radio and the antenna. The most common kind is coaxial cable, or coax: a center wire, a layer of insulation, a metal shield around that, and a jacket outside.',
        'Coax is popular because it is easy to use and requires few special installation considerations. The shield keeps the signal inside, so the cable can run along a metal mast or through a wall. The most common impedance of coax in amateur radio is 50 ohms.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You must run a feed line down a metal mast and in past a window frame. Why is coax the usual choice for a job like this?',
        options: [
          { id: 'loss', label: 'It has less loss than any other feed line', why: 'Coax is not the lowest loss feed line. Other kinds lose less, but they are harder to install.' },
          { id: 'easy', label: 'It is easy to use and needs few special installation considerations', right: true, why: 'Yes. That convenience is why coax is the most common feed line.' },
          { id: 'cheap', label: 'It costs less than any other feed line', why: 'Price is not the reason. Coax is chosen because it is easy to install almost anywhere.' },
        ],
      },
      remember: 'Coaxial cable is the most common feed line because it is easy to use and requires few special installation considerations. Its most common impedance is 50 ohms.',
    },
    {
      type: 'card',
      id: 'frequency',
      idea: 'Loss in coax increases with frequency',
      covers: ['T9B05'],
      picture: { draw: LossByFrequency },
      heading: 'The higher the frequency, the more a cable loses',
      text: [
        'No feed line is perfect. On the way to the antenna, some of your signal turns to heat in the cable. That is feed line loss, and it weakens the signals you receive in the same way.',
        'The loss is not fixed. As the frequency of a signal in coaxial cable is increased, the loss increases. A cable that is fine on HF can waste a good part of your signal on UHF.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Raise the frequency to 440 MHz and watch what comes out of the same cable.',
        label: 'Frequency',
        min: 0,
        max: 4,
        step: 1,
        start: 0,
        readouts: (v) => [{ label: 'Frequency', value: `${FREQS[v]} MHz (${rangeOf(FREQS[v])})` }, { label: 'Loss in the cable', value: LOSS[v] }],
        goal: (v) => v === 4,
        hint: (v) => (v === 0 ? 'At 7 MHz this cable loses the least. Raise the frequency.' : `At ${FREQS[v]} MHz less comes out than at 7 MHz. Keep raising the frequency.`),
        done: 'There: at 440 MHz the same cable turns far more of the signal into heat than it did at 7 MHz. Nothing changed but the frequency.',
      },
      remember: 'As the frequency of a signal in coaxial cable is increased, the loss increases.',
    },
    {
      type: 'card',
      id: 'cables',
      idea: 'RG-58, RG-213 and hardline',
      covers: ['T9B10', 'T9B11'],
      picture: { draw: ThreeCables },
      heading: 'Thicker cable, less loss',
      text: [
        'Coax comes in sizes. RG-58 is thin and flexible. RG-213 is about twice as thick. Both are 50 ohms, but RG-213 has less loss at a given frequency.',
        'The lowest loss of all belongs to air-insulated hardline: a stiff cable with a solid metal shield and mostly air between its conductors. It is used where low loss matters most.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You need a long run up a tower to a UHF antenna, and you want to lose as little signal as you can. Which feed line? Tap it in the picture, or tap an answer.',
        options: [
          { id: 'a', label: 'RG-58', why: 'RG-58 is the thin one. It has the most loss of the three.' },
          { id: 'b', label: 'RG-213', why: 'RG-213 has less loss than RG-58, but one of these has less still.' },
          { id: 'c', label: 'Air-insulated hardline', right: true, why: 'Yes. Air-insulated hardline has the lowest loss.' },
        ],
      },
      remember: 'RG-213 has less loss at a given frequency than RG-58. Air-insulated hardline has the lowest loss.',
    },
    {
      type: 'card',
      id: 'connectors',
      idea: 'PL-259 for HF and VHF, Type N above 400 MHz',
      covers: ['T9B06', 'T9B07'],
      picture: { art: 'pl-259' },
      heading: 'Connectors: PL-259 and Type N',
      text: [
        'An RF connector joins the coax to the radio or the antenna. The PL-259 is a threaded plug that screws on. It is commonly used at HF and VHF frequencies.',
        'Higher up it does not work as well. For frequencies above 400 MHz the most suitable connector is the Type N, which is also threaded. A third kind, the BNC, is a small bayonet connector: you push it on and twist to lock it.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each description to its connector. Tap a description, then tap the connector.',
        slots: [
          { id: 'pl', label: 'PL-259', rule: 'The PL-259 is the threaded plug commonly used at HF and VHF.' },
          { id: 'n', label: 'Type N', rule: 'Type N is the one most suitable above 400 MHz.' },
          { id: 'bnc', label: 'BNC', rule: 'The BNC is the small bayonet connector.' },
        ],
        items: [
          { id: 'a', label: 'The best choice above 400 MHz', slot: 'n', why: 'Type N is the connector most suitable for frequencies above 400 MHz.' },
          { id: 'b', label: 'The push and twist connector', slot: 'bnc', why: 'The BNC is a bayonet connector. The PL-259 and Type N screw on instead.' },
          { id: 'c', label: 'The usual plug at HF and VHF', slot: 'pl', why: 'PL-259 connectors are commonly used at HF and VHF frequencies.' },
        ],
      },
      remember: 'PL-259 connectors are commonly used at HF and VHF. Type N is the most suitable connector above 400 MHz.',
    },
    {
      type: 'card',
      id: 'swr',
      idea: 'SWR measures the match',
      covers: ['T9B09', 'T9B12'],
      picture: { art: 'impedance-matching' },
      heading: 'SWR tells you how good the match is',
      text: [
        'The load is whatever sits at the far end of the feed line, usually the antenna. When the load is matched to the line, the power passes into it. When it is not, some power is reflected back. Standing wave ratio, or SWR, is a measure of how well a load is matched to a transmission line, which is another name for a feed line.',
        'A steady SWR reading describes your antenna system. A reading that jumps about means something is changing, and the usual cause is a loose connection in the antenna or feed line.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your SWR reading jumps up and down each time the wind shakes the antenna. What is the likely cause?',
        options: [
          { id: 'mic', label: 'Speaking too loudly into the microphone', why: 'That distorts your signal, but it does not change how well the antenna is matched.' },
          { id: 'near', label: 'A strong station nearby', why: 'A strong nearby station can overload a receiver. It does not change your SWR.' },
          { id: 'loose', label: 'A loose connection in the antenna or feed line', right: true, why: 'Yes. A loose connection makes and breaks contact, so the match keeps changing.' },
        ],
      },
      remember: 'SWR is a measure of how well a load is matched to a transmission line. A loose connection in the antenna or feed line can cause erratic changes in SWR.',
    },
    {
      type: 'card',
      id: 'tuner',
      idea: 'An antenna tuner matches impedances',
      covers: ['T9B04'],
      picture: { art: 'antenna-tuner' },
      heading: 'An antenna tuner makes the radio see a match',
      text: [
        'A transceiver is built to work into one impedance, normally 50 ohms. The antenna system, meaning the antenna and its feed line together, does not always present that.',
        'An antenna tuner, also called an antenna coupler, goes between the radio and the antenna system. Its major function is to match the antenna system impedance to the transceiver\'s output impedance.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'On one band your antenna system is a poor match for your transceiver. You put an antenna tuner between them and adjust it. What has the tuner done?',
        options: [
          { id: 'match', label: 'Matched the antenna system impedance to the transceiver', right: true, why: 'Yes. That is the major function of an antenna tuner.' },
          { id: 'pick', label: 'Picked the right antenna for the band', why: 'Choosing between antennas is the job of an antenna switch, not a tuner.' },
          { id: 'rx', label: 'Tuned the receiver to a weak station', why: 'You choose the frequency with the radio itself. The tuner only deals with impedance.' },
        ],
      },
      remember: 'An antenna tuner (antenna coupler) matches the antenna system impedance to the transceiver\'s output impedance.',
    },
    {
      type: 'card',
      id: 'keep-dry',
      idea: 'Sources of loss, and taping outdoor connectors',
      covers: ['T9B01', 'T9B08'],
      picture: { art: 'weatherproofing' },
      heading: 'Keep the loss down: dry, matched and simple',
      text: [
        'Three things add loss to a coaxial feed line: water getting into the connectors, high SWR, and multiple connectors in the line.',
        'Water is the one you can keep out. No common connector should be left bare outdoors. PL-259, BNC and Type N connectors should all be carefully taped for weather protection.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which of these add loss, and which keeps it down? Tap one, then tap where it goes.',
        slots: [
          { id: 'adds', label: 'Adds loss', rule: 'This box is for things that waste your signal.' },
          { id: 'keeps', label: 'Keeps loss down', rule: 'This box is for things that protect your signal.' },
        ],
        items: [
          { id: 'a', label: 'Water in a connector', slot: 'adds', why: 'Water intrusion into coaxial connectors is a source of loss.' },
          { id: 'b', label: 'Tape on outdoor connectors', slot: 'keeps', why: 'Careful taping keeps water out, whether the connector is a PL-259, a BNC or a Type N.' },
          { id: 'c', label: 'High SWR', slot: 'adds', why: 'High SWR is a source of loss in a coaxial feed line.' },
          { id: 'd', label: 'Many connectors in the line', slot: 'adds', why: 'Multiple connectors in the line are a source of loss.' },
        ],
      },
      remember: 'Water in connectors, high SWR and multiple connectors are all sources of loss. Outdoors, tape every connector: PL-259, BNC and Type N.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T9B01', 'T9B05', 'T9B07', 'T9B10', 'T9B12'],
      questions: [
        {
          q: 'The same length of coax feeds your HF antenna today and will feed a UHF antenna next month. What will be different in the cable?',
          review: 'frequency',
          covers: ['T9B05'],
          choices: [
            { label: 'More of the signal will be lost', right: true, why: 'Loss in coaxial cable increases as the frequency increases.' },
            { label: 'Less of the signal will be lost', why: 'It goes the other way. Higher frequencies lose more in the same cable.' },
            { label: 'Its impedance will rise above 50 ohms', why: 'A 50 ohm cable stays 50 ohms. What changes with frequency is the loss.' },
          ],
        },
        {
          q: 'Two cables are the same length and both are 50 ohms: thin RG-58 and thick RG-213. Which one delivers more of your signal to the antenna?',
          review: 'cables',
          covers: ['T9B10'],
          choices: [
            { label: 'RG-58', why: 'The thin cable has more loss, so less of the signal arrives.' },
            { label: 'RG-213', right: true, why: 'RG-213 has less loss at a given frequency than RG-58.' },
            { label: 'Neither. Loss depends only on impedance', why: 'Both are 50 ohms, yet their loss differs. The thicker cable loses less.' },
          ],
        },
        {
          q: 'A friend says the PL-259 on his outdoor antenna needs no tape, because it screws on tightly. Is he right?',
          review: 'keep-dry',
          covers: ['T9B01', 'T9B07'],
          choices: [
            { label: 'Yes. A threaded connector keeps water out by itself', why: 'A PL-259 is not watertight, even screwed on tightly.' },
            { label: 'Yes. Only bayonet connectors need tape', why: 'PL-259, BNC and Type N connectors should all be taped outdoors.' },
            { label: 'No. It should be carefully taped', right: true, why: 'PL-259 connectors are not watertight. Outdoors, every connector should be carefully taped.' },
          ],
        },
        {
          q: 'A meter shows that your antenna has a low, steady SWR. What does that tell you?',
          review: 'swr',
          covers: ['T9B12'],
          choices: [
            { label: 'Your transmitter is putting out high power', why: 'SWR is not a measure of power. It describes the match.' },
            { label: 'Your antenna is well matched to the feed line', right: true, why: 'SWR is a measure of how well a load is matched to a transmission line.' },
            { label: 'Your station has a good ground connection', why: 'SWR says nothing about the station ground. It describes the match on the feed line.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T9B01', 'T9B02', 'T9B03', 'T9B04', 'T9B05', 'T9B06', 'T9B07', 'T9B08', 'T9B09', 'T9B10', 'T9B11', 'T9B12'],
      facts: [
        { icon: IconCoax, text: 'Coax is the most common feed line: it is easy to use and needs few special installation considerations. Its usual impedance is 50 ohms.', covers: ['T9B02', 'T9B03'] },
        { icon: IconLoss, text: 'Loss in coax increases with frequency. RG-213 has less loss than RG-58, and air-insulated hardline has the lowest loss.', covers: ['T9B05', 'T9B10', 'T9B11'] },
        { icon: IconPlug, text: 'PL-259 connectors are common at HF and VHF. Type N is the most suitable above 400 MHz.', covers: ['T9B06', 'T9B07'] },
        { icon: IconTape, text: 'Tape every outdoor connector: PL-259, BNC and Type N. Water in connectors, high SWR and multiple connectors all add loss.', covers: ['T9B01', 'T9B08'] },
        { icon: IconMatch, text: 'SWR is a measure of how well a load is matched to a transmission line. Erratic SWR points to a loose connection.', covers: ['T9B09', 'T9B12'] },
        { icon: IconTuner, text: 'An antenna tuner matches the antenna system impedance to the transceiver\'s output impedance.', covers: ['T9B04'] },
      ],
    },
  ],
};
export default LESSON;
