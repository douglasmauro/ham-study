import { useEffect, useRef, useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import { useGlossaryArt } from '../../ui/GlossaryArt';
import { Icon } from '../../ui/Icon';
import type { CardStep, ChoiceDef, ComputeDef, Interaction, Pic, PicProps, SliderDef, SortDef } from './types';

/** How a step moves the lesson along. */
export interface Nav {
  next: () => void;
  back?: () => void;
  revisit: boolean; // the learner has been past this step before, so nothing is locked
}

/** The row at the bottom of every step: an optional back button and the main action. */
/** Scroll an element into view only if it is off screen, gently unless the learner asked for less motion. */
export function reveal(el: Element | null) {
  if (!el) return;
  const calm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
}

export function Footer({ nav, label = 'Continue', locked = false, note, onNext }: { nav: Nav; label?: string; locked?: boolean; note?: string; onNext?: () => void }) {
  return (
    <div class="ls-foot">
      {locked && note && <span class="ls-note">{note}</span>}
      <div class="ls-foot-row">
        {nav.back && <button type="button" class="iconbtn" onClick={nav.back} aria-label="Previous step"><Icon name="back" /></button>}
        <button type="button" class="btn primary ls-grow" disabled={locked} onClick={onNext ?? nav.next}>{label}</button>
      </div>
    </div>
  );
}

/** One line of feedback: green with a tick, red with a cross, or plain. */
export function Say({ tone, children }: { tone: 'good' | 'bad' | 'plain'; children: string }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => reveal(el.current), [children]); // feedback must never land below the fold unseen
  return (
    <div class={`ls-say ls-${tone}`} role="status" ref={el}>
      {tone !== 'plain' && <Icon name={tone === 'good' ? 'check' : 'x'} size={20} />}
      <span>{tone === 'bad' ? <b>Not quite. </b> : null}{children}</span>
    </div>
  );
}

export function Picture({ pic, sub, ...props }: { pic: Pic; sub: string } & PicProps) {
  const art = useGlossaryArt();
  const Drawn = 'draw' in pic ? pic.draw : null;
  const Term = 'art' in pic ? art?.[pic.art] : null;
  return (
    <div class="ls-pic" style={{ '--ga-key': TOPICS[sub]?.color }}>
      {Drawn ? <Drawn {...props} /> : Term ? <Term /> : <div class="ls-pic-wait" />}
    </div>
  );
}

/* ---------- tap-choice ---------- */

function Choice({ def, pickRef, onPic, onSolved }: { def: ChoiceDef; pickRef: { current: ((id: string) => void) | null }; onPic: (p: PicProps) => void; onSolved: () => void }) {
  const [wrong, setWrong] = useState<string[]>([]);
  const [last, setLast] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const pick = (id: string) => {
    if (solved) return;
    const o = def.options.find((x) => x.id === id);
    if (!o) return;
    setLast(id);
    if (o.right) {
      setSolved(true);
      onSolved();
    } else if (!wrong.includes(id)) setWrong([...wrong, id]);
    onPic({ picked: id, solved: !!o.right });
  };
  pickRef.current = pick;
  const said = def.options.find((o) => o.id === last);
  return (
    <div class="ls-act">
      <p class="ls-prompt">{def.prompt}</p>
      <div class="ls-options">
        {def.options.map((o) => {
          const state = solved && o.right ? 'right' : wrong.includes(o.id) ? 'wrong' : '';
          return (
            <button type="button" class={`choice ${state}${solved && !o.right ? ' dim' : ''}`} disabled={solved} onClick={() => pick(o.id)}>
              <span class="ls-grow">{o.label}</span>
              {state && <span class="tag">{state === 'right' ? 'Right' : 'No'}</span>}
            </button>
          );
        })}
      </div>
      {said && <Say tone={said.right ? 'good' : 'bad'}>{said.why}</Say>}
    </div>
  );
}

/* ---------- slider ---------- */

