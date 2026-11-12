import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Operating activities (question group T8C, all 11 questions).
 * Every fact below comes from a T8C question, its keyed answer or its explanation; the ids
 * are in each step's `covers`. Doug (KJ7ABC) and Jeff (K7DEF) are the example people.
 */

/* ---------- pictures ---------- */

const HOUSES = [
  { id: 'a', x: 62, y: 40 },
  { id: 'b', x: 150, y: 40 },
  { id: 'c', x: 112, y: 88 },
] as const;

/** A map: Doug and Jeff each draw a bearing; the bearings cross at house B. Houses can be tapped. T8C01 */
function Bearings({ picked, solved, onPick }: PicProps) {
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  const tone = (id: string) => (picked !== id ? 'ga-w' : id === 'b' && solved ? 'ga-good' : 'ga-bad');
  return (
    <Art label="A map seen from above. Doug and Jeff stand far apart. Each has drawn a line, a bearing, in the direction where the signal was strongest. The two lines cross at house B. Houses A and C are off the lines.">
      <Arrow x1={36} y1={114} x2={138} y2={48} c="ga-s ga-thick" h={8} />
      <Arrow x1={204} y1={114} x2={158} y2={51} c="ga-s ga-thick" h={8} />
      <T x={80} y={72} a="end" c="ga-ts">bearing</T>
      <T x={186} y={80} c="ga-ts">bearing</T>
      {HOUSES.map((h) => (
        <>
          <path class={`${tone(h.id)} ga-thick`} d={`M${h.x - 8} ${h.y + 8}V${h.y}L${h.x} ${h.y - 8}L${h.x + 8} ${h.y}V${h.y + 8}Z`} />
          <T x={h.x + 12} y={h.y + 6} c="ga-tb">{h.id.toUpperCase()}</T>
        </>
      ))}
      <circle class="ga-fk" cx="30" cy="118" r="5" />
      <circle class="ga-fk" cx="210" cy="118" r="5" />
      <T x={30} y={134} a="middle" c="ga-tk ga-tb">Doug</T>
      <T x={210} y={134} a="middle" c="ga-tk ga-tb">Jeff</T>
      {solved && <T x={150} y={18} a="middle" c="ga-tk ga-tb">the bearings cross here</T>}
      {onPick && HOUSES.map((h) => <rect x={h.x - 14} y={h.y - 14} width="34" height="28" style={hit} onClick={() => onPick(h.id)} />)}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconBearing = () => <Mini><path class="ls-ms" d="M6 42L36 10M42 42L28 8" /><circle class="ls-mk" cx="32" cy="14" r="5" /></Mini>;
const IconContest = () => (
  <Mini>
    <circle class="ls-mk" cx="24" cy="24" r="4" />
    <path class="ls-mw" d="M24 20V6M28 24H42M24 28V42M20 24H6M27 21L37 11M21 27L11 37M21 21L11 11M27 27L37 37" />
  </Mini>
);
const IconGrid = () => <Mini><path class="ls-mw" d="M6 6H42V42H6ZM18 6V42M30 6V42M6 18H42M6 30H42" /><rect class="ls-mk" x="18" y="18" width="12" height="12" /></Mini>;
const IconLink = () => <Mini><path class="ls-mk" d="M8 42V14M40 42V14" /><path class="ls-ms" d="M8 24C16 12 32 12 40 24" /></Mini>;
const IconLaptop = () => <Mini><rect class="ls-mk" x="10" y="12" width="28" height="18" rx="2" /><path class="ls-mk" d="M4 36H44" /></Mini>;
const IconGate = () => <Mini><path class="ls-mw" d="M4 30L18 24M4 16L18 22" /><rect class="ls-mk" x="18" y="16" width="12" height="14" /><path class="ls-ms" d="M30 23H44" /></Mini>;

/* ---------- the lesson ---------- */

export const T8C_ACTIVITIES: Lesson = {
  id: 't8c-activities',
  title: 'Operating activities',
  blurb: 'Hunting signals, contests, grid squares and linking repeaters over the internet.',
  sub: 'T8',
  groups: ['T8C'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t8c-activities',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T8C01', 'T8C02', 'T8C03', 'T8C05', 'T8C07', 'T8C08', 'T8C09'],
    },
    {
      type: 'card',
      id: 'direction-finding',
      idea: 'Radio direction finding',
      covers: ['T8C01'],
      picture: { draw: Bearings },
      heading: 'Follow a signal back to where it comes from',
      text: [
        'Sometimes a repeater is hit by noise interference, or by someone jamming it on purpose. Hams find the source with radio direction finding: they turn an antenna that hears best in one direction until the signal is strongest, and note that direction. That line is called a bearing.',
        'One bearing only gives a line. Take a second bearing from another place, and the source is where the two lines cross.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug and Jeff each took a bearing on a jamming signal. Which house is it coming from? Tap it in the picture, or tap an answer.',
        options: [
          { id: 'a', label: 'House A', why: 'House A is not on either line. Neither antenna pointed that way.' },
          { id: 'b', label: 'House B', right: true, why: 'Yes. House B is where the two bearings cross, so the signal comes from there.' },
          { id: 'c', label: 'House C', why: 'House C sits between the lines but on neither of them. Look for the point where both lines meet.' },
        ],
      },
      remember: 'Radio direction finding is the method used to locate sources of noise interference or jamming.',
    },
    {
      type: 'card',
      id: 'fox-hunt',
      idea: 'A hidden transmitter hunt',
      covers: ['T8C02'],
      picture: { art: 'hidden-transmitter-hunt' },
      heading: 'A hidden transmitter hunt is direction finding for fun',
      text: [
        'In a hidden transmitter hunt, also called a fox hunt, someone hides a small transmitter and everyone else tries to find it. It is good practice for tracking down real interference.',
        'The tool that matters is a directional antenna: it hears best one way, so turning it shows which way to walk. Meters such as an SWR meter or a directional wattmeter only check your own antenna and feed line, so they cannot point you anywhere.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug is packing for a fox hunt. Which item will help him find the hidden transmitter?',
        options: [
          { id: 'swr', label: 'An SWR meter', why: 'An SWR meter tells you how well your own antenna is matched. It says nothing about where another signal is.' },
          { id: 'ant', label: 'A directional antenna', right: true, why: 'Right. Turning a directional antenna shows the direction the signal is strongest.' },
          { id: 'watt', label: 'A directional wattmeter', why: 'A directional wattmeter measures power in your own feed line, not the direction of a distant signal.' },
        ],
      },
      remember: 'A directional antenna is the useful item for a hidden transmitter hunt.',
    },
    {
      type: 'card',
      id: 'contest',
      idea: 'Contesting',
      covers: ['T8C03', 'T8C04'],
      picture: { art: 'contesting' },
      heading: 'In a contest, make as many contacts as you can',
      text: [
        'Contesting is an on-air competition: for a set period, you try to contact as many stations as possible. Each contact swaps a short piece of information called the exchange.',
        'Many stations are waiting their turn, so keep it short. Give your full call sign and the exchange, nothing more. Do not cut your call to its last letters, add extra words, or contact the same station twice just to be sure you are in the log.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Jeff, K7DEF, is calling in a contest and lots of stations are answering. Jeff picks Doug. What should Doug send?',
        options: [
          { id: 'short', label: 'Just ABC, the last letters of his call, to save time', why: 'A partial call sign is not proper identification, and Jeff would have to ask again.' },
          { id: 'min', label: 'KJ7ABC and the contest exchange, nothing more', right: true, why: 'Yes. The minimum needed for proper identification and the exchange keeps the contact quick and correct.' },
          { id: 'copy', label: 'Please copy, then his call and the exchange', why: 'Extra words like please copy only slow the contact down for everyone waiting.' },
          { id: 'twice', label: 'His call and exchange, then call Jeff again later to be sure', why: 'A second contact is a duplicate. It adds nothing and takes time from other stations.' },
        ],
      },
      remember: 'Contesting means contacting as many stations as possible in a set period. Send only your identification and the contest exchange.',
    },
    {
      type: 'card',
      id: 'grid',
      idea: 'Grid locators',
      covers: ['T8C05'],
      picture: { art: 'grid-locator' },
      heading: 'A grid locator names a patch of the Earth',
      text: [
        'Hams split the world map into rectangles, called the Maidenhead grid. Each rectangle has a short code of letters and numbers, such as FN31.',
        'That code is a grid locator. Saying your grid tells the other station roughly where you are, which is handy on VHF and in contests.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Jeff says his grid is FN31. What has he told Doug?',
        options: [
          { id: 'aim', label: 'Which way his antenna is pointing', why: 'Pointing angles are azimuth and elevation. A grid locator names a place, not a direction.' },
          { id: 'place', label: 'Which patch of the Earth he is in', right: true, why: 'Yes. A grid locator is a letter-number code for a geographic location.' },
          { id: 'tool', label: 'Which test instrument he is using', why: 'A grid locator is a code, not an instrument of any kind.' },
        ],
      },
      remember: 'A grid locator is a letter-number designator assigned to a geographic location.',
    },
    {
      type: 'card',
      id: 'linking',
      idea: 'VoIP and IRLP link repeaters',
      covers: ['T8C07', 'T8C08'],
      picture: { art: 'irlp' },
      heading: 'The internet can join two repeaters',
      text: [
        'VoIP stands for Voice Over Internet Protocol. It turns your voice into digital data, sends it across the internet, and turns it back into sound at the far end.',
        'IRLP, the Internet Radio Linking Project, uses this to connect amateur radio systems such as repeaters. Doug talks into his local repeater by radio, and his voice comes out of a repeater near Jeff, maybe in another country.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What does IRLP do?',
        options: [
          { id: 'web', label: 'Lets you browse websites by radio', why: 'IRLP carries voice between radio systems. It does not bring web pages over the air.' },
          { id: 'link', label: 'Connects repeaters to each other through the internet', right: true, why: 'Right. IRLP joins repeaters and other radio systems over the internet, using VoIP.' },
          { id: 'meter', label: 'Measures how strong your signal is', why: 'IRLP does not measure anything. It links radio systems together.' },
        ],
      },
      remember: 'VoIP delivers voice over the internet using digital techniques. IRLP uses it to connect repeaters through the internet.',
    },
    {
      type: 'card',
      id: 'dtmf',
      idea: 'Keypad tones control an IRLP node',
      covers: ['T8C06'],
      picture: { art: 'dtmf' },
      heading: 'Dial the far repeater with your keypad',
      text: [
        'The computer that joins a repeater to IRLP is called a node. You reach it over the air: press number keys on your radio and it sends a pair of tones for each key. These keypad tones are called DTMF, Dual-Tone Multi-Frequency.',
        'Do not mix them up with CTCSS. A CTCSS tone is one low, steady tone that only opens a repeater. It cannot carry a number.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug wants his local IRLP node to connect to the node near Jeff. How does he tell it which one?',
        options: [
          { id: 'ctcss', label: 'Set the right CTCSS tone', why: 'A CTCSS tone is one steady tone that opens the repeater. It cannot send a node number.' },
          { id: 'voice', label: 'Say a password into the microphone', why: 'Nodes are not controlled by a spoken password. They listen for keypad tones.' },
          { id: 'dtmf', label: 'Press the node number on his keypad, sending DTMF tones', right: true, why: 'Yes. Over the air access to IRLP nodes uses DTMF keypad tones.' },
          { id: 'web', label: 'Type an internet password', why: 'Over the air access is by radio, so there is nowhere to type an internet password.' },
        ],
      },
      remember: 'Over the air access to IRLP nodes uses DTMF keypad tones.',
    },
    {
      type: 'card',
      id: 'echolink',
      idea: 'EchoLink works without a radio',
      covers: ['T8C09', 'T8C10'],
      picture: { art: 'echolink' },
      heading: 'EchoLink: a repeater from your computer or phone',
      text: [
        'EchoLink links repeaters over the internet too, but it adds something: you can connect from a computer or smartphone app, with no radio at your end. Your voice still goes out over the air from the repeater.',
        'Because of that, EchoLink must be sure every user is a ham. Before using it, you register your call sign and provide proof of license. Any license class will do.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug installs the EchoLink app on his phone. What must he do before he can use it?',
        options: [
          { id: 'buy', label: 'Buy a license for the software', why: 'There is no software license to buy. The check is on your amateur license.' },
          { id: 'reg', label: 'Register his call sign and send proof of his license', right: true, why: 'Right. EchoLink checks each user is licensed before letting them transmit through a repeater.' },
          { id: 'gen', label: 'Upgrade to a General Class license', why: 'Any licensed ham can use EchoLink. A Technician license is enough.' },
          { id: 'train', label: 'Finish an EchoLink training course', why: 'There is no required training course. Registering and proving your license is what counts.' },
        ],
      },
      remember: 'EchoLink lets you transmit through a repeater without a radio. First register your call sign and provide proof of license.',
    },
    {
      type: 'card',
      id: 'gateway',
      idea: 'A gateway joins radio and internet',
      covers: ['T8C11'],
      picture: { art: 'gateway' },
      heading: 'A gateway is the door to the internet',
      text: [
        'A gateway is an amateur station that connects other amateur stations to the internet. Signals arrive by radio and leave by internet, and the other way round.',
        'Three similar stations do something else. A repeater re-sends signals by radio. A digipeater re-sends data packets by radio. A beacon sends one-way signals so others can check conditions.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug builds a station that passes his neighbors’ radio signals onto the internet. What is it called?',
        options: [
          { id: 'rpt', label: 'A repeater', why: 'A repeater re-sends signals by radio to extend range. That alone does not connect anyone to the internet.' },
          { id: 'digi', label: 'A digipeater', why: 'A digipeater re-sends data packets by radio. It does not connect to the internet.' },
          { id: 'gate', label: 'A gateway', right: true, why: 'Yes. A station that connects other amateur stations to the internet is a gateway.' },
          { id: 'bcn', label: 'A beacon', why: 'A beacon only sends one-way signals. Nobody connects through it.' },
        ],
      },
      remember: 'A gateway is an amateur station that connects other amateur stations to the internet.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T8C01', 'T8C02', 'T8C04', 'T8C06', 'T8C09'],
      questions: [
        {
          q: 'Doug hears a carrier jamming the repeater. Which plan finds where it comes from?',
          review: 'direction-finding',
          covers: ['T8C01', 'T8C02'],
          choices: [
            { label: 'Check his SWR meter', why: 'An SWR meter only checks his own antenna. It cannot point to another station.' },
            { label: 'Take bearings with a directional antenna from two places and see where they cross', right: true, why: 'That is radio direction finding. The source is where the bearings cross.' },
            { label: 'Turn up his transmit power', why: 'More power does not locate anything. A directional antenna does.' },
          ],
        },
        {
          q: 'In a contest, what should each contact contain?',
          review: 'contest',
          covers: ['T8C04'],
          choices: [
            { label: 'Only the last two letters of your call', why: 'A partial call is not proper identification.' },
            { label: 'Your full call sign and the exchange, nothing more', right: true, why: 'Keeping to the minimum keeps contacts fast and correct.' },
            { label: 'A friendly chat so the other station remembers you', why: 'Others are waiting. Contest contacts are kept short.' },
          ],
        },
        {
          q: 'Doug presses 1, 2, 3, 4 on his handheld to start an IRLP link. What is his radio sending?',
          review: 'dtmf',
          covers: ['T8C06'],
          choices: [
            { label: 'A CTCSS tone', why: 'CTCSS is one steady tone. It cannot carry numbers.' },
            { label: 'His internet password', why: 'Nothing is typed over the internet. The radio sends tones over the air.' },
            { label: 'DTMF keypad tones', right: true, why: 'Each key sends a pair of DTMF tones, which tell the node what to connect to.' },
          ],
        },
        {
          q: 'Jeff is travelling with only his laptop, no radio. How can he talk through a repeater back home?',
          review: 'echolink',
          covers: ['T8C09'],
          choices: [
            { label: 'Use IRLP from the laptop', why: 'IRLP is entered by radio, with keypad tones. It needs a radio at your end.' },
            { label: 'He cannot, without a radio', why: 'He can. EchoLink is made for exactly this.' },
            { label: 'Use EchoLink on the laptop', right: true, why: 'EchoLink lets a licensed ham reach a repeater from a computer or phone, with no radio.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T8C01', 'T8C02', 'T8C03', 'T8C04', 'T8C05', 'T8C06', 'T8C07', 'T8C08', 'T8C09', 'T8C10', 'T8C11'],
      facts: [
        { icon: IconBearing, text: 'Radio direction finding locates noise interference and jamming. A directional antenna is the tool for a hidden transmitter hunt.', covers: ['T8C01', 'T8C02'] },
        { icon: IconContest, text: 'Contesting is contacting as many stations as possible in a set period. Send only your identification and the exchange.', covers: ['T8C03', 'T8C04'] },
        { icon: IconGrid, text: 'A grid locator is a letter-number designator for a geographic location.', covers: ['T8C05'] },
        { icon: IconLink, text: 'VoIP carries voice over the internet digitally. IRLP connects repeaters through the internet, and you reach a node with DTMF keypad tones.', covers: ['T8C06', 'T8C07', 'T8C08'] },
        { icon: IconLaptop, text: 'EchoLink lets you use a repeater without a radio. Register your call sign and provide proof of license first.', covers: ['T8C09', 'T8C10'] },
        { icon: IconGate, text: 'A gateway is an amateur station that connects other amateur stations to the internet.', covers: ['T8C11'] },
      ],
    },
  ],
};
export default T8C_ACTIVITIES;
