import type { JSX } from 'preact';
import { useRef, useState } from 'preact/hooks';
import type { FeatureProps } from '../types';
import { Finish, Message, Shell, useFlash, useOnce, useShuffled, type Feedback, type Meta } from './common';
import { useDrag, useTap } from './drag';

/** A marked place on the picture. Positions are in the picture's own units (its viewBox). */
export interface Spot {
  id: string;
  x: number; // left edge of the drop box
  y: number; // top edge
  w?: number; // default 110
  h?: number; // default 44
  prompt?: string; // "Build it" only: what this slot needs, shown while it is empty
  need?: string; // "Build it" only: the same thing as part of a sentence, e.g. "a power source"
  line?: [number, number]; // draw a leader line from the box to this point
}

export interface Piece {
  id: string;
  text: string;
  spot?: string; // where it belongs; leave out for a part that belongs nowhere
  why: string; // full sentence: what this is, or why it does not belong
  icon?: JSX.Element; // optional small symbol, drawn in a 60 x 40 box
  iconOn?: JSX.Element; // symbol to show instead once everything works (a closed switch, say)
}

export interface PictureState {
  filled: Record<string, boolean>; // by spot id
  done: boolean;
}

export interface PlaceSpec {
  how?: string;
  view: [number, number]; // picture width and height in its own units; width is normally 350
  alt: string; // describes the picture for screen readers
  art: (s: PictureState) => JSX.Element; // inline SVG content in the house style
  spots: Spot[];
  pieces: Piece[];
  doneText?: string; // "Build it": what happens now that it works
}

