import type { Mission } from './model';
import { FusePic, MessagePic, NetPic, RuntimePic, ShortPic, WirePic } from './pics';

// Example station for the story (not pool figures): a 20 Ah battery and a 2 A average draw.
const AH = 20;
const AMPS = 2;

export const outage: Mission = {
  id: 'power-outage-station',
  title: 'Set up a station for a power outage',
  short: 'Power outage station',
  blurb: 'Run on a battery, wire and fuse it safely, then help the emergency net.',
  sub: 'T4',
  minutes: 9,
  goal: 'Keep your station on the air through a power outage and help the emergency net.',
  steps: [
    {
      // T4A09 battery time = ampere-hour rating divided by the average current draw.
      title: 'Size the battery',
      sub: 'T4',
      story: `A storm has cut the power, maybe for a long time. Your radio will run from a ${AH} ampere-hour battery. Mostly listening, sometimes transmitting, it draws about ${AMPS} amperes on average.`,
      formula: 'hours = amp-hours ÷ average amps',
      pic: ({ value = 4, solved }) => <RuntimePic hours={value} ah={AH} amps={AMPS} solved={solved} />,
      ask: 'About how long will the battery last?',
      decision: {
        type: 'slider',
        label: 'Battery lasts about',
        min: 2, max: 20, step: 2, start: 4, target: AH / AMPS,
        lessLabel: '2 hours', moreLabel: '2 hours',
        format: (v) => `${v} hours`,
        lowWhy: (v) => `${v} hours is too short. Divide the battery’s ampere-hour rating by the average current: ${AH} ÷ ${AMPS}.`,
        highWhy: (v) => `${v} hours is too long. Divide the battery’s ampere-hour rating by the average current: ${AH} ÷ ${AMPS}.`,
        rightWhy: `${AH} Ah ÷ ${AMPS} A = ${AH / AMPS} hours: the battery ampere-hour rating divided by the average current draw of the equipment.`,
        chip: (v) => `Battery: about ${v} hours`,
      },
      covers: ['T4A09'],
      recap: `Battery time is the ampere-hour rating divided by the average current draw: ${AH} Ah ÷ ${AMPS} A is about ${AH / AMPS} hours.`,
    },
    {
      // T0A01 shorting a 12 volt storage battery can cause burns, fire, or an explosion;
      // T0A10 rapid charging or discharging an unprotected battery: overheating or out-gassing.
      title: 'Respect the battery',
      sub: 'T0',
      story: 'It is a 12 volt storage battery with bare terminals and no protection circuit inside. You set it under the shelf where your tools are.',
      pic: ({ solved }) => <ShortPic solved={solved} />,
      ask: 'What is the real hazard here?',
      decision: {
        type: 'pick',
        chip: 'Battery terminals kept clear',
        options: [
          { text: 'A shock from touching both terminals with your hands', why: 'Not the hazard of a 12 volt battery. The danger is the very large current that flows when metal shorts the terminals.' },
          { text: 'Metal across the terminals: a short circuit', correct: true, why: 'Shorting the terminals can cause burns, fire, or an explosion. Keep tools and loose wire away from them.' },
          { text: 'Poison gas, set off by RF from the transmitter', why: 'RF does not do that. Overheating or out-gassing comes from charging or discharging an unprotected battery too fast.' },
        ],
      },
      covers: ['T0A01', 'T0A10'],
      recap: 'A shorted 12 volt battery can cause burns, fire, or an explosion. Charging or discharging it too fast can cause overheating or out-gassing.',
    },
    {
      // T4A03 short, heavy-gauge wires minimize voltage drop when transmitting.
      title: 'Wire it up',
      sub: 'T4',
      story: 'Now connect the radio’s DC power lead to the battery. The radio draws its highest current each time you transmit.',
      pic: ({ solved }) => <WirePic solved={solved} />,
      ask: 'Which wire do you use?',
      decision: {
        type: 'pick',
        chip: 'Short, heavy power wires',
        options: [
          { text: 'Long, thin wire, so the battery can sit across the room', why: 'Long, thin wire has more resistance, so the voltage at the radio sags each time you transmit.' },
          { text: 'Short, heavy-gauge wire', correct: true, why: 'Short, heavy-gauge wires minimize the voltage drop when transmitting.' },
          { text: 'Any wire: at 12 volts it makes no difference', why: 'It does. Thin or long wire drops voltage when the radio draws heavy current on transmit.' },
        ],
      },
      covers: ['T4A03'],
      recap: 'Short, heavy-gauge wires on the DC power connection keep the voltage drop small when transmitting.',
    },
    {
      // T0A04 a fuse removes power in case of an overload;
      // T0A05 never replace a 5 ampere fuse with a 20 ampere one: excessive current could cause a fire.
      title: 'Replace the fuse',
      sub: 'T0',
      story: 'You transmit and the radio goes dead. A stray strand of wire had shorted at the connector, and the 5 ampere fuse in the power lead did its job. You clear the short. The spares box holds one 5 ampere fuse and one 20 ampere fuse.',
      pic: ({ solved }) => <FusePic solved={solved} />,
      ask: 'What goes in the fuse holder?',
      decision: {
        type: 'pick',
        chip: '5 ampere fuse fitted',
        options: [
          { text: 'The 20 ampere fuse, so it will not blow again', why: 'Never. With a 20 ampere fuse in place of a 5 ampere one, excessive current could cause a fire.' },
          { text: 'A piece of wire across the holder', why: 'Then nothing removes power in an overload, and excessive current could cause a fire.' },
          { text: 'The 5 ampere fuse', correct: true, why: 'A fuse removes power in case of an overload. The same rating gives the same protection back.' },
        ],
      },
      covers: ['T0A04', 'T0A05'],
      recap: 'A fuse removes power in an overload. Replace it with the same rating: a bigger fuse could let excessive current cause a fire.',
    },
    {
      // T2C07 transmit only when directed by net control unless reporting an emergency;
      // T2C02 duties of net control; T2C06 what ARES is.
      title: 'Join the emergency net',
      sub: 'T2',
      story: 'You are back on the air. On the repeater an emergency net is running, with a net control station directing it. Many stations are ARES volunteers: licensed amateurs who have registered their qualifications and equipment for public service. You have nothing urgent to report.',
      pic: ({ solved }) => <NetPic solved={solved} arrow="toYou" label={solved ? 'Net control in the middle directs each station in turn. You wait until it calls on you.' : 'An emergency net: net control in the middle, stations around it, and you listening.'} />,
      ask: 'What do you do?',
      decision: {
        type: 'pick',
        chip: 'Net discipline',
        options: [
          { text: 'Listen, and transmit only when net control directs you', correct: true, why: 'Standard practice in a net: unless you are reporting an emergency, transmit only when directed by the net control station.' },
          { text: 'Call in at once so they know you are there', why: 'That interrupts the net. Net control directs communications between the stations checking in: wait for the call for check-ins.' },
          { text: 'Ask a friend on the net how they are doing', why: 'A side chat blocks the net. Transmit only when net control directs you.' },
        ],
      },
      covers: ['T2C07', 'T2C02', 'T2C06'],
      recap: 'In a net, net control directs the communications. You transmit only when directed.',
    },
    {
      // T2C07 the exception: reporting an emergency; T2C09 operating outside license privileges is
      // permitted only for the immediate safety of human life or protection of property.
      title: 'Emergency comes first',
      sub: 'T2',
      story: 'A neighbor runs over: a tree has fallen on a house and someone is hurt. The phones are down. Net control is in the middle of routine check-ins.',
      pic: ({ solved }) => <NetPic solved={solved} urgent arrow="toControl" label={solved ? 'You break in and report the emergency straight to net control.' : 'Net control is busy with other stations. You now have an emergency to report.'} />,
      ask: 'What now?',
      decision: {
        type: 'pick',
        chip: 'Emergency reported',
        options: [
          { text: 'Wait for your turn in the check-in list', why: 'Not with someone hurt. You wait for net control unless you are reporting an emergency, and this is one.' },
          { text: 'Break in now and report the emergency', correct: true, why: 'Reporting an emergency is the one exception to waiting until net control directs you.' },
          { text: 'Move to another frequency and call for help there', why: 'Net control is right here and listening. Report the emergency on the net at once.' },
          { text: 'Nothing: a Technician may not handle an emergency', why: 'Not true. For the immediate safety of human life, an operator may even transmit outside the frequency privileges of their license class.' },
        ],
      },
      covers: ['T2C07', 'T2C09'],
      recap: 'An emergency report does not wait for net control. Immediate safety of human life or protection of property comes first.',
    },
    {
      // T2C05 traffic = formal messages exchanged by net stations; T2C10 the preamble holds the
      // information needed to track the message; T2C11 the check is the number of words in the text;
      // T2C03 spell unusual words with a standard phonetic alphabet; T2B05 talking too loudly makes
      // FM audio drop out on voice peaks.
      title: 'Pass the message',
      sub: 'T2',
      story: 'Help is on its way. Net control now gives you a formal message to relay: in a net, formal messages are called traffic. The preamble holds what is needed to track the message, and the check is the number of words in the text.',
      pic: ({ solved }) => <MessagePic word="LEIGH" spelled={['Lima', 'Echo', 'India', 'Golf', 'Hotel']} solved={solved} />,
      ask: 'How do you make sure LEIGH is received correctly?',
      decision: {
        type: 'pick',
        chip: 'Message passed',
        options: [
          { text: 'Say it louder', why: 'It would still sound like “Lee”. Talking too loudly can also make FM audio drop out on voice peaks.' },
          { text: 'Send the word by voice, then in Morse code', why: 'That is not the technique. Unusual words are spelled out with a standard phonetic alphabet.' },
          { text: 'Spell it with the standard phonetic alphabet', correct: true, why: 'Spelling with a standard phonetic alphabet makes sure unusual words are received correctly.' },
        ],
      },
      covers: ['T2C05', 'T2C10', 'T2C11', 'T2C03', 'T2B05'],
      recap: 'Traffic is formal messages. The preamble tracks the message, the check counts the words, and unusual words are spelled phonetically.',
    },
  ],
};
