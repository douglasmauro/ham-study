import type { MatchSpec } from './Match';
import type { OrderSpec } from './Order';
import type { SortSpec } from './Sort';

/*
 * Sort, order and match activities. Every fact is tied to a question in the
 * 2026-2030 Technician pool; the ids are noted beside each line.
 */

// ---------------------------------------------------------------- Sort it

/** T5: what each unit measures. */
export const unitsMeasure: SortSpec = {
  buckets: [
    { id: 'V', title: 'Voltage', sub: 'makes electrons flow' }, // T5A05
    { id: 'I', title: 'Current', sub: 'the flow of electrons' }, // T5A03
    { id: 'P', title: 'Power', sub: 'rate energy is used' }, // T5A10
    { id: 'F', title: 'Frequency', sub: 'cycles per second' }, // T5A04
  ],
  cards: [
    { id: 'kv', text: 'Kilovolt', bucket: 'V', why: 'A kilovolt is one thousand volts, so it measures voltage.' }, // T5B03
    { id: 'uv', text: 'Microvolt', bucket: 'V', why: 'A microvolt is one one-millionth of a volt, so it measures voltage.' }, // T5B04
    { id: 'a', text: 'Ampere', bucket: 'I', why: 'Current is measured in amperes.' }, // T5A01
    { id: 'ma', text: 'Milliampere', bucket: 'I', why: 'A milliampere is a thousandth of an ampere, so it measures current. 1.5 amperes is 1500 milliamperes.' }, // T5B01
    { id: 'w', text: 'Watt', bucket: 'P', why: 'Power is measured in watts.' }, // T5A02
    { id: 'mw', text: 'Milliwatt', bucket: 'P', why: 'A milliwatt is a thousandth of a watt, so it measures power. 500 milliwatts is 0.5 watts.' }, // T5B05
    { id: 'hz', text: 'Hertz', bucket: 'F', why: 'The hertz is the unit of frequency.' }, // T5A06
    { id: 'mhz', text: 'Megahertz', bucket: 'F', why: 'Megahertz (MHz) measures frequency. 3.525 MHz is the same as 3525 kHz.' }, // T5C07, T5B07
  ],
};

/** T3: HF, VHF or UHF. */
export const hfVhfUhf: SortSpec = {
  how: 'Which range is each frequency in? Drag it to its bucket, or tap it and then a bucket.',
  buckets: [
    { id: 'HF', title: 'HF', miss: 'Not HF.', sub: '3 to 30 MHz' }, // T3B10
    { id: 'VHF', title: 'VHF', miss: 'Not VHF.', sub: '30 to 300 MHz' }, // T3B08
    { id: 'UHF', title: 'UHF', miss: 'Not UHF.', sub: '300 to 3000 MHz' }, // T3B09
  ],
  cards: [
    { id: 'f80', text: '3.525 MHz', bucket: 'HF', why: '3.525 MHz is between 3 and 30 MHz, so it is HF.' }, // T3B10 (frequency from T5B07)
    { id: 'f10', text: '28.400 MHz', bucket: 'HF', why: '28.400 MHz is between 3 and 30 MHz, so it is HF. It is in the 10-meter band.' }, // T3B10, T1B06 (frequency from T5B12)
    { id: 'f6', text: '52.525 MHz', bucket: 'VHF', why: '52.525 MHz is between 30 and 300 MHz, so it is VHF. It is in the 6-meter band.' }, // T3B08, T1B03
    { id: 'f2', text: '146.52 MHz', bucket: 'VHF', why: '146.52 MHz is between 30 and 300 MHz, so it is VHF. It is in the 2-meter band.' }, // T3B08, T1B04
    { id: 'f70', text: '446 MHz', bucket: 'UHF', why: '446 MHz is between 300 and 3000 MHz, so it is UHF.' }, // T3B09
    { id: 'f13', text: '2425 MHz', bucket: 'UHF', why: '2425 MHz is between 300 and 3000 MHz, so it is UHF. It can also be written 2.425 GHz.' }, // T3B09, T5B13
  ],
};

