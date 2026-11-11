/**
 * Picture notebook: a review sheet built from the answer log. A question is in
 * the notebook when the log shows trouble with it (a wrong answer, a hint or a
 * marked guess). Entries the learner has since mastered (box >= 3) move to the
 * collapsed "Now mastered" section.
 */
import { useMemo, useState } from 'preact/hooks';
import { isMastered, type AnswerEvent, type QState } from '../../lib/engine';
import { explanationFor } from '../../lib/explain';
import { QUESTIONS_BY_ID, TOPICS, type Question } from '../../lib/pool';
import { computeStats } from '../../lib/stats';
import { useData } from '../../lib/store';
import { Icon } from '../../ui/Icon';
import './notebook.css';

interface Entry {
  q: Question;
  wrong: number; // times answered wrong
  hinted: number; // answers given with a hint
  guessed: number; // answers marked as a guess
  topPick: number | null; // wrong choice picked most often (original index)
  lastTrouble: number;
  mastered: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function buildEntries(events: AnswerEvent[], states: Record<string, QState>): Entry[] {
  const agg: Record<string, { wrong: number; hinted: number; guessed: number; last: number; picks: Record<number, { n: number; last: number }> }> = {};
  for (const e of events) {
    const trouble = !e.correct || e.hint > 0 || !!e.guess;
    if (!trouble || !QUESTIONS_BY_ID[e.q]) continue;
    const a = (agg[e.q] ||= { wrong: 0, hinted: 0, guessed: 0, last: 0, picks: {} });
    if (!e.correct) {
      a.wrong++;
      const p = (a.picks[e.choice] ||= { n: 0, last: 0 });
      p.n++;
      p.last = Math.max(p.last, e.t);
    }
    if (e.hint > 0) a.hinted++;
    if (e.guess) a.guessed++;
    a.last = Math.max(a.last, e.t);
  }
  return Object.entries(agg).map(([id, a]) => {
    const q = QUESTIONS_BY_ID[id];
    // Most often picked wrong choice; a tie goes to the most recent pick.
    const picks = Object.entries(a.picks)
      .filter(([c]) => Number(c) !== q.answer && q.choices[Number(c)] !== undefined)
      .sort((x, y) => y[1].n - x[1].n || y[1].last - x[1].last);
    return {
      q, wrong: a.wrong, hinted: a.hinted, guessed: a.guessed,
      topPick: picks.length ? Number(picks[0][0]) : null,
      lastTrouble: a.last,
      mastered: isMastered(states[id]),
    };
  });
}

const times = (n: number) => (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`);
const byMissed = (a: Entry, b: Entry) =>
  b.wrong - a.wrong || b.hinted + b.guessed - (a.hinted + a.guessed) || b.lastTrouble - a.lastTrouble || a.q.id.localeCompare(b.q.id);
const byId = (a: Entry, b: Entry) => a.q.id.localeCompare(b.q.id);

function EntryCard({ e, showTopic }: { e: Entry; showTopic?: boolean }) {
  const [open, setOpen] = useState(false);
  const ex = explanationFor(e.q.id);
  const t = TOPICS[e.q.sub];
  const q = e.q;
  return (
    <div class="notebook-entry" style={{ borderLeftColor: t.color }}>
      <button class="notebook-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span class="grow">
          <span class="notebook-concept">{ex?.concept ?? q.question}</span>
          <span class="notebook-tags">
            {showTopic && <span class="notebook-tag"><span class="dot" style={{ background: t.color }} />{t.id} {t.name}</span>}
            <span>{q.id}</span>
            {e.mastered && <span class="notebook-tag ok"><Icon name="check" size={14} />Mastered</span>}
            {e.wrong > 0 && <span class="notebook-tag miss"><Icon name="x" size={14} />Missed {times(e.wrong)}</span>}
            {e.hinted > 0 && <span class="notebook-tag help"><Icon name="bulb" size={14} />Hint used</span>}
            {e.guessed > 0 && <span class="notebook-tag help">? Guessed</span>}
            {q.figure && <span>Figure {q.figure}</span>}
          </span>
        </span>
        <span class="notebook-chev"><Icon name="chevron" size={20} /></span>
      </button>
      {open && (
        <div class="notebook-body">
          {q.figure && (
            <div class="figure"><img src={`./figures/${q.figure}.png`} alt={`Figure ${q.figure} from the official question pool`} /></div>
          )}
          <div>
            <span class="notebook-label">Official question {q.id}</span>
            <p class="notebook-q">{q.question}</p>
          </div>
          <div class="notebook-ans right">
            <span class="notebook-label"><Icon name="check" size={16} />Correct answer</span>
            <span class="notebook-choice">{LETTERS[q.answer]}. {q.choices[q.answer]}</span>
            {ex?.why?.[q.answer] && <span class="notebook-why">{ex.why[q.answer]}</span>}
          </div>
          {e.topPick !== null ? (
            <div class="notebook-ans wrong">
              <span class="notebook-label"><Icon name="x" size={16} />{e.wrong > 1 ? 'You picked most often' : 'You picked'}</span>
              <span class="notebook-choice">{LETTERS[e.topPick]}. {q.choices[e.topPick]}</span>
              {ex?.why?.[e.topPick] && <span class="notebook-why">{ex.why[e.topPick]}</span>}
            </div>
          ) : (
            <div class="notebook-ans">
              <span class="notebook-why">
                You got this one right, but {e.hinted > 0 && e.guessed > 0 ? 'with a hint and as a guess' : e.hinted > 0 ? 'with a hint' : 'you marked it as a guess'}.
                Read the reason above until it makes sense on its own.
              </span>
            </div>
          )}
          <a class="notebook-link" href={`#/group/${q.group}?${Date.now()}`}>Drill group {q.group} →</a>
        </div>
      )}
    </div>
  );
}

