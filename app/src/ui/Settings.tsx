import { useState } from 'preact/hooks';
import { POOL } from '../lib/pool';
import { exportBackup, importBackup, resetAll, updateSettings, useData } from '../lib/store';
import { Icon } from './Icon';

export function Settings() {
  const data = useData();
  const st = data.settings;
  const [msg, setMsg] = useState('');

  function download() {
    const blob = new Blob([exportBackup()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ham-study-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg('Backup saved to your downloads.');
  }

  async function upload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const added = importBackup(await file.text());
      setMsg(`Backup merged: ${added} answers added.`);
    } catch (err) {
      setMsg(`Could not read that file: ${(err as Error).message}`);
    }
  }

  return (
    <div class="screen">
      <div class="topbar"><a class="iconbtn" href="#/" aria-label="Home"><Icon name="back" /></a><h1>Settings</h1></div>

      <div class="card stack">
        <h2>Your exam</h2>
        <label class="field">Exam date
          <input type="date" value={st.examDate ?? ''} onChange={(e) => updateSettings({ examDate: (e.target as HTMLInputElement).value || null })} />
        </label>
        <span class="small muted">The app paces new questions so you see the whole pool about 2½ weeks before this date.</span>
      </div>

      <div class="card stack">
        <h2>Study</h2>
        <label class="field">Questions per daily drill
          <select value={st.dailyGoal} onChange={(e) => updateSettings({ dailyGoal: Number((e.target as HTMLSelectElement).value) })}>
            <option value="15">15 (about 7 minutes)</option>
            <option value="25">25 (about 12 minutes)</option>
            <option value="35">35 (about 17 minutes)</option>
          </select>
        </label>
        <label class="field">Hint appears after
          <select value={st.hintDelaySec} onChange={(e) => updateSettings({ hintDelaySec: Number((e.target as HTMLSelectElement).value) })}>
            <option value="15">15 seconds</option>
            <option value="30">30 seconds</option>
            <option value="45">45 seconds</option>
            <option value="60">60 seconds</option>
          </select>
        </label>
        <button class={`toggle${st.sound ? ' on' : ''}`} style={{ alignSelf: 'flex-start' }} aria-pressed={st.sound} onClick={() => updateSettings({ sound: !st.sound })}>
          Sounds for right and wrong answers: {st.sound ? 'on' : 'off'}
        </button>
      </div>

      <div class="card stack">
        <h2>Backup</h2>
        <span class="small" style={{ color: 'var(--text-2)' }}>{data.events.length} answers saved on this device. Home Assistant sync is coming in the next update; until then, save a backup now and then.</span>
        <div class="grid2">
          <button class="btn secondary" onClick={download}>Save backup</button>
          <label class="btn secondary" style={{ cursor: 'pointer' }}>Load backup<input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={upload} /></label>
        </div>
        {msg && <span class="small" style={{ color: 'var(--accent)' }}>{msg}</span>}
      </div>

      <div class="card stack">
        <h2>About the questions</h2>
        <span class="small" style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>
          Official {POOL.pool.name} (Element {POOL.pool.element}) pool, {POOL.questions.length} questions, effective {POOL.pool.effective} to {POOL.pool.expires},
          revision of {POOL.pool.revision}. Released into the public domain by the NCVEC Question Pool Committee.{' '}
          <a href={POOL.pool.source} target="_blank" rel="noopener">Source</a>
        </span>
      </div>

      <button class="btn ghost" style={{ borderColor: 'var(--bad)', color: 'var(--bad)' }}
        onClick={() => { if (confirm('Erase all progress on this device? Save a backup first if unsure.')) resetAll(); }}>
        Erase progress on this device
      </button>
    </div>
  );
}
