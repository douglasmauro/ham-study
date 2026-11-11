import type { ComponentChildren, VNode } from 'preact';
import type { SpotSet } from './Spot';

/* Spot-the-mistake drawings, all on a 340 x 260 canvas. Each scene has exactly one wrong part. */

function Sc({ children }: { children: ComponentChildren }): VNode {
  return <svg class="cd-art" viewBox="0 0 340 260" aria-hidden="true">{children}</svg>;
}
function Box({ x, y, w, h, l1, l2, k }: { x: number; y: number; w: number; h: number; l1: string; l2?: string; k?: boolean }) {
  return (
    <g>
      <rect class={`${k ? 'cd-k' : 'cd-t'} cd-fr`} x={x} y={y} width={w} height={h} rx="8" />
      <text x={x + w / 2} y={y + h / 2 + (l2 ? -3 : 5)} text-anchor="middle">{l1}</text>
      {l2 && <text class="cd-tm" x={x + w / 2} y={y + h / 2 + 14} text-anchor="middle">{l2}</text>}
    </g>
  );
}
const Ant = ({ x, y }: { x: number; y: number }) => <path class="cd-t" d={`M${x - 18} ${y}H${x + 18}L${x} ${y + 30}ZM${x} ${y}V${y + 30}`} />;

/* ---------- T4: station setup ---------- */
// T4A01 13.8 V at 12 A suits a 50 W mobile FM rig; T4A03 short heavy DC wires; T4A05 RF power meter goes in
// the feed line between transmitter and antenna; T4A08 flat copper strap for RF bonding.
const homeStation = () => (
  <Sc>
    <Ant x={236} y={10} />
    <path class="cd-a" d="M236 40V140" />
    <text class="cd-ta" x="246" y="94">coax</text>
    <Box x={8} y={140} w={88} h={64} l1="Power" l2="13.8 V 12 A" />
    <path class="cd-t cd-th" d="M96 172H112M176 172H190" />
    <Box x={112} y={144} w={64} h={56} l1="RF power" l2="meter" />
    <Box x={190} y={140} w={92} h={64} l1="Transceiver" l2="50 W FM" />
    <path class="cd-w" d="M282 172H300" /><rect class="cd-w cd-fr" x="300" y="152" width="30" height="40" rx="10" /><text x="315" y="212" text-anchor="middle">mic</text>
    <path class="cd-t" stroke-width="7" d="M236 204V238" />
    <path class="cd-w" d="M190 240H282M204 248H268M220 256H252" />
    <text class="cd-tm" x="182" y="228" text-anchor="end">flat copper strap</text>
    <text class="cd-tm" x="136" y="134" text-anchor="middle">short, heavy DC wires</text>
  </Sc>
);
// T4A04 transceiver audio in/out go to computer audio out/in; T4A06 receive audio, transmit audio, keying;
// T4A07 computer "line in" goes to the transceiver speaker connector (not to push-to-talk).
const digitalStation = () => (
  <Sc>
    <text x="62" y="28" text-anchor="middle">Computer</text><text class="cd-tm" x="62" y="216" text-anchor="middle">FT8 software</text>
    <text x="278" y="28" text-anchor="middle">Transceiver</text>
    <rect class="cd-t cd-fr" x="6" y="40" width="114" height="194" rx="8" />
    <rect class="cd-t cd-fr" x="222" y="40" width="112" height="194" rx="8" />
    <text x="112" y="77" text-anchor="end">Line out</text><text x="112" y="131" text-anchor="end">Line in</text><text x="112" y="185" text-anchor="end">Keying</text>
    <text x="232" y="77">Audio in</text><text x="232" y="131">Speaker</text><text x="232" y="185">PTT</text>
    <circle class="cd-w" cx="222" cy="126" r="5" />
    <path class="cd-a" d="M120 72H222" />
    <path class="cd-a" d="M120 126H176L210 176H222" />
    <path class="cd-a" d="M120 180H176L210 184H222" />
    <circle class="cd-fa" cx="120" cy="72" r="4" /><circle class="cd-fa" cx="120" cy="126" r="4" /><circle class="cd-fa" cx="120" cy="180" r="4" />
    <circle class="cd-fa" cx="222" cy="72" r="4" /><circle class="cd-fa" cx="222" cy="180" r="5" />
  </Sc>
);
export const SPOT_STATION: SpotSet = {
  sub: 'T4',
  title: 'What is wrong with this station?',
  scenes: [
    {
      name: 'A home FM station',
      alt: 'A power supply feeds a transceiver through an RF power meter. Coax runs from the transceiver straight to the antenna. A microphone and a copper ground strap are attached.',
      art: homeStation,
      parts: [
        { label: 'Power supply', x: 4, y: 136, w: 96, h: 72, why: '13.8 volts at 12 amperes is a suitable supply for a typical 50-watt mobile FM transceiver.' },
        { label: 'RF power meter', x: 108, y: 140, w: 72, h: 64, wrong: true, why: 'An RF power meter goes in the feed line, between the transmitter and the antenna. Here it sits in the DC power wires.' },
        { label: 'Coax to the antenna', x: 208, y: 44, w: 76, h: 72, n: 'tr', why: 'Coax from the transceiver to the antenna is the normal feed line. This is where the RF power meter belongs.' },
        { label: 'Ground strap', x: 186, y: 208, w: 100, h: 50, why: 'Flat copper strap is the preferred conductor for bonding at RF.' },
        { label: 'Microphone', x: 290, y: 144, w: 48, h: 56, why: 'The microphone plugs into the transceiver. Nothing wrong there.' },
      ],
    },
    {
      name: 'A digital (FT8) station',
      alt: 'A computer and a transceiver joined by three wires: line out to audio in, line in to push-to-talk, and keying to push-to-talk. The speaker connector has nothing plugged in.',
      art: digitalStation,
      parts: [
        { label: 'Line out to audio in', x: 138, y: 48, w: 62, h: 46, why: 'The computer\'s audio output feeds the transceiver\'s audio input. That is the transmit audio.' },
        { label: 'Line in to PTT', x: 124, y: 102, w: 62, h: 46, wrong: true, why: 'The computer "line in" must listen to the radio, so it connects to the transceiver speaker connector, not to push-to-talk.' },
        { label: 'Keying to PTT', x: 124, y: 158, w: 62, h: 46, why: 'A keying line to PTT is how the computer switches the transceiver to transmit.' },
        { label: 'Computer with FT8 software', x: 10, y: 196, w: 104, h: 46, n: 'bl', why: 'A computer running FT8 software is exactly what the transceiver audio connects to.' },
      ],
    },
  ],
};

