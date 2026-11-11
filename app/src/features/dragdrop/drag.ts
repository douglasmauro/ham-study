import { useRef } from 'preact/hooks';

/**
 * One small pointer-drag helper shared by every hands-on format.
 *
 * Give an item `{...bind(id)}` and it can be dragged with a mouse, a finger or
 * a pen, and it still works as a plain button: a press that does not move is a
 * tap (so "tap an item, then tap where it goes" comes for free, and so does the
 * keyboard, because a click with no pointer press before it counts as a tap).
 *
 * Drop targets are any element with a `data-drop="<key>"` attribute.
 */
export interface DragInfo {
  id: string;
  el: HTMLElement;
  /** Pointer position in the viewport. */
  x: number;
  y: number;
  /** Distance moved since the press, corrected for page scrolling. */
  dx: number;
  dy: number;
  /** `data-drop` key of the target under the pointer, if any. */
  target: string | null;
}

export interface DragOptions {
  /** A press and release without movement, or a keyboard activation. */
  onTap?: (id: string) => void;
  onStart?: (info: DragInfo) => void;
  onMove?: (info: DragInfo) => void;
  /** The end of a real drag. `target` is null when dropped on nothing. */
  onDrop?: (info: DragInfo) => void;
  /** Return false to make an item tap-only (for example once it is placed). */
  canDrag?: (id: string) => boolean;
  /** Move the element with the pointer. Turn off to draw your own feedback. */
  follow?: boolean;
}

const SLOP = 6; // px of movement before a press becomes a drag
const CLICK_WINDOW = 700; // ms after a handled tap in which the browser's own click is ignored
const EDGE = 64; // px from the top or bottom edge where the page auto-scrolls

function targetAt(x: number, y: number, self: HTMLElement): HTMLElement | null {
  for (const e of document.elementsFromPoint(x, y)) {
    if (self.contains(e)) continue;
    const t = (e as HTMLElement).closest<HTMLElement>('[data-drop]');
    if (t && !self.contains(t) && !t.contains(self)) return t;
    if (t) continue;
  }
  return null;
}

export function useDrag(options: DragOptions) {
  const opts = useRef(options);
  opts.current = options;
  const suppressClick = useRef(false);
  const active = useRef(false);
  const tappedAt = useRef(0);

  function bind(id: string) {
    return {
      onClick: (e: MouseEvent) => {
        if (suppressClick.current) {
          suppressClick.current = false;
          e.preventDefault();
          return;
        }
        // Only keyboard and assistive clicks get here un-handled.
        if (Date.now() - tappedAt.current < CLICK_WINDOW) return;
        opts.current.onTap?.(id);
      },
      onPointerDown: (e: PointerEvent) => {
        if (active.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
        if (opts.current.canDrag && !opts.current.canDrag(id)) return;
        const el = e.currentTarget as HTMLElement;
        const pointerId = e.pointerId;
        const x0 = e.clientX;
        const y0 = e.clientY;
        const scroll0 = window.scrollY;
        const follow = opts.current.follow !== false;
        let moved = false;
        let over: HTMLElement | null = null;
        let last = { x: x0, y: y0 };
        let raf = 0;
        active.current = true;

        const info = (): DragInfo => ({
          id, el, x: last.x, y: last.y,
          dx: last.x - x0,
          dy: last.y - y0 + (window.scrollY - scroll0),
          target: over ? over.dataset.drop ?? null : null,
        });

        const setOver = (t: HTMLElement | null) => {
          if (t === over) return;
          over?.classList.remove('dd-over');
          over = t;
          over?.classList.add('dd-over');
        };

        const update = () => {
          setOver(targetAt(last.x, last.y, el));
          const i = info();
          if (follow) el.style.transform = `translate(${i.dx}px, ${i.dy}px)`;
          opts.current.onMove?.(i);
        };

        // Keep scrolling while the pointer rests near the top or bottom edge.
        const autoScroll = () => {
          raf = 0;
          if (!moved) return;
          const dir = last.y < EDGE ? -1 : last.y > window.innerHeight - EDGE ? 1 : 0;
          if (dir) {
            const before = window.scrollY;
            window.scrollBy(0, dir * 8);
            if (window.scrollY !== before) update();
            raf = requestAnimationFrame(autoScroll);
          }
        };

        const move = (ev: PointerEvent) => {
          if (ev.pointerId !== pointerId) return;
          last = { x: ev.clientX, y: ev.clientY };
          if (!moved) {
            if (Math.abs(last.x - x0) + Math.abs(last.y - y0) < SLOP) return;
            moved = true;
            el.classList.add('dd-dragging');
            if (follow) el.style.transition = 'none';
            opts.current.onStart?.(info());
          }
          ev.preventDefault();
          update();
          if (!raf) raf = requestAnimationFrame(autoScroll);
        };

        const end = (ev: PointerEvent) => {
          if (ev.pointerId !== pointerId) return;
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', end);
          window.removeEventListener('pointercancel', end);
          if (raf) cancelAnimationFrame(raf);
          active.current = false;
          if (!moved) {
            // A tap. Deliver it now instead of waiting for the click event, which
            // a touch browser may hold back or drop, then ignore that click.
            if (ev.type === 'pointerup') {
              tappedAt.current = Date.now();
              opts.current.onTap?.(id);
            }
            return;
          }
          last = { x: ev.clientX, y: ev.clientY };
          if (ev.type === 'pointercancel') setOver(null);
          else setOver(targetAt(last.x, last.y, el));
          const i = info();
          over?.classList.remove('dd-over');
          over = null;
          el.classList.remove('dd-dragging');
          if (follow) {
            // Glide home. If the drop was right the item is re-drawn in its new
            // place and this element simply goes away.
            el.style.transition = '';
            el.style.transform = '';
          }
          // The browser may fire a click after the release: swallow that one.
          suppressClick.current = true;
          // Report the drop a tick later. A right drop removes this element, and
          // taking a touch target out of the page before its touch has fully
          // ended can make the browser drop the next tap.
          setTimeout(() => {
            suppressClick.current = false;
            opts.current.onDrop?.(i);
          }, 0);
        };

        window.addEventListener('pointermove', move, { passive: false });
        window.addEventListener('pointerup', end);
        window.addEventListener('pointercancel', end);
      },
    };
  }

  return bind;
}

/**
 * Props for a drop target that is also tapped ("tap an item, then tap where it
 * goes"). The tap is taken on pointer-up so it never depends on the browser's
 * click event; keyboard activation still arrives as a click.
 */
export function useTap() {
  const tappedAt = useRef(0);
  const down = useRef<{ x: number; y: number } | null>(null);
  return (fn: () => void) => ({
    onPointerDown: (e: PointerEvent) => { down.current = { x: e.clientX, y: e.clientY }; },
    onPointerUp: (e: PointerEvent) => {
      const d = down.current;
      down.current = null;
      if (!d || Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 10) return;
      tappedAt.current = Date.now();
      fn();
    },
    onClick: () => {
      if (Date.now() - tappedAt.current < CLICK_WINDOW) return;
      fn();
    },
  });
}
