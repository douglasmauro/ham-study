import { Art, Mini, T } from '../drawkit';
import type { Lesson } from '../types';

/*
 * Control operators (question group T1E, all 11 questions).
 * Every rule below comes from a T1E question and its keyed answer; the ids are in each
 * step's `covers`. Doug (KJ7ABC) is the learner, Jeff (K7DEF) his friend.
 */

/* ---------- shapes ---------- */

const r1 = (n: number) => +n.toFixed(1);

/** A standing stick figure, 38 units tall, feet at (x, y). Same shape as the glossary drawings. */
function Person({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) {
  return <path class={c} d={`M${x - 5} ${y - 33}a5 5 0 1 0 10 0a5 5 0 1 0 -10 0M${x} ${y - 28}V${y - 12}M${x - 8} ${y - 17}L${x} ${y - 24}L${x + 8} ${y - 17}M${x - 6} ${y}L${x} ${y - 12}L${x + 6} ${y}`} />;
}

/** A desk radio, 40 x 22, top left at (x, y). */
function Rig({ x, y, c = 'ga-w' }: { x: number; y: number; c?: string }) {
  return <path class={c} d={`M${x} ${y}h40v22h-40ZM${x + 5} ${y + 8}h14M${x + 28} ${y + 11}a4 4 0 1 0 8 0a4 4 0 1 0 -8 0`} />;
}

/** A small lattice tower on `base`, `h` tall, with an antenna on top. */
function Tower({ x, base, h, c = 'ga-w' }: { x: number; base: number; h: number; c?: string }) {
  const w = 8;
  let d = `M${x - w} ${base}L${x - 3} ${base - h}M${x + w} ${base}L${x + 3} ${base - h}`;
  const n = Math.max(3, Math.round(h / 14));
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n, s = i % 2 ? 1 : -1;
    const half = (t: number) => w - (w - 3) * t;
    d += `M${r1(x + s * half(t0))} ${r1(base - h * t0)}L${r1(x - s * half(t1))} ${r1(base - h * t1)}`;
  }
  d += `M${x} ${base - h}v-8`;
  return <path class={c} d={d} />;
}

/* ---------- pictures ---------- */

/** Doug at Jeff's radio, under a band split into an Extra-only segment and a part his license allows. T1E04, T1E06 */
function Privileges() {
  return (
    <Art label="Doug, a Technician, sits at the controls of Jeff's radio while Jeff, an Amateur Extra, stands beside him. Above them a band is split in two: an Extra-only segment, crossed out for Doug, and a part his Technician license allows, ticked.">
      <T x={120} y={16} a="middle" c="ga-tm">what Doug may use at the controls</T>
      <rect class="ga-w ga-dash" x="14" y="26" width="100" height="26" rx="3" />
      <T x={22} y={44} c="ga-tm">Extra only</T>
      <path class="ga-bad" d="M94 34l10 10M104 34l-10 10" />
      <rect class="ga-fk ga-soft" x="120" y="26" width="106" height="26" rx="3" />
      <rect class="ga-k" x="120" y="26" width="106" height="26" rx="3" />
      <T x={128} y={44} c="ga-tk ga-tb">Technician</T>
      <path class="ga-good" d="M206 40l4 4l8 -10" />
      <Person x={40} y={110} c="ga-k" />
      <path class="ga-w" d="M52 98H122M58 98V110M116 98V110" />
      <Rig x={66} y={76} />
      <Person x={190} y={110} />
      <T x={60} y={128} a="middle" c="ga-tk ga-tb">Doug, Technician</T>
      <T x={190} y={128} a="middle">Jeff, Extra</T>
    </Art>
  );
}