/* ---------- T0: antenna and power safety ---------- */
// T0B06 an antenna must not be able to fall within 10 feet of power wires; T0B04 stay clear of overhead wires;
// T0B02 harness, tie-off and training; T0B03 never climb without a helper; T0B08 a ground rod per leg, bonded.
const towerYard = () => (
  <Sc>
    <path class="cd-w" d="M0 214H340" />
    <path class="cd-t" d="M96 214L108 46H124L136 214M100 170L130 130M104 130L128 90M106 90L126 56M132 170L102 130M128 130L106 90" />
    <path class="cd-t" d="M72 40H170M82 26V54M106 28V52M132 30V50M158 32V48" />
    <circle class="cd-t" cx="150" cy="112" r="7" /><path class="cd-t" d="M150 119V144M150 126L132 120M150 128L134 136M150 144L138 162M150 144L134 152" />
    <path class="cd-a" d="M146 132Q134 138 128 128" /><text class="cd-tm" x="162" y="134">harness</text>
    <circle class="cd-t" cx="36" cy="160" r="7" /><path class="cd-t" d="M36 167V192M36 174L22 166M36 174L50 166M36 192L26 214M36 192L46 214" />
    <text class="cd-tm" x="36" y="144" text-anchor="middle">helper</text>
    <path class="cd-w" d="M98 214V246M116 214V246M134 214V246M98 240H134" />
    <text class="cd-tm" x="146" y="244">rods bonded</text>
    <path class="cd-t cd-th" d="M254 214V40" /><path class="cd-t" d="M226 54H282" />
    <path class="cd-t" d="M228 54Q290 80 340 62M280 54Q312 70 340 50M228 54Q206 70 186 58" />
    <text class="cd-tm" x="300" y="30" text-anchor="middle">power line</text>
  </Sc>
);
// T0A03 black = hot; T0A06 three-wire cords and a common safety ground; T0A07 lightning arrester on a grounded
// panel near where feed lines enter the building; T0A08 fuse in series with the hot conductor only;
// T0A09 bond all ground rods together.
const shackPower = () => (
  <Sc>
    <path class="cd-t cd-th" d="M160 6V230" /><path class="cd-w" d="M0 230H340" />
    <text class="cd-tm" x="76" y="20" text-anchor="middle">outside</text><text class="cd-tm" x="250" y="20" text-anchor="middle">inside</text>
    <path class="cd-a" d="M10 34C60 34 90 60 126 76H160" /><text class="cd-ta" x="16" y="56">coax in</text>
    <rect class="cd-t cd-fr" x="124" y="60" width="30" height="34" rx="4" /><path class="cd-t" d="M139 94V230" />
    <text class="cd-tm" x="116" y="112" text-anchor="end">arrester on a</text><text class="cd-tm" x="116" y="128" text-anchor="end">grounded panel</text>
    <path class="cd-w" d="M40 230V256M90 230V256M139 230V256M40 244H139" /><text class="cd-tm" x="64" y="204" text-anchor="middle">ground rods</text>
    <rect class="cd-t cd-fr" x="172" y="40" width="26" height="150" rx="6" /><text class="cd-tm" x="185" y="208" text-anchor="middle">120 V</text>
    <rect class="cd-t cd-fr" x="296" y="40" width="40" height="150" rx="6" />
    <text x="316" y="110" text-anchor="middle" transform="rotate(90 316 110)">Power supply</text>
    <path class="cd-t" d="M198 64H296" /><text x="247" y="56" text-anchor="middle">black: hot</text>
    <path class="cd-t" d="M198 116H228M266 116H296" /><rect class="cd-t" x="228" y="107" width="38" height="18" rx="5" /><path class="cd-t cd-thin" d="M234 116H260" />
    <text x="247" y="100" text-anchor="middle">white: neutral</text><text x="247" y="140" text-anchor="middle">fuse</text>
    <path class="cd-t" d="M198 168H296" /><text x="247" y="160" text-anchor="middle">green: ground</text>
  </Sc>
);
export const SPOT_SAFETY: SpotSet = {
  sub: 'T0',
  title: 'Find the safety mistake',
  scenes: [
    {
      name: 'Putting up a tower',
      alt: 'A tower with a beam antenna. A climber in a harness is on the tower and a helper stands on the ground. Each tower leg has a ground rod. A power line runs right beside the tower.',
      art: towerYard,
      parts: [
        { label: 'Climber in a harness', x: 126, y: 98, w: 86, h: 68, n: 'br', why: 'An approved climbing harness, tied off to the tower at all times, is required when climbing.' },
        { label: 'Helper on the ground', x: 8, y: 132, w: 58, h: 84, n: 'bl', why: 'It is never safe to climb a tower without a helper or observer. The helper should be there.' },
        { label: 'Ground rods', x: 84, y: 214, w: 116, h: 46, n: 'bl', why: 'A proper tower ground uses a separate eight-foot ground rod for each leg, bonded to the tower and to each other.' },
        { label: 'Power line', x: 190, y: 38, w: 146, h: 52, n: 'bl', wrong: true, why: 'The tower is far too close. If the antenna falls, no part of it may come within 10 feet of the power wires.' },
      ],
    },
    {
      name: 'Power and lightning protection',
      alt: 'A wall divides outside from inside. Outside, coax enters through a lightning arrester on a grounded panel and three ground rods are bonded together. Inside, a three-wire cable feeds a power supply: black hot, white neutral with a fuse in it, green ground.',
      art: shackPower,
      parts: [
        { label: 'Lightning arrester', x: 112, y: 52, w: 46, h: 48, why: 'A lightning arrester belongs on a grounded panel near where the feed lines enter the building.' },
        { label: 'Bonded ground rods', x: 28, y: 214, w: 124, h: 46, n: 'bl', why: 'All external ground rods should be bonded together with heavy wire or conductive strap.' },
        { label: 'Black hot wire', x: 196, y: 36, w: 100, h: 46, n: 'br', why: 'In a US three-wire 120 V cable, black insulation marks the hot wire. That is correct.' },
        { label: 'Fuse in the white wire', x: 196, y: 86, w: 100, h: 56, n: 'br', wrong: true, why: 'A fuse or circuit breaker goes in series with the hot conductor only. Here it is in the neutral.' },
        { label: 'Green ground wire', x: 196, y: 146, w: 100, h: 46, n: 'br', why: 'Three-wire cords with a safety ground help guard against electrical shock.' },
      ],
    },
  ],
};

