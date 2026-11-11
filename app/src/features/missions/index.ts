import type { FeatureDef, FeatureProps } from '../types';
import { h } from 'preact';
import { groupsOf, type Mission } from './model';
import { MissionPlayer } from './Player';
import { carolina } from './carolina';
import { repeater } from './repeater';
import { outage } from './outage';

export const MISSIONS: Mission[] = [carolina, repeater, outage];

export const ITEMS: FeatureDef[] = MISSIONS.map((m) => ({
  id: m.id,
  title: m.title,
  blurb: m.blurb,
  kind: 'Mission',
  sub: m.sub,
  groups: groupsOf(m),
  minutes: m.minutes,
  component: (props: FeatureProps) => h(MissionPlayer, { mission: m, ...props }),
}));
