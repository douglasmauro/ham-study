import type { ComponentChildren } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import { seededRng, shuffle } from '../../lib/engine';
import { Icon } from '../../ui/Icon';
import './dragdrop.css';

/** What the screen frame needs to know about an activity. */
export interface Meta {
  title: string;
  sub: string; // topic id, e.g. 'T5'
  kind: string; // format name, e.g. 'Sort it'
}

export interface Feedback {
  tone: 'good' | 'bad' | 'info';
  text: string;
}

/** Screen frame shared by every format: back button, topic label, title, one line of how-to. */
export function Shell({ meta, how, children }: { meta: Meta; how: string; children: ComponentChildren }) {
  const topic = TOPICS[meta.sub];
  return (
    <div class="screen dd-screen" style={{ '--dd-topic': topic?.color } as Record<string, string | undefined>}>
      <div class="topbar">
        <a class="iconbtn" href="#/learn/dragdrop" aria-label="Back"><Icon name="back" /></a>
        <div class="dd-head">
          <span class="sub" style={{ color: topic?.color }}>{meta.sub} · {meta.kind}</span>
          <h1>{meta.title}</h1>
        </div>
      </div>
      <p class="dd-how">{how}</p>
      {children}
    </div>
  );
}

/** The one-line reason shown after every move. Color is always paired with an icon and a word. */
export function Message({ msg, idle }: { msg: Feedback | null; idle?: string }) {
  const m = msg ?? (idle ? { tone: 'info' as const, text: idle } : null);
  return (
    <div class={`dd-msg dd-${m?.tone ?? 'info'}`} role="status" aria-live="polite">
      {m && m.tone !== 'info' && (
        <span class="dd-msg-icon"><Icon name={m.tone === 'good' ? 'check' : 'x'} size={18} stroke={3} /></span>
      )}
      {m && <span>{m.text}</span>}
    </div>
  );
}

/** Appears when the activity is complete. The learner reads the last reason, then leaves. */
export function Finish({ show, summary, onFinish }: { show: boolean; summary: string; onFinish: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (show) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [show]);
  if (!show) return null;
  return (
    <div class="dd-finish" ref={ref}>
      <span class="dd-finish-text">{summary}</span>
      <button type="button" class="btn primary block" onClick={onFinish}>Finish</button>
    </div>
  );
}

/** A fresh shuffle each time the activity is opened, stable while it is open. */
export function useShuffled<T>(items: T[]): T[] {
  return useMemo(() => shuffle(items, seededRng(Math.floor(Math.random() * 0xffffffff))), [items]);
}

/** Calls `onDone` at most once. */
export function useOnce(fn: () => void): () => void {
  const fired = useRef(false);
  return () => {
    if (fired.current) return;
    fired.current = true;
    fn();
  };
}

export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** State for a "that was wrong" flash: it clears itself, so the red outline never lingers. */
export function useFlash<T>(ms = 600): [T | null, (v: T) => void] {
  const [value, setValue] = useState<T | null>(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [value, (v: T) => {
    setValue(v);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setValue(null), ms);
  }];
}
