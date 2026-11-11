import type { TermArt } from './kit';
import { ART as A } from './set-a';
import { ART as B } from './set-b';
import { ART as C } from './set-c';
import { ART as D } from './set-d';

/** Every glossary drawing, keyed by term id. Loaded on demand by the glossary. */
export const ART: Record<string, TermArt> = { ...A, ...B, ...C, ...D };
