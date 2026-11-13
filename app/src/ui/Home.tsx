import { DAY, localDay } from '../lib/engine';
import { TERMS } from '../lib/glossary';
import { finishedLessons, nextLesson, practiceAvailable } from '../lib/lessons';
import { POOL, TOPICS } from '../lib/pool';
import { computeStats } from '../lib/stats';
import { useData } from '../lib/store';
import { Icon } from './Icon';
import { Version } from './Version';

const LABEL = { fontSize: '12px', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' } as const;

function Ring({ value }: { value: number }) {
  const r = 21;
  const c = 2 * Math.PI * r;
  const pct = Math.round(value * 100);
  return (
    <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
      <svg width="52" height="52" viewBox="0 0 52 52" role="img" aria-label={`Readiness ${pct} percent`}>
        <circle cx="26" cy="26" r={r} fill="none" stroke="var(--line)" stroke-width="6" />
        {pct > 0 && <circle cx="26" cy="26" r={r} fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray={`${(c * pct) / 100} ${c}`} transform="rotate(-90 26 26)" />}
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>{pct}%</span>
    </div>
  );
}

/** One numbered step of today's plan. */
function Step({ n, done, current, label, title, sub }: { n: number; done: boolean; current: boolean; label: string; title: string; sub: string }) {
  const bg = done ? 'var(--good-bg)' : current ? 'var(--accent)' : 'var(--raised)';
  const fg = done ? 'var(--good)' : current ? 'var(--accent-ink)' : 'var(--muted)';
  return (
    <div class="row" style={{ gap: '12px', alignItems: 'flex-start', opacity: done || current ? 1 : 0.6 }}>
      <span aria-hidden="true" style={{ width: '28px', height: '28px', borderRadius: '999px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, background: bg, color: fg }}>{done ? '✓' : n}</span>
      <div class="stack grow" style={{ gap: '2px' }}>
        <span style={LABEL}>{label}{done ? ' · done' : ''}</span>
        <span style={{ fontSize: '17px', fontWeight: 600 }}>{title}</span>
        <span class="small muted">{sub}</span>
      </div>
    </div>
  );
}

function MoreRow({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <a href={href} class="row" style={{ textDecoration: 'none', color: 'var(--text)', gap: '12px', minHeight: '52px', padding: '0 4px', borderBottom: '1px solid var(--surface)' }}>
      <span class="grow stack" style={{ gap: 0 }}>
        <span style={{ fontSize: '16px', fontWeight: 500 }}>{title}</span>
        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{sub}</span>
      </span>
      <Icon name="chevron" size={18} color="var(--muted)" />
    </a>
  );
}

export function Home() {
  const data = useData();
  const s = computeStats(data);
  const now = Date.now();
  const goal = data.settings.dailyGoal;
  const examDate = data.settings.examDate;

  // Today's plan: a lesson first (when one is waiting), then practice.
  const today = localDay(now);
  const lesson = nextLesson(data);
  const lessonDoneToday = (data.activities ?? []).some((a) => a.area === 'lessons' && localDay(a.t) === today);
  const hasLessonStep = !!lesson || lessonDoneToday;
  const lessonStepDone = lessonDoneToday;
  const avail = practiceAvailable(data, s.states, now, s.newToday);
  // Nothing due and no new questions until the next lesson: practice is done for now.
  const caughtUp = avail.due + avail.fresh === 0;
  const practiceDone = s.todayCount >= goal || (caughtUp && s.todayCount > 0);
  const steps = (hasLessonStep ? 1 : 0) + 1;
  const stepsDone = (hasLessonStep && lessonStepDone ? 1 : 0) + (practiceDone ? 1 : 0);
  const lessonIsNext = !!lesson && !lessonStepDone;
  // About two questions a minute: the same pace the daily goal sizes assume.
  const practiceMinutes = practiceDone ? 0 : Math.max(1, Math.round((goal - Math.min(s.todayCount, goal)) / 2.1));
  const minutes = (lessonIsNext ? lesson!.minutes : 0) + practiceMinutes;
  const cta = lessonIsNext
    ? { href: `#/do/lessons/${lesson!.id}?${now}`, text: 'Start the lesson' }
    : caughtUp && lesson
      ? { href: `#/do/lessons/${lesson.id}?${now}`, text: 'Start the next lesson' }
      : practiceDone
      ? { href: `#/drill?${now}`, text: caughtUp ? 'All caught up' : 'Done for today. Do more?' }
      : { href: `#/drill?${now}`, text: s.todayCount > 0 ? 'Continue practice' : 'Start practice' };

  const weak = s.weakest;
  const wt = weak ? TOPICS[weak.id] : null;
  const misses = new Set(data.events.filter((e) => !e.correct && e.t >= now - 7 * DAY).map((e) => e.q)).size;
  const lessonsDone = finishedLessons(data).size;
  const needBackup = data.events.length >= 50 && now - (data.settings.lastBackup ?? 0) > 7 * DAY;

  return (
    <div class="screen">
      <div class="row between">
        <div class="stack" style={{ gap: '2px' }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: '24px', fontWeight: 700 }}>Ham Study</span>
          <span class="small muted">{POOL.pool.name} · level 1 of 3</span>
        </div>
        <span class="row" style={{ gap: '8px' }}>
          <span class="chip"><Icon name="flame" size={16} color="var(--accent)" />{s.streak} {s.streak === 1 ? 'day' : 'days'}</span>
          <a class="iconbtn" href="#/settings" aria-label="Settings"><Icon name="gear" /></a>
        </span>
      </div>

      <div class="row" style={{ gap: '12px', padding: '4px' }}>
        <Ring value={s.readiness} />
        <div class="stack grow" style={{ gap: '2px' }}>
          <span style={{ fontSize: '15px', fontWeight: 600 }}>Ready to pass: {Math.round(s.readiness * 100)}%</span>
          {examDate
            ? <span class="small muted">Exam in {s.daysToExam} {s.daysToExam === 1 ? 'day' : 'days'} · {new Date(examDate + 'T12:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            : <a class="small" href="#/settings" style={{ minHeight: '24px' }}>Set your exam date</a>}
        </div>
      </div>

      <div class="card stack" style={{ border: '2px solid var(--accent)', gap: '14px' }}>
        <div class="row between" style={{ alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 700 }}>Today</span>
          <span class="small muted">{stepsDone === steps ? 'all done' : `about ${Math.max(1, minutes)} min`} · {stepsDone} of {steps} done</span>
        </div>
        {hasLessonStep && (
          <Step n={1} done={lessonStepDone} current={lessonIsNext} label={`Learn${lesson && !lessonStepDone ? ` · ${lesson.minutes} min` : ''}`}
            title={lessonStepDone ? 'Lesson finished' : lesson!.title}
            sub={lessonStepDone ? (lesson ? (caughtUp ? `Next up: ${lesson.title}` : `Next up tomorrow: ${lesson.title}`) : 'You have finished every lesson') : 'A short clip, cards, then a check'} />
        )}
        <Step n={hasLessonStep ? 2 : 1} done={practiceDone} current={!lessonIsNext && !practiceDone} label="Practice"
          title={caughtUp ? (s.todayCount > 0 ? 'All caught up' : 'Nothing to practice yet') : practiceDone ? `${s.todayCount} questions answered` : `${avail.due} to review and ${avail.fresh} new`}
          sub={caughtUp ? (lesson ? 'More questions unlock with your next lesson' : 'Reviews come back as they come due') : practiceDone ? 'Come back tomorrow, or keep going' : `${Math.min(s.todayCount, goal)} of ${goal} done today`} />
        <a class="btn primary block" href={cta.href} style={{ minHeight: '56px', fontFamily: 'var(--display)', fontSize: '18px' }}>{cta.text}</a>
      </div>

      <div class="card stack" style={{ gap: '12px' }}>
        <span style={LABEL}>Got more time?</span>
        {weak && wt && (
          <a href={`#/topic/${weak.id}?${now}`} class="row" style={{ textDecoration: 'none', color: 'var(--text)', gap: '12px', minHeight: '48px' }}>
            <span class="dot" style={{ background: wt.color }} />
            <span class="grow stack" style={{ gap: '4px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600 }}>Weakest topic: {wt.name.toLowerCase()}</span>
              <span class="bar" style={{ height: '6px' }}><div style={{ width: `${weak.mastery * 100}%`, background: wt.color }} /></span>
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: weak.mastery >= 0.8 ? 'var(--good)' : weak.mastery >= 0.4 ? 'var(--accent)' : 'var(--bad)' }}>{Math.round(weak.mastery * 100)}%</span>
          </a>
        )}
        <div class="grid2">
          <a class="btn secondary" href={`#/exam?${now}`} style={{ fontSize: '15px' }}>Practice exam</a>
          <a class="btn secondary" href={`#/review?${now}`} style={{ fontSize: '15px', textAlign: 'center' }}>{misses ? `Review ${misses} ${misses === 1 ? 'miss' : 'misses'}` : 'Review misses'}</a>
        </div>
      </div>

      <div class="card stack" style={{ gap: '12px' }}>
        <div class="row between" style={{ alignItems: 'baseline' }}>
          <span style={LABEL}>Your progress by topic</span>
          <a class="small" href="#/map" style={{ fontWeight: 600, minHeight: '24px' }}>Mastery map</a>
        </div>
        <div role="img" aria-label={`Share of questions mastered in each topic: ${s.subs.map((x) => `${x.id} ${Math.round(x.mastery * 100)} percent`).join(', ')}`}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(10, minmax(0, 1fr))', gap: '6px', alignItems: 'end', height: '76px' }}>
          {s.subs.map((x) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: TOPICS[x.id].color, height: `${Math.max(3, x.mastery * 50)}px` }} />
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{x.id}</span>
            </div>
          ))}
        </div>
        <span class="small muted">Seen {s.seenCount} of {POOL.questions.length} questions · {s.masteredCount} mastered</span>
      </div>

      {needBackup && (
        <a class="card small" href="#/settings" style={{ color: 'var(--text-2)', textDecoration: 'none' }}>
          Your progress lives on this phone only. <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Save a backup →</span>
        </a>
      )}

      <div class="stack" style={{ gap: '2px' }}>
        <span style={{ ...LABEL, padding: '6px 4px' }}>More</span>
        <MoreRow href="#/learn" title="Learn library" sub={`Lessons${lessonsDone ? ` (${lessonsDone} done)` : ''}, labs, hands-on, missions, clips`} />
        <MoreRow href="#/glossary" title="Glossary" sub={`${TERMS.length} terms with pictures, and what you know`} />
        <MoreRow href="#/notebook" title="Picture notebook" sub="Concepts you struggled with" />
        <MoreRow href="#/report" title="Weekly report" sub="What improved, what is weak" />
        <MoreRow href={`#/examsim?${now}`} title="Exam-day simulation" sub="Timed, real layout, no hints" />
        <MoreRow href="#/exams" title="How the exams work" sub="Three levels, fees, retakes" />
      </div>

      <Version />
    </div>
  );
}
