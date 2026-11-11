import type { FlashDeck } from './Flash';
import type { TFDeck } from './TrueFalse';
import * as art from './art';

/* Every fact below is taken from the 2026-2030 Technician pool. Question ids are noted beside each card. */

/* ===================== picture flashcards ===================== */

export const FLASH_SYMBOLS: FlashDeck = {
  sub: 'T6',
  title: 'Name the schematic symbol',
  cards: [
    { art: art.symResistor, name: 'Resistor', rule: 'It opposes the flow of current in a circuit.' }, // T6C02, T6A01
    { art: art.symCapacitor, name: 'Capacitor', rule: 'Two conductive surfaces separated by an insulator. It stores energy in an electric field.' }, // T6C06, T6A04, T6A05
    { art: art.symBattery, name: 'Battery', rule: 'The long and short lines are its cells. It is component 4 in Figure T-1.' }, // T6C05
    { art: art.symTransistor, name: 'Transistor', rule: 'It controls the flow of current: it can be an electronic switch and can provide power gain.' }, // T6C03, T6D10, T6B03, T6B10
    { art: art.symLamp, name: 'Lamp', rule: 'The dome shape is a lamp. It is component 3 in Figure T-1.' }, // T6C04
    { art: art.symDiode, name: 'Diode', rule: 'It lets current flow in only one direction. Its two electrodes are the anode and the cathode.' }, // T6B02, T6B09
    { art: art.symLed, name: 'Light-emitting diode (LED)', rule: 'A diode with arrows for light. It lights when forward current flows, so it is a common visual indicator.' }, // T6C07, T6B07, T6D07
    { art: art.symVarResistor, name: 'Variable resistor', rule: 'The arrow means adjustable. A potentiometer controls resistance, for example as a volume control.' }, // T6C08, T6A02, T6A03
    { art: art.symTransformer, name: 'Transformer', rule: 'Two coils side by side. It can change 120 V AC to a lower AC voltage.' }, // T6C09, T6D06
    { art: art.symVarInductor, name: 'Variable inductor', rule: 'A coil with an arrow. An inductor is a coil of wire that stores energy in a magnetic field.' }, // T6C10, T6A06, T6A07
    { art: art.symSpst, name: 'Single-pole single-throw switch', rule: 'One lever and one contact: it opens or closes a single circuit.' }, // T6A09
    { art: art.symAntenna, name: 'Antenna', rule: 'The forked top on a stalk is the antenna. It is component 4 in Figure T-3.' }, // T6C11
  ],
};

export const FLASH_ANTENNAS: FlashDeck = {
  sub: 'T9',
  title: 'Antennas and feed lines by sight',
  cards: [
    { art: art.antYagi, name: 'Yagi (a beam antenna)', rule: 'A beam concentrates signals in one direction. Of the common types, the Yagi offers the greatest gain.' }, // T9A01, T9A06
    { art: art.antDipolePattern, name: 'Half-wave dipole', rule: 'It radiates its strongest signal broadside to the antenna, not off the ends.' }, // T9A10
    { art: art.antQuarterWave, name: 'Quarter-wave vertical', rule: 'A 19-inch vertical is a resonant quarter-wave on 2 meters.' }, // T9A08
    { art: art.antRubberDuck, name: 'Short flexible handheld antenna', rule: 'It has low efficiency compared with a full-sized quarter-wave antenna.' }, // T9A04
    { art: art.antLoadingCoil, name: 'Antenna loading', rule: 'An inductor (coil) inserted in the radiating element makes a short antenna electrically longer.' }, // T9A02
    { art: art.antShorten, name: 'Shorter means higher', rule: 'Shortening a dipole increases its resonant frequency.' }, // T9A05
    { art: art.antHorizontal, name: 'Horizontal polarization', rule: 'Polarization is described by the orientation of the electric field. Here it is horizontal.' }, // T9A03
    { art: art.antCoax, name: 'Coaxial cable', rule: 'The most common feed line: easy to use, with few special installation needs. Its usual impedance is 50 ohms.' }, // T9B02, T9B03
    { art: art.antPl259, name: 'PL-259 connector', rule: 'Commonly used at HF and VHF. Above 400 MHz, a Type N connector is the most suitable.' }, // T9B07, T9B06
    { art: art.antTuner, name: 'Antenna tuner (coupler)', rule: 'It matches the antenna system impedance to the transceiver\'s output impedance.' }, // T9B04
  ],
};

