/** Weekly report: the last 7 days against the 7 days before. Numbers come from calc.ts. */
import { POOL, TOPICS } from '../../lib/pool';
import { useData } from '../../lib/store';
import { Icon } from '../../ui/Icon';
import { computeReport, type DayBar, type Report } from './calc';
import './report.css';

const pct = (x: number) => Math.round(x * 100);
/** Readiness that rounds to 0 but is not 0 reads "under 1%". */
const readyLabel = (x: number) => (x > 0 && pct(x) === 0 ? 'under 1%' : `${pct(x)}%`);
const plural = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;
const shortDate = (t: number) => new Date(t).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

/** "up 5 from last week" in words, with an arrow and a color as extras. */
function Delta({ diff, unit, than, show }: { diff: number; unit: string; than: string; show: boolean }) {
  if (!show) return <span class="report-delta">First week, nothing to compare yet</span>;
  if (diff === 0) return <span class="report-delta">Same as {than}</span>;
  const up = diff > 0;
  return (
    <span class="report-delta">
      <b class={up ? 'up' : 'down'}>{up ? '▲ up' : '▼ down'} {Math.abs(diff)}{Math.abs(diff) === 1 ? unit.replace(/s$/, '') : unit}</b> from {than}
    </span>
  );
}

function DayChart({ days, goal }: { days: DayBar[]; goal: number }) {
  const W = 330, H = 168, top = 24, base = 128, slot = W / 7, bw = 26;
  const max = Math.max(goal, ...days.map((d) => d.answers), 1);
  const y = (v: number) => base - ((base - top) * v) / max;
  const summary = days.map((d) => `${d.isToday ? 'Today' : d.label} ${d.answers}`).join(', ');
  return (
    <svg class="report-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Questions answered each day. ${summary}. Daily goal ${goal}.`}>
      <line x1="0" x2={W} y1={y(goal)} y2={y(goal)} stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="4 4" />
      {days.map((d, i) => {
        const cx = slot * i + slot / 2;
        const h = base - y(d.answers);
        const r = Math.min(4, h);
        const x0 = cx - bw / 2;
        return (
          <g key={d.key}>
            {d.answers > 0 && (
              <path d={`M${x0} ${base} V${base - h + r} Q${x0} ${base - h} ${x0 + r} ${base - h} H${x0 + bw - r} Q${x0 + bw} ${base - h} ${x0 + bw} ${base - h + r} V${base} Z`} fill="var(--accent)" />
            )}
            <text class={d.answers ? 'report-val' : 'report-zero'} x={cx} y={base - h - 6} text-anchor="middle"
              stroke="var(--surface)" stroke-width="4" paint-order="stroke" stroke-linejoin="round">{d.answers}</text>
            <text class={d.isToday ? 'report-today' : ''} x={cx} y={base + 18} text-anchor="middle">{d.isToday ? 'Today' : d.label}</text>
            {d.activities > 0 && <text class="report-goal" x={cx} y={base + 34} text-anchor="middle">+{d.activities} act.</text>}
          </g>
        );
      })}
      <line x1="0" x2={W} y1={base} y2={base} stroke="var(--line-strong)" stroke-width="1" />
    </svg>
  );
}

function topicLabel(id: string) {
  return `${id}: ${TOPICS[id].name.toLowerCase()}`;
}

function Suggestions({ r }: { r: Report }) {
  const tips: { text: string; href: string; cta: string }[] = [];
  const ts = Date.now();
  for (const w of r.weakest) {
    if (pct(w.now) >= 85) continue;
    tips.push({
      text: tips.length === 0
        ? `Spend extra time on ${topicLabel(w.id)}. It is your weakest topic at ${pct(w.now)}% per question.`
        : `Then work on ${topicLabel(w.id)} (${pct(w.now)}% per question).`,
      href: `#/topic/${w.id}?${ts}`,
      cta: `Drill ${w.id}`,
    });
  }
  if (r.pace.kind === 'behind' && tips.length < 2) {
    tips.push({
      text: `Pick up the pace on new questions: about ${Math.ceil(r.pace.needPerDay!)} new ones a day gets you through the pool in time.`,
      href: `#/drill?${ts}`,
      cta: "Start today's drill",
    });
  }
  if (!tips.length) {
    tips.push({ text: 'Your topics all look solid. Take a practice exam to check it under real conditions.', href: `#/exam?${ts}`, cta: 'Practice exam' });
  }
  return (
    <div class="card">
      <h2>What to do next</h2>
      {tips.slice(0, 2).map((t) => (
        <div class="report-tip">
          <p class="report-line" style={{ color: 'var(--text)' }}>{t.text}</p>
          <a class="btn primary block" href={t.href}>{t.cta}</a>
        </div>
      ))}
    </div>
  );
}

