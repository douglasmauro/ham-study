import type { FeatureDef } from '../types';
import { AntennaLab } from './AntennaLab';
import { BandLab } from './BandLab';
import { DecibelLab } from './DecibelLab';
import { OhmLab } from './OhmLab';
import { PowerLab } from './PowerLab';
import { WavelengthLab } from './WavelengthLab';

export const ITEMS: FeatureDef[] = [
  { id: 'wavelength', title: 'Wavelength slider', blurb: 'Slide the frequency and watch the wave stretch and shrink.', kind: 'Lab', sub: 'T3', groups: ['T3B'], minutes: 3, component: WavelengthLab },
  { id: 'ohms-law', title: "Ohm's law circuit", blurb: 'Change voltage and resistance and watch the current speed up or slow down.', kind: 'Lab', sub: 'T5', groups: ['T5D'], minutes: 4, component: OhmLab },
  { id: 'power', title: 'Power: watts', blurb: 'See how current and voltage multiply into watts.', kind: 'Lab', sub: 'T5', groups: ['T5C'], minutes: 3, component: PowerLab },
  { id: 'band-explorer', title: 'Band explorer', blurb: 'Find the Technician bands on the frequency strip and tap for privileges.', kind: 'Lab', sub: 'T1', groups: ['T1B', 'T3B'], minutes: 4, component: BandLab },
  { id: 'decibels', title: 'Decibels and power', blurb: 'Step the power up and down by 3 dB and 10 dB.', kind: 'Lab', sub: 'T5', groups: ['T5B'], minutes: 3, component: DecibelLab },
  { id: 'antenna-length', title: 'Antenna length', blurb: 'Pick a frequency and see how long a dipole and a vertical must be.', kind: 'Lab', sub: 'T9', groups: ['T9A', 'T3B'], minutes: 3, component: AntennaLab },
];
