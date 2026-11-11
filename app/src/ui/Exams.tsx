import { POOL } from '../lib/pool';
import { Icon } from './Icon';

/**
 * How US amateur radio licensing exams work. Question counts and pass marks are FCC rules
 * (47 CFR 97.501 and 97.503). Fees were checked against the ARRL VEC pages in November 2026;
 * they can change, so the page tells the learner to confirm with their exam team.
 */
export const LEVELS = [
  {
    level: 1,
    name: 'Technician',
    element: 'Element 2',
    questions: 35,
    pass: 26,
    needs: 'Nothing. This is where everyone starts.',
    gives: 'All amateur bands above 30 MHz (VHF and UHF: local contacts, repeaters, satellites), plus small parts of four HF bands, including voice on part of 10 meters.',
    pool: 'Current pool: July 2026 to June 2030.',
  },
  {
    level: 2,
    name: 'General',
    element: 'Element 3',
    questions: 35,
    pass: 26,
    needs: 'A Technician license, or a pass on the Technician exam.',
    gives: 'Privileges on every amateur band, including most of the HF bands used for long-distance and worldwide contacts.',
    pool: 'Current pool: July 2023 to June 2027. A new pool starts July 2027.',
  },
  {
    level: 3,
    name: 'Amateur Extra',
    element: 'Element 4',
    questions: 50,
    pass: 37,
    needs: 'A General license, or passes on both earlier exams.',
    gives: 'Every amateur privilege on every band.',
    pool: 'The hardest exam. Most people take it later.',
  },
];

function Fact({ q, children }: { q: string; children: preact.ComponentChildren }) {
  return (
    <div class="stack" style={{ gap: '4px' }}>
      <span style={{ fontWeight: 700 }}>{q}</span>
      <span style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

export function Exams() {
  return (
    <div class="screen">
      <div class="topbar">
        <a class="iconbtn" href="#/" aria-label="Home"><Icon name="back" /></a>
        <div class="stack" style={{ gap: '0' }}><span class="sub">US amateur radio licenses</span><h1>How the exams work</h1></div>
      </div>

      <div class="card stack">
        <h2>Three license levels</h2>
        <span class="small muted">You take them in order. Each exam is multiple choice, with four answers per question, and you need 74% to pass.</span>
        {LEVELS.map((l) => (
          <div class="stack" style={{ gap: '6px', padding: '12px', borderRadius: '14px', background: 'var(--raised)', border: l.level === 1 ? '2px solid var(--accent)' : '2px solid transparent' }}>
            <div class="row between" style={{ flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--display)', fontSize: '18px', fontWeight: 700 }}>Level {l.level} · {l.name}</span>
              {l.level === 1 && <span class="chip" style={{ color: 'var(--accent)' }}>You are studying this</span>}
            </div>
            <div class="row" style={{ gap: '8px', flexWrap: 'wrap' }}>
              <span class="chip">{l.questions} questions</span>
              <span class="chip">{l.pass} right to pass</span>
              <span class="chip">up to {l.questions - l.pass} wrong</span>
            </div>
            <span class="small" style={{ color: 'var(--text-2)', lineHeight: 1.45 }}><b>You need first:</b> {l.needs}</span>
            <span class="small" style={{ color: 'var(--text-2)', lineHeight: 1.45 }}><b>What it gives you:</b> {l.gives}</span>
            <span class="small muted">{l.element}. {l.pool}</span>
          </div>
        ))}
      </div>

      <div class="card stack" style={{ gap: '16px' }}>
        <h2>Taking the exam</h2>
        <Fact q="Where do the questions come from?">
          Every exam question is drawn from a published pool. The Technician pool has {POOL.questions.length} questions in {POOL.subelements.reduce((a, s) => a + s.groups.length, 0)} groups, and your exam takes one question from each group. This app uses that exact pool.
        </Fact>
        <Fact q="When can I take it?">
          Whenever you are ready. Volunteer examiner teams hold sessions all year, in person and online by video. There is no class to attend, no minimum age and no Morse code test.
        </Fact>
        <Fact q="Can I take more than one exam in a day?">
          Yes. If you pass Technician, most teams let you try General at the same session, and then Extra, usually for no extra fee. You lose nothing by trying.
        </Fact>
        <Fact q="What if I fail?">
          Nothing bad happens. There is no limit on how many times you can try and no waiting period. You get a different set of questions each time. Many teams let you try again at the same session if there is time, for another exam fee.
        </Fact>
        <Fact q="How long does it take?">
          Most people finish a 35-question exam in 20 to 40 minutes. Sessions are not tightly timed, and you are told your result right away.
        </Fact>
      </div>

      <div class="card stack" style={{ gap: '16px' }}>
        <h2>Before exam day</h2>
        <Fact q="Get an FCC Registration Number (FRN)">
          Register for free in the FCC's CORES system before the exam. You must give your FRN and an email address on the application.
        </Fact>
        <Fact q="What to bring">
          A photo ID, your FRN, the exam fee, and for an in-person session two pencils and a pen. A simple calculator is allowed if its memory is cleared. Phones may not be used as calculators, and no notes are allowed.
        </Fact>
        <Fact q="What it costs">
          Two separate fees. The exam team's fee is usually $15 or less (some teams charge nothing), and it covers one try at each exam level. After you pass, a new license costs $35, paid to the FCC online, not to the exam team. Confirm both with your exam team, since fees can change.
        </Fact>
      </div>

      <div class="card stack" style={{ gap: '16px' }}>
        <h2>After you pass</h2>
        <Fact q="When can I get on the air?">
          Once you pay the FCC fee and your call sign appears in the FCC's online license database, usually within a few days. The FCC emails you a link to your official license.
        </Fact>
        <Fact q="How long does the license last?">
          Ten years. You renew it without taking the exam again, and if it expires you have two more years to renew, though you may not transmit until it is renewed.
        </Fact>
        <Fact q="Do my passes expire?">
          A pass you have not yet turned into a license counts as credit for 365 days. Once the license is issued, it does not expire as long as you keep renewing.
        </Fact>
      </div>

      <div class="grid2">
        <a class="btn secondary" href="https://www.arrl.org/find-an-amateur-radio-license-exam-session" target="_blank" rel="noopener">Find an exam session</a>
        <a class="btn secondary" href="https://apps.fcc.gov/cores/userLogin.do" target="_blank" rel="noopener">Get an FRN</a>
      </div>
      <span class="small muted">Question counts and pass marks are set by FCC rules. Fees were checked in November 2026 against the ARRL exam pages.</span>
    </div>
  );
}
