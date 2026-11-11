import data from '../data/glossary-technician-2026.json';
import { groupStatus, type QState, type Status } from './engine';
import { QUESTIONS_BY_ID, type Question } from './pool';

export interface Term {
  id: string; // url-safe slug
  term: string;
  def: string;
  more?: string;
  aka?: string[];
  sub: string; // main topic, e.g. 'T2'
  questions: string[]; // pool questions that test this term
}

export const TERMS = data as Term[];
export const TERMS_BY_ID: Record<string, Term> = Object.fromEntries(TERMS.map((t) => [t.id, t]));

export function termQuestions(t: Term): Question[] {
  return t.questions.map((id) => QUESTIONS_BY_ID[id]).filter(Boolean);
}

/**
 * How well the learner knows a term, from their answers to its questions. Same four
 * states and colors as the mastery map: new (gray), weak (red), learning (amber), mastered (green).
 */
export function termStatus(t: Term, states: Record<string, QState>): Status {
  return groupStatus(termQuestions(t), states);
}