/* ---------- T1: Technician privileges on the dial ---------- */
function Dial({ x, y, freq, mode, extra }: { x: number; y: number; freq: string; mode: string; extra?: string }) {
  return (
    <g>
      <rect class="cd-t cd-fr" x={x} y={y} width="154" height="104" rx="10" />
      <rect class="cd-w cd-thin" x={x + 10} y={y + 12} width="134" height="44" rx="6" />
      <text class="cd-big" x={x + 77} y={y + 42} text-anchor="middle">{freq}</text>
      <text class="cd-tk" x={x + 12} y={y + 78}>{mode}</text>
      <text class="cd-tm" x={x + 142} y={y + 78} text-anchor="end">MHz</text>
      {extra && <text x={x + 12} y={y + 96}>{extra}</text>}
    </g>
  );
}
const POS = [[10, 16], [176, 16], [10, 140], [176, 140]];
const dials = (rows: [string, string, string?][]) => () => (
  <Sc>{rows.map((r, i) => <Dial x={POS[i][0]} y={POS[i][1]} freq={r[0]} mode={r[1]} extra={r[2]} />)}</Sc>
);
const dialPart = (i: number) => ({ x: POS[i][0] - 2, y: POS[i][1] - 2, w: 158, h: 108 });
export const SPOT_DIAL: SpotSet = {
  sub: 'T1',
  title: 'Which dial breaks the rules?',
  scenes: [
    {
      // T1B01 28.300-28.500 phone; T1B03 52.525 is 6 m; T1B04 146.52 is 2 m; T1B07 50.0-50.1 and 144.0-144.1 CW only;
      // T2A02 146.520 FM simplex calling frequency
      name: 'Four radios, all run by a Technician',
      alt: 'Four radio displays: 146.520 megahertz FM voice, 50.050 megahertz SSB voice, 28.400 megahertz SSB voice and 52.525 megahertz FM voice.',
      art: dials([['146.520', 'FM voice'], ['50.050', 'SSB voice'], ['28.400', 'SSB voice'], ['52.525', 'FM voice']]),
      parts: [
        { label: '146.520 FM voice', ...dialPart(0), why: '146.52 MHz is in the 2-meter band, and 146.520 is the national FM simplex calling frequency.' },
        { label: '50.050 SSB voice', ...dialPart(1), wrong: true, why: '50.0 to 50.1 MHz is limited to CW only. Voice is not allowed there.' },
        { label: '28.400 SSB voice', ...dialPart(2), why: 'Technicians may use phone from 28.300 to 28.500 MHz on 10 meters.' },
        { label: '52.525 FM voice', ...dialPart(3), why: '52.525 MHz is in the 6-meter band, well above the CW-only segment at 50.0 to 50.1 MHz.' },
      ],
    },
    {
      // T1B11 200 W PEP max for Technicians on HF; T1B12 1500 W PEP above 30 MHz; T1B07 144.0-144.1 CW only
      name: 'Same Technician, now check the power',
      alt: 'Four radio displays with power: 28.350 megahertz SSB at 100 watts, 146.520 megahertz FM at 50 watts, 144.050 megahertz CW at 100 watts and 28.400 megahertz SSB at 1500 watts.',
      art: dials([['28.350', 'SSB voice', '100 W'], ['146.520', 'FM voice', '50 W'], ['144.050', 'CW', '100 W'], ['28.400', 'SSB voice', '1500 W']]),
      parts: [
        { label: '28.350 SSB, 100 W', ...dialPart(0), why: 'Inside the 28.300 to 28.500 MHz phone segment and under the 200-watt Technician HF limit.' },
        { label: '146.520 FM, 50 W', ...dialPart(1), why: 'Above 30 MHz a Technician may run up to 1500 watts PEP, so 50 watts is fine.' },
        { label: '144.050 CW, 100 W', ...dialPart(2), why: '144.0 to 144.1 MHz is CW only, and this station is using CW. The power is well under 1500 watts.' },
        { label: '28.400 SSB, 1500 W', ...dialPart(3), wrong: true, why: 'On HF a Technician is limited to 200 watts PEP. 1500 watts is only allowed above 30 MHz.' },
      ],
    },
  ],
};

