import type { VNode } from 'preact';
import { useState } from 'preact/hooks';
import type { FeatureProps } from '../types';
import { Shell } from './Shell';

export interface FlashCard {
  art: () => VNode; // the front: a picture only
  name: string; // the back: what it is
  rule: string; // the back: the one-line rule
}
export interface FlashDeck {
  sub: string;
  title: string;
  cards: FlashCard[];
}

interface Slot { i: number; again: boolean }

/** Picture flashcards: flip, then "Knew it" or "Still learning" (those come round once more). */
export function Flash({ deck, onDone }: FeatureProps & { deck: FlashDeck }) {
  const [queue, setQueue] = useState<Slot[]>(() => deck.cards.map((_, i) => ({ i, again: false })));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knew, setKnew] = useState(0);
  const slot = queue[pos];
  const card = deck.cards[slot.i];
  const first = deck.cards.length;

  function rate(knewIt: boolean) {
    let q = queue;
    let k = knew;
    if (!slot.again) {
      if (knewIt) k += 1;
      else q = [...queue, { i: slot.i, again: true }];
    }
    if (pos + 1 >= q.length) {
      onDone({ score: k, total: first });
      return;
    }
    setQueue(q);
    setKnew(k);
    setPos(pos + 1);
    setFlipped(false);
  }

  const count = slot.again ? `Second look ${pos - first + 1} of ${queue.length - first}` : `Card ${pos + 1} of ${first}`;
  return (
    <Shell sub={deck.sub} kind="Flashcards" title={deck.title} step={pos} total={queue.length} count={count}>
      <p class="cd-help">Look at the picture and say what it is. Then flip the card to check.</p>
      <button type="button" class="cd-flip" key={pos} onClick={() => setFlipped(!flipped)}
        aria-label={flipped ? 'Answer side. Tap to see the picture again' : 'Picture card. Tap to see the answer'}>
        <div class={`cd-flip-inner${flipped ? ' is-flipped' : ''}`}>
          <div class="cd-face cd-front">
            {slot.again && <span class="cd-again">Second look</span>}
            {card.art()}
            <span class="cd-tap">Tap to flip</span>
          </div>
          <div class="cd-face cd-back" aria-hidden={!flipped}>
            {card.art()}
            <span class="cd-name">{card.name}</span>
            <span class="cd-rule">{card.rule}</span>
          </div>
        </div>
      </button>
      <div aria-live="polite" class="cd-help" style={{ position: 'absolute', left: '-9999px' }}>
        {flipped ? `${card.name}. ${card.rule}` : ''}
      </div>
      <div class="cd-actions">
        {flipped ? (
          <div class="grid2">
            <button type="button" class="btn secondary" onClick={() => rate(false)}>Still learning</button>
            <button type="button" class="btn primary" onClick={() => rate(true)}>Knew it</button>
          </div>
        ) : (
          <button type="button" class="btn primary" onClick={() => setFlipped(true)}>Flip card</button>
        )}
      </div>
    </Shell>
  );
}
