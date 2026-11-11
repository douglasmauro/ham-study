import type { VNode } from 'preact';
import type { TalkStrip } from './Talk';

/** The opening panel of a strip: your station, the other station, and what sits between them. */
function panel(you: string, them: string, mid: 'repeater' | 'direct' | 'net'): () => VNode {
  const Op = ({ x, call, k }: { x: number; call: string; k?: boolean }) => (
    <g>
      <circle class={k ? 'cd-k' : 'cd-t'} cx={x} cy="34" r="12" />
      <path class={k ? 'cd-k' : 'cd-t'} d={`M${x - 20} 74q0 -24 20 -24q20 0 20 24`} />
      <path class="cd-w" d={`M${x - 13} 30a13 13 0 0 1 26 0`} /><rect class="cd-fm" x={x - 17} y="28" width="6" height="10" rx="3" /><rect class="cd-fm" x={x + 11} y="28" width="6" height="10" rx="3" />
      <text class={k ? 'cd-tk' : ''} x={x} y="92" text-anchor="middle">{call}</text>
    </g>
  );
  return () => (
    <svg class="cd-art" viewBox="0 0 340 98" aria-hidden="true">
      <Op x={44} call={you} k />
      <Op x={296} call={them} />
      {mid === 'direct' ? (
        <path class="cd-a cd-flow" d="M78 44H262" />
      ) : (
        <g>
          <path class="cd-t" d="M162 76L170 22L178 76M164 62H176M166 46H174M158 22H182" />
          <path class="cd-a cd-flow" d="M78 44L150 30M190 30L262 44" />
          <text class="cd-tm" x="170" y="92" text-anchor="middle">{mid === 'net' ? 'net' : 'repeater'}</text>
        </g>
      )}
    </svg>
  );
}

// T2A09 call sign + "listening" on a repeater; T2A04 other call sign, then yours; T1F03 identify at least every
// 10 minutes and at the end; T2A01 2-meter repeater offset is plus or minus 600 kHz.
export const TALK_REPEATER: TalkStrip = {
  sub: 'T2',
  title: 'Your first repeater contact',
  caption: 'You are KJ7ABC, newly licensed. Your handheld is set to the local 2-meter repeater, with its 600 kHz offset. Nobody is talking.',
  art: panel('KJ7ABC (you)', 'W7XYZ', 'repeater'),
  steps: [
    { note: 'The repeater is quiet. You would like a contact.' },
    {
      ask: 'How do you show you are looking for a contact?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'KJ7ABC listening.', ok: true, why: 'On a repeater, your call sign followed by "listening" is the customary way.' },
        { text: 'QSY, KJ7ABC.', why: 'QSY means you are changing frequency. It does not ask for a contact.' },
        { text: 'Hello? Anybody out there? Come on back.', why: 'Nobody knows who is calling. Give your call sign, then say "listening".' },
      ],
    },
    { who: 'them', name: 'W7XYZ', text: 'KJ7ABC, this is W7XYZ. Good evening! Is this your first contact?' },
    { who: 'you', name: 'KJ7ABC (you)', text: 'It is! My name is Doug. Thanks for coming back to me.' },
    { note: 'Later that week you want to reach your friend Jeff, K7DEF, on the same repeater.' },
    {
      ask: 'How do you call a station whose call sign you know?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'K7DEF, this is KJ7ABC.', ok: true, why: 'Say the other station\'s call sign, then identify with your own.' },
        { text: 'Break, break. K7DEF, KJ7ABC.', why: 'No "break, break" is needed. Just say their call sign, then yours.' },
        { text: 'CQ CQ CQ, K7DEF, this is KJ7ABC.', why: 'CQ means calling any station. You want one station, so say their call sign, then yours.' },
      ],
    },
    { who: 'them', name: 'K7DEF', text: 'KJ7ABC, K7DEF. Hi Doug! How is the new radio working?' },
    { note: 'You chat about antennas. Ten minutes go by.' },
    {
      ask: 'Ten minutes have passed. What now?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'This is KJ7ABC. So, about that antenna of yours...', ok: true, why: 'You must give your call sign at least every 10 minutes during a contact.' },
        { text: 'We both gave our call signs at the start, so we are covered. About that antenna...', why: 'Once is not enough. Identify at least every 10 minutes, and again at the end.' },
        { text: 'I will say my call sign again when thirty minutes are up. About that antenna...', why: 'The limit is 10 minutes, not thirty.' },
      ],
    },
    { who: 'them', name: 'K7DEF', text: 'K7DEF. Good idea. I have to run, Doug. Talk soon!' },
    {
      ask: 'How do you end the contact?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'Thanks Jeff, talk soon. KJ7ABC.', ok: true, why: 'You must also give your call sign at the end of a communication.' },
        { text: 'Thanks Jeff, bye for now!', why: 'You must give your call sign at the end of the contact too.' },
        { text: 'Thanks Jeff. This is Doug, signing off.', why: 'Your name is not your identification. Use your FCC call sign.' },
      ],
    },
  ],
};

