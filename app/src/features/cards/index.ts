import { h } from 'preact';
import type { FeatureDef, FeatureProps } from '../types';
import { Flash, type FlashDeck } from './Flash';
import { TrueFalse, type TFDeck } from './TrueFalse';
import { Spot, type SpotSet } from './Spot';
import { Talk, type TalkStrip } from './Talk';
import { FLASH_ANTENNAS, FLASH_SIGNALS, FLASH_SYMBOLS, FLASH_TEST, TF_ELECTRIC, TF_RULES, TF_SAFETY, TF_WAVES } from './decks';
import { SPOT_BENCH, SPOT_DIAL, SPOT_SAFETY, SPOT_STATION } from './scenes';
import { TALK_CQ, TALK_NET, TALK_REPEATER } from './talks';

type Meta = Pick<FeatureDef, 'id' | 'blurb' | 'groups' | 'minutes'>;

const flash = (deck: FlashDeck, m: Meta): FeatureDef => ({
  ...m, title: deck.title, sub: deck.sub, kind: 'Flashcards',
  component: (p: FeatureProps) => h(Flash, { ...p, deck }),
});
const tf = (deck: TFDeck, m: Meta): FeatureDef => ({
  ...m, title: deck.title, sub: deck.sub, kind: 'True or false',
  component: (p: FeatureProps) => h(TrueFalse, { ...p, deck }),
});
const spot = (set: SpotSet, m: Meta): FeatureDef => ({
  ...m, title: set.title, sub: set.sub, kind: 'Spot the mistake',
  component: (p: FeatureProps) => h(Spot, { ...p, set }),
});
const talk = (strip: TalkStrip, m: Meta): FeatureDef => ({
  ...m, title: strip.title, sub: strip.sub, kind: 'Radio conversation',
  component: (p: FeatureProps) => h(Talk, { ...p, strip }),
});

export const ITEMS: FeatureDef[] = [
  flash(FLASH_SYMBOLS, { id: 'flash-symbols', blurb: 'Twelve symbols from the exam figures, picture first', groups: ['T6A', 'T6B', 'T6C', 'T6D'], minutes: 4 }),
  tf(TF_RULES, { id: 'tf-rules', blurb: 'Bands, power, license term and identifying', groups: ['T1B', 'T1C', 'T1D', 'T1E', 'T1F'], minutes: 3 }),
  talk(TALK_REPEATER, { id: 'talk-repeater', blurb: 'Call, answer and identify on a repeater', groups: ['T2A', 'T1F'], minutes: 4 }),
  spot(SPOT_STATION, { id: 'spot-station', blurb: 'Two station hook-ups, one wiring mistake each', groups: ['T4A'], minutes: 3 }),
  tf(TF_WAVES, { id: 'tf-waves', blurb: 'Wavelength, the bands and how signals travel', groups: ['T3A', 'T3B', 'T3C'], minutes: 3 }),
  flash(FLASH_ANTENNAS, { id: 'flash-antennas', blurb: 'Antenna shapes, coax and connectors', groups: ['T9A', 'T9B'], minutes: 4 }),
  tf(TF_ELECTRIC, { id: 'tf-electric', blurb: 'Units, Ohm\'s law, power and decibels', groups: ['T5A', 'T5B', 'T5C', 'T5D'], minutes: 3 }),
  spot(SPOT_SAFETY, { id: 'spot-safety', blurb: 'A tower job and a shack power hook-up', groups: ['T0A', 'T0B'], minutes: 3 }),
  talk(TALK_CQ, { id: 'talk-cq', blurb: 'Call CQ, answer one and use Q signals', groups: ['T2A', 'T2B', 'T2C'], minutes: 4 }),
  flash(FLASH_SIGNALS, { id: 'flash-signals', blurb: 'CW, SSB, FM and satellite ideas as pictures', groups: ['T8A', 'T8B', 'T8C', 'T8D'], minutes: 4 }),
  spot(SPOT_DIAL, { id: 'spot-dial', blurb: 'Frequency, mode and power a Technician may use', groups: ['T1B'], minutes: 3 }),
  tf(TF_SAFETY, { id: 'tf-safety', blurb: 'Electrical, tower and RF exposure safety', groups: ['T0A', 'T0B', 'T0C'], minutes: 3 }),
  flash(FLASH_TEST, { id: 'flash-test', blurb: 'SWR readings, meters and test gear', groups: ['T7C', 'T7D'], minutes: 4 }),
  spot(SPOT_BENCH, { id: 'spot-bench', blurb: 'Meters on a circuit and a transmitter test', groups: ['T7C', 'T7D'], minutes: 3 }),
  talk(TALK_NET, { id: 'talk-net', blurb: 'Net control, emergencies and formal messages', groups: ['T2C'], minutes: 4 }),
];
