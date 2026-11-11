import type { VNode } from 'preact';
import { useState } from 'preact/hooks';
import type { FeatureProps } from '../types';
import { Shell } from './Shell';

export const SCENE_W = 340;
export const SCENE_H = 260;

export interface SpotPart {
  label: string;
  x: number; y: number; w: number; h: number; // tap area in scene units (340 x 260)
  n?: 'tl' | 'tr' | 'bl' | 'br'; // corner for the number badge, so it never covers a label
  wrong?: boolean; // exactly one part per scene
  why: string; // why it is fine, or why it is the mistake
}
export interface SpotScene {
  name: string;
  alt: string; // describes the drawing for screen readers
  art: () => VNode; // an <svg viewBox="0 0 340 260">
  parts: SpotPart[];
}
export interface SpotSet {
  sub: string;
  title: string;
  scenes: SpotScene[];
}

/** A drawing with one thing wrong. Tap the mistake; a wrong tap says why that part is fine. */
export function Spot({ set, onDone }: FeatureProps & { set: SpotSet }) {
  const [pos, setPos] = useState(0);
  const [cleared, setCleared] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const [found, setFound] = useState(false);
  const [score, setScore] = useState(0);
  const scene = set.scenes[pos];
  const total = set.scenes.length;

  function tap(i: number) {
    if (found || cleared.includes(i)) return;
    setLast(i);
    if (scene.parts[i].wrong) {
      setFound(true);
      if (!cleared.length) setScore(score + 1);
    } else {
      setCleared([...cleared, i]);
    }
  }
  function next() {
    if (pos + 1 >= total) {
      onDone({ score, total });
      return;
    }
    setPos(pos + 1);
    setCleared([]);
    setLast(null);
    setFound(false);
  }
  const state = (i: number) => (found && scene.parts[i].wrong ? ' is-found' : cleared.includes(i) ? ' is-fine' : '');
  const lastPart = last === null ? null : scene.parts[last];

  return (
    <Shell sub={set.sub} kind="Spot the mistake" title={set.title} step={pos + (found ? 1 : 0)} total={total}
      count={`Scene ${pos + 1} of ${total}`}>
      <p class="cd-help"><b>{scene.name}.</b> One thing here is wrong. Tap it in the drawing or in the list.</p>
      <div class="cd-scene">
        <div class="cd-scene-in" role="group" aria-label={scene.alt}>
          {scene.art()}
          {scene.parts.map((p, i) => (
            <button type="button" key={`${pos}-${i}`} class={`cd-hot cd-n-${p.n ?? 'tl'}${state(i)}`} onClick={() => tap(i)}
              aria-label={`${i + 1}: ${p.label}`} disabled={found || cleared.includes(i)}
              style={{ left: `${(p.x / SCENE_W) * 100}%`, top: `${(p.y / SCENE_H) * 100}%`, width: `${(p.w / SCENE_W) * 100}%`, height: `${(p.h / SCENE_H) * 100}%` }}>
              <span class="cd-num" aria-hidden="true">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
      <div class={`cd-msg ${lastPart ? (lastPart.wrong ? 'is-good' : 'is-bad') : 'is-idle'}`} role="status">
        {lastPart ? (
          <>
            <b>{lastPart.wrong ? `You found it: ${lastPart.label}.` : `${lastPart.label}: not the mistake.`}</b>
            <span>{lastPart.why}</span>
          </>
        ) : 'Tap the part you think is wrong.'}
      </div>
      <div class="cd-parts">
        {scene.parts.map((p, i) => (
          <button type="button" key={`${pos}-${i}`} class={`cd-part${state(i)}`} onClick={() => tap(i)}
            disabled={found || cleared.includes(i)}>
            <span class="cd-num" aria-hidden="true">{i + 1}</span>
            <span>{p.label}</span>
            {found && p.wrong && <span class="cd-tag" style={{ color: 'var(--good)' }}>Mistake</span>}
            {cleared.includes(i) && <span class="cd-tag muted">Fine</span>}
          </button>
        ))}
      </div>
      {found && (
        <div class="cd-actions">
          <button type="button" class="btn primary" onClick={next}>{pos + 1 >= total ? 'Finish' : 'Next scene'}</button>
        </div>
      )}
    </Shell>
  );
}
