import { Arrow, Art, Mini, T } from '../drawkit';
import type { Lesson, PicProps } from '../types';

/*
 * Lesson: Licenses and call signs (question group T1C, all 11 questions).
 * It follows one new ham's license through its life: the classes, the grant, the call sign,
 * the email rule, operating abroad and at sea, the ten-year term, renewal and the grace period.
 * Every fact comes from a T1C question and its keyed answer; the ids are in each step's `covers`.
 * The learner is Doug, KJ7ABC; his friend is Jeff, K7DEF.
 */

/* ---------- pictures ---------- */

/** Doug's path after the exam: certificate, FCC database, license in the mail. Each stop can be tapped. T1C10 */
function GrantPath({ picked, solved, onPick }: PicProps) {
  const tone = (id: string, base: string) => (picked !== id ? base : id === 'db' && solved ? 'ga-good' : id === 'db' ? base : 'ga-bad');
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  return (
    <Art label="Doug's path after passing the exam. First a certificate from the exam session, then his license listed in the FCC license database, then a paper license in the mail.">
      <T x={120} y={16} a="middle" c="ga-tm">after the exam, left to right</T>
      {/* certificate */}
      <rect class={tone('cert', 'ga-w')} x="22" y="34" width="36" height="46" rx="3" />
      <path class={`${tone('cert', 'ga-w')} ga-thin`} d="M30 46H50M30 54H50M30 62H42" />
      <circle class={tone('cert', 'ga-w')} cx="49" cy="70" r="5" />
      {/* database */}
      <ellipse class={tone('db', 'ga-k')} cx="120" cy="38" rx="18" ry="6" />
      <path class={tone('db', 'ga-k')} d="M102 38V74M138 38V74M102 74A18 6 0 0 0 138 74M102 50A18 6 0 0 0 138 50M102 62A18 6 0 0 0 138 62" />
      {/* envelope */}
      <rect class={tone('mail', 'ga-w')} x="182" y="40" width="40" height="30" rx="2" />
      <path class={tone('mail', 'ga-w')} d="M182 42L202 58L222 42" />
      <Arrow x1={66} y1={57} x2={92} y2={57} c="ga-w ga-thin" />
      <Arrow x1={146} y1={57} x2={174} y2={57} c="ga-w ga-thin" />
      <T x={40} y={98} a="middle" c="ga-tb">certificate</T>
      <T x={40} y={112} a="middle" c="ga-tm">at the exam</T>
      <T x={120} y={98} a="middle" c="ga-tk ga-tb">FCC license</T>
      <T x={120} y={112} a="middle" c="ga-tk ga-tb">database</T>
      <T x={202} y={98} a="middle" c="ga-tb">license</T>
      <T x={202} y={112} a="middle" c="ga-tm">in the mail</T>
      {solved && <T x={120} y={134} a="middle" c="ga-tk ga-tb">listed in the database: on the air</T>}
      {onPick && <rect x="12" y="26" width="64" height="92" style={hit} onClick={() => onPick('cert')} />}
      {onPick && <rect x="88" y="26" width="64" height="92" style={hit} onClick={() => onPick('db')} />}
      {onPick && <rect x="164" y="26" width="72" height="92" style={hit} onClick={() => onPick('mail')} />}
    </Art>
  );
}

/** Doug's and Jeff's call signs, letter by letter. Each row can be tapped. T1C05 */
function CallShapes({ picked, solved, onPick }: PicProps) {
  const tone = (id: string) => (picked !== id ? '' : id === 'doug' && solved ? 'ga-good' : id === 'doug' ? '' : 'ga-bad');
  const hit = { pointerEvents: 'all' as const, cursor: onPick ? 'pointer' : 'default' };
  const chars = (s: string, xs: number[], y: number, c: string) =>
    s.split('').map((ch, i) => <text x={xs[i]} y={y} class={`ga-t ga-tl ga-mono ${c}`} text-anchor="middle">{ch}</text>);
  const row = (id: string, y: number) => {
    const t = tone(id);
    return t ? <rect class={t} x="56" y={y - 22} width="176" height="46" rx="6" /> : null;
  };
  return (
    <Art label="Doug's call sign KJ7ABC: two letters, a digit, then three letters. Jeff's call sign K7DEF: one letter, a digit, then three letters.">
      {row('doug', 42)}
      {row('jeff', 98)}
      <T x={14} y={42} c="ga-tb">Doug</T>
      {chars('KJ', [78, 94], 42, 'ga-tk')}
      {chars('7', [124], 42, 'ga-ts')}
      {chars('ABC', [154, 170, 186], 42, 'ga-tk')}
      <T x={142} y={60} a="middle" c="ga-tm">2 letters, digit, 3 letters</T>
      <T x={14} y={98} c="ga-tb">Jeff</T>
      {chars('K', [94], 98, 'ga-tk')}
      {chars('7', [124], 98, 'ga-ts')}
      {chars('DEF', [154, 170, 186], 98, 'ga-tk')}
      <T x={142} y={116} a="middle" c="ga-tm">1 letter, digit, 3 letters</T>
      {solved && <T x={120} y={135} a="middle" c="ga-tk ga-tb">2 by 3 is the Group D shape</T>}
      {onPick && <rect x="8" y="18" width="226" height="50" style={hit} onClick={() => onPick('doug')} />}
      {onPick && <rect x="8" y="74" width="226" height="50" style={hit} onClick={() => onPick('jeff')} />}
    </Art>
  );
}