/** Local, remote and automatic control side by side. T1E08, T1E09, T1E10 */
function ThreeKinds() {
  return (
    <Art label="Three small scenes. Local: a person sits at the radio. Remote: a person with a laptop is joined by a dashed control link to a distant radio. Automatic: a repeater tower run by a controller box, with nobody there.">
      <path class="ga-w ga-thin" d="M80 30V112M160 30V112" />

      <T x={40} y={20} a="middle" c="ga-tk ga-tb">local</T>
      <Person x={16} y={98} c="ga-k" />
      <path class="ga-w" d="M26 90H72M30 90V98M68 90V98" />
      <rect class="ga-w" x="32" y="70" width="34" height="20" rx="2" />
      <path class="ga-w ga-thin" d="M37 78h12M58 80a3 3 0 1 0 0.1 0" />
      <T x={40} y={126} a="middle" c="ga-tm">at the radio</T>

      <T x={120} y={20} a="middle" c="ga-tk ga-tb">remote</T>
      <Person x={94} y={98} c="ga-k" />
      <path class="ga-w" d="M102 86h12v-12" />
      <path class="ga-k ga-dash" d="M116 66H128" />
      <rect class="ga-w" x="130" y="54" width="24" height="16" rx="2" />
      <T x={120} y={126} a="middle" c="ga-tm">over a link</T>

      <T x={200} y={20} a="middle" c="ga-tk ga-tb">automatic</T>
      <Tower x={182} base={98} h={52} />
      <rect class="ga-fk ga-soft" x="196" y="76" width="32" height="22" rx="3" />
      <rect class="ga-k" x="196" y="76" width="32" height="22" rx="3" />
      <T x={212} y={91} a="middle" c="ga-tk">auto</T>
      <path class="ga-w ga-thin" d="M188 90H196" />
      <T x={200} y={126} a="middle" c="ga-tm">on its own</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconPerson = () => <Mini><path class="ls-mk" d="M19 11a5 5 0 1 0 10 0a5 5 0 1 0 -10 0M24 16V30M15 23L24 18L33 23M17 42L24 30L31 42" /></Mini>;
const IconBoth = () => <Mini><path class="ls-mk" d="M8 13a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M12 17V29M7 42L12 29L17 42" /><path class="ls-mw" d="M32 13a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M36 17V29M31 42L36 29L41 42" /><path class="ls-ms ls-mthin" d="M18 24H30" /></Mini>;
const IconBand = () => <Mini><rect class="ls-mw" x="4" y="16" width="16" height="16" rx="2" /><rect class="ls-mk" x="24" y="16" width="20" height="16" rx="2" /><path class="ls-mw ls-mthin" d="M7 40L17 8" /></Mini>;
const IconPoint = () => <Mini><circle class="ls-mk ls-mthin" cx="24" cy="24" r="18" stroke-dasharray="4 4" /><rect class="ls-mw" x="14" y="20" width="20" height="10" rx="2" /></Mini>;
const IconLink = () => <Mini><rect class="ls-mw" x="4" y="18" width="10" height="12" rx="2" /><path class="ls-mk ls-mthin" d="M16 24H32" stroke-dasharray="3 3" /><rect class="ls-mw" x="34" y="18" width="10" height="12" rx="2" /></Mini>;
const IconAuto = () => <Mini><path class="ls-mw" d="M14 44L20 10M26 44L20 10M16 32H24M18 22H22" /><rect class="ls-mk" x="28" y="30" width="16" height="12" rx="2" /><path class="ls-ms ls-mthin" d="M26 6A8 8 0 0 1 26 18" /></Mini>;

/* ---------- the lesson ---------- */

export const T1E_CONTROL_OPERATOR: Lesson = {
  id: 't1e-control-operator',
  title: 'Control operators',
  blurb: 'Who is in charge of every transmission, where they control it from, and who answers for it.',
  sub: 'T1',
  groups: ['T1E'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t1e-control-operator',
      intro: 'Start with a short clip. After it you will meet each rule in a small situation.',
      covers: ['T1E01', 'T1E03', 'T1E04', 'T1E05', 'T1E07', 'T1E08', 'T1E09', 'T1E10', 'T1E11'],
    },
    {
      type: 'card',
      id: 'who',
      idea: 'The control operator is chosen by the station licensee',
      covers: ['T1E11', 'T1E03'],
      picture: { art: 'control-operator' },
      heading: 'One licensed person is in charge of every transmission',
      text: [
        'Doug, KJ7ABC, owns a station. His license covers it, so he is the station licensee. The person in charge of what the station sends, and of following the FCC rules while it sends, is called the control operator.',
        'The station licensee picks the control operator. It is often the licensee himself, but Doug may name another licensed ham, such as his friend Jeff, K7DEF.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Jeff visits and wants to make some contacts on Doug\'s station. Who decides that Jeff may be its control operator?',
        options: [
          { id: 'jeff', label: 'Jeff, because he holds a license', why: 'Holding a license does not let Jeff appoint himself at someone else\'s station. The station\'s licensee decides.' },
          { id: 'doug', label: 'Doug, the station licensee', right: true, why: 'Yes. The station licensee designates the control operator, and here that is Doug.' },
          { id: 'fcc', label: 'The FCC', why: 'The FCC issues licenses, but it does not pick who runs a particular station. The licensee does.' },
        ],
      },
      remember: 'A control operator is an amateur operator designated by the station licensee to be responsible for the transmissions and for following FCC rules.',
    },
    {
      type: 'card',
      id: 'both',
      idea: 'Licensee and control operator are both responsible',
      covers: ['T1E07'],
      picture: { art: 'station-licensee' },
      heading: 'Lending your station shares the responsibility',
      text: [
        'Doug designates Jeff and goes out. Jeff is now the control operator, so Jeff must follow the rules for everything he sends.',
        'But it is still Doug\'s station. Handing it to Jeff does not hand off all of Doug\'s duty: the licensee stays answerable for how his station is run.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'While Doug is out, Jeff makes a transmission that breaks a rule. Who is responsible for the proper operation of the station?',
        options: [
          { id: 'jeff', label: 'Only Jeff, the control operator', why: 'Jeff is responsible, but not alone. The station licensee stays responsible too.' },
          { id: 'doug', label: 'Only Doug, the station licensee', why: 'Doug is responsible, but not alone. The person running the station is responsible too.' },
          { id: 'both', label: 'Both Jeff and Doug', right: true, why: 'Right. When the control operator is not the station licensee, both are responsible.' },
        ],
      },
      remember: 'When the control operator is not the station licensee, the control operator and the station licensee are both responsible.',
    },
    {
      type: 'card',
      id: 'privileges',
      idea: 'Privileges come from the control operator\'s license',
      covers: ['T1E04', 'T1E06', 'T1E02'],
      picture: { draw: Privileges },
      heading: 'The control operator\'s license sets the frequencies',
      text: [
        'Each license class allows certain frequencies, and some segments of a band are for Amateur Extra licensees only. A station may only transmit where the license class of its control operator allows. Suppose Jeff holds an Amateur Extra license and Doug is a Technician. When Doug runs Jeff\'s radio, Doug\'s own Technician privileges apply.',
        'Nothing lends Doug more: not Jeff\'s say-so, not a contest team, not a club whose trustee is an Extra. A satellite works the same way. Anyone allowed to transmit on its uplink, the frequency you send up on, may be the control operator.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Doug is a Technician. Sort what he may do as control operator. Tap a situation, then tap where it goes.',
        slots: [
          { id: 'may', label: 'Doug may', rule: 'Ask whether Doug\'s own Technician license allows that frequency.' },
          { id: 'not', label: 'Doug may not', rule: 'Here Doug stays inside what his own license allows.' },
        ],
        items: [
          { id: 'a', label: 'Extra segment at Jeff\'s station', slot: 'not', why: 'Doug is the control operator, so his Technician license sets the limit, whoever owns the radio.' },
          { id: 'b', label: 'Satellite whose uplink he may use', slot: 'may', why: 'Anyone allowed to transmit on the satellite\'s uplink frequency may be the control operator. No special class is needed.' },
          { id: 'c', label: 'Extra segment on a contest team', slot: 'not', why: 'A contest team gets no exception. Each control operator stays within his own privileges.' },
          { id: 'd', label: 'Extra segment at a club with an Extra trustee', slot: 'not', why: 'The trustee\'s license does not stretch the privileges of whoever is the control operator.' },
        ],
      },
      remember: 'The control operator\'s license class sets the station\'s frequency privileges. Apart from emergencies, a Technician may never be control operator in an Amateur Extra segment.',
    },
    {
      type: 'card',
      id: 'point',
      idea: 'The control point is where the control operator works',
      covers: ['T1E05'],
      picture: { art: 'control-point' },
      heading: 'The control point is where the operator is, not the antenna',
      text: [
        'The control point is the place where the control operator does the job of controlling the station.',
        'It is not where the antenna stands, where the transmitter sits, or the licensee\'s mailing address. The radio could be on a hilltop while the person running it sits at home.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug\'s radio and antenna are in a shed at the far end of his yard. He works them from a laptop at his kitchen table. Where is the control point?',
        options: [
          { id: 'shed', label: 'The shed, where the transmitter is', why: 'The transmitter can be away from the person running it. Where it sits is not the control point.' },
          { id: 'ant', label: 'The antenna', why: 'The antenna\'s location is not the control point. Control happens where the operator is.' },
          { id: 'table', label: 'The kitchen table', right: true, why: 'Yes. Doug performs the control operator function at the kitchen table, so that is the control point.' },
          { id: 'mail', label: 'Doug\'s mailing address', why: 'A mailing address is only for letters. It has nothing to do with controlling the station.' },
        ],
      },
      remember: 'The control point is the location at which the control operator function is performed.',
    },
    {
      type: 'card',
      id: 'kinds',
      idea: 'Local, remote and automatic control',
      covers: ['T1E08', 'T1E09', 'T1E10'],
      picture: { draw: ThreeKinds },
      heading: 'Three ways to control a station',
      text: [
        'Local control: the control operator is right at the station. Remote control: the operator runs it from somewhere else through a control link, for example over the internet. Any amateur station may be remotely controlled. Automatic control: devices and procedures run the station with no control operator at the control point. A repeater is the usual example.',
        'A computer that sends Morse code or your call sign for you is only a tool. If you are sitting at the radio, it is still local control.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which kind of control is each one? Tap a situation, then tap the kind.',
        slots: [
          { id: 'local', label: 'Local', sub: 'at the station', rule: 'Local means the control operator is right at the station.' },
          { id: 'remote', label: 'Remote', sub: 'through a link', rule: 'Remote means a person runs the station from elsewhere through a control link.' },
          { id: 'auto', label: 'Automatic', sub: 'nobody there', rule: 'Automatic means devices run the station with no one at the control point.' },
        ],
        items: [
          { id: 'a', label: 'Doug talks into the microphone at his radio', slot: 'local', why: 'Doug is at the station itself, so this is local control.' },
          { id: 'b', label: 'Doug runs his home station over the internet from work', slot: 'remote', why: 'Doug controls the station from afar through an internet link: remote control.' },
          { id: 'c', label: 'A repeater relays signals at 3 a.m. with nobody watching', slot: 'auto', why: 'The repeater runs on its own with no one at the control point: automatic control.' },
          { id: 'd', label: 'Doug sits at his radio while a computer sends his Morse code', slot: 'local', why: 'The computer is just a tool. Doug is at the controls, so this is local control.' },
        ],
      },
      remember: 'Repeater operation is automatic control. Operating over the internet is remote control, and any station may be remotely controlled.',
    },
    {
      type: 'card',
      id: 'always',
      idea: 'There is always a control operator',
      covers: ['T1E01'],
      picture: { art: 'automatic-control' },
      heading: 'Even a repeater has a control operator',
      text: [
        'Under automatic control nobody has to sit at the control point. That does not mean nobody is in charge.',
        'An amateur station never transmits without a control operator. The repeater on the hill still has a licensed person who is responsible for it, even at 3 a.m.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A repeater runs all night with no one at its controls. Which is true?',
        options: [
          { id: 'none', label: 'It has no control operator, and that is allowed for repeaters', why: 'No station may transmit without a control operator, repeaters included. Only being at the controls is not needed.' },
          { id: 'has', label: 'It still has a control operator, who need not be at the control point', right: true, why: 'Right. Automatic control removes the need to be there, not the need for a responsible person.' },
          { id: 'off', label: 'It must switch off until someone sits at the controls', why: 'Automatic control is allowed for a repeater. Nobody needs to be at the control point.' },
        ],
      },
      remember: 'An amateur station may never transmit without a control operator.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T1E04', 'T1E05', 'T1E07', 'T1E08'],
      questions: [
        {
          q: 'Doug, a Technician, is at the controls of Jeff\'s station. What decides which frequencies Doug may transmit on?',
          review: 'privileges',
          covers: ['T1E04'],
          choices: [
            { label: 'Jeff\'s license, because it is his station', why: 'The owner\'s license does not count here. The control operator\'s license does.' },
            { label: 'Doug\'s own license class', right: true, why: 'Doug is the control operator, and the control operator\'s license class sets the privileges.' },
            { label: 'The highest license of anyone in the room', why: 'Being in the room does not count. Only the control operator\'s license matters.' },
          ],
        },
        {
          q: 'Doug\'s radio is in the garage. He runs it from a laptop in the living room. Where is the control point?',
          review: 'point',
          covers: ['T1E05'],
          choices: [
            { label: 'The garage', why: 'That is where the radio is. The control point is where Doug controls it from.' },
            { label: 'The living room', right: true, why: 'The control point is where the control operator does the job: the living room.' },
          ],
        },
        {
          q: 'Jeff borrows Doug\'s station with Doug\'s permission. Who has to make sure it is run properly?',
          review: 'both',
          covers: ['T1E07'],
          choices: [
            { label: 'Only Jeff', why: 'Jeff is responsible, but Doug as station licensee is responsible too.' },
            { label: 'Only Doug', why: 'Doug is responsible, but Jeff as control operator is responsible too.' },
            { label: 'Both of them', right: true, why: 'The control operator and the station licensee are both responsible.' },
          ],
        },
        {
          q: 'A station keeps working on its own, run by devices, with nobody at the control point. What kind of control is that?',
          review: 'kinds',
          covers: ['T1E08'],
          choices: [
            { label: 'Local control', why: 'Local control means the operator is right at the station. Here nobody is.' },
            { label: 'Remote control', why: 'Remote control still has a person running the station through a link. Here devices do it.' },
            { label: 'Automatic control', right: true, why: 'Devices and procedures running the station with no one at the control point is automatic control.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T1E01', 'T1E02', 'T1E03', 'T1E04', 'T1E05', 'T1E06', 'T1E07', 'T1E08', 'T1E09', 'T1E10', 'T1E11'],
      facts: [
        { icon: IconPerson, text: 'The control operator is designated by the station licensee to be responsible for the transmissions and for following FCC rules.', covers: ['T1E03', 'T1E11'] },
        { icon: IconBoth, text: 'When someone else is control operator, they and the station licensee are both responsible.', covers: ['T1E07'] },
        { icon: IconBand, text: 'The control operator\'s license class sets the frequencies. A Technician may never be control operator in an Extra segment, outside emergencies. For a satellite, anyone allowed on its uplink may be control operator.', covers: ['T1E02', 'T1E04', 'T1E06'] },
        { icon: IconPoint, text: 'The control point is where the control operator function is performed.', covers: ['T1E05'] },
        { icon: IconLink, text: 'Running a station over the internet is remote control, and any station may be remotely controlled.', covers: ['T1E09', 'T1E10'] },
        { icon: IconAuto, text: 'A repeater runs under automatic control, but no station ever transmits without a control operator.', covers: ['T1E01', 'T1E08'] },
      ],
    },
  ],
};
export default T1E_CONTROL_OPERATOR;