export default function Notebook() {
  const data = useData();
  const stats = computeStats(data);
  const entries = useMemo(() => buildEntries(data.events, stats.states), [data.events, stats.states]);
  const [filter, setFilter] = useState<string>('all'); // 'all' | 'missed' | topic id

  const active = entries.filter((e) => !e.mastered);
  const mastered = entries.filter((e) => e.mastered);
  const topicIds = Object.keys(TOPICS).filter((id) => active.some((e) => e.q.sub === id));
  const f = filter !== 'all' && filter !== 'missed' && !topicIds.includes(filter) ? 'all' : filter;
  const inTopic = (e: Entry) => f === 'all' || f === 'missed' || e.q.sub === f;
  const shown = active.filter(inTopic);
  const shownMastered = mastered.filter(inTopic).sort(byId);
  const groups = topicIds
    .filter((id) => f === 'all' || f === id)
    .map((id) => ({ t: TOPICS[id], items: shown.filter((e) => e.q.sub === id).sort(byMissed) }));

  return (
    <div class="screen">
      <div class="topbar">
        <a class="iconbtn" href="#/learn" aria-label="Back"><Icon name="back" /></a>
        <div class="stack" style={{ gap: '0' }}>
          <span class="sub">Built from your answers</span>
          <h1>Picture notebook</h1>
        </div>
      </div>

      {entries.length === 0 ? (
        <div class="card stack">
          <p class="notebook-count">Your notebook is empty.</p>
          <span style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>
            {data.events.length === 0
              ? 'It fills in by itself as you study. When you miss a question, use a hint or mark an answer as a guess, the idea behind it lands here in plain words.'
              : `You have answered ${data.events.length} questions with no misses, hints or guesses. When one gives you trouble, the idea behind it lands here in plain words.`}
          </span>
          <a class="btn primary block" href={`#/drill?${Date.now()}`}>Start today's drill</a>
        </div>
      ) : (
        <>
          <div class="stack" style={{ gap: '4px' }}>
            <p class="notebook-count">
              {active.length === 0 ? 'Nothing left to review.' : `${active.length} ${active.length === 1 ? 'concept' : 'concepts'} to review`}
            </p>
            <span class="small muted">
              {mastered.length > 0 ? `${mastered.length} now mastered. ` : ''}Tap a card to see the question and the reasons.
            </span>
          </div>

          {active.length > 0 && (
            <div class="notebook-filters" role="group" aria-label="Filter the notebook">
              <button class="notebook-filter" aria-pressed={f === 'all'} onClick={() => setFilter('all')}>All by topic</button>
              <button class="notebook-filter" aria-pressed={f === 'missed'} onClick={() => setFilter('missed')}>Most missed first</button>
              {topicIds.map((id) => (
                <button class="notebook-filter" aria-pressed={f === id} aria-label={`${id} ${TOPICS[id].name}, ${active.filter((e) => e.q.sub === id).length}`} onClick={() => setFilter(id)}>
                  <span class="dot" style={{ background: TOPICS[id].color }} />{id} · {active.filter((e) => e.q.sub === id).length}
                </button>
              ))}
            </div>
          )}

          {active.length === 0 && (
            <div class="card" style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>
              Every concept that gave you trouble is now mastered. New ones show up here when you miss a question, use a hint or mark a guess.
            </div>
          )}

          {f === 'missed' ? (
            <div class="stack" style={{ gap: '8px' }}>
              {shown.slice().sort(byMissed).map((e) => <EntryCard key={e.q.id} e={e} showTopic />)}
            </div>
          ) : (
            groups.map(({ t, items }) => (
              <section class="notebook-topic" key={t.id}>
                <div class="notebook-topichead">
                  <Icon name={t.icon} color={t.color} />
                  <h2><span style={{ color: t.color }}>{t.id}</span> · {t.name} <span class="muted" style={{ fontWeight: 500 }}>({items.length})</span></h2>
                </div>
                {items.map((e) => <EntryCard key={e.q.id} e={e} />)}
                <a class="notebook-link" href={`#/topic/${t.id}?${Date.now()}`}>Drill this topic →</a>
              </section>
            ))
          )}

          {shownMastered.length > 0 && (
            <details class="notebook-mastered">
              <summary>
                <Icon name="check" color="var(--good)" />
                <span class="grow">Now mastered ({shownMastered.length})</span>
                <span class="notebook-chev"><Icon name="chevron" size={20} /></span>
              </summary>
              <div class="stack">
                <span class="small muted" style={{ paddingBottom: '8px' }}>These gave you trouble before. You have since answered them right several times in a row.</span>
                {shownMastered.map((e) => <EntryCard key={e.q.id} e={e} showTopic />)}
              </div>
            </details>
          )}

          {active.length > 0 && (
            <div class="notebook-cta">
              <a class="btn primary block" href={`#/review?${Date.now()}`}><Icon name="replay" color="var(--accent-ink)" />Drill these</a>
              <span class="small muted" style={{ textAlign: 'center' }}>Runs a review of your misses from the last 7 days, up to 20 questions.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
