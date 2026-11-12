import { Mini } from '../drawkit';
import type { Lesson } from '../types';

/*
 * Lesson: What you may and may not transmit (question group T1D, all 12 questions).
 * Each card is a small situation, then the rule and its one exception, then a choice or sort.
 * Every fact comes from a T1D question and its keyed answer; the ids are in each step's `covers`.
 * The learner is Doug, KJ7ABC; his friend is Jeff, K7DEF.
 */

/* ---------- recap icons ---------- */

const IconGlobe = () => <Mini><circle class="ls-mk" cx="24" cy="24" r="18" /><path class="ls-mk ls-mthin" d="M6 24H42M24 6C14 16 14 32 24 42M24 6C34 16 34 32 24 42" /></Mini>;
const IconBroadcast = () => <Mini><path class="ls-mw" d="M18 38L24 12L30 38M20 30H28" /><circle class="ls-mk" cx="24" cy="24" r="19" /><path class="ls-mk" d="M11 11L37 37" /></Mini>;
const IconMusic = () => <Mini><path class="ls-mk" d="M18 36V10L38 6V32" /><circle class="ls-mk" cx="13" cy="36" r="5" /><circle class="ls-mk" cx="33" cy="32" r="5" /></Mini>;
const IconLock = () => <Mini><rect class="ls-mk" x="10" y="22" width="28" height="20" rx="3" /><path class="ls-mk" d="M16 22V15A8 8 0 0 1 32 15V22" /></Mini>;
const IconPay = () => <Mini><circle class="ls-mk" cx="24" cy="24" r="17" /><path class="ls-ms" d="M30 17H21A4 4 0 0 0 21 25H27A4 4 0 0 1 27 33H17M24 12V36" /></Mini>;
const IconId = () => (
  <Mini>
    <rect class="ls-mk" x="4" y="12" width="40" height="22" rx="4" />
    <path class="ls-mk" d="M12 34L10 42L20 34" />
    <path class="ls-ms ls-mthin" d="M11 23H37" />
  </Mini>
);

/* ---------- the lesson ---------- */

