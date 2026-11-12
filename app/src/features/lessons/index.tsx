import { useEffect, useState } from 'preact/hooks';
import type { FeatureDef, FeatureProps } from '../types';
import { LESSONS } from './manifest';
import { LessonPlayer } from './Player';
import type { Lesson } from './types';

/**
 * Each lesson is a file in content/ named after its id, with the lesson as its default
 * export. Lessons load one at a time, so opening one never waits for the other 34.
 */
const loaders = import.meta.glob<{ default: Lesson }>('./content/*.tsx');

function LazyLesson({ id, onDone }: FeatureProps & { id: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let live = true;
    const load = loaders[`./content/${id}.tsx`];
    if (!load) { setMissing(true); return; }
    load().then((m) => live && setLesson(m.default)).catch(() => live && setMissing(true));
    return () => { live = false; };
  }, [id]);
  if (missing) return <div class="screen"><div class="card">This lesson could not be loaded. It may not be written yet.</div><a class="btn secondary" href="#/learn/lessons">Back to lessons</a></div>;
  if (!lesson) return <div class="screen"><div class="card muted">Loading…</div></div>;
  return <LessonPlayer lesson={lesson} onDone={onDone} />;
}

export const ITEMS: FeatureDef[] = LESSONS.map((l) => ({
  id: l.id,
  title: l.title,
  blurb: `${l.unit}: a short clip, cards with something to do, then a check.`,
  kind: 'Lesson',
  sub: l.groups[0].slice(0, 2),
  groups: l.groups,
  minutes: l.minutes,
  component: (p: FeatureProps) => <LazyLesson id={l.id} {...p} />,
}));
