import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 14: Setting up your station (question group T4A, all 12 questions).
 * The station is built piece by piece: supply, power wires, the vehicle ground, meters in
 * the feed line, bonding, a battery, a computer, and two add-on boxes. Every exam fact comes
 * from a T4A question and its keyed answer; the ids are in each step's `covers`.
 * The wire slider uses made-up but consistent numbers (12 amperes, 0.02 to 0.20 ohms) to
 * show Ohm's law at work in the power cable.
 */

/* ---------- pictures ---------- */

const SUPPLIES: Record<string, { rating: string; note: string }> = {
  low: { rating: '13.8 V · 4 A', note: 'only about 55 watts in: not enough' },
  v24: { rating: '24 V · 12 A', note: 'wrong voltage for a 12 volt radio' },
  ok: { rating: '13.8 V · 12 A', note: 'about 166 watts in, 50 watts out' },
};

/** The first two boxes of the station: a supply feeding a 50 watt radio. T4A01 */
function SupplyPic({ picked, solved }: PicProps) {
  const s = picked ? SUPPLIES[picked] : null;
  const tone = !s ? 'ga-k' : solved ? 'ga-good' : 'ga-bad';
  return (
    <Art label={s
      ? `A power supply rated ${s.rating.replace('·', 'at')} feeding a 50 watt radio: ${s.note}.`
      : 'A power supply connected by two wires to a 50 watt radio with an antenna. The supply rating is still to be chosen.'}>
      <T x={62} y={26} a="middle" c={s ? 'ga-tb' : 'ga-tm'}>{s ? s.rating : 'which rating?'}</T>
      <rect class={tone} x="22" y="38" width="80" height="50" rx="6" />
      <T x={62} y={59} a="middle" c="ga-tk ga-tb">power</T>
      <T x={62} y={75} a="middle" c="ga-tk ga-tb">supply</T>
      <path class="ga-w" d="M102 54H152M102 72H152" />
      <Arrow x1={116} y1={54} x2={138} y2={54} c="ga-s" h={5} />
      <rect class="ga-w" x="152" y="38" width="66" height="50" rx="6" />
      <T x={185} y={59} a="middle">50 watt</T>
      <T x={185} y={75} a="middle">radio</T>
      <path class="ga-w" d="M204 38V14M196 14L204 24L212 14" />
      <T x={120} y={116} a="middle" c={s ? '' : 'ga-tm'}>{s ? s.note : 'the supply feeds the radio DC power'}</T>
    </Art>
  );
}

/** Wire numbers for slider position v (1 = long and thin, 10 = short and thick). */
const dropAt = (v: number) => ((11 - v) * 24) / 100; // volts lost: 12 A times (11 - v) x 0.02 ohms
const lost = (v: number) => dropAt(v).toFixed(1);
const atRadio = (v: number) => (13.8 - dropAt(v)).toFixed(1);

/** The power wire between supply and radio. `value` makes it shorter and thicker. T4A03 */
function WirePic({ value = 1, solved }: PicProps) {
  const rx = 170 - (value - 1) * 6;
  return (
    <Art label={`A power supply at 13.8 volts joined to a transmitting radio by a wire. ${lost(value)} volts is lost in the wire, so ${atRadio(value)} volts reaches the radio.`}>
      <rect class="ga-w" x="14" y="36" width="56" height="48" rx="6" />
      <T x={42} y={57} a="middle">supply</T>
      <T x={42} y={73} a="middle" c="ga-tb">13.8 V</T>
      <path class={solved ? 'ga-good' : 'ga-k'} style={{ strokeWidth: 1 + (value - 1) * 0.6 }} d={`M70 60H${rx}`} />
      <rect class={solved ? 'ga-good' : 'ga-w'} x={rx} y="36" width="56" height="48" rx="6" />
      <T x={rx + 28} y={57} a="middle">radio</T>
      <T x={rx + 28} y={73} a="middle" c="ga-tb">{`${atRadio(value)} V`}</T>
      <T x={(70 + rx) / 2} y={26} a="middle" c="ga-tk ga-tb">power wire</T>
      <T x={(70 + rx) / 2} y={104} a="middle" c="ga-ts ga-tb">{`lost in the wire: ${lost(value)} V`}</T>
      <T x={120} y={128} a="middle" c="ga-tm">12 amperes flow while you transmit</T>
    </Art>
  );
}

