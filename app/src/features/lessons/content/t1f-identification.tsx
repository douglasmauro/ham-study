import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Identifying your station (question group T1F, all 11 questions).
 * Every rule below comes from a T1F question and its keyed answer; the ids are in each
 * step's `covers`. Doug (KJ7ABC) is the learner, Jeff (K7DEF) his friend. The indicator
 * W3 follows the pool's own example (T1F06).
 */

/* ---------- pictures ---------- */

const X0 = 20, PX = 200 / 30; // timeline: 30 minutes across 200 units
const xAt = (min: number) => +(X0 + min * PX).toFixed(1);

/** A 24-minute contact on a timeline. `value` is the minute of Doug's next call sign. T1F03 */
function Timeline({ value = 3, solved }: PicProps) {
  const late = value > 10;
  const mark = (min: number, c: string, label: string, y = 44) => (
    <>
      <path class={c} d={`M${xAt(min)} 58V82`} />
      <circle class={c.replace('ga-', 'ga-f').replace('ga-fk', 'ga-fk')} cx={xAt(min)} cy={70} r={5} />
      <T x={xAt(min)} y={y} a="middle" c="ga-tb">{label}</T>
    </>
  );
  return (
    <Art label={`A contact drawn as a bar from minute 0 to minute 24. Doug gave his call sign at minute 0. His next call sign is marked at minute ${value}.${solved ? ' Further marks show minute 20 and the end of the contact at minute 24.' : ''}`}>
      <rect class="ga-fk ga-soft" x={xAt(0)} y="62" width={xAt(24) - xAt(0)} height="16" rx="3" />
      <path class="ga-w ga-thin" d={`M${X0} 100H${xAt(30)}${[0, 5, 10, 15, 20, 25, 30].map((m) => `M${xAt(m)} 96V104`).join('')}`} />
      {[0, 10, 20, 30].map((m) => <T x={xAt(m)} y={118} a="middle" c="ga-tm">{m}</T>)}
      <T x={120} y={134} a="middle" c="ga-tm">minutes into the contact</T>
      <T x={xAt(24)} y={20} a="middle" c="ga-tm">end</T>
      <path class="ga-w ga-thin ga-dash" d={`M${xAt(24)} 26V90`} />
      <path class={late ? 'ga-bad' : 'ga-k'} d={`M${xAt(0)} 88H${xAt(value)}`} />
      {mark(0, 'ga-k', 'ID')}
      {mark(value, solved ? 'ga-good' : late ? 'ga-bad' : 'ga-k', `${value}`, 30)}
      {solved && mark(20, 'ga-good', '20', 30)}
      {solved && mark(24, 'ga-good', 'ID', 44)}
    </Art>
  );
}