// T2A06 calling CQ; T2A05 answering a CQ; T2A08 CQ = calling any station; T2B10 QRM; T2B11 QSY;
// T2C03 and T1A03 standard phonetic alphabet; T1B01 28.300-28.500 phone; T2A11 simplex.
export const TALK_CQ: TalkStrip = {
  sub: 'T2',
  title: 'Calling CQ on 10 meters',
  caption: 'You are KJ7ABC on 28.400 MHz SSB, inside the Technician phone segment. No repeater here: this is simplex, station to station.',
  art: panel('KJ7ABC (you)', 'N5QRS', 'direct'),
  steps: [
    { note: 'The frequency is clear. You want to talk to anyone who can hear you.' },
    {
      ask: 'How do you ask for a call from any station?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'CQ CQ CQ, this is KJ7ABC, calling CQ and listening.', ok: true, why: 'Repeat "CQ" a few times, then "this is" and your call sign, then pause to listen.' },
        { text: 'QTC, this is KJ7ABC.', why: 'CQ, not QTC, is the signal that means calling any station.' },
        { text: '(Hold the microphone button for ten seconds without speaking.) This is KJ7ABC.', why: 'A silent carrier tells nobody what you want. Say "CQ" a few times, then your call sign.' },
      ],
    },
    { note: 'No answer. A minute later you hear another station on the band.' },
    { who: 'them', name: 'N5QRS', text: 'CQ CQ CQ, this is N5QRS, November Five Quebec Romeo Sierra, calling CQ.' },
    {
      ask: 'How do you answer the CQ?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'N5QRS, this is KJ7ABC.', ok: true, why: 'Transmit the other station\'s call sign, followed by your own.' },
        { text: 'CQ CQ CQ, this is KJ7ABC.', why: 'That is a new CQ, not an answer. Say their call sign, then yours.' },
        { text: 'Hello, I hear you! I am in Oregon.', why: 'They cannot tell who is calling. Say their call sign, then your call sign.' },
      ],
    },
    { who: 'them', name: 'N5QRS', text: 'KJ7ABC, N5QRS. Thanks for the call. Other stations are covering you up here, and I missed your name.' },
    {
      ask: 'Other stations are interfering. What do you say?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'Lots of QRM here too. Let\'s QSY up to 28.410.', ok: true, why: 'QRM means interference from other stations. QSY means changing frequency.' },
        { text: 'Lots of QSY here too. Let\'s QRM up to 28.410.', why: 'These are swapped. QRM is the interference. QSY is the change of frequency.' },
        { text: 'Lots of CQ here too. Let\'s go simplex up to 28.410.', why: 'CQ means calling any station, and you are already on simplex. The words you need are QRM and QSY.' },
      ],
    },
    { note: 'You both move to 28.410 MHz, still inside the Technician phone segment.' },
    { who: 'them', name: 'N5QRS', text: 'KJ7ABC, N5QRS. Much better. Please say your name again.' },
    {
      ask: 'How do you make sure your name is copied?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'My name is Doug: Delta Oscar Uniform Golf.', ok: true, why: 'Spell unusual words with the standard phonetic alphabet so they are received correctly.' },
        { text: 'My name is Doug: D as in dog, O as in orange, U as in umbrella...', why: 'Made-up words can be misheard. Use the standard phonetic alphabet.' },
        { text: 'JAMIE! I SAID JAMIE!', why: 'Louder is not clearer. Spell the word with the standard phonetic alphabet.' },
      ],
    },
    { who: 'them', name: 'N5QRS', text: 'Got it, Doug. You are loud and clear in Texas. N5QRS.' },
  ],
};