function Slider({ def, onPic, onSolved }: { def: SliderDef; onPic: (p: PicProps) => void; onSolved: () => void }) {
  const [v, setV] = useState(def.start);
  const [reached, setReached] = useState(false);
  const [moved, setMoved] = useState(false);
  const set = (raw: number) => {
    const nv = Math.min(def.max, Math.max(def.min, raw));
    const hit = def.goal(nv);
    setV(nv);
    setMoved(true);
    if (hit && !reached) {
      setReached(true);
      onSolved();
    }
    onPic({ value: nv, solved: hit });
  };
  const here = def.goal(v);
  return (
    <div class="ls-act">
      <div class="ls-readouts">
        {def.readouts(v).map((r) => <div class="ls-readout"><span>{r.label}</span><b>{r.value}</b></div>)}
      </div>
      <p class="ls-prompt">{def.prompt}</p>
      <div class="ls-slider">
        <button type="button" class="ls-step" onClick={() => set(v - def.step)} disabled={v <= def.min} aria-label={`Lower ${def.label.toLowerCase()}`}>−</button>
        <input type="range" min={def.min} max={def.max} step={def.step} value={v} aria-label={def.label}
          onInput={(e) => set(Number((e.target as HTMLInputElement).value))} />
        <button type="button" class="ls-step" onClick={() => set(v + def.step)} disabled={v >= def.max} aria-label={`Raise ${def.label.toLowerCase()}`}>+</button>
      </div>
      {here ? <Say tone="good">{def.done}</Say> : moved ? <Say tone="plain">{def.hint(v)}</Say> : null}
    </div>
  );
}

/* ---------- sort ---------- */

function Sort({ def, onSolved }: { def: SortDef; onSolved: () => void }) {
  const [placed, setPlaced] = useState<Record<string, string>>({}); // item id -> slot id
  const [sel, setSel] = useState<string | null>(null);
  const [say, setSay] = useState<{ tone: 'good' | 'bad' | 'plain'; text: string } | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const left = def.items.filter((i) => !placed[i.id]);
  const drop = (slotId: string) => {
    const item = def.items.find((i) => i.id === sel);
    const slot = def.slots.find((s) => s.id === slotId)!;
    if (!item) {
      if (left.length) setSay({ tone: 'plain', text: 'Tap one of the items above first, then tap where it goes.' });
      return;
    }
    if (item.slot === slotId) {
      const now = { ...placed, [item.id]: slotId };
      setPlaced(now);
      setSel(null);
      setSay({ tone: 'good', text: item.why });
      if (Object.keys(now).length === def.items.length) onSolved();
    } else {
      setShake(slotId);
      setTimeout(() => setShake(null), 400);
      setSay({ tone: 'bad', text: `${item.label} does not go in ${slot.label}. ${slot.rule} Try another.` });
    }
  };
  return (
    <div class="ls-act">
      <p class="ls-prompt">{def.prompt}</p>
      <div class="ls-tray">
        {left.map((i) => (
          <button type="button" class={`ls-item${sel === i.id ? ' sel' : ''}`} aria-pressed={sel === i.id} onClick={() => { setSel(sel === i.id ? null : i.id); setSay(null); }}>{i.label}</button>
        ))}
        {!left.length && <span class="ls-tray-done"><Icon name="check" size={18} /> All placed</span>}
      </div>
      <div class="ls-slots">
        {def.slots.map((s) => (
          <button type="button" class={`ls-slot${sel ? ' open' : ''}${shake === s.id ? ' shake' : ''}`} onClick={() => drop(s.id)} aria-label={`${s.label}${s.sub ? `, ${s.sub}` : ''}`}>
            <span class="ls-slot-name"><b>{s.label}</b>{s.sub && <span>{s.sub}</span>}</span>
            <span class="ls-slot-items">
              {def.items.filter((i) => placed[i.id] === s.id).map((i) => <span class="ls-placed">{i.label}</span>)}
            </span>
          </button>
        ))}
      </div>
      {say && <Say tone={say.tone}>{say.text}</Say>}
    </div>
  );
}

/* ---------- compute ---------- */

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

