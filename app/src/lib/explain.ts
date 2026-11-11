import data from '../data/explanations-technician-2026.json';

/** Teaching content for one question. `why` is indexed by the ORIGINAL choice order. */
export interface Explanation {
  concept?: string; // one plain-language sentence stating the rule
  hint?: string; // first hint: a nudge toward the idea, never the answer
  why?: string[]; // one line per choice: why it is right or not
}

const EXPLANATIONS = data as Record<string, Explanation>;

export function explanationFor(id: string): Explanation | undefined {
  return EXPLANATIONS[id];
}
