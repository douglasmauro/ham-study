import { useRef, useState } from 'preact/hooks';
import type { FeatureProps } from '../types';
import { Finish, Message, Shell, useFlash, useOnce, useShuffled, type Feedback, type Meta } from './common';
import { useDrag, useTap } from './drag';

export interface SortBucket {
  id: string;
  title: string;
  sub?: string; // a few words under the title
  miss?: string; // said when a card is wrongly dropped here; default "Not <title>."
}

export interface SortCard {
  id: string;
  text: string;
  short?: string; // shorter wording shown once the card sits in its bucket
  bucket: string;
  why: string; // a full sentence that names the right bucket
}

export interface SortSpec {
  how?: string;
  buckets: SortBucket[]; // 2 to 4
  cards: SortCard[];
  long?: boolean; // cards are sentences: lay the tray out in one column
}

/** Sort it: drag cards into labeled buckets, or tap a card and then a bucket. */
export function Sort({ spec, meta, onDone }: { spec: SortSpec; meta: Meta } & FeatureProps) {
  const cards = useShuffled(spec.cards);
  const [placed, setPlaced] = useState<Record<string, true>>({});
  const [missed, setMissed] = useState<Record<string, true>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState<Feedback | null>(null);
  const [shake, setShake] = useFlash<{ id: string; n: number }>();
  const shakes = useRef<Record<string, number>>({}); // bumping an item's count restarts its shake
  const finish = useOnce(() => onDone({ score: cards.filter((c) => !missed[c.id]).length, total: cards.length }));

  function attempt(cardId: string, bucketId: string) {
    const card = cards.find((c) => c.id === cardId);
    const bucket = spec.buckets.find((b) => b.id === bucketId);
    if (!card || !bucket || placed[cardId]) return;
    setSel(null);
    if (card.bucket === bucketId) {
      setPlaced({ ...placed, [cardId]: true });
      setMsg({ tone: 'good', text: `Right. ${card.why}` });
    } else {
      setMissed({ ...missed, [cardId]: true });
      shakes.current[cardId] = (shakes.current[cardId] ?? 0) + 1;
      setShake({ id: cardId, n: shakes.current[cardId] });
      setMsg({ tone: 'bad', text: `${bucket.miss ?? `Not ${bucket.title.toLowerCase()}.`} ${card.why}` });
    }
  }

  const bind = useDrag({
    canDrag: (id) => !placed[id],
    onTap: (id) => {
      if (placed[id]) return;
      setSel(sel === id ? null : id);
      if (sel !== id) setMsg({ tone: 'info', text: 'Now tap the bucket it belongs in.' });
    },
    onStart: () => setSel(null),
    onDrop: (d) => { if (d.target) attempt(d.id, d.target); },
  });

  const tap = useTap();
  const n = Object.keys(placed).length;
  const done = n === cards.length;
  const most = Math.max(...spec.buckets.map((b) => cards.filter((c) => c.bucket === b.id).length));

  return (
    <Shell meta={meta} how={spec.how ?? 'Drag each card into its bucket, or tap a card and then a bucket.'}>
      <div class="dd-count">{n} of {cards.length} sorted</div>
      <div class={`dd-tray${spec.long ? ' dd-tray-long' : ''}`}>
        {cards.map((c) => placed[c.id]
          ? <div key={c.id + '-gone'} class="dd-card dd-gone" aria-hidden="true">{c.text}</div>
          : (
            <button type="button" key={`${c.id}-${shakes.current[c.id] ?? 0}`} data-card={c.id}
              class={`dd-card dd-drag${sel === c.id ? ' dd-sel' : ''}${shake?.id === c.id ? ' dd-shake' : ''}`}
              aria-pressed={sel === c.id} {...bind(c.id)}>{c.text}</button>
          ))}
      </div>
      <Message msg={msg} />
      <div class="dd-buckets" style={{ gridTemplateColumns: `repeat(${spec.buckets.length === 3 ? 3 : 2}, minmax(0, 1fr))` }}>
        {spec.buckets.map((b) => (
          <button type="button" class={`dd-bucket${sel ? ' dd-ready' : ''}`} data-drop={b.id}
            style={{ minHeight: `${58 + most * 46}px` }}
            aria-label={`${b.title} bucket`} {...tap(() => { if (sel) attempt(sel, b.id); })}>
            <span class="dd-bucket-title">{b.title}</span>
            {b.sub && <span class="dd-bucket-sub">{b.sub}</span>}
            {cards.filter((c) => placed[c.id] && c.bucket === b.id).map((c) => (
              <span class="dd-chip dd-placed" key={c.id}>{c.short ?? c.text}</span>
            ))}
          </button>
        ))}
      </div>
      <Finish show={done} summary="All sorted." onFinish={finish} />
    </Shell>
  );
}
