import type { ComponentChildren } from 'preact';

/**
 * Helpers for a lesson's own pictures. Full-size pictures use the glossary kit
 * (`Art`, `T`, `wave` from ../glossaryart/kit) so they match the glossary drawings;
 * this file adds an arrow and the small icon frame used on the recap card.
 */
export { Art, T, wave } from '../glossaryart/kit';

const n = (v: number) => +v.toFixed(1);

/** Like the kit's `wave`, but sampled every half unit, for waves too short for its 2-unit steps. */
export function fineWave(x0: number, x1: number, y: number, length: number, amp: number): string {
  let d = '';
  for (let x = x0; x <= x1 + 0.01; x += 0.5) d += `${x === x0 ? 'M' : 'L'}${x} ${n(y - amp * Math.sin(((x - x0) / length) * 2 * Math.PI))}`;
  return d;
}

/** A line from (x1, y1) to (x2, y2) with an arrowhead at the end, or at both ends. */
export function Arrow({ x1, y1, x2, y2, c = 'ga-s', h = 6, both = false }: { x1: number; y1: number; x2: number; y2: number; c?: string; h?: number; both?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = (x: number, y: number, ang: number) =>
    `M${n(x - h * Math.cos(ang - 0.5))} ${n(y - h * Math.sin(ang - 0.5))}L${x} ${y}L${n(x - h * Math.cos(ang + 0.5))} ${n(y - h * Math.sin(ang + 0.5))}`;
  return <path class={c} d={`M${x1} ${y1}L${x2} ${y2}${head(x2, y2, a)}${both ? head(x1, y1, a + Math.PI) : ''}`} />;
}

/**
 * Frame for a recap icon: a 48 x 48 canvas, decorative. Inside, use the classes
 * ls-mk (topic color), ls-ms (amber, the wave) and ls-mw (gray); see lessons.css.
 */
export function Mini({ children }: { children: ComponentChildren }) {
  return <svg class="ls-mini" viewBox="0 0 48 48" aria-hidden="true">{children}</svg>;
}
