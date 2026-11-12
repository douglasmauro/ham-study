import { useGlossaryArt } from '../../ui/GlossaryArt';
import { TOPICS } from '../../lib/pool';
import type { ClipData, ClipDef, ClipLine, SceneProps } from './data';
import './lessonClips.css';

/**
 * Lesson intro clips. Unlike the six hand-animated clips, these are a narrated slide show:
 * each line names a glossary drawing to show while it is spoken. Any file named
 * data/lesson-<id>.json is picked up here, and tools/make_clip_audio.py records its lines.
 */
export interface SlideLine extends ClipLine {
  art?: string; // glossary term id of the drawing to show; keeps the previous one if left out
  label?: string; // a few words shown large under the drawing
}
export interface SlideClipData extends Omit<ClipData, 'lines'> {
  lines: SlideLine[];
}

function Slides({ data, step }: { data: SlideClipData } & SceneProps) {
  const art = useGlossaryArt();
  // Before the clip starts, show the first picture.
  const at = Math.max(0, step);
  let id: string | undefined;
  for (let i = at; i >= 0 && !id; i--) id = data.lines[i]?.art;
  if (!id) id = data.lines.find((l) => l.art)?.art;
  const A = id ? art?.[id] : undefined;
  const label = data.lines[at]?.label;
  return (
    <div class="lclip" style={{ ['--ga-key' as string]: data.sub === 'T0' ? 'var(--text)' : TOPICS[data.sub]?.color }}>
      <div class="lclip-art" key={id}>{A ? <A /> : null}</div>
      {label && <div class="lclip-label" key={`${at}-label`}>{label}</div>}
    </div>
  );
}

const files = import.meta.glob<{ default: SlideClipData }>('./data/lesson-*.json', { eager: true });

export const LESSON_CLIPS: ClipDef[] = Object.values(files).map((m) => {
  const data = m.default;
  return {
    data: data as ClipData,
    Scene: (p: SceneProps) => <Slides data={data} {...p} />,
    Extra: () => null,
  };
});
