/**
 * The course outline: every lesson in teaching order. Kept apart from the lessons themselves
 * so the home screen and the drill can read it without loading any lesson content.
 * A lesson's content lives in content/<id>.tsx; it appears in the app once its id is listed
 * in LIVE_LESSONS (src/lib/lessons.ts).
 */
export interface LessonInfo {
  id: string; // also the file name in content/ and the lesson's address
  title: string;
  groups: string[]; // question groups this lesson teaches; their new questions wait for it
  order: number; // position in the teaching order
  minutes: number;
  unit: string; // the part of the course it belongs to
}

const U1 = 'How radio works', U2 = 'Electricity', U3 = 'Parts and circuits', U4 = 'Your station',
  U5 = 'Antennas and feed lines', U6 = 'On the air', U7 = 'Finding and fixing problems', U8 = 'The rules', U9 = 'Safety';

const row = (order: number, id: string, title: string, unit: string): LessonInfo =>
  ({ id, title, groups: [id.slice(0, 3).toUpperCase()], order, minutes: 8, unit });

export const LESSONS: LessonInfo[] = [
  row(1, 't3b-wavelength-frequency', 'Wavelength and frequency', U1),
  row(2, 't3a-signals-travel', 'How radio signals travel', U1),
  row(3, 't3c-propagation', 'Reaching beyond the horizon', U1),
  row(4, 't5a-current-voltage', 'Current, voltage and resistance', U2),
  row(5, 't5b-units-decibels', 'Units, prefixes and decibels', U2),
  row(6, 't5c-capacitance-power', 'Capacitance, inductance and power', U2),
  row(7, 't5d-ohms-law', "Ohm's law and simple circuits", U2),
  row(8, 't6a-components', 'Resistors, capacitors, inductors and batteries', U3),
  row(9, 't6b-semiconductors', 'Diodes and transistors', U3),
  row(10, 't6c-schematics', 'Reading a schematic', U3),
  row(11, 't6d-component-functions', 'What parts do in a circuit', U3),
  row(12, 't7a-station-equipment', 'Inside your radio', U4),
  row(13, 't8a-modes', 'Modes: FM, SSB and CW', U4),
  row(14, 't4a-station-setup', 'Setting up your station', U4),
  row(15, 't4b-operating-controls', "Your radio's controls", U4),
  row(16, 't9a-antennas', 'Antennas', U5),
  row(17, 't9b-feed-lines', 'Feed lines and connectors', U5),
  row(18, 't7c-swr', 'SWR and antenna measurements', U5),
  row(19, 't2a-making-contacts', 'Making contacts', U6),
  row(20, 't2b-repeaters', 'Repeaters and FM operating', U6),
  row(21, 't2c-nets-emergencies', 'Nets and emergencies', U6),
  row(22, 't8b-satellites', 'Satellites', U6),
  row(23, 't8c-activities', 'Operating activities', U6),
  row(24, 't8d-digital-modes', 'Digital modes', U6),
  row(25, 't7b-problems', 'Interference and audio problems', U7),
  row(26, 't7d-test-instruments', 'Test instruments and soldering', U7),
  row(27, 't1a-purpose-terms', 'What amateur radio is for', U8),
  row(28, 't1b-bands-privileges', 'Bands and privileges', U8),
  row(29, 't1c-licenses', 'Licenses and call signs', U8),
  row(30, 't1d-transmissions', 'What you may and may not transmit', U8),
  row(31, 't1e-control-operator', 'Control operators', U8),
  row(32, 't1f-identification', 'Identifying your station', U8),
  row(33, 't0a-electrical-safety', 'Electrical safety', U9),
  row(34, 't0b-tower-safety', 'Tower and antenna safety', U9),
  row(35, 't0c-rf-exposure', 'RF exposure', U9),
];
