import { Art, Mini, T, fineWave } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Digital modes (question group T8D, all 12 questions).
 * Every fact below comes from a T8D question, its keyed answer or its explanation; the ids
 * are in each step's `covers`. Doug (KJ7ABC) and Jeff (K7DEF) are the example people.
 */

/* ---------- pictures ---------- */

/** Analog copies the shape of the sound; digital sends coded symbols. T8D01 */
function AnalogDigital() {
  const bits = [1, 0, 1, 1, 0, 0, 1, 0];
  return (
    <Art label="Two ways to send a voice. Analog: a smooth wave that copies the shape of the sound. Digital: a row of on and off blocks, coded data.">
      <T x={10} y={18} c="ga-tb">analog</T>
      <T x={232} y={18} a="end" c="ga-tm">copies the shape</T>
      <path class="ga-s" d={fineWave(14, 226, 44, 70, 14)} />
      <T x={10} y={82} c="ga-tk ga-tb">digital</T>
      <T x={232} y={82} a="end" c="ga-tm">sends coded data</T>
      {bits.map((b, i) => (
        <>
          <rect class={b ? 'ga-fk' : 'ga-w'} x={14 + i * 27} y={92} width={22} height={22} rx={3} />
          <T x={25 + i * 27} y={130} a="middle" c="ga-tm">{String(b)}</T>
        </>
      ))}
    </Art>
  );
}

const ROWS = [
  { id: 'a', y: 30, name: 'steady carrier' },
  { id: 'b', y: 72, name: 'CW: on and off' },
  { id: 'c', y: 114, name: 'PSK: phase flips' },
] as const;

/** Three signals: a steady carrier, CW keyed on and off, and PSK with phase flips. Rows can be tapped. T8D06, T8D09 */
function Keying({ picked, solved, onPick }: PicProps) {
  const y = (id: string) => ROWS.find((r) => r.id === id)!.y;
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  const tone = (id: string) => (picked !== id ? 'ga-tb' : id === 'c' && solved ? 'ga-tk ga-tb' : 'ga-tb');
  const on = [[30, 66], [84, 96], [114, 162], [180, 192], [210, 228]];
  return (
    <Art label="Three signals. Line A is a steady wave. Line B is the same wave switched on and off in bursts, which is CW. Line C stays on but its wave flips over at two points, which is a phase shift: PSK.">
      {ROWS.map((r) => <T x={8} y={r.y + 5} c={tone(r.id)}>{r.id.toUpperCase()}</T>)}
      <path class="ga-s" d={fineWave(30, 228, y('a'), 12, 9)} />
      <path class="ga-w ga-thin ga-dash" d={`M30 ${y('b')}H228`} />
      {on.map(([x0, x1]) => <path class="ga-s" d={fineWave(x0, x1, y('b'), 12, 9)} />)}
      <path class="ga-s" d={fineWave(30, 90, y('c'), 12, 9)} />
      <path class="ga-s" d={fineWave(90, 150, y('c'), 12, -9)} />
      <path class="ga-s" d={fineWave(150, 228, y('c'), 12, 9)} />
      {solved && (
        <>
          {ROWS.map((r) => <T x={232} y={r.y - 14} a="end" c="ga-tk">{r.name}</T>)}
          <path class="ga-k ga-thick" d={`M90 ${y('c') - 13}V${y('c') + 13}M150 ${y('c') - 13}V${y('c') + 13}`} />
        </>
      )}
      {onPick && ROWS.map((r) => <rect x="2" y={r.y - 18} width="236" height="36" style={hit} onClick={() => onPick(r.id)} />)}
    </Art>
  );
}