/* ---------- T7: test bench ---------- */
const ZV = 'l-10 5l20 10l-20 10l20 10l-20 10l20 10l-10 5'; // 60 tall vertical resistor
const Meter = ({ x, y, l }: { x: number; y: number; l: string }) => (
  <g><circle class="cd-k cd-fr" cx={x} cy={y} r="20" /><text class="cd-tk" x={x} y={y + 6} text-anchor="middle" style={{ fontSize: '18px' }}>{l}</text></g>
);
// T7D02 voltmeter in parallel; T7D03 current is measured in series; T0A04 a fuse removes power on overload
const meterBench = () => (
  <Sc>
    <path class="cd-w" d="M40 150V112H116M196 112H300V134M300 194V226H192M142 226H40V170" />
    <path class="cd-w cd-th" d="M24 150H56M32 170H48" /><text class="cd-tm" x="66" y="166">12 V</text>
    <path class="cd-t" d="M116 112l8 -14l16 28l16 -28l16 28l16 -28l8 14" /><text class="cd-tm" x="156" y="148" text-anchor="middle">R1</text>
    <path class="cd-t" d={`M300 134${ZV}`} /><text class="cd-tm" x="322" y="168">R2</text>
    <path class="cd-k" d="M108 112V50H136M176 50H204V112" />
    <circle class="cd-fk" cx="108" cy="112" r="4" /><circle class="cd-fk" cx="204" cy="112" r="4" />
    <Meter x={156} y={50} l="A" />
    <path class="cd-k" d="M300 124H244V144M244 184V204H300" />
    <circle class="cd-fk" cx="300" cy="124" r="4" /><circle class="cd-fk" cx="300" cy="204" r="4" />
    <Meter x={244} y={164} l="V" />
    <rect class="cd-t cd-fr" x="142" y="216" width="50" height="20" rx="6" /><path class="cd-t cd-thin" d="M150 226H184" />
    <text class="cd-tm" x="167" y="254" text-anchor="middle">fuse</text>
  </Sc>
);
// T7C01 dummy load avoids radiating during tests; T7C03 50-ohm non-inductive resistor on a heat sink;
// T7C04 1:1 is a perfect match; T7C08 SWR is measured in the line; T7D08 never acid-core solder; T7D11 power off
// before measuring in-circuit resistance.
const txBench = () => (
  <Sc>
    <Box x={6} y={36} w={84} h={60} l1="Transmitter" />
    <path class="cd-a" d="M90 66H126M196 66H232" />
    <Box x={126} y={36} w={70} h={60} l1="SWR" l2="reads 1:1" />
    <path class="cd-t" d="M244 36V18M262 36V18M280 36V18M298 36V18M316 36V18" />
    <Box x={232} y={36} w={100} h={60} l1="Dummy load" l2="50 Ω" />
    <path class="cd-w" d="M0 124H340" />
    <circle class="cd-t cd-fr" cx="70" cy="180" r="32" /><circle class="cd-t" cx="70" cy="180" r="10" /><path class="cd-t" d="M100 192Q122 198 126 222" />
    <text x="72" y="240" text-anchor="middle">acid-core solder</text>
    <rect class="cd-t cd-fr" x="186" y="144" width="62" height="84" rx="8" /><rect class="cd-w cd-thin" x="194" y="152" width="46" height="24" rx="4" />
    <text x="217" y="170" text-anchor="middle">Ω</text><circle class="cd-w" cx="217" cy="202" r="12" />
    <path class="cd-k" d="M248 196H276M248 212H276" />
    <rect class="cd-t cd-fr" x="276" y="170" width="58" height="58" rx="4" /><path class="cd-w cd-thin" d="M286 184H324M286 198H310M286 212H324" />
    <text class="cd-tm" x="262" y="250" text-anchor="middle">board, power off</text>
  </Sc>
);
export const SPOT_BENCH: SpotSet = {
  sub: 'T7',
  title: 'What is wrong on the test bench?',
  scenes: [
    {
      name: 'Two meters on a simple circuit',
      alt: 'A 12 volt battery, resistor R1, resistor R2 and a fuse wired in one loop. An ammeter is connected across R1. A voltmeter is connected across R2.',
      art: meterBench,
      parts: [
        { label: 'Ammeter across R1', x: 100, y: 24, w: 112, h: 56, n: 'tr', wrong: true, why: 'To measure current, a meter is connected in series with the component, so the current flows through it. This one is wired in parallel.' },
        { label: 'Voltmeter across R2', x: 214, y: 136, w: 60, h: 56, why: 'A voltmeter is connected in parallel with the component to measure the voltage applied to it.' },
        { label: 'Fuse in the loop', x: 136, y: 206, w: 62, h: 50, why: 'A fuse removes power in case of an overload. In series with the loop is where it can do that.' },
        { label: 'Battery', x: 12, y: 132, w: 84, h: 56, why: 'The battery is the source for this loop. Nothing wrong with it.' },
      ],
    },
    {
      name: 'Testing a transmitter',
      alt: 'A transmitter connected through an SWR meter reading 1 to 1 into a 50 ohm dummy load with a heat sink. On the bench are a roll of acid-core solder and an ohmmeter measuring a board with the power off.',
      art: txBench,
      parts: [
        { label: 'Dummy load', x: 228, y: 14, w: 108, h: 86, why: 'A dummy load, a 50-ohm non-inductive resistor on a heat sink, lets you test without sending signals over the air.' },
        { label: 'SWR meter', x: 122, y: 32, w: 78, h: 68, why: 'SWR is measured in the line from the transmitter. 1:1 means a perfect impedance match.' },
        { label: 'Solder', x: 8, y: 146, w: 124, h: 108, wrong: true, why: 'Acid-core solder should not be used for radio and electronic work.' },
        { label: 'Ohmmeter on the board', x: 182, y: 140, w: 154, h: 114, why: 'Before measuring in-circuit resistance, make sure the circuit is not powered. Here the power is off.' },
      ],
    },
  ],
};