/** Shared engine for "Label the picture" and "Build it": put pieces on marked spots of an SVG picture. */
export function Place({ spec, meta, onDone, build }: { spec: PlaceSpec; meta: Meta; build?: boolean } & FeatureProps) {
  const pieces = useShuffled(spec.pieces);
  const [at, setAt] = useState<Record<string, string>>({}); // spot id -> piece id
  const [missed, setMissed] = useState<Record<string, true>>({}); // spot ids that took a wrong try
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState<Feedback | null>(null);
  const [shake, setShake] = useFlash<{ id: string; n: number }>();
  const shakes = useRef<Record<string, number>>({}); // bumping an item's count restarts its shake
  const [W, H] = spec.view;
  const real = pieces.filter((p) => p.spot);
  const finish = useOnce(() => onDone({ score: spec.spots.filter((s) => !missed[s.id]).length, total: spec.spots.length }));
  const usedPieces = new Set(Object.values(at));
  const noun = build ? 'part' : 'label';

  function attempt(pieceId: string, spotId: string) {
    const piece = pieces.find((p) => p.id === pieceId);
    const spot = spec.spots.find((s) => s.id === spotId);
    setSel(null);
    if (!piece || !spot || at[spotId] || usedPieces.has(pieceId)) return;
    if (piece.spot === spotId) {
      const next = { ...at, [spotId]: pieceId };
      setAt(next);
      const all = Object.keys(next).length === spec.spots.length;
      setMsg({ tone: 'good', text: `Right. ${piece.why}${all && spec.doneText ? ` ${spec.doneText}` : ''}` });
    } else {
      // A wrong try counts against the spot it landed on and the spot the piece belongs to.
      setMissed({ ...missed, [spotId]: true, ...(piece.spot ? { [piece.spot]: true as const } : {}) });
      shakes.current[pieceId] = (shakes.current[pieceId] ?? 0) + 1;
      setShake({ id: pieceId, n: shakes.current[pieceId] });
      setMsg({ tone: 'bad', text: `Not there. ${spot.need ? `That spot needs ${spot.need}. ` : ''}${piece.why}` });
    }
  }

  const bind = useDrag({
    canDrag: (id) => !usedPieces.has(id),
    onTap: (id) => {
      if (usedPieces.has(id)) return;
      setSel(sel === id ? null : id);
      if (sel !== id) setMsg({ tone: 'info', text: `Now tap the box where this ${noun} belongs.` });
    },
    onStart: () => setSel(null),
    onDrop: (d) => { if (d.target) attempt(d.id, d.target); },
  });

  const tap = useTap();
  const n = Object.keys(at).length;
  const done = n === spec.spots.length;
  const filled: Record<string, boolean> = {};
  for (const s of spec.spots) filled[s.id] = !!at[s.id];
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <Shell meta={meta} how={spec.how ?? (build
      ? 'Drag each part into the slot where it belongs, or tap a part and then a slot. Some parts do not belong.'
      : 'Drag each label onto its box, or tap a label and then a box.')}>
      <div class={`dd-board${done ? ' dd-on' : ''}`} style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.alt}>
          {spec.art({ filled, done })}
          {spec.spots.filter((s) => s.line).map((s) => {
            const w = s.w ?? 110;
            const h = s.h ?? 44;
            const [tx, ty] = s.line!;
            // start the leader at the point on the box edge nearest the target
            const sx = Math.max(s.x, Math.min(s.x + w, tx));
            const sy = Math.max(s.y, Math.min(s.y + h, ty));
            return <g key={s.id} class="dd-leader"><line x1={sx} y1={sy} x2={tx} y2={ty} /><circle cx={tx} cy={ty} r="3" /></g>;
          })}
        </svg>
        {spec.spots.map((s, i) => {
          const piece = at[s.id] ? pieces.find((p) => p.id === at[s.id]) : undefined;
          return (
            <button type="button" key={s.id} data-drop={s.id}
              class={`dd-spot${piece ? ' dd-placed' : ''}${sel && !piece ? ' dd-ready' : ''}`}
              style={{ left: pct(s.x, W), top: pct(s.y, H), width: pct(s.w ?? 110, W), height: pct(s.h ?? 44, H) }}
              aria-label={piece ? `${piece.text}, placed` : `${s.prompt ?? `Empty box ${i + 1}`}`}
              disabled={!!piece} {...tap(() => { if (sel) attempt(sel, s.id); })}>
              {piece
                ? <>{piece.icon && <Symbol>{done && piece.iconOn ? piece.iconOn : piece.icon}</Symbol>}<span>{piece.text}</span></>
                : <span class="dd-spot-prompt">{s.prompt ?? '?'}</span>}
            </button>
          );
        })}
      </div>
      <Message msg={msg} />
      <div class="dd-count">{build ? 'Parts' : 'Labels'} · {n} of {real.length} placed</div>
      <div class="dd-tray">
        {pieces.map((p) => usedPieces.has(p.id)
          ? <div key={`${p.id}-gone`} class="dd-card dd-gone" aria-hidden="true">{p.text}</div>
          : (
            <button type="button" key={`${p.id}-${shakes.current[p.id] ?? 0}`} data-card={p.id}
              class={`dd-card dd-drag${sel === p.id ? ' dd-sel' : ''}${shake?.id === p.id ? ' dd-shake' : ''}${done ? ' dd-spare' : ''}`}
              aria-pressed={sel === p.id} disabled={done} {...bind(p.id)}>
              {p.icon && <Symbol>{p.icon}</Symbol>}<span>{p.text}</span>
            </button>
          ))}
      </div>
      <Finish show={done} summary={build ? 'It works.' : 'Every label is in place.'} onFinish={finish} />
    </Shell>
  );
}

function Symbol({ children }: { children: JSX.Element }) {
  return <svg class="dd-symbol" viewBox="0 0 60 40" width="42" height="28" aria-hidden="true">{children}</svg>;
}

/** Label the picture: drag labels onto marked spots on a diagram. */
export function Label(p: { spec: PlaceSpec; meta: Meta } & FeatureProps) {
  return <Place {...p} />;
}

/** Build it: drag parts into slots until the thing works. */
export function Build(p: { spec: PlaceSpec; meta: Meta } & FeatureProps) {
  return <Place {...p} build />;
}
