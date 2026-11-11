import type { FeatureDef, FeatureProps } from '../types';
import { CLIP_DATA, lineMs, type ClipDef } from './data';
import { ClipPlayer } from './Player';
import { OhmsLawExtra, OhmsLawScene } from './scenes/OhmsLaw';
import { PowerExtra, PowerScene } from './scenes/Power';
import { WavelengthExtra, WavelengthScene } from './scenes/Wavelength';
import { RepeaterExtra, RepeaterScene } from './scenes/Repeater';
import { SwrExtra, SwrScene } from './scenes/Swr';
import { PropagationExtra, PropagationScene } from './scenes/Propagation';

/** The clips in the order Listen mode plays them. Narration lives in data/<id>.json. */
export const CLIPS: ClipDef[] = [
  { data: CLIP_DATA.ohmsLaw, Scene: OhmsLawScene, Extra: OhmsLawExtra },
  { data: CLIP_DATA.power, Scene: PowerScene, Extra: PowerExtra },
  { data: CLIP_DATA.wavelength, Scene: WavelengthScene, Extra: WavelengthExtra },
  { data: CLIP_DATA.repeater, Scene: RepeaterScene, Extra: RepeaterExtra },
  { data: CLIP_DATA.swr, Scene: SwrScene, Extra: SwrExtra },
  { data: CLIP_DATA.propagation, Scene: PropagationScene, Extra: PropagationExtra },
];

const seconds = (c: ClipDef) => Math.round(c.data.lines.reduce((n, _, i) => n + lineMs(c.data, i), 0) / 1000);

const clipItems: FeatureDef[] = CLIPS.map((c) => ({
  id: c.data.id,
  title: c.data.title,
  blurb: `${c.data.blurb} About ${seconds(c)} seconds.`,
  kind: 'Clip',
  sub: c.data.sub,
  groups: c.data.groups,
  minutes: 1,
  component: ({ onDone }: FeatureProps) => <ClipPlayer clips={[c]} onDone={() => onDone()} />,
}));

const listen: FeatureDef = {
  id: 'listen',
  title: 'Listen to all six',
  blurb: 'Every clip back to back, hands-free, with captions.',
  kind: 'Listen',
  sub: 'T5',
  groups: [...new Set(CLIPS.flatMap((c) => c.data.groups))].sort(),
  minutes: Math.ceil(CLIPS.reduce((n, c) => n + seconds(c), 0) / 60),
  component: ({ onDone }: FeatureProps) => <ClipPlayer clips={CLIPS} listen onDone={() => onDone()} />,
};

export const ITEMS: FeatureDef[] = [...clipItems, listen];