/** T0: safe practice or hazard. */
export const safeOrNot: SortSpec = {
  how: 'Is it good practice or a hazard? Drag each card to a bucket, or tap it and then a bucket.',
  long: true,
  buckets: [
    { id: 'safe', title: 'Safe', sub: 'good practice', miss: 'Not safe.' },
    { id: 'unsafe', title: 'Unsafe', sub: 'a hazard', miss: 'That one is safe.' },
  ],
  cards: [
    { id: 'fuse', text: 'Swap a 5-amp fuse for a 20-amp fuse', short: 'Bigger fuse', bucket: 'unsafe', why: 'A 5-ampere fuse must never be replaced with a 20-ampere fuse: excessive current could cause a fire.' }, // T0A05
    { id: 'alone', text: 'Climb a tower with no helper or observer', short: 'Climbing alone', bucket: 'unsafe', why: 'It is never safe to climb a tower without a helper or observer.' }, // T0B03
    { id: 'pole', text: 'Mount your antenna on a utility pole', short: 'Utility pole mount', bucket: 'unsafe', why: 'An antenna on a utility pole could contact high-voltage power lines.' }, // T0B09
    { id: 'touch', text: 'Touch the antenna while transmitting', short: 'Touching the antenna', bucket: 'unsafe', why: 'Touching an antenna during a transmission can give you an RF burn.' }, // T0C07
    { id: 'wires', text: 'Look for overhead power lines before raising a tower', short: 'Check for power lines', bucket: 'safe', why: 'Looking for overhead electrical wires, and staying clear of them, is an important precaution when putting up a tower.' }, // T0B04
    { id: 'bond', text: 'Bond all your ground rods together', short: 'Bonded ground rods', bucket: 'safe', why: 'All external ground rods should be bonded together with heavy wire or conductive strap.' }, // T0A09
    { id: 'ohms', text: 'Switch a circuit off before measuring its resistance', short: 'Power off first', bucket: 'safe', why: 'Before measuring resistance in a circuit with an ohmmeter, make sure the circuit is not powered.' }, // T7D11
    { id: 'short', text: 'Keep lightning ground wires short and direct', short: 'Short ground wires', bucket: 'safe', why: 'Ground connections for lightning protection should be short and direct.' }, // T0B01
  ],
};

/** T1: allowed or not allowed on the ham bands. */
export const allowedOrNot: SortSpec = {
  how: 'Do the FCC rules allow it? Drag each card to a bucket, or tap it and then a bucket.',
  long: true,
  buckets: [
    { id: 'yes', title: 'Allowed', miss: 'That is not allowed.' },
    { id: 'no', title: 'Not allowed', miss: 'That is allowed.' },
  ],
  cards: [
    { id: 'bcast', text: 'Broadcast to the general public', short: 'Broadcasting', bucket: 'no', why: 'Broadcasting, which means transmissions intended for the general public, is prohibited.' }, // T1D02, T1D10
    { id: 'jam', text: 'Interfere with another station on purpose', short: 'Willful interference', bucket: 'no', why: 'Willful or malicious interference is prohibited.' }, // T1A11
    { id: 'obscene', text: 'Use indecent or obscene language', short: 'Obscene language', bucket: 'no', why: 'Any indecent or obscene language is prohibited.' }, // T1D06
    { id: 'expired', text: 'Transmit while your expired license is in its grace period', short: 'Expired license', bucket: 'no', why: 'With an expired license you may not transmit, even in the grace period. You must wait until it has been renewed.' }, // T1C11
    { id: 'remote', text: 'Operate your station over the internet', short: 'Remote control', bucket: 'yes', why: 'Operating a station over the internet is remote control, and any station may be remotely controlled.' }, // T1E09, T1E10
    { id: 'sell', text: 'Now and then, tell other hams you have ham gear for sale', short: 'Selling ham gear', bucket: 'yes', why: 'You may tell other amateurs about amateur radio equipment for sale, as long as you do not do it on a regular basis.' }, // T1D05
    { id: 'model', text: 'Control a model craft without giving your call sign', short: 'Model craft control', bucket: 'yes', why: 'A station may transmit without identifying on the air when it sends signals to control model craft.' }, // T1D11
    { id: 'iss', text: 'Contact the Space Station on VHF as a Technician', short: 'Calling the ISS', bucket: 'yes', why: 'Any amateur with a Technician class or higher license may contact the International Space Station on VHF bands.' }, // T1B02
  ],
};

