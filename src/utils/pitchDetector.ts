import { SHARP_NOTES } from './musicTheory';

export interface GuitarStringRef {
  number: 6 | 5 | 4 | 3 | 2 | 1;
  name: string;
  label: string;
  frequency: number;
  midi: number;
}

export const STANDARD_GUITAR_STRINGS: GuitarStringRef[] = [
  { number: 6, name: 'E2', label: '6ª · E', frequency: 82.41, midi: 40 },
  { number: 5, name: 'A2', label: '5ª · A', frequency: 110.0, midi: 45 },
  { number: 4, name: 'D3', label: '4ª · D', frequency: 146.83, midi: 50 },
  { number: 3, name: 'G3', label: '3ª · G', frequency: 196.0, midi: 55 },
  { number: 2, name: 'B3', label: '2ª · B', frequency: 246.94, midi: 59 },
  { number: 1, name: 'E4', label: '1ª · e', frequency: 329.63, midi: 64 },
];

export interface DetectedPitch {
  frequency: number;
  noteName: string;
  octave: number;
  cents: number;
  closestString: GuitarStringRef;
}

/**
 * Autocorrelation pitch detector tuned for electric & acoustic guitar fundamentals (70 Hz – 1100 Hz).
 */
export function detectPitch(buffer: Float32Array, sampleRate: number): DetectedPitch | null {
  const size = buffer.length;
  let rms = 0;
  for (let i = 0; i < size; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / size);
  if (rms < 0.012) return null; // Below noise gate

  // Trim quiet edges for cleaner correlation
  let r1 = 0;
  let r2 = size - 1;
  const threshold = 0.15;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buffer[size - i]) < threshold) {
      r2 = size - i;
      break;
    }
  }

  const sliced = buffer.slice(r1, r2);
  const n = sliced.length;
  if (n < 64) return null;

  const c = new Float32Array(n);
  for (let lag = 0; lag < n; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) {
      sum += sliced[i] * sliced[i + lag];
    }
    c[lag] = sum;
  }

  // Skip initial peak at lag 0 until first valley
  let d = 0;
  while (d + 1 < n && c[d] > c[d + 1]) {
    d++;
  }

  let maxVal = -1;
  let maxPos = -1;
  for (let i = d; i < n; i++) {
    if (c[i] > maxVal) {
      maxVal = c[i];
      maxPos = i;
    }
  }

  if (maxPos <= 0 || maxVal <= 0) return null;

  // Parabolic interpolation around peak for sub-cent precision
  let T0 = maxPos;
  if (maxPos > 0 && maxPos < n - 1) {
    const x1 = c[maxPos - 1];
    const x2 = c[maxPos];
    const x3 = c[maxPos + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a !== 0) {
      T0 = maxPos - b / (2 * a);
    }
  }

  const frequency = sampleRate / T0;
  if (frequency < 68 || frequency > 1100) return null;

  const midiFloat = 69 + 12 * Math.log2(frequency / 440);
  const nearestMidi = Math.round(midiFloat);
  const cents = Math.round((midiFloat - nearestMidi) * 100);
  const noteName = SHARP_NOTES[((nearestMidi % 12) + 12) % 12];
  const octave = Math.floor(nearestMidi / 12) - 1;

  // Find closest open guitar string
  let closestString = STANDARD_GUITAR_STRINGS[0];
  let minDiff = Infinity;
  for (const s of STANDARD_GUITAR_STRINGS) {
    const diff = Math.abs(Math.log2(frequency / s.frequency));
    if (diff < minDiff) {
      minDiff = diff;
      closestString = s;
    }
  }

  return {
    frequency,
    noteName,
    octave,
    cents,
    closestString,
  };
}
