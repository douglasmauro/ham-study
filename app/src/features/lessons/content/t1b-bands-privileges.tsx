import { Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Bands and privileges (question group T1B, all 12 questions).
 * Frequencies, segments and power limits come from the T1B questions and their keyed
 * answers; the ids are in each step's `covers`. The band edges 50 to 54 MHz (6 meters)
 * and 144 to 148 MHz (2 meters) are the ones the T1B03 and T1B04 explanations give.
 */

/* ---------- pictures ---------- */

const X0 = 14;
const PX = 212 / 700; // px per kHz: the strip runs 28.000 to 28.700 MHz
const kx = (khz: number) => +(X0 + (khz - 28000) * PX).toFixed(1);

/** The Technician part of 10 meters, with Doug's voice signal placed by the slider (kHz). T1B01, T1B06 */
function TenMeterStrip({ value = 28100, solved }: PicProps) {
  const x = kx(value);
  const tone = solved ? 'ga-good' : 'ga-s';
  const a = kx(28300);
  const b = kx(28500);
  return (
    <Art label={`The Technician part of 10 meters. 28.000 to 28.300 megahertz is for CW and data. 28.300 to 28.500 is for phone. Above 28.500 is not for Technicians. Doug's voice signal sits at ${(value / 1000).toFixed(3)} megahertz.`}>
      <T x={Math.min(Math.max(x, 44), 196)} y={22} a="middle" c={solved ? 'ga-tb' : 'ga-ts ga-tb'}>Doug's voice</T>
      <path class={tone} d={`M${x - 9} 66C${x - 7} 38 ${x + 7} 38 ${x + 9} 66`} />
      <path class={`${tone} ga-thin`} d={`M${x} 30V66`} />
      <rect class="ga-fk ga-soft" x={X0} y={68} width={a - X0} height={26} />
      <rect class="ga-fs ga-soft" x={a} y={68} width={b - a} height={26} />
      <path class="ga-w" d={`M${X0} 68H226M${X0} 94H226M${X0} 68V94M${a} 64V98M${b} 64V98`} />
      <T x={(X0 + a) / 2} y={85} a="middle" c="ga-tk ga-tb">CW and data</T>
      <T x={(a + b) / 2} y={85} a="middle" c="ga-ts ga-tb">phone</T>
      <T x={(b + 226) / 2} y={85} a="middle" c="ga-tm">not Tech</T>
      <T x={X0} y={112} c="ga-tm">28.000</T>
      <T x={a} y={112} a="middle" c="ga-tm">28.300</T>
      <T x={b} y={112} a="middle" c="ga-tm">28.500</T>
      <T x={120} y={132} a="middle" c="ga-tm">10 meters, in MHz</T>
    </Art>
  );
}

/** 6 meters and 2 meters, each with its CW-only bottom slice. T1B05, T1B07, T1B10 */
function VhfStrips() {
  const strip = (y: number, name: string, lo: string, hi: string, cw: string) => (
    <>
      <T x={14} y={y - 6} c="ga-tb">{`${name}: ${lo} to ${hi} MHz`}</T>
      <rect class="ga-fk ga-soft" x={14} y={y} width={18} height={22} />
      <rect class="ga-fs ga-soft" x={32} y={y} width={194} height={22} />
      <path class="ga-w" d={`M14 ${y}H226V${y + 22}H14ZM32 ${y}V${y + 22}`} />
      <T x={129} y={y + 15} a="middle" c="ga-ts">voice, data and CW</T>
      <T x={14} y={y + 36} c="ga-tk">{cw}</T>
    </>
  );
  return (
    <Art label="Two bands drawn as strips. 6 meters runs from 50 to 54 megahertz and 2 meters from 144 to 148 megahertz. In each, the bottom 100 kilohertz is CW only: 50.0 to 50.1 and 144.0 to 144.1. The rest allows voice, data and CW.">
      {strip(22, '6 meters', '50', '54', 'CW only: 50.0 to 50.1')}
      {strip(86, '2 meters', '144', '148', 'CW only: 144.0 to 144.1')}
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconBands = () => <Mini><rect class="ls-mk" x="4" y="18" width="16" height="12" rx="2" /><rect class="ls-mk" x="28" y="18" width="16" height="12" rx="2" /><path class="ls-mw ls-mthin" d="M4 38H44" /></Mini>;
const IconTen = () => (
  <Mini>
    <path class="ls-mw" d="M4 30H44" />
    <path class="ls-mk" d="M4 30H24" />
    <path class="ls-ms" d="M24 30H38" />
    <path class="ls-ms ls-mthin" d="M27 28C28 14 34 14 35 28" />
  </Mini>
);
const IconEdge = () => <Mini><path class="ls-mk" d="M34 6V42" /><path class="ls-ms" d="M10 40C14 14 22 14 26 40" /><path class="ls-mw ls-mthin" d="M4 40H44" /></Mini>;
const IconCw = () => <Mini><path class="ls-ms" d="M4 24H10M14 24H26M30 24H34M38 24H44" /><path class="ls-mk ls-mthin" d="M4 34H44" /></Mini>;
const IconPower = () => <Mini><rect class="ls-mk" x="8" y="28" width="10" height="14" /><rect class="ls-ms" x="28" y="8" width="10" height="34" /></Mini>;
const IconShare = () => <Mini><rect class="ls-mw" x="4" y="16" width="40" height="16" rx="2" /><path class="ls-mk" d="M30 16V32" /></Mini>;

/* ---------- the lesson ---------- */

const mhz = (khz: number) => (khz / 1000).toFixed(3);

export const T1B_BANDS_PRIVILEGES: Lesson = {
  id: 't1b-bands-privileges',
  title: 'Bands and privileges',
  blurb: 'Which frequencies and modes a Technician may use, and with how much power.',
  sub: 'T1',
  groups: ['T1B'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t1b-bands-privileges',
      intro: 'Start with a short clip. After it you will place signals where a Technician may use them.',
      covers: ['T1B03', 'T1B04', 'T1B01', 'T1B06', 'T1B11', 'T1B12', 'T1B08'],
    },
    {
      type: 'card',
      id: 'bands',
      idea: 'Which band a frequency is in',
      covers: ['T1B03', 'T1B04'],
      picture: { art: 'band' },
      heading: 'A band is a range of frequencies',
      text: [
        'Hams may not transmit just anywhere. They use bands: set ranges of frequencies. Each band is named by its rough wavelength, 300 divided by the frequency in megahertz.',
        'The 6 meter band runs from 50 to 54 MHz. The 2 meter band runs from 144 to 148 MHz. A frequency just outside a band, like 49.00 MHz, is not an amateur frequency at all.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Put each frequency in its band. Tap a frequency, then tap the band.',
        slots: [
          { id: 'six', label: '6 meters', sub: '50 to 54 MHz', rule: 'The 6 meter band is 50 to 54 MHz.' },
          { id: 'two', label: '2 meters', sub: '144 to 148 MHz', rule: 'The 2 meter band is 144 to 148 MHz.' },
          { id: 'none', label: 'Not in either', sub: 'outside both bands', rule: 'This frequency is inside one of the two bands.' },
        ],
        items: [
          { id: 'a', label: '52.525 MHz', slot: 'six', why: '52.525 is between 50 and 54, so it is on 6 meters. 300 ÷ 52.525 is about 5.7.' },
          { id: 'b', label: '146.52 MHz', slot: 'two', why: '146.52 is between 144 and 148, so it is on 2 meters. 300 ÷ 146.52 is about 2.05.' },
          { id: 'c', label: '49.00 MHz', slot: 'none', why: '49.00 is just below 50, so it is outside the 6 meter band. Close is not inside.' },
          { id: 'd', label: '145.00 MHz', slot: 'two', why: '145.00 is between 144 and 148, so it is on 2 meters.' },
        ],
      },
      remember: '52.525 MHz is in the 6 meter band (50 to 54 MHz). 146.52 MHz is in the 2 meter band (144 to 148 MHz).',
    },
    {
      type: 'card',
      id: 'ten',
      idea: 'Technician voice on HF: 10 meters only',
      covers: ['T1B01', 'T1B06'],
      picture: { draw: TenMeterStrip },
      heading: 'On HF, a Technician talks by voice only on 10 meters',
      text: [
        'HF is 3 to 30 MHz. A Technician gets a slice of the 10 meter band, near 28 MHz. From 28.000 to 28.300 MHz it is for CW, which is Morse code, and for data. From 28.300 to 28.500 MHz is the phone part, where voice is allowed.',
        'That is the only HF band where a Technician may use phone.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Doug wants to talk by voice on 10 meters. Slide his signal into the part where he may.',
        label: 'Frequency',
        min: 28000,
        max: 28700,
        step: 50,
        start: 28100,
        readouts: (v) => [{ label: 'Frequency', value: `${mhz(v)} MHz` }, { label: 'Voice allowed', value: v > 28300 && v < 28500 ? 'yes' : 'no' }],
        goal: (v) => v > 28300 && v < 28500,
        hint: (v) =>
          v === 28300 || v === 28500
            ? `${mhz(v)} MHz is right on the edge of the voice part. Move further inside: the next card shows why.`
            : v < 28300
              ? `${mhz(v)} MHz is in the CW and data part. A Technician may not use voice here. Raise it.`
              : `${mhz(v)} MHz is above the Technician part of 10 meters. Lower it.`,
        done: 'There. Between 28.300 and 28.500 MHz a Technician may use voice. It is the only HF voice segment a Technician has.',
      },
      remember: 'Technician phone on HF is on 10 meters only, from 28.300 to 28.500 MHz.',
    },
    {
      type: 'card',
      id: 'edge',
      idea: 'Stay away from band edges',
      covers: ['T1B09'],
      picture: { art: 'band-edge' },
      heading: 'Never sit right on a band edge',
      text: [
        'A signal is not a thin line on the dial. Voice spreads a little to each side of the frequency shown: those parts are called sidebands. Your display can also be slightly off, and the frequency can drift as the radio warms up.',
        'All of your signal must stay inside the band or segment. So leave a little room at every edge.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug sets his radio to exactly 28.500 MHz, the top of his voice segment. Why is that a bad idea?',
        options: [
          { id: 'cal', label: 'His display might be a little off', why: 'True, but that is not the only reason. Look at the other choices too.' },
          { id: 'side', label: 'His sidebands could spill past the edge', why: 'True, but that is not the only reason. Look at the other choices too.' },
          { id: 'drift', label: 'His frequency could drift', why: 'True, but that is not the only reason. Look at the other choices too.' },
          { id: 'all', label: 'All of these', right: true, why: 'Yes. Display error, sidebands and drift could each carry part of his signal outside the segment.' },
        ],
      },
      remember: 'Keep off the exact band edge: allow for display error, sidebands and drift.',
    },
    {
      type: 'card',
      id: 'above50',
      idea: 'Modes above 50 MHz',
      covers: ['T1B05', 'T1B07', 'T1B10'],
      picture: { draw: VhfStrips },
      heading: 'Above 50 MHz, almost everything is open',
      text: [
        'On the bands above 50 MHz a Technician may use voice, data and CW. Every one of these bands has at least some part where phone, including SSB voice, is allowed. Data modes like FT8 work on 6 and 2 meters, and on 10 meters below 28.300 MHz.',
        'One catch: the bottom 100 kHz of 6 meters, 50.0 to 50.1 MHz, and of 2 meters, 144.0 to 144.1 MHz, is CW only. No voice and no data there.',
      ],
      interaction: {
        kind: 'sort',
        prompt: 'Is each one allowed for a Technician? Tap one, then tap the answer.',
        slots: [
          { id: 'yes', label: 'Allowed', rule: 'A Technician may not do this.' },
          { id: 'no', label: 'Not allowed', rule: 'A Technician may do this.' },
        ],
        items: [
          { id: 'a', label: 'FT8 on 28.100 MHz', slot: 'yes', why: 'Allowed. 28.000 to 28.300 MHz is for CW and data, and FT8 is a data mode.' },
          { id: 'b', label: 'Voice on 28.200 MHz', slot: 'no', why: 'Not allowed. Technician voice on 10 meters starts at 28.300 MHz.' },
          { id: 'c', label: 'FT8 on 6 meters', slot: 'yes', why: 'Allowed. Technicians may use data modes on 6 meters.' },
          { id: 'd', label: 'Voice on 50.05 MHz', slot: 'no', why: 'Not allowed. 50.0 to 50.1 MHz is CW only.' },
          { id: 'e', label: 'SSB voice on 2 meters', slot: 'yes', why: 'Allowed. Every band above 50 MHz has some part where SSB phone is allowed.' },
          { id: 'f', label: 'Data on 144.05 MHz', slot: 'no', why: 'Not allowed. 144.0 to 144.1 MHz is CW only.' },
        ],
      },
      remember: '50.0 to 50.1 MHz and 144.0 to 144.1 MHz are CW only. SSB phone is allowed in some segment of every band above 50 MHz. Technicians may use data like FT8 on 10, 6 and 2 meters.',
    },
    {
      type: 'card',
      id: 'iss',
      idea: 'Any Technician may call the ISS',
      covers: ['T1B02'],
      picture: { art: 'iss' },
      heading: 'Your license reaches the space station',
      text: [
        'The International Space Station, the ISS, carries an amateur station that uses VHF frequencies.',
        'A Technician may transmit on those VHF frequencies, so any amateur with a Technician class or higher license may contact the ISS. No other permission is needed.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug, a new Technician, hears the ISS on VHF. What does he need before he calls it?',
        options: [
          { id: 'gen', label: 'A General class license', why: 'A General license is not needed. A Technician may already use the VHF frequencies involved.' },
          { id: 'nasa', label: 'Approval from NASA', why: 'No NASA approval is needed. The amateur license is all the permission he needs.' },
          { id: 'none', label: 'Nothing more: his Technician license is enough', right: true, why: 'Yes. Any amateur with a Technician class or higher license may contact the ISS on VHF.' },
        ],
      },
      remember: 'Any amateur with a Technician class or higher license may contact the ISS on VHF.',
    },
    {
      type: 'card',
      id: 'power',
      idea: 'Technician power limits',
      covers: ['T1B11', 'T1B12'],
      picture: { art: 'technician-class' },
      heading: 'How much power: 200 watts on HF, 1500 above 30 MHz',
      text: [
        'Power limits are given as PEP, peak envelope power: the transmitter output at the highest peaks of the signal.',
        'In their HF segments, such as 10 meters, Technicians may use up to 200 watts PEP. Above 30 MHz, apart from some specific restrictions, the limit is 1500 watts PEP.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug runs 300 watts PEP on 28.400 MHz. Jeff, K7DEF, also a Technician, runs 500 watts PEP on 146.52 MHz. Who is over the limit?',
        options: [
          { id: 'jeff', label: 'Jeff', why: '146.52 MHz is above 30 MHz, where the limit is 1500 watts PEP. Jeff is fine. Look at Doug on HF.' },
          { id: 'doug', label: 'Doug', right: true, why: 'Yes. 28.400 MHz is HF, where a Technician may use 200 watts PEP. Jeff is above 30 MHz, where the limit is 1500 watts PEP.' },
          { id: 'both', label: 'Both', why: 'Jeff is fine: above 30 MHz the limit is 1500 watts PEP. Only one of them is over.' },
          { id: 'none', label: 'Neither', why: 'On HF a Technician may use only 200 watts PEP, and Doug is on HF.' },
        ],
      },
      remember: 'Technicians: 200 watts PEP in their HF segments, and 1500 watts PEP above 30 MHz, apart from some specific restrictions.',
    },
    {
      type: 'card',
      id: 'secondary',
      idea: 'Secondary means stay out of the way',
      covers: ['T1B08'],
      picture: { art: 'secondary-service' },
      heading: 'Where hams are secondary, others come first',
      text: [
        'Some band segments are shared with other radio services. Where amateur radio is secondary, another service is primary and has priority.',
        'So in those segments Doug may hear non-amateur stations, and he must avoid interfering with them.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug is in a segment where amateurs are secondary and hears a non-amateur station. What must he do?',
        options: [
          { id: 'leave', label: 'Ask it to move, since hams were there first', why: 'Secondary means the other service has priority. Doug is the one who must stay out of its way.' },
          { id: 'avoid', label: 'Avoid interfering with it', right: true, why: 'Yes. Where hams are secondary, they must not interfere with the other stations there.' },
          { id: 'foreign', label: 'Give way only to foreign hams', why: 'Secondary is not about foreign amateurs. It is about other radio services having priority.' },
        ],
      },
      remember: 'Where amateurs are secondary, you may find non-amateur stations and must avoid interfering with them.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T1B01', 'T1B06', 'T1B07', 'T1B11', 'T1B12', 'T1B08'],
      questions: [
        {
          q: 'Doug wants to chat by voice on HF. Where may he do it?',
          review: 'ten',
          covers: ['T1B01', 'T1B06'],
          choices: [
            { label: '10 meters, 28.000 to 28.300 MHz', why: 'That part is for CW and data. Voice starts at 28.300 MHz.' },
            { label: '10 meters, 28.300 to 28.500 MHz', right: true, why: 'That is the only HF segment where a Technician may use voice.' },
            { label: 'On any HF band', why: 'A Technician has HF voice on 10 meters only.' },
          ],
        },
        {
          q: 'Jeff tunes to 144.05 MHz. What may he send there?',
          review: 'above50',
          covers: ['T1B07'],
          choices: [
            { label: 'Voice', why: '144.0 to 144.1 MHz is CW only, so voice is not allowed there.' },
            { label: 'CW only', right: true, why: 'The bottom 100 kHz of 2 meters, 144.0 to 144.1 MHz, is CW only.' },
            { label: 'Anything, it is on 2 meters', why: 'Most of 2 meters allows any mode, but the bottom 100 kHz is CW only.' },
          ],
        },
        {
          q: 'Doug moves from 10 meters up to 2 meters. What happens to his power limit?',
          review: 'power',
          covers: ['T1B11', 'T1B12'],
          choices: [
            { label: 'It stays at 200 watts PEP', why: '200 watts PEP is the limit on HF. Above 30 MHz it is higher.' },
            { label: 'It rises from 200 to 1500 watts PEP', right: true, why: 'On HF a Technician may use 200 watts PEP. Above 30 MHz, the limit is 1500 watts PEP.' },
            { label: 'It drops to 50 watts PEP', why: 'There is no such drop. Above 30 MHz the limit is 1500 watts PEP.' },
          ],
        },
        {
          q: 'In a segment where hams are secondary, who must stay out of whose way?',
          review: 'secondary',
          covers: ['T1B08'],
          choices: [
            { label: 'The other service must avoid the hams', why: 'The other service is primary, so it has priority.' },
            { label: 'The hams must avoid interfering with the other service', right: true, why: 'Secondary users must not interfere with the primary service.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T1B01', 'T1B02', 'T1B03', 'T1B04', 'T1B05', 'T1B06', 'T1B07', 'T1B08', 'T1B09', 'T1B10', 'T1B11', 'T1B12'],
      facts: [
        { icon: IconBands, text: '6 meters is 50 to 54 MHz, so 52.525 MHz is in it. 2 meters is 144 to 148 MHz, so 146.52 MHz is in it.', covers: ['T1B03', 'T1B04'] },
        { icon: IconTen, text: 'Technician voice on HF is on 10 meters only, 28.300 to 28.500 MHz. Below that, 28.000 to 28.300 is CW and data.', covers: ['T1B01', 'T1B06'] },
        { icon: IconEdge, text: 'Stay off the exact band edge: display error, sidebands and drift could put part of your signal outside.', covers: ['T1B09'] },
        { icon: IconCw, text: 'Above 50 MHz: 50.0 to 50.1 and 144.0 to 144.1 MHz are CW only, and every band has some SSB phone segment. Data like FT8 works on 10, 6 and 2 meters. Any Technician may contact the ISS on VHF.', covers: ['T1B02', 'T1B05', 'T1B07', 'T1B10'] },
        { icon: IconPower, text: 'Technician power: 200 watts PEP in the HF segments, 1500 watts PEP above 30 MHz apart from some restrictions.', covers: ['T1B11', 'T1B12'] },
        { icon: IconShare, text: 'Where amateurs are secondary, expect non-amateur stations and avoid interfering with them.', covers: ['T1B08'] },
      ],
    },
  ],
};
export default T1B_BANDS_PRIVILEGES;
