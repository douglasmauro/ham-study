import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: What amateur radio is for (question group T1A, all 11 questions).
 * Every rule below comes from a T1A question and its keyed answer; the ids are in each
 * step's `covers`. The phonetic words for KJ7ABC (Kilo Juliett Seven Alfa Bravo Charlie)
 * use the standard phonetic alphabet the glossary drawing shows (Alfa, Bravo, Charlie).
 */

/* ---------- pictures ---------- */

/** An amateur station that can be raised above the Earth. `value` is its height in km. T1A07 */
function SpaceHeight({ value = 10, solved }: PicProps) {
  const y = 112 - value * 0.95; // 0 km sits just above the ground, 100 km near the top
  const line = 112 - 50 * 0.95;
  const above = value > 50;
  const c = above && solved ? 'ga-good' : 'ga-k';
  return (
    <Art label={`An amateur station ${value} kilometers above the Earth. A dashed line marks 50 kilometers. ${above ? 'It is above the line, so it is a space station.' : 'It is not above the line, so it is not a space station.'}`}>
      <path class="ga-w" d="M8 130Q120 114 232 130" />
      <T x={120} y={136} a="middle" c="ga-tm">Earth</T>
      <path class={`${above ? 'ga-good' : 'ga-w'} ga-dash ga-thin`} d={`M8 ${line}H232`} />
      <T x={10} y={line - 6} c="ga-tb">50 km up</T>
      <T x={10} y={20} c={above ? 'ga-tk ga-tb' : 'ga-tm'}>{above ? 'space station' : 'not a space station'}</T>
      <path class="ga-w ga-thin" d={`M204 124V${(y + 2).toFixed(1)}M200 ${(y + 2).toFixed(1)}H208`} />
      <T x={198} y={y + 4} a="end" c="ga-tm">{`${value} km`}</T>
      <rect class={c} x={120} y={y - 6} width={20} height={12} rx={2} />
      <path class={c} d={`M110 ${y}H120M140 ${y}H150`} />
      <rect class="ga-w ga-thin" x={98} y={y - 4} width={12} height={8} />
      <rect class="ga-w ga-thin" x={150} y={y - 4} width={12} height={8} />
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconPurpose = () => <Mini><path class="ls-mk" d="M8 40H40M14 40V22M24 40V14M34 40V26" /><path class="ls-ms ls-mthin" d="M10 10L18 6L26 9L36 4" /></Mini>;
const IconLicense = () => <Mini><rect class="ls-mw" x="6" y="8" width="22" height="30" rx="2" /><path class="ls-mw ls-mthin" d="M11 16H23M11 22H23" /><ellipse class="ls-mk" cx="36" cy="16" rx="8" ry="4" /><path class="ls-mk" d="M28 16V36C28 41 44 41 44 36V16" /></Mini>;
const IconTalk = () => <Mini><text class="ls-mt" x="24" y="30" text-anchor="middle">ABC</text></Mini>;
const IconShare = () => <Mini><path class="ls-mw" d="M8 42L13 14L18 42M30 42L35 14L40 42" /><path class="ls-mk" d="M18 20H30" /><path class="ls-ms ls-mthin" d="M24 8V30" /></Mini>;
const IconHigh = () => <Mini><path class="ls-mw" d="M4 44Q24 36 44 44" /><path class="ls-mk ls-mthin" d="M4 24H44" /><rect class="ls-mk" x="18" y="8" width="12" height="8" rx="1" /></Mini>;
const IconRaces = () => <Mini><path class="ls-mk" d="M24 6L40 12V24C40 34 32 40 24 43C16 40 8 34 8 24V12Z" /><path class="ls-ms ls-mthin" d="M16 24L22 30L32 18" /></Mini>;

/* ---------- the lesson ---------- */

export const T1A_PURPOSE_TERMS: Lesson = {
  id: 't1a-purpose-terms',
  title: 'What amateur radio is for',
  blurb: 'Why the service exists, who runs it, how your license arrives, and a few special stations.',
  sub: 'T1',
  groups: ['T1A'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t1a-purpose-terms',
      intro: 'Start with a short clip. After it you will meet each rule in a small situation.',
      covers: ['T1A01', 'T1A02', 'T1A05', 'T1A08', 'T1A07', 'T1A11'],
    },
    {
      type: 'card',
      id: 'purpose',
      idea: 'Why amateur radio exists',
      covers: ['T1A01'],
      picture: { art: 'amateur-radio-service' },
      heading: 'Hams get radio space for a reason',
      text: [
        'Radio frequencies are valuable, yet the government sets some aside for licensed amateurs, called hams. In return, the public gets something back.',
        'The rules list the reasons. One of them is to advance skills in the technical and communication phases of the radio art: getting better at building radios and at operating them.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug, KJ7ABC, is learning to build an antenna and to make clear contacts. Which purpose of the service is he serving?',
        options: [
          { id: 'cb', label: 'Giving as many citizens as possible a personal radio', why: 'That describes services anyone can use without a license. Amateur radio needs a license and has other purposes.' },
          { id: 'skill', label: 'Advancing skills in the technical and communication phases of radio', right: true, why: 'Yes. Building the antenna is the technical side, and making clear contacts is the communication side.' },
          { id: 'contest', label: 'Providing communications for international contests', why: 'Contests are fun, but they are not one of the purposes the rules list.' },
        ],
      },
      remember: 'One purpose of the Amateur Radio Service is advancing skills in the technical and communication phases of the radio art.',
    },
    {
      type: 'card',
      id: 'license',
      idea: 'The FCC, your license and the ULS',
      covers: ['T1A02', 'T1A04', 'T1A05'],
      picture: { art: 'license-grant' },
      heading: 'The FCC runs the service and grants your license',
      text: [
        'In the United States one agency makes and enforces the amateur rules: the FCC, the Federal Communications Commission. Clubs like the ARRL help hams, but they cannot make or enforce rules.',
        'After Doug passes his exam, the FCC sends him an email with a link to download his license grant. The proof is the license itself appearing in the FCC ULS, its online license database.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug passed his exam this morning. What proves the FCC has granted his license?',
        options: [
          { id: 'paper', label: 'The paper the examiners handed him after the exam', why: 'That paper only shows he passed the exam. It does not come from the FCC and is not a license.' },
          { id: 'uls', label: 'His license appearing in the FCC ULS database', right: true, why: 'Yes. Once the grant shows in the ULS, the license is issued. The FCC email links him to it.' },
          { id: 'mail', label: 'A letter from the FCC in his mailbox', why: 'The FCC does not mail the notice. It sends an email with a link to the license grant.' },
        ],
      },
      remember: 'The FCC regulates and enforces the rules. It emails you a link to your license, and the license appearing in the FCC ULS database proves it was granted.',
    },
    {
      type: 'card',
      id: 'coordinator',
      idea: 'Frequency coordinators',
      covers: ['T1A08', 'T1A09'],
      picture: { art: 'frequency-coordinator' },
      heading: 'Hams in an area choose who sorts out repeater channels',
      text: [
        'A repeater is a station that receives on one channel and sends the signal out again on another. Two repeaters on the same channels in one area would interfere.',
        'So a volunteer frequency coordinator recommends transmit and receive channels for repeaters and auxiliary stations. The FCC does not pick the coordinator: the local amateurs whose stations could be repeaters or auxiliary stations recognize one.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Jeff, K7DEF, wants to put up a new repeater in his town. Who recommends the channels he should use?',
        options: [
          { id: 'fcc', label: 'An FCC regional field office', why: 'FCC field offices handle enforcement. They do not recommend repeater channels.' },
          { id: 'vfc', label: 'A volunteer frequency coordinator recognized by local amateurs', right: true, why: 'Yes. The coordinator is a volunteer, chosen by the local amateurs who could run repeaters.' },
          { id: 'itu', label: 'The International Telecommunication Union', why: 'The ITU divides radio between countries and services. It does not choose channels for a town repeater.' },
        ],
      },
      remember: 'A volunteer frequency coordinator recommends repeater and auxiliary channels. Local amateurs whose stations could be repeaters or auxiliary stations select the coordinator.',
    },
    {
      type: 'card',
      id: 'interference',
      idea: 'Phonetics are encouraged, interference is prohibited',
      covers: ['T1A03', 'T1A11'],
      picture: { art: 'phonetic-alphabet' },
      heading: 'On the air: one thing encouraged, one forbidden',
      text: [
        'Talking by voice is called phone. On a noisy channel B, D and E sound alike, so the rules encourage a phonetic alphabet when you identify on phone: Doug says Kilo Juliett Seven Alfa Bravo Charlie for KJ7ABC. Encouraged means recommended, not required.',
        'Nobody owns a frequency, and signals sometimes clash by accident. What the rules prohibit is willful or malicious interference: jamming a station on purpose. Talking to other countries on VHF, or passing a message for a friend by a digital mode, is fine.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Sort each action. Tap an action, then tap where it belongs.',
        slots: [
          { id: 'ok', label: 'Allowed', rule: 'This one breaks a rule.' },
          { id: 'no', label: 'Prohibited', rule: 'The rules allow this one.' },
        ],
        items: [
          { id: 'jam', label: 'Jamming Jeff on purpose', slot: 'no', why: 'Prohibited. That is willful interference.' },
          { id: 'intl', label: 'A VHF contact abroad', slot: 'ok', why: 'Allowed. International contacts on VHF and higher are legal.' },
          { id: 'digi', label: 'Digital message for a friend', slot: 'ok', why: 'Allowed. Passing a message for someone else by a digital mode is fine.' },
          { id: 'phon', label: 'Call sign, no phonetics', slot: 'ok', why: 'Allowed. Phonetics are encouraged, not required.' },
        ],
      },
      remember: 'Phonetics are encouraged, not required, when you identify on phone. Willful or malicious interference is prohibited.',
    },
    {
      type: 'card',
      id: 'beacon',
      idea: 'Where automatic beacons live on HF',
      covers: ['T1A06'],
      picture: { art: 'beacon' },
      heading: 'Beacons get one small slice of HF',
      text: [
        'A beacon is a station that transmits on its own so others can check whether a band is open to distant places. Automatically controlled means no one sits at it: it runs by itself.',
        'On HF, automatically controlled beacons may only be on the 10 meter band, between 28.200 and 28.300 MHz. No other HF band has a beacon slice.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug wants to listen for automatic beacons on HF. Where should he tune?',
        options: [
          { id: 'any', label: 'Anywhere in the Technician part of 10 meters', why: 'Beacons are not spread over the whole Technician part. They sit in one narrow slice of it.' },
          { id: 'slice', label: '10 meters, between 28.200 and 28.300 MHz', right: true, why: 'Yes. On HF, that is the only place automatically controlled beacons are allowed.' },
          { id: 'every', label: 'A small slice of every HF band', why: 'Only 10 meters has a slice for automatic beacons on HF.' },
        ],
      },
      remember: 'On HF, automatically controlled beacons are on 10 meters, between 28.200 and 28.300 MHz.',
    },
    {
      type: 'card',
      id: 'space',
      idea: 'A space station is defined by height',
      covers: ['T1A07'],
      picture: { draw: SpaceHeight },
      heading: 'A space station is an amateur station more than 50 km up',
      text: [
        'The rules define a space station by height alone: an amateur station located more than 50 km above the Earth’s surface.',
        'It does not matter whether it has a crew or orbits the Earth. A station on the ground that talks through a satellite is not a space station: the one up high is.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Raise the amateur station until it counts as a space station.',
        label: 'Height',
        min: 10,
        max: 100,
        step: 10,
        start: 20,
        readouts: (v) => [{ label: 'Height', value: `${v} km` }, { label: 'Space station', value: v > 50 ? 'yes' : 'no' }],
        goal: (v) => v > 50,
        hint: (v) => (v === 50 ? 'Exactly 50 km is not enough. It must be more than 50 km up.' : `${v} km is too low. Raise it above 50 km.`),
        done: 'Now it is more than 50 km above the Earth, so it is a space station.',
      },
      remember: 'A space station is an amateur station located more than 50 km above the Earth’s surface.',
    },
    {
      type: 'card',
      id: 'races',
      idea: 'What RACES adds to your license',
      covers: ['T1A10'],
      picture: { art: 'control-operator' },
      heading: 'RACES needs a license and civil defense enrollment',
      text: [
        'RACES, the Radio Amateur Civil Emergency Service, is amateur radio used by civil defense groups during emergencies. The control operator is the person responsible for a station’s transmissions.',
        'To be control operator of a RACES station, a license is not enough. You must also be certified as currently enrolled by a civil defense organization.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug wants to be control operator of his county’s RACES station. Besides his license, what does he need?',
        options: [
          { id: 'none', label: 'Nothing more', why: 'For RACES a license alone is not enough.' },
          { id: 'ares', label: 'Membership in ARES', why: 'ARES is a separate volunteer program. Joining it is not what RACES requires.' },
          { id: 'cd', label: 'Certification that he is enrolled with a civil defense organization', right: true, why: 'Yes. A civil defense organization must certify that he is currently enrolled.' },
        ],
      },
      remember: 'A RACES control operator needs an FCC license and certification of current enrollment by a civil defense organization.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T1A02', 'T1A04', 'T1A05', 'T1A07', 'T1A08', 'T1A09'],
      questions: [
        {
          q: 'Jeff tells Doug that his ham club enforces the radio rules. Who really does?',
          review: 'license',
          covers: ['T1A02'],
          choices: [
            { label: 'The ham club', why: 'Clubs help hams, but they have no power to make or enforce the rules.' },
            { label: 'The FCC', right: true, why: 'The FCC regulates and enforces the amateur rules in the United States.' },
            { label: 'The volunteer examiners', why: 'Examiners give the exam. They do not enforce the rules.' },
          ],
        },
        {
          q: 'How can Doug be sure his license has been granted?',
          review: 'license',
          covers: ['T1A04', 'T1A05'],
          choices: [
            { label: 'It shows up in the FCC ULS database', right: true, why: 'The listing in the ULS is the proof of the grant.' },
            { label: 'He passed the exam, so it is automatic', why: 'Passing is not the grant. The license is issued when it appears in the ULS.' },
            { label: 'A letter arrives by post', why: 'The FCC sends an email with a link, not a letter.' },
          ],
        },
        {
          q: 'A ham station rides a balloon to 30 km above the ground. Is it a space station?',
          review: 'space',
          covers: ['T1A07'],
          choices: [
            { label: 'Yes, it is off the ground', why: 'Being off the ground is not enough. It must be more than 50 km up.' },
            { label: 'No, it is not more than 50 km up', right: true, why: 'A space station must be more than 50 km above the Earth’s surface.' },
          ],
        },
        {
          q: 'Who chooses the frequency coordinator for repeaters in Jeff’s area?',
          review: 'coordinator',
          covers: ['T1A08', 'T1A09'],
          choices: [
            { label: 'The FCC', why: 'The FCC does not pick coordinators.' },
            { label: 'The local amateurs whose stations could be repeaters or auxiliary stations', right: true, why: 'The coordinator is recognized by those local amateurs.' },
            { label: 'Whoever puts up the first repeater', why: 'Being first does not make you the coordinator. The local amateurs recognize one.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T1A01', 'T1A02', 'T1A03', 'T1A04', 'T1A05', 'T1A06', 'T1A07', 'T1A08', 'T1A09', 'T1A10', 'T1A11'],
      facts: [
        { icon: IconPurpose, text: 'Amateur radio exists in part to advance skills in the technical and communication phases of the radio art.', covers: ['T1A01'] },
        { icon: IconLicense, text: 'The FCC makes and enforces the rules. It emails you a link to your license grant, and the license appearing in the ULS database is the proof.', covers: ['T1A02', 'T1A04', 'T1A05'] },
        { icon: IconTalk, text: 'Phonetics are encouraged on phone, not required. Willful or malicious interference is prohibited.', covers: ['T1A03', 'T1A11'] },
        { icon: IconShare, text: 'A volunteer frequency coordinator, recognized by local amateurs who could run repeaters or auxiliary stations, recommends their channels.', covers: ['T1A08', 'T1A09'] },
        { icon: IconHigh, text: 'A space station is an amateur station more than 50 km up. HF automatic beacons are on 10 meters, 28.200 to 28.300 MHz.', covers: ['T1A06', 'T1A07'] },
        { icon: IconRaces, text: 'A RACES control operator needs a license plus certification of enrollment by a civil defense organization.', covers: ['T1A10'] },
      ],
    },
  ],
};
export default T1A_PURPOSE_TERMS;
