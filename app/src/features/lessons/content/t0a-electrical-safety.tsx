import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 33: Electrical safety (question group T0A, all 12 questions).
 * Each rule is taught with the hazard it prevents. Every exam fact comes from a T0A question
 * and its keyed answer; the ids are in each step's `covers`. Hazards are drawn in red.
 * Basic facts added beyond the keyed answers (listed in the report): white is neutral and
 * green or bare is the equipment ground in US wiring; a short across a storage battery can
 * pass hundreds of amperes.
 */

/* ---------- pictures ---------- */

/**
 * A 120 volt supply feeding a radio by a hot and a neutral wire, with three places a fuse
 * might go: A in the hot wire, B in the neutral wire, C across the two wires. Each can be tapped. T0A08
 */
function FusePlace({ picked, solved, onPick }: PicProps) {
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  const spot = (id: string) => (picked === id ? (id === 'a' && solved ? 'ga-good' : 'ga-bad') : 'ga-w ga-dash ga-thin');
  const fill = (id: string) => picked === id;
  const say: Record<string, string> = {
    a: 'all the current passes through it',
    b: 'the radio would still be live',
    c: 'it sits beside the current, not in it',
  };
  return (
    <Art label={picked
      ? `A 120 volt supply feeds a radio through a hot wire and a neutral wire. The fuse is drawn at spot ${picked.toUpperCase()}: ${say[picked]}.`
      : 'A 120 volt supply feeds a radio through a hot wire on top and a neutral wire below. Spot A is in the hot wire, spot B in the neutral wire, and spot C is a branch across the two wires.'}>
      <rect class="ga-w" x="12" y="28" width="52" height="84" rx="4" />
      <T x={38} y={68} a="middle">supply</T>
      <T x={38} y={86} a="middle" c="ga-tm">120 V</T>
      <rect class="ga-w" x="176" y="28" width="52" height="84" rx="4" />
      <T x={202} y={74} a="middle">radio</T>
      <path class="ga-k" d="M64 46H176" />
      <path class="ga-w" d="M64 94H176" />
      <path class="ga-w ga-thin ga-dash" d="M150 46V94" />
      <rect class="ga-fbg" x="84" y="38" width="32" height="16" rx="3" />
      <rect class={spot('a')} x="84" y="38" width="32" height="16" rx="3" />
      {fill('a') && <path class={`${spot('a')} ga-thin`} d="M84 46q8 -6 16 0t16 0" />}
      <rect class="ga-fbg" x="84" y="86" width="32" height="16" rx="3" />
      <rect class={spot('b')} x="84" y="86" width="32" height="16" rx="3" />
      {fill('b') && <path class={`${spot('b')} ga-thin`} d="M84 94q8 -6 16 0t16 0" />}
      <rect class="ga-fbg" x="142" y="58" width="16" height="24" rx="3" />
      <rect class={spot('c')} x="142" y="58" width="16" height="24" rx="3" />
      {fill('c') && <path class={`${spot('c')} ga-thin`} d="M150 58q-6 6 0 12t0 12" />}
      <T x={100} y={30} a="middle" c="ga-tb">A</T>
      <T x={100} y={118} a="middle" c="ga-tb">B</T>
      <T x={164} y={74} c="ga-tb">C</T>
      <T x={121} y={40} c="ga-tk">hot</T>
      <T x={122} y={110} c="ga-tm">neutral</T>
      {solved && <Arrow x1={124} y1={54} x2={142} y2={54} c="ga-s" h={5} />}
      <T x={120} y={134} a="middle" c={picked ? (solved ? 'ga-tb' : 'ga-tb') : 'ga-tm'}>{picked ? say[picked] : 'where should the fuse go?'}</T>
      {onPick && <rect x="76" y="14" width="48" height="46" style={hit} onClick={() => onPick('a')} />}
      {onPick && <rect x="76" y="80" width="44" height="42" style={hit} onClick={() => onPick('b')} />}
      {onPick && <rect x="134" y="54" width="40" height="34" style={hit} onClick={() => onPick('c')} />}
    </Art>
  );
}

