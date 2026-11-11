import type { ComponentChildren } from 'preact';
import { TOPICS } from '../../lib/pool';
import { Icon } from '../../ui/Icon';
import './cards.css';

/** The frame every card format shares: back button, topic label, title and a progress row. */
export function Shell(props: {
  sub: string;
  kind: string;
  title: string;
  step: number; // items finished so far
  total: number;
  count: string; // e.g. "Card 3 of 10"
  children: ComponentChildren;
}) {
  const t = TOPICS[props.sub];
  const pct = props.total ? Math.round((props.step / props.total) * 100) : 0;
  return (
    <div class="screen cd-screen" style={{ '--cd-topic': t?.color ?? 'var(--accent)' }}>
      <div class="topbar">
        <a class="iconbtn" href="#/learn/cards" aria-label="Back"><Icon name="back" /></a>
        <div class="cd-head">
          <span class="cd-kicker">{props.sub} · {props.kind}</span>
          <h1>{props.title}</h1>
        </div>
      </div>
      <div class="cd-prog">
        <div class="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Progress">
          <div style={{ width: `${pct}%` }} />
        </div>
        <span class="cd-count">{props.count}</span>
      </div>
      {props.children}
    </div>
  );
}
