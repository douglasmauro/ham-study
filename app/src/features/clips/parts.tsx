import type { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';

/** Token colors for SVG parts, so a picture never hard-codes a color. */
export const C = {
  text: 'var(--text)',
  text2: 'var(--text-2)',
  muted: 'var(--muted)',
  line: 'var(--line-strong)',
  surface: 'var(--surface)',
  raised: 'var(--raised)',
  accent: 'var(--accent)',
  topic: 'var(--clip-topic)',
  good: 'var(--good)',
  bad: 'var(--bad)',
};

export type Pt = [number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** 0 to 1 over `dur` seconds, eased, for a change that follows the start of a line. */
export function ease(ts: number, dur = 0.6) {
  const x = clamp01(ts / dur);
  return x * x * (3 - 2 * x);
}
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export function pathLen(pts: Pt[]) {
  let n = 0;
  for (let i = 1; i < pts.length; i++) n += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return n;
}

export function pointAt(pts: Pt[], d: number): Pt {
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= seg || i === pts.length - 1) {
      const k = seg ? d / seg : 0;
      return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)];
    }
    d -= seg;
  }
  return pts[0];
}

/**
 * A distance that grows at `rate` per second of clip time. Unlike `t * rate`
 * it does not jump when the rate changes between lines.
 */
export function useFlow(t: number, rate: number) {
  const r = useRef({ t, off: 0 });
  const dt = t - r.current.t;
  r.current.off = dt >= 0 ? r.current.off + dt * rate : 0;
  r.current.t = t;
  return r.current.off;
}

/** Dots travelling along a line: current in a wire, a signal through the air. */
export function Dots({ pts, off, gap = 22, r = 3.5, color = C.accent, upTo, loop = false, skip, opacity = 1 }: {
  pts: Pt[];
  off: number; // how far the dots have moved, in px
  gap?: number;
  r?: number;
  color?: string;
  upTo?: number; // draw only the first part of the path (a signal still on its way)
  loop?: boolean; // closed path: dots wrap around
  skip?: (p: Pt) => boolean; // leave a dot out, for example where it would cover a symbol
  opacity?: number;
}) {
  const total = pathLen(pts);
  const end = Math.min(total, upTo ?? total);
  let d = '';
  const count = loop ? Math.round(total / gap) : Math.ceil(total / gap) + 1;
  const step = loop ? total / count : gap;
  for (let k = 0; k < count; k++) {
    const at = loop ? (off + k * step) % total : (off % step) + k * step;
    if (at > end) continue;
    const p = pointAt(pts, at);
    if (skip?.(p)) continue;
    d += `M${(p[0] - r).toFixed(1)} ${p[1].toFixed(1)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
  }
  return <path d={d || 'M0 0'} style={{ fill: color, opacity }} />;
}

/** A formula triangle: cover the one you want, the other two show how to find it. */
export function Triangle({ top, left, right, hot, label }: { top: string; left: string; right: string; hot: boolean; label: string }) {
  return (
    <div class={`clip-side${hot ? ' hot' : ''}`}>
      <svg width="104" height="92" viewBox="0 0 104 92" role="img" aria-label={label}>
        <path d="M52 6 L98 86 H6 Z" style={{ fill: 'none', stroke: C.text, strokeWidth: 2.5, strokeLinejoin: 'round' }} />
        <path d="M28 50 H76 M52 50 V86" style={{ stroke: C.text, strokeWidth: 2, strokeLinecap: 'round' }} />
        <text x="52" y="42" text-anchor="middle" style={{ fill: C.accent, fontSize: '18px', fontWeight: 700 }}>{top}</text>
        <text x="36" y="76" text-anchor="middle" style={{ fill: C.text, fontSize: '16px', fontWeight: 700 }}>{left}</text>
        <text x="68" y="76" text-anchor="middle" style={{ fill: C.text, fontSize: '16px', fontWeight: 700 }}>{right}</text>
      </svg>
    </div>
  );
}

/** The panel under the caption: the formula being taught and the sum being worked. */
export function Formula({ formula, work, dim, children }: { formula: string; work: string; dim: boolean; children?: ComponentChildren }) {
  return (
    <div class={`clip-extra${dim ? ' dim' : ''}`}>
      <div class="clip-formula">
        <span class="clip-formula-big">{formula}</span>
        <span class="clip-formula-work">{work}</span>
      </div>
      {children}
    </div>
  );
}

/** The panel under the caption for clips without a formula: key facts that light up when spoken. */
export function Facts({ items }: { items: { k: string; v: string; on: boolean; tone?: 'good' | 'bad' }[] }) {
  return (
    <div class="clip-extra">
      {items.map((it) => (
        <div class={`clip-fact${it.on ? ' on' : ''}${it.tone ? ' ' + it.tone : ''}`}>
          <span class="clip-fact-k">{it.k}</span>
          <span class="clip-fact-v">{it.v}</span>
        </div>
      ))}
    </div>
  );
}

/** Shared text styles for labels inside a picture. */
export const T = {
  label: { fill: C.text2, fontSize: '12.5px', fontWeight: 600 },
  value: { fill: C.text, fontSize: '15px', fontWeight: 700, fontFamily: 'var(--mono)' },
};
