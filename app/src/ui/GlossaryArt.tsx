import { useEffect, useState } from 'preact/hooks';
import type { TermArt } from '../features/glossaryart/kit';
import { TERMS, termsForQuestion, type Term } from '../lib/glossary';
import { TOPICS } from '../lib/pool';
import { Icon } from './Icon';

let cache: Record<string, TermArt> | null = null;

/** Loads the drawings once; returns null until they arrive (or if they fail to load). */
export function useGlossaryArt(): Record<string, TermArt> | null {
  const [art, setArt] = useState(cache);
  useEffect(() => {
    if (cache) return;
    let live = true;
    import('../features/glossaryart').then((m) => { cache = m.ART; if (live) setArt(m.ART); }).catch(() => {});
    return () => { live = false; };
  }, []);
  return art;
}

/**
 * The color of the thing a drawing defines: its topic color. Safety (T0) is the exception:
 * its topic color is red, which drawings also use for hazards, so its key parts are drawn in
 * the plain text color to keep "the thing defined" and "the danger" apart.
 */
function keyColor(sub: string): string | undefined {
  return sub === 'T0' ? 'var(--text)' : TOPICS[sub]?.color;
}

export function TermPicture({ t, art }: { t: Term; art: Record<string, TermArt> | null }) {
  const A = art?.[t.id];
  if (!A) return null;
  return (
    <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '8px', ['--ga-key' as string]: keyColor(t.sub) }}>
      <A />
    </div>
  );
}

/** Every term with its drawing, for checking the pictures side by side. Open with #/glossary-art or #/glossary-art/T5. */
export function GlossaryGallery({ sub }: { sub?: string }) {
  const art = useGlossaryArt();
  const terms = TERMS.filter((t) => !sub || t.sub === sub);
  const have = terms.filter((t) => art?.[t.id]).length;
  return (
    <div class="screen" style={{ maxWidth: '900px' }}>
      <div class="topbar"><a class="iconbtn" href="#/glossary" aria-label="Glossary"><Icon name="back" /></a>
        <div class="stack" style={{ gap: 0 }}><h1>Glossary pictures{sub ? ` · ${sub}` : ''}</h1><span class="small muted">{have} of {terms.length} terms have a picture</span></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
        {terms.map((t) => (
          <div class="card stack" style={{ padding: '10px', gap: '6px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>{t.term}</span>
            <span class="small muted">{t.id} · {t.sub}</span>
            {art?.[t.id] ? <TermPicture t={t} art={art} /> : <span class="small" style={{ color: 'var(--bad)' }}>no picture</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * "Key terms" for one question: up to three glossary terms it tests, each opening to its
 * picture and definition. Shown after answering (never before, since a picture can give the
 * answer away), in the notebook and in lessons.
 */
export function KeyTerms({ qid, max = 3 }: { qid: string; max?: number }) {
  const art = useGlossaryArt();
  const [open, setOpen] = useState<string | null>(null);
  const all = termsForQuestion(qid);
  if (!all.length) return null;
  // Prefer terms that have a picture, keeping the most specific first.
  const terms = [...all.filter((t) => art?.[t.id]), ...all.filter((t) => !art?.[t.id])].slice(0, max);
  const shown = terms.find((t) => t.id === open);
  return (
    <div class="stack" style={{ gap: '8px' }}>
      <span class="small muted" style={{ fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>Key terms</span>
      <div class="row" style={{ flexWrap: 'wrap', gap: '8px' }}>
        {terms.map((t) => (
          <button class={`toggle${open === t.id ? ' on' : ''}`} aria-expanded={open === t.id} onClick={() => setOpen(open === t.id ? null : t.id)}>
            {art?.[t.id] && <Icon name="signal" size={16} />}{t.term}
          </button>
        ))}
      </div>
      {shown && (
        <div class="stack" style={{ gap: '8px', background: 'var(--raised)', borderRadius: '12px', padding: '12px' }}>
          <TermPicture t={shown} art={art} />
          <span style={{ fontWeight: 700 }}>{shown.term}</span>
          <span style={{ lineHeight: 1.5 }}>{shown.def}</span>
          {shown.more && <span class="small" style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>{shown.more}</span>}
        </div>
      )}
    </div>
  );
}
