import { useEffect, useState } from 'preact/hooks';

const BUILD = __BUILD__;

function when(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

/**
 * The build this device is running, and whether a newer one is live. Checks version.json
 * on the server (bypassing every cache) when the home screen opens and when asked.
 */
export function Version() {
  const [latest, setLatest] = useState<typeof BUILD | null>(null);
  const [state, setState] = useState<'idle' | 'checking' | 'offline'>('idle');

  async function check() {
    setState('checking');
    try {
      const res = await fetch(`./version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setLatest(await res.json());
      setState('idle');
    } catch {
      setState('offline');
    }
  }

  useEffect(() => { check(); }, []);

  const newer = latest !== null && latest.time !== BUILD.time && latest.time > BUILD.time;

  async function update() {
    // Drop the offline copy so the reload fetches the new build, then reload.
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      const reg = await navigator.serviceWorker?.getRegistration();
      await reg?.update();
    } catch {
      // Reloading is still worth trying.
    }
    location.reload();
  }

  return (
    <div class="stack" style={{ gap: '8px', alignItems: 'center', textAlign: 'center', padding: '8px 0 4px' }}>
      <span class="small muted">
        Version {BUILD.number} · built {when(BUILD.time)}
      </span>
      {newer ? (
        <button class="btn primary" onClick={update}>Update to version {latest!.number}</button>
      ) : (
        <span class="small" style={{ color: state === 'offline' ? 'var(--muted)' : latest ? 'var(--good)' : 'var(--muted)' }}>
          {state === 'checking' ? 'Checking for a newer version…'
            : state === 'offline' ? 'Offline: could not check for a newer version.'
            : latest ? '✓ You have the latest version.' : ''}
        </span>
      )}
      {!newer && state !== 'checking' && (
        <button class="toggle" onClick={check}>Check for update</button>
      )}
      <a class="small" href="#/whats-new" style={{ fontWeight: 600, minHeight: '32px', display: 'inline-flex', alignItems: 'center' }}>What's new in each version</a>
    </div>
  );
}