/** The ten-year term, with the last year enlarged and a marker at -`value` days before expiry. T1C07, T1C08 */
function RenewWindow({ value = -360, solved }: PicProps) {
  const days = -value;
  const x = 220 - (days * 200) / 360;
  const open = days <= 90;
  return (
    <Art label={`A ten year license term, from granted to expires. The last year is enlarged below. The renewal window is the last 90 days. The marker is ${days} days before expiry, ${open ? 'inside' : 'before'} the window.`}>
      <rect class="ga-w" x="20" y="22" width="200" height="12" rx="2" />
      <rect class="ga-fk ga-soft" x="200" y="22" width="20" height="12" />
      <T x={20} y={48} c="ga-tm">granted</T>
      <T x={120} y={48} a="middle" c="ga-tk ga-tb">10 years</T>
      <T x={220} y={48} a="end" c="ga-tm">expires</T>
      <path class="ga-w ga-thin ga-dash" d="M200 55L20 79M220 55L220 79" />
      <rect class="ga-w" x="20" y="82" width="200" height="14" rx="2" />
      <rect class="ga-fk ga-soft" x="170" y="82" width="50" height="14" />
      <path class="ga-k ga-thin" d="M170 78V100" />
      <T x={20} y={114} c="ga-tm">1 year before</T>
      <T x={170} y={114} a="end" c="ga-tk ga-tb">90 days</T>
      <T x={220} y={114} a="end" c="ga-tm">expires</T>
      <path class={`${solved ? 'ga-good' : open ? 'ga-k' : 'ga-s'} ga-thick`} d={`M${x.toFixed(1)} 74V102`} />
      <T x={120} y={134} a="middle" c={open ? 'ga-tk ga-tb' : 'ga-tm'}>{open ? 'inside the renewal window' : 'too early to renew'}</T>
    </Art>
  );
}

/* ---------- recap icons ---------- */

const IconClasses = () => <Mini><rect class="ls-mk" x="4" y="30" width="12" height="12" /><rect class="ls-mk" x="18" y="20" width="12" height="22" /><rect class="ls-mk" x="32" y="8" width="12" height="34" /></Mini>;
const IconGrant = () => <Mini><ellipse class="ls-mk" cx="24" cy="10" rx="14" ry="5" /><path class="ls-mk" d="M10 10V36M38 10V36M10 36A14 5 0 0 0 38 36" /><path class="ls-ms" d="M17 23L22 28L31 18" /></Mini>;
const IconCall = () => (
  <Mini>
    <text class="ls-mt" x="24" y="22" text-anchor="middle">2x3</text>
    <path class="ls-mw ls-mthin" d="M6 32H18M22 32H26M30 32H42" />
  </Mini>
);
const IconMail = () => <Mini><rect class="ls-mk" x="6" y="12" width="36" height="24" rx="2" /><path class="ls-mk" d="M6 14L24 28L42 14" /></Mini>;
const IconShip = () => <Mini><path class="ls-mk" d="M6 28H42L36 38H12Z" /><path class="ls-mk" d="M24 28V8" /><path class="ls-ms ls-mthin" d="M4 44C10 40 14 40 20 44S30 48 36 44" /></Mini>;
const IconTerm = () => <Mini><rect class="ls-mw" x="4" y="18" width="40" height="12" rx="2" /><path class="ls-mk" d="M36 14V34" /><path class="ls-ms" d="M44 24H48" /></Mini>;

