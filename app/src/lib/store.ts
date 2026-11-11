/**
 * Local storage of the answer log and settings. The log is append-only and every
 * event has a unique id, so merging a backup (or a copy from another device)
 * is a simple union and never loses answers.
 */
import { useEffect, useState } from 'preact/hooks';
import type { AnswerEvent } from './engine';

export interface Settings {
  examDate: string | null; // YYYY-MM-DD
  dailyGoal: number; // questions per daily drill
  hintDelaySec: number;
  sound: boolean;
  lastBackup: number | null; // epoch ms of the last saved backup file
}

/** A finished activity, lab, mission or clip. */
export interface ActivityEvent {
  id: string; // unique event id
  t: number; // epoch ms
  area: string; // feature area, e.g. 'dragdrop'
  item: string; // FeatureDef id
  score?: number;
  total?: number;
}

export interface Data {
  version: 1;
  poolId: string;
  settings: Settings;
  events: AnswerEvent[];
  activities?: ActivityEvent[];
}

const KEY = 'hamstudy:v1';

export const DEFAULT_SETTINGS: Settings = {
  examDate: null,
  dailyGoal: 25,
  hintDelaySec: 30,
  sound: true,
  lastBackup: null,
};

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as Data;
      return { ...d, settings: { ...DEFAULT_SETTINGS, ...d.settings } };
    }
  } catch {
    // Storage unavailable or corrupt: start fresh in memory.
  }
  return { version: 1, poolId: 'technician-2026', settings: { ...DEFAULT_SETTINGS }, events: [] };
}

let data: Data = load();
const listeners = new Set<() => void>();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Quota or private mode: the in-memory copy still works for this visit.
  }
  listeners.forEach((fn) => fn());
}

export function getData(): Data {
  return data;
}

export function addEvent(ev: AnswerEvent) {
  data = { ...data, events: [...data.events, ev] };
  save();
}

export function addActivity(ev: ActivityEvent) {
  data = { ...data, activities: [...(data.activities ?? []), ev] };
  save();
}

export function markGuess(eventId: string, guess: boolean) {
  data = { ...data, events: data.events.map((e) => (e.id === eventId ? { ...e, guess } : e)) };
  save();
}

export function updateSettings(patch: Partial<Settings>) {
  data = { ...data, settings: { ...data.settings, ...patch } };
  save();
}

/** Union of two logs by event id; the newer settings win. */
export function mergeData(incoming: Data, preferIncomingSettings = true) {
  const seen = new Set(data.events.map((e) => e.id));
  const extra = incoming.events.filter((e) => !seen.has(e.id));
  const seenAct = new Set((data.activities ?? []).map((a) => a.id));
  const extraAct = (incoming.activities ?? []).filter((a) => !seenAct.has(a.id));
  data = {
    ...data,
    activities: [...(data.activities ?? []), ...extraAct].sort((a, b) => a.t - b.t),
    settings: preferIncomingSettings ? { ...data.settings, ...incoming.settings } : data.settings,
    events: [...data.events, ...extra].sort((a, b) => a.t - b.t),
  };
  save();
  return extra.length;
}

export function exportBackup(): string {
  return JSON.stringify(data);
}

export function importBackup(json: string): number {
  const incoming = JSON.parse(json) as Data;
  if (incoming.version !== 1 || !Array.isArray(incoming.events)) throw new Error('Not a Ham Study backup file');
  return mergeData(incoming);
}

export function resetAll() {
  data = { version: 1, poolId: 'technician-2026', settings: { ...DEFAULT_SETTINGS }, events: [] };
  save();
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useData(): Data {
  const [, force] = useState(0);
  useEffect(() => subscribe(() => force((x) => x + 1)), []);
  return data;
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