export const T1D_TRANSMISSIONS: Lesson = {
  id: 't1d-transmissions',
  title: 'What you may and may not transmit',
  blurb: 'Who you may talk to, and the rules on broadcasting, music, codes, pay, selling and identifying.',
  sub: 'T1',
  groups: ['T1D'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t1d-transmissions',
      intro: 'Start with a short clip. After it you will sort real situations into allowed and not allowed.',
      covers: ['T1D02', 'T1D03', 'T1D04', 'T1D05', 'T1D08', 'T1D10'],
    },
    {
      type: 'card',
      id: 'countries',
      idea: 'Countries that object through the ITU',
      covers: ['T1D01'],
      picture: { art: 'itu' },
      heading: 'Who you may talk to',
      text: [
        'Doug hears a ham calling from another country. Can he answer? Almost always. There is one limit, and it is set between governments.',
        'The ITU, the International Telecommunication Union, is the United Nations agency that coordinates radio between countries. If a country\'s government tells the ITU it objects to contacts with US hams, US hams may not exchange communications with that country.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Where does a country register that it objects to amateur contacts?',
        options: [
          { id: 'arrl', label: 'With the ARRL', why: 'The ARRL is a private US association of hams. Governments do not register objections with it.' },
          { id: 'itu', label: 'With the ITU', right: true, why: 'Yes. A government that objects tells the ITU, and US hams may then not contact that country.' },
          { id: 'iara', label: 'With the IARU, the union of ham radio clubs', why: 'The IARU is a federation of amateur radio societies. It has no power to ban a country.' },
        ],
      },
      remember: 'US hams may not contact a country whose government has told the ITU that it objects.',
    },
    {
      type: 'card',
      id: 'broadcast',
      idea: 'No broadcasting; one-way signals for hams are fine',
      covers: ['T1D10', 'T1D02'],
      picture: { art: 'broadcasting' },
      heading: 'Talk to hams, not to the public',
      text: [
        'An FM music station talks to everyone who tunes in. That is broadcasting: transmissions intended for reception by the general public. Amateurs may not broadcast.',
        'Some one-way transmissions are allowed, because they are meant for hams or for equipment: Morse code practice, bulletins about ham radio, telecommand (control signals sent to a device) and telemetry (readings a device sends back).',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Each of these is one-way. Sort them. Tap one, then tap allowed or not allowed.',
        slots: [
          { id: 'ok', label: 'Allowed', rule: 'A show aimed at the general public is broadcasting, and amateurs may not broadcast.' },
          { id: 'no', label: 'Not allowed', rule: 'One-way signals meant for hams, or to control equipment, are allowed.' },
        ],
        items: [
          { id: 'cw', label: 'Morse practice', slot: 'ok', why: 'Allowed. One-way code practice is one of the listed exceptions.' },
          { id: 'show', label: 'Talk show for all', slot: 'no', why: 'Not allowed. A talk show for anyone who tunes in is meant for the general public, so it is broadcasting.' },
          { id: 'news', label: 'Ham event notice', slot: 'ok', why: 'Allowed. A notice about a ham radio event is a bulletin for hams, not broadcasting.' },
          { id: 'tlm', label: 'Balloon readings', slot: 'ok', why: 'Allowed. Readings sent down from a weather balloon are telemetry, a one-way signal from a device.' },
        ],
      },
      remember: 'Broadcasting means transmissions intended for the general public, and it is prohibited. Code practice, bulletins for hams, telecommand and telemetry are allowed.',
    },
    {
      type: 'card',
      id: 'auxiliary',
      idea: 'An auxiliary station is a link inside a system',
      covers: ['T1D07'],
      picture: { art: 'auxiliary-station' },
      heading: 'A one-way link inside a repeater system',
      text: [
        'Jeff helps run a repeater. Its receiver sits on one hill, where it hears well, and the main transmitter sits on another. A radio link carries what the receiver hears over to the transmitter, one way.',
        'That link is an auxiliary station: a station sending point-to-point signals inside a system of cooperating ham stations. In the rules, auxiliary does not mean spare or extra.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which of these is an auxiliary station?',
        options: [
          { id: 'spare', label: 'Doug\'s backup radio, kept in case his main one fails', why: 'A backup radio is just spare equipment. That is not what auxiliary means in the rules.' },
          { id: 'link', label: 'The link from the remote receiver to the main repeater transmitter', right: true, why: 'Yes. A one-way, point-to-point link inside a repeater system is an auxiliary station.' },
          { id: 'second', label: 'A second station at a busy contest site', why: 'A second station at a contest is simply another station, not an auxiliary station.' },
        ],
      },
      remember: 'An auxiliary station sends one-way, point-to-point signals within a system, such as from a remote repeater receiver to the main transmitter.',
    },
    {
      type: 'card',
      id: 'music',
      idea: 'Music and news: one exception each',
      covers: ['T1D04', 'T1D09'],
      picture: { art: 'music' },
      heading: 'No music, no help for the news, with one exception each',
      text: [
        'Music is not allowed on the air, however short the clip or clean the signal. The one exception: music that happens to be in an authorized retransmission of manned spacecraft communications, such as a relay of astronauts in space.',
        'Hams also may not help broadcasting, program production or news gathering, except when it is directly about the immediate safety of human life or protection of property, and nothing else is available.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A storm has cut the phones. A local radio station needs to warn people which bridge is about to flood, and Doug\'s radio is the only link. May he pass on the warning?',
        options: [
          { id: 'never', label: 'No. Hams may never help a broadcaster', why: 'Never is too strict. There is an exception when lives or property are in immediate danger.' },
          { id: 'safety', label: 'Yes. It is about immediate safety, and there is no other way', right: true, why: 'Right. Lives and property are at immediate risk and nothing else is available, so the exception applies.' },
          { id: 'nonprofit', label: 'Yes, but only if the station is non-commercial', why: 'Whether the station is commercial does not matter. The test is immediate safety of life or property.' },
        ],
      },
      remember: 'Music only when incidental to an authorized retransmission of manned spacecraft communications. Help for broadcasting or news only for the immediate safety of life or property.',
    },
    {
      type: 'card',
      id: 'open',
      idea: 'No hidden codes, no indecent language',
      covers: ['T1D03', 'T1D06'],
      picture: { art: 'encoded-messages' },
      heading: 'Say it in the open',
      text: [
        'Anyone may listen to the ham bands, so what you send must be open. You may not encode a message to hide its meaning. The one exception is control commands sent to a space station or to a model craft: there, secrecy keeps strangers from taking control.',
        'Since anyone may be listening, obscene or indecent language is prohibited too. There is no official list of banned words. Any such language is out.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug and Jeff want to plan a surprise party on the air, in a private code so their friends cannot follow. May they?',
        options: [
          { id: 'short', label: 'Yes, if the coded part is short', why: 'Length does not matter. Messages may not be coded to hide their meaning.' },
          { id: 'no', label: 'No. Only control commands to space stations or model craft may be encoded', right: true, why: 'Right. A party plan is not a control command, so it must be sent in the open.' },
          { id: 'yes', label: 'Yes. Hams may use any code they like', why: 'Codes that hide the meaning are not allowed, apart from control commands to space stations or model craft.' },
        ],
      },
      remember: 'Messages coded to hide their meaning are allowed only as control commands to space stations or model craft. Any obscene or indecent language is prohibited.',
    },
    {
      type: 'card',
      id: 'pay',
      idea: 'No pay or business, with two small exceptions',
      covers: ['T1D08', 'T1D05'],
      picture: { art: 'compensation' },
      heading: 'No pay and no business, almost',
      text: [
        'Amateur radio is a non-commercial service: you may not be paid to operate, and you may not do business on the air. Two small exceptions are worth knowing.',
        'A teacher at a school may be paid their normal salary while using a station as part of classroom instruction. And any ham may tell others about amateur radio equipment for sale or trade, as long as it is not done on a regular basis.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Sort each situation. Tap one, then tap allowed or not allowed.',
        slots: [
          { id: 'ok', label: 'Allowed', rule: 'That one is paid operating or regular business, which is not allowed.' },
          { id: 'no', label: 'Not allowed', rule: 'That one fits an exception: an occasional sale of ham gear, or a teacher in class.' },
        ],
        items: [
          { id: 'sell', label: 'Selling a spare radio, once', slot: 'ok', why: 'Allowed. Doug mentioning his spare handheld once is a sale of amateur equipment, not done regularly.' },
          { id: 'store', label: 'Weekly store ads', slot: 'no', why: 'Not allowed. A store announcing its specials every week is regular business on the air.' },
          { id: 'teach', label: 'Teacher in class', slot: 'ok', why: 'Allowed. A teacher may keep their normal pay when operating is part of classroom instruction.' },
          { id: 'boss', label: 'Paid ads for an employer', slot: 'no', why: 'Not allowed. Being paid by an employer to tell hams about its radios is business, and paid operating.' },
        ],
      },
      remember: 'A teacher may be paid while operating as part of classroom instruction. You may offer amateur equipment for sale or trade, but not on a regular basis.',
    },
    {
      type: 'card',
      id: 'identify',
      idea: 'Identify, even on tests; model craft excepted',
      covers: ['T1D12', 'T1D11'],
      picture: { art: 'station-identification' },
      heading: 'Say who you are, even on a quick test',
      text: [
        'Almost everything you send must carry your call sign, so listeners know which station is on the air. A test is still a transmission: when Doug checks his new antenna for a few seconds, he still identifies as KJ7ABC.',
        'One exception to know: the signals that steer a radio-controlled model plane, boat or car. They are only control pulses, and they need no on-air identification.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug sends a short test to check his new antenna. What must he do?',
        options: [
          { id: 'none', label: 'Nothing. A short test needs no call sign', why: 'Short does not mean exempt. A test is a transmission, so he must identify.' },
          { id: 'id', label: 'Identify with his call sign, KJ7ABC', right: true, why: 'Yes. Test transmissions must be identified like any other.' },
          { id: 'fcc', label: 'Tell the FCC before he starts', why: 'There is no need to tell the FCC about a test. He only has to identify.' },
          { id: 'night', label: 'Wait until late at night', why: 'There is no rule about the time of day for tests. He only has to identify.' },
        ],
      },
      remember: 'Identify your station on test transmissions too. Signals that control a model craft need no on-air identification.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T1D02', 'T1D04', 'T1D06', 'T1D10', 'T1D11'],
      questions: [
        {
          q: 'What makes a transmission count as broadcasting?',
          review: 'broadcast',
          covers: ['T1D10', 'T1D02'],
          choices: [
            { label: 'It is one-way', why: 'Some one-way signals are allowed, like code practice. Broadcasting is about the audience.' },
            { label: 'It is meant for the general public', right: true, why: 'Broadcasting means transmissions intended for reception by the general public.' },
            { label: 'It is sent by a licensed station', why: 'Every ham station is licensed. Broadcasting is about who the transmission is meant for.' },
          ],
        },
        {
          q: 'Jeff wants to play a favorite song over the air for Doug\'s birthday. May he?',
          review: 'music',
          covers: ['T1D04'],
          choices: [
            { label: 'Yes, if it is under a minute', why: 'There is no time allowance. Short clips of music are not allowed either.' },
            { label: 'Yes, if his signal is clean', why: 'A clean signal does not make music allowed.' },
            { label: 'No. Music is only allowed inside a relay of manned spacecraft communications', right: true, why: 'A birthday song is not part of an authorized spacecraft relay, so it is not allowed.' },
          ],
        },
        {
          q: 'Does the FCC keep a list of words you may not say on the air?',
          review: 'open',
          covers: ['T1D06'],
          choices: [
            { label: 'Yes, the FCC keeps such a list', why: 'There is no list. The rule simply prohibits any obscene or indecent language.' },
            { label: 'No. Any obscene or indecent language is prohibited', right: true, why: 'The rule is a blanket ban on obscene or indecent language, with no list.' },
            { label: 'No. There is no rule about language', why: 'There is a rule. Obscene or indecent language is prohibited.' },
          ],
        },
        {
          q: 'Doug flies a radio-controlled model plane on a ham frequency. Must the control signals carry his call sign?',
          review: 'identify',
          covers: ['T1D11'],
          choices: [
            { label: 'Yes, like any other transmission', why: 'Signals that control a model craft are excused from on-air identification.' },
            { label: 'No. Model craft control signals need no on-air identification', right: true, why: 'Right. This is the exception to the identification rule.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T1D01', 'T1D02', 'T1D03', 'T1D04', 'T1D05', 'T1D06', 'T1D07', 'T1D08', 'T1D09', 'T1D10', 'T1D11', 'T1D12'],
      facts: [
        { icon: IconGlobe, text: 'You may not contact a country whose government has told the ITU it objects.', covers: ['T1D01'] },
        { icon: IconBroadcast, text: 'Broadcasting, meaning transmissions for the general public, is prohibited. One-way signals for hams or equipment are fine, like code practice, telemetry, or an auxiliary link from a remote receiver to the main repeater transmitter.', covers: ['T1D02', 'T1D07', 'T1D10'] },
        { icon: IconMusic, text: 'Music only when incidental to an authorized retransmission of manned spacecraft communications. Help for broadcasting or news gathering only for the immediate safety of life or property.', covers: ['T1D04', 'T1D09'] },
        { icon: IconLock, text: 'No codes that hide meaning, except control commands to space stations or model craft. Any obscene or indecent language is prohibited.', covers: ['T1D03', 'T1D06'] },
        { icon: IconPay, text: 'No pay for operating, but a teacher may be paid while operating as part of classroom instruction. Amateur equipment may be offered for sale or trade, but not on a regular basis.', covers: ['T1D05', 'T1D08'] },
        { icon: IconId, text: 'Identify on test transmissions too. Signals that control a model craft need no on-air identification.', covers: ['T1D11', 'T1D12'] },
      ],
    },
  ],
};
export default T1D_TRANSMISSIONS;