// T2C02 net control duties; T2C07 transmit only when directed unless reporting an emergency; T2C01 FCC rules
// always apply; T2C09 outside your privileges only for immediate safety of life or protection of property;
// T2C05 traffic = formal messages; T2C10 preamble; T2C11 check = number of words in the text.
export const TALK_NET: TalkStrip = {
  sub: 'T2',
  title: 'On an emergency net',
  caption: 'A storm has knocked out phones. You are KJ7ABC, checked in to the county emergency net. W7EOC is the net control station and directs who talks.',
  art: panel('KJ7ABC (you)', 'W7EOC', 'net'),
  steps: [
    { who: 'them', name: 'W7EOC (net control)', text: 'This is W7EOC, net control. All stations stand by. K7DEF, go ahead with your report.' },
    { note: 'You have a routine question about your antenna.' },
    {
      ask: 'What do you do with your routine question?', name: 'KJ7ABC (you)',
      pick: [
        { text: '(Stay quiet and wait until net control calls on you.)', ok: true, why: 'On a net, transmit only when directed by net control, unless you are reporting an emergency.' },
        { text: 'Net control, KJ7ABC, quick question about my antenna!', why: 'It is not an emergency, so wait until net control directs you to transmit.' },
        { text: 'K7DEF, this is KJ7ABC. Jeff, got a minute?', why: 'Net control directs the traffic. Do not start a side contact on the net.' },
      ],
    },
    { note: 'Out of your window you see a car slide off the road. The driver is hurt.' },
    {
      ask: 'Now what?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'Net control, KJ7ABC with an emergency: car off the road at Mill Bridge, driver injured.', ok: true, why: 'Reporting an emergency is the one time you transmit without being directed.' },
        { text: '(Wait for your turn. Net control said to stand by.)', why: 'An emergency does not wait. It is the exception to "transmit only when directed".' },
        { text: 'It is an emergency, so FCC rules are off: I will not bother with my call sign.', why: 'FCC rules always apply. Break in, but operate properly.' },
      ],
    },
    { who: 'them', name: 'W7EOC (net control)', text: 'KJ7ABC, copied. The only station that can reach the ambulance is on a frequency outside your Technician privileges, and I cannot raise them from here. Can you call them?' },
    {
      ask: 'May you transmit outside your privileges?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'Yes. A life is in immediate danger, so I will call them now.', ok: true, why: 'You may go outside your privileges only for the immediate safety of human life or protection of property.' },
        { text: 'No. A Technician may never transmit there, whatever happens.', why: 'There is one exception: the immediate safety of human life or protection of property.' },
        { text: 'Sure. During any net, every frequency is open to everyone.', why: 'Not for any net. Only when human life or property is in immediate danger.' },
      ],
    },
    { note: 'Help is on the way. Net control now asks you to send a formal written message.' },
    { who: 'them', name: 'W7EOC (net control)', text: 'KJ7ABC, please pass that as traffic. What is the check for your message?' },
    {
      ask: 'What is the "check"?', name: 'KJ7ABC (you)',
      pick: [
        { text: 'Check 12. That is the number of words in the text of my message.', ok: true, why: 'The check is the number of words or word equivalents in the text part of the message.' },
        { text: 'The check is KJ7ABC, my call sign.', why: 'The check is a word count, not a call sign.' },
        { text: 'The check is my signal report: five nine.', why: 'The check is the number of words in the text, not a signal report.' },
      ],
    },
    { who: 'them', name: 'W7EOC (net control)', text: 'Check 12, copied. Good work, KJ7ABC. W7EOC.' },
  ],
};
