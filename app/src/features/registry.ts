import type { FeatureDef } from './types';

/** Each area is loaded on demand, so a large area never slows the first screen. */
export const AREAS = {
  dragdrop: { title: 'Hands-on', blurb: 'Sort, order, match, label and build', load: () => import('./dragdrop') },
  cards: { title: 'Quick cards', blurb: 'Flashcards, true or false, spot the mistake', load: () => import('./cards') },
  labs: { title: 'Visual labs', blurb: 'Play with a concept and watch it change', load: () => import('./labs') },
  missions: { title: 'Missions', blurb: 'Use what you know in a real situation', load: () => import('./missions') },
  clips: { title: 'Concept clips', blurb: 'Short narrated animations', load: () => import('./clips') },
} as const;

export type AreaId = keyof typeof AREAS;

export async function loadArea(area: AreaId): Promise<FeatureDef[]> {
  return (await AREAS[area].load()).ITEMS;
}
