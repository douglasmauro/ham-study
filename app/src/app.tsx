import { useEffect, useState } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { Exams } from './ui/Exams';
import { Glossary } from './ui/Glossary';
import { GlossaryGallery } from './ui/GlossaryArt';
import { Home } from './ui/Home';
import { FeatureHost, Hub } from './ui/Hub';
import { MapView } from './ui/MapView';
import { Session } from './ui/Session';
import { Settings } from './ui/Settings';

const ExamSim = lazy(() => import('./features/examsim'));
const Notebook = lazy(() => import('./features/notebook'));
const WeeklyReport = lazy(() => import('./features/report'));
const loading = <div class="screen"><div class="card muted">Loading…</div></div>;

function useRoute() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  // "#/topic/T3?123" -> ["topic", "T3"], plus the raw hash so new sessions remount.
  const [path] = hash.replace(/^#\/?/, '').split('?');
  return { parts: path.split('/').filter(Boolean), key: hash };
}

export function App() {
  const { parts, key } = useRoute();
  const [page, arg, arg2] = parts;
  switch (page) {
    case 'drill':
      return <Session key={key} kind="drill" />;
    case 'exam':
      return <Session key={key} kind="exam" />;
    case 'notebook-drill':
      return <Session key={key} kind="notebook" />;
    case 'review':
      return <Session key={key} kind="review" />;
    case 'topic':
      return <Session key={key} kind="topic" target={arg} />;
    case 'group':
      return <Session key={key} kind="group" target={arg} />;
    case 'learn':
      return <Hub area={arg} />;
    case 'do':
      return <FeatureHost key={key} area={arg} id={arg2} />;
    case 'examsim':
      return <Suspense fallback={loading}><ExamSim key={key} /></Suspense>;
    case 'notebook':
      return <Suspense fallback={loading}><Notebook /></Suspense>;
    case 'report':
      return <Suspense fallback={loading}><WeeklyReport /></Suspense>;
    case 'glossary-art':
      return <GlossaryGallery sub={arg} />;
    case 'glossary':
      return <Glossary />;
    case 'term':
      return <Session key={key} kind="term" target={arg} />;
    case 'exams':
      return <Exams />;
    case 'map':
      return <MapView />;
    case 'settings':
      return <Settings />;
    default:
      return <Home />;
  }
}