// ---------------------------------------------------------------- Put it in order

/** T4: the station chain, from the wall to the sky. */
export const stationChain: OrderSpec = {
  how: 'Order the parts from the wall outlet to the sky. Drag a row, or tap two rows to swap them.',
  startLabel: 'Wall outlet',
  endLabel: 'Sky',
  rows: [
    { id: 'psu', name: 'Power supply', sub: '13.8 volts for the radio' }, // T4A01
    { id: 'radio', name: 'Transceiver', sub: 'receiver and transmitter in one' }, // T7A02
    { id: 'meter', name: 'RF power meter', sub: 'reads the power going out' }, // T4A05
    { id: 'coax', name: 'Feed line', sub: 'coax that runs to the antenna' }, // T9B03
    { id: 'ant', name: 'Antenna', sub: 'where the signal leaves' },
  ],
  start: ['ant', 'meter', 'psu', 'coax', 'radio'],
  hint: 'Follow the power first, then the signal: the supply feeds the radio, and the radio feeds the antenna through the feed line.',
  // T4A05
  explain: 'The power supply runs the transceiver. An RF power meter goes in the feed line, between the transmitter and the antenna.',
};

/** T8: signal types from narrowest to widest. */
export const bandwidthOrder: OrderSpec = {
  how: 'Order the signals by how much room each takes on the band. Drag a row, or tap two rows to swap them.',
  startLabel: 'Narrowest',
  endLabel: 'Widest',
  rows: [
    { id: 'cw', name: 'CW', sub: 'Morse code' }, // T8A05, T8A11, T8D09
    { id: 'ssb', name: 'SSB voice', sub: 'single sideband' }, // T8A08
    { id: 'fm', name: 'FM voice', sub: 'as used on VHF repeaters' }, // T8A09
    { id: 'tv', name: 'Fast-scan TV', sub: 'an AM television picture' }, // T8A10
  ],
  start: ['fm', 'tv', 'cw', 'ssb'],
  hint: 'CW has the narrowest bandwidth of them all, and SSB is narrower than FM.', // T8A05, T8A07
  explain: 'CW needs about 150 Hz. An SSB voice signal is about 3 kHz. FM voice on a repeater is between 10 and 15 kHz. Fast-scan TV is about 6 MHz.',
};

/** T5: metric prefixes from smallest to largest. */
export const prefixLadder: OrderSpec = {
  how: 'Order the prefixes from the smallest to the largest. Drag a row, or tap two rows to swap them.',
  startLabel: 'Smallest',
  endLabel: 'Largest',
  rows: [
    { id: 'pico', name: 'pico', sub: 'as in picofarad' }, // T5B08
    { id: 'micro', name: 'micro', sub: 'as in microvolt' }, // T5B04
    { id: 'milli', name: 'milli', sub: 'as in milliampere' }, // T5B01, T5B06
    { id: 'kilo', name: 'kilo', sub: 'as in kilovolt' }, // T5B03
    { id: 'mega', name: 'mega', sub: 'as in megahertz' }, // T5B02, T5B07
    { id: 'giga', name: 'giga', sub: 'as in gigahertz' }, // T5B13
  ],
  start: ['kilo', 'pico', 'giga', 'milli', 'mega', 'micro'],
  hint: 'Milli is a thousandth and micro is a millionth, so micro is the smaller one. Kilo is a thousand and mega is a million.',
  explain: 'Below one: pico, micro (a millionth), milli (a thousandth). Above one: kilo (a thousand), mega (a million), giga. So 1,000,000 picofarads is 1 microfarad, and 2425 MHz is 2.425 GHz.',
};

// ---------------------------------------------------------------- Match it

