import type { IconName } from '../lib/pool';

type Name = IconName | 'back' | 'flame' | 'bulb' | 'grid' | 'exam' | 'gear' | 'replay' | 'check' | 'x' | 'chevron' | 'home';

const PATHS: Record<Name, string> = {
  badge: 'M3 4h18v14H3z M7 9h10 M7 13h5 M16 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
  mic: 'M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1 -6 0z M5 11a7 7 0 0 0 14 0 M12 18v3 M9 21h6',
  wave: 'M14 4a6 6 0 1 0 6 8a5 5 0 0 1 -6 -8z M2 20c3 -3 6 -3 9 0s6 3 9 0',
  radio: 'M3 8h18v11H3z M8 13.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0 M14 12h4 M14 15h4 M17 8l2 -4',
  triangle: 'M12 4l9 15H3z M7 14h10 M12 14v5',
  resistor: 'M2 12h4l1.5 -3l3 6l3 -6l3 6l1.5 -3h4',
  circuit: 'M5 3h14v18H5z M8 11a4 4 0 0 1 8 0 M12 11l2 -2.5 M12 16m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0',
  signal: 'M3 4h18v14H3z M5 11c1.5 -4 3 -4 4.5 0s3 4 4.5 0s3 -4 4.5 0 M8 21h8',
  antenna: 'M12 21V8 M4 8h16 M7 5h10 M9 21h6',
  shield: 'M12 3l8 3v6c0 4.5 -3.5 8 -8 9c-4.5 -1 -8 -4.5 -8 -9V6z M9 12l2 2l4 -4',
  back: 'M15 6l-6 6l6 6',
  chevron: 'M9 6l6 6l-6 6',
  flame: 'M12 3c1 4 5 5 5 10a5 5 0 0 1 -10 0c0 -3 2 -4 2 -6c2 1 3 2 3 4c1 -2 1 -5 0 -8z',
  bulb: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 0 -4 10.5c.7 .7 1 1.5 1 2.5h6c0 -1 .3 -1.8 1 -2.5A6 6 0 0 0 12 3z',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  exam: 'M6 3h12v18H6z M9 8h6 M9 12h6 M9 16h3',
  gear: 'M12 15a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z M19 12l2 -1l-1 -3l-2 0l-1 -2l1 -2l-3 -1l-1 2h-2l-1 -2l-3 1l1 2l-1 2l-2 0l-1 3l2 1l0 2l-2 1l1 3l2 0l1 2l-1 2l3 1l1 -2h2l1 2l3 -1l-1 -2l1 -2l2 0l1 -3l-2 -1z',
  replay: 'M3 12a9 9 0 1 0 3 -6.7 M3 4v5h5',
  check: 'M5 12l5 5l9 -10',
  x: 'M6 6l12 12 M18 6l-12 12',
  home: 'M3 11l9 -7l9 7v9a1 1 0 0 1 -1 1h-5v-6H9v6H4a1 1 0 0 1 -1 -1z',
};

export function Icon({ name, size = 22, color = 'currentColor', stroke = 2 }: { name: Name; size?: number; color?: string; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={color}
      stroke-width={stroke} stroke-linecap="round" stroke-linejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}