export const FLASH_SIGNALS: FlashDeck = {
  sub: 'T8',
  title: 'Signals you can picture',
  cards: [
    { art: art.sigCw, name: 'CW (Morse code)', rule: 'A carrier switched on and off. It has the narrowest bandwidth: about 150 Hz.' }, // T8D09, T8A05, T8A11
    { art: art.sigUsb, name: 'Upper sideband (SSB)', rule: 'SSB is a form of amplitude modulation, about 3 kHz wide. Upper sideband is normal on 10 meters, VHF and UHF.' }, // T8A01, T8A06, T8A08
    { art: art.sigFm, name: 'FM', rule: 'The frequency swings with the voice. FM (or PM) is what VHF and UHF voice repeaters commonly use.' }, // T8A04
    { art: art.sigLadder, name: 'A is CW, B is SSB, C is FM', rule: 'Narrow to wide: CW about 150 Hz, SSB voice about 3 kHz, FM voice 10 to 15 kHz.' }, // T8A11, T8A08, T8A09, T8A07
    { art: art.sigDoppler, name: 'Doppler shift', rule: 'The signal frequency appears to change because the satellite is moving relative to the Earth station.' }, // T8B07
    { art: art.sigUv, name: 'U/V satellite mode', rule: 'The uplink is in the 70-centimeter band and the downlink is in the 2-meter band.' }, // T8B08
    { art: art.sigLeo, name: 'Low Earth Orbit (LEO)', rule: 'A satellite in low Earth orbit takes around 100 minutes to go once around.' }, // T8B10
    { art: art.sigSpin, name: 'Spin fading', rule: 'The signal rises and falls because the satellite and its antennas are rotating.' }, // T8B09
    { art: art.sigGrid, name: 'Grid locator', rule: 'A letter-number designator assigned to a geographic location.' }, // T8C05
    { art: art.sigRdf, name: 'Radio direction finding', rule: 'A directional antenna is used to locate a hidden transmitter or a source of noise or jamming.' }, // T8C01, T8C02
  ],
};

export const FLASH_TEST: FlashDeck = {
  sub: 'T7',
  title: 'Read the meter, name the gear',
  cards: [
    { art: art.tstSwr1, name: 'SWR of 1:1', rule: 'A perfect impedance match between the antenna and the feed line.' }, // T7C04
    { art: art.tstSwr4, name: 'SWR of 4:1', rule: 'An impedance mismatch. Most solid-state transmitters cut power as SWR rises, to protect the output transistors.' }, // T7C06, T7C05
    { art: art.tstVoltmeter, name: 'Voltmeter, in parallel', rule: 'A voltmeter measures electric potential and is connected in parallel with the component.' }, // T7D01, T7D02
    { art: art.tstAmmeter, name: 'Ammeter, in series', rule: 'An ammeter measures current, so it is connected in series: the current flows through it.' }, // T7D04, T7D03
    { art: art.tstDummy, name: 'Dummy load', rule: 'A 50-ohm non-inductive resistor on a heat sink. It keeps test signals off the air.' }, // T7C01, T7C03
    { art: art.tstColdJoint, name: 'B is a cold solder joint', rule: 'A cold tin-lead joint looks rough or lumpy.' }, // T7D09
    { art: art.tstOhmCap, name: 'Ohmmeter on a big capacitor', rule: 'Across a large, discharged capacitor the reading shows increasing resistance with time.' }, // T7D10
    { art: art.tstCoaxWater, name: 'Water in the coax', rule: 'Moisture contamination causes coax to fail. Ultraviolet light can damage the jacket and let water in.' }, // T7C09, T7C10
    { art: art.tstFeedHeat, name: 'Feed line loss', rule: 'Power lost in a feed line is converted into heat.' }, // T7C07
    { art: art.tstAnalyzer, name: 'Antenna analyzer', rule: 'It shows whether an antenna is resonant at the frequency you want to use.' }, // T7C02
  ],
};

/* ===================== swipe true or false ===================== */

