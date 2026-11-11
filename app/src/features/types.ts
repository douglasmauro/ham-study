import type { ComponentType } from 'preact';

/** Result reported by an activity when the learner finishes it. */
export interface FeatureResult {
  score: number; // items right on the first try
  total: number;
}

export interface FeatureProps {
  /** Call once when the learner finishes. The host records it and shows the way back. */
  onDone: (result?: FeatureResult) => void;
}

/** One activity, lab, mission or clip that the hub can list and launch. */
export interface FeatureDef {
  id: string; // unique within its area, kebab-case, stable (progress is stored under it)
  title: string; // short, e.g. "What does each unit measure?"
  blurb: string; // one line shown in the list
  kind: string; // format label shown as a chip, e.g. "Sort it", "Lab", "Mission", "Clip"
  sub: string; // topic id it belongs to: 'T1'..'T9' or 'T0'
  groups: string[]; // question groups it teaches, e.g. ['T5A', 'T5B']
  minutes: number; // rough time to finish
  component: ComponentType<FeatureProps>;
}
