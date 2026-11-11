import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { FeatureProps } from '../types';
import { Finish, Message, Shell, useFlash, useOnce, useShuffled, type Feedback, type Meta } from './common';
import { useDrag } from './drag';

export interface MatchPair {
  id: string;
  left: string; // the short side: a symbol, a term, a prefix
  right: string; // what it goes with
  why: string; // full sentence that states the pair
}

export interface MatchSpec {
  how?: string;
  leftTitle: string;
  rightTitle: string;
  pairs: MatchPair[];
}

type Side = 'L' | 'R';
interface Pt { x: number; y: number }

/** Match it: tap one on the left then one on the right, or drag between them. A line joins each pair. */
export function Match({ spec, meta, onDone }: { spec: MatchSpec; meta: Meta } & FeatureProps) {
  const lefts = useShuffled(spec.pairs);
  const mixed = useShuffled(spec.pairs);
  // Never leave a pair sitting side by side: shift the right column until no row lines up.
  const rights = useMemo(() => {
    for (let k = 0; k < mixed.length; k++) {
      const turn = mixed.slice(k).concat(mixed.slice(0, k));
      if (turn.every((p, i) => p.id !== lefts[i].id)) return turn;
    }
    return lefts.slice(1).concat(lefts.slice(0, 1));
  }, [lefts, mixed]);
  const [made, setMade] = useState<Record<string, true>>({});
  const [missed, setMissed] = useState<Record<string, true>>({});
  const [sel, setSel] = useState<{ side: Side; id: string } | null>(null);
  const [msg, setMsg] = useState<Feedback | null>(null);
  const [bad, setBad] = useFlash<{ l: string; r: string; n: number }>();
  const shakes = useRef<Record<string, number>>({}); // bumping an item's count restarts its shake
  const [band, setBand] = useState<{ from: string; to: Pt } | null>(null);
  const [geo, setGeo] = useState<Record<string, Pt>>({});
  const box = useRef<HTMLDivElement>(null);
  const finish = useOnce(() => onDone({ score: lefts.filter((p) => !missed[p.id]).length, total: lefts.length }));

  // Where each line starts and ends: the inner edge of every item, relative to the board.
  const measure = () => {
    const root = box.current;
    if (!root) return;
    const r0 = root.getBoundingClientRect();
    const next: Record<string, Pt> = {};
    root.querySelectorAll<HTMLElement>('[data-drop]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const key = el.dataset.drop!;
      next[key] = { x: Math.round((key[0] === 'L' ? r.right : r.left) - r0.left), y: Math.round(r.top + r.height / 2 - r0.top) };
    });
    setGeo((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  };
  useLayoutEffect(measure);
  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  function attempt(l: string, r: string) {
    setSel(null);
    if (made[l] || made[r]) return;
    const pair = spec.pairs.find((p) => p.id === l)!;
    if (l === r) {
      setMade({ ...made, [l]: true });
      setMsg({ tone: 'good', text: `Right. ${pair.why}` });
    } else {
      setMissed({ ...missed, [l]: true });
      for (const k of [`L:${l}`, `R:${r}`]) shakes.current[k] = (shakes.current[k] ?? 0) + 1;
      setBad({ l, r, n: 0 });
      setMsg({ tone: 'bad', text: `Not a match. ${pair.why}` });
    }
  }

  const join = (a: string, b: string) => {
    if (a[0] === b[0]) return false;
    const l = a[0] === 'L' ? a : b;
    const r = a[0] === 'L' ? b : a;
    attempt(l.slice(2), r.slice(2));
    return true;
  };

  const bind = useDrag({
    follow: false,
    canDrag: (key) => !made[key.slice(2)],
    onTap: (key) => {
      const side = key[0] as Side;
      const id = key.slice(2);
      if (made[id]) return;
      if (sel && sel.side !== side) { join(`${sel.side}:${sel.id}`, key); return; }
      const same = sel?.side === side && sel.id === id;
      setSel(same ? null : { side, id });
      if (!same) setMsg({ tone: 'info', text: side === 'L' ? 'Now tap its match on the right.' : 'Now tap its match on the left.' });
    },
    onStart: () => setSel(null),
    onMove: (d) => {
      const r0 = box.current!.getBoundingClientRect();
      setBand({ from: d.id, to: { x: d.x - r0.left, y: d.y - r0.top } });
    },
    onDrop: (d) => {
      setBand(null);
      if (d.target) join(d.id, d.target);
    },
  });

  const n = Object.keys(made).length;
  const done = n === lefts.length;

  const item = (side: Side, p: MatchPair) => {
    const key = `${side}:${p.id}`;
    const isSel = sel?.side === side && sel.id === p.id;
    const isBad = bad && (side === 'L' ? bad.l : bad.r) === p.id && !made[p.id];
    const offer = sel && sel.side !== side && !made[p.id];
    return (
      <button type="button" key={`${key}-${shakes.current[key] ?? 0}`} data-drop={key}
        class={`dd-pair dd-pair-${side} dd-drag${made[p.id] ? ' dd-placed' : ''}${isSel ? ' dd-sel' : ''}${isBad ? ' dd-shake' : ''}${offer ? ' dd-ready' : ''}`}
        aria-pressed={isSel} disabled={!!made[p.id]} {...bind(key)}>
        {side === 'L' ? p.left : p.right}
      </button>
    );
  };

  return (
    <Shell meta={meta} how={spec.how ?? 'Tap one on the left, then its match on the right. Or drag from one to the other.'}>
      <div class="dd-count">{n} of {lefts.length} matched</div>
      <div class="dd-match" ref={box}>
        <span class="dd-col-title">{spec.leftTitle}</span>
        <span />
        <span class="dd-col-title">{spec.rightTitle}</span>
        {lefts.map((p, i) => [item('L', p), <span key={`gap${i}`} />, item('R', rights[i])])}
        <svg class="dd-lines" aria-hidden="true">
          {lefts.filter((p) => made[p.id] && geo[`L:${p.id}`] && geo[`R:${p.id}`]).map((p) => {
            const a = geo[`L:${p.id}`];
            const b = geo[`R:${p.id}`];
            return (
              <g key={p.id} class="dd-line-made">
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                <circle cx={a.x} cy={a.y} r="4" />
                <circle cx={b.x} cy={b.y} r="4" />
              </g>
            );
          })}
          {band && geo[band.from] && (
            <line class="dd-line-band" x1={geo[band.from].x} y1={geo[band.from].y} x2={band.to.x} y2={band.to.y} />
          )}
        </svg>
      </div>
      <Message msg={msg} />
      <Finish show={done} summary="Every pair is joined." onFinish={finish} />
    </Shell>
  );
}
