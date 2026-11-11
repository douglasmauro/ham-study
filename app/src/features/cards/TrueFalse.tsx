import type { VNode } from 'preact';
import { useRef, useState } from 'preact/hooks';
import type { FeatureProps } from '../types';
import { Icon } from '../../ui/Icon';
import { Shell } from './Shell';

export interface TFCard {
  text: string; // one clear statement
  truth: boolean;
  why: string; // one line shown after the answer
  art?: () => VNode;
}
export interface TFDeck {
  sub: string;
  title: string;
  cards: TFCard[];
}

const SWIPE = 70; // px of sideways travel that counts as an answer

/** Swipe right for true, left for false; the two buttons do the same. */
export function TrueFalse({ deck, onDone }: FeatureProps & { deck: TFDeck }) {
  const [pos, setPos] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; id: number } | null>(null);
  const card = deck.cards[pos];
  const total = deck.cards.length;
  const right = answer !== null && answer === card.truth;

  function give(a: boolean) {
    if (answer !== null) return;
    setAnswer(a);
    if (a === card.truth) setScore(score + 1);
    setDx(0);
    setDragging(false);
    start.current = null;
  }
  function next() {
    if (pos + 1 >= total) {
      onDone({ score, total });
      return;
    }
    setPos(pos + 1);
    setAnswer(null);
  }
  function down(e: PointerEvent) {
    if (answer !== null) return;
    start.current = { x: e.clientX, id: e.pointerId };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* capture is a nicety, not a need */ }
    setDragging(true);
  }
  function move(e: PointerEvent) {
    if (!start.current || start.current.id !== e.pointerId) return;
    setDx(e.clientX - start.current.x);
  }
  function up(e: PointerEvent) {
    if (!start.current || start.current.id !== e.pointerId) return;
    const d = e.clientX - start.current.x;
    start.current = null;
    setDragging(false);
    if (Math.abs(d) >= SWIPE) give(d > 0);
    else setDx(0);
  }
  function cancel() {
    start.current = null;
    setDragging(false);
    setDx(0);
  }

  const pull = Math.min(1, Math.abs(dx) / SWIPE);
  const cls = `cd-swipe${dragging ? ' is-drag' : ''}${answer === null ? '' : right ? ' is-right' : ' is-wrong'}`;
  return (
    <Shell sub={deck.sub} kind="True or false" title={deck.title} step={pos + (answer !== null ? 1 : 0)} total={total}
      count={`${pos + 1} of ${total}`}>
      <p class="cd-help">Swipe right for true, left for false. Or use the buttons.</p>
      <div class="cd-swipe-wrap">
        <div class={cls} key={pos}
          style={{ transform: dx ? `translateX(${dx}px) rotate(${dx / 24}deg)` : undefined }}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel}>
          <span class="cd-stamp cd-r" style={{ opacity: dx > 0 ? pull : 0 }}>TRUE</span>
          <span class="cd-stamp cd-l" style={{ opacity: dx < 0 ? pull : 0 }}>FALSE</span>
          {card.art?.()}
          <p class="cd-statement">{card.text}</p>
          {answer !== null && (
            <div class="cd-verdict" role="status">
              <b class={right ? 'cd-good' : 'cd-bad'}>
                <Icon name={right ? 'check' : 'x'} size={18} />
                {right ? 'Right.' : 'Not quite.'} This is {card.truth ? 'true' : 'false'}.
              </b>
              <span>{card.why}</span>
            </div>
          )}
        </div>
      </div>
      <div class="cd-actions">
        {answer === null ? (
          <div class="grid2">
            <button type="button" class="btn secondary cd-tfbtn" onClick={() => give(false)}><Icon name="back" size={18} />False</button>
            <button type="button" class="btn secondary cd-tfbtn" onClick={() => give(true)}>True<Icon name="chevron" size={18} /></button>
          </div>
        ) : (
          <button type="button" class="btn primary" onClick={next}>{pos + 1 >= total ? 'Finish' : 'Next'}</button>
        )}
      </div>
    </Shell>
  );
}
