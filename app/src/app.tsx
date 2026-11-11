import { useEffect, useState } from 'preact/hooks';
import { Home } from './ui/Home';
import { MapView } from './ui/MapView';
import { Session } from './ui/Session';
import { Settings } from './ui/Settings';

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
  const [page, arg] = parts;
  switch (page) {
    case 'drill':
      return <Session key={key} kind="drill" />;
    case 'exam':
      return <Session key={key} kind="exam" />;
    case 'review':
      return <Session key={key} kind="review" />;
    case 'topic':
      return <Session key={key} kind="topic" target={arg} />;
    case 'group':
      return <Session key={key} kind="group" target={arg} />;
    case 'map':
      return <MapView />;
    case 'settings':
      return <Settings />;
    default:
      return <Home />;
  }
}
