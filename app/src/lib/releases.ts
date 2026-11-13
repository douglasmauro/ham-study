/**
 * Release notes shown on the "What's new" screen, newest first.
 *
 * `version` is the build number shown on the home screen (the GitHub Actions run number
 * that deployed it). `date` is when that build went live. Keep the wording plain and short:
 * what a learner can now do, not how it was built. When you ship something worth telling
 * the learner about, add an entry at the top with the version the next deploy will get.
 */
export type ChangeKind = 'new' | 'improved' | 'fixed';

export interface Release {
  version: number;
  date: string; // ISO time the build went live
  title: string;
  changes: { kind: ChangeKind; text: string }[];
}

export const RELEASES: Release[] = [
  {
    version: 60,
    date: '2026-11-13T16:30:00Z',
    title: 'No more practice loops',
    changes: [
      { kind: 'fixed', text: 'Practice no longer repeats the same few questions to fill the session when you have run out of new ones.' },
      { kind: 'improved', text: 'When you have practiced everything you have learned, the app says so and sends you to the next lesson to unlock more questions.' },
      { kind: 'improved', text: "The home screen's practice step shows only what you can actually practice right now." },
    ],
  },
  {
    version: 58,
    date: '2026-11-12T14:30:00Z',
    title: 'Release notes',
    changes: [
      { kind: 'new', text: 'This page: a short history of what has been added and fixed, version by version.' },
    ],
  },
  {
    version: 57,
    date: '2026-11-12T14:16:30Z',
    title: 'All 35 lessons are ready',
    changes: [
      { kind: 'new', text: 'Every part of the Technician exam now has a lesson, from how radio works to FCC rules and safety.' },
      { kind: 'new', text: 'Each lesson starts with a short narrated clip, then picture cards, a quick check and a recap.' },
      { kind: 'improved', text: 'Every lesson was checked against the official answers, and the safety lessons were checked again for safety.' },
      { kind: 'fixed', text: 'The narrator now says kilohertz and megahertz in full instead of reading the letters.' },
    ],
  },
  {
    version: 42,
    date: '2026-11-12T00:36:07Z',
    title: 'The full course outline',
    changes: [
      { kind: 'new', text: 'The course is laid out in teaching order, so each lesson builds on the one before.' },
      { kind: 'new', text: 'Lessons 2 and 3: how signals travel, and how they reach beyond the horizon.' },
      { kind: 'improved', text: 'Math activities can now show a multiplication as well as a division.' },
    ],
  },
  {
    version: 35,
    date: '2026-11-11T23:58:11Z',
    title: 'Learn first, then get tested',
    changes: [
      { kind: 'new', text: 'Lessons: learn a topic before its questions show up in your practice.' },
      { kind: 'new', text: 'The first lesson: wavelength and frequency.' },
      { kind: 'improved', text: "A new home screen built around today's plan: one lesson, then practice." },
    ],
  },
  {
    version: 30,
    date: '2026-11-11T14:25:40Z',
    title: 'Pictures for every term',
    changes: [
      { kind: 'new', text: 'Every glossary term has its own drawing.' },
      { kind: 'new', text: 'After you answer a question, its key terms appear with their pictures, in the notebook too.' },
      { kind: 'new', text: 'Glossary flashcard decks.' },
      { kind: 'new', text: 'The version number and build date on the home screen, with a button to get the newest version.' },
    ],
  },
  {
    version: 20,
    date: '2026-11-11T13:53:54Z',
    title: 'The glossary',
    changes: [
      { kind: 'new', text: '393 terms in plain words, each with a colored dot for how well you know it.' },
      { kind: 'new', text: 'Drill any term to practice the questions that use it.' },
    ],
  },
  {
    version: 12,
    date: '2026-11-11T13:17:08Z',
    title: 'How the exams work',
    changes: [
      { kind: 'new', text: 'A page on the three license levels: questions, passing score, fees and retakes.' },
      { kind: 'improved', text: 'Examples and missions now use Doug and Jeff.' },
    ],
  },
  {
    version: 10,
    date: '2026-11-11T05:08:21Z',
    title: 'More ways to learn',
    changes: [
      { kind: 'new', text: 'The Learn library: visual labs, hands-on sorting and matching, quick cards and narrated concept clips.' },
      { kind: 'new', text: 'Missions: use what you know in a real situation on the air.' },
      { kind: 'new', text: 'An exam-day simulation, a picture notebook of what you struggled with, and a weekly report.' },
      { kind: 'new', text: 'Step-by-step working for the math questions.' },
      { kind: 'fixed', text: 'A question card could get stuck when the same question came up twice in a row.' },
    ],
  },
  {
    version: 4,
    date: '2026-11-11T04:34:25Z',
    title: 'Explanations for every question',
    changes: [
      { kind: 'new', text: 'All 409 questions explain why the right answer is right and why each wrong answer is wrong.' },
      { kind: 'new', text: 'A hint appears if you get stuck on a question.' },
    ],
  },
  {
    version: 2,
    date: '2026-11-11T04:21:24Z',
    title: 'First release',
    changes: [
      { kind: 'new', text: 'The official 2026 to 2030 Technician question pool, all 409 questions.' },
      { kind: 'new', text: 'Daily practice that brings back the questions you miss until you know them.' },
      { kind: 'new', text: 'A 35-question practice exam and a score for how ready you are to pass.' },
      { kind: 'new', text: 'Works offline and can be added to your home screen. Progress stays on your phone, with backups.' },
    ],
  },
];

const SEEN_KEY = 'hamstudy:seen-release';

/** The newest release this device has opened the "What's new" page for, or 0. */
export function seenRelease(): number {
  try {
    return Number(localStorage.getItem(SEEN_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function markReleasesSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, String(RELEASES[0].version));
  } catch {
    // Not being able to remember this only means the "new" dot shows again.
  }
}
