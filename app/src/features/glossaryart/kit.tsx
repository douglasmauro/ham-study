import type { ComponentChildren, VNode } from 'preact';
import './glossaryart.css';

/** A drawing for one glossary term. Takes no props; colors come from CSS. */
export type TermArt = () => VNode;

/**
 * The frame every glossary drawing sits in: a 240 x 140 canvas, scaled to the card.
 * `label` describes the picture for screen readers.
 *
 * Classes to use inside (see glossaryart.css):
 *   ga-w   wires, outlines and context, in a quiet gray
 *   ga-k   the thing being defined, in the topic color (the "key" part)
 *   ga-s   the signal, current or radio wave, in amber
 *   ga-fk / ga-fs / ga-fw   the same three as solid fills (no stroke)
 *   ga-thick / ga-thin      heavier or lighter stroke
 *   ga-dash                 dashed stroke, for something invisible or optional
 *   ga-t   label text (12 px), ga-tk label in the topic color, ga-ts in amber, ga-tm muted, ga-tb bold
 *   ga-good / ga-bad        stroke in the right or wrong color; ga-fgood / ga-fbad as fills
 */
export function Art({ label, children }: { label: string; children: ComponentChildren }) {
  return (
    <svg class="ga" viewBox="0 0 240 140" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/** Text shorthand: <T x y c="ga-tk" a="middle">label</T> */
export function T({ x, y, c = '', a = 'start', children }: { x: number; y: number; c?: string; a?: 'start' | 'middle' | 'end'; children: ComponentChildren }) {
  return <text x={x} y={y} class={`ga-t ${c}`} text-anchor={a}>{children}</text>;
}

/** Zigzag for a resistor starting at (x, y) and running 60 units to the right. */
export const zig = (x: number, y: number) => `M${x} ${y}l5 -10l10 20l10 -20l10 20l10 -20l10 20l5 -10`;

/** A sine wave path from x0 to x1 around y, with the given wavelength and amplitude. */
export function wave(x0: number, x1: number, y: number, length: number, amp: number, phase = 0): string {
  let d = '';
  for (let x = x0; x <= x1; x += 2) {
    const yy = y - amp * Math.sin(((x - x0) / length) * 2 * Math.PI + phase);
    d += `${x === x0 ? 'M' : 'L'}${x} ${yy.toFixed(1)}`;
  }
  return d;
}
