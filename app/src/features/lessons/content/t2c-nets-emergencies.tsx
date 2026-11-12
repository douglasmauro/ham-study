import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Nets and emergencies (question group T2C, all 12 questions).
 * One running story: a storm knocks out power and phones in Doug's town, and a net is called.
 * Doug is KJ7ABC and his friend Jeff is K7DEF. Every rule below comes from a T2C question and
 * its keyed answer; the ids are in each step's `covers`. Facts added beyond the pool (the
 * phonetic words themselves, examples of preamble items, the Winlink address form) are listed
 * in the writer's report.
 */

/* ---------- pictures ---------- */

/** The storm: a dark house, a tree down on a car, and Doug's handheld radio. T2C09 */
function Storm({ solved }: PicProps) {
  return (
    <Art label={solved
      ? 'A storm has knocked out power and phones. A tree has fallen on a car with someone trapped. Doug, KJ7ABC, calls for help on his radio, and help is on the way.'
      : 'A storm has knocked out power and phones. A tree has fallen on a car with someone trapped. Doug, KJ7ABC, holds his radio.'}>
      <path class="ga-w" d="M24 30C14 30 14 16 26 16C28 6 46 6 50 14C62 10 70 22 62 30Z" />
      <path class="ga-s" d="M44 32L38 44H46L40 56" />
      <path class="ga-w ga-thin ga-dash" d="M22 38L18 50M58 38L54 50M30 42L26 54" />
      <path class="ga-w" d="M14 120V84L44 64L74 84V120Z" />
      <rect class="ga-fw" x="26" y="92" width="14" height="12" />
      <rect class="ga-fw" x="50" y="92" width="14" height="12" />
      <path class="ga-bad" d="M96 120V108L104 100H136L144 108V120Z" />
      <path class="ga-w ga-thick" d="M164 120V110M164 110L98 94" />
      <circle class="ga-w" cx="88" cy="90" r="11" />
      <T x={120} y={134} a="middle" c="ga-tb">someone trapped</T>
      <rect class="ga-k" x="190" y="72" width="18" height="40" rx="3" />
      <path class="ga-k ga-thick" d="M194 72V50" />
      <path class={solved ? 'ga-good' : 'ga-s'} d="M202 52Q208 46 202 40M208 56Q218 46 208 34" />
      <T x={199} y={128} a="middle" c="ga-tk ga-tb">KJ7ABC</T>
      <T x={150} y={20} a="middle" c="ga-tm">power and phones out</T>
      {solved && <T x={186} y={46} a="end" c="ga-tk">help is coming</T>}
    </Art>
  );
}

const WORDS: [string, number, number][] = [
  ['NEED', 22, 82], ['FORTY', 74, 82], ['COTS', 132, 82], ['AND', 180, 82],
  ['WATER', 22, 118], ['AT', 76, 118], ['NORTH', 104, 118], ['SCHOOL', 158, 118],
];

