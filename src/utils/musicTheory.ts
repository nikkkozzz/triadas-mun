import { CagedZone, FretNote, NoteName, TriadQuality } from '../types/course';

/** Standard guitar tuning MIDI numbers: string 1 (high E4) down to string 6 (low E2) */
export const STRING_OPEN_MIDI: Record<1 | 2 | 3 | 4 | 5 | 6, number> = {
  1: 64, // E4
  2: 59, // B3
  3: 55, // G3
  4: 50, // D3
  5: 45, // A2
  6: 40, // E2
};

export const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'] as const;

export const SHARP_NOTES: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const FLAT_NOTES: NoteName[] = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

export const SELECTABLE_KEYS: NoteName[] = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

const FLAT_ROOTS = new Set<NoteName>(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb']);

export function noteToSemitone(note: NoteName): number {
  const map: Record<NoteName, number> = {
    C: 0,
    'C#': 1,
    Db: 1,
    D: 2,
    'D#': 3,
    Eb: 3,
    E: 4,
    F: 5,
    'F#': 6,
    Gb: 6,
    G: 7,
    'G#': 8,
    Ab: 8,
    A: 9,
    'A#': 10,
    Bb: 10,
    B: 11,
  };
  return map[note];
}

export function semitoneToNote(semitone: number, preferFlats = false): NoteName {
  const idx = ((semitone % 12) + 12) % 12;
  return preferFlats ? FLAT_NOTES[idx] : SHARP_NOTES[idx];
}

export function getMidiAt(stringNum: 1 | 2 | 3 | 4 | 5 | 6, fret: number): number {
  return STRING_OPEN_MIDI[stringNum] + fret;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function getNoteNameAt(
  stringNum: 1 | 2 | 3 | 4 | 5 | 6,
  fret: number,
  preferFlats = false
): NoteName {
  return semitoneToNote(getMidiAt(stringNum, fret), preferFlats);
}

export interface QualitySpec {
  label: string;
  symbol: string;
  intervals: { semitones: number; degree: string; role: 'root' | 'chord' | 'extension' }[];
}

export const QUALITY_SPECS: Record<TriadQuality, QualitySpec> = {
  major: {
    label: 'Tríada Mayor',
    symbol: '',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 7, degree: '5', role: 'chord' },
    ],
  },
  minor: {
    label: 'Tríada Menor',
    symbol: 'm',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 7, degree: '5', role: 'chord' },
    ],
  },
  diminished: {
    label: 'Tríada Disminuida',
    symbol: 'º',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 6, degree: '♭5', role: 'chord' },
    ],
  },
  augmented: {
    label: 'Tríada Aumentada',
    symbol: '+',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 8, degree: '♯5', role: 'chord' },
    ],
  },
  sus2: {
    label: 'Tríada sus2',
    symbol: 'sus2',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 2, degree: '2', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
    ],
  },
  sus4: {
    label: 'Tríada sus4',
    symbol: 'sus4',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
    ],
  },
  add2: {
    label: 'Mayor add2',
    symbol: 'add2',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 2, degree: '2', role: 'extension' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 7, degree: '5', role: 'chord' },
    ],
  },
  minorAdd2: {
    label: 'Menor add2',
    symbol: 'm(add2)',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 2, degree: '2', role: 'extension' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 7, degree: '5', role: 'chord' },
    ],
  },
  add4: {
    label: 'Mayor add4',
    symbol: 'add4',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
    ],
  },
  minorAdd4: {
    label: 'Menor add4',
    symbol: 'm(add4)',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
    ],
  },
  dom7: {
    label: 'Dominante (7)',
    symbol: '7',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 10, degree: '♭7', role: 'extension' },
    ],
  },
  maj7: {
    label: 'Mayor 7 (maj7)',
    symbol: 'maj7',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 11, degree: '7', role: 'extension' },
    ],
  },
  m7: {
    label: 'Menor 7 (m7)',
    symbol: 'm7',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 10, degree: '♭7', role: 'extension' },
    ],
  },
  m7b5: {
    label: 'Semidisminuido (m7♭5)',
    symbol: 'm7♭5',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 6, degree: '♭5', role: 'chord' },
      { semitones: 10, degree: '♭7', role: 'extension' },
    ],
  },
  pentMajor: {
    label: 'Pentatónica Mayor',
    symbol: ' Pent. Mayor',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 2, degree: '2', role: 'extension' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 9, degree: '6', role: 'extension' },
    ],
  },
  pentMinor: {
    label: 'Pentatónica Menor',
    symbol: ' Pent. Menor',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 10, degree: '♭7', role: 'extension' },
    ],
  },
  majorScale: {
    label: 'Escala Mayor (Jónica)',
    symbol: ' Mayor',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 2, degree: '2', role: 'extension' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 9, degree: '6', role: 'extension' },
      { semitones: 11, degree: '7', role: 'extension' },
    ],
  },
  dorian: {
    label: 'Modo Dórico',
    symbol: ' Dórico',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 2, degree: '2', role: 'extension' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 9, degree: '6', role: 'extension' },
      { semitones: 10, degree: '♭7', role: 'extension' },
    ],
  },
  phrygian: {
    label: 'Modo Frigio',
    symbol: ' Frigio',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 1, degree: '♭2', role: 'extension' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 8, degree: '♭6', role: 'extension' },
      { semitones: 10, degree: '♭7', role: 'extension' },
    ],
  },
  lydian: {
    label: 'Modo Lidio',
    symbol: ' Lidio',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 2, degree: '2', role: 'extension' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 6, degree: '♯4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 9, degree: '6', role: 'extension' },
      { semitones: 11, degree: '7', role: 'extension' },
    ],
  },
  mixolydian: {
    label: 'Modo Mixolidio',
    symbol: ' Mixolidio',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 2, degree: '2', role: 'extension' },
      { semitones: 4, degree: '3', role: 'chord' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 9, degree: '6', role: 'extension' },
      { semitones: 10, degree: '♭7', role: 'extension' },
    ],
  },
  aeolian: {
    label: 'Modo Eólico (Menor Natural)',
    symbol: ' Eólico',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 2, degree: '2', role: 'extension' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 7, degree: '5', role: 'chord' },
      { semitones: 8, degree: '♭6', role: 'extension' },
      { semitones: 10, degree: '♭7', role: 'extension' },
    ],
  },
  locrian: {
    label: 'Modo Locrio',
    symbol: ' Locrio',
    intervals: [
      { semitones: 0, degree: '1', role: 'root' },
      { semitones: 1, degree: '♭2', role: 'extension' },
      { semitones: 3, degree: '♭3', role: 'chord' },
      { semitones: 5, degree: '4', role: 'extension' },
      { semitones: 6, degree: '♭5', role: 'chord' },
      { semitones: 8, degree: '♭6', role: 'extension' },
      { semitones: 10, degree: '♭7', role: 'extension' },
    ],
  },
};