/** Supply, radio and antenna with two places a meter could go. Either can be tapped. T4A05 */
function MeterPic({ picked, solved, onPick }: PicProps) {
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  const spot = (id: string, x: number) => {
    const here = picked === id;
    if (id === 'feed' && solved) {
      return (
        <>
          <rect class="ga-fbg" x={x - 15} y="50" width="30" height="30" rx="5" />
          <rect class="ga-good" x={x - 15} y="50" width="30" height="30" rx="5" />
          <path class="ga-good ga-thin" d={`M${x - 9} 72A10 10 0 0 1 ${x + 9} 72M${x} 73L${x + 5} 60`} />
        </>
      );
    }
    return (
      <>
        <circle class="ga-fbg" cx={x} cy="65" r="12" />
        <circle class={`${here ? 'ga-bad' : 'ga-k'} ga-dash`} cx={x} cy="65" r="12" />
        <T x={x} y={69.500} a="middle" c="ga-tk ga-tb">?</T>
      </>
    );
  };
  return (
    <Art label={solved
      ? 'A power supply, a radio and an antenna in a row. The RF power meter sits in the feed line, between the radio and the antenna.'
      : 'A power supply, a radio and an antenna in a row. One possible place for a meter is in the DC power cable, the other is in the feed line between the radio and the antenna.'}>
      <rect class="ga-w" x="10" y="46" width="48" height="38" rx="6" />
      <T x={34} y={69} a="middle">supply</T>
      <path class="ga-w" d="M58 65H100" />
      <rect class="ga-w" x="100" y="46" width="44" height="38" rx="6" />
      <T x={122} y={69} a="middle">radio</T>
      <path class="ga-s" d="M144 65H218V22M209 12L218 23L227 12" />
      {spot('dc', 79)}
      {spot('feed', 181)}
      <T x={79} y={104} a="middle" c="ga-tm">DC power</T>
      <T x={181} y={104} a="middle" c="ga-ts">feed line: RF</T>
      <T x={120} y={130} a="middle" c="ga-tm">{solved ? 'the meter sits where the RF flows' : 'where does the meter go?'}</T>
      {onPick && <rect x="60" y="44" width="38" height="66" style={hit} onClick={() => onPick('dc')} />}
      {onPick && <rect x="148" y="44" width="66" height="66" style={hit} onClick={() => onPick('feed')} />}
    </Art>
  );
}

