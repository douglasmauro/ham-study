import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import type { FeatureProps } from '../types';
import { Finish, Message, Shell, useOnce, type Feedback, type Meta } from './common';
import { useDrag } from './drag';

export interface OrderRow {
  id: string;
  name: string;
  sub?: string; // short note under the name
  icon?: JSX.Element; // optional 24 x 24 stroke icon
}

export interface OrderSpec {
  how: string;
  startLabel: string; // what the top of the list means, e.g. "Wall outlet"
  endLabel: string; // what the bottom means, e.g. "Sky"
  rows: OrderRow[]; // in the correct order
  start: string[]; // ids in the scrambled order shown first
  hint: string; // shown when the order is not right yet
  explain: string; // shown when it is right: why this is the order
}

const ROW = 68; // row height plus gap, px

/** Put it in order: drag rows to reorder (or tap two to swap), then check. */
export function Order({ spec, meta, onDone }: { spec: OrderSpec; meta: Meta } & FeatureProps) {
  const correct = spec.rows.map((r) => r.id);
  const [order, setOrder] = useState<string[]>(spec.start);
  const [drag, setDrag] = useState<{ id: string; dy: number } | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [tries, setTries] = useState(0);
  const [firstScore, setFirstScore] = useState<number | null>(null);
  const [msg, setMsg] = useState<Feedback | null>(null);
  const allRight = checked && order.every((id, i) => id === correct[i]);
  const finish = useOnce(() => onDone({ score: firstScore ?? 0, total: correct.length }));
  const last = order.length - 1;

  const targetOf = (d: { id: string; dy: number }) =>
    Math.max(0, Math.min(last, Math.round((order.indexOf(d.id) * ROW + d.dy) / ROW)));

  // The order as it looks right now, with the dragged row slotted into its target.
  let display = order;
  if (drag) {
    display = order.filter((id) => id !== drag.id);
    display.splice(targetOf(drag), 0, drag.id);
  }

  const edited = (next: string[]) => {
    setOrder(next);
    setChecked(false);
    setMsg(null);
  };

  const bind = useDrag({
    follow: false,
    canDrag: () => !allRight,
    onTap: (id) => {
      if (allRight) return;
      if (sel && sel !== id) {
        const next = order.slice();
        const a = next.indexOf(sel);
        const b = next.indexOf(id);
        next[a] = id;
        next[b] = sel;
        setSel(null);
        edited(next);
      } else {
        setSel(sel === id ? null : id);
        if (sel !== id) setMsg({ tone: 'info', text: 'Now tap the row to swap it with.' });
      }
    },
    onStart: () => setSel(null),
    onMove: (d) => setDrag({ id: d.id, dy: d.dy }),
    onDrop: (d) => {
      const t = targetOf({ id: d.id, dy: d.dy });
      setDrag(null);
      if (t === order.indexOf(d.id)) return;
      const next = order.filter((id) => id !== d.id);
      next.splice(t, 0, d.id);
      edited(next);
    },
  });

  function check() {
    const right = order.filter((id, i) => id === correct[i]).length;
    const ok = right === correct.length;
    if (firstScore === null) setFirstScore(right);
    setChecked(true);
    setSel(null);
    setTries(tries + 1);
    setMsg(ok
      ? { tone: 'good', text: `Right. ${spec.explain}` }
      : { tone: 'bad', text: `Not yet: ${right} of ${correct.length} are in place. ${spec.hint}` });
  }

  function reveal() {
    setOrder(correct);
    setChecked(true);
    setSel(null);
    setMsg({ tone: 'good', text: `Here is the order. ${spec.explain}` });
  }

  return (
    <Shell meta={meta} how={spec.how}>
      <div class="dd-end">{spec.startLabel}</div>
      <div class="dd-rows" style={{ height: `${order.length * ROW - 8}px` }}>
        {order.map((id) => {
          const row = spec.rows.find((r) => r.id === id)!;
          const idx = display.indexOf(id);
          const dragging = drag?.id === id;
          const top = dragging ? order.indexOf(id) * ROW + drag.dy : idx * ROW;
          const right = order.indexOf(id) === correct.indexOf(id);
          const state = checked ? (right ? ' dd-right' : ' dd-wrong') : '';
          return (
            <button type="button" key={id} data-row={id}
              class={`dd-row dd-drag${state}${sel === id ? ' dd-sel' : ''}${dragging ? ' dd-lifted' : ''}`}
              style={{ top: `${top}px` }} aria-pressed={sel === id}
              aria-label={`${row.name}, position ${idx + 1} of ${order.length}${checked ? (right ? ', right' : ', needs to move') : ''}`}
              {...bind(id)}>
              <span class="dd-row-num">{row.icon ?? idx + 1}</span>
              <span class="dd-row-text">
                <span class="dd-row-name">{row.name}</span>
                {row.sub && <span class="dd-row-sub">{row.sub}</span>}
              </span>
              {checked && <span class="dd-row-tag">{right ? 'Right' : 'Move'}</span>}
              <svg class="dd-grip" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8M8 12h8M8 17h8" /></svg>
            </button>
          );
        })}
      </div>
      <div class="dd-end">{spec.endLabel}</div>
      <Message msg={msg} />
      {!allRight && (
        <div class="stack">
          <button type="button" class="btn primary block" onClick={check}>Check my order</button>
          {tries >= 2 && <button type="button" class="btn secondary block" onClick={reveal}>Show me the order</button>}
        </div>
      )}
      <Finish show={allRight} summary="Every row is in place." onFinish={finish} />
    </Shell>
  );
}
