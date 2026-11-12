import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson 34: Tower and antenna safety (question group T0B, all 11 questions).
 * Each rule is taught with the hazard it prevents: falls, power lines, guy lines and lightning.
 * Every exam fact comes from a T0B question and its keyed answer; the ids are in each step's
 * `covers`. The only distance used is the pool's 10 feet; the power line picture is a sketch
 * with no other measurements.
 */

/* ---------- pictures ---------- */

/** Power lines on a pole at the left, and three places to put up a mast. Each can be tapped. T0B06 */
const WIRE = { x: 38, y: 30 };
const H = 90; // mast height in px, also the radius it sweeps if it falls
const GROUND = 118;
const SPOTS: Record<string, { x: number; tone: 'hit' | 'near' | 'ok'; line1: string; line2: string }> = {
  a: { x: 54, tone: 'hit', line1: 'falls across', line2: 'the wires' },
  b: { x: 95, tone: 'near', line1: 'comes within', line2: '10 ft of them' },
  c: { x: 130, tone: 'ok', line1: 'stays at least', line2: '10 ft clear' },
};

function FallZone({ picked, solved, onPick }: PicProps) {
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  const s = picked ? SPOTS[picked] : null;
  const tone = !s ? 'ga-w' : s.tone === 'ok' && solved ? 'ga-good' : 'ga-bad';
  let gap = '';
  if (s && s.tone !== 'hit') {
    const dx = WIRE.x - s.x, dy = WIRE.y - GROUND, len = Math.hypot(dx, dy);
    const px = s.x + (H * dx) / len, py = GROUND + (H * dy) / len;
    gap = `M${px.toFixed(1)} ${py.toFixed(1)}L${WIRE.x} ${WIRE.y}`;
  }
  return (
    <Art label={s
      ? `Power lines on a pole, and a mast put up at spot ${picked!.toUpperCase()}. A dashed arc shows where it would land if it fell: it ${s.line1} ${s.line2}.`
      : 'Power lines on a pole at the left. Three spots for a mast, A, B and C, each farther from the wires.'}>
      <path class="ga-w ga-thin" d={`M8 ${GROUND}H232`} />
      <path class="ga-w" d={`M30 ${GROUND}V26M18 34H42`} />
      <circle class="ga-fbad" cx="22" cy="30" r="3.5" />
      <circle class="ga-fbad" cx={WIRE.x} cy={WIRE.y} r="3.5" />
      <T x={8} y={14} c="ga-tb">power lines</T>
      {Object.entries(SPOTS).map(([id, p]) => (
        <>
          <path class={picked === id ? `${tone} ga-thick` : 'ga-w ga-thin'} d={`M${p.x} ${GROUND}V${GROUND - H}M${p.x - 8} ${GROUND - H + 4}H${p.x + 8}`} />
          <T x={p.x} y={134} a="middle" c={picked === id ? 'ga-tb' : 'ga-tm'}>{id.toUpperCase()}</T>
        </>
      ))}
      {s && <path class={`${tone} ga-dash ga-thin`} d={`M${s.x} ${GROUND - H}A${H} ${H} 0 0 0 ${s.x - H} ${GROUND}`} />}
      {s && s.tone === 'hit' && <circle class="ga-bad ga-thick" cx={WIRE.x} cy={WIRE.y} r="9" />}
      {gap && <path class={`${tone} ga-thick`} d={gap} />}
      {s && <T x={146} y={60} c="ga-tb">{s.line1}</T>}
      {s && <T x={146} y={76} c="ga-tb">{s.line2}</T>}
      {!s && <T x={146} y={52} c="ga-tm">if it fell,</T>}
      {!s && <T x={146} y={68} c="ga-tm">where would</T>}
      {!s && <T x={146} y={84} c="ga-tm">it land?</T>}
      {onPick && Object.keys(SPOTS).map((id) => (
        <rect x={SPOTS[id].x - 16} y={GROUND - H - 4} width="32" height={H + 24} style={hit} onClick={() => onPick(id)} />
      ))}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconHarness = () => <Mini><path class="ls-mw" d="M10 44V4M22 44V4M10 14H22M10 28H22" /><circle class="ls-mk" cx="34" cy="12" r="4" /><path class="ls-mk" d="M34 16V32M28 22H40M34 32L29 42M34 32L39 42M30 24L22 20" /></Mini>;
const IconCrank = () => <Mini><path class="ls-mk" d="M14 44V30H34V44M18 30V22H30V30M21 22V14H27V22" /><path class="ls-mw ls-mthin" d="M4 44H44" /></Mini>;
const IconLines = () => <Mini><path class="ls-mw" d="M8 44V8M2 12H14" /><path class="ls-ms ls-mthin" d="M14 8L18 14" /><path class="ls-mk" d="M40 44V12M34 14H46" /><path class="ls-mw ls-mthin" d="M18 20H34" /></Mini>;
const IconTurnbuckle = () => <Mini><path class="ls-mw" d="M2 24H12M36 24H46" /><rect class="ls-mk" x="14" y="18" width="20" height="12" rx="2" /><path class="ls-ms ls-mthin" d="M10 20C18 8 30 8 38 20" /></Mini>;
const IconRods = () => <Mini><path class="ls-mw ls-mthin" d="M2 18H46" /><path class="ls-mk" d="M10 18V44M24 18V44M38 18V44M10 14H38" /></Mini>;
const IconStraight = () => <Mini><path class="ls-mk" d="M14 6V36M6 36H22M9 41H19M12 46H16" /><path class="ls-mw ls-mthin" d="M34 6V16H44V26H30V36" /></Mini>;

/* ---------- the lesson ---------- */

export const T0B_TOWER_SAFETY: Lesson = {
  id: 't0b-tower-safety',
  title: 'Tower and antenna safety',
  blurb: 'Climbing safely, keeping antennas away from power lines, guy lines, and grounding a tower against lightning.',
  sub: 'T0',
  groups: ['T0B'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t0b-tower-safety',
      intro: 'Start with a short clip. After it you will meet each tower hazard and the rule that guards against it.',
      covers: ['T0B01', 'T0B02', 'T0B03', 'T0B05', 'T0B06'],
    },
    {
      type: 'card',
      id: 'climb',
      idea: 'Training, harness and tie-off',
      covers: ['T0B02'],
      picture: { art: 'climbing-harness' },
      heading: 'Climbing a tower: trained, harnessed, tied off',
      text: [
        'The biggest danger on a tower is a fall. So climbing is a skill you learn first: get sufficient training in safe climbing techniques before you go up.',
        'Always wear an approved climbing harness, made and tested to catch a falling person. And stay tied off to the tower at all times, including while you move up, down or around something, because a slip can happen at any moment.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Halfway up, you need to get past a bracket on the tower. What do you do with your tie-off?',
        options: [
          { id: 'unclip', label: 'Unclip for a moment, step past, then clip back on', why: 'Dangerous. A slip in that moment would be a fall with nothing to catch you. Stay tied off at all times.' },
          { id: 'hold', label: 'Unclip and just hold on tight with both hands', why: 'Dangerous. Your grip is not a safety line. If a hand slips, nothing stops the fall. Stay tied off at all times.' },
          { id: 'stay', label: 'Stay tied off to the tower the whole way past', right: true, why: 'Right. Tie-off is required at all times, moving or not.' },
        ],
      },
      remember: 'To climb a tower you need sufficient training, an approved climbing harness, and tie-off to the tower at all times.',
    },
    {
      type: 'card',
      id: 'helper',
      idea: 'Never climb alone',
      covers: ['T0B03'],
      picture: { art: 'helper-or-observer' },
      heading: 'Never climb without a helper',
      text: [
        'A helper or observer stays on the ground and watches you. If you fall, get hurt or get stuck, they can assist and call for help.',
        'There is no safe exception. A fall from a low height can kill or cripple, and the climb itself is the risk, whatever the job at the top.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Nobody else is home, and you only need to climb a short way to tighten one bolt. May you go up alone?',
        options: [
          { id: 'low', label: 'Yes, it is only a short way up', why: 'Dangerous. A fall from a low height can still kill or cripple you. No height makes climbing alone safe.' },
          { id: 'mech', label: 'Yes, there is no electrical work to do', why: 'Dangerous. A fall or injury can happen with no electrical work at all. The climb itself is the risk.' },
          { id: 'never', label: 'No. Wait until a helper or observer is there', right: true, why: 'Right. It is never safe to climb without a helper or observer.' },
        ],
      },
      remember: 'It is never safe to climb a tower without a helper or observer.',
    },
    {
      type: 'card',
      id: 'crank-up',
      idea: 'Crank-up towers',
      covers: ['T0B07'],
      picture: { art: 'crank-up-tower' },
      heading: 'A crank-up tower can slide down on you',
      text: [
        'A crank-up tower has sections that nest inside each other. A winch and cable raise them and hold them up.',
        'If that cable or winch failed while you were on a raised tower, the sections could slide down and crush you. So climb it only when it is fully retracted, or when mechanical safety locking devices have been installed.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Your crank-up tower is fully raised, and it has no safety locks. You want to adjust the antenna. What do you do?',
        options: [
          { id: 'climb', label: 'Climb it carefully, wearing your harness', why: 'Dangerous. A harness does not stop the sections sliding down if the cable fails. They could crush you.' },
          { id: 'lower', label: 'Crank it down fully first, then work on it', right: true, why: 'Right. Retracted, the sections cannot slide down onto you.' },
        ],
      },
      remember: 'Do not climb a crank-up tower unless it is retracted, or mechanical safety locking devices have been installed.',
    },
    {
      type: 'card',
      id: 'power-lines',
      idea: 'Power lines and the 10 foot rule',
      covers: ['T0B04', 'T0B06', 'T0B09'],
      picture: { draw: FallZone },
      heading: 'Stay well clear of power lines',
      text: [
        'If a tower, mast, antenna or wire touches an overhead power line, it becomes live, and anyone touching it can be electrocuted. Before you put anything up, look for overhead wires and stay clear of them. Never attach an antenna to a utility pole: it could contact the high-voltage lines.',
        'How far is far enough? Picture the antenna falling over. It must be far enough away that if it falls, no part of it can come within 10 feet of the power wires.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which spot is safe for the mast? Tap a spot in the picture to see where it would fall, or tap an answer.',
        options: [
          { id: 'a', label: 'Spot A', why: 'Dangerous. If it fell, it would land across the power wires, and the mast and coax could become live.' },
          { id: 'b', label: 'Spot B', why: 'Too close. A falling mast here would come within 10 feet of the wires. No part may come that close.' },
          { id: 'c', label: 'Spot C', right: true, why: 'Right. Even if it fell, no part could come within 10 feet of the power wires.' },
        ],
      },
      remember: 'Look for and stay clear of overhead power wires. If the antenna falls, no part of it may come within 10 feet of them. Never attach an antenna to a utility pole.',
    },
    {
      type: 'card',
      id: 'guys',
      idea: 'Guy lines and turnbuckles',
      covers: ['T0B05'],
      picture: { art: 'turnbuckle' },
      heading: 'Keep guy lines from working loose',
      text: [
        'Guy lines are the cables that hold a tower steady. A turnbuckle in each line is turned to set its tension: a frame with a threaded eye at each end.',
        'Wind makes a tower vibrate, and vibration can slowly unscrew a turnbuckle until the line goes slack. A safety wire threaded through the turnbuckle stops it turning.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What is the safety wire through the turnbuckle for?',
        options: [
          { id: 'hold', label: 'To hold the guy line if the turnbuckle breaks', why: 'A thin safety wire is not strong enough to hold a guy line. Its job is to stop the turnbuckle turning.' },
          { id: 'vib', label: 'To stop vibration from loosening the turnbuckle', right: true, why: 'Right. The wire stops it rotating, so vibration cannot unscrew it.' },
          { id: 'gnd', label: 'To give lightning a path to ground', why: 'Lightning grounding uses heavy conductors and ground rods at the base, not a turnbuckle safety wire.' },
        ],
      },
      remember: 'A safety wire through a turnbuckle prevents it from loosening from vibration.',
    },
    {
      type: 'card',
      id: 'tower-ground',
      idea: 'Ground rods for a tower',
      covers: ['T0B08', 'T0B11'],
      picture: { art: 'bonding' },
      heading: 'Give lightning many paths into the earth',
      text: [
        'A tower is the tallest thing around, so it must be grounded to carry lightning into the earth. A proper method is a separate eight-foot ground rod for each tower leg, bonded to the tower and to each other.',
        'The grounding requirements for your tower or antenna are set by your local electrical codes, not by the FCC rules in Part 97.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which of these is a proper way to ground a tower?',
        options: [
          { id: 'one', label: 'One four-foot rod next to the base', why: 'Not enough. A single short rod is far too little earth contact to carry lightning current safely.' },
          { id: 'pipe', label: 'A wire from the tower to a cold-water pipe', why: 'Dangerous. A water pipe is not a proper tower ground, and it would lead lightning into the house.' },
          { id: 'rods', label: 'An eight-foot rod at each leg, all bonded together', right: true, why: 'Right. Several bonded rods spread the lightning current into the earth by several paths.' },
        ],
      },
      remember: 'Ground a tower with separate eight-foot ground rods for each leg, bonded to the tower and each other. Local electrical codes set the grounding requirements.',
    },
    {
      type: 'card',
      id: 'ground-wire',
      idea: 'Short, direct ground wires',
      covers: ['T0B01', 'T0B10'],
      picture: { art: 'grounding' },
      heading: 'Lightning ground wires: short, direct, no sharp bends',
      text: [
        'Lightning is a very fast pulse. It takes the easiest path, and a long or twisting wire is not easy. At a sharp bend it may jump off the wire and go somewhere else, such as into your house.',
        'So run ground wires short and direct, and avoid sharp bends. Where a wire must turn, use a gentle, sweeping curve.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Good practice or a mistake? Tap an item, then tap where it goes.',
        slots: [
          { id: 'do', label: 'Good practice', rule: 'That is a mistake: it makes the path longer or bendier, so lightning may jump off the wire.' },
          { id: 'avoid', label: 'Mistake', rule: 'That is good practice: it keeps the lightning on the wire all the way to earth.' },
        ],
        items: [
          { id: 'short', label: 'A short, direct run to the rod', slot: 'do', why: 'Good practice. A short, direct path is the easiest one for lightning.' },
          { id: 'right', label: 'Neat right-angle bends', slot: 'avoid', why: 'A mistake. At a sharp bend the pulse may jump off the wire.' },
          { id: 'curve', label: 'A gentle curve where it must turn', slot: 'do', why: 'Good practice. A sweeping curve keeps the current in the wire.' },
          { id: 'loop', label: 'A drip loop in the ground wire', slot: 'avoid', why: 'A mistake. A drip loop is for a feed line entering a building. In a ground wire it only adds length and bends.' },
        ],
      },
      remember: 'Lightning ground connections must be short and direct. Sharp bends must be avoided.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T0B03', 'T0B06', 'T0B07', 'T0B11'],
      questions: [
        {
          q: 'A friend offers to climb your tower while you are out, since the job only takes ten minutes. Is that safe?',
          review: 'helper',
          covers: ['T0B03'],
          choices: [
            { label: 'Yes, if the job is quick', why: 'A fall takes a second. How long the job takes does not make climbing alone safe.' },
            { label: 'Yes, if they wear a harness', why: 'A harness is required, but it does not replace a helper who can assist and call for help.' },
            { label: 'No. Nobody should climb without a helper or observer', right: true, why: 'It is never safe to climb a tower without a helper or observer.' },
          ],
        },
        {
          q: 'You are choosing where to put up a mast near power lines. What decides if a spot is far enough?',
          review: 'power-lines',
          covers: ['T0B06'],
          choices: [
            { label: 'The mast must not touch the wires while it is standing', why: 'Not enough. Picture it falling: no part may then come within 10 feet of the wires.' },
            { label: 'If it fell, no part could come within 10 feet of the wires', right: true, why: 'That is the minimum safe distance.' },
            { label: 'Half a wavelength at your operating frequency', why: 'Wavelength has nothing to do with it. What matters is where the antenna could land if it fell.' },
          ],
        },
        {
          q: 'Your crank-up tower is raised. When may you climb it?',
          review: 'crank-up',
          covers: ['T0B07'],
          choices: [
            { label: 'Any time, if you are tied off', why: 'Tie-off does not stop the sections sliding down if the cable fails.' },
            { label: 'Only once it is retracted, or has safety locks installed', right: true, why: 'Then the sections cannot slide down and crush you.' },
          ],
        },
        {
          q: 'Who sets the grounding requirements for your tower?',
          review: 'tower-ground',
          covers: ['T0B11'],
          choices: [
            { label: 'The FCC, in the Part 97 rules', why: 'Part 97 covers how amateur stations operate. It does not set tower grounding requirements.' },
            { label: 'Your local electrical codes', right: true, why: 'The electrical code where you live sets the grounding requirements for towers and antennas.' },
            { label: 'Nobody. It is up to you', why: 'There are requirements: your local electrical codes set them.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T0B01', 'T0B02', 'T0B03', 'T0B04', 'T0B05', 'T0B06', 'T0B07', 'T0B08', 'T0B09', 'T0B10', 'T0B11'],
      facts: [
        { icon: IconHarness, text: 'To climb a tower: sufficient training, an approved climbing harness and tie-off at all times. Never climb without a helper or observer.', covers: ['T0B02', 'T0B03'] },
        { icon: IconCrank, text: 'Climb a crank-up tower only when it is retracted, or mechanical safety locking devices have been installed.', covers: ['T0B07'] },
        { icon: IconLines, text: 'Look for and stay clear of overhead power wires. If the antenna falls, no part may come within 10 feet of them. Never attach an antenna to a utility pole.', covers: ['T0B04', 'T0B06', 'T0B09'] },
        { icon: IconTurnbuckle, text: 'A safety wire through a turnbuckle prevents loosening from vibration.', covers: ['T0B05'] },
        { icon: IconRods, text: 'Ground a tower with separate eight-foot rods for each leg, bonded to the tower and each other. Local electrical codes set the requirements.', covers: ['T0B08', 'T0B11'] },
        { icon: IconStraight, text: 'Lightning ground connections must be short and direct, with no sharp bends.', covers: ['T0B01', 'T0B10'] },
      ],
    },
  ],
};
export default T0B_TOWER_SAFETY;
