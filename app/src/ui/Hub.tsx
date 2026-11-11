import { useEffect, useState } from 'preact/hooks';
import { TOPICS } from '../lib/pool';
import { AREAS, loadArea, type AreaId } from '../features/registry';
import type { FeatureDef, FeatureResult } from '../features/types';
import { LIVE_LESSONS } from '../lib/lessons';
import { addActivity, newId, useData } from '../lib/store';
import { Icon } from './Icon';

function useArea(area: AreaId | null, listOnly = false) {
  const [items, setItems] = useState<FeatureDef[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    setItems(null);
    setError(false);
    if (!area) return;
    let live = true;
    loadArea(area).then((x) => live && setItems(area === 'lessons' && listOnly ? x.filter((i) => LIVE_LESSONS.has(i.id)) : x)).catch(() => live && setError(true));
    return () => { live = false; };
  }, [area]);
  return { items, error };
}

/** The "Learn" hub: every area, and the items inside the selected one. */
export function Hub({ area }: { area?: string }) {
  const data = useData();
  const current = area && area in AREAS ? (area as AreaId) : null;
  const { items, error } = useArea(current, true);
  const done = new Set((data.activities ?? []).filter((a) => a.area === current).map((a) => a.item));

  if (!current) {
    return (
      <div class="screen">
        <div class="topbar"><a class="iconbtn" href="#/" aria-label="Home"><Icon name="back" /></a><h1>Learn</h1></div>
        {(Object.keys(AREAS) as AreaId[]).map((id) => (
          <a class="tile-link" href={`#/learn/${id}`} style={{ minHeight: '72px' }}>
            <span class="t">{AREAS[id].title}</span>
            <span class="small muted">{AREAS[id].blurb}</span>
          </a>
        ))}
        <div class="grid2">
          <a class="tile-link" href="#/notebook"><span class="t">Picture notebook</span><span class="small muted">Concepts you struggled with</span></a>
          <a class="tile-link" href="#/report"><span class="t">Weekly report</span><span class="small muted">What improved, what's weak</span></a>
        </div>
        <a class="tile-link" href={`#/examsim?${Date.now()}`} style={{ minHeight: '72px' }}>
          <span class="t">Exam-day simulation</span><span class="small muted">Timed, real layout, no hints</span>
        </a>
      </div>
    );
  }

  return (
    <div class="screen">
      <div class="topbar"><a class="iconbtn" href="#/learn" aria-label="Back"><Icon name="back" /></a><h1>{AREAS[current].title}</h1></div>
      {error && <div class="card">This section could not be loaded. Check your connection and try again.</div>}
      {!items && !error && <div class="card muted">Loading…</div>}
      {items && !items.length && <div class="card muted">Nothing here yet.</div>}
      {items?.map((it) => {
        const t = TOPICS[it.sub];
        return (
          <a class="tile-link" href={`#/do/${current}/${it.id}?${Date.now()}`}>
            <span class="row" style={{ flexWrap: 'wrap', gap: '8px' }}>
              <span class="chip" style={{ color: t?.color }}><span class="dot" style={{ background: t?.color }} />{it.sub} · {it.kind}</span>
              <span class="small muted">{it.minutes} min</span>
              {done.has(it.id) && <span class="small" style={{ color: 'var(--good)', fontWeight: 700 }}>✓ Done</span>}
            </span>
            <span class="t">{it.title}</span>
            <span class="small muted">{it.blurb}</span>
          </a>
        );
      })}
    </div>
  );
}

/** Runs one item full-screen and records it when the learner finishes. */
export function FeatureHost({ area, id }: { area?: string; id?: string }) {
  const current = area && area in AREAS ? (area as AreaId) : null;
  const { items, error } = useArea(current);
  const [result, setResult] = useState<FeatureResult | 'done' | null>(null);
  const item = items?.find((x) => x.id === id);
  const back = `#/learn/${current ?? ''}`;

  if (!current || error || (items && !item)) {
    return <div class="screen"><div class="topbar"><a class="iconbtn" href="#/learn" aria-label="Back"><Icon name="back" /></a><h1>Not found</h1></div></div>;
  }
  if (!item) return <div class="screen"><div class="card muted">Loading…</div></div>;

  if (result) {
    return (
      <div class="screen">
        <div class="topbar"><h1>{item.title}</h1></div>
        <div class="card stack" style={{ alignItems: 'center', textAlign: 'center' }}>
          {result !== 'done' && <span class="score-big">{result.score} / {result.total}</span>}
          <span style={{ fontWeight: 700, color: 'var(--good)' }}>Finished</span>
        </div>
        <div class="grid2">
          <a class="btn secondary" href={back}>More {AREAS[current].title.toLowerCase()}</a>
          {current === 'lessons' && item.groups[0]
            ? <a class="btn primary" href={`#/group/${item.groups[0]}?${Date.now()}`}>Now try its questions</a>
            : <a class="btn primary" href="#/">Home</a>}
        </div>
      </div>
    );
  }

  const C = item.component;
  return (
    <C onDone={(r) => {
      addActivity({ id: newId(), t: Date.now(), area: current, item: item.id, score: r?.score, total: r?.total });
      setResult(r ?? 'done');
    }} />
  );
}