/**
 * Returns the canonical fret span [minFret, maxFret] for a CAGED position (including E' and A')
 * relative to any root note.
 */
export function getCagedFretWindow(
  root: NoteName,
  zone: CagedZone,
  quality: TriadQuality = 'major'
): [number, number] {
  if (zone === 'full') return [0, 15];

  // Root fret on 6th string (E = 0, F = 1, G = 3, A = 5, C = 8, etc.)
  const rootSemitone = noteToSemitone(root);
  const r6 = ((rootSemitone - 4) % 12 + 12) % 12; // 4 = E

  const rawRanges: Record<Exclude<CagedZone, 'full'>, [number, number]> = {
    E: [r6, r6 + 3],
    E2: [r6 + 1, r6 + 5],
    D: [r6 + 2, r6 + 5],
    C: [r6 + 4, r6 + 7],
    A: [r6 + 7, r6 + 10],
    A2: [r6 + 8, r6 + 12],
    G: [r6 + 9, r6 + 12],
  };

  let [minF, maxF] = rawRanges[zone];

  // Minor/diminished shapes may sit 1 fret lower for b3/b5
  if (quality === 'diminished' || quality === 'minor' || quality === 'm7b5') {
    if (zone === 'E' || zone === 'C' || zone === 'A') {
      minF -= 1;
    }
  }
  if (quality === 'majorScale' || quality === 'pentMajor' || quality === 'pentMinor') {
    minF -= 1;
    maxF += 1;
  }

  // Keep inside playable neck [0..16]
  while (maxF > 16 && minF >= 12) {
    minF -= 12;
    maxF -= 12;
  }
  if (minF < 0) {
    minF += 12;
    maxF += 12;
  }
  if (minF === 12 && maxF <= 15 && zone === 'G') {
    // Allow open G-shape if preferred? Keep 12..15 for G so E,E',D,C,A,A',G goes left-to-right!
  }
  return [Math.max(0, minF), Math.min(17, maxF)];
}

