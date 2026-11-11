import type { JSX } from 'preact';

/**
 * Schematic symbols, drawn to match the official exam figures T-1, T-2 and T-3.
 * Each one fits a 60 x 40 box with its leads on the line y = 20 (the antenna
 * has one lead, at the bottom). They take their color from `stroke` on a parent.
 */
const ZIGZAG = 'M0 20H9l3-9 6 18 6-18 6 18 6-18 6 18 3-9H60';
const COIL = 'M0 20H12a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0H60';
const WIPER = 'M30 39V27M26 32l4-6 4 6'; // arrow that touches the part from below

export const SYM = {
  /** T-1 component 1 */
  resistor: <path d={ZIGZAG} />,
  /** T-1 component 2: the arrow on the emitter points out */
  transistor: (
    <g>
      <circle cx="31" cy="20" r="17" />
      <path d="M0 20H23M23 15l15-9M23 25l15 9" />
      <path d="M23 9V31" stroke-width="4.5" />
      <path class="dd-fill" d="M38 34l-7.5-1 3.5-6z" />
    </g>
  ),
  /** T-1 component 3 */
  lamp: <path d="M0 20H26V13a4 4 0 0 1 8 0V20H60M21 20V11a9 9 0 0 1 18 0V20" />,
  /** T-1 component 4: long and short plates */
  battery: <path d="M0 20H21M21 6V34M27 13V27M33 6V34M39 13V27M39 20H60" />,
  /** T-2 component 2 */
  fuse: <path d="M0 20H60M17 14H43V26H17Z" />,
  /** T-2 component 3: single-pole single-throw, drawn open */
  switchOpen: (
    <g>
      <path d="M0 20H12M48 20H60M19 18L43 7" />
      <circle cx="16" cy="20" r="4" />
      <circle cx="44" cy="20" r="4" />
    </g>
  ),
  /** the same switch, closed */
  switchClosed: (
    <g>
      <path d="M0 20H12M48 20H60M20 19L40 19" />
      <circle cx="16" cy="20" r="4" />
      <circle cx="44" cy="20" r="4" />
    </g>
  ),
  /** T-2 component 4: two windings and a core */
  transformer: (
    <g>
      <path d="M8 4H21a5.33 5.33 0 0 1 0 10.67a5.33 5.33 0 0 1 0 10.67a5.33 5.33 0 0 1 0 10.67H8" />
      <path d="M52 4H39a5.33 5.33 0 0 0 0 10.67a5.33 5.33 0 0 0 0 10.67a5.33 5.33 0 0 0 0 10.67H52" />
      <path d="M28.5 4V36M31.5 4V36" stroke-width="1.8" />
    </g>
  ),
  /** T-2 component 5 */
  diode: (
    <g>
      <path d="M0 20H60M39 10V30" />
      <path class="dd-fill" d="M23 10L39 20L23 30Z" />
    </g>
  ),
  /** T-2 component 6: one straight plate, one curved */
  capacitor: <path d="M0 20H25M25 7V33M38 7Q30 20 38 33M34 20H60" />,
  /** T-2 component 8: a diode with arrows of light leaving it */
  led: (
    <g>
      <path d="M0 20H60M39 10V30" />
      <path class="dd-fill" d="M23 10L39 20L23 30Z" />
      <path d="M38 6l7-5M45 1h-4M45 1v4M47 9l7-5M54 4h-4M54 4v4" stroke-width="1.8" />
    </g>
  ),
  /** T-2 component 9: a resistor with a moving contact */
  variableResistor: <path d={`${ZIGZAG}${WIPER}`} />,
  /** a plain coil */
  inductor: <path d={COIL} />,
  /** T-3 component 3: a coil with a moving contact */
  variableInductor: <path d={`${COIL}M30 39V22M26 28l4-6 4 6`} />,
  /** T-3 component 4 */
  antenna: <path d="M30 40V4M15 4H45L30 22Z" />,
  /** a meter that reads volts */
  voltmeter: (
    <g>
      <path d="M0 20H17M43 20H60" />
      <circle cx="30" cy="20" r="13" />
      <text x="30" y="25.5" text-anchor="middle">V</text>
    </g>
  ),
  /** a solid bar of insulating material */
  rod: <path d="M12 14H48a6 6 0 0 1 0 12H12a6 6 0 0 1 0-12Z" />,
} satisfies Record<string, JSX.Element>;

/** Chassis ground as drawn in the figures: a bar with three slanted strokes. Its top is at (x, y). */
export function Ground({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y}v8M${x - 9} ${y + 8}h18M${x - 7} ${y + 8}l-4 8M${x} ${y + 8}l-4 8M${x + 7} ${y + 8}l-4 8`} />;
}

/** Draws a symbol at (x, y) in a picture, optionally turned and scaled about its center. */
export function At({ x, y, turn = 0, scale = 1, children }: { x: number; y: number; turn?: number; scale?: number; children: JSX.Element }) {
  return <g transform={`translate(${x} ${y}) rotate(${turn} ${30 * scale} ${20 * scale}) scale(${scale})`}>{children}</g>;
}
