import { Art, Mini, T, wave } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Interference and audio problems (question group T7B, all 11 questions).
 * Each problem is taught as a symptom, its cause and its cure. Every exam fact comes from a
 * T7B question and its keyed answer; the ids are in each step's `covers`. The 146 MHz to
 * 292 MHz harmonic example follows the pool's definition of a harmonic (a whole-number
 * multiple of the transmit frequency). The parking garage as a bad location is an everyday
 * example the pool does not give.
 */

/* ---------- pictures ---------- */

/** Three suspects for garbled audio through a repeater, each a tappable box. T7B10 */
function RepeaterSuspects({ picked, solved, onPick }: PicProps) {
  const rows = [
    ['freq', 'off frequency', 'radio set wrong'],
    ['mic', 'too loud, too close', 'over-deviating'],
    ['loc', 'bad location', 'blocked or bounced'],
  ] as const;
  const tone = (id: string) => (picked !== id ? 'ga-w' : id === 'loc' && solved ? 'ga-good' : 'ga-bad');
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  return (
    <Art label="Three suspects for garbled audio through a repeater: the radio is off frequency, the operator is too loud or too close to the microphone, or the operator is in a bad location. A broken signal reaches the repeater tower.">
      {rows.map(([id, name, sub], i) => (
        <>
          <rect class={`${tone(id)}${picked === id ? ' ga-thick' : ''}`} x="8" y={8 + i * 42} width="140" height="36" rx="5" />
          <T x={18} y={23 + i * 42} c="ga-tk ga-tb">{name}</T>
          <T x={18} y={37 + i * 42} c="ga-tm">{sub}</T>
          {onPick && <rect x="8" y={8 + i * 42} width="140" height="36" style={hit} fill="transparent" onClick={() => onPick(id)} />}
        </>
      ))}
      <path class="ga-s ga-dash" d={wave(152, 184, 70, 12, 6)} />
      <path class="ga-w ga-thick" d="M206 116V26M194 116L206 26L218 116M198 86H214M201 56H211" />
      <path class="ga-w ga-thin" d="M200 18Q206 12 212 18M196 12Q206 2 216 12" />
      <T x={206} y={132} a="middle" c="ga-tm">repeater</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconMic = () => <Mini><rect class="ls-mk" x="8" y="10" width="12" height="20" rx="6" /><path class="ls-mw" d="M14 30V40M8 40H20" /><path class="ls-ms" d="M26 20H44M38 14L44 20L38 26" /></Mini>;
const IconChoke = () => <Mini><path class="ls-mw" d="M4 24H44" /><rect class="ls-mk" x="16" y="14" width="16" height="20" rx="4" /></Mini>;
const IconSwr = () => <Mini><path class="ls-ms" d="M6 18H34M28 12L34 18L28 24" /><path class="ls-mk" d="M42 30H14M20 24L14 30L20 36" /></Mini>;
const IconHarm = () => <Mini><path class="ls-ms" d="M10 42V8" /><path class="ls-mk" d="M24 42V22M38 42V30" /><path class="ls-mw ls-mthin" d="M4 42H44" /></Mini>;
const IconFilter = () => <Mini><path class="ls-mk" d="M4 14H16C20 14 20 38 24 38S28 14 32 14H44" /><path class="ls-mw ls-mthin" d="M4 42H44" /></Mini>;
const IconHome = () => <Mini><path class="ls-mk" d="M8 22L24 8L40 22M12 19V40H36V19" /><rect class="ls-mw" x="20" y="28" width="8" height="12" /></Mini>;

/* ---------- the lesson ---------- */

export const T7B_PROBLEMS: Lesson = {
  id: 't7b-problems',
  title: 'Interference and audio problems',
  blurb: 'Bad audio, interference to and from other radios, and the cure for each.',
  sub: 'T7',
  groups: ['T7B'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t7b-problems',
      intro: 'Start with a short clip. After it you will diagnose each problem yourself: the symptom, the cause and the cure.',
      covers: ['T7B01', 'T7B02', 'T7B03', 'T7B05', 'T7B06', 'T7B07', 'T7B08', 'T7B10', 'T7B11'],
    },
    {
      type: 'card',
      id: 'deviation',
      idea: 'Over-deviation: too much audio',
      covers: ['T7B01'],
      picture: { art: 'deviation' },
      heading: 'Symptom: your FM audio is too wide and harsh',
      text: [
        'On FM, your voice makes the signal swing up and down in frequency. That swing is called deviation. The louder the sound reaching the microphone, the wider the swing.',
        'Too much swing is over-deviating: the signal gets too wide and your voice comes out distorted. The cure is less sound at the microphone, so talk a little farther away from it.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A friend tells you that your handheld is over-deviating. What do you do?',
        options: [
          { id: 'loud', label: 'Talk louder so you come through clearly', why: 'Louder audio makes the swing even wider. That makes over-deviation worse.' },
          { id: 'power', label: 'Switch to a higher power level', why: 'Power does not set deviation. More power is just a stronger signal that is still too wide.' },
          { id: 'away', label: 'Talk farther away from the microphone', right: true, why: 'Yes. Less sound reaches the microphone, so the signal swings less and stops over-deviating.' },
        ],
      },
      remember: 'If you are told you are over-deviating, talk farther away from the microphone.',
    },
    {
      type: 'card',
      id: 'repeater',
      idea: 'Three reasons for garbled repeater audio',
      covers: ['T7B10'],
      picture: { draw: RepeaterSuspects },
      heading: 'Symptom: garbled audio through a repeater',
      text: [
        'A repeater is a station, often on a hilltop, that receives your signal and sends it out again. If your voice comes out of it distorted or hard to understand, there are three usual suspects.',
        'Your radio may be slightly off frequency. You may be talking too loudly or too close to the microphone. Or you may be in a bad location, where your signal reaches the repeater weak or bounced off things.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You are deep inside a concrete parking garage. Your radio is set to the right frequency and you speak normally, a hand away from the microphone. Reports say you are broken up. Which suspect is it? Tap a box or an answer.',
        options: [
          { id: 'freq', label: 'Off frequency', why: 'Your radio is set to the right frequency, so this suspect is cleared.' },
          { id: 'mic', label: 'Too loud or too close', why: 'You speak normally, a hand away from the microphone, so this suspect is cleared.' },
          { id: 'loc', label: 'Bad location', right: true, why: 'Yes. Concrete around you weakens your signal before it reaches the repeater. Move to a better spot.' },
        ],
      },
      remember: 'Distorted audio through an FM repeater can mean you are off frequency, too loud or too close to the microphone, or in a bad location.',
    },
    {
      type: 'card',
      id: 'feedback',
      idea: 'RF feedback and the ferrite choke',
      covers: ['T7B11'],
      picture: { art: 'ferrite-choke' },
      heading: 'Symptom: your voice distorts only when you transmit',
      text: [
        'RF means radio frequency: the radio signal itself. When you transmit, some of your own signal can be picked up by the microphone cable and carried back into the radio, where it mixes with your voice and distorts it.',
        'The cure is a ferrite choke: a small block of magnetic material that clips onto the cable. It blocks the radio signal on the cable but lets your voice audio through.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your transmitted voice is distorted because your own signal is getting into the microphone cable. Which cure fits?',
        options: [
          { id: 'squelch', label: 'Turn the squelch control all the way up', why: 'Squelch only mutes your receiver when no signal is there. It does nothing to the audio you transmit.' },
          { id: 'reset', label: 'Turn the radio off and on again', why: 'A restart does not remove the cause. Your signal will get into the cable again the next time you transmit.' },
          { id: 'choke', label: 'Clip a ferrite choke onto the microphone cable', right: true, why: 'Yes. The choke stops your transmitted signal from feeding back along the cable into the transmitter.' },
        ],
      },
      remember: 'A clip-on ferrite choke on the microphone cable can cure distorted voice caused by your signal feeding back into the transmitter.',
    },
    {
      type: 'card',
      id: 'power',
      idea: 'High SWR cuts the power',
      covers: ['T7B04'],
      picture: { art: 'swr' },
      heading: 'Symptom: your radio puts out less power than it should',
      text: [
        'Most radios today are solid-state: built with transistors instead of vacuum tubes. SWR, standing wave ratio, shows how well your antenna system is matched to the radio. Low SWR is a good match. High SWR means much of the power bounces back.',
        'Reflected power can damage the final transistors, so a solid-state radio protects itself by turning its own output down. Low power is often the radio telling you to check the antenna and feed line.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your solid-state radio is giving much less power than usual. Which reading would explain it?',
        options: [
          { id: 'low', label: 'Low SWR', why: 'Low SWR is a good match. Little power bounces back, so the radio gives full power.' },
          { id: 'high', label: 'High SWR', right: true, why: 'Yes. With a poor match, power bounces back and the radio cuts its output to protect its transistors.' },
        ],
      },
      remember: 'High SWR can cause low power output from a solid-state transceiver.',
    },
    {
      type: 'card',
      id: 'causes',
      idea: 'Three causes of interference',
      covers: ['T7B03'],
      picture: { art: 'harmonics' },
      heading: 'Three things that cause interference',
      text: [
        'Radio frequency interference (RFI) is a signal turning up where it is not wanted. Your transmitter can make two kinds of unwanted signal: harmonics, at whole-number multiples of your frequency, and spurious emissions, any other unwanted signal outside the one you meant to send.',
        'The third cause is fundamental overload: your strong, clean signal on its own frequency overwhelms a nearby receiver.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You transmit on 146 MHz, and a weak copy of your signal shows up on 292 MHz. What is that copy?',
        options: [
          { id: 'over', label: 'Fundamental overload', why: 'Overload is about your signal on its own frequency swamping a receiver. This is a new signal on another frequency.' },
          { id: 'harm', label: 'A harmonic', right: true, why: 'Yes. 292 is exactly two times 146, a whole-number multiple, so it is a harmonic.' },
          { id: 'dev', label: 'Over-deviation', why: 'Over-deviation makes your FM signal too wide around 146 MHz. It does not put a copy at twice the frequency.' },
        ],
      },
      remember: 'Fundamental overload, harmonics and spurious emissions can all cause radio frequency interference.',
    },
    {
      type: 'card',
      id: 'overload',
      idea: 'Overload: the filter goes at the receiver',
      covers: ['T7B02', 'T7B05', 'T7B07'],
      picture: { art: 'fundamental-overload' },
      heading: 'Overload: the cure goes at the receiver',
      text: [
        'A neighbor\'s AM or FM broadcast radio can pick you up even though you are far from its band: it cannot reject a strong signal from outside its band. Your signal is clean, so the cure goes at their radio: a filter at its antenna input that blocks you and passes the stations it wants.',
        'It works the other way too. A strong commercial FM station can overload your 2 meter radio. A band-reject filter blocks just the FM broadcast band and passes 2 meters. A preamplifier would boost the FM station too and make it worse.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your station is working properly, but a neighbor\'s FM radio picks up your voice. Where should a filter go?',
        options: [
          { id: 'tx', label: 'On your transmitter', why: 'Your clean signal is the very one being picked up. A filter on your transmitter that blocked it would block your own transmission.' },
          { id: 'rx', label: 'At the antenna input of the neighbor\'s radio', right: true, why: 'Yes. There it keeps your signal out of the radio that cannot reject it, and lets the broadcast stations through.' },
          { id: 'mode', label: 'Nowhere. Switch from FM to SSB instead', why: 'A different mode is still a strong signal at their radio. The radio still cannot reject it.' },
        ],
      },
      remember: 'A broadcast radio hears you when it cannot reject strong signals outside its band. A filter at its antenna input blocks you. A band-reject filter keeps a strong FM station out of your 2 meter radio.',
    },
    {
      type: 'card',
      id: 'neighbors',
      idea: 'Neighbors: start with your own station',
      covers: ['T7B06', 'T7B08', 'T7B09'],
      picture: { art: 'good-amateur-practice' },
      heading: 'When a neighbor is involved, start at home',
      text: [
        'If a neighbor says you interfere with their radio or TV, first make sure your station works properly and does not bother your own radio or TV on the same channel. With cable TV (not fiber optic), first make sure the coax connectors on the TV feed line are installed properly: a poor one lets your signal leak in.',
        'If something in a neighbor\'s home interferes with you, work with them to find the device, make sure your own station meets good amateur practice, and politely explain that FCC rules prohibit devices that cause interference.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A neighbor knocks and says your transmissions are on their TV. What do you do first?',
        options: [
          { id: 'fcc', label: 'Switch off and call the nearest FCC office', why: 'That is not the expected first step. Hams are expected to look into the problem themselves first.' },
          { id: 'own', label: 'Check that your station works and does not affect your own TV on the same channel', right: true, why: 'Yes. Start with your own station and your own TV. That tells you where the problem lies.' },
          { id: 'theirs', label: 'Tell them it is their TV\'s problem', why: 'That is not good practice. Check your own station first, then work on it together.' },
        ],
      },
      remember: 'Neighbor reports interference: check your own station and your own TV first. Cable TV: check the coax connectors first. A neighbor\'s device interferes with you: work together, check your station, and politely explain the FCC rules.',
    },
    {
      type: 'card',
      id: 'match',
      idea: 'Match each symptom to its cure',
      covers: ['T7B01', 'T7B04', 'T7B07', 'T7B09', 'T7B11'],
      picture: { art: 'radio-frequency-interference' },
      heading: 'Put it together: symptom to cure',
      text: [
        'Every problem in this lesson has a cause you can name and a cure that fits the cause. Match each one.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Put each symptom with its cure. Tap a symptom, then tap the cure.',
        slots: [
          { id: 'mic', label: 'Back off the mic', rule: 'This cure is for too much audio reaching the microphone.' },
          { id: 'choke', label: 'Ferrite choke on mic cable', rule: 'This cure is for your own signal getting into the microphone cable.' },
          { id: 'brf', label: 'Band-reject filter', rule: 'This cure is for a strong station overloading a receiver.' },
          { id: 'coax', label: 'Check coax connectors', rule: 'This cure is for a signal leaking into a cable TV system.' },
          { id: 'swr', label: 'Fix the antenna match', rule: 'This cure is for high SWR.' },
        ],
        items: [
          { id: 'a', label: 'Over-deviating', slot: 'mic', why: 'Over-deviating is too much audio. Talk farther from the microphone.' },
          { id: 'b', label: 'Own signal distorts voice', slot: 'choke', why: 'A ferrite choke stops your signal feeding back along the microphone cable.' },
          { id: 'c', label: 'FM station swamps 2 m', slot: 'brf', why: 'A band-reject filter blocks the FM broadcast band and passes 2 meters.' },
          { id: 'd', label: 'You leak into cable TV', slot: 'coax', why: 'Poorly installed coax connectors let your signal leak in, so check them first.' },
          { id: 'e', label: 'Low power output', slot: 'swr', why: 'High SWR makes the radio cut its power. A good match brings it back.' },
        ],
      },
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T7B01', 'T7B10', 'T7B02', 'T7B05', 'T7B04', 'T7B06'],
      questions: [
        {
          q: 'A friend holds her handheld right against her lips and shouts. People say her FM audio is harsh and too wide. What should she do?',
          review: 'deviation',
          covers: ['T7B01', 'T7B10'],
          choices: [
            { label: 'Turn up the power', why: 'Power does not change how wide the signal swings. Her audio would still be too wide.' },
            { label: 'Hold the radio farther away and speak normally', right: true, why: 'Less sound at the microphone means less deviation, so the audio clears up.' },
            { label: 'Let the radio cool down', why: 'Heat is not the cause. Too much audio at the microphone is.' },
          ],
        },
        {
          q: 'Your station checks out fine, but a neighbor\'s broadcast radio picks up your signal. Where does the filter belong?',
          review: 'overload',
          covers: ['T7B02', 'T7B05'],
          choices: [
            { label: 'At the antenna input of the neighbor\'s radio', right: true, why: 'Their radio cannot reject your strong signal, so the filter keeps it out right there.' },
            { label: 'On your transmitter', why: 'A filter that blocked your clean signal at your transmitter would stop you transmitting at all.' },
            { label: 'On your microphone cable', why: 'A ferrite choke on the microphone cable fixes distorted transmit audio, not a neighbor\'s overloaded radio.' },
          ],
        },
        {
          q: 'Your solid-state radio suddenly puts out far less power than usual. What should you check?',
          review: 'power',
          covers: ['T7B04'],
          choices: [
            { label: 'The squelch setting', why: 'Squelch only mutes the receiver. It does not change transmit power.' },
            { label: 'The SWR of your antenna system', right: true, why: 'High SWR makes a solid-state radio cut its power to protect its transistors.' },
            { label: 'How close you are to the microphone', why: 'Distance from the microphone sets deviation, not output power.' },
          ],
        },
        {
          q: 'A neighbor says your signal is on their TV. What comes first?',
          review: 'neighbors',
          covers: ['T7B06'],
          choices: [
            { label: 'Call the FCC', why: 'That is not the first step. Look into it yourself first.' },
            { label: 'Install a harmonic doubler', why: 'A doubler would make more harmonics, not fewer. It is not a cure.' },
            { label: 'Check your station and your own TV on the same channel', right: true, why: 'Starting with your own station shows whether the problem is at your end.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T7B01', 'T7B02', 'T7B03', 'T7B04', 'T7B05', 'T7B06', 'T7B07', 'T7B08', 'T7B09', 'T7B10', 'T7B11'],
      facts: [
        { icon: IconMic, text: 'Over-deviating: talk farther from the microphone. Garbled through a repeater: off frequency, too loud or too close, or a bad location.', covers: ['T7B01', 'T7B10'] },
        { icon: IconChoke, text: 'Voice distorted by your own signal on the microphone cable: clip on a ferrite choke.', covers: ['T7B11'] },
        { icon: IconSwr, text: 'High SWR can cause low power output from a solid-state transceiver.', covers: ['T7B04'] },
        { icon: IconHarm, text: 'Fundamental overload, harmonics and spurious emissions can all cause interference.', covers: ['T7B03'] },
        { icon: IconFilter, text: 'A broadcast radio hears you when it cannot reject strong out-of-band signals: filter at its antenna input. A band-reject filter keeps a strong FM station out of your 2 meter radio.', covers: ['T7B02', 'T7B05', 'T7B07'] },
        { icon: IconHome, text: 'Neighbor complains: check your own station and TV first. Cable TV: check the coax connectors. Their device bothers you: work together and politely explain the FCC rules.', covers: ['T7B06', 'T7B08', 'T7B09'] },
      ],
    },
  ],
};
export default T7B_PROBLEMS;
