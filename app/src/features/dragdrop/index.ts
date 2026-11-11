import { h, type ComponentType } from 'preact';
import type { FeatureDef, FeatureProps } from '../types';
import type { Meta } from './common';
import { Match } from './Match';
import { Order } from './Order';
import { Build, Label } from './Place';
import { Sort } from './Sort';
import * as text from './content-text';
import * as pic from './content-pictures';

/** The five hands-on formats. Each is one data-driven component. */
const FORMATS = {
  'Sort it': Sort,
  'Put it in order': Order,
  'Match it': Match,
  'Label the picture': Label,
  'Build it': Build,
} as const;

type Kind = keyof typeof FORMATS;
type SpecOf<K extends Kind> = Parameters<(typeof FORMATS)[K]>[0]['spec'];

function activity<K extends Kind>(kind: K, spec: SpecOf<K>, def: Omit<FeatureDef, 'kind' | 'component'>): FeatureDef {
  const meta: Meta = { title: def.title, sub: def.sub, kind };
  const Format = FORMATS[kind] as ComponentType<{ spec: SpecOf<K>; meta: Meta } & FeatureProps>;
  const component = (p: FeatureProps) => h(Format, { spec, meta, onDone: p.onDone });
  return { ...def, kind, component };
}

export const ITEMS: FeatureDef[] = [
  // T1 FCC rules
  activity('Sort it', text.allowedOrNot, { id: 'allowed-or-not', title: 'Allowed or not?', blurb: 'Sort eight things you might do on the air by what the rules say.', sub: 'T1', groups: ['T1A', 'T1B', 'T1C', 'T1D', 'T1E'], minutes: 3 }),
  activity('Match it', text.licenseNumbers, { id: 'license-numbers', title: 'The numbers on your license', blurb: 'Join each number to the rule it belongs to.', sub: 'T1', groups: ['T1B', 'T1C', 'T1F'], minutes: 3 }),
  // T2 Operating procedures
  activity('Match it', text.onAirShorthand, { id: 'on-air-shorthand', title: 'On-air shorthand', blurb: 'QRM, QSY, CQ and friends: join each one to its meaning.', sub: 'T2', groups: ['T2A', 'T2B'], minutes: 3 }),
  // T3 Propagation
  activity('Sort it', text.hfVhfUhf, { id: 'hf-vhf-uhf', title: 'HF, VHF or UHF?', blurb: 'Drop six frequencies into the right range.', sub: 'T3', groups: ['T3B'], minutes: 2 }),
  // T4 Station practices
  activity('Put it in order', text.stationChain, { id: 'station-chain', title: 'Wire up the station', blurb: 'From the wall outlet to the sky: what connects to what?', sub: 'T4', groups: ['T4A'], minutes: 2 }),
  activity('Build it', pic.buildMobileStation, { id: 'build-mobile-station', title: 'Put a radio in the car', blurb: 'Pick the right antenna, wires and ground for a mobile station.', sub: 'T4', groups: ['T4A', 'T9A'], minutes: 3 }),
  // T5 Electrical principles
  activity('Sort it', text.unitsMeasure, { id: 'units-measure', title: 'What does each unit measure?', blurb: 'Volts, amperes, watts and hertz, with their prefixes.', sub: 'T5', groups: ['T5A', 'T5B', 'T5C'], minutes: 3 }),
  activity('Put it in order', text.prefixLadder, { id: 'prefix-ladder', title: 'The prefix ladder', blurb: 'Line up pico to giga from smallest to largest.', sub: 'T5', groups: ['T5B'], minutes: 2 }),
  activity('Build it', pic.buildSeriesCircuit, { id: 'build-series-circuit', title: 'Light the lamp', blurb: 'Fill the gaps in a series circuit until current flows.', sub: 'T5', groups: ['T5D', 'T6A', 'T6C'], minutes: 3 }),
  // T6 Components
  activity('Label the picture', pic.labelFigureT1, { id: 'label-figure-t1', title: 'Name the parts in figure T-1', blurb: 'Resistor, transistor, lamp, battery: which symbol is which?', sub: 'T6', groups: ['T6C', 'T6D'], minutes: 2 }),
  activity('Label the picture', pic.labelSymbols, { id: 'label-symbols', title: 'Six schematic symbols', blurb: 'Name the symbols used in figures T-2 and T-3.', sub: 'T6', groups: ['T6C'], minutes: 3 }),
  activity('Match it', text.whatPartsDo, { id: 'what-parts-do', title: 'What does each part do?', blurb: 'Join six components to their jobs.', sub: 'T6', groups: ['T6A', 'T6B', 'T6D'], minutes: 3 }),
  // T7 Practical circuits
  activity('Match it', text.rightTool, { id: 'right-tool', title: 'The right tool for the job', blurb: 'Join six pieces of test gear to what they are for.', sub: 'T7', groups: ['T7C', 'T7D'], minutes: 3 }),
  // T8 Signals
  activity('Put it in order', text.bandwidthOrder, { id: 'bandwidth-order', title: 'Narrow to wide', blurb: 'Order four kinds of signal by the room they take up.', sub: 'T8', groups: ['T8A'], minutes: 2 }),
  // T9 Antennas
  activity('Label the picture', pic.labelDipole, { id: 'label-dipole', title: 'Parts of a dipole', blurb: 'Label the wire, the feed point, the coax and where the signal is strongest.', sub: 'T9', groups: ['T9A', 'T9B'], minutes: 2 }),
  // T0 Safety
  activity('Sort it', text.safeOrNot, { id: 'safe-or-not', title: 'Safe or unsafe?', blurb: 'Sort eight station habits into good practice and hazards.', sub: 'T0', groups: ['T0A', 'T0B', 'T0C', 'T7D'], minutes: 3 }),
];
