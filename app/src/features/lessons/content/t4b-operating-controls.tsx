import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 15: Your radio's controls (question group T4B, all 11 questions).
 * Each control is taught by the problem it solves. Every exam fact comes from a T4B question
 * and its keyed answer; the ids are in each step's `covers`. The pictures use made-up but
 * consistent levels (squelch steps, gain steps) to show the idea, not real radio settings.
 */

/* ---------- pictures ---------- */

/** A repeatable pseudo-random number from 0 to 1, so the noise looks the same on every draw. */
const rnd = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

const SQ_Y0 = 98; // level 0
const SQ_PX = 7; // px per squelch step
/** Signal level at x: hiss everywhere, and a weak station in the middle that dips into the hiss. */
const sqLevel = (x: number, i: number) => (x >= 76 && x <= 146 ? 0.7 + 2.3 * rnd(i + 7) : 0.3 + 1.2 * rnd(i));
const sqTrace = (() => {
  let d = '';
  for (let x = 14, i = 0; x <= 167; x += 3, i++) d += `${x === 14 ? 'M' : 'L'}${x} ${(SQ_Y0 - sqLevel(x, i) * SQ_PX).toFixed(1)}`;
  return d;
})();
const sqSpeaker = (v: number) => (v >= 3 ? 'muted' : v >= 1 ? 'in and out' : 'on all the time');

/** Receiver noise and a weak FM station under a squelch threshold. `value` is the threshold. T4B03 */
function SquelchPic({ value = 6, solved }: PicProps) {
  const ly = SQ_Y0 - value * SQ_PX;
  return (
    <Art label={`Receiver hiss with a weak station in the middle, and a dashed squelch threshold at step ${value}. Only what rises above the threshold reaches the speaker. Speaker: ${sqSpeaker(value)}.`}>
      <defs>
        <clipPath id="t4b-sq-above"><rect x="0" y="0" width="240" height={Math.max(0, ly)} /></clipPath>
      </defs>
      <T x={14} y={18} c="ga-tb">{`speaker: ${sqSpeaker(value)}`}</T>
      <path class="ga-w ga-thin" d={sqTrace} />
      <path class="ga-s" d={sqTrace} clip-path="url(#t4b-sq-above)" />
      <path class={`${solved ? 'ga-good' : 'ga-k'} ga-dash`} d={`M14 ${ly}H226`} />
      <T x={226} y={ly - 5} a="end" c="ga-tk ga-tb">squelch</T>
      <path class="ga-w ga-thin" d={`M14 ${SQ_Y0 + 4}H226`} />
      <T x={40} y={118} a="middle" c="ga-tm">hiss</T>
      <T x={111} y={118} a="middle" c="ga-tm">weak station</T>
      <T x={14} y={134} c="ga-tm">amber: what you hear</T>
    </Art>
  );
}

const micState = (v: number) => (v > 5 ? 'distorted' : v >= 3 ? 'clean' : 'weak');

/** A voice waveform driven by the mic gain, flattened where it hits the transmitter's limit. T4B01 */
function MicPic({ value = 9, solved }: PicProps) {
  const lim = 30;
  const clipped = value * 6 > lim;
  let d = '';
  for (let x = 14; x <= 226; x += 1) {
    const t = (x - 14) / 212;
    const env = Math.max(Math.sin(t * Math.PI * 2.5), 0.2 + 0.8 * Math.abs(Math.sin(t * Math.PI * 1.7))) * Math.sin(t * Math.PI);
    const raw = value * 6 * Math.min(1, Math.abs(env) * 1.3) * Math.sin(t * 2 * Math.PI * 14);
    const y = 64 - Math.max(-lim, Math.min(lim, raw));
    d += `${x === 14 ? 'M' : 'L'}${x} ${y.toFixed(1)}`;
  }
  const edge = clipped ? 'ga-bad' : solved ? 'ga-good' : 'ga-w';
  const note = clipped ? 'peaks flattened: distorted audio' : value >= 3 ? 'peaks fit: clean audio' : 'too little gain: weak audio';
  return (
    <Art label={`Your voice as sent by the transmitter, with the microphone gain at ${value}. ${note}.`}>
      <T x={226} y={26} a="end" c="ga-tm">the transmitter's limit</T>
      <path class={`${edge} ga-dash`} d={`M14 ${64 - lim}H226M14 ${64 + lim}H226`} />
      <path class="ga-s" d={d} />
      <T x={120} y={124} a="middle" c={clipped ? 'ga-tk ga-tb' : 'ga-tb'}>{note}</T>
    </Art>
  );
}