function PaceCard({ r }: { r: Report }) {
  const p = r.pace;
  const total = POOL.questions.length;
  const rate = p.perDay >= 10 ? Math.round(p.perDay) : Math.round(p.perDay * 10) / 10;
  return (
    <div class="card stack">
      <h2 style={{ margin: 0 }}>Pace</h2>
      <p class="report-line">
        <b>{p.unseen}</b> of {total} questions still unseen.
        {p.daysToExam !== null && <> Exam in <b>{plural(p.daysToExam, 'day')}</b>.</>}
        {' '}You met <b>{plural(p.newThisWeek, 'new question')}</b> this week{p.newThisWeek > 0 ? `, about ${rate} a day` : ''}.
      </p>
      {p.kind === 'done' && <span class="report-status" style={{ color: 'var(--good)' }}><Icon name="check" size={18} />You have seen the whole pool.</span>}
      {p.kind === 'on' && (
        <>
          <span class="report-status" style={{ color: 'var(--good)' }}><Icon name="check" size={18} />On pace</span>
          <p class="report-line">You need about {Math.ceil(p.needPerDay!)} new a day to see the whole pool 17 days before the exam, which is {plural(p.daysToCover!, 'day')} away. You are doing {rate}.</p>
        </>
      )}
      {p.kind === 'behind' && (
        <>
          <span class="report-status" style={{ color: 'var(--bad)' }}><Icon name="x" size={18} />Behind pace</span>
          <p class="report-line">To see the whole pool 17 days before the exam ({plural(p.daysToCover!, 'day')} from now) you need about {Math.ceil(p.needPerDay!)} new a day. You are doing {rate}.</p>
        </>
      )}
      {p.kind === 'past' && (
        <>
          <span class="report-status" style={{ color: 'var(--bad)' }}><Icon name="x" size={18} />Short on time</span>
          <p class="report-line">The exam is less than 17 days away, so the review-only stretch has started with {p.unseen} questions unseen. Meet new ones every day{p.daysAtPace !== null ? `. At this week's pace that takes ${plural(p.daysAtPace, 'day')}` : ''}.</p>
        </>
      )}
      {p.kind === 'no-date' && (
        <>
          <p class="report-line">
            {p.daysAtPace !== null ? `At this pace you will have seen everything in about ${plural(p.daysAtPace, 'day')}.` : 'No new questions this week, so there is no pace to project.'}
            {' '}Set an exam date to see if you are on pace.
          </p>
          <a class="report-link" href="#/settings">Set your exam date →</a>
        </>
      )}
    </div>
  );
}

