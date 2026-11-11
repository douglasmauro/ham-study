import { useMemo, useState } from 'preact/hooks';
import type { Status } from '../lib/engine';
import { TERMS, termStatus, type Term } from '../lib/glossary';
import { TOPICS } from '../lib/pool';
import { computeStats } from '../lib/stats';
import { useData } from '../lib/store';
import { Icon } from './Icon';

const LABEL: Record<Status, string> = { weak: "Don't know yet", learning: 'Still learning', mastered: 'Know it', new: 'Not seen yet' };
const COLOR: Record<Status, string> = { weak: 'var(--bad)', learning: 'var(--accent)', mastered: 'var(--good)', new: 'var(--tile-new)' };
const MARK: Record<Status, string> = { weak: '!', learning: '•', mastered: '✓', new: '' };
const ORDER: Status[] = ['weak', 'learning', 'new', 'mastered'];

function Dot({ status }: { status: Status }) {
  return (
    <span aria-hidden="true" style={{ width: '22px', height: '22px', borderRadius: '999px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#0f1419', background: COLOR[status], border: status === 'new' ? '1px solid var(--line-strong)' : 'none' }}>{MARK[status]}</span>
  );
}

export function Glossary() {
  const data = useData();
  const states = computeStats(data).states;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [sort, setSort] = useState<'az' | 'weak'>('az');
  const [open, setOpen] = useState<string | null>(null);

  const withStatus = useMemo(() => TERMS.map((t) => ({ t, s: termStatus(t, states) })), [states]);
  const counts = useMemo(() => {
    const c: Record<Status, number> = { weak: 0, learning: 0, mastered: 0, new: 0 };
    withStatus.forEach((x) => c[x.s]++);
    return c;
  }, [withStatus]);

  const q = query.trim().toLowerCase();
  let shown = withStatus.filter(({ t, s }) =>
    (filter === 'all' || s === filter) &&
    (!q || t.term.toLowerCase().includes(q) || (t.aka ?? []).some((a) => a.toLowerCase().includes(q)) || t.def.toLowerCase().includes(q)));
  if (sort === 'weak') shown = shown.slice().sort((a, b) => ORDER.indexOf(a.s) - ORDER.indexOf(b.s) || a.t.term.localeCompare(b.t.term));

  return (
    <div class="screen">
      <div class="topbar">
        <a class="iconbtn" href="#/" aria-label="Home"><Icon name="back" /></a>
        <div class="stack" style={{ gap: '0' }}><h1>Glossary</h1><span class="small muted">{TERMS.length} terms · the dot shows how well you know each one</span></div>
      </div>

      <label class="field"><span class="small muted">Search terms</span>
        <input type="search" value={query} placeholder="For example: offset, SWR, ohm" onInput={(e) => setQuery((e.target as HTMLInputElement).value)} />
      </label>

      <div class="row" style={{ flexWrap: 'wrap', gap: '8px' }} role="group" aria-label="Filter by how well you know the term">
        <button class={`toggle${filter === 'all' ? ' on' : ''}`} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All {TERMS.length}</button>
        {ORDER.map((s) => (
          <button class={`toggle${filter === s ? ' on' : ''}`} aria-pressed={filter === s} onClick={() => setFilter(filter === s ? 'all' : s)}>
            <Dot status={s} />{LABEL[s]} {counts[s]}
          </button>
        ))}
      </div>
      <button class="toggle" style={{ alignSelf: 'flex-start' }} onClick={() => setSort(sort === 'az' ? 'weak' : 'az')}>
        Order: {sort === 'az' ? 'A to Z' : 'least known first'}
      </button>

      {!TERMS.length && <div class="card muted">The glossary is being written.</div>}
      {TERMS.length > 0 && !shown.length && <div class="card muted">No terms match.</div>}

      <div class="stack" style={{ gap: '8px' }}>
        {shown.map(({ t, s }) => <TermRow t={t} s={s} open={open === t.id} onToggle={() => setOpen(open === t.id ? null : t.id)} states={states} />)}
      </div>
    </div>
  );
}

function TermRow({ t, s, open, onToggle, states }: { t: Term; s: Status; open: boolean; onToggle: () => void; states: Record<string, { right: number; seen: number }> }) {
  const topic = TOPICS[t.sub];
  const seen = t.questions.filter((id) => states[id]);
  const right = seen.reduce((a, id) => a + states[id].right, 0);
  const tries = seen.reduce((a, id) => a + states[id].seen, 0);
  return (
    <div class="card" style={{ padding: '0', overflow: 'hidden' }}>
      <button onClick={onToggle} aria-expanded={open} style={{ width: '100%', minHeight: '56px', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'transparent', border: 0, textAlign: 'left', cursor: 'pointer' }}>
        <Dot status={s} />
        <span class="grow stack" style={{ gap: '2px' }}>
          <span style={{ fontWeight: 600, fontSize: '16px' }}>{t.term}</span>
          {!open && <span class="small muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.def}</span>}
        </span>
        <span class="small" style={{ color: topic?.color, fontWeight: 600 }}>{t.sub}</span>
      </button>
      {open && (
        <div class="stack" style={{ padding: '0 14px 14px 48px', gap: '8px' }}>
          <span style={{ lineHeight: 1.5 }}>{t.def}</span>
          {t.more && <span style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>{t.more}</span>}
          <span class="small" style={{ color: COLOR[s] === 'var(--tile-new)' ? 'var(--muted)' : COLOR[s], fontWeight: 600 }}>
            {LABEL[s]} · {tries ? `${right} right in ${tries} tries on ` : ''}{t.questions.length} exam question{t.questions.length === 1 ? '' : 's'}{seen.length < t.questions.length && tries ? ` (${seen.length} seen)` : ''}
          </span>
          <span class="small muted">{topic?.name}</span>
          <a class="btn secondary" href={`#/term/${t.id}?${Date.now()}`} style={{ alignSelf: 'flex-start' }}>Drill this term</a>
        </div>
      )}
    </div>
  );
}