const WIDTHS = [500, 1000, 2400, 5000];
const PX_PER_KHZ = 30;
const filterNote = (v: number) => ['cuts off most of the voice', 'cuts off part of the voice', 'the whole voice, little else', 'voice, extra noise and a neighbor'][v];

/** An SSB voice signal, a neighbor station and noise, with the receiver filter as a window. T4B08, T4B10 */
function FilterPic({ value = 0, solved }: PicProps) {
  const w = (WIDTHS[value] / 1000) * PX_PER_KHZ;
  const x0 = 120 - w / 2;
  let noise = '';
  for (let x = 14, i = 0; x <= 226; x += 3, i++) noise += `${x === 14 ? 'M' : 'L'}${x} ${(104 - 3 - 5 * rnd(i + 31)).toFixed(1)}`;
  return (
    <Art label={`A single sideband voice signal about 2400 hertz wide, with noise all around and another station to one side. The receiver filter is set to ${WIDTHS[value]} hertz: it lets through ${filterNote(value)}.`}>
      <rect class="ga-fk ga-soft" x={x0} y="30" width={w} height="74" />
      <rect class={solved ? 'ga-good' : 'ga-k'} x={x0} y="30" width={w} height="74" />
      <T x={120} y={22} a="middle" c="ga-tk ga-tb">{`filter: ${WIDTHS[value]} Hz`}</T>
      <path class="ga-w ga-thin" d={noise} />
      <path class="ga-s" d="M84 104C88 60 94 52 104 54S136 58 144 52S153 66 156 104" />
      <path class="ga-w" d="M174 104C178 84 186 84 190 104M26 104C30 80 38 80 42 104" />
      <path class="ga-w ga-thin" d="M14 106H226" />
      <T x={120} y={120} a="middle" c="ga-ts">voice</T>
      <T x={203} y={120} a="middle" c="ga-tm">neighbor</T>
      <T x={120} y={134} a="middle" c="ga-tm">{filterNote(value)}</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconTune = () => <Mini><rect class="ls-mw" x="4" y="12" width="40" height="24" rx="3" /><circle class="ls-mk" cx="32" cy="24" r="6" /><path class="ls-ms ls-mthin" d="M10 24H22" /></Mini>;
const IconSquelch = () => <Mini><path class="ls-mw ls-mthin" d="M4 34L8 30L12 35L16 31L20 34L24 22L28 18L32 24L36 31L40 34L44 32" /><path class="ls-mk" d="M4 26H44" /></Mini>;
const IconRit = () => <Mini><path class="ls-mw" d="M4 38H44" /><path class="ls-mw ls-mthin" d="M18 38V14" /><path class="ls-mk" d="M26 38V14" /><path class="ls-ms ls-mthin" d="M19 10H25" /></Mini>;
const IconMic = () => <Mini><rect class="ls-mw" x="10" y="6" width="10" height="18" rx="5" /><path class="ls-mw ls-mthin" d="M15 30V40M8 22A7 7 0 0 0 22 22" /><path class="ls-ms" d="M26 26L30 14H38L42 26" /></Mini>;
const IconFilter = () => <Mini><path class="ls-mk" d="M8 40L14 10H34L40 40" /><path class="ls-ms" d="M16 40C18 26 22 20 24 20S30 26 32 40" /></Mini>;
const IconDigital = () => <Mini><rect class="ls-mw" x="16" y="14" width="16" height="28" rx="3" /><path class="ls-mw" d="M20 14V6" /><text class="ls-mt" x="24" y="34" text-anchor="middle">ID</text></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't4b-operating-controls',
  title: "Your radio's controls",
  blurb: 'Each control on your radio, taught by the problem it fixes on the air.',
  sub: 'T4',
  groups: ['T4B'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t4b-operating-controls',
      intro: 'Start with a short clip. After it you will fix each problem yourself, one control at a time.',
      covers: ['T4B01', 'T4B03', 'T4B06', 'T4B07', 'T4B08', 'T4B10', 'T4B11'],
    },
    {
      type: 'card',
      id: 'tuning',
      idea: 'Keypad, VFO knob and scanning',
      covers: ['T4B02', 'T4B05'],
      picture: { art: 'vfo' },
      heading: 'Problem: getting to the right frequency',
      text: [
        'You know the frequency you want? Type it on the keypad, or turn the VFO knob until the display shows it. VFO means variable frequency oscillator. The VFO knob is the main tuning knob.',
        'Not sure where anyone is talking? The scan function tunes through a range of frequencies, or your saved memory channels, checking each one for activity. It stops when it hears a signal.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which control does each job? Tap a job, then tap the control.',
        slots: [
          { id: 'key', label: 'Keypad', rule: 'The keypad is for typing in a frequency you already know.' },
          { id: 'vfo', label: 'VFO knob', rule: 'The VFO knob is for tuning by hand.' },
          { id: 'scan', label: 'Scan', rule: 'Scan steps through frequencies on its own to look for activity.' },
        ],
        items: [
          { id: 'a', label: 'Go straight to 146.520 MHz', slot: 'key', why: 'Type the numbers on the keypad and you are there.' },
          { id: 'b', label: 'Find which channels have someone talking', slot: 'scan', why: 'Scanning tunes through a range of frequencies to check for activity.' },
          { id: 'c', label: 'Tune slowly up the band by hand', slot: 'vfo', why: 'The VFO knob tunes the radio as you turn it.' },
        ],
      },
      remember: 'Enter a frequency with the keypad or the VFO knob. Scanning tunes through a range of frequencies to check for activity.',
    },
    {
      type: 'card',
      id: 'squelch',
      idea: 'Open the squelch for a weak FM signal',
      covers: ['T4B03'],
      picture: { draw: SquelchPic },
      heading: 'Problem: a weak FM station you cannot hear',
      text: [
        'Between FM signals a receiver hisses. Squelch is a gate that mutes the speaker until a signal is stronger than a threshold you set. That hides the hiss, but it also hides any station weaker than the threshold.',
        'To hear a very weak FM station, open the squelch: set the threshold so the receiver audio is on all the time. Turning up the volume will not help, because volume only works on sound that gets past the squelch.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Lower the squelch until the weak station is heard all the way through.',
        label: 'Squelch',
        min: 0,
        max: 8,
        step: 1,
        start: 6,
        readouts: (v) => [{ label: 'Squelch', value: `${v}` }, { label: 'Speaker', value: v >= 3 ? 'muted' : v >= 1 ? 'in and out' : 'always on' }],
        goal: (v) => v === 0,
        hint: (v) => (v >= 3
          ? 'The threshold is above the weak station, so the speaker stays muted. Lower it.'
          : 'Now the station cuts in and out: its weakest parts are still below the threshold. Keep lowering.'),
        done: 'There. The squelch is open and the audio is on all the time, hiss and all, so even the weakest part of the station comes through.',
      },
      remember: 'To hear a weak FM signal, set the squelch threshold so the receiver output audio is on all the time.',
    },
    {
      type: 'card',
      id: 'offfreq',
      idea: 'An FM signal off frequency sounds distorted',
      covers: ['T4B04'],
      picture: { art: 'off-frequency' },
      heading: 'Problem: an FM station that sounds rough',
      text: [
        'An FM receiver expects the signal to sit in the middle of its filter. If the other station is slightly off frequency, part of its signal falls outside, and the audio comes out distorted.',
        'It does not just get quieter: the sound itself is damaged. Single sideband behaves differently, as the next card shows.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A friend\'s FM radio is slightly off frequency. What do you hear?',
        options: [
          { id: 'pitch', label: 'Their voice sounds higher', why: 'A change in voice pitch is what mistuning does to single sideband, not to FM.' },
          { id: 'quiet', label: 'Only a quieter signal, otherwise fine', why: 'Being off frequency does more than lower the volume. The sound quality itself suffers.' },
          { id: 'dist', label: 'Distorted audio', right: true, why: 'Yes. The signal no longer sits centered in the receiver, so the audio comes out distorted.' },
        ],
      },
      remember: 'An FM signal received slightly off frequency sounds distorted.',
    },
    {
      type: 'card',
      id: 'rit',
      idea: 'RIT fixes the pitch of an SSB voice',
      covers: ['T4B06'],
      picture: { art: 'rit' },
      heading: 'Problem: an SSB voice too high or too low',
      text: [
        'On single sideband (SSB), the pitch of a voice depends on exactly where your receiver is tuned. A little off, and the other station sounds squeaky or growly. Turning the main tuning knob would also move your transmit frequency, away from the spot where they found you.',
        'RIT means receiver incremental tuning. It is also called the clarifier. It shifts only your receive frequency, a little, and leaves your transmit frequency where it is.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You call CQ on SSB and the reply sounds squeaky. Which control fixes the pitch and leaves your transmit frequency alone?',
        options: [
          { id: 'agc', label: 'The AGC', why: 'AGC, automatic gain control, deals with how strong a signal is. It does not change pitch.' },
          { id: 'tone', label: 'The tone squelch', why: 'Tone squelch keeps an FM receiver quiet until it hears a certain tone. It does nothing for SSB pitch.' },
          { id: 'rit', label: 'The RIT, or clarifier', right: true, why: 'Yes. RIT shifts only your receive frequency to correct the pitch. Your transmit frequency stays put.' },
        ],
      },
      remember: 'If an SSB voice sounds too high or too low, adjust the RIT, also called the clarifier.',
    },
    {
      type: 'card',
      id: 'micgain',
      idea: 'Too much microphone gain distorts SSB audio',
      covers: ['T4B01'],
      picture: { draw: MicPic },
      heading: 'Problem: your own SSB audio sounds harsh',
      text: [
        'Microphone gain sets how hard your voice drives the transmitter. With too much gain the transmitter cannot follow your voice peaks. It flattens them, and your transmitted audio is distorted.',
        'It is like shouting into a loudspeaker turned all the way up. Set the gain so your loudest sounds fit, and you sound clean.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Turn the microphone gain down until your voice peaks are no longer flattened.',
        label: 'Microphone gain',
        min: 1,
        max: 10,
        step: 1,
        start: 9,
        readouts: (v) => [{ label: 'Mic gain', value: `${v}` }, { label: 'Your audio', value: micState(v) }],
        goal: (v) => v >= 3 && v <= 5,
        hint: (v) => (v > 5
          ? 'Your peaks still hit the transmitter\'s limit and are flattened. That is distortion. Turn the gain down.'
          : 'Now your voice is clean but very weak. Turn the gain up a little.'),
        done: 'There. Your voice peaks fit inside the limit, so the audio goes out clean instead of distorted.',
      },
      remember: 'Excessive microphone gain on SSB causes distorted transmitted audio.',
    },
    {
      type: 'card',
      id: 'filters',
      idea: 'Pick a filter as wide as the signal: 2400 Hz for SSB',
      covers: ['T4B08', 'T4B10'],
      picture: { draw: FilterPic },
      heading: 'Problem: noise and neighbors crowd in',
      text: [
        'A receiver filter is a window that lets through only a slice of the band. Each mode takes up a different width. A filter much wider than the signal lets in extra noise and nearby stations; one narrower than the signal cuts part of it away.',
        'So a choice of filter bandwidths lets you reduce noise and interference by matching the filter to the mode. An SSB voice signal is roughly 2400 hertz wide, so a 2400 Hz filter gives the best signal-to-noise ratio: the most signal for the least noise.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Set the filter to give the best signal-to-noise ratio for this SSB voice.',
        label: 'Filter bandwidth',
        min: 0,
        max: 3,
        step: 1,
        start: 0,
        readouts: (v) => [{ label: 'Filter', value: `${WIDTHS[v]} Hz` }, { label: 'Lets in', value: v === 2 ? 'voice only' : v === 3 ? 'voice + noise' : 'part of voice' }],
        goal: (v) => v === 2,
        hint: (v) => (v < 2
          ? `${WIDTHS[v]} Hz is narrower than the voice, so part of the voice is cut off and speech is muffled. Widen it.`
          : '5000 Hz is wider than the voice, so it lets in extra noise and the station next door. Narrow it.'),
        done: 'There. At 2400 Hz the window matches the SSB voice: the whole voice gets through and little else.',
      },
      remember: 'Choosing a filter bandwidth that matches the mode reduces noise and interference. For SSB, 2400 Hz gives the best signal-to-noise ratio.',
    },
    {
      type: 'card',
      id: 'digital',
      idea: 'Digital voice settings: code plug, talkgroup ID, call sign',
      covers: ['T4B07', 'T4B09', 'T4B11'],
      picture: { art: 'code-plug' },
      heading: 'Problem: a new digital radio that will not work',
      text: [
        'DMR and D-STAR are digital voice systems, and their radios need settings before they work. A DMR radio needs its code plug: the configuration data loaded onto the radio so it can access repeaters and talkgroups. A code plug is a file, not a plug you can hold.',
        'Many groups share one DMR repeater. Each group, a talkgroup, has an identification code, and you select a group by entering that code. A D-STAR radio sends your call sign as data with every transmission, so your call sign must be programmed in before you transmit.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each need to the setting that meets it. Tap a need, then tap the setting.',
        slots: [
          { id: 'plug', label: 'Code plug', sub: 'DMR', rule: 'A code plug is the file of settings that lets a DMR radio use repeaters and talkgroups.' },
          { id: 'tg', label: 'Talkgroup ID', sub: 'DMR', rule: 'A talkgroup ID picks one group of DMR stations.' },
          { id: 'call', label: 'Your call sign', sub: 'D-STAR', rule: 'Your call sign is what a D-STAR radio sends with every transmission.' },
        ],
        items: [
          { id: 'a', label: 'Talk with one group on a shared DMR repeater', slot: 'tg', why: 'You select a group by entering its identification code.' },
          { id: 'b', label: 'Program into a D-STAR radio before you transmit', slot: 'call', why: 'D-STAR sends your call sign as data, so it must be programmed in first.' },
          { id: 'c', label: 'Load the repeaters and talkgroups into a DMR radio', slot: 'plug', why: 'That file of configuration data is the code plug.' },
        ],
      },
      remember: 'A DMR code plug is configuration data to access repeaters and talkgroups. Select a DMR group by entering its ID code. Program your call sign into a D-STAR radio before transmitting.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T4B01', 'T4B03', 'T4B06', 'T4B07'],
      questions: [
        {
          q: 'A friend says your SSB voice sounds harsh and crackly on every loud word. What do you turn down first?',
          review: 'micgain',
          covers: ['T4B01'],
          choices: [
            { label: 'The squelch', why: 'Squelch only mutes your own receiver. It does nothing to the audio you send.' },
            { label: 'The microphone gain', right: true, why: 'Too much microphone gain flattens your voice peaks and distorts the audio you transmit.' },
            { label: 'The receiver filter', why: 'The filter shapes what you hear, not what you send.' },
          ],
        },
        {
          q: 'You can just about hear a far FM station, but the speaker keeps going silent. What do you do with the squelch?',
          review: 'squelch',
          covers: ['T4B03'],
          choices: [
            { label: 'Raise it, to hide the hiss', why: 'A higher threshold hides even more of the weak station.' },
            { label: 'Leave it, and turn up the volume', why: 'Volume only works on sound that gets past the squelch. A muted speaker stays silent.' },
            { label: 'Open it, so the audio is on all the time', right: true, why: 'With the squelch open nothing is muted, so even the weakest parts of the station are heard.' },
          ],
        },
        {
          q: 'A station answering you on SSB sounds growly and low. You must not move off the frequency where they found you. What do you use?',
          review: 'rit',
          covers: ['T4B06'],
          choices: [
            { label: 'The main tuning knob', why: 'The main knob moves your transmit frequency too, so you would move off their spot.' },
            { label: 'The RIT, or clarifier', right: true, why: 'RIT shifts only your receive frequency, so you fix the pitch and stay put.' },
            { label: 'A wider filter', why: 'Filter width changes how much noise you hear, not the pitch of the voice.' },
          ],
        },
        {
          q: 'Your new DMR radio is switched on, but it cannot reach any repeater or talkgroup. What is most likely missing?',
          review: 'digital',
          covers: ['T4B07'],
          choices: [
            { label: 'Its code plug', right: true, why: 'The code plug is the configuration data that lets a DMR radio access repeaters and talkgroups.' },
            { label: 'A CTCSS tone', why: 'CTCSS tones are used on analog FM repeaters, not to set up a DMR radio.' },
            { label: 'More microphone gain', why: 'Microphone gain sets how loud you sound. It does not let the radio reach a repeater.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T4B01', 'T4B02', 'T4B03', 'T4B04', 'T4B05', 'T4B06', 'T4B07', 'T4B08', 'T4B09', 'T4B10', 'T4B11'],
      facts: [
        { icon: IconTune, text: 'Enter a frequency with the keypad or the VFO knob. Scanning tunes through a range of frequencies to check for activity.', covers: ['T4B02', 'T4B05'] },
        { icon: IconSquelch, text: 'To hear a weak FM signal, set the squelch so the audio is on all the time. An FM signal slightly off frequency sounds distorted.', covers: ['T4B03', 'T4B04'] },
        { icon: IconRit, text: 'SSB voice too high or too low: adjust the RIT, also called the clarifier.', covers: ['T4B06'] },
        { icon: IconMic, text: 'Excessive microphone gain on SSB causes distorted transmitted audio.', covers: ['T4B01'] },
        { icon: IconFilter, text: 'Match the filter bandwidth to the mode to reduce noise and interference. For SSB, 2400 Hz gives the best signal-to-noise ratio.', covers: ['T4B08', 'T4B10'] },
        { icon: IconDigital, text: 'A DMR code plug is configuration data for repeaters and talkgroups. Select a DMR group by its ID code. Program your call sign into a D-STAR radio before transmitting.', covers: ['T4B07', 'T4B09', 'T4B11'] },
      ],
    },
  ],
};
export default LESSON;
