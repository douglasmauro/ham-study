import { h } from 'preact';
import type { FeatureDef, FeatureProps } from '../types';
import { LessonPlayer } from './Player';
import type { Lesson } from './types';
import { T3B_WAVELENGTH_FREQUENCY } from './content/t3b-wavelength-frequency';

/** Every lesson. Each also needs a line in manifest.ts with the same id. */
const ALL: Lesson[] = [T3B_WAVELENGTH_FREQUENCY];

export const ITEMS: FeatureDef[] = ALL.map((lesson) => ({
  id: lesson.id,
  title: lesson.title,
  blurb: lesson.blurb,
  kind: 'Lesson',
  sub: lesson.sub,
  groups: lesson.groups,
  minutes: lesson.minutes,
  component: ({ onDone }: FeatureProps) => h(LessonPlayer, { lesson, onDone }),
}));