/** A power supply just switched off, its filter capacitor still holding charge. T0A11, T0A12 */
function StoredCharge() {
  return (
    <Art label="A power supply that has just been switched off and unplugged. Inside, its filter capacitor is still charged, marked with a red hazard flash. A voltmeter with its test leads is beside it.">
      <rect class="ga-w" x="12" y="14" width="138" height="94" rx="6" />
      <T x={20} y={30} c="ga-tm">power supply</T>
      <path class="ga-w" d="M80 56V40H32M80 66V82H32" />
      <path class="ga-k ga-thick" d="M58 56H102M58 66H102" />
      <path class="ga-bad ga-thick" d="M122 44l-8 12h10l-8 12" />
      <T x={80} y={100} a="middle" c="ga-tk ga-tb">filter capacitor</T>
      <path class="ga-w ga-thin" d="M150 96H162" />
      <rect class="ga-w" x="162" y="90" width="12" height="12" rx="2" />
      <path class="ga-w ga-thin" d="M174 93h6M174 99h6" />
      <rect class="ga-w" x="176" y="14" width="48" height="38" rx="4" />
      <T x={200} y={38} a="middle" c="ga-tb">V</T>
      <path class="ga-w ga-thin" d="M190 52C190 66 196 74 200 80M210 52C210 66 216 74 222 80" />
      <T x={120} y={132} a="middle" c="ga-tb">unplugged, but still charged</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconBody = () => <Mini><circle class="ls-mw" cx="24" cy="10" r="5" /><path class="ls-mw" d="M24 15V32M14 22H34M24 32L16 44M24 32L32 44" /><path class="ls-ms ls-mthin" d="M40 6l-5 8h6l-5 8" /></Mini>;
const IconCord = () => <Mini><path class="ls-mk" d="M6 14H42" /><path class="ls-mw" d="M6 24H42M6 34H42" /></Mini>;
const IconFuse = () => <Mini><rect class="ls-mk" x="10" y="16" width="28" height="16" rx="3" /><path class="ls-mk ls-mthin" d="M10 24q7 -6 14 0t14 0" /><path class="ls-mw" d="M2 24H10M38 24H46" /></Mini>;
const IconCap = () => <Mini><path class="ls-mk" d="M12 20H36M12 28H36" /><path class="ls-mw" d="M24 20V8M24 28V40" /><path class="ls-ms ls-mthin" d="M42 6l-5 8h6l-5 8" /></Mini>;
const IconBattery = () => <Mini><rect class="ls-mk" x="6" y="18" width="36" height="22" rx="2" /><path class="ls-mk" d="M12 18V12H18V18M30 18V12H36V18" /><path class="ls-ms" d="M8 9H40" /></Mini>;
const IconArrester = () => <Mini><path class="ls-mw" d="M4 18H16M32 18H44" /><rect class="ls-mk" x="16" y="12" width="16" height="12" rx="2" /><path class="ls-mk" d="M24 24V34M16 34H32M19 39H29M22 44H26" /></Mini>;

/* ---------- the lesson ---------- */

export const T0A_ELECTRICAL_SAFETY: Lesson = {
  id: 't0a-electrical-safety',
  title: 'Electrical safety',
  blurb: 'What current does to the body, and the rules that keep it out of you: cords, grounds, fuses, capacitors, batteries and lightning.',
  sub: 'T0',
  groups: ['T0A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t0a-electrical-safety',
      intro: 'Start with a short clip. After it you will work through each safety rule and the hazard it prevents.',
      covers: ['T0A01', 'T0A02', 'T0A03', 'T0A04', 'T0A07'],
    },
    {
      type: 'card',
      id: 'shock',
      idea: 'What current does to the body',
      covers: ['T0A02'],
      picture: { art: 'electrical-shock' },
      heading: 'Why current through the body is dangerous',
      text: [
        'An electrical shock is current flowing through your body. Your body has resistance, so the current heats it and can burn tissue inside and out.',
        'Your nerves and heart also run on tiny electrical signals, and outside current upsets them. It makes muscles tighten on their own, so a hand can clamp onto a live wire and not let go.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which of these can current through the body do?',
        options: [
          { id: 'heat', label: 'Only burn the skin where it enters', why: 'It does more than that. It also heats tissue deep inside, upsets the electrical signals of cells and makes muscles contract.' },
          { id: 'mus', label: 'Only make muscles twitch', why: 'Muscle contraction is one effect, but not the only one. Current also heats tissue and disrupts how cells work.' },
          { id: 'all', label: 'Heat tissue, upset cells and make muscles contract', right: true, why: 'Yes. All three are real, and any of them can injure or kill.' },
        ],
      },
      remember: 'Current through the body can heat tissue, disrupt the electrical functions of cells and cause involuntary muscle contractions.',
    },
    {
      type: 'card',
      id: 'wires',
      idea: 'The three wires of a power cord',
      covers: ['T0A03'],
      picture: { art: 'hot-wire' },
      heading: 'Know which wire is hot',
      text: [
        'A US 120 volt AC cable has three wires. Black is the hot wire: it carries the 120 volts from the panel, and it is the one that can shock you. White is the neutral, the return path.',
        'Green, or bare copper, is the equipment ground: a safety wire tied to the metal case of the equipment. Treat every wire as live until the power is off.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Match each wire color to its job. Tap a wire, then tap its job.',
        slots: [
          { id: 'hot', label: 'Hot', sub: 'carries the 120 volts', rule: 'The hot wire is black.' },
          { id: 'neu', label: 'Neutral', sub: 'the return path', rule: 'The neutral wire is white.' },
          { id: 'gnd', label: 'Equipment ground', sub: 'tied to the metal case', rule: 'The ground wire is green or bare copper.' },
        ],
        items: [
          { id: 'black', label: 'Black', slot: 'hot', why: 'Black is hot. It carries the 120 volts, so it is the shock hazard.' },
          { id: 'white', label: 'White', slot: 'neu', why: 'White is the neutral, the return wire.' },
          { id: 'green', label: 'Green or bare', slot: 'gnd', why: 'Green or bare copper is the equipment ground, the safety wire to the case.' },
        ],
      },
      remember: 'In a US three-wire 120 V AC cable, black insulation marks the hot wire.',
    },
    {
      type: 'card',
      id: 'ground',
      idea: 'Three-wire cords and a common safety ground',
      covers: ['T0A06'],
      picture: { art: 'safety-ground' },
      heading: 'Ground every metal case',
      text: [
        'The third wire of a three-wire cord joins the metal case to ground. If a hot wire comes loose inside and touches the case, the current runs down that wire and trips the breaker, instead of waiting in the case for your hand.',
        'Then tie every piece of AC powered station equipment to one common safety ground. All the cases stay at the same voltage, so touching two at once does not put a voltage across you.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your new power supply has a three-prong plug, but the outlet behind your desk only takes two prongs. What do you do?',
        options: [
          { id: 'snap', label: 'Snap off the third prong so it fits', why: 'Dangerous. Without the ground prong the case is no longer grounded, so a fault inside can make the case live and shock whoever touches it.' },
          { id: 'two', label: 'Run it through a two-wire extension cord', why: 'Dangerous. A two-wire cord has no ground wire, so the case is left ungrounded and a fault can make it live.' },
          { id: 'ok', label: 'Use a grounded three-hole outlet, and bond the case to the station safety ground', right: true, why: 'Right. The ground wire stays connected, and every case sits at the same safe voltage.' },
        ],
      },
      remember: 'Guard against shock: use three-wire cords and plugs for all AC powered equipment, and connect all of it to a common safety ground.',
    },
    {
      type: 'card',
      id: 'fuse',
      idea: 'What a fuse does, and its rating',
      covers: ['T0A04', 'T0A05'],
      picture: { art: 'overload' },
      heading: 'A fuse removes power on an overload',
      text: [
        'An overload is more current than a circuit is built for. Too much current heats wires and parts, and hot wires start fires. A fuse has a thin metal strip that melts when the current goes over its rating, which breaks the circuit and removes the power.',
        'A fuse does not stop shocks: a current far too small to blow it can still kill you. And it only protects if its rating is right. Always replace a fuse with one of the same rating.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'The 5 ampere fuse in your power supply has blown. Which replacement is safe?',
        options: [
          { id: '20', label: 'A 20 ampere fuse, so it blows less often', why: 'Dangerous. Up to four times the intended current could flow without the fuse opening, overheating the wires and parts until something catches fire.' },
          { id: 'foil', label: 'A wrap of foil or wire across the holder', why: 'Dangerous. That is no fuse at all. Nothing would ever break the circuit, so an overload could heat the wiring until it starts a fire.' },
          { id: '5', label: 'A new 5 ampere fuse', right: true, why: 'Right. The same rating opens the circuit at the current the equipment was designed for.' },
        ],
      },
      remember: 'A fuse removes power in case of an overload. Never replace a 5 ampere fuse with a 20 ampere fuse: excessive current could cause a fire.',
    },
    {
      type: 'card',
      id: 'fuse-place',
      idea: 'Where the fuse goes',
      covers: ['T0A08'],
      picture: { draw: FusePlace },
      heading: 'The fuse goes in series with the hot wire',
      text: [
        'In series means in the path of the current, so all of it passes through the fuse. A fuse placed beside the path, in parallel, could blow and the current would carry on.',
        'It goes in the hot wire only. Opening the hot wire takes the voltage away from everything after it. If only the neutral opened, the radio would look dead but still be live.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Where should the fuse or circuit breaker go in this 120 volt circuit? Tap a spot in the picture, or tap an answer.',
        options: [
          { id: 'a', label: 'A: in series with the hot wire', right: true, why: 'Right. All the current flows through it, and when it opens the radio is cut off from the 120 volts.' },
          { id: 'b', label: 'B: in series with the neutral wire', why: 'Dangerous. If the neutral opens while the hot stays connected, the radio stops working but is still live and can shock you.' },
          { id: 'c', label: 'C: across the two wires, in parallel', why: 'A fuse in parallel sits beside the current, not in its path. Blowing it would not stop the current to the radio.' },
        ],
      },
      remember: 'A fuse or circuit breaker goes in series with the hot conductor only.',
    },
    {
      type: 'card',
      id: 'capacitors',
      idea: 'Stored charge and high-voltage meters',
      covers: ['T0A11', 'T0A12', 'T0A06'],
      picture: { draw: StoredCharge },
      heading: 'Off is not the same as safe',
      text: [
        'A power supply has filter capacitors that store charge. Right after you turn it off, even unplugged, they can still hold a voltage that can shock you. Make sure high-voltage capacitors are fully discharged before you work inside.',
        'To measure high voltage, the voltmeter and its leads must be rated for that voltage. If they are not, their insulation can fail and put that voltage on you.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Is each step safe or unsafe? Tap a step, then tap safe or unsafe.',
        slots: [
          { id: 'safe', label: 'Safe', rule: 'That step is unsafe: it can put a dangerous voltage across your body.' },
          { id: 'unsafe', label: 'Unsafe', rule: 'That step is a safe practice: it keeps the voltage away from you.' },
        ],
        items: [
          { id: 'touch', label: 'Reach inside the moment the supply is switched off', slot: 'unsafe', why: 'Unsafe. The filter capacitors can still be charged, and touching them can give you a shock.' },
          { id: 'dis', label: 'Make sure the capacitors are fully discharged first', slot: 'safe', why: 'Safe. With the stored charge gone, the capacitors cannot shock you.' },
          { id: 'rated', label: 'Use a meter and leads rated for the voltage', slot: 'safe', why: 'Safe. Their insulation is built to hold that voltage back from your hands.' },
          { id: 'cheap', label: 'Use any test leads you have, whatever the voltage', slot: 'unsafe', why: 'Unsafe. Leads not rated for the voltage can break down and expose you to it.' },
        ],
      },
      remember: 'Right after a power supply is turned off, charge stored in its filter capacitors is a hazard. Use a voltmeter and leads rated for the voltage you measure.',
    },
    {
      type: 'card',
      id: 'battery',
      idea: 'Storage battery hazards',
      covers: ['T0A01', 'T0A10'],
      picture: { art: 'short-circuit' },
      heading: 'A 12 volt battery is not harmless',
      text: [
        'A 12 volt storage battery holds a huge amount of energy. Its big danger is current. Metal across both terminals, a wrench or a ring, is a short circuit: hundreds of amperes flow at once, the metal gets red hot, and you can get burns, a fire or an explosion.',
        'Charging or discharging an unprotected battery too fast is also a hazard. The high current makes it overheat and give off gas, called out-gassing, which can lead to fire or a burst battery.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'A metal wrench slips and lands across both posts of a 12 volt battery that has no internal protection. What happens?',
        options: [
          { id: 'none', label: 'Nothing much. 12 volts is too low to hurt anyone', why: 'Dangerous thinking. The voltage is low, but the current is huge. The wrench can glow hot, burn you, start a fire or make the battery explode.' },
          { id: 'big', label: 'A huge current flows: burns, fire or an explosion', right: true, why: 'Right. Shorting the terminals is the real hazard of a storage battery. Keep metal tools and jewelry away from the terminals.' },
          { id: 'gas', label: 'Nearby radio signals make it give off poison gas', why: 'Radio signals do not do that. The hazard here is the short circuit: burns, fire or an explosion.' },
        ],
      },
      remember: 'Shorting the terminals of a storage battery can cause burns, fire or an explosion. Charging or discharging it too fast can cause overheating or out-gassing.',
    },
    {
      type: 'card',
      id: 'lightning',
      idea: 'Lightning arrester and bonded grounds',
      covers: ['T0A07', 'T0A09'],
      picture: { art: 'lightning-arrester' },
      heading: 'Stop a lightning surge before it comes indoors',
      text: [
        'A lightning strike on or near your antenna sends a surge down the coax. A lightning arrester in the feed line passes that surge to ground. Put it on a grounded panel near where the feed lines enter the building, so the surge reaches earth before the coax comes inside.',
        'Bond all your outside ground rods and earth connections together with heavy wire or conductive strap. Then they stay at the same voltage, so a strike does not push current through your equipment between them.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Where should the lightning arrester go in your coax?',
        options: [
          { id: 'radio', label: 'On the back of the radio', why: 'Too late. By then the surge has already come through the house, and there is no good path to earth there.' },
          { id: 'ant', label: 'Up at the antenna', why: 'Up there it is far from earth, and the surge would still follow the coax down into the house.' },
          { id: 'entry', label: 'On a grounded panel where the feed line enters the building', right: true, why: 'Right. The surge gets a short path to earth before the coax comes indoors.' },
        ],
      },
      remember: 'Install a lightning arrester on a grounded panel near where feed lines enter the building. Bond all ground rods together with heavy wire or conductive strap.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T0A02', 'T0A03', 'T0A05', 'T0A11'],
      questions: [
        {
          q: 'Why can someone touching a live wire find they cannot let go?',
          review: 'shock',
          covers: ['T0A02'],
          choices: [
            { label: 'The wire gets sticky when it is live', why: 'Wires do not get sticky. The current itself makes the hand muscles clamp.' },
            { label: 'The current makes their muscles contract on their own', right: true, why: 'Current through the body causes involuntary muscle contractions, so the hand can grip the wire.' },
            { label: 'Their skin is heated and fuses to it', why: 'Current does heat tissue, but the reason the hand will not open is that its muscles are contracting.' },
          ],
        },
        {
          q: 'You open a 120 volt cable and see a black, a white and a green wire. Which one carries the 120 volts?',
          review: 'wires',
          covers: ['T0A03'],
          choices: [
            { label: 'Black', right: true, why: 'Black is the hot wire, the one that can shock you.' },
            { label: 'White', why: 'White is the neutral, the return wire. Black is hot.' },
            { label: 'Green', why: 'Green is the equipment ground, the safety wire to the case. Black is hot.' },
          ],
        },
        {
          q: 'A 30 ampere fuse fits the holder where a 10 ampere fuse belongs. What is wrong with using it?',
          review: 'fuse',
          covers: ['T0A04', 'T0A05'],
          choices: [
            { label: 'It would blow too often', why: 'The opposite. A bigger fuse blows less often, which is the danger.' },
            { label: 'Far too much current could flow before it opens, and start a fire', right: true, why: 'Excessive current would overheat the wiring with no fuse to stop it. Use the same rating.' },
            { label: 'Nothing, as long as it fits', why: 'Fitting is not enough. The wrong rating lets an overload heat the wiring until it catches fire.' },
          ],
        },
        {
          q: 'You switched off and unplugged a power supply ten seconds ago. Is it safe to touch the parts inside?',
          review: 'capacitors',
          covers: ['T0A11'],
          choices: [
            { label: 'Yes, it is unplugged', why: 'Unplugged is not enough. The filter capacitors can still hold a charge that can shock you.' },
            { label: 'Not yet. The filter capacitors may still be charged', right: true, why: 'Stored charge stays after switch-off. Make sure the capacitors are discharged first.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T0A01', 'T0A02', 'T0A03', 'T0A04', 'T0A05', 'T0A06', 'T0A07', 'T0A08', 'T0A09', 'T0A10', 'T0A11', 'T0A12'],
      facts: [
        { icon: IconBody, text: 'Current through the body can heat tissue, disrupt the electrical functions of cells and cause involuntary muscle contractions.', covers: ['T0A02'] },
        { icon: IconCord, text: 'Black is the hot wire in a US 120 V cable. Use three-wire cords for all AC equipment and connect it all to a common safety ground.', covers: ['T0A03', 'T0A06'] },
        { icon: IconFuse, text: 'A fuse removes power on an overload. It goes in series with the hot conductor only. A larger fuse than intended could let excessive current cause a fire.', covers: ['T0A04', 'T0A05', 'T0A08'] },
        { icon: IconCap, text: 'Filter capacitors can hold charge after a supply is turned off: discharge them before working inside. Use a voltmeter and leads rated for the voltage.', covers: ['T0A06', 'T0A11', 'T0A12'] },
        { icon: IconBattery, text: 'Shorting a storage battery can cause burns, fire or an explosion. Charging or discharging it too fast can cause overheating or out-gassing.', covers: ['T0A01', 'T0A10'] },
        { icon: IconArrester, text: 'A lightning arrester goes on a grounded panel near where feed lines enter the building. Bond all ground rods together with heavy wire or strap.', covers: ['T0A07', 'T0A09'] },
      ],
    },
  ],
};
export default T0A_ELECTRICAL_SAFETY;