/** Doug's radiogram: a short preamble, then the text. Solved, each word is numbered and the check reads 8. T2C11 */
function WordCount({ solved }: PicProps) {
  return (
    <Art label={solved
      ? 'A radiogram. The preamble at the top reads number 1, station of origin KJ7ABC, check 8. The text below reads: need forty cots and water at north school. Each word is numbered, 1 to 8.'
      : 'A radiogram. The preamble at the top reads number 1, station of origin KJ7ABC, and the check is still blank. The text below reads: need forty cots and water at north school.'}>
      <rect class="ga-w" x="12" y="8" width="216" height="124" rx="4" />
      <rect class="ga-fk ga-soft" x="12" y="8" width="216" height="30" rx="4" />
      <T x={22} y={28} c="ga-tb">NR 1</T>
      <T x={70} y={28} c="ga-tb">KJ7ABC</T>
      <T x={218} y={28} a="end" c="ga-tk ga-tb">{solved ? 'CHECK 8' : 'CHECK ?'}</T>
      <T x={22} y={52} c="ga-tm">the text</T>
      {WORDS.map(([w, x, y], i) => (
        <>
          <T x={x} y={y} c="ga-mono">{w}</T>
          {solved && <T x={x} y={y - 14} c="ga-tk ga-tb">{String(i + 1)}</T>}
        </>
      ))}
      {solved && <Arrow x1={220} y1={112} x2={220} y2={42} c="ga-k ga-thin" />}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconLife = () => <Mini><path class="ls-mk" d="M24 6L44 40H4Z" /><path class="ls-mk" d="M24 18V30M24 34V35" /></Mini>;
const IconGroups = () => <Mini><rect class="ls-mw" x="4" y="10" width="18" height="28" rx="2" /><path class="ls-mw ls-mthin" d="M8 18H18M8 24H18M8 30H18" /><path class="ls-mk" d="M34 8L44 12V22C44 32 38 38 34 40C30 38 24 32 24 22V12Z" /></Mini>;
const IconNet = () => <Mini><circle class="ls-mk" cx="24" cy="24" r="6" /><circle class="ls-mw" cx="8" cy="10" r="4" /><circle class="ls-mw" cx="40" cy="10" r="4" /><circle class="ls-mw" cx="8" cy="38" r="4" /><circle class="ls-mw" cx="40" cy="38" r="4" /><path class="ls-mw ls-mthin" d="M12 13L19 20M36 13L29 20M12 35L19 28M36 35L29 28" /></Mini>;
const IconForm = () => <Mini><rect class="ls-mw" x="8" y="4" width="32" height="40" rx="2" /><rect class="ls-mk" x="8" y="4" width="32" height="10" rx="2" /><path class="ls-mw ls-mthin" d="M14 22H34M14 29H34M14 36H28" /></Mini>;
const IconSpell = () => (
  <Mini>
    <text class="ls-mt" x="24" y="21" text-anchor="middle">B</text>
    <path class="ls-mk" d="M8 26H40" />
    <text class="ls-mt" x="24" y="42" text-anchor="middle">Bravo</text>
  </Mini>
);
const IconMail = () => <Mini><rect class="ls-mk" x="6" y="14" width="36" height="24" rx="2" /><path class="ls-mk" d="M6 16L24 28L42 16" /><path class="ls-ms ls-mthin" d="M38 4Q44 8 40 12" /></Mini>;

/* ---------- the lesson ---------- */

export const T2C_NETS_EMERGENCIES: Lesson = {
  id: 't2c-nets-emergencies',
  title: 'Nets and emergencies',
  blurb: 'What hams do when a storm takes the phones down: emergency rules, ARES and RACES, nets, and formal messages.',
  sub: 'T2',
  groups: ['T2C'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t2c-nets-emergencies',
      intro: 'Start with a short clip. Then follow Doug, KJ7ABC, through one stormy night on the radio.',
      covers: ['T2C02', 'T2C03', 'T2C05', 'T2C06', 'T2C08', 'T2C09'],
    },
    {
      type: 'card',
      id: 'storm',
      idea: 'Life in danger: the one exception',
      covers: ['T2C01', 'T2C09'],
      picture: { draw: Storm },
      heading: 'The storm hits, and a life is in danger',
      text: [
        'A storm knocks out power and phones in Doug\'s town. Down the street a tree has fallen on a car, and someone is trapped. Doug picks up his radio.',
        'The FCC rules for amateur radio, called Part 97, always apply. But they contain one exception: when human life is in immediate danger, or property needs immediate protection, an operator may go outside the frequency privileges of their license to get help.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'The only station Doug can reach is on a frequency his Technician license does not cover. May he call for help there?',
        options: [
          { id: 'no', label: 'No. He must stay inside his privileges', why: 'Not here. A person\'s life is in immediate danger, and that is exactly the exception the rules allow.' },
          { id: 'plan', label: 'Only if he is part of a RACES or FEMA plan', why: 'No plan or group grants extra frequencies. The exception comes from the danger itself.' },
          { id: 'yes', label: 'Yes, because a life is in immediate danger', right: true, why: 'Right. For the immediate safety of human life or protection of property, he may operate outside his privileges.' },
        ],
      },
      remember: 'You may operate outside your frequency privileges only when the immediate safety of human life or protection of property is at stake. FCC rules always apply.',
    },
    {
      type: 'card',
      id: 'groups',
      idea: 'ARES and RACES',
      covers: ['T2C01', 'T2C04', 'T2C06', 'T2C12'],
      picture: { art: 'races' },
      heading: 'Two groups get the call: ARES and RACES',
      text: [
        'Doug is in ARES, the Amateur Radio Emergency Service. It is a group of licensed amateurs who have volunteered and registered their skills and equipment for public service communications. Jeff, K7DEF, is in RACES, the Radio Amateur Civil Emergency Service.',
        'RACES is a service written into FCC Part 97, for civil defense communications during national emergencies. To join it, Jeff had to be certified by a civil defense agency. Neither group switches off the FCC rules: Doug and Jeff still follow Part 97.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Which group does each line describe? Tap a line, then tap the group.',
        slots: [
          { id: 'ares', label: 'ARES', sub: 'Doug\'s group', rule: 'That is not ARES. ARES is volunteers who registered their skills and gear.' },
          { id: 'races', label: 'RACES', sub: 'Jeff\'s group', rule: 'That is not RACES. RACES is the Part 97 service for civil defense.' },
        ],
        items: [
          { id: 'a', label: 'Volunteers who registered their skills and equipment', slot: 'ares', why: 'Yes. That is ARES: licensed amateurs who signed up to serve the public.' },
          { id: 'b', label: 'Needs certification by a civil defense agency', slot: 'races', why: 'Yes. Jeff was certified by a civil defense agency to join RACES.' },
          { id: 'c', label: 'A Part 97 service for civil defense in national emergencies', slot: 'races', why: 'Yes. RACES is written into the FCC rules for civil defense communications.' },
          { id: 'd', label: 'Doug listed his radio on a sign-up sheet to help', slot: 'ares', why: 'Yes. Registering your equipment ahead of time is how you join ARES.' },
        ],
      },
      remember: 'ARES: licensed volunteers who registered their skills and equipment. RACES: the Part 97 service for civil defense, which needs civil defense certification. FCC rules always apply to both.',
    },
    {
      type: 'card',
      id: 'net',
      idea: 'What net control does',
      covers: ['T2C02'],
      picture: { art: 'net-control-station' },
      heading: 'Jeff calls the net to order',
      text: [
        'A net is an organized meeting on the air, on one frequency. Tonight Jeff is the Net Control Station, often just called net control. He is like the chair of a meeting.',
        'Net control calls the net to order and directs who talks to whom, one station at a time, so messages move in order. The net\'s regular time and frequency were picked by its organizers beforehand, and each operator looks after their own license.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which of these is Jeff\'s job as net control tonight?',
        options: [
          { id: 'time', label: 'Choosing the net\'s regular meeting time', why: 'The schedule and frequency are set by the net\'s organizers ahead of time. Net control runs the session.' },
          { id: 'lic', label: 'Checking every station\'s license', why: 'Each operator is responsible for their own privileges. Net control does not check licenses.' },
          { id: 'run', label: 'Calling the net to order and directing who talks', right: true, why: 'Right. Opening the net and directing communications between stations is what net control does.' },
        ],
      },
      remember: 'The Net Control Station calls the net to order and directs communications between the stations checking in.',
    },
    {
      type: 'card',
      id: 'checkin',
      idea: 'Wait to be called, unless it is an emergency',
      covers: ['T2C07'],
      picture: { art: 'check-in' },
      heading: 'Doug checks in, then waits his turn',
      text: [
        'When Jeff asks for check-ins, Doug gives his call sign, KJ7ABC. Now he is on Jeff\'s list.',
        'From here on Doug transmits only when net control directs him to. There is one exception: an emergency can be reported at any time. That rule is what keeps a busy net from turning into a crowd all talking at once.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Something comes up while Jeff is busy with another station. Tap each one, then tap what Doug should do.',
        slots: [
          { id: 'wait', label: 'Wait for net control', sub: 'transmit when directed', rule: 'This is an emergency. Doug should not wait: he breaks in and reports it now.' },
          { id: 'now', label: 'Break in now', sub: 'emergencies only', rule: 'Only an emergency is a reason to break in. This one can wait.' },
        ],
        items: [
          { id: 'a', label: 'Doug\'s power has just come back on', slot: 'wait', why: 'Good news, but not an emergency. Doug waits until Jeff calls him.' },
          { id: 'b', label: 'Doug sees a house on fire with people inside', slot: 'now', why: 'Yes. Reporting an emergency is the one reason to transmit without being called.' },
          { id: 'c', label: 'Doug wants to ask how Jeff is doing', slot: 'wait', why: 'Right. A chat can wait, or happen after the net.' },
          { id: 'd', label: 'Doug has a message to pass for the shelter', slot: 'wait', why: 'Right. Net control will ask for messages and tell Doug when to send.' },
        ],
      },
      remember: 'In a net, transmit only when net control directs you, unless you are reporting an emergency.',
    },
    {
      type: 'card',
      id: 'traffic',
      idea: 'Traffic and the preamble',
      covers: ['T2C05', 'T2C10'],
      picture: { art: 'preamble' },
      heading: '"Any traffic?" Doug has a message',
      text: [
        'Jeff asks if anyone has traffic. On a net, traffic means formal messages that net stations pass to one another. A formal message written on a standard form is called a radiogram.',
        'A radiogram starts with the preamble. It is like the tracking label on a parcel: it holds the information needed to track the message, such as its number, the station where it started and the date. The name, street and phone number of the person receiving it go below, in the address.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Doug is filling in his radiogram. Put each item where it belongs on the form.',
        slots: [
          { id: 'pre', label: 'Preamble', sub: 'to track the message', rule: 'That is not tracking information. It tells you who receives the message, so it goes in the address.' },
          { id: 'addr', label: 'Address', sub: 'who receives it', rule: 'That is not about who receives it. It helps track the message, so it goes in the preamble.' },
        ],
        items: [
          { id: 'a', label: 'Message number 1', slot: 'pre', why: 'Yes. The number lets the message be tracked, so it is in the preamble.' },
          { id: 'b', label: 'Station of origin: KJ7ABC', slot: 'pre', why: 'Yes. Where the message started is tracking information.' },
          { id: 'c', label: 'Street of the person receiving it', slot: 'addr', why: 'Right. Where it is going belongs in the address, not the preamble.' },
          { id: 'd', label: 'Phone number of the person receiving it', slot: 'addr', why: 'Right. The addressee\'s phone number goes with the address.' },
        ],
      },
      remember: 'Traffic means formal messages exchanged by net stations. A message\'s preamble holds the information needed to track it.',
    },
    {
      type: 'card',
      id: 'check',
      idea: 'The check is a word count',
      covers: ['T2C11'],
      picture: { draw: WordCount },
      heading: 'The check: count the words',
      text: [
        'One box in the preamble is called the check. The check is the number of words, or word equivalents, in the text of the message.',
        'Jeff counts the words he copies and compares his count with the check. If the numbers differ, a word was lost or added along the way, and they can fix it before the message goes on.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Count the words in Doug\'s text. What should he write as the check?',
        options: [
          { id: '2', label: '2', why: 'That counts the lines. The check counts every word in the text.' },
          { id: 'call', label: 'KJ7ABC', why: 'That is the station of origin, a separate box. The check is a number.' },
          { id: '8', label: '8', right: true, why: 'Right. Need, forty, cots, and, water, at, north, school: 8 words, so the check is 8.' },
        ],
      },
      remember: 'The check in a radiogram header is the number of words or word equivalents in the text.',
    },
    {
      type: 'card',
      id: 'spell',
      idea: 'Spell unusual words phonetically',
      covers: ['T2C03'],
      picture: { art: 'phonetic-alphabet' },
      heading: 'Jeff copied BOTS. Doug spells it out',
      text: [
        'Many letters sound alike on the air: B, C, D, P and T are easy to mix up. Jeff copied the word COTS as BOTS.',
        'The fix is a standard phonetic alphabet, which gives each letter its own word: Alfa for A, Bravo for B, Charlie for C, and so on. Doug says: COTS, Charlie Oscar Tango Sierra. It works for call signs too: KJ7ABC is Kilo Juliett Seven Alfa Bravo Charlie.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What is the standard way for Doug to make sure an unusual word arrives right?',
        options: [
          { id: 'morse', label: 'Say it, then send it again in Morse code', why: 'That is not the standard practice, and many stations on a voice net could not copy Morse.' },
          { id: 'spell', label: 'Spell it with the phonetic alphabet', right: true, why: 'Right. Each letter becomes a word that cannot be mistaken, so the word arrives exactly.' },
          { id: 'qsr', label: 'Ask Jeff to repeat it back using the Q signal QSR', why: 'A read-back with QSR is not the standard technique. Spelling it phonetically is.' },
        ],
      },
      remember: 'To make sure unusual words are copied correctly by voice, spell them with a standard phonetic alphabet.',
    },
    {
      type: 'card',
      id: 'winlink',
      idea: 'Winlink: email by radio',
      covers: ['T2C08'],
      picture: { art: 'winlink' },
      heading: 'An email with no internet: Winlink',
      text: [
        'The shelter also needs to send a long supply list to an office far outside town, and the internet is down. Doug uses Winlink, a system that carries email over amateur radio.',
        'On Winlink, each person\'s email address is built from their call sign, so Doug\'s is KJ7ABC at winlink dot org. FT8, PSK31 and AMTOR are ways of sending signals on the air, but none of them is an email system.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which one can deliver Doug\'s list as an email to an address based on a call sign?',
        options: [
          { id: 'ft8', label: 'FT8', why: 'FT8 is a digital mode for short contacts with weak signals. It does not carry email.' },
          { id: 'wl', label: 'Winlink', right: true, why: 'Right. Winlink relays email, and its addresses are based on amateur call signs.' },
          { id: 'psk', label: 'PSK31', why: 'PSK31 is a digital mode for live typed chat. It is not an email system.' },
        ],
      },
      remember: 'Winlink relays messages using email addresses based on amateur call signs.',
    },
    {
      type: 'check',
      id: 'quiz',
      covers: ['T2C01', 'T2C07', 'T2C11', 'T2C12'],
      questions: [
        {
          q: 'Jeff jokes that RACES has been switched on, so the FCC rules are off for the night. Is he right?',
          review: 'groups',
          covers: ['T2C01'],
          choices: [
            { label: 'Yes, RACES rules take over', why: 'RACES is itself part of the FCC rules. It does not replace them.' },
            { label: 'No, FCC rules always apply', right: true, why: 'Whenever an amateur station is on the air, the FCC Part 97 rules apply.' },
            { label: 'Only for ARES members', why: 'No group, ARES or RACES, can switch off the FCC rules.' },
          ],
        },
        {
          q: 'Doug is checked in to the net. When may he transmit without net control calling on him?',
          review: 'checkin',
          covers: ['T2C07'],
          choices: [
            { label: 'Whenever the frequency is quiet', why: 'A quiet moment is not enough. In a net you wait for net control.' },
            { label: 'Only to report an emergency', right: true, why: 'An emergency is the one reason to transmit without being directed by net control.' },
            { label: 'Whenever he has a message', why: 'Messages wait until net control asks for traffic and directs him.' },
          ],
        },
        {
          q: 'A message says: ROAD CLOSED AT RIVER BRIDGE. What is its check?',
          review: 'check',
          covers: ['T2C11'],
          choices: [
            { label: '5', right: true, why: 'Road, closed, at, river, bridge: 5 words, and the check is the word count.' },
            { label: '1', why: 'That counts the lines. The check counts the words in the text.' },
            { label: 'The sender\'s call sign', why: 'The sender\'s call sign is the station of origin. The check is a number.' },
          ],
        },
        {
          q: 'Before he could serve, Jeff had to be certified by a civil defense agency. Which group did he join?',
          review: 'groups',
          covers: ['T2C04', 'T2C12'],
          choices: [
            { label: 'ARES', why: 'ARES members register as volunteers. No civil defense certification is needed.' },
            { label: 'RACES', right: true, why: 'RACES serves civil defense, and its operators need civil defense certification.' },
            { label: 'Any net he checks in to', why: 'Checking in to a net needs only your license and your call sign.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T2C01', 'T2C02', 'T2C03', 'T2C04', 'T2C05', 'T2C06', 'T2C07', 'T2C08', 'T2C09', 'T2C10', 'T2C11', 'T2C12'],
      facts: [
        { icon: IconLife, text: 'FCC rules always apply. You may go outside your frequency privileges only for the immediate safety of human life or protection of property.', covers: ['T2C01', 'T2C09'] },
        { icon: IconGroups, text: 'ARES is licensed volunteers who registered their skills and equipment. RACES is the Part 97 service for civil defense, and needs civil defense certification.', covers: ['T2C04', 'T2C06', 'T2C12'] },
        { icon: IconNet, text: 'Net control calls the net to order and directs communications. Transmit only when it directs you, unless you are reporting an emergency.', covers: ['T2C02', 'T2C07'] },
        { icon: IconForm, text: 'Traffic means formal messages. The preamble holds what is needed to track a message, and the check is the number of words in its text.', covers: ['T2C05', 'T2C10', 'T2C11'] },
        { icon: IconSpell, text: 'Spell unusual words with a standard phonetic alphabet so they are copied correctly.', covers: ['T2C03'] },
        { icon: IconMail, text: 'Winlink relays email using addresses based on amateur call signs.', covers: ['T2C08'] },
      ],
    },
  ],
};
export default T2C_NETS_EMERGENCIES;