export default function WeeklyReport() {
  const data = useData();
  const r = computeReport(data);
  const first = r.days[0], last = r.days[6];
  const range = `${new Date(first.t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} to ${new Date(last.t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

  const top = (
    <div class="topbar">
      <a class="iconbtn" href="#/learn" aria-label="Back"><Icon name="back" /></a>
      <div class="stack" style={{ gap: '0' }}>
        <span class="sub">Last 7 days · {range}</span>
        <h1>Weekly report</h1>
      </div>
    </div>
  );

  if (r.empty) {
    return (
      <div class="screen">
        {top}
        <div class="card stack">
          <span style={{ fontFamily: 'var(--display)', fontSize: '18px', fontWeight: 600 }}>Nothing to report yet.</span>
          <span style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>
            Answer a few questions and this page will show your week: days studied, accuracy, readiness, your strongest gains and what to work on next.
          </span>
          <a class="btn primary block" href={`#/drill?${Date.now()}`}>Start today's drill</a>
        </div>
      </div>
    );
  }

  const w = r.week, p = r.prev;
  const readyDiff = pct(r.readinessNow) - pct(r.readinessThen);
  const accRows = [
    { label: 'This week', v: w.accuracy, n: w.answers, color: 'var(--accent)' },
    ...(r.hasPrev ? [{ label: 'Last week', v: p.accuracy, n: p.answers, color: 'var(--muted)' }] : []),
  ];

  return (
    <div class="screen">
      {top}

      {!r.hasPrev && (
        <div class="card small" style={{ color: 'var(--text-2)' }}>This is your first week, so there is no earlier week to compare with yet.</div>
      )}

      <div class="grid2">
        <div class="report-stat">
          <span class="report-k">Days studied</span>
          <span class="report-big">{w.days} <small>of 7</small></span>
          <Delta diff={w.days - p.days} unit="" than={`${p.days} last week`} show={r.hasPrev} />
        </div>
        <div class="report-stat">
          <span class="report-k">Questions answered</span>
          <span class="report-big">{w.answers}</span>
          <Delta diff={w.answers - p.answers} unit="" than={`${p.answers} last week`} show={r.hasPrev} />
        </div>
      </div>

      <div class="card">
        <h2>Questions answered each day</h2>
        <DayChart days={r.days} goal={data.settings.dailyGoal} />
        <span class="small muted">Dashed line: your daily goal of {data.settings.dailyGoal} questions. </span>
        {w.activities > 0 && <span class="small muted">Plus {plural(w.activities, 'learning activity', 'learning activities')} finished this week{r.hasPrev ? ` (${p.activities} last week)` : ''}.</span>}
      </div>

      <div class="card stack">
        <h2 style={{ margin: 0 }}>Accuracy</h2>
        {accRows.map((a) => (
          <div class="report-hrow">
            <span>{a.label}</span>
            <div class="report-hbar">{a.v !== null && <div style={{ width: `${a.v * 100}%`, background: a.color }} />}</div>
            <span class="report-n">{a.v === null ? 'none' : `${pct(a.v)}%`}</span>
          </div>
        ))}
        <span class="small muted">
          {w.accuracy === null ? 'No questions answered this week.' : `${w.right} right of ${w.answers} this week`}
          {r.hasPrev && p.accuracy !== null ? `, ${p.right} of ${p.answers} last week.` : w.accuracy === null ? '' : '.'}
          {' '}Right answers with a hint or a guess count as right here.
        </span>
        {w.accuracy !== null && r.hasPrev && p.accuracy !== null && (
          <Delta diff={pct(w.accuracy) - pct(p.accuracy)} unit=" points" than="last week" show />
        )}
      </div>

      <div class="card stack">
        <h2 style={{ margin: 0 }}>Exam readiness</h2>
        <div class="row" style={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span class="report-big">{readyLabel(r.readinessNow)}</span>
          <span class="small muted">chance of passing today</span>
        </div>
        <div class="bar" style={{ height: '10px' }} aria-hidden="true"><div style={{ width: `${pct(r.readinessNow)}%`, background: 'var(--accent)' }} /></div>
        {r.hasPrev
          ? <Delta diff={readyDiff} unit=" points" than={`${readyLabel(r.readinessThen)} a week ago`} show />
          : <span class="report-delta">You started this week from zero.</span>}
        <span class="small muted">
          <b style={{ color: 'var(--text)' }}>{plural(r.newlyMastered.length, 'question')}</b> newly mastered this week, {r.masteredNow} of {POOL.questions.length} mastered in all.
          {r.slipped.length > 0 && ` ${plural(r.slipped.length, 'question')} slipped out of mastered after a miss, a hint or a guess.`}
        </span>
      </div>

      {r.improved.length > 0 && (
        <div class="card">
          <h2>Most improved topics</h2>
          {r.improved.map((c) => (
            <div class="report-topic">
              <div class="row">
                <span class="dot" style={{ background: TOPICS[c.id].color }} />
                <span class="report-name">{c.id} · {TOPICS[c.id].name}</span>
                <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{pct(c.then)}% → {pct(c.now)}%</span>
              </div>
              <span class="report-delta"><b class="up">▲ up {plural(pct(c.now) - pct(c.then), 'point')}</b> this week</span>
            </div>
          ))}
          <span class="small muted">The percentage is your estimated chance of getting an exam question from that topic right.</span>
        </div>
      )}

      {r.weakest.length > 0 && (
        <div class="card">
          <h2>Weakest topics now</h2>
          {r.weakest.map((c) => (
            <div class="report-topic">
              <div class="row">
                <span class="dot" style={{ background: TOPICS[c.id].color }} />
                <span class="report-name">{c.id} · {TOPICS[c.id].name}</span>
                <span style={{ fontWeight: 700 }}>{pct(c.now)}%</span>
              </div>
              <div class="bar" aria-hidden="true"><div style={{ width: `${pct(c.now)}%`, background: TOPICS[c.id].color }} /></div>
              <a class="report-link" href={`#/topic/${c.id}?${Date.now()}`}>Drill this topic →</a>
            </div>
          ))}
          <span class="small muted">Only topics you have started are ranked.</span>
        </div>
      )}

      <div class="card stack" style={{ gap: '6px' }}>
        <h2 style={{ margin: 0 }}>Practice exams this week</h2>
        {r.exams.length === 0 && <span class="report-line">No full practice exam this week.</span>}
        {r.exams.map((x) => (
          <div class="report-exam">
            <span class="grow">{shortDate(x.t)}</span>
            <span style={{ fontWeight: 700 }}>{x.right} of {x.total}</span>
            <span class="report-status" style={{ color: x.pass ? 'var(--good)' : 'var(--bad)', minWidth: '84px' }}>
              <Icon name={x.pass ? 'check' : 'x'} size={16} />{x.pass ? 'Pass' : 'Not yet'}
            </span>
          </div>
        ))}
        <span class="small muted">
          You need {POOL.pool.passMark} of {POOL.pool.examQuestions} to pass.
          {r.unfinishedExams > 0 && ` ${plural(r.unfinishedExams, 'unfinished exam')} not counted.`}
        </span>
      </div>

      <PaceCard r={r} />
      <Suggestions r={r} />
    </div>
  );
}