/** One DMR channel shared by two time slots that take turns. T8D07 */
function TimeSlots({ solved }: PicProps) {
  const n = 8;
  const w = 212 / n;
  return (
    <Art label="One 12.5 kilohertz repeater channel drawn as a strip over time. It is cut into short turns that alternate: slot 1, slot 2, slot 1, slot 2. Doug's conversation uses slot 1 and a second conversation uses slot 2.">
      <T x={120} y={18} a="middle" c="ga-tm">one 12.5 kHz repeater channel</T>
      {Array.from({ length: n }, (_, i) => (
        <>
          <rect class={i % 2 ? 'ga-fs' : 'ga-fk'} x={14 + i * w + 1} y={30} width={w - 2} height={28} rx={3} />
          <T x={14 + i * w + w / 2} y={74} a="middle" c={i % 2 ? 'ga-ts ga-tb' : 'ga-tk ga-tb'}>{i % 2 ? '2' : '1'}</T>
        </>
      ))}
      <path class="ga-w ga-thin" d="M14 86H196M190 82L196 86L190 90" />
      <T x={202} y={90} c="ga-tm">time</T>
      <rect class="ga-fk" x={14} y={104} width={12} height={12} rx={2} />
      <T x={32} y={115} c="ga-tk ga-tb">slot 1: Doug</T>
      <rect class="ga-fs" x={122} y={104} width={12} height={12} rx={2} />
      <T x={140} y={115} c="ga-ts ga-tb">slot 2: Jeff</T>
      {solved && <T x={120} y={134} a="middle" c="ga-tk">two conversations, taking turns</T>}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconDigital = () => <Mini><rect class="ls-mk" x="4" y="16" width="10" height="16" rx="2" /><rect class="ls-mw" x="19" y="16" width="10" height="16" rx="2" /><rect class="ls-mk" x="34" y="16" width="10" height="16" rx="2" /></Mini>;
const IconKey = () => <Mini><path class="ls-ms" d="M4 18H14M20 18H24M30 18H44" /><path class="ls-mk" d="M4 34C8 26 12 26 16 34L24 26C28 34 32 34 36 26S42 30 44 34" /></Mini>;
const IconPacket = () => <Mini><rect class="ls-mw" x="4" y="16" width="40" height="16" rx="2" /><path class="ls-mw" d="M16 16V32M32 16V32" /><rect class="ls-mk" x="32" y="16" width="12" height="16" rx="2" /></Mini>;
const IconMap = () => <Mini><rect class="ls-mw" x="6" y="8" width="36" height="32" rx="2" /><circle class="ls-mk" cx="18" cy="20" r="3" /><circle class="ls-mk" cx="32" cy="30" r="3" /></Mini>;
const IconWeak = () => <Mini><path class="ls-mw" d="M4 30L8 26L11 32L15 25L19 31L23 27L27 33L31 26L35 31L39 27L44 30" /><path class="ls-ms" d="M4 20C10 14 16 14 22 20S34 26 44 20" /></Mini>;
const IconSlots = () => <Mini><rect class="ls-mk" x="4" y="18" width="8" height="12" /><rect class="ls-ms" x="14" y="18" width="8" height="12" /><rect class="ls-mk" x="24" y="18" width="8" height="12" /><rect class="ls-ms" x="34" y="18" width="8" height="12" /></Mini>;

/* ---------- the lesson ---------- */

export const T8D_DIGITAL_MODES: Lesson = {
  id: 't8d-digital-modes',
  title: 'Digital modes',
  blurb: 'Packet, APRS, FT8, DMR, mesh networks and more: what each digital mode lets you do.',
  sub: 'T8',
  groups: ['T8D'],
  minutes: 9,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t8d-digital-modes',
      intro: 'Start with a short clip. After it you will try each idea yourself.',
      covers: ['T8D01', 'T8D02', 'T8D03', 'T8D05', 'T8D07', 'T8D08', 'T8D10', 'T8D11', 'T8D12'],
    },
    {
      type: 'card',
      id: 'digital',
      idea: 'What makes a mode digital',
      covers: ['T8D01'],
      picture: { draw: AnalogDigital },
      heading: 'A digital mode sends coded data',
      text: [
        'An analog signal copies the shape of a voice or picture. FM voice and old-style broadcast TV work that way. A digital mode instead turns the information into coded data and sends that.',
        'Many very different systems are digital: packet radio, the FT8 mode, and IEEE 802.11, which is the standard behind Wi-Fi.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Sort each one. Tap it, then tap analog or digital.',
        slots: [
          { id: 'dig', label: 'Digital', sub: 'sends coded data', rule: 'Digital modes send coded data, not a copy of the shape.' },
          { id: 'ana', label: 'Analog', sub: 'copies the shape', rule: 'Analog signals copy the shape of the sound or picture.' },
        ],
        items: [
          { id: 'pkt', label: 'Packet radio', slot: 'dig', why: 'Packet radio sends data in coded bundles, so it is digital.' },
          { id: 'fm', label: 'FM voice', slot: 'ana', why: 'FM voice copies the shape of your voice, so it is analog.' },
          { id: 'wifi', label: 'IEEE 802.11 (Wi-Fi)', slot: 'dig', why: 'IEEE 802.11 is the Wi-Fi standard. It carries digital data by radio.' },
          { id: 'ft8', label: 'FT8', slot: 'dig', why: 'FT8 sends short coded messages, so it is digital.' },
          { id: 'tv', label: 'Old-style broadcast TV', slot: 'ana', why: 'Old-style broadcast TV copies the picture directly, so it is analog.' },
        ],
      },
      remember: 'Packet radio, IEEE 802.11 and FT8 are all digital communications modes.',
    },
    {
      type: 'card',
      id: 'keying',
      idea: 'CW and PSK',
      covers: ['T8D06', 'T8D09'],
      picture: { draw: Keying },
      heading: 'Two ways to key a signal: CW and PSK',
      text: [
        'CW, short for continuous wave, is another name for a Morse code transmission. The steady signal is simply switched on and off in short and long bursts.',
        'PSK, Phase Shift Keying, keeps the signal on and sends data by flipping its phase: the point the wave has reached in its cycle. At each flip the wave suddenly turns over. PSK31 is a well-known keyboard mode that uses it.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which line in the picture is PSK? Tap it, or tap an answer.',
        options: [
          { id: 'a', label: 'Line A', why: 'Line A is a steady carrier. Nothing about it changes, so it carries no data.' },
          { id: 'b', label: 'Line B', why: 'Line B is switched on and off. That is CW, Morse code.' },
          { id: 'c', label: 'Line C', right: true, why: 'Yes. Line C stays on, and its wave flips over at two points. Those phase shifts carry the data.' },
        ],
      },
      remember: 'CW is another name for a Morse code transmission. PSK means Phase Shift Keying.',
    },
    {
      type: 'card',
      id: 'packet',
      idea: 'Packets, checksums and ARQ',
      covers: ['T8D08', 'T8D11'],
      picture: { art: 'packet-radio' },
      heading: 'Packet radio checks every packet',
      text: [
        'Packet radio cuts data into small packets. Each starts with a header holding the call sign of the station it is going to, and carries a checksum: a number worked out from the data.',
        'The receiver works the number out again. If it does not match, the packet was damaged, so the receiver asks for it to be sent again. That is ARQ, automatic repeat request.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug sends Jeff a packet, but the checksum does not match at Jeff’s end. What happens next?',
        options: [
          { id: 'keep', label: 'Jeff’s station keeps the packet anyway', why: 'A mismatch means the data is damaged. Keeping it would mean using wrong data.' },
          { id: 'arq', label: 'Jeff’s station asks Doug’s to send it again', right: true, why: 'Right. That is ARQ: the receiver detects the error and requests a retransmission.' },
          { id: 'call', label: 'The packet goes to whichever station hears it', why: 'The header names the station it is for, so it is not passed to just anyone.' },
        ],
      },
      remember: 'Packets carry a header with the call sign they are sent to and a checksum. With ARQ the receiver detects errors and asks for a resend.',
    },
    {
      type: 'card',
      id: 'aprs',
      idea: 'APRS on a live map',
      covers: ['T8D03', 'T8D05'],
      picture: { art: 'aprs' },
      heading: 'APRS puts stations on a map',
      text: [
        'APRS, the Automatic Packet Reporting System, sends short data packets that other stations relay and show on a map. A packet can hold a GPS position, a short text message or weather readings.',
        'At an event or an emergency, organizers see every station on a live map and trade short messages with them. This is called real-time tactical communication.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'At a bike race, every support car runs APRS. What can the organizers do with it?',
        options: [
          { id: 'count', label: 'See how many stations are signed into the repeater', why: 'APRS does not count the stations on a repeater.' },
          { id: 'voice', label: 'Talk to far-off repeaters over the internet', why: 'Linking repeaters by internet voice is what IRLP and EchoLink do, not APRS.' },
          { id: 'map', label: 'See each car on a live map and send it short messages', right: true, why: 'Yes. APRS shows positions on a map in real time, along with short messages and weather.' },
        ],
      },
      remember: 'APRS can send GPS position, text messages and weather data, and shows stations on a real-time map.',
    },
    {
      type: 'card',
      id: 'ft8',
      idea: 'FT8 and WSJT-X',
      covers: ['T8D02', 'T8D10'],
      picture: { art: 'wsjt-x' },
      heading: 'FT8 reads signals the ear cannot hear',
      text: [
        'FT8 is a digital mode for weak signals. It sends very short, fixed messages, like call signs and signal reports, in timed 15-second slots, and a computer decodes them. It works at a low signal-to-noise ratio: the signal can be fainter than the noise and still be read.',
        'FT8 is part of the WSJT-X software suite. Other modes in it handle Earth-Moon-Earth (bouncing signals off the Moon), meteor scatter and weak signal propagation beacons.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug hears only hiss on the band, yet his screen shows Jeff calling on FT8. How?',
        options: [
          { id: 'fm', label: 'FT8 is a wideband FM mode, so it is always loud', why: 'FT8 is narrow and carries short text messages, not wideband FM voice.' },
          { id: 'snr', label: 'FT8 can be decoded even when the signal is below the noise', right: true, why: 'Right. FT8 is built for low signal-to-noise operation.' },
          { id: 'rpt', label: 'FT8 goes through an eight-channel repeater', why: 'FT8 has nothing to do with repeater channels. It is a weak-signal mode.' },
        ],
      },
      remember: 'FT8 is a digital mode capable of low signal-to-noise operation. WSJT-X supports Earth-Moon-Earth, meteor scatter and weak signal propagation beacons.',
    },
    {
      type: 'card',
      id: 'dmr',
      idea: 'DMR time slots',
      covers: ['T8D07'],
      picture: { draw: TimeSlots },
      heading: 'DMR fits two conversations in one channel',
      text: [
        'DMR, Digital Mobile Radio, is a digital voice system. It splits one 12.5 kHz repeater channel into two time slots that take turns many times a second.',
        'Each slot carries its own conversation, so one channel carries two at once. Sharing a channel by taking turns like this is called time-multiplexing.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug is talking on slot 1 of a DMR repeater. Can Jeff hold a different conversation on the same channel at the same time?',
        options: [
          { id: 'no', label: 'No. One channel carries one conversation', why: 'A DMR channel carries two digital voice signals, one in each time slot.' },
          { id: 'two', label: 'Only by sending on two repeater inputs at once', why: 'DMR does not use two inputs. It shares one channel in time.' },
          { id: 'yes', label: 'Yes, on slot 2, taking turns with slot 1', right: true, why: 'Yes. DMR time-multiplexes two digital voice signals on one 12.5 kHz channel.' },
        ],
      },
      remember: 'DMR time-multiplexes two digital voice signals on a single 12.5 kHz repeater channel.',
    },
    {
      type: 'card',
      id: 'mesh',
      idea: 'Mesh networks',
      covers: ['T8D12'],
      picture: { art: 'mesh-network' },
      heading: 'A mesh network is ham Wi-Fi',
      text: [
        'An amateur mesh network is a high-speed data network. Each station in it, called a node, links by radio to its neighbors, and data hops from node to node until it arrives.',
        'Hams build it from ordinary commercial Wi-Fi equipment running modified firmware, the software inside the box, and use it mostly on amateur microwave bands.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug wants to add a node to his club’s mesh network. What will it most likely be?',
        options: [
          { id: 'sat', label: 'A modified satellite TV dish', why: 'Mesh networks are on the ground. They do not use satellite TV hardware.' },
          { id: 'wifi', label: 'A commercial Wi-Fi unit with modified firmware', right: true, why: 'Right. Amateur mesh networks use commercial Wi-Fi equipment with modified firmware.' },
          { id: 'dmr', label: 'A DMR radio sending digital voice', why: 'A mesh network carries data. It is not a DMR digital voice mode.' },
        ],
      },
      remember: 'An amateur mesh network is a data network using commercial Wi-Fi equipment with modified firmware.',
    },
    {
      type: 'card',
      id: 'tv',
      idea: 'NTSC fast-scan TV',
      covers: ['T8D04'],
      picture: { art: 'ntsc' },
      heading: 'NTSC: the old TV signal hams still use',
      text: [
        'Fast-scan TV is full-motion video, like broadcast TV. Hams can send it in the same format North American TV stations once used, called NTSC.',
        'NTSC is an analog fast-scan color TV signal. It is not digital, it does not encrypt anything, and it is not a way of compressing video.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug plugs a camera with an NTSC output into his TV transmitter. What kind of signal is it?',
        options: [
          { id: 'enc', label: 'A digital signal that encrypts the picture', why: 'NTSC is analog, and it does not encrypt anything.' },
          { id: 'zip', label: 'A scheme for compressing video frames', why: 'NTSC is a signal format, not a compression scheme.' },
          { id: 'ana', label: 'An analog fast-scan color TV signal', right: true, why: 'Yes. NTSC is an analog fast-scan color TV signal.' },
        ],
      },
      remember: 'NTSC is an analog fast-scan color TV signal.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T8D06', 'T8D07', 'T8D08', 'T8D10', 'T8D11'],
      questions: [
        {
          q: 'A packet reaches Jeff with a checksum that does not match. What does ARQ do?',
          review: 'packet',
          covers: ['T8D08', 'T8D11'],
          choices: [
            { label: 'Fixes the picture colors', why: 'ARQ has nothing to do with video. It deals with data errors.' },
            { label: 'Asks the sending station to send it again', right: true, why: 'ARQ is automatic repeat request: the receiver finds the error and asks for a resend.' },
            { label: 'Nothing. Damaged packets are kept', why: 'Packet radio is built to catch damaged packets, and ARQ asks for them again.' },
          ],
        },
        {
          q: 'What does a PSK signal change to send its data?',
          review: 'keying',
          covers: ['T8D06'],
          choices: [
            { label: 'Its phase', right: true, why: 'PSK is Phase Shift Keying: data rides on shifts in phase.' },
            { label: 'Whether it is on or off', why: 'Switching on and off is CW, Morse code.' },
            { label: 'The repeater it goes through', why: 'PSK is a way of keying a signal, not a choice of repeater.' },
          ],
        },
        {
          q: 'Doug wants to try bouncing signals off the Moon. Which software has a mode for it?',
          review: 'ft8',
          covers: ['T8D10'],
          choices: [
            { label: 'APRS', why: 'APRS reports positions and messages on a map. It is not for moonbounce.' },
            { label: 'NTSC', why: 'NTSC is an analog TV signal, not software.' },
            { label: 'WSJT-X', right: true, why: 'WSJT-X supports Earth-Moon-Earth, along with meteor scatter and propagation beacons.' },
          ],
        },
        {
          q: 'How does one DMR repeater channel carry two conversations?',
          review: 'dmr',
          covers: ['T8D07'],
          choices: [
            { label: 'It uses two separate frequencies', why: 'DMR stays on one 12.5 kHz channel.' },
            { label: 'The two take turns in time slots', right: true, why: 'DMR time-multiplexes two digital voice signals on one channel.' },
            { label: 'It cannot. One channel, one conversation', why: 'A DMR channel has two time slots, one per conversation.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T8D01', 'T8D02', 'T8D03', 'T8D04', 'T8D05', 'T8D06', 'T8D07', 'T8D08', 'T8D09', 'T8D10', 'T8D11', 'T8D12'],
      facts: [
        { icon: IconDigital, text: 'Packet radio, IEEE 802.11 and FT8 are digital modes. A mesh network is a data network built from commercial Wi-Fi equipment with modified firmware.', covers: ['T8D01', 'T8D12'] },
        { icon: IconKey, text: 'CW is another name for a Morse code transmission. PSK means Phase Shift Keying.', covers: ['T8D06', 'T8D09'] },
        { icon: IconPacket, text: 'A packet has a header with the call sign it is sent to and a checksum. ARQ: the receiver detects errors and asks for a retransmission.', covers: ['T8D08', 'T8D11'] },
        { icon: IconMap, text: 'APRS sends GPS position, text messages and weather data, with stations shown on a real-time map.', covers: ['T8D03', 'T8D05'] },
        { icon: IconWeak, text: 'FT8 works at low signal-to-noise. WSJT-X supports Earth-Moon-Earth, meteor scatter and weak signal propagation beacons.', covers: ['T8D02', 'T8D10'] },
        { icon: IconSlots, text: 'DMR time-multiplexes two digital voice signals on one 12.5 kHz repeater channel. NTSC is an analog fast-scan color TV signal.', covers: ['T8D07', 'T8D04'] },
      ],
    },
  ],
};
export default T8D_DIGITAL_MODES;
