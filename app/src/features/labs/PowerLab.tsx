import { useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import type { FeatureProps } from '../types';
import { Checks, Circuit, LabShell, Slider, Triangle, num, type LabCheck } from './shared';

// Power in a DC circuit: P = I x E (T5C08). P in watts, I in amperes, E in volts.
const E_MAX = 24, I_MAX = 20;
export function PowerLab({ onDone }: FeatureProps) {
  // Whole steps keep the arithmetic exact: voltage in fifths of a volt, current in half amperes.
  const [e5, setE5] = useState(60);
  const [i2, setI2] = useState(4);
  const e = e5 / 5, i = i2 / 2;
  const p = Number((e * i).toFixed(4));
  const color = TOPICS.T5.color;
  const now = `Now ${num(i)} A × ${num(e)} V = ${num(p)} W.`;

  const checks: LabCheck[] = [
    { // T5C10: 12 volts and 2.5 amperes is 30 watts
      prompt: 'Set 12 volts. Then make the power exactly 30 watts.',
      test: () => e === 12 && p === 30
        ? { ok: true, say: 'P = I × E = 2.5 × 12 = 30 watts.' }
        : { ok: false, say: e !== 12 ? `The voltage is ${num(e)} V. Set it to 12 V first.` : `${now} ${p < 30 ? 'Raise the current.' : 'Lower the current.'}` },
    },
    { // T5C11: 120 watts at 12 volts needs 10 amperes
      prompt: 'Stay at 12 volts. How much current delivers 120 watts? Set it.',
      test: () => e === 12 && p === 120
        ? { ok: true, say: 'I = P ÷ E = 120 ÷ 12 = 10 amperes.' }
        : { ok: false, say: e !== 12 ? `The voltage is ${num(e)} V. Set it to 12 V first.` : `${now} ${p < 120 ? 'Raise the current.' : 'Lower the current.'}` },
    },
    { // T5C09: 13.8 volts and 10 amperes is 138 watts
      prompt: 'A radio power supply gives 13.8 volts. Set that, with 10 amperes flowing.',
      test: () => e === 13.8 && i === 10
        ? { ok: true, say: 'P = I × E = 10 × 13.8 = 138 watts.' }
        : { ok: false, say: `${now} You need 13.8 V and 10 A. Use the minus and plus buttons for fine steps.` },
    },
  ];

  return (
    <LabShell sub="T5" title="Power: watts">
      <div class="card lab-card">
        <Circuit amps={i} color={color} glow={p / (E_MAX * I_MAX)} batteryText={`${num(e)} V`} loadText={`Load uses ${num(p)} W`} currentText={`Current ${num(i)} A`}
          label={`A ${num(e)} volt source drives ${num(i)} amperes through a load. The load uses ${num(p)} watts.`} />
        <div class="lab-pbar" role="img" aria-label={`Power ${num(p)} watts out of ${E_MAX * I_MAX}`}>
          <span>Power</span>
          <div class="track"><div class="fill" style={{ width: `${(100 * p) / (E_MAX * I_MAX)}%`, background: color }} /></div>
        </div>
        <span class="small muted">The glow and the bar are the power. The dots are the current.</span>
        <Slider id="lab-pw-e" label="Voltage (E)" value={e5} min={5} max={E_MAX * 5} text={`${num(e)} V`} minText="1 V" maxText={`${E_MAX} V`} onChange={setE5} />
        <Slider id="lab-pw-i" label="Current (I)" value={i2} min={1} max={I_MAX * 2} text={`${num(i)} A`} minText="0.5 A" maxText={`${I_MAX} A`} onChange={setI2} />
      </div>

      <div class="card lab-card lab-rule">
        <h2>The rule</h2>
        <p>Power equals current times voltage.</p>
        <div class="lab-formula">P = I × E</div>
        <div class="lab-result" style={{ color }}>{num(p)} W = {num(i)} A × {num(e)} V</div>
        <p class="lab-note">Power is measured in watts. Raise either the current or the voltage and the power goes up.</p>
      </div>

      <div class="card lab-card">
        <h2>Power triangle</h2>
        <Triangle top="P" left="I" right="E" color={color} values={{ P: p, I: i, E: e }}
          units={{ P: 'W', I: 'A', E: 'V' }} names={{ P: 'power', I: 'current', E: 'voltage' }} />
      </div>

      <Checks checks={checks} onDone={onDone} />
    </LabShell>
  );
}
