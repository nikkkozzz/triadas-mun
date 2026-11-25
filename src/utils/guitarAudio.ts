import { TabStep } from '../types/course';
import { getMidiAt, midiToFrequency } from './musicTheory';

class GuitarAudioEngine {
  private ctx: AudioContext | null = null;
  private activeTimeouts: number[] = [];
  private activeNodes: AudioNode[] = [];

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Synthesizes a clean, warm plucked electric/acoustic guitar tone using
   * layered harmonics and a low-pass brightness decay envelope.
   */
  public playNote(
    stringNum: 1 | 2 | 3 | 4 | 5 | 6,
    fret: number,
    duration = 1.4,
    startTimeOffset = 0,
    velocity = 0.72
  ): void {
    const ctx = this.ensureContext();
    const midi = getMidiAt(stringNum, fret);
    const freq = midiToFrequency(midi);
    const now = ctx.currentTime + startTimeOffset;

    const masterGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(4800, freq * 7.5), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(420, freq * 1.9), now + duration * 0.65);
    filter.Q.value = 1.2;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.24 * velocity, now + 0.008);
    masterGain.gain.exponentialRampToValueAtTime(0.11 * velocity, now + 0.18);
    masterGain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    // Warm fundamental (triangle) + bright pick attack (sawtooth) + subtle 2nd harmonic
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, now);
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.28, now);
    osc2Gain.gain.exponentialRampToValueAtTime(0.04, now + 0.35);

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 2, now);
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.14, now);
    osc3Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    osc3.connect(osc3Gain);
    osc3Gain.connect(filter);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    const stopAt = now + duration + 0.05;
    osc1.stop(stopAt);
    osc2.stop(stopAt);
    osc3.stop(stopAt);

    this.activeNodes.push(osc1, osc2, osc3, masterGain);
  }

  public playMidi(midi: number, duration = 1.3, startTimeOffset = 0, velocity = 0.7): void {
    const ctx = this.ensureContext();
    const freq = midiToFrequency(midi);
    const now = ctx.currentTime + startTimeOffset;

    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(4200, freq * 6.5), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(360, freq * 1.8), now + duration * 0.7);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.22 * velocity, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, now);
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.22, now);

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  }

  /** Strums a chord from lowest string to highest string */
  public playChord(
    notes: { string: 1 | 2 | 3 | 4 | 5 | 6; fret: number }[],
    direction: 'down' | 'up' = 'down',
    strumDelaySec = 0.032,
    duration = 1.8
  ): void {
    const sorted = [...notes].sort((a, b) =>
      direction === 'down' ? b.string - a.string : a.string - b.string
    );
    sorted.forEach((n, idx) => {
      this.playNote(n.string, n.fret, duration, idx * strumDelaySec, 0.62);
    });
  }

  /** Plays a list of fretboard notes sequentially as an ascending arpeggio */
  public playArpeggio(
    notes: { string: 1 | 2 | 3 | 4 | 5 | 6; fret: number }[],
    bpm = 100,
    onDone?: () => void
  ): void {
    this.stopAllSequences();
    const sorted = [...notes].sort(
      (a, b) => getMidiAt(a.string, a.fret) - getMidiAt(b.string, b.fret)
    );
    // Deduplicate identical pitches
    const unique: { string: 1 | 2 | 3 | 4 | 5 | 6; fret: number }[] = [];
    const seenMidi = new Set<number>();
    for (const n of sorted) {
      const m = getMidiAt(n.string, n.fret);
      if (!seenMidi.has(m)) {
        seenMidi.add(m);
        unique.push(n);
      }
    }

    const stepMs = (60 / bpm) * 500; // eighth-note feel
    unique.forEach((n, idx) => {
      const t = window.setTimeout(() => {
        this.playNote(n.string, n.fret, 0.9, 0, 0.72);
      }, idx * stepMs);
      this.activeTimeouts.push(t);
    });

    const endT = window.setTimeout(() => {
      onDone?.();
    }, unique.length * stepMs + 250);
    this.activeTimeouts.push(endT);
  }

  /** Plays a sequence of TAB steps synced to BPM with step highlight callbacks */
  public playTabSequence(
    steps: TabStep[],
    bpm: number,
    onStepChange: (stepIndex: number | null) => void
  ): void {
    this.stopAllSequences();
    const beatMs = (60 / bpm) * 1000;
    let elapsed = 0;

    steps.forEach((step, idx) => {
      const delay = elapsed;
      const t = window.setTimeout(() => {
        onStepChange(idx);
        if (step.notes.length > 1) {
          this.playChord(
            step.notes.map((n) => ({ string: n.string, fret: n.fret })),
            step.strum === 'up' ? 'up' : 'down',
            0.022,
            Math.max(0.6, ((step.beats ?? 1) * beatMs) / 1000 * 1.15)
          );
        } else if (step.notes.length === 1) {
          const n = step.notes[0];
          this.playNote(
            n.string,
            n.fret,
            Math.max(0.55, ((step.beats ?? 1) * beatMs) / 1000 * 1.2),
            0,
            0.78
          );
        }
      }, delay);
      this.activeTimeouts.push(t);
      elapsed += (step.beats ?? 1) * beatMs;
    });

    const endT = window.setTimeout(() => {
      onStepChange(null);
    }, elapsed + 180);
    this.activeTimeouts.push(endT);
  }

  public stopAllSequences(): void {
    this.activeTimeouts.forEach((id) => window.clearTimeout(id));
    this.activeTimeouts = [];
  }

  /** Precision metronome click sound */
  public playMetronomeClick(type: 'accent' | 'beat' | 'offbeat'): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'accent') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.03);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    } else if (type === 'beat') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.025);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    } else {
      // Contratiempo ("y" / off-beat) soft woodblock tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }
}

export const guitarAudio = new GuitarAudioEngine();