/** Doug's call sign with a self-assigned indicator, and the ways to say and send it. T1F04, T1F05, T1F06 */
function CallBuilder() {
  return (
    <Art label="Doug's call sign KJ7ABC, then a slash, then the indicator W3. Under the slash: say stroke, slant or slash. Below: give it in English on voice, or send it in CW.">
      <rect class="ga-w" x="14" y="16" width="112" height="36" rx="5" />
      <text x={70} y={42} class="ga-t ga-tl ga-mono" text-anchor="middle" style={{ fontSize: '20px' }}>KJ7ABC</text>
      <rect class="ga-fk ga-soft" x="132" y="16" width="26" height="36" rx="5" />
      <rect class="ga-k" x="132" y="16" width="26" height="36" rx="5" />
      <text x={145} y={42} class="ga-t ga-tk ga-tl ga-mono" text-anchor="middle" style={{ fontSize: '20px' }}>/</text>
      <rect class="ga-k" x="164" y="16" width="56" height="36" rx="5" />
      <text x={192} y={42} class="ga-t ga-tk ga-tl ga-mono" text-anchor="middle" style={{ fontSize: '20px' }}>W3</text>
      <T x={70} y={68} a="middle" c="ga-tm">call sign</T>
      <T x={192} y={68} a="middle" c="ga-tk">indicator</T>
      <T x={120} y={94} a="middle" c="ga-tk ga-tb">say: stroke, slant or slash</T>
      <T x={120} y={118} a="middle">on voice, in English</T>
      <T x={120} y={134} a="middle" c="ga-tm">or send it in CW (Morse code)</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconClock = () => <Mini><circle class="ls-mk" cx="24" cy="24" r="18" /><path class="ls-mk" d="M24 24V10M24 24L35 18" /></Mini>;
const IconVoice = () => <Mini><path class="ls-mk" d="M6 10h36v20H22l-8 8v-8H6Z" /><path class="ls-mw ls-mthin" d="M18 26L28 14" /></Mini>;
const IconThird = () => <Mini><circle class="ls-mw" cx="8" cy="18" r="4" /><circle class="ls-mk" cx="24" cy="18" r="4" /><circle class="ls-mw" cx="40" cy="18" r="4" /><path class="ls-ms ls-mthin" d="M13 32H35M30 27L35 32L30 37" /></Mini>;
const IconRepeater = () => <Mini><path class="ls-mw" d="M18 44L24 12L30 44M20 34H28" /><path class="ls-ms ls-mthin" d="M12 8A10 10 0 0 0 12 22M36 8A10 10 0 0 1 36 22" /></Mini>;
const IconClub = () => <Mini><path class="ls-mk" d="M6 42V22L24 8L42 22V42Z" /><text class="ls-mt" x="24" y="37" text-anchor="middle">4</text></Mini>;
const IconInspect = () => <Mini><rect class="ls-mw" x="6" y="6" width="24" height="32" rx="2" /><path class="ls-mw ls-mthin" d="M11 14h14M11 20h14M11 26h8" /><circle class="ls-mk" cx="32" cy="30" r="8" /><path class="ls-mk" d="M38 36L44 42" /></Mini>;

/* ---------- the lesson ---------- */

export const T1F_IDENTIFICATION: Lesson = {
  id: 't1f-identification',
  title: 'Identifying your station',
  blurb: 'When and how to give your call sign, messages for other people, repeaters and club stations.',
  sub: 'T1',
  groups: ['T1F'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t1f-identification',
      intro: 'Start with a short clip. After it you will try each rule in a small situation.',
      covers: ['T1F01', 'T1F02', 'T1F03', 'T1F04', 'T1F05', 'T1F08', 'T1F09', 'T1F10', 'T1F11'],
    },
    {
      type: 'card',
      id: 'every10',
      idea: 'Identify every 10 minutes and at the end',
      covers: ['T1F03'],
      picture: { draw: Timeline },
      heading: 'Your call sign: every 10 minutes, and at the end',
      text: [
        'Station identification means sending your call sign so that anyone listening knows who is on the air. Doug\'s call sign is KJ7ABC.',
        'The rule has two parts. During a communication, never let more than 10 minutes pass without your call sign. And give it once more at the end. Many hams also say it when they start, but the rule does not ask for that.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Doug gave his call sign at minute 0 of a long chat. Slide to the latest minute his next one can come.',
        label: 'Next call sign',
        min: 1,
        max: 20,
        step: 1,
        start: 3,
        readouts: (v) => [{ label: 'Last call sign', value: 'minute 0' }, { label: 'Next call sign', value: `minute ${v}` }],
        goal: (v) => v === 10,
        hint: (v) => (v < 10
          ? `Minute ${v} is allowed, because sooner is fine. But the rule lets Doug wait longer. Find the latest.`
          : `Minute ${v} is too late: that is ${v} minutes without his call sign. The limit is 10.`),
        done: 'Minute 10 is the latest. Then again by minute 20, and once more when the chat ends at minute 24.',
      },
      remember: 'Give your call sign at least every 10 minutes during a communication and at the end of it.',
    },
    {
      type: 'card',
      id: 'tactical',
      idea: 'A tactical call sign does not replace yours',
      covers: ['T1F02'],
      picture: { art: 'tactical-call-sign' },
      heading: 'A tactical name is extra, not instead',
      text: [
        'Doug helps at a bike race. On the air he answers to Race Headquarters. A name like that is a tactical call sign: it tells everyone what job a station does, so they know whom to call.',
        'It is handy, but it is not a legal identification. The usual rule still applies to Doug\'s own call sign.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug has been Race Headquarters for 10 minutes. What must he do?',
        options: [
          { id: 'none', label: 'Nothing. Race Headquarters is enough', why: 'A tactical call sign is not an identification. Doug still has to give KJ7ABC.' },
          { id: 'now', label: 'Give KJ7ABC now, and again at the end', right: true, why: 'Yes. The normal rule applies: KJ7ABC at least every 10 minutes and at the end.' },
          { id: 'each', label: 'Give KJ7ABC after every single transmission', why: 'That is more than the rules ask. Every 10 minutes and at the end is enough.' },
        ],
      },
      remember: 'With a tactical call sign, still give your FCC call sign at least every 10 minutes and at the end.',
    },
    {
      type: 'card',
      id: 'voice',
      idea: 'How to give your call sign on voice',
      covers: ['T1F04', 'T1F05', 'T1F06'],
      picture: { draw: CallBuilder },
      heading: 'On voice: in English, or in Morse code',
      text: [
        'Phone means voice. When Doug identifies on phone, he must say his call sign in English. He may also send it in CW, which is Morse code.',
        'Sometimes you add something to your own call sign, such as the call district you are operating from. That is a self-assigned indicator. Doug adds W3 after his call sign. On voice the mark between them, written /, may be said as stroke, slant or slash.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Doug is talking on voice. Which ways of identifying are fine? Tap one, then tap where it goes.',
        slots: [
          { id: 'ok', label: 'Fine', rule: 'Check the language, and whether he says or sends his own call sign.' },
          { id: 'no', label: 'Not allowed', rule: 'Stroke, slant and slash all work, and so does CW.' },
        ],
        items: [
          { id: 'a', label: 'KJ7ABC stroke W3', slot: 'ok', why: 'Stroke is an accepted word for the separator.' },
          { id: 'b', label: 'KJ7ABC slant W3', slot: 'ok', why: 'Slant is an accepted word for the separator too.' },
          { id: 'c', label: 'KJ7ABC slash W3', slot: 'ok', why: 'Slash works as well. All three name the same mark.' },
          { id: 'd', label: 'His call sign spoken in Spanish', slot: 'no', why: 'On phone the call sign must be given in English.' },
          { id: 'e', label: 'His call sign sent in CW', slot: 'ok', why: 'A phone station may identify by voice or by CW. Either is fine.' },
        ],
      },
      remember: 'On phone, identify in English, by voice or in CW. Stroke, slant and slash are all fine before an indicator.',
    },
    {
      type: 'card',
      id: 'thirdparty',
      idea: 'Third-party communications',
      covers: ['T1F08', 'T1F07'],
      picture: { art: 'third-party-communications' },
      heading: 'Passing a message for someone else',
      text: [
        'In a normal contact the two parties are the two control operators. When Doug sends a message to Jeff on behalf of another person, such as his neighbor who has no license, that person is a third party. This is called third-party communications.',
        'Talking with a station in another country brings in a second government. A person without a license may speak to a foreign station through Doug\'s station only if that country has a third-party agreement with the United States.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug\'s neighbor, who has no license, wants to greet a ham in another country over Doug\'s station. What must be true?',
        options: [
          { id: 'cit', label: 'The neighbor must be a US citizen', why: 'Citizenship is not the test. What matters is the country at the other end.' },
          { id: 'agree', label: 'That country has a third-party agreement with the US', right: true, why: 'Right. Third-party talk with a foreign station needs a third-party agreement between that country and the United States.' },
          { id: 'none', label: 'Nothing, because Doug is the control operator', why: 'Doug being in charge is not enough when the other station is abroad. An agreement is needed.' },
        ],
      },
      remember: 'Third-party communications: a message from one control operator to another on behalf of another person. To a foreign station, it needs a third-party agreement.',
    },
    {
      type: 'card',
      id: 'repeater',
      idea: 'Repeaters, and who answers for what they send',
      covers: ['T1F09', 'T1F10'],
      picture: { art: 'repeater' },
      heading: 'A repeater passes on whatever it hears',
      text: [
        'A repeater is a station that simultaneously retransmits the signal of another amateur station on a different channel or channels. It hears Jeff on one frequency and sends him out again on another, at the same moment.',
        'It cannot screen what it hears first. So if a rule-breaking message slips through, the person who sent it answers for it, not the repeater.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Jeff talks through the repeater and says something against the rules. The repeater sends it out before anyone can stop it. Who is accountable?',
        options: [
          { id: 'rco', label: 'The repeater\'s control operator', why: 'The repeater\'s control operator is not held accountable for what it passes on by accident.' },
          { id: 'jeff', label: 'Jeff, the control operator of the station that sent it', right: true, why: 'Yes. The control operator of the originating station is accountable.' },
          { id: 'own', label: 'The repeater\'s owner', why: 'The owner did not say it. Accountability is with the station that originated it.' },
          { id: 'both', label: 'Jeff and the repeater\'s owner together', why: 'It is not shared with the owner. It rests with the originating station.' },
        ],
      },
      remember: 'If a repeater accidentally passes on a rule-breaking message, the control operator of the originating station is accountable.',
    },
    {
      type: 'card',
      id: 'club',
      idea: 'Club stations and FCC inspection',
      covers: ['T1F11', 'T1F01'],
      picture: { art: 'club-station' },
      heading: 'Club stations, and showing your station to the FCC',
      text: [
        'Doug, Jeff and some friends want a club station: a station licensed to the club, with its own call sign. A licensed person called the trustee holds the license for the club. The club needs at least four members. The trustee does not need an Amateur Extra license, and the club does not have to register with the ARRL, a private association of hams.',
        'Every station licensee, club or not, must show the station and its records at any time an FCC representative asks. No warrant, waiting period or letter has to come first.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which are real requirements? Tap one, then tap where it goes.',
        slots: [
          { id: 'req', label: 'Required', rule: 'Only two of these are real requirements.' },
          { id: 'not', label: 'Not required', rule: 'This one is a real requirement.' },
        ],
        items: [
          { id: 'a', label: 'At least four club members', slot: 'req', why: 'A club needs at least four members for a club station license.' },
          { id: 'b', label: 'A trustee with an Extra license', slot: 'not', why: 'The trustee must be licensed, but an Extra license is not required.' },
          { id: 'c', label: 'Registering the club with the ARRL', slot: 'not', why: 'The ARRL is a private association. Registering with it is not required.' },
          { id: 'd', label: 'Showing your station when the FCC asks', slot: 'req', why: 'The station and its records must be available any time an FCC representative asks.' },
          { id: 'e', label: 'A warrant before any inspection', slot: 'not', why: 'No warrant or written notice is needed. A request from an FCC representative is enough.' },
        ],
      },
      remember: 'A club station license needs at least four members. Show your station and records to an FCC representative at any time they ask.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T1F03', 'T1F04', 'T1F08', 'T1F11'],
      questions: [
        {
          q: 'Doug starts a long chat at 7:00 and gives his call sign. If he is still talking, by what time must he give it again?',
          review: 'every10',
          covers: ['T1F03'],
          choices: [
            { label: '7:05', why: 'Doug may identify that early, but he does not have to. The limit is 10 minutes, so he has until 7:10.' },
            { label: '7:10', right: true, why: 'At least every 10 minutes during the chat, so by 7:10, and again at the end.' },
            { label: '7:15', why: '15 minutes is too long. The limit is 10 minutes.' },
            { label: 'Only when the chat ends', why: 'The end is not enough on its own. He must also identify at least every 10 minutes.' },
          ],
        },
        {
          q: 'Doug is chatting on voice with a ham who speaks French. How must Doug give his call sign by voice?',
          review: 'voice',
          covers: ['T1F04'],
          choices: [
            { label: 'In French, so the other ham understands', why: 'On phone the call sign must be in English, whatever the other ham speaks.' },
            { label: 'In English', right: true, why: 'When identifying on phone, the call sign must be given in English.' },
            { label: 'In any language he likes', why: 'The rule names one language for identifying on phone: English.' },
          ],
        },
        {
          q: 'Doug sends birthday greetings to Jeff for his neighbor, who has no license. What is that called?',
          review: 'thirdparty',
          covers: ['T1F08'],
          choices: [
            { label: 'A three-way contact', why: 'Only two stations are on the air. The neighbor is a third party, not a third station.' },
            { label: 'Third-party communications', right: true, why: 'A message from one control operator to another on behalf of another person is third-party communications.' },
            { label: 'Remote control', why: 'Remote control is about running a station from afar. This is about whose message it is.' },
          ],
        },
        {
          q: 'Doug, Jeff and one other ham want a club station license. What do they still need?',
          review: 'club',
          covers: ['T1F11'],
          choices: [
            { label: 'Nothing. Three members is enough', why: 'Three is not enough. A club needs at least four members.' },
            { label: 'At least one more member', right: true, why: 'A club station license needs at least four members, so they need one more.' },
            { label: 'A trustee with an Extra license', why: 'An Extra license is not required for the trustee. Members are what they lack.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T1F01', 'T1F02', 'T1F03', 'T1F04', 'T1F05', 'T1F06', 'T1F07', 'T1F08', 'T1F09', 'T1F10', 'T1F11'],
      facts: [
        { icon: IconClock, text: 'Give your call sign at least every 10 minutes during a communication and at the end, even when you also use a tactical call sign.', covers: ['T1F02', 'T1F03'] },
        { icon: IconVoice, text: 'On phone, identify in English, by voice or in CW. Before an indicator, stroke, slant and slash are all fine.', covers: ['T1F04', 'T1F05', 'T1F06'] },
        { icon: IconThird, text: 'Third-party communications: a message from one control operator to another on behalf of another person. To a foreign station it needs a third-party agreement.', covers: ['T1F07', 'T1F08'] },
        { icon: IconRepeater, text: 'A repeater simultaneously retransmits another station on a different channel. If it passes on a violation, the originating station\'s control operator is accountable.', covers: ['T1F09', 'T1F10'] },
        { icon: IconClub, text: 'A club station license needs a club with at least four members.', covers: ['T1F11'] },
        { icon: IconInspect, text: 'Show your station and records at any time an FCC representative asks.', covers: ['T1F01'] },
      ],
    },
  ],
};
export default T1F_IDENTIFICATION;