export const TF_RULES: TFDeck = {
  sub: 'T1',
  title: 'FCC rules: true or false?',
  cards: [
    { art: art.dial('28.400', 'SSB voice'), text: 'A Technician may use voice (phone) from 28.300 MHz to 28.500 MHz.', truth: true, why: '28.300 to 28.500 MHz on 10 meters is open to Technicians for phone.' }, // T1B01
    { text: 'Technicians have voice (phone) privileges on every HF band.', truth: false, why: 'On HF, a Technician has phone privileges on the 10-meter band only.' }, // T1B06
    { text: 'In their HF band segments, Technicians may use at most 200 watts peak envelope power.', truth: true, why: '200 watts PEP is the Technician limit on HF. Above 30 MHz the limit is 1500 watts.' }, // T1B11, T1B12
    { text: 'An FCC amateur radio license normally lasts five years.', truth: false, why: 'The normal license term is ten years.' }, // T1C08
    { text: 'If your license expires, you may keep transmitting during the two-year grace period.', truth: false, why: 'The grace period only lets you renew. You may not transmit until the license is renewed.' }, // T1C09, T1C11
    { art: art.picClock10, text: 'You must give your call sign at least every 10 minutes during a contact, and at the end.', truth: true, why: 'Identify at least every 10 minutes during a communication and at its end.' }, // T1F03
    { text: 'You may transmit as soon as you pass the exam, before your license shows in the FCC database.', truth: false, why: 'You may transmit once your license grant appears in the FCC license database.' }, // T1C10
    { text: 'Playing your favorite songs for friends over a repeater is allowed.', truth: false, why: 'Music is allowed only when it is incidental to an authorized retransmission of manned spacecraft communications.' }, // T1D04
    { text: 'An amateur station may never transmit without a control operator.', truth: true, why: 'Every transmission needs a control operator. Even a repeater has one, under automatic control.' }, // T1E01, T1E08
    { art: art.dial('50.050', 'CW'), text: '50.0 MHz to 50.1 MHz is limited to CW only.', truth: true, why: 'The CW-only segments are 50.0 to 50.1 MHz and 144.0 to 144.1 MHz.' }, // T1B07
  ],
};

export const TF_WAVES: TFDeck = {
  sub: 'T3',
  title: 'Radio waves: true or false?',
  cards: [
    { art: art.picWavePair, text: 'Wavelength gets shorter as frequency increases.', truth: true, why: 'Higher frequency means shorter wavelength. Wavelength in meters is about 300 divided by the frequency in MHz.' }, // T3B05, T3B06
    { text: 'Higher radio frequencies travel through free space faster than lower ones.', truth: false, why: 'All radio frequencies travel at the same velocity: the speed of light.' }, // T3B12, T3B04
    { text: 'VHF is the range from 30 MHz to 300 MHz.', truth: true, why: 'VHF is 30 to 300 MHz. UHF is 300 to 3000 MHz.' }, // T3B08, T3B09
    { text: 'HF is the range from 300 MHz to 3000 MHz.', truth: false, why: 'HF is 3 to 30 MHz. 300 to 3000 MHz is UHF.' }, // T3B10, T3B09
    { art: art.picFields, text: 'The electric and magnetic fields of a radio wave are at right angles to each other.', truth: true, why: 'A radio wave has an electric field and a magnetic field, at right angles.' }, // T3B01, T3B03
    { art: art.picCrossPol, text: 'On a line-of-sight VHF path, one vertical antenna and one horizontal antenna give a stronger signal.', truth: false, why: 'Cross-polarized antennas reduce the received signal strength.' }, // T3A04
    { art: art.picSkip, text: 'The ionosphere can reflect HF radio waves.', truth: true, why: 'The ionosphere is the region of the atmosphere that can reflect HF waves.' }, // T3A11
    { art: art.picRain, text: 'Fog and rain strongly weaken signals on the 10-meter and 6-meter bands.', truth: false, why: 'Fog and rain have little effect on 10-meter and 6-meter signals. Precipitation matters at microwave frequencies.' }, // T3A12, T3A07
    { art: art.picDuct, text: 'Tropospheric ducting is caused by temperature inversions in the atmosphere.', truth: true, why: 'A temperature inversion can carry VHF and UHF signals about 300 miles.' }, // T3C08, T3C06
    { art: art.picHorizon, text: 'For VHF and UHF, the radio horizon is closer than the visual horizon.', truth: false, why: 'The radio horizon is more distant, because the atmosphere refracts radio waves slightly.' }, // T3C11
  ],
};

