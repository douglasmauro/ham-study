import techPool from '../data/technician-2026.json';

export interface Question {
  id: string; // e.g. T5D01
  sub: string; // e.g. T5
  group: string; // e.g. T5D
  answer: number; // index into choices
  refs: string;
  question: string;
  choices: string[];
  figure: string | null; // e.g. T-1
}

export interface Group {
  id: string;
  title: string;
}

export interface Subelement {
  id: string;
  title: string;
  examQuestions: number;
  groups: Group[];
}

export interface Pool {
  pool: {
    id: string;
    name: string;
    element: number;
    effective: string;
    expires: string;
    revision: string;
    source: string;
    examQuestions: number;
    passMark: number;
  };
  subelements: Subelement[];
  questions: Question[];
}

/** Display metadata for each subelement: one color and one icon for the whole course. */
export interface Topic {
  id: string;
  name: string;
  color: string;
  icon: IconName;
}

export type IconName =
  | 'badge' | 'mic' | 'wave' | 'radio' | 'triangle' | 'resistor'
  | 'circuit' | 'signal' | 'antenna' | 'shield';

export const TOPICS: Record<string, Topic> = {
  T1: { id: 'T1', name: 'FCC rules', color: '#6EA8FE', icon: 'badge' },
  T2: { id: 'T2', name: 'Operating procedures', color: '#B197FC', icon: 'mic' },
  T3: { id: 'T3', name: 'Radio wave propagation', color: '#3BC9DB', icon: 'wave' },
  T4: { id: 'T4', name: 'Station practices', color: '#F783AC', icon: 'radio' },
  T5: { id: 'T5', name: 'Electrical principles', color: '#FFD43B', icon: 'triangle' },
  T6: { id: 'T6', name: 'Components', color: '#FF922B', icon: 'resistor' },
  T7: { id: 'T7', name: 'Practical circuits', color: '#94D82D', icon: 'circuit' },
  T8: { id: 'T8', name: 'Signals and emissions', color: '#E599F7', icon: 'signal' },
  T9: { id: 'T9', name: 'Antennas and feed lines', color: '#63E6BE', icon: 'antenna' },
  T0: { id: 'T0', name: 'Safety', color: '#FF6B6B', icon: 'shield' },
};

export const POOL: Pool = techPool as Pool;

export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  POOL.questions.map((q) => [q.id, q]),
);

export const QUESTIONS_BY_GROUP: Record<string, Question[]> = POOL.questions.reduce(
  (acc, q) => {
    (acc[q.group] ||= []).push(q);
    return acc;
  },
  {} as Record<string, Question[]>,
);

export const ALL_GROUPS: Group[] = POOL.subelements.flatMap((s) => s.groups);

export function topicOf(id: string): Topic {
  return TOPICS[id.slice(0, 2)];
}

export function groupTitle(groupId: string): string {
  return ALL_GROUPS.find((g) => g.id === groupId)?.title ?? groupId;
}
