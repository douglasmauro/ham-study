import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { Status } from '../../lib/engine';
import { TERMS, termStatus } from '../../lib/glossary';
import { POOL, TOPICS } from '../../lib/pool';
import { computeStats } from '../../lib/stats';
import { getData } from '../../lib/store';
import { ART } from '../glossaryart';
import type { FeatureDef, FeatureProps } from '../types';
import { Flash, type FlashDeck } from './Flash';

const DECK_SIZE = 12;
const WEAKEST_FIRST: Status[] = ['weak', 'learning', 'new', 'mastered'];

/**
 * A flashcard deck built from the glossary each time it is opened: up to twelve terms of one
 * topic, the ones the learner knows least first. The front shows the term's drawing and its
 * name; the back gives the definition.
 */
function buildDeck(sub: string): FlashDeck {
  const states = computeStats(getData()).states;
  const terms = TERMS.filter((t) => t.sub === sub && ART[t.id])
    .map((t) => ({ t, rank: WEAKEST_FIRST.indexOf(termStatus(t, states)), r: Math.random() }))
    .sort((a, b) => a.rank - b.rank || a.r - b.r)
    .slice(0, DECK_SIZE)
    .map((x) => x.t);
  return {
    sub,
    title: `${TOPICS[sub].name}: what does it mean?`,
    cards: terms.map((t) => {
      const Picture = ART[t.id];
      return {
        art: () => (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', ['--ga-key' as string]: sub === 'T0' ? 'var(--text)' : TOPICS[sub].color }}>
            <Picture />
            <span style={{ fontWeight: 700, fontSize: '18px' }}>{t.term}</span>
          </div>
        ),
        name: t.term,
        rule: t.more ? `${t.def} ${t.more}` : t.def,
      };
    }),
  };
}

function GlossaryFlash({ sub, onDone }: FeatureProps & { sub: string }) {
  const [deck] = useState(() => buildDeck(sub));
  return <Flash deck={deck} onDone={onDone} />;
}

export const GLOSSARY_DECKS: FeatureDef[] = POOL.subelements.map((s) => ({
  id: `glossary-${s.id.toLowerCase()}`,
  title: `${TOPICS[s.id].name}: glossary cards`,
  blurb: 'Twelve terms with their pictures, the ones you know least first',
  kind: 'Flashcards',
  sub: s.id,
  groups: s.groups.map((g) => g.id),
  minutes: 4,
  component: (p: FeatureProps) => h(GlossaryFlash, { ...p, sub: s.id }),
}));