export const TF_ELECTRIC: TFDeck = {
  sub: 'T5',
  title: 'Volts, amps and ohms: true or false?',
  cards: [
    { text: 'Electrical current is measured in amperes.', truth: true, why: 'Current, the flow of electrons, is measured in amperes.' }, // T5A01, T5A03
    { text: 'Electrical power is measured in volts.', truth: false, why: 'Power is measured in watts. The volt is the unit of voltage.' }, // T5A02
    { art: art.symBattery, text: 'A difference in voltage is what causes electrons to flow.', truth: true, why: 'Voltage is the push. Without a voltage difference, no current flows.' }, // T5A05
    { text: 'Glass is a good conductor of electricity.', truth: false, why: 'Glass is a good insulator. Metals conduct well because they have many free electrons.' }, // T5A08, T5A07
    { text: '1.5 amperes is the same as 1500 milliamperes.', truth: true, why: 'Milli means one thousandth, so 1.5 A is 1500 mA.' }, // T5B01
    { art: art.picDb, text: 'Raising power from 5 watts to 10 watts is a gain of about 10 dB.', truth: false, why: 'Doubling the power is about 3 dB. A gain of 10 dB means ten times the power, such as 20 watts to 200 watts.' }, // T5B09, T5B11
    { text: 'Power equals current times voltage: P = I × E.', truth: true, why: 'For example, 13.8 volts at 10 amperes is 138 watts.' }, // T5C08, T5C09
    { text: '12 volts at 2.5 amperes is 300 watts.', truth: false, why: 'P = I × E, so 2.5 × 12 is 30 watts.' }, // T5C10
    { art: art.picSeries, text: 'In a series circuit, the current is the same through all components.', truth: true, why: 'A series circuit has only one path, so the same current flows through every part.' }, // T5D13
    { art: art.picParallel, text: 'In a parallel circuit, the voltage is the same across all components.', truth: true, why: 'Each branch connects across the same two points, so each sees the same voltage.' }, // T5D14
    { text: 'The henry is the unit of capacitance.', truth: false, why: 'Capacitance is measured in farads. The henry is the unit of inductance.' }, // T5C02, T5C04
  ],
};

export const TF_SAFETY: TFDeck = {
  sub: 'T0',
  title: 'Safe or not: true or false?',
  cards: [
    { text: 'Radio signals are non-ionizing radiation.', truth: true, why: 'Radio waves are non-ionizing radiation.' }, // T0C01
    { art: art.picDna, text: 'RF radiation has enough energy to damage DNA, the way radioactivity does.', truth: false, why: 'RF does not have enough energy to cause chemical changes in cells and damage DNA.' }, // T0C12
    { art: art.picBurn, text: 'Touching an antenna while it is transmitting can give you an RF burn.', truth: true, why: 'An RF burn to the skin is the hazard of touching an antenna during a transmission.' }, // T0C07
    { art: art.picFuse, text: 'It is fine to replace a blown 5-ampere fuse with a 20-ampere fuse.', truth: false, why: 'A bigger fuse lets excessive current flow, which could cause a fire.' }, // T0A05
    { art: art.picCable, text: 'In a US three-wire 120 V AC cable, the black wire is the hot wire.', truth: true, why: 'Black insulation indicates hot.' }, // T0A03
    { art: art.picPsu, text: 'A power supply is safe to touch inside the moment you switch it off.', truth: false, why: 'Charge stored in the filter capacitors is still a hazard right after turn-off.' }, // T0A11
    { art: art.picTower, text: 'You may climb a tower alone as long as you wear a harness.', truth: false, why: 'It is never safe to climb a tower without a helper or observer.' }, // T0B03
    { text: 'Ground wires for lightning protection should be short and direct, with no sharp bends.', truth: true, why: 'Keep lightning grounds short and direct, and avoid sharp bends.' }, // T0B01, T0B10
    { art: art.picDuty, text: 'If duty cycle drops from 100 percent to 50 percent, the allowable power density doubles.', truth: true, why: 'Half the transmitting time means half the average exposure, so the allowable power density increases by a factor of 2.' }, // T0C03, T0C10
    { art: art.picPole, text: 'A utility pole is a safe, handy place to mount your antenna.', truth: false, why: 'The antenna could contact high-voltage power lines.' }, // T0B09
  ],
};
