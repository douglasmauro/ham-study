import type { Question } from '../../lib/pool';

/** True when a step-by-step worked solution exists for this question. */
export function hasWorked(_id: string): boolean {
  return false;
}

/** Step-by-step worked solution for a calculation question, or nothing. */
export default function WorkedSteps(_props: { q: Question }) {
  return null;
}