/* ---------- the lesson ---------- */

export const T1C_LICENSES: Lesson = {
  id: 't1c-licenses',
  title: 'Licenses and call signs',
  blurb: 'A license from exam day to renewal: the classes, the call sign, the ten-year term and the grace period.',
  sub: 'T1',
  groups: ['T1C'],
  minutes: 8,
  steps: [
    {
      type: 'clip',
      id: 'clip',
      clip: 'lesson-t1c-licenses',
      intro: 'Start with a short clip. After it you will follow Doug\'s new license through its life.',
      covers: ['T1C01', 'T1C05', 'T1C07', 'T1C08', 'T1C09', 'T1C10', 'T1C11'],
    },
    {
      type: 'card',
      id: 'classes',
      idea: 'Three license classes are issued today',
      covers: ['T1C01'],
      picture: { art: 'license-class' },
      heading: 'Three licenses you can earn today',
      text: [
        'Doug is studying for his first license. The FCC now issues new licenses in just three classes: Technician, General and Amateur Extra. Each has its own exam, and each step up gives more frequencies.',
        'You may meet older hams with a Novice, Technician Plus or Advanced license. They can keep those, but nobody new can get one.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Jeff holds an old Advanced class license. Could Doug earn an Advanced license today?',
        options: [
          { id: 'yes', label: 'Yes, by passing the right exam', why: 'No exam leads to Advanced any more. New licenses are only Technician, General and Amateur Extra.' },
          { id: 'no', label: 'No, it is no longer issued', right: true, why: 'Right. Advanced is an old class. The FCC issues new licenses only for Technician, General and Amateur Extra.' },
        ],
      },
      remember: 'The FCC issues new licenses only for Technician, General and Amateur Extra.',
    },
    {
      type: 'card',
      id: 'grant',
      idea: 'Transmit once the grant is in the FCC database',
      covers: ['T1C10'],
      picture: { draw: GrantPath },
      heading: 'Passing is not the same as being licensed',
      text: [
        'Doug passes. The examiners hand him a certificate, but that only shows he passed. For a first license he has no call sign yet, so he cannot go on the air.',
        'The FCC then grants the license and lists it in its online license database. The moment his grant appears there, Doug may transmit. He does not wait for anything in the mail, and a listing on a club or ARRL website does not count.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'When may Doug first transmit? Tap the moment in the picture, or tap an answer.',
        options: [
          { id: 'cert', label: 'When he gets his certificate at the exam', why: 'The certificate only shows he passed. Without a granted license he has no call sign to use.' },
          { id: 'arrl', label: 'When his name shows on the ARRL website', why: 'The ARRL is a private association. Only the FCC database is the official record of a grant.' },
          { id: 'db', label: 'When his grant appears in the FCC license database', right: true, why: 'Yes. Once the grant shows in the FCC license database, the license is in effect.' },
          { id: 'mail', label: 'When a paper license arrives in the mail', why: 'He does not need to wait for paper. The grant in the FCC database is what counts.' },
        ],
      },
      remember: 'You may transmit as soon as your license grant appears in the FCC license database.',
    },
    {
      type: 'card',
      id: 'callsign',
      idea: 'Group D call signs and vanity call signs',
      covers: ['T1C05', 'T1C02'],
      picture: { draw: CallShapes },
      heading: 'Your call sign has a shape',
      text: [
        'With the grant comes a call sign, KJ7ABC: two letters, a digit, then three letters. That 2 by 3 shape is called Group D, and Technicians can be given it. The shortest shapes, like one letter, a digit and two letters, are kept for Amateur Extra.',
        'Jeff, who holds an Advanced license, picked K7DEF himself. A call sign you choose is a vanity call sign, and any licensed amateur may apply for one. Your license class only limits which shapes you may pick.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Which of the two call signs has the Group D shape? Tap a row, or tap an answer.',
        options: [
          { id: 'doug', label: 'KJ7ABC', right: true, why: 'Yes. Two letters, a digit and three letters: the 2 by 3 Group D shape.' },
          { id: 'jeff', label: 'K7DEF', why: 'K7DEF has only one letter before the digit, so it is not the 2 by 3 Group D shape.' },
          { id: 'both', label: 'Both of them', why: 'Count the letters before the digit. Only KJ7ABC has two, so only it is Group D.' },
        ],
      },
      remember: 'Group D is two letters, a digit and three letters, like KJ7ABC. Any licensed amateur may choose a vanity call sign.',
    },
    {
      type: 'card',
      id: 'email',
      idea: 'Keep your email current with the FCC',
      covers: ['T1C04'],
      picture: { art: 'email-address-requirement' },
      heading: 'The FCC reaches you by email',
      text: [
        'The FCC sends its letters about your license by email, so you must give it a working address and keep it up to date.',
        'Say Doug changes his email and forgets to tell the FCC. Its messages bounce. That is not a small matter: it puts the license itself at risk.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What may happen if the FCC cannot reach Doug by email?',
        options: [
          { id: 'none', label: 'Nothing. Email is optional', why: 'Email is not optional. You must keep a valid address on file with the FCC.' },
          { id: 'fine', label: 'A fine, and nothing more', why: 'The rule does not describe a fine. It describes action against the license itself.' },
          { id: 'rev', label: 'His station license may be revoked, or his operator license suspended', right: true, why: 'Right. If FCC email cannot reach you, the station license may be revoked or the operator license suspended.' },
        ],
      },
      remember: 'If the FCC cannot reach you by email, your station license may be revoked or your operator license suspended.',
    },
    {
      type: 'card',
      id: 'abroad',
      idea: 'Contacts abroad and operating at sea',
      covers: ['T1C03', 'T1C06'],
      picture: { art: 'maritime-mobile' },
      heading: 'Talking across borders, and from a ship',
      text: [
        'Doug works a ham in another country. What may they talk about? Anything to do with amateur radio itself, plus remarks of a personal character: the weather, family, their stations. No business, and nothing like a broadcast.',
        'Later Doug takes a cruise on a ship registered in the US. In international waters his FCC license still applies there. He just needs the permission of the ship\'s master, the captain in command.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'The US-registered ship is in international waters. What does Doug need before he operates from it?',
        options: [
          { id: 'auth', label: 'A special FCC authorization for operating at sea', why: 'No special authorization is needed. His normal license covers a US-documented ship.' },
          { id: 'master', label: 'The permission of the ship\'s master', right: true, why: 'Yes. On a US-documented or registered vessel his license applies, with the master\'s permission.' },
          { id: 'emerg', label: 'Nothing, but he may only operate in an emergency', why: 'Operating at sea is not limited to emergencies. Normal contacts are fine, once the master agrees.' },
        ],
      },
      remember: 'Contacts with other countries: things to do with amateur radio and personal remarks. On a US-documented ship at sea: with the master\'s permission.',
    },
    {
      type: 'card',
      id: 'renew',
      idea: 'A ten-year term, renewable from 90 days before',
      covers: ['T1C08', 'T1C07'],
      picture: { draw: RenewWindow },
      heading: 'Ten years, then renew',
      text: [
        'Doug\'s license is granted for the normal term of ten years. It is not for life, but at the end of each term he can renew it without a new exam.',
        'He cannot renew years early. The FCC accepts a renewal starting 90 days before the license expires, and any day from then up to the expiration date is fine.',
      ],
      interaction: {
        kind: 'slider',
        prompt: 'Slide the marker to the earliest day Doug may ask to renew.',
        label: 'Filing day',
        min: -360,
        max: 0,
        step: 30,
        start: -360,
        readouts: (v) => [{ label: 'Days before expiry', value: `${-v}` }, { label: 'FCC accepts renewal', value: v >= -90 ? 'yes' : 'not yet' }],
        goal: (v) => v === -90,
        hint: (v) => (v < -90 ? `${-v} days before is too early. The FCC will not take a renewal yet. Move toward the expiry date.` : `${-v} days before works, but the window opened earlier. Move back to find the first day.`),
        done: 'There: 90 days before expiry is the first day Doug may file. Any day from here to the expiry date is fine too.',
      },
      remember: 'The normal license term is ten years. You may ask to renew from 90 days before it expires.',
    },
    {
      type: 'card',
      id: 'grace',
      idea: 'A two-year grace period, but no transmitting',
      covers: ['T1C09', 'T1C11'],
      picture: { art: 'grace-period' },
      heading: 'Missed it? Two years of grace, but stay off the air',
      text: [
        'Suppose Doug forgets, and his license expires. He has not lost it for good. There is a grace period of two years after the expiration date, and within it he can still renew without taking the exam again.',
        'The grace period saves his right to renew, not his right to transmit. An expired license gives no privileges, so Doug stays off the air until the renewal is granted.',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'Doug\'s license expired six months ago. He filed for renewal this morning. May he call Jeff on the air tonight?',
        options: [
          { id: 'grace', label: 'Yes, he is inside the two-year grace period', why: 'The grace period is for renewing, not for operating. With an expired license he may not transmit.' },
          { id: 'filed', label: 'Yes, because he has applied', why: 'Applying is not enough. He has no privileges until the FCC grants the renewal.' },
          { id: 'wait', label: 'No, he must wait until the renewal is granted', right: true, why: 'Right. He may transmit again once the renewal shows as granted.' },
        ],
      },
      remember: 'The grace period is two years. You may not transmit during it until your license is renewed.',
    },
    {
      type: 'check',
      id: 'check',
      covers: ['T1C02', 'T1C05', 'T1C08', 'T1C09', 'T1C10'],
      questions: [
        {
          q: 'Doug passed his first exam this morning. What has to happen before he can call Jeff on the air?',
          review: 'grant',
          covers: ['T1C10'],
          choices: [
            { label: 'Nothing. Passing is enough', why: 'Passing does not give him a call sign. He must wait for the FCC grant.' },
            { label: 'His license grant must appear in the FCC license database', right: true, why: 'Once the grant shows in the FCC database, he may transmit.' },
            { label: 'A paper license must arrive in the mail', why: 'No paper is needed. The listing in the FCC database is what counts.' },
          ],
        },
        {
          q: 'Which call sign has the Group D shape?',
          review: 'callsign',
          covers: ['T1C05', 'T1C02'],
          choices: [
            { label: 'Two letters, a digit and three letters, like KJ7ABC', right: true, why: 'Group D is the 2 by 3 shape, and Technicians can be given it.' },
            { label: 'One letter, a digit and two letters', why: 'That short shape is kept for Amateur Extra. Group D is two letters, a digit and three letters.' },
            { label: 'Any shape, if you choose it as a vanity call sign', why: 'A vanity call sign can be any shape your class allows, but Group D is one fixed shape: 2 by 3.' },
          ],
        },
        {
          q: 'How long is a new amateur license normally good for?',
          review: 'renew',
          covers: ['T1C08'],
          choices: [
            { label: 'Two years', why: 'Two years is the grace period after expiry, not the license term.' },
            { label: 'Ten years', right: true, why: 'The normal term is ten years, and then it can be renewed.' },
            { label: 'For life', why: 'Amateur licenses are not for life. They are renewed at the end of each term.' },
          ],
        },
        {
          q: 'Doug\'s license expired 18 months ago. Can he still renew it without taking the exam again?',
          review: 'grace',
          covers: ['T1C09'],
          choices: [
            { label: 'Yes, he is still inside the two-year grace period', right: true, why: 'The grace period runs two years from the expiration date. He may renew, but may not transmit until it is granted.' },
            { label: 'No, the grace period is one year', why: 'The grace period is two years, not one.' },
            { label: 'No, an expired license can never be renewed', why: 'It can. Within the two-year grace period he can renew without a new exam.' },
          ],
        },
      ],
    },
    {
      type: 'recap',
      id: 'recap',
      covers: ['T1C01', 'T1C02', 'T1C03', 'T1C04', 'T1C05', 'T1C06', 'T1C07', 'T1C08', 'T1C09', 'T1C10', 'T1C11'],
      facts: [
        { icon: IconClasses, text: 'New licenses are issued only for Technician, General and Amateur Extra.', covers: ['T1C01'] },
        { icon: IconGrant, text: 'After your first exam, you may transmit once your grant appears in the FCC license database.', covers: ['T1C10'] },
        { icon: IconCall, text: 'Group D call signs are two letters, a digit and three letters. Any licensed amateur may choose a vanity call sign.', covers: ['T1C05', 'T1C02'] },
        { icon: IconMail, text: 'Keep your email current: if the FCC cannot reach you, your station license may be revoked or your operator license suspended.', covers: ['T1C04'] },
        { icon: IconShip, text: 'With other countries: amateur radio matters and personal remarks. On a US-documented ship at sea: with the master\'s permission.', covers: ['T1C03', 'T1C06'] },
        { icon: IconTerm, text: 'A license lasts ten years. Renew from 90 days before it expires. After it expires you have a two-year grace period to renew, but may not transmit until you do.', covers: ['T1C07', 'T1C08', 'T1C09', 'T1C11'] },
      ],
    },
  ],
};
export default T1C_LICENSES;
