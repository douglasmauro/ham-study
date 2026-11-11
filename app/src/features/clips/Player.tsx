import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ComponentType } from 'preact';
import { TOPICS } from '../../lib/pool';
import { Icon } from '../../ui/Icon';
import { audioUrl, lineMs, titleMs, type ClipDef, type SceneProps } from './data';
import './clips.css';

const SPEEDS = [0.75, 1, 1.25, 1.5];
const GAP_MS = 350; // breath between two lines
const STALL_MS = 6000; // audio that has not started by now is treated as failed

/** One thing the player says: a clip's title (Listen mode only) or one narration line. */
interface Segment {
  clip: number;
  line: number; // -1 = the title
  caption: string;
  url: string;
  ms: number; // length of the recording, used to time the line when there is no sound
}

function segmentsFor(clips: ClipDef[], withTitles: boolean): Segment[] {
  const out: Segment[] = [];
  clips.forEach((c, ci) => {
    if (withTitles) {
      out.push({ clip: ci, line: -1, caption: `Clip ${ci + 1} of ${clips.length}: ${c.data.title}`, url: audioUrl(c.data.id, 'title'), ms: titleMs(c.data) + 400 });
    }
    c.data.lines.forEach((l, li) => out.push({ clip: ci, line: li, caption: l.caption, url: audioUrl(c.data.id, li), ms: lineMs(c.data, li) }));
  });
  return out;
}

type Mode = 'idle' | 'audio' | 'timer' | 'gap';

/**
 * Plays one clip, or several back to back (Listen mode).
 *
 * Sound is one recorded file per line on a single Audio element, which is
 * created inside the first tap so phones allow it to play. With the sound
 * muted, or if a file will not load or play, lines advance on a timer instead,
 * so the clip always works from its captions alone.
 */