function Compute({ def, onSolved }: { def: ComputeDef; onSolved: () => void }) {
  const [round, setRound] = useState(0);
  const [entry, setEntry] = useState('');
  const [tries, setTries] = useState(0);
  const [say, setSay] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const r = def.rounds[round];
  const last = round === def.rounds.length - 1;

  const press = (k: string) => {
    if (right) return;
    setSay(null);
    if (k === 'del') setEntry(entry.slice(0, -1));
    else if (k === '.' && entry.includes('.')) return;
    else if (entry.length < 6) setEntry(entry + k);
  };
  const win = (shown: string) => {
    setEntry(shown);
    setRight(true);
    setSay(null);
    if (last) onSolved();
  };
  const check = () => {
    const val = Number(entry);
    if (entry === '' || entry === '.' || Number.isNaN(val)) return;
    if (val >= r.accept[0] && val <= r.accept[1]) return win(entry);
    const trap = r.traps?.find((t) => val >= t.range[0] && val <= t.range[1]);
    setTries(tries + 1);
    setSay(trap ? trap.why : r.hint.replace(/^Not quite\. /, ''));
  };
  const nextRound = () => {
    setRound(round + 1);
    setEntry('');
    setTries(0);
    setSay(null);
    setRight(false);
  };

  return (
    <div class="ls-act">
      {def.rounds.length > 1 && <span class="ls-count">Sum {round + 1} of {def.rounds.length}</span>}
      <p class="ls-prompt">{r.prompt}</p>
      <div class="ls-formula" role="img" aria-label={r.bottom ? `${r.left} equals ${r.top} divided by ${r.bottom}, equals ${entry || 'blank'}` : `${r.left} equals ${r.top.replace(/×/g, 'times')}, equals ${entry || 'blank'}`}>
        <span class="ls-f-left">{r.left} =</span>
        {r.bottom ? <span class="ls-frac"><span>{r.top}</span><i /><span>{r.bottom}</span></span> : <span>{r.top}</span>}
        <span class="ls-f-left">=</span>
        <span class={`ls-box${right ? ' right' : say ? ' wrong' : ''}`}>{entry || '?'}</span>
      </div>
      {right ? (
        <>
          <div class="ls-working">
            {r.working.map((w, i) => <span class={i === 0 ? 'ls-work-sum' : ''}>{w}</span>)}
          </div>
          {!last && <button type="button" class="btn secondary block" onClick={nextRound}>Next sum</button>}
        </>
      ) : (
        <>
          {say && <Say tone="bad">{say}</Say>}
          <div class="ls-pad">
            {KEYS.map((k) => (
              <button type="button" class="ls-key" onClick={() => press(k)} aria-label={k === 'del' ? 'Delete' : k === '.' ? 'Decimal point' : k}>
                {k === 'del' ? '⌫' : k}
              </button>
            ))}
          </div>
          <div class="ls-foot-row">
            {tries >= 2 && <button type="button" class="btn secondary" onClick={() => win(r.answer)}>Show me</button>}
            <button type="button" class="btn ghost ls-grow" disabled={entry === '' || entry === '.'} onClick={check}>Check my answer</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- the card ---------- */

function Activity({ def, pickRef, onPic, onSolved }: { def: Interaction; pickRef: { current: ((id: string) => void) | null }; onPic: (p: PicProps) => void; onSolved: () => void }) {
  switch (def.kind) {
    case 'choice': return <Choice def={def} pickRef={pickRef} onPic={onPic} onSolved={onSolved} />;
    case 'slider': return <Slider def={def} onPic={onPic} onSolved={onSolved} />;
    case 'sort': return <Sort def={def} onSolved={onSolved} />;
    case 'compute': return <Compute def={def} onSolved={onSolved} />;
  }
}

export function CardView({ step, sub, nav }: { step: CardStep; sub: string; nav: Nav }) {
  const act = step.interaction;
  const [solved, setSolved] = useState(!act);
  const [pic, setPic] = useState<PicProps>(act?.kind === 'slider' ? { value: act.start } : {});
  const pickRef = useRef<((id: string) => void) | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) first.current = false;
    else if (solved) reveal(end.current); // bring "Remember" and Continue into view
  }, [solved]);
  return (
    <>
      {step.picture && (
        <Picture pic={step.picture} sub={sub} {...pic} onPick={act?.kind === 'choice' ? (id) => pickRef.current?.(id) : undefined} />
      )}
      <h2 class="ls-h">{step.heading}</h2>
      {step.text.map((p) => <p class="ls-p">{p}</p>)}
      {act && <Activity def={act} pickRef={pickRef} onPic={setPic} onSolved={() => setSolved(true)} />}
      {step.remember && solved && (
        <div class="ls-remember"><span class="ls-remember-k">Remember</span><span>{step.remember}</span></div>
      )}
      <Footer nav={nav} locked={!solved && !nav.revisit} note="Finish the activity above to continue." />
      <div ref={end} />
    </>
  );
}
