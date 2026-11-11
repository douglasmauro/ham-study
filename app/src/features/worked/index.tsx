import { useEffect, useState } from 'preact/hooks';
import { topicOf, type Question } from '../../lib/pool';
import raw from './solutions.json';
import { Picture } from './pictures';
import type { Worked } from './types';
import './worked.css';

/*
 * Worked solutions for every calculation question in the Technician pool.
 * The content is data in solutions.json (one entry per question id):
 *   Ohm's law     T5D01-T5D12
 *   Power         T5C08-T5C11, T4A01
 *   Metric prefix T5B01-T5B08, T5B12, T5B13
 *   Decibels      T5B09-T5B11
 *   Wavelength    T3B06, T1B03, T1B04
 *   Antenna       T9A08
 *   Ratios        T4A09, T0C03
 * Each entry's answer string equals the official keyed choice text.
 */
const SOLUTIONS: Record<string, Worked> = Object.fromEntries(
  (raw as unknown as Worked[]).map((w) => [w.id, w]),
);

/** True when a step-by-step worked solution exists for this question. */
export function hasWorked(id: string): boolean {
  return id in SOLUTIONS;
}

function fmt(v: number): string {
  return v >= 10000 ? v.toLocaleString('en-US') : String(v);
}

/** Step-by-step worked solution for a calculation question, or nothing. */
export default function WorkedSteps({ q }: { q: Question }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [q.id]);

  const w = SOLUTIONS[q.id];
  // Never show a solution that does not end at the official keyed answer.
  if (!w || w.answer !== q.choices[q.answer]) return null;
  const color = topicOf(q.id).color;
  const panelId = `wk-panel-${q.id}`;

  return (
    <div class="wk">
      <button class="wk-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        <svg class="wk-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        {open ? 'Hide the steps' : 'Show the steps'}
      </button>
      {open && (
        <div class="wk-panel" id={panelId}>
          <p class="wk-label">The picture</p>
          <Picture w={w} color={color} />
          {w.given.length > 0 && (
            <div class="wk-given" aria-label="Given values">
              {w.given.map((g) => (
                <span class="chip">{g.name}: {fmt(g.value)} {g.unit}</span>
              ))}
            </div>
          )}
          <p class="wk-label">Step by step</p>
          <ol class="wk-steps">
            {w.steps.map((s, i) => (
              <li class="wk-step">
                <span class="wk-num" aria-hidden="true">{i + 1}</span>
                <div class="wk-body">
                  <p class="wk-say">{s.say}</p>
                  <div class="wk-expr">{s.expr}</div>
                </div>
              </li>
            ))}
          </ol>
          <div class="wk-answer">
            <span class="wk-alabel">Answer</span>
            <span class="wk-atext">{q.choices[q.answer]}</span>
          </div>
        </div>
      )}
    </div>
  );
}
