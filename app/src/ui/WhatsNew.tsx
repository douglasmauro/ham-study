import { useEffect } from 'preact/hooks';
import { RELEASES, markReleasesSeen, seenRelease, type ChangeKind } from '../lib/releases';
import { Icon } from './Icon';

const KIND: Record<ChangeKind, { label: string; color: string }> = {
  new: { label: 'New', color: 'var(--accent)' },
  improved: { label: 'Better', color: 'var(--good)' },
  fixed: { label: 'Fixed', color: 'var(--muted)' },
};

function day(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Release notes: what each version added or fixed, newest first. */
export function WhatsNew() {
  const seen = seenRelease();
  useEffect(() => { markReleasesSeen(); }, []);

  return (
    <div class="screen">
      <div class="topbar">
        <a class="iconbtn" href="#/" aria-label="Home"><Icon name="back" /></a>
        <div class="stack" style={{ gap: '0' }}><span class="sub">Release notes</span><h1>What's new</h1></div>
      </div>

      {RELEASES.map((r, i) => (
        <div class="card stack" style={{ gap: '12px', border: i === 0 ? '2px solid var(--accent)' : undefined }}>
          <div class="stack" style={{ gap: '2px' }}>
            <div class="row between" style={{ alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
              <span class="small muted" style={{ fontWeight: 600 }}>Version {r.version} · {day(r.date)}</span>
              {seen > 0 && r.version > seen && <span class="chip" style={{ color: 'var(--accent)' }}>New to you</span>}
            </div>
            <span style={{ fontFamily: 'var(--display)', fontSize: '19px', fontWeight: 700, lineHeight: 1.25 }}>{r.title}</span>
          </div>
          <div class="stack" style={{ gap: '10px' }}>
            {r.changes.map((c) => (
              <div class="row" style={{ gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, minWidth: '52px', fontSize: '12px', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: KIND[c.kind].color, paddingTop: '2px' }}>{KIND[c.kind].label}</span>
                <span style={{ color: 'var(--text-2)', lineHeight: 1.45 }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
