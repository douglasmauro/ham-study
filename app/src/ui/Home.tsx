import { POOL, TOPICS } from '../lib/pool';
import { computeStats } from '../lib/stats';
import { useData } from '../lib/store';
import { Icon } from './Icon';

function Dial({ value }: { value: number }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const pct = Math.round(value * 100);
  return (
    <div style={{ position: 'relative', width: '136px', height: '136px', flexShrink: 0 }}>
      <svg width="136" height="136" viewBox="0 0 136 136" role="img" aria-label={`Exam readiness ${pct} percent`}>
        <circle cx="68" cy="68" r={r} fill="none" stroke="var(--line)" stroke-width="12" />
        {pct > 0 && (
          <circle cx="68" cy="68" r={r} fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round"
            stroke-dasharray={`${(c * pct) / 100} ${c}`} transform="rotate(-90 68 68)" />
        )}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--display)', fontSize: '34px', fontWeight: 700 }}>{pct}%</span>
        <span class="small muted">readiness</span>
      </div>
    </div>
  );
}

export function Home() {
  const data = useData();
  const s = computeStats(data);
  const goal = data.settings.dailyGoal;
  const examDate = data.settings.examDate;
  const weak = s.weakest;
  const wt = weak ? TOPICS[weak.id] : null;

  return (
    <div class="screen">
      <div class="row between">
        <div class="stack" style={{ gap: '2px' }}>
          <span class="small muted">{POOL.pool.name} · {POOL.pool.effective.slice(0, 4)} pool</span>
          <span style={{ fontFamily: 'var(--display)', fontSize: '26px', fontWeight: 700 }}>Ham Study</span>
        </div>
        <span class="row" style={{ gap: '8px' }}>
          <span class="chip"><Icon name="flame" size={18} color="var(--accent)" />{s.streak}-day streak</span>
          <a class="iconbtn" href="#/settings" aria-label="Settings"><Icon name="gear" /></a>
        </span>
      </div>

      <div class="card row" style={{ gap: '20px' }}>
        <Dial value={s.readiness} />
        <div class="stack" style={{ gap: '8px' }}>
          {examDate ? (
            <div class="stack" style={{ gap: '0' }}>
              <span class="small muted">Exam in</span>
              <span style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 600 }}>{s.daysToExam} days</span>
              <span class="small muted">{new Date(examDate + 'T12:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          ) : (
            <a href="#/settings" class="small">Set your exam date</a>
          )}
          <span class="small" style={{ color: 'var(--text-2)', lineHeight: 1.4 }}>
            Seen {s.seenCount} of {POOL.questions.length} · {s.masteredCount} mastered
          </span>
        </div>
      </div>

      <a class="btn primary block" href={`#/drill?${Date.now()}`} style={{ justifyContent: 'space-between', padding: '16px 20px' }}>
        <span class="stack" style={{ gap: '2px', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: '18px' }}>{s.todayCount >= goal ? 'Do another drill' : "Start today's drill"}</span>
          <span class="small" style={{ fontWeight: 500 }}>
            {Math.min(s.todayCount, goal)} of {goal} today · {s.dueCount} due for review · {s.newToday} new
          </span>
        </span>
        <Icon name="chevron" color="var(--accent-ink)" />
      </a>

      {weak && wt && (
        <div class="card stack">
          <div class="row"><span class="dot" style={{ background: wt.color }} /><h2 style={{ margin: 0 }}>Focus topic</h2></div>
          <div class="row between">
            <span style={{ fontWeight: 600 }}>{weak.id} · {wt.name}</span>
            <span style={{ fontWeight: 700, color: weak.mastery >= 0.8 ? 'var(--good)' : weak.mastery >= 0.4 ? 'var(--accent)' : 'var(--bad)' }}>{Math.round(weak.mastery * 100)}%</span>
          </div>
          <div class="bar"><div style={{ width: `${weak.mastery * 100}%`, background: wt.color }} /></div>
          <a href={`#/topic/${weak.id}?${Date.now()}`} style={{ minHeight: '44px', display: 'flex', alignItems: 'center', fontWeight: 600 }}>Drill this topic →</a>
        </div>
      )}

      {data.events.length >= 50 && Date.now() - (data.settings.lastBackup ?? 0) > 7 * 86_400_000 && (
        <a class="card small" href="#/settings" style={{ color: 'var(--text-2)', textDecoration: 'none' }}>
          Your progress lives on this phone only. <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Save a backup →</span>
        </a>
      )}

      <div class="grid2">
        <a class="tile-link" href={`#/exam?${Date.now()}`}><Icon name="exam" color="var(--accent)" /><span class="t">Practice exam</span><span class="small muted">35 questions, real format</span></a>
        <a class="tile-link" href="#/map"><Icon name="grid" color="var(--accent)" /><span class="t">Mastery map</span><span class="small muted">All 35 groups</span></a>
        <a class="tile-link" href={`#/review?${Date.now()}`}><Icon name="replay" color="var(--accent)" /><span class="t">Review misses</span><span class="small muted">Last 7 days</span></a>
        <a class="tile-link" href="#/learn"><Icon name="bulb" color="var(--accent)" /><span class="t">Learn</span><span class="small muted">Labs, hands-on, missions, clips</span></a>
      </div>
    </div>
  );
}
