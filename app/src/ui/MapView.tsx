import { useState } from 'preact/hooks';
import { TOPICS } from '../lib/pool';
import { computeStats } from '../lib/stats';
import { useData } from '../lib/store';
import { Icon } from './Icon';

const MARK = { mastered: '✓', learning: '•', weak: '!', new: '' } as const;
const LABEL = { mastered: 'Mastered', learning: 'Learning', weak: 'Weak', new: 'Not seen yet' } as const;

export function MapView() {
  const s = computeStats(useData());
  const [sel, setSel] = useState<string | null>(null);
  const selGroup = sel ? s.subs.flatMap((x) => x.groups).find((g) => g.id === sel) : null;

  return (
    <div class="screen">
      <div class="topbar">
        <a class="iconbtn" href="#/" aria-label="Home"><Icon name="back" /></a>
        <div class="stack" style={{ gap: '0' }}><h1>Mastery map</h1><span class="small muted">35 groups · one exam question each</span></div>
      </div>
      <div class="legend">
        <span><i style={{ background: 'var(--tile-mastered)' }} />Mastered ✓</span>
        <span><i style={{ background: 'var(--tile-learning)' }} />Learning •</span>
        <span><i style={{ background: 'var(--tile-weak)' }} />Weak !</span>
        <span><i style={{ background: 'var(--tile-new)' }} />Not seen</span>
      </div>
      {s.subs.map((sub) => {
        const t = TOPICS[sub.id];
        return (
          <div class="card stack" style={{ padding: '12px 14px' }}>
            <div class="row">
              <span class="dot" style={{ background: t.color }} />
              <span class="grow" style={{ fontWeight: 600 }}>{sub.id} · {t.name}</span>
              <span style={{ fontWeight: 700 }}>{Math.round(sub.mastery * 100)}%</span>
            </div>
            <div class="tiles">
              {sub.groups.map((g) => (
                <button class={`tile ${g.status}${sel === g.id ? ' sel' : ''}`} aria-label={`${g.id}, ${LABEL[g.status]}`} onClick={() => setSel(g.id)}>
                  <span>{g.id}</span><span>{MARK[g.status]}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {selGroup && (
        <div class="sheet">
          <div class="row between"><span style={{ fontWeight: 700, fontSize: '17px' }}>Group {selGroup.id}</span><span style={{ fontWeight: 700 }}>{LABEL[selGroup.status]} · {Math.round(selGroup.mastery * 100)}% mastered</span></div>
          <span class="small" style={{ color: 'var(--text-2)' }}>{selGroup.title}</span>
          <a class="btn primary block" href={`#/group/${selGroup.id}?${Date.now()}`}>Drill this group</a>
        </div>
      )}
    </div>
  );
}