export function ClipPlayer({ clips, listen = false, onDone }: { clips: ClipDef[]; listen?: boolean; onDone: () => void }) {
  const segs = useMemo(() => segmentsFor(clips, listen), [clips, listen]);

  const [idx, setIdx] = useState(-1); // segment being spoken, -1 before the first play
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [noSound, setNoSound] = useState(false); // audio failed: captions only
  const [run, setRun] = useState(0); // bumped on replay so the picture starts over

  // The engine lives in a ref: its callbacks must always see the latest values.
  const eng = useRef({
    audio: null as HTMLAudioElement | null,
    preload: null as HTMLAudioElement | null,
    token: 0, // bumped whenever the current line is abandoned, so stale callbacks do nothing
    mode: 'idle' as Mode,
    idx: -1,
    playing: false,
    speed: 1,
    muted: false,
    broken: false,
    timer: 0 as number, // setTimeout id for 'timer' and 'gap'
    left: 0, // ms (at 1x) still to run on that timer
    since: 0, // when the timer was last started
    stall: 0 as number,
    done: false,
  }).current;

  const clearTimers = () => {
    clearTimeout(eng.timer);
    clearTimeout(eng.stall);
  };

  /** Run `left` ms (at 1x) at the current speed, then call lineOver or start the next line. */
  const arm = () => {
    clearTimeout(eng.timer);
    eng.since = Date.now();
    const my = eng.token;
    eng.timer = window.setTimeout(() => {
      if (my !== eng.token) return;
      if (eng.mode === 'timer') lineOver();
      else if (eng.mode === 'gap') startLine(eng.idx + 1);
    }, Math.max(0, eng.left / eng.speed));
  };
  /** Stop the running timer and remember how much of it is left. */
  const disarm = () => {
    clearTimeout(eng.timer);
    eng.left = Math.max(0, eng.left - (Date.now() - eng.since) * eng.speed);
  };

  const finish = () => {
    eng.token++;
    clearTimers();
    eng.mode = 'idle';
    eng.playing = false;
    setPlaying(false);
    setEnded(true);
    // Listen mode is hands-free, so it reports by itself. A single clip holds its
    // last picture and shows a Done button, so the learner can look or replay.
    if (listen && !eng.done) {
      eng.done = true;
      onDone();
    }
  };

  /** The current line has been said (or its time is up). */
  const lineOver = () => {
    clearTimeout(eng.stall);
    if (eng.idx >= segs.length - 1) return finish();
    eng.mode = 'gap';
    eng.left = GAP_MS;
    arm();
  };

  /** Time the rest of this line without sound. */
  const runTimer = (ms: number) => {
    eng.mode = 'timer';
    eng.left = ms;
    if (eng.playing) arm();
  };

  /** Audio could not load or play: finish this line, and the rest, on the timer. */
  const audioFailed = (my: number) => {
    if (my !== eng.token || eng.mode !== 'audio') return;
    clearTimeout(eng.stall);
    eng.broken = true;
    setNoSound(true);
    eng.audio?.pause();
    runTimer(segs[eng.idx].ms);
  };

  const playAudio = (my: number) => {
    const a = eng.audio!;
    clearTimeout(eng.stall);
    const before = a.currentTime;
    eng.stall = window.setTimeout(() => {
      if (my === eng.token && eng.mode === 'audio' && eng.playing && a.currentTime === before) audioFailed(my);
    }, STALL_MS);
    const p = a.play();
    if (p && p.catch) {
      p.catch((e: unknown) => {
        // AbortError only means a pause or a new line interrupted the request.
        if ((e as { name?: string })?.name === 'AbortError') return;
        audioFailed(my);
      });
    }
  };

  const startLine = (i: number) => {
    const my = ++eng.token;
    clearTimers();
    eng.audio?.pause();
    if (i >= segs.length) return finish();
    eng.idx = i;
    eng.playing = true;
    setIdx(i);
    setPlaying(true);
    setEnded(false);
    const seg = segs[i];
    const a = eng.audio;
    if (a && !eng.muted && !eng.broken) {
      eng.mode = 'audio';
      a.onended = () => { if (my === eng.token && eng.mode === 'audio') lineOver(); };
      a.onerror = () => audioFailed(my);
      a.src = seg.url;
      a.playbackRate = eng.speed;
      playAudio(my);
      // fetch the next line while this one plays, so there is no gap on a slow connection
      const next = segs[i + 1];
      if (next) {
        eng.preload ??= new Audio();
        eng.preload.preload = 'auto';
        eng.preload.src = next.url;
      }
    } else {
      runTimer(seg.ms);
    }
  };

  const pause = () => {
    if (eng.mode === 'audio') {
      clearTimeout(eng.stall);
      eng.audio?.pause();
    } else if (eng.mode === 'timer' || eng.mode === 'gap') {
      disarm();
    }
    eng.playing = false;
    setPlaying(false);
  };

  const resume = () => {
    eng.playing = true;
    setPlaying(true);
    if (eng.mode === 'audio') playAudio(eng.token);
    else arm();
  };

  /** Phones only let sound start from a tap, so every control that can start it calls this first. */
  const ensureAudio = () => {
    if (!eng.audio) {
      eng.audio = new Audio();
      eng.audio.preload = 'auto';
    }
  };

  const toggle = () => {
    ensureAudio();
    if (eng.playing) pause();
    else if (eng.idx < 0 || ended) replay();
    else if (eng.mode === 'idle') startLine(eng.idx);
    else resume();
  };

  const replay = () => {
    ensureAudio();
    eng.broken = false;
    setNoSound(false);
    setRun((n) => n + 1);
    startLine(0);
  };

  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(eng.speed) + 1) % SPEEDS.length];
    const timed = eng.playing && (eng.mode === 'timer' || eng.mode === 'gap');
    if (timed) disarm();
    eng.speed = next;
    setSpeed(next);
    if (eng.audio) eng.audio.playbackRate = next;
    if (timed) arm();
  };

  const toggleMute = () => {
    ensureAudio();
    eng.muted = !eng.muted;
    setMuted(eng.muted);
    if (eng.muted) {
      if (eng.mode === 'audio') {
        // carry on from the same point in the line, silently
        const a = eng.audio!;
        const said = a.duration > 0 ? a.currentTime / a.duration : 0;
        clearTimeout(eng.stall);
        a.pause();
        runTimer(segs[eng.idx].ms * (1 - Math.min(1, said)));
      }
    } else if (eng.mode === 'timer') {
      // sound back on: say the current line again from its start
      eng.broken = false;
      setNoSound(false);
      if (eng.playing) startLine(eng.idx);
      else {
        eng.token++;
        clearTimers();
        eng.mode = 'idle';
      }
    } else {
      eng.broken = false;
      setNoSound(false);
    }
  };

  useEffect(() => () => {
    eng.token++;
    clearTimers();
    if (eng.audio) {
      eng.audio.onended = null;
      eng.audio.onerror = null;
      eng.audio.pause();
      eng.audio.removeAttribute('src');
    }
    if (eng.preload) eng.preload.removeAttribute('src');
  }, []);

  const seg = idx >= 0 ? segs[idx] : null;
  const clipIdx = seg ? seg.clip : 0;
  const clip = clips[clipIdx];
  const step = seg ? seg.line : -1;
  const topic = TOPICS[clip.data.sub];
  const lines = clip.data.lines;
  const caption = seg ? seg.caption : listen ? 'Tap play. Every clip plays in turn, hands-free.' : 'Tap play to watch and listen.';
  const playLabel = playing ? 'Pause' : ended ? 'Play again' : 'Play';

  return (
    <div class="screen clip-screen" style={{ '--clip-topic': topic?.color ?? 'var(--accent)' }}>
      <div class="topbar">
        <a class="iconbtn" href="#/learn/clips" aria-label="Back"><Icon name="back" /></a>
        <div class="stack" style={{ gap: '2px' }}>
          <span class="sub" style={{ color: topic?.color }}>
            {clip.data.sub} · {topic?.name}{listen ? ` · Clip ${clipIdx + 1} of ${clips.length}` : ''}
          </span>
          <h1>{clip.data.title}</h1>
        </div>
      </div>

      <Stage key={`${run}-${clipIdx}`} Scene={clip.Scene} step={step} playing={playing} speed={speed} />

      <div class="clip-caption">
        <span aria-live="polite">{caption}</span>
      </div>

      <clip.Extra step={step} />

      <div class="clip-controls">
        {ended && !listen && (
          <button type="button" class="btn primary block" onClick={() => { if (!eng.done) { eng.done = true; onDone(); } }}>
            <Icon name="check" /> Done
          </button>
        )}
        <div class="clip-pips" role="img" aria-label={seg && step >= 0 ? `Line ${step + 1} of ${lines.length}` : `${lines.length} lines`}>
          {lines.map((_, i) => <i class={i < step || (ended && i <= step) ? 'done' : i === step ? 'now' : ''} />)}
        </div>
        <div class="clip-buttons">
          <button type="button" class="clip-btn" onClick={replay} aria-label="Replay from the start"><Icon name="replay" /></button>
          <button type="button" class="clip-play" onClick={toggle} aria-label={playLabel}>
            {playing
              ? <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
              : <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5l11 7-11 7z" /></svg>}
          </button>
          <div class="clip-right">
            <button type="button" class="clip-btn clip-speed" onClick={cycleSpeed} aria-label={`Playback speed ${speed} times. Tap to change.`}>{speed}×</button>
            <button type="button" class={`clip-btn${muted ? ' off' : ''}`} onClick={toggleMute} aria-pressed={muted} aria-label={muted ? 'Sound off. Tap to turn on.' : 'Sound on. Tap to mute.'}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 9h4l5-4v14l-5-4H4z" />
                <path d={muted ? 'M17 9l5 6M22 9l-5 6' : 'M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12'} />
              </svg>
            </button>
          </div>
        </div>
        <span class="clip-note" role="status">
          {muted ? 'Sound off. Captions only.' : noSound ? 'Sound could not be played. Captions only.' : 'Recorded voice. Captions always on.'}
        </span>
      </div>
    </div>
  );
}

/** Holds the picture and its clocks. The clocks only run while playing, so pausing freezes the animation. */
function Stage({ Scene, step, playing, speed }: { Scene: ComponentType<SceneProps>; step: number; playing: boolean; speed: number }) {
  const reduced = useMemo(() => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const clock = useRef({ t: 0, t0: 0, step }).current;
  const [, redraw] = useState(0);
  if (clock.step !== step) {
    clock.step = step;
    clock.t0 = clock.t;
  }
  useEffect(() => {
    if (!playing || reduced) return;
    let raf = 0;
    let last = performance.now();
    let shown = last;
    const loop = (now: number) => {
      clock.t += Math.min(0.1, (now - last) / 1000) * speed;
      last = now;
      if (now - shown >= 33) { // about 30 pictures a second is plenty
        shown = now;
        redraw((n) => n + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, reduced]);
  // With reduced motion nothing drifts: each line shows its settled picture.
  return (
    <div class="clip-stage">
      <Scene step={step} t={reduced ? 0 : clock.t} ts={reduced ? 99 : clock.t - clock.t0} />
    </div>
  );
}