/** Two add-on boxes: a keyer between paddle and radio, and a hotspot between handheld and network. T4A10, T4A12 */
function AddOns() {
  const marks = [[178, 5], [187, 13], [204, 5], [213, 13]];
  return (
    <Art label="Two add-on boxes. Top: a paddle connected to an electronic keyer, which sends evenly timed dits and dahs to the radio. Bottom: a handheld radio talking over a short radio hop to a hotspot, which is linked to a digital network.">
      <path class="ga-w" d="M20 20V44M30 20V44M14 44H36M30 32H52" />
      <rect class="ga-k" x="52" y="20" width="50" height="24" rx="5" />
      <T x={77} y={36} a="middle" c="ga-tk ga-tb">keyer</T>
      <path class="ga-w" d="M102 32H120" />
      <rect class="ga-w" x="120" y="20" width="46" height="24" rx="5" />
      <T x={143} y={36} a="middle">radio</T>
      {marks.map(([x, w]) => <rect class="ga-fs" x={x} y="29" width={w} height="6" />)}
      <T x={14} y={62} c="ga-tm">paddle in, even dits and dahs out</T>
      <path class="ga-w ga-thin" d="M12 74H228" />
      <rect class="ga-w" x="18" y="92" width="14" height="26" rx="3" />
      <path class="ga-w" d="M22 92V82" />
      <Arrow x1={40} y1={104} x2={64} y2={104} c="ga-s" h={5} both />
      <rect class="ga-k" x="70" y="92" width="58" height="24" rx="5" />
      <T x={99} y={108} a="middle" c="ga-tk ga-tb">hotspot</T>
      <path class="ga-w" d="M128 104H150" />
      <rect class="ga-w ga-dash" x="150" y="90" width="76" height="28" rx="14" />
      <T x={188} y={108} a="middle">network</T>
      <T x={14} y={134} c="ga-tm">a short radio hop to a digital network</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconSupply = () => <Mini><rect class="ls-mk" x="5" y="14" width="22" height="20" rx="3" /><path class="ls-mw" d="M27 24H43" /><path class="ls-mw ls-mthin" d="M11 24H21M16 19V29" /></Mini>;
const IconGround = () => <Mini><path class="ls-mk" d="M24 6V24M10 24H38M15 31H33M20 38H28" /></Mini>;
const IconMeter = () => <Mini><path class="ls-mw" d="M4 38H44" /><path class="ls-mk" d="M10 30A14 14 0 0 1 38 30" /><path class="ls-ms" d="M24 31L32 17" /></Mini>;
const IconBattery = () => <Mini><rect class="ls-mk" x="8" y="14" width="32" height="24" rx="3" /><path class="ls-mk" d="M15 14V9M33 14V9" /><path class="ls-mw ls-mthin" d="M14 26H34" /></Mini>;
const IconComputer = () => <Mini><rect class="ls-mw" x="5" y="12" width="16" height="22" rx="2" /><rect class="ls-mw" x="29" y="12" width="14" height="22" rx="2" /><path class="ls-ms ls-mthin" d="M29 18H21M21 24H29M21 30H29" /></Mini>;
const IconAddOns = () => <Mini><path class="ls-ms" d="M6 14H9M15 14H24M30 14H33M39 14H42" /><rect class="ls-mk" x="12" y="26" width="24" height="14" rx="3" /><path class="ls-mk ls-mthin" d="M30 26V20" /></Mini>;

/* ---------- the lesson ---------- */

const LESSON: Lesson = {
  id: 't4a-station-setup',
  title: 'Setting up your station',
  blurb: 'Build a station piece by piece: power, wiring, meters, grounding, a battery and a computer.',
  sub: 'T4',
  groups: ['T4A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t4a-station-setup',
      intro: 'Start with a short clip. After it you will build the station yourself, one piece at a time.',
      covers: ['T4A01', 'T4A03', 'T4A04', 'T4A05', 'T4A06', 'T4A09'],
    },
    {
      type: 'card',
      id: 'supply',
      idea: 'The power supply: 13.8 volts and enough amperes',
      covers: ['T4A01'],
      picture: { draw: SupplyPic },
      heading: 'First piece: a power supply',
      text: [
        'A mobile radio is built for a car\'s electrical system, which runs at about 13.8 volts. At home, a power supply turns wall power into that same 13.8 volts DC.',
        'The supply must also give enough current, measured in amperes. A radio takes in much more power than it sends out, because part is lost as heat. A typical 50 watt radio needs about 12 amperes.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Pick the supply for a typical 50 watt mobile FM radio.',
        options: [
          { id: 'low', label: '13.8 volts at 4 amperes', why: 'The voltage is right, but 13.8 × 4 is only about 55 watts going in. A radio loses too much as heat to get 50 watts out of that.' },
          { id: 'v24', label: '24 volts at 12 amperes', why: 'The current is fine, but 24 volts is the wrong voltage for a radio built for a 12 volt vehicle system.' },
          { id: 'ok', label: '13.8 volts at 12 amperes', right: true, why: 'Yes. 13.8 volts matches the radio, and 13.8 × 12 is about 166 watts: enough for 50 watts out plus the heat.' },
        ],
      },
      remember: 'A typical 50 watt mobile FM transceiver needs a supply rated 13.8 volts at 12 amperes.',
    },
    {
      type: 'card',
      id: 'wires',
      idea: 'Short, heavy power wires',
      covers: ['T4A03'],
      picture: { draw: WirePic },
      heading: 'Join them with short, heavy wires',
      text: [
        'Every wire has a little resistance, and current flowing through resistance loses voltage on the way. That loss is called voltage drop. A long or thin wire has more resistance.',
        'A radio draws its biggest current when it transmits, so that is when the drop is worst. Heavy-gauge wire means thick wire. Short, thick wires keep the voltage at the radio up.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Make the wire shorter and thicker until at least 13.5 volts reaches the radio.',
        label: 'Wire thickness',
        min: 1,
        max: 10,
        step: 1,
        start: 1,
        readouts: (v) => [{ label: 'Lost in the wire', value: `${lost(v)} V` }, { label: 'At the radio', value: `${atRadio(v)} V` }],
        goal: (v) => v === 10,
        hint: (v) => `Only ${atRadio(v)} volts reaches the radio. The wire still wastes ${lost(v)} volts. Make it shorter and thicker.`,
        done: 'There. A short, thick wire has very little resistance, so nearly all of the 13.8 volts reaches the radio, even at 12 amperes.',
      },
      remember: 'Short, heavy-gauge wires are used for the DC power connection to minimize voltage drop when transmitting.',
    },
    {
      type: 'card',
      id: 'vehicle',
      idea: 'In a vehicle: negative to the battery chassis ground',
      covers: ['T4A11'],
      picture: { art: 'chassis-ground' },
      heading: 'In a car, the battery is the supply',
      text: [
        'Put the same radio in a vehicle and the 12 volt battery takes the place of the power supply. Current leaves the battery, runs the radio, and must get all the way back.',
        'The wire that carries it back is the negative power return. Connect it at the 12 volt battery chassis ground: the point where the battery\'s negative lead bolts to the metal body. That is the vehicle\'s main ground.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'You are fitting a radio under the dashboard. Where do you connect its negative power return?',
        options: [
          { id: 'any', label: 'To any metal part nearby', why: 'Some metal parts are poorly joined to the rest of the vehicle. That can cause voltage drop and noise.' },
          { id: 'bracket', label: 'Through the radio\'s mounting bracket', why: 'A bracket only holds the radio up. Paint and loose bolts make it an unreliable path for current.' },
          { id: 'batt', label: 'At the 12 volt battery chassis ground', right: true, why: 'Yes. That is the vehicle\'s main ground, a solid path for the current back to the battery.' },
        ],
      },
      remember: 'In a vehicle, connect the negative power return at the 12 volt battery chassis ground.',
    },
    {
      type: 'card',
      id: 'meter',
      idea: 'Meters go in the feed line',
      covers: ['T4A05', 'T4A02'],
      picture: { draw: MeterPic },
      heading: 'Add a meter, in the feed line',
      text: [
        'The feed line is the cable that carries your signal, as RF, from the radio to the antenna. An RF power meter measures that signal, so it has to sit in its path: in the feed line, between the transmitter and the antenna.',
        'An SWR meter, which shows how well the antenna is matched to the feed line, goes in the same place. Each meter is built for a certain frequency range and power range. Choose one that fits the frequency and power level you will measure.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Where does the RF power meter go? Tap the place in the picture, or tap an answer.',
        options: [
          { id: 'dc', label: 'In the power supply cable', why: 'That cable carries DC to the radio, not RF. A meter there cannot see the power going to the antenna.' },
          { id: 'feed', label: 'In the feed line, between the radio and the antenna', right: true, why: 'Yes. The RF power travels down the feed line, so the meter goes in line there.' },
        ],
      },
      remember: 'An RF power meter is installed in the feed line, between the transmitter and antenna. Select an SWR meter by the frequency and power level it will measure.',
    },
    {
      type: 'card',
      id: 'bonding',
      idea: 'Bond the equipment with flat copper strap',
      covers: ['T4A08'],
      picture: { art: 'flat-copper-strap' },
      heading: 'Tie the boxes together with flat strap',
      text: [
        'You now have several metal boxes on the desk. Bonding means connecting them together so that they all sit at the same voltage.',
        'RF current flows on the surface of a conductor. A wide, flat strap has a lot of surface, so it gives RF an easier path than a round wire does. Flat copper strap is the preferred conductor for bonding at RF.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which would you pick to bond the radio, the supply and the meter together?',
        options: [
          { id: 'pair', label: 'Twisted-pair cable', why: 'Twisted pair is made to carry signals or data on two thin wires, not to bond equipment.' },
          { id: 'strap', label: 'Flat copper strap', right: true, why: 'Yes. Wide and flat means a large surface, which gives RF current an easy path.' },
          { id: 'braid', label: 'Braid pulled off an old coaxial cable', why: 'Loose braid is fine strands that corrode and work loose over time. It is not the preferred choice.' },
        ],
      },
      remember: 'Flat copper strap is the preferred conductor for bonding at RF.',
    },
    {
      type: 'card',
      id: 'battery',
      idea: 'Battery time: ampere-hours divided by amperes',
      covers: ['T4A09'],
      picture: { art: 'ampere-hour' },
      heading: 'Running from a battery: how long will it last?',
      text: [
        'A battery is rated in ampere-hours: how many amperes it can give, for how many hours. Think of it as the size of the tank.',
        'Divide the ampere-hour rating by the average current your equipment draws, and you get the hours it will run. Use the average, not the peak: a radio draws much less while listening than while transmitting. A 20 ampere-hour battery feeding 4 amperes lasts 20 ÷ 4 = 5 hours.',
      ],
      interaction: {
        kind: 'compute',
        rounds: [
          {
            prompt: 'A 20 ampere-hour battery runs a station that draws 2 amperes on average. How many hours does it last?',
            left: 'hours',
            top: '20 Ah',
            bottom: '2 A',
            accept: [10, 10],
            traps: [
              { range: [40, 40], why: 'That is 20 times 2. Divide instead: ampere-hours on top, amperes below.' },
              { range: [0.1, 0.1], why: 'That is 2 divided by 20. Turn it over: the ampere-hours go on top.' },
            ],
            hint: 'Not quite. Ask how many times 2 fits into 20.',
            answer: '10',
            working: ['20 ÷ 2 = 10', '10 hours. The amperes cancel and hours are left.'],
          },
          {
            prompt: 'Now a 36 ampere-hour battery and an average draw of 3 amperes. How many hours?',
            left: 'hours',
            top: '36 Ah',
            bottom: '3 A',
            accept: [12, 12],
            traps: [
              { range: [108, 108], why: 'That is 36 times 3. Divide instead: ampere-hours on top, amperes below.' },
              { range: [0.08, 0.09], why: 'That is 3 divided by 36. Turn it over: the ampere-hours go on top.' },
            ],
            hint: 'Not quite. Ask how many times 3 fits into 36.',
            answer: '12',
            working: ['36 ÷ 3 = 12', '12 hours. A bigger battery or a smaller draw gives more time.'],
          },
        ],
      },
      remember: 'Running time = battery ampere-hour rating divided by the average current draw of the equipment.',
    },
    {
      type: 'card',
      id: 'computer',
      idea: 'A computer for digital modes: audio both ways, plus keying',
      covers: ['T4A04', 'T4A06', 'T4A07'],
      picture: { art: 'computer-radio-interface' },
      heading: 'Add a computer for digital modes',
      text: [
        'In a digital mode such as FT8, software on a computer turns your message into audio tones and decodes the tones the radio hears. So the radio\'s audio goes to the audio input and output of a computer running FT8 software.',
        'The interface carries three signals: receive audio, transmit audio and transmitter keying, which switches the radio to transmit. Sound always runs from an output to an input. The radio\'s speaker connector is its audio output. The computer\'s "line in" is an audio input and "line out" is an audio output.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Wire it up. Tap a signal from the computer, then tap where it connects on the radio.',
        slots: [
          { id: 'spk', label: 'Speaker connector', sub: 'the radio\'s audio output', rule: 'The speaker connector sends sound out of the radio, so it must go to an input that listens.' },
          { id: 'mic', label: 'Microphone input', sub: 'audio into the radio', rule: 'The microphone input takes sound into the radio, so it needs an output that makes sound.' },
          { id: 'ptt', label: 'Push-to-talk line', sub: 'switches to transmit', rule: 'Push-to-talk is an on-off switch line. It carries no audio.' },
        ],
        items: [
          { id: 'out', label: 'Line out', slot: 'mic', why: 'Line out is the computer\'s audio output. Its tones go into the radio as transmit audio.' },
          { id: 'key', label: 'Keying signal', slot: 'ptt', why: 'The keying signal switches the radio to transmit, the job your thumb does on push-to-talk.' },
          { id: 'in', label: 'Line in', slot: 'spk', why: 'Line in is the computer\'s audio input. Joined to the speaker connector, it hears the receive audio.' },
        ],
      },
      remember: 'A digital mode interface carries receive audio, transmit audio and transmitter keying. Computer "line in" connects to the transceiver speaker connector.',
    },
    {
      type: 'card',
      id: 'addons',
      idea: 'Two add-ons: the hotspot and the electronic keyer',
      covers: ['T4A10', 'T4A12'],
      picture: { draw: AddOns },
      heading: 'Two more boxes you may add',
      text: [
        'An electronic keyer helps you send Morse code by hand. Morse is made of short and long sounds called dits and dahs. You press a paddle, and the keyer forms them with even timing.',
        'A digital mode hotspot is a small, very low power box at home. A digital radio nearby talks to it over a short radio hop, and the hotspot connects that radio to a digital voice or data network.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each job to the box that does it. Tap a job, then tap the box.',
        slots: [
          { id: 'keyer', label: 'Electronic keyer', rule: 'A keyer only helps with sending Morse code by hand.' },
          { id: 'hot', label: 'Hotspot', rule: 'A hotspot only links nearby digital radios to a network.' },
          { id: 'meter', label: 'RF power meter', rule: 'An RF power meter only measures the power in the feed line.' },
        ],
        items: [
          { id: 'a', label: 'Reach a digital voice network', slot: 'hot', why: 'A hotspot gives nearby radios communication with a digital voice or data network.' },
          { id: 'b', label: 'Send cleaner Morse code', slot: 'keyer', why: 'An electronic keyer assists in manual sending of Morse code, with evenly timed dits and dahs.' },
          { id: 'c', label: 'See the power going to the antenna', slot: 'meter', why: 'That is the RF power meter, in the feed line between the transmitter and the antenna.' },
        ],
      },
      remember: 'A hotspot gives nearby transceivers communication with a digital voice or data network. An electronic keyer assists in manual sending of Morse code.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T4A02', 'T4A03', 'T4A07', 'T4A09'],
      questions: [
        {
          q: 'Your radio receives fine, but each time you transmit its display dims. The power cable is long and thin. What is happening?',
          review: 'wires',
          covers: ['T4A03'],
          choices: [
            { label: 'The antenna is using up the voltage', why: 'The antenna is on the other side of the radio. The loss here is in the power cable.' },
            { label: 'Voltage is being lost in the cable', right: true, why: 'Transmitting draws heavy current, and a long, thin wire drops voltage. Short, heavy wires fix it.' },
            { label: 'The supply is giving too many volts', why: 'A dimming display means too little voltage is reaching the radio, not too much.' },
          ],
        },
        {
          q: 'You are buying an SWR meter for a 50 watt radio on 146 MHz. What should you check before you pay?',
          review: 'meter',
          covers: ['T4A02'],
          choices: [
            { label: 'That it is made for that frequency and that power level', right: true, why: 'A meter only reads properly inside the frequency and power ranges it was built for.' },
            { label: 'That it can correct a bad antenna match', why: 'An SWR meter only measures the match. It cannot fix one.' },
            { label: 'How far it will be from the antenna', why: 'Where it sits along the feed line is not what you choose a meter by.' },
          ],
        },
        {
          q: 'A 40 ampere-hour battery powers a station that draws 4 amperes on average. About how long will it run?',
          review: 'battery',
          covers: ['T4A09'],
          choices: [
            { label: '160 hours', why: 'That is 40 times 4. Divide the ampere-hours by the amperes instead.' },
            { label: '10 hours', right: true, why: '40 ampere-hours ÷ 4 amperes = 10 hours.' },
            { label: '36 hours', why: 'That is 40 minus 4. Divide the ampere-hours by the amperes instead.' },
          ],
        },
        {
          q: 'For a digital mode, the computer has to hear what the radio receives. Which computer jack gets the cable from the radio\'s speaker connector?',
          review: 'computer',
          covers: ['T4A07'],
          choices: [
            { label: 'Line out', why: 'Line out and the speaker connector are both outputs. Two outputs joined together pass nothing useful.' },
            { label: 'Line in', right: true, why: 'The speaker connector is an output and line in is an input, so the computer hears the receive audio.' },
            { label: 'Either one, it makes no difference', why: 'It matters. Sound runs from an output to an input, and only line in is an input.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T4A01', 'T4A02', 'T4A03', 'T4A04', 'T4A05', 'T4A06', 'T4A07', 'T4A08', 'T4A09', 'T4A10', 'T4A11', 'T4A12'],
      facts: [
        { icon: IconSupply, text: 'A 50 watt mobile FM radio needs 13.8 volts at 12 amperes, through short, heavy-gauge wires to minimize voltage drop when transmitting.', covers: ['T4A01', 'T4A03'] },
        { icon: IconGround, text: 'In a vehicle, the negative power return goes to the 12 volt battery chassis ground. Flat copper strap is preferred for bonding at RF.', covers: ['T4A11', 'T4A08'] },
        { icon: IconMeter, text: 'An RF power meter goes in the feed line, between the transmitter and antenna. Select an SWR meter by frequency and power level.', covers: ['T4A05', 'T4A02'] },
        { icon: IconBattery, text: 'Battery running time = ampere-hour rating divided by the average current draw.', covers: ['T4A09'] },
        { icon: IconComputer, text: 'Digital modes such as FT8: the radio trades audio with a computer running the software. The interface carries receive audio, transmit audio and transmitter keying. Computer line in goes to the speaker connector.', covers: ['T4A04', 'T4A06', 'T4A07'] },
        { icon: IconAddOns, text: 'A hotspot links nearby radios to a digital voice or data network. An electronic keyer assists in manual sending of Morse code.', covers: ['T4A10', 'T4A12'] },
      ],
    },
  ],
};
export default LESSON;