export function getCagedZoneLabel(zone: CagedZone): string {
  const labels: Record<CagedZone, string> = {
    full: 'Todo el mástil',
    E: 'Posición E',
    E2: "Posición E'",
    D: 'Posición D',
    C: 'Posición C',
    A: 'Posición A',
    A2: "Posición A'",
    G: 'Posición G',
  };
  return labels[zone];
}

export function generateFretboardNotes(params: {
  root: NoteName;
  quality: TriadQuality;
  cagedZone?: CagedZone;
  stringSet?: number[];
  startFret?: number;
  endFret?: number;
  labelMode?: 'intervals' | 'notes';
  secondaryRoot?: NoteName;
  secondaryQuality?: TriadQuality;
}): { notes: FretNote[]; windowRange: [number, number] | null } {
  const {
    root,
    quality,
    cagedZone = 'full',
    stringSet,
    startFret = 0,
    endFret = 15,
    labelMode = 'intervals',
    secondaryRoot,
    secondaryQuality,
  } = params;

  const rootSemi = noteToSemitone(root);
  const preferFlats =
    FLAT_ROOTS.has(root) ||
    quality === 'minor' ||
    quality === 'diminished' ||
    quality === 'pentMinor' ||
    quality === 'phrygian' ||
    quality === 'aeolian' ||
    quality === 'locrian';

  const spec = QUALITY_SPECS[quality];
  const intervalMap = new Map(spec.intervals.map((i) => [i.semitones, i]));

  const windowRange = cagedZone !== 'full' ? getCagedFretWindow(root, cagedZone, quality) : null;
  const activeMin = windowRange ? Math.max(startFret, windowRange[0]) : startFret;
  const activeMax = windowRange ? Math.min(endFret, windowRange[1]) : endFret;

  const allowedStrings = stringSet ? new Set(stringSet) : new Set([1, 2, 3, 4, 5, 6]);
  const notes: FretNote[] = [];
  const usedKey = new Set<string>();

  for (let s = 1 as 1 | 2 | 3 | 4 | 5 | 6; s <= 6; s = (s + 1) as 1 | 2 | 3 | 4 | 5 | 6) {
    if (!allowedStrings.has(s)) continue;
    for (let f = activeMin; f <= activeMax; f++) {
      const midi = getMidiAt(s, f);
      const rel = ((midi - rootSemi) % 12 + 12) % 12;
      const match = intervalMap.get(rel);
      if (match) {
        const noteName = semitoneToNote(midi, preferFlats);
        notes.push({
          string: s,
          fret: f,
          label: labelMode === 'notes' ? noteName : match.degree,
          role: match.role,
        });
        usedKey.add(`${s}-${f}`);
      }
    }
  }

  // Optional secondary triad overlay (for progressions V-I, IV-I, modal pairs)
  if (secondaryRoot && secondaryQuality) {
    const secSemi = noteToSemitone(secondaryRoot);
    const secSpec = QUALITY_SPECS[secondaryQuality];
    const secMap = new Map(secSpec.intervals.map((i) => [i.semitones, i]));
    const secFlats = FLAT_ROOTS.has(secondaryRoot) || secondaryQuality === 'minor';

    for (let s = 1 as 1 | 2 | 3 | 4 | 5 | 6; s <= 6; s = (s + 1) as 1 | 2 | 3 | 4 | 5 | 6) {
      if (!allowedStrings.has(s)) continue;
      for (let f = activeMin; f <= activeMax; f++) {
        if (usedKey.has(`${s}-${f}`)) continue;
        const midi = getMidiAt(s, f);
        const rel = ((midi - secSemi) % 12 + 12) % 12;
        const match = secMap.get(rel);
        if (match) {
          const noteName = semitoneToNote(midi, secFlats);
          notes.push({
            string: s,
            fret: f,
            label: labelMode === 'notes' ? noteName : match.degree,
            role: 'secondary',
          });
        }
      }
    }
  }

  return { notes, windowRange };
}

export function transposeNote(note: NoteName, semitones: number, preferFlats = false): NoteName {
  return semitoneToNote(noteToSemitone(note) + semitones, preferFlats);
}
