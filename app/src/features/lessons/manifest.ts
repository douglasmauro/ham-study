/**
 * The list of lessons, kept apart from the lessons themselves so the home screen and the
 * drill can read it without loading any lesson content.
 */
export interface LessonInfo {
  id: string; // same id as the lesson's FeatureDef
  title: string;
  groups: string[]; // question groups this lesson teaches; their new questions wait for it
  order: number; // position in the teaching order
  minutes: number;
}

export const LESSONS: LessonInfo[] = [];
