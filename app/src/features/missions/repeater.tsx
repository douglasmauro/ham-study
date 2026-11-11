import type { Mission } from './model';
import { IdTimelinePic, NetPic, OffsetPic, RepeaterPic, SimplexPic, TalkPic, TonePic } from './pics';

const OUT = 146940; // the repeater's transmit frequency in kHz (an example, not a pool figure)
const mhz = (khz: number) => (khz / 1000).toFixed(3) + ' MHz';

export const repeater: Mission = {
  id: 'repeater-net-check-in',
  title: 'Check into a local net on a 2 meter repeater',
  short: 'Join the repeater net',
  blurb: 'Set the offset and tone, call the right way and follow net control.',
  sub: 'T2',
  minutes: 9,
  goal: 'Check into the weekly club net on your local 2 meter repeater.',
  steps: [
    {
      // T1F09 a repeater retransmits another station's signal at the same time on a different channel;
      // T8A04 FM or PM is common for VHF and UHF voice repeaters; T8A03 SSB for weak-signal VHF work.
      title: 'Set the mode',
      sub: 'T8',
      story: 'The club net meets on a 2 meter repeater: a station that receives a signal and retransmits it at the same moment on a different channel. A small radio can then cover the whole area.',
      pic: ({ solved }) => <RepeaterPic solved={solved} mode="FM" />,
      ask: 'Which mode do you set for a voice repeater?',
      decision: {
        type: 'pick',
        chip: 'FM',
        options: [
          { text: 'SSB, upper sideband', why: 'SSB is the voice mode for long-distance, weak-signal contacts on VHF. Repeaters commonly use FM.' },
          { text: 'FM', correct: true, why: 'FM (or PM) is the modulation commonly used for VHF and UHF voice repeaters.' },
          { text: 'CW', why: 'CW is Morse code. This is a voice net on an FM repeater.' },
        ],
      },
      covers: ['T1F09', 'T8A04', 'T8A03'],
      recap: 'A repeater retransmits your signal on a different channel. Voice repeaters commonly use FM.',
    },
    {
      // T2A07 offset = difference between a repeater's transmit and receive frequencies;
      // T2A01 common 2 meter offset is plus or minus 600 kHz; T2A03 70 centimeters: plus or minus 5 MHz.
      title: 'Set the offset',
      sub: 'T2',
      story: 'The club lists the repeater as 146.940 MHz with a minus offset. That is where the repeater transmits and you listen. It listens for you on a second frequency. The gap between the two is the repeater offset.',
      pic: ({ value = OUT, solved }) => (
        <OffsetPic tx={(value / 1000).toFixed(3)} out={(OUT / 1000).toFixed(3)} ok={solved}
          diff={value === OUT ? 'none' : `${Math.abs(OUT - value)} kHz ${value < OUT ? 'below' : 'above'}`} />
      ),
      ask: 'Set your transmit frequency for the usual 2 meter offset.',
      decision: {
        type: 'slider',
        label: 'You transmit on',
        min: OUT - 1000, max: OUT + 1000, step: 100, start: OUT, target: OUT - 600,
        lessLabel: '100 kHz', moreLabel: '100 kHz',
        format: mhz,
        lowWhy: (v) => `That is ${OUT - v} kHz below the repeater, which is too far. A common repeater offset on 2 meters is 600 kHz.`,
        highWhy: (v) => v > OUT
          ? 'That is above the repeater’s frequency. The listing says minus, so you transmit below it.'
          : v === OUT
            ? 'Now you would transmit on the same frequency the repeater transmits on. It listens for you on a different one.'
            : `Only ${OUT - v} kHz below the repeater. A common repeater offset on 2 meters is 600 kHz.`,
        rightWhy: 'A common repeater offset on 2 meters is plus or minus 600 kHz, and this one is minus. (On 70 centimeters the common offset is plus or minus 5 MHz.)',
        chip: () => 'Offset: minus 600 kHz',
      },
      covers: ['T2A07', 'T2A01', 'T2A03'],
      recap: 'Offset is the difference between the repeater’s transmit and receive frequencies: commonly plus or minus 600 kHz on 2 meters.',
    },
    {
      // T2B02 CTCSS: sub-audible tone sent with voice to open a receiver's squelch; T2B04 wrong offset,
      // CTCSS tone or DCS code can keep you out; T2B06 DTMF uses two tones; T2B13 purpose of squelch.
      title: 'Open the repeater',
      sub: 'T2',
      story: 'You press the button and give your call sign. Nothing comes back, yet you can hear other stations on the repeater. Your offset is right.',
      pic: ({ solved }) => <TonePic solved={solved} />,
      ask: 'What is most likely missing?',
      decision: {
        type: 'pick',
        chip: 'CTCSS tone set',
        options: [
          { text: 'The CTCSS tone', correct: true, why: 'CTCSS is a sub-audible tone sent along with your voice to open the squelch of the receiver. A wrong tone, or a wrong DCS code, keeps you out.' },
          { text: 'More transmitter power', why: 'You hear the repeater well, so check the settings first: the offset, the CTCSS tone or the DCS code.' },
          { text: 'DTMF tones from the keypad', why: 'DTMF is signaling with two audio tones at once. The tone that rides under your voice is CTCSS.' },
          { text: 'A higher squelch setting', why: 'Squelch only mutes your own receiver when no signal is present. It does not change what you send.' },
        ],
      },
      covers: ['T2B02', 'T2B04', 'T2B06', 'T2B13'],
      recap: 'If you hear a repeater but cannot get in, check the offset, the CTCSS tone and the DCS code.',
    },
    {
      // T2A04 call a known station on a repeater: their call sign, then yours;
      // T2A09 "call sign, listening" shows you are looking for a contact; T2A06 CQ is for off-repeater calls.
      title: 'Call a friend',
      sub: 'T2',
      story: 'You are in. The net starts in ten minutes and the repeater is quiet. Your friend may be listening, and you know their call sign.',
      pic: ({ solved }) => <TalkPic lines={['[their call sign],', 'this is [your call sign]']} caption="the repeater is quiet" solved={solved} />,
      ask: 'How do you call them?',
      decision: {
        type: 'pick',
        chip: 'Called by call sign',
        options: [
          { text: 'Say “CQ” three times, then both call signs', why: 'CQ is for seeking any station when you are not on a repeater. Here, say their call sign, then yours.' },
          { text: 'Say “break, break”, then both call signs', why: 'Not needed. Say the station’s call sign, then identify with your call sign.' },
          { text: 'Say their call sign, then your call sign', correct: true, why: 'That is the way to call a station on a repeater when you know its call sign.' },
          { text: 'Wait until they call CQ, then answer', why: 'They will not call CQ here. On a repeater a station says its call sign and “listening” to show it wants a contact.' },
        ],
      },
      covers: ['T2A04', 'T2A09', 'T2A06'],
      recap: 'On a repeater, say the other station’s call sign, then yours. To invite any contact, say your call sign and “listening”.',
    },
    {
      // T2C02 net control calls the net to order and directs communications;
      // T2C07 unless reporting an emergency, transmit only when directed by net control.
      title: 'Follow net control',
      sub: 'T2',
      story: 'On the hour a station calls the net to order. That is the net control station: it directs communications between the stations checking in.',
      pic: ({ solved }) => <NetPic solved={solved} arrow="toYou" label={solved ? 'Net control in the middle directs each station in turn. It now calls on you.' : 'Net control in the middle, stations around it, and you waiting.'} />,
      ask: 'When do you transmit?',
      decision: {
        type: 'pick',
        chip: 'Waited for net control',
        options: [
          { text: 'Right away, before the list gets long', why: 'That talks over the net. Unless you are reporting an emergency, wait until net control directs you.' },
          { text: 'When net control asks for check-ins or calls on you', correct: true, why: 'Standard practice in a net: unless you are reporting an emergency, transmit only when directed by the net control station.' },
          { text: 'In any pause between two stations', why: 'A pause is not an invitation. Net control directs who talks next.' },
        ],
      },
      covers: ['T2C02', 'T2C07'],
      recap: 'Net control calls the net to order and directs it. Transmit only when directed, unless you are reporting an emergency.',
    },
    {
      // T1F03 identify at least every 10 minutes during and at the end of a communication;
      // T1F04 identify in English on phone; T1A03 a phonetic alphabet is encouraged on phone.
      title: 'Identify',
      sub: 'T1',
      story: 'After check-ins the net becomes a long round-table chat with many short transmissions. You must give your call sign often enough during it, and once more at the end.',
      pic: ({ value = 20, solved }) => <IdTimelinePic every={value} solved={solved} />,
      ask: 'Set the longest time you may go between identifications.',
      decision: {
        type: 'slider',
        label: 'Call sign every',
        min: 5, max: 30, step: 5, start: 20, target: 10,
        lessLabel: '5 min', moreLabel: '5 min',
        format: (v) => `${v} minutes`,
        lowWhy: (v) => `Every ${v} minutes is allowed, but it is not the longest you may go. The rule says at least every 10 minutes.`,
        highWhy: (v) => `${v} minutes is too long. You must transmit your call sign at least every 10 minutes during a communication, and at the end.`,
        rightWhy: 'At least every 10 minutes during and at the end of a communication. On phone you identify in English, and using a phonetic alphabet is encouraged.',
        chip: () => 'Call sign every 10 minutes',
      },
      covers: ['T1F03', 'T1F04', 'T1A03'],
      recap: 'Give your call sign at least every 10 minutes and at the end, in English on phone.',
    },
    {
      // T2B09 simplex channels let stations in range talk without tying up a repeater; T2A11 simplex =
      // transmit and receive on the same frequency; T2B01 reverse listens on the repeater's input;
      // T2A02 146.520 MHz is the national FM simplex calling frequency on 2 meters.
      title: 'Free the repeater',
      sub: 'T2',
      story: 'The net closes. Your friend lives two streets away and wants to keep talking. The reverse function lets you listen on the repeater’s input frequency, and there you hear your friend directly, loud and clear.',
      pic: ({ solved }) => <SimplexPic solved={solved} />,
      ask: 'Where do you two carry on?',
      decision: {
        type: 'pick',
        chip: 'Moved to simplex',
        options: [
          { text: 'On the repeater: it is already set up', why: 'It works, but you would tie up the repeater when you can reach each other directly.' },
          { text: 'On a simplex frequency', correct: true, why: 'Simplex is transmitting and receiving on the same frequency. Simplex channels exist so stations in range of each other need not tie up a repeater.' },
          { text: 'On 146.940 MHz with the offset switched off', why: 'That is the repeater’s own transmit frequency, so you would interfere with it. Use a simplex channel instead.' },
        ],
      },
      covers: ['T2B09', 'T2A11', 'T2B01', 'T2A02'],
      recap: 'Stations in range of each other move to simplex and leave the repeater free. On 2 meters the national FM simplex calling frequency is 146.520 MHz.',
    },
  ],
};