/** T2: words you hear on the air. */
export const onAirShorthand: MatchSpec = {
  leftTitle: 'On the air',
  rightTitle: 'What it means',
  pairs: [
    { id: 'qrm', left: 'QRM', right: 'Interference from other stations', why: 'QRM means you are receiving interference from other stations.' }, // T2B10
    { id: 'qsy', left: 'QSY', right: 'Changing frequency', why: 'QSY means you are changing frequency.' }, // T2B11
    { id: 'cq', left: 'CQ', right: 'Calling any station', why: 'CQ means calling any station.' }, // T2A08
    { id: 'simplex', left: 'Simplex', right: 'Transmitting and receiving on the same frequency', why: 'Simplex means transmitting and receiving on the same frequency.' }, // T2A11
    { id: 'ctcss', left: 'CTCSS', right: 'A sub-audible tone that opens a receiver’s squelch', why: 'CTCSS is a sub-audible tone, sent along with your voice, that opens the squelch of a receiver.' }, // T2B02
    { id: 'dtmf', left: 'DTMF', right: 'Two audio tones sent at the same time', why: 'DTMF signaling uses two simultaneous audio tones.' }, // T2B06
  ],
};

/** T7: the right tool for the job. */
export const rightTool: MatchSpec = {
  leftTitle: 'Tool',
  rightTitle: 'Job',
  pairs: [
    { id: 'volt', left: 'Voltmeter', right: 'Measure electric potential', why: 'A voltmeter measures electric potential, which is voltage.' }, // T7D01
    { id: 'amp', left: 'Ammeter', right: 'Measure electric current', why: 'An ammeter measures electric current.' }, // T7D04
    { id: 'ohm', left: 'Ohmmeter', right: 'Measure resistance', why: 'An ohmmeter measures resistance. It applies a small current and measures the voltage that results.' }, // T7D05
    { id: 'dummy', left: 'Dummy load', right: 'Test a transmitter without putting a signal on the air', why: 'A dummy load lets you make tests without transmitting signals over the air.' }, // T7C01
    { id: 'analyzer', left: 'Antenna analyzer', right: 'See if an antenna is resonant on your frequency', why: 'An antenna analyzer shows whether an antenna is resonant at the frequency you want.' }, // T7C02
    { id: 'watt', left: 'Directional wattmeter', right: 'Find the SWR', why: 'A directional wattmeter can be used to determine SWR.' }, // T7C08
  ],
};

/** T6: what each part does. */
export const whatPartsDo: MatchSpec = {
  leftTitle: 'Part',
  rightTitle: 'What it does',
  pairs: [
    { id: 'r', left: 'Resistor', right: 'Opposes the flow of current', why: 'A resistor opposes the flow of current.' }, // T6A01
    { id: 'c', left: 'Capacitor', right: 'Stores energy in an electric field', why: 'A capacitor stores energy in an electric field.' }, // T6A04
    { id: 'l', left: 'Inductor', right: 'Stores energy in a magnetic field', why: 'An inductor stores energy in a magnetic field. It is usually a coil of wire.' }, // T6A06, T6A07
    { id: 'd', left: 'Diode', right: 'Lets current flow in only one direction', why: 'A diode allows current to flow in only one direction.' }, // T6B02
    { id: 'q', left: 'Transistor', right: 'Can provide power gain', why: 'A transistor can provide power gain. It can also be used as an electronic switch.' }, // T6B10, T6B03
    { id: 'k', left: 'Relay', right: 'A switch worked by electricity', why: 'A relay is an electrically-controlled switch.' }, // T6D02
  ],
};

/** T1: the numbers on your license. */
export const licenseNumbers: MatchSpec = {
  leftTitle: 'Number',
  rightTitle: 'What it is',
  pairs: [
    { id: 'term', left: '10 years', right: 'Normal term of a license', why: 'An amateur radio license normally lasts ten years.' }, // T1C08
    { id: 'grace', left: '2 years', right: 'Grace period to renew after a license expires', why: 'After a license expires there is a two-year grace period to renew it.' }, // T1C09
    { id: 'early', left: '90 days', right: 'How long before it expires you can ask to renew', why: 'You can ask to renew a license up to 90 days before it expires.' }, // T1C07
    { id: 'id', left: '10 minutes', right: 'Longest time between giving your call sign', why: 'You must give your call sign at least every 10 minutes during a communication, and at the end of it.' }, // T1F03
    { id: 'hf', left: '200 watts', right: 'Technician power limit on HF', why: 'Technicians may use at most 200 watts peak envelope power in their HF band segments.' }, // T1B11
    { id: 'vhf', left: '1500 watts', right: 'Technician power limit above 30 MHz', why: 'Above 30 MHz the limit for Technicians is 1500 watts peak envelope power, apart from some specific restrictions.' }, // T1B12
  ],
};
