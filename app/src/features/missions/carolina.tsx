import type { Mission } from './model';
import { DipolePic, PathPic, SidebandPic, SwrPic, TalkPic, YardPic } from './pics';

const mhz = (khz: number) => (khz / 1000).toFixed(3) + ' MHz';

/** Simulated meter: lowest reading when each leg is 14 cm shorter than first cut. */
const BEST_TRIM = -14;
const swr = (cm: number) => 1.1 + 0.11 * Math.abs(cm - BEST_TRIM);
const trimText = (cm: number) => (cm === 0 ? 'as first cut' : cm < 0 ? `${-cm} cm shorter` : `${cm} cm longer`);

export const carolina: Mission = {
  id: 'reach-north-carolina',
  title: 'Reach a station in North Carolina from home',
  short: 'Reach North Carolina',
  blurb: 'Pick the band, build and tune a dipole, catch the opening and make the call.',
  sub: 'T9',
  minutes: 12,
  goal: 'Talk with a station in North Carolina from your own home station.',
  steps: [
    {
      // T3C02 long-distance ionospheric propagation is far more common on HF; T3C01 UHF rarely
      // heard beyond the radio horizon; T1B06 Technician HF phone is 10 meters only; T3B10 HF is 3 to 30 MHz.
      title: 'Pick the band',
      sub: 'T3',
      story: 'North Carolina is far beyond your horizon. Your Technician license gives you the VHF and UHF bands and a small part of HF (3 to 30 MHz).',
      pic: ({ solved }) => <PathPic far="North Carolina" showHop={solved} />,
      ask: 'Which band gives you a real chance by voice?',
      decision: {
        type: 'pick',
        chip: '10 meter band',
        options: [
          { text: '2 meters, through a repeater near home', why: 'A repeater helps you across town. Long-distance ionospheric propagation is far more common on HF than on VHF.' },
          { text: '10 meters, an HF band', correct: true, why: 'Long-distance ionospheric propagation is far more common on HF, and 10 meters is the one HF band where a Technician has phone privileges.' },
          { text: '70 centimeters, simplex', why: 'UHF signals are usually not propagated by the ionosphere, so they are rarely heard beyond the radio horizon.' },
          { text: '40 meters, an HF band', why: 'It is HF, but a Technician has HF phone privileges on the 10 meter band only.' },
        ],
      },
      covers: ['T3C02', 'T3C01', 'T1B06', 'T3B10'],
      recap: 'Long distance calls for HF, where the ionosphere carries signals far. 10 meters is the only HF band with Technician phone privileges.',
    },
    {
      // T1B01 Technician phone 28.300 to 28.500 MHz; T1B06; T1B09 stay off the exact edge;
      // T1A06 beacons at 28.200 to 28.300 MHz; T1B11 200 watts PEP in Technician HF segments.
      title: 'Check your privileges',
      sub: 'T1',
      story: 'The rules call voice “phone”. A Technician may use phone on only one slice of 10 meters. This strip is the bottom part of the band.',
      ask: 'Put the marker on a frequency where you may talk.',
      decision: {
        type: 'strip',
        label: 'Your frequency',
        min: 28000, max: 28600, step: 10, start: 28100,
        ticks: [28000, 28100, 28200, 28300, 28400, 28500, 28600],
        segments: [
          { from: 28000, to: 28190, label: '', why: 'No Technician phone down here. The phone segment is higher: 28.300 to 28.500 MHz.' },
          { from: 28200, to: 28290, label: '', why: 'Propagation beacons are found between 28.200 and 28.300 MHz. Technician phone starts above them, at 28.300 MHz.' },
          { from: 28300, to: 28500, label: 'Technician phone', why: '', ok: true },
          { from: 28510, to: 28600, label: '', why: 'Too high. The Technician phone segment ends at 28.500 MHz.' },
        ],
        edgeWhy: 'That is exactly on the edge of the segment. Leave room: the display can be a little off, the transmitter can drift, and your sidebands must not reach past the edge.',
        rightWhy: (v) => `${mhz(v)} is inside 28.300 to 28.500 MHz, the Technician phone segment, with room to both edges. The power limit here is 200 watts PEP.`,
        format: mhz,
        chip: (v) => `${(v / 1000).toFixed(2)} MHz, Technician phone`,
        set: (v) => {
          const wl = 300 / (v / 1000); // T3B06
          return {
            freq: (v / 1000).toFixed(2),
            wl: wl.toFixed(1),
            half: (wl / 2).toFixed(1),
            leg: (wl / 4).toFixed(1),
            eighth: (wl / 8).toFixed(1),
          };
        },
      },
      covers: ['T1B01', 'T1B06', 'T1B09', 'T1A06', 'T1B11'],
      recap: 'Technician phone on 10 meters is 28.300 to 28.500 MHz, at up to 200 watts PEP. You chose {freq} MHz, off the edges.',
    },
    {
      // T8A06 upper sideband on 10 meters, VHF and UHF; T8A01 SSB is a form of AM; T8A07 and T8A08
      // SSB is narrow, about 3 kHz; T8A09 FM voice is 10 to 15 kHz; T8A05 CW is the narrowest.
      title: 'Choose the mode',
      sub: 'T8',
      story: 'You are on {freq} MHz. Single sideband (SSB) is a form of amplitude modulation with a narrow signal, about 3 kHz wide. It sends just one of the two sidebands.',
      pic: ({ vars, solved }) => <SidebandPic freq={String(vars.freq)} solved={solved} />,
      ask: 'Which mode do you select?',
      decision: {
        type: 'pick',
        chip: 'SSB, upper sideband',
        options: [
          { text: 'SSB, lower sideband', why: 'Right mode, wrong side. Upper sideband is the normal choice on 10 meters.' },
          { text: 'SSB, upper sideband', correct: true, why: 'Upper sideband is normally used for 10 meter HF, VHF and UHF single sideband.' },
          { text: 'FM', why: 'An FM voice signal is 10 to 15 kHz wide. SSB is much narrower, about 3 kHz.' },
          { text: 'CW', why: 'CW is Morse code. It has the narrowest signal of all, but you want to talk.' },
        ],
      },
      covers: ['T8A06', 'T8A01', 'T8A07', 'T8A08', 'T8A09', 'T8A05'],
      recap: 'Voice on 10 meters is single sideband, about 3 kHz wide, and the convention is upper sideband.',
    },
    {
      // T3B06 wavelength in meters = 300 / frequency in MHz; T3B07 bands are named by wavelength;
      // T9A10 a half-wave dipole is strongest broadside to the antenna.
      title: 'Build the antenna',
      sub: 'T9',
      story: 'You will hang a half-wave dipole: a wire half a wavelength long, fed in the middle. Wavelength in meters is 300 divided by the frequency in MHz. The dipole sends its strongest signal broadside to the wire, so hang it side-on to North Carolina.',
      formula: '300 ÷ {freq} MHz ≈ {wl} m\nhalf-wave ≈ {half} m',
      pic: ({ vars, solved }) => <DipolePic total={`about ${vars.half} m`} leg={solved ? `${vars.leg} m` : '? m'} />,
      ask: 'About how long is each leg?',
      decision: {
        type: 'pick',
        chip: 'Dipole: {leg} m each leg',
        options: [
          { text: '{wl} m', why: 'That is a whole wavelength, twice the length of the dipole.' },
          { text: '{half} m', why: 'That is the whole dipole, end to end. The feed point splits it into two legs.' },
          { text: '{leg} m', correct: true, why: 'The feed point sits in the middle, so each leg is half of {half} m: a quarter wavelength.' },
          { text: '{eighth} m', why: 'Too short: that is half of one leg.' },
        ],
      },
      covers: ['T3B06', 'T3B07', 'T9A10'],
      recap: 'Wavelength is 300 ÷ {freq} ≈ {wl} m. A half-wave dipole is about {half} m end to end, {leg} m each leg, hung broadside to the other station.',
    },
    {
      // T9A05 shortening a dipole raises its resonant frequency; T7C04 1:1 is a perfect match;
      // T7C06 a 4:1 reading means an impedance mismatch; T9B12 SWR measures how well a load is matched.
      // The meter readings and the 14 cm figure are a simulation, not pool facts.
      title: 'Tune it',
      sub: 'T7',
      story: 'The wire is up, cut a little long on purpose. SWR shows how well the antenna is matched to the feed line: 1:1 is perfect, a high reading means a mismatch. Change both legs by the same amount and watch the needle.',
      pic: ({ value = 0 }) => <SwrPic swr={swr(value)} legScale={1 + value / 60} change={trimText(value)} />,
      ask: 'Set the wire where the SWR reading is lowest.',
      decision: {
        type: 'slider',
        label: 'Each leg',
        min: -30, max: 10, step: 2, start: 0, target: BEST_TRIM,
        lessLabel: 'Shorten', moreLabel: 'Lengthen',
        format: trimText,
        lowWhy: (v) => `The reading is ${swr(v).toFixed(1)}:1 and climbing again. You trimmed past the best point: the wire is now too short and resonates above your frequency. Lengthen it a little.`,
        highWhy: (v) => `The reading is still ${swr(v).toFixed(1)}:1. The wire is too long, so it resonates below your frequency. Shortening a dipole raises its resonant frequency.`,
        rightWhy: 'The needle is at its lowest, close to 1:1. Shortening the dipole raised its resonant frequency until it met your operating frequency.',
        chip: (v) => `Tuned: SWR ${swr(v).toFixed(1)}:1`,
      },
      covers: ['T9A05', 'T7C04', 'T7C06', 'T9B12'],
      recap: 'The wire started long, so it resonated too low. Shortening it raised the resonant frequency and brought the SWR down toward 1:1.',
    },
    {
      // T3C09 best time for 10 meter F region propagation; T3C10 6 and 10 meters via the F region at
      // the sunspot peak; T3A11 the ionosphere reflects HF; T3C06 ducting: VHF/UHF, about 300 miles;
      // T3C04 sporadic E gives occasional strong signals on 10, 6 and 2 meters.
      title: 'Check propagation',
      sub: 'T3',
      story: 'The station is ready. Now the signal must be bent back to Earth far away. For HF that happens in the ionosphere, and the F region does the long-distance work on 10 meters. It depends on the sun.',
      pic: ({ solved }) => <PathPic far="North Carolina" showHop note="F region of the ionosphere" sun={solved} />,
      ask: 'When is 10 meters most likely to reach that far?',
      decision: {
        type: 'pick',
        chip: 'Daytime, high sunspot activity',
        options: [
          { text: 'At night, when sunspot activity is high', why: 'The sunspots help, but the best time is from dawn to shortly after sunset, not overnight.' },
          { text: 'From dawn to shortly after sunset, when sunspot activity is high', correct: true, why: 'That is generally the best time for long-distance 10 meter propagation by the F region.' },
          { text: 'From dawn to shortly after sunset, when sunspot activity is low', why: 'Right time of day, but long-distance 10 meter F region propagation comes with high sunspot activity.' },
          { text: 'Any time: it travels by tropospheric ducting', why: 'Ducting is a VHF and UHF effect, good for about 300 miles. Your HF signal uses the ionosphere.' },
        ],
      },
      covers: ['T3C09', 'T3C10', 'T3A11', 'T3C06', 'T3C04'],
      recap: 'The F region carries 10 meters far from dawn to shortly after sunset when sunspot activity is high. Sporadic E can also bring occasional strong signals.',
    },
    {
      // T2A06 how to call CQ; T2A08 CQ means calling any station; T1F03 identify at least every
      // 10 minutes and at the end; T2A05 answer a CQ with the other call sign, then yours.
      title: 'Make the contact',
      sub: 'T2',
      story: 'It is mid-morning and you hear distant stations. You find a clear spot near {freq} MHz. You know nobody there yet, so you will call CQ: “calling any station”.',
      pic: ({ solved }) => <TalkPic lines={['CQ CQ CQ', 'this is [your call sign]']} caption="clear frequency, upper sideband" solved={solved} timer="call sign every 10 min, and at the end" />,
      ask: 'How do you call, and how often do you identify?',
      decision: {
        type: 'pick',
        chip: 'CQ, call sign every 10 minutes',
        options: [
          { text: 'Say “CQ” a few times, “this is” and your call sign, then listen. Give your call sign at least every 15 minutes and at the end.', why: 'The call is right, but the limit is 10 minutes, not 15.' },
          { text: 'Say your call sign once and “listening for a call”. No answer? Change frequency.', why: 'Too brief to be found. Repeat CQ a few times with your call sign, pause to listen, and repeat as necessary.' },
          { text: 'Say “CQ” a few times, “this is” and your call sign, then listen. Give your call sign at least every 10 minutes and at the end.', correct: true, why: 'That is the effective way to seek a call from any station, and the rule: identify at least every 10 minutes during and at the end of a communication.' },
          { text: 'Hold the transmit button for 10 seconds without speaking, then give your call sign.', why: 'A silent carrier tells nobody what you want. Say CQ: it means calling any station.' },
        ],
      },
      covers: ['T2A06', 'T2A08', 'T1F03', 'T2A05'],
      recap: 'You called CQ a few times with your call sign and listened. A station answers with your call sign followed by theirs. Identify at least every 10 minutes and at the end.',
    },
    {
      // T0C13 the station licensee is responsible; T0C04 factors in RF exposure; T0C08 relocating
      // antennas reduces exposure; T0C07 RF burn; T0B06 10 feet from power wires if it falls;
      // T0B09 never use a utility pole; T0C01 radio signals are non-ionizing; T0C09 re-evaluate on changes.
      title: 'Stay safe',
      sub: 'T0',
      story: 'Contact made. Now make the station safe to keep. As the station licensee, you must make sure nobody is exposed to RF energy above the FCC limits. Exposure depends on frequency, power, the antenna’s pattern and how far people are from it.',
      pic: ({ solved }) => <YardPic solved={solved} />,
      ask: 'Where does the dipole stay?',
      decision: {
        type: 'pick',
        chip: 'Antenna high and clear',
        options: [
          { text: 'Low along the porch rail, easy to reach', why: 'People would be right next to it, and touching an antenna during a transmission can cause an RF burn.' },
          { text: 'One end tied to the utility pole for height', why: 'Never. The antenna could contact high-voltage power lines.' },
          { text: 'High between the trees, away from people and the power line', correct: true, why: 'Distance lowers exposure, nobody can touch the wire, and if it falls no part can come within 10 feet of the power wires.' },
          { text: 'Anywhere: radio waves are non-ionizing, so there is nothing to check', why: 'Radio signals are non-ionizing, but RF exposure limits still apply and you are responsible for meeting them.' },
        ],
      },
      covers: ['T0C13', 'T0C04', 'T0C08', 'T0C07', 'T0B06', 'T0B09', 'T0C01', 'T0C09'],
      recap: 'Keep the antenna away from people and power lines. Re-evaluate RF exposure whenever you change something in the transmitter or antenna system.',
    },
  ],
};
