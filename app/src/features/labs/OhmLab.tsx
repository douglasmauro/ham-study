import { useState } from 'preact/hooks';
import { TOPICS } from '../../lib/pool';
import type { FeatureProps } from '../types';
import { Checks, Circuit, LabShell, Slider, Triangle, num, type LabCheck } from './shared';

// Ohm's law. E = I x R (T5D02), I = E / R (T5D01), R = E / I (T5D03).
// E is voltage in volts, I is current in amperes (T5A01), R is resistance in ohms.
export function OhmLab({ onDone }: FeatureProps) {
  const [e, setE] = useState(12);
  const [r, setR] = useState(6);
  const i = e / r;
  const color = TOPICS.T5.color;
  const now = `Now ${num(e)} V across ${num(r)} Ω gives ${num(i)} A.`;

  const checks: LabCheck[] = [
    { // T5D06: 4 amperes from a 12-volt source is 3 ohms
      prompt: 'Keep the battery at 12 volts. Change the resistance until exactly 4 amperes flow.',
      test: () => e === 12 && r === 3
        ? { ok: true, say: 'R = E ÷ I = 12 ÷ 4 = 3 ohms. Less resistance let more current flow.' }
        : { ok: false, say: e !== 12 ? `The battery is at ${num(e)} V. Set it to 12 V first.` : `${now} ${i < 4 ? 'Lower the resistance to let more current through.' : 'Raise the resistance to hold current back.'}` },
    },
    { // T5D12: 2 amperes through 10 ohms is 20 volts
      prompt: 'Set the resistor to 10 ohms. Then make the current exactly 2 amperes.',
      test: () => r === 10 && e === 20
        ? { ok: true, say: 'E = I × R = 2 × 10 = 20 volts. More voltage pushes more current through the same resistor.' }
        : { ok: false, say: r !== 10 ? `The resistor is ${num(r)} Ω. Set it to 10 Ω first.` : `${now} ${i < 2 ? 'Raise the voltage to push more current.' : 'Lower the voltage.'}` },
    },
    { // T5D05: 12 volts and 1.5 amperes is 8 ohms
      prompt: 'With 12 volts, make the current exactly 1.5 amperes.',
      test: () => e === 12 && r === 8
        ? { ok: true, say: 'R = E ÷ I = 12 ÷ 1.5 = 8 ohms.' }
        : { ok: false, say: e !== 12 ? `The battery is at ${num(e)} V. Set it to 12 V first.` : `${now} ${i < 1.5 ? 'Lower the resistance.' : 'Raise the resistance.'}` },
    },
  ];

  return (
    <LabShell sub="T5" title="Ohm's law circuit">
      <div class="card lab-card">
        <Circuit amps={i} color={color} batteryText={`${num(e)} V`} loadText={`Resistor ${num(r)} Ω`} currentText={`Current ${num(i)} A`}
          label={`A ${num(e)} volt battery and a ${num(r)} ohm resistor in one loop. ${num(i)} amperes flow.`} />
        <span class="small muted">The dots are the current. More amperes, faster dots.</span>
        <Slider id="lab-ohm-e" label="Voltage (E)" value={e} min={1} max={24} text={`${num(e)} V`} minText="1 V" maxText="24 V" onChange={setE} />
        <Slider id="lab-ohm-r" label="Resistance (R)" value={r} min={1} max={24} text={`${num(r)} Ω`} minText="1 Ω" maxText="24 Ω" onChange={setR} />
      </div>

      <div class="card lab-card lab-rule">
        <h2>The rule</h2>
        <p>Voltage equals current times resistance.</p>
        <div class="lab-formula">E = I × R</div>
        <div class="lab-result" style={{ color }}>{num(e)} V = {num(i)} A × {num(r)} Ω</div>
        <p class="lab-note">More voltage, more current. More resistance, less current.</p>
      </div>

      <div class="card lab-card">
        <h2>Ohm's law triangle</h2>
        <Triangle top="E" left="I" right="R" color={color} values={{ E: e, I: i, R: r }}
          units={{ E: 'V', I: 'A', R: 'Ω' }} names={{ E: 'voltage', I: 'current', R: 'resistance' }} />
      </div>

      <Checks checks={checks} onDone={onDone} />
    </LabShell>
  );
}
