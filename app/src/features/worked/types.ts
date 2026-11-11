export type Family = 'ohm' | 'power' | 'prefix' | 'decibel' | 'wave' | 'antenna' | 'ratio';
export type Letter = 'E' | 'I' | 'R' | 'P';
export type Rung = 'giga' | 'mega' | 'kilo' | 'base' | 'milli' | 'micro' | 'nano' | 'pico';

export interface Given { sym: string; name: string; value: number; unit: string }
export interface Step { say: string; expr: string }

export interface PrefixPic { from: Rung; to: Rung; fromUnit: string; toUnit: string; value: string }
export interface DecibelPic { from: number; to: number; hops: { factor: number; db: number }[] }
export interface WavePic { mhz: number; meters: number }
export interface AntennaPic { meters: number; fraction: number; inches: number }
export interface RatioPic { kind: 'battery' | 'duty'; from?: number; to?: number }

/** One worked solution. `answer` is the official keyed choice text. */
export interface Worked {
  id: string;
  family: Family;
  want?: Letter; // triangle families: the letter to cover
  given: Given[];
  pic?: PrefixPic | DecibelPic | WavePic | AntennaPic | RatioPic;
  steps: Step[];
  result: number | null; // numeric result, null for formula-only questions
  answer: string;
}
