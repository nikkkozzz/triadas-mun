export type NoteName =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B';

export type TriadQuality =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'sus2'
  | 'sus4'
  | 'add2'
  | 'minorAdd2'
  | 'add4'
  | 'minorAdd4'
  | 'dom7'
  | 'maj7'
  | 'm7'
  | 'm7b5'
  | 'pentMajor'
  | 'pentMinor'
  | 'majorScale'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian';

export type CagedZone = 'full' | 'C' | 'A' | 'A2' | 'G' | 'E' | 'E2' | 'D';

export interface FretNote {
  /** 1 = high E (top line), 6 = low E (bottom line) */
  string: 1 | 2 | 3 | 4 | 5 | 6;
  fret: number;
  label?: string;
  role?: 'root' | 'chord' | 'extension' | 'secondary' | 'approach' | 'muted';
  finger?: string;
}

export interface FretboardConfig {
  id?: string;
  title: string;
  subtitle?: string;
  /** Either explicit notes OR generated from root + quality + zone */
  root?: NoteName;
  quality?: TriadQuality;
  secondaryRoot?: NoteName;
  secondaryQuality?: TriadQuality;
  secondaryLabel?: string;
  cagedZone?: CagedZone;
  stringSet?: number[];
  startFret?: number;
  endFret?: number;
  notes?: FretNote[];
  allowTranspose?: boolean;
  showCagedZones?: boolean;
  defaultLabelMode?: 'intervals' | 'notes';
  arpeggioOrder?: 'ascending' | 'chord';
}

export interface ChordBoxVoicing {
  name: string;
  subtitle?: string;
  baseFret?: number;
  /** Length 6 array from string 6 (low E) to string 1 (high E): -1 muted, 0 open, >0 fret */
  frets: [number, number, number, number, number, number];
  /** Optional labels inside dots (degree like '1','3','5' or finger '1','2','3','4') */
  labels?: [string?, string?, string?, string?, string?, string?];
  /** Index 0..5 (low E to high E) of root string(s) to highlight in red */
  rootStrings?: number[];
  barre?: { fret: number; fromString: number; toString: number };
}

export interface TabNoteItem {
  /** 1 = high E ... 6 = low E */
  string: 1 | 2 | 3 | 4 | 5 | 6;
  fret: number;
  technique?: 'h' | 'p' | '/' | '\\' | 'b' | '~' | 'x';
  highlight?: 'root' | 'approach' | 'accent';
}

export interface TabStep {
  notes: TabNoteItem[];
  chord?: string;
  strum?: 'down' | 'up';
  /** Duration in beats: 1 = quarter, 0.5 = eighth, 2 = half, 4 = whole, 0.25 = sixteenth */
  beats?: number;
  barAfter?: boolean;
  annotation?: string;
}

export interface TabConfig {
  exampleNumber?: string;
  title: string;
  subtitle?: string;
  bpm?: number;
  timeSignature?: '4/4' | '3/4';
  steps: TabStep[];
}

export interface IntervalStripItem {
  label: string;
  sublabel?: string;
  highlight?: 'root' | 'chord' | 'altered' | 'avoid' | 'tension' | 'default';
}

export interface TableBlockData {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
}

export type LessonBlock =
  | { type: 'heading'; text: string; subtitle?: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; title?: string; ordered?: boolean; items: string[] }
  | {
      type: 'callout';
      variant: 'memorize' | 'remember' | 'rule' | 'summary';
      title: string;
      text?: string;
      items?: string[];
    }
  | { type: 'fretboard'; config: FretboardConfig }
  | {
      type: 'chord-grid';
      title: string;
      subtitle?: string;
      voicings: ChordBoxVoicing[];
    }
  | { type: 'tab'; config: TabConfig }
  | {
      type: 'interval-strip';
      title: string;
      subtitle?: string;
      items: IntervalStripItem[];
    }
  | { type: 'table'; data: TableBlockData }
  | {
      type: 'lab';
      labType:
        | 'note-trainer'
        | 'caged-7-explorer'
        | 'modal-pairs'
        | 'upper-structures'
        | 'glossary';
    };

export interface Lesson {
  id: string;
  moduleId: string;
  code: string;
  title: string;
  subtitle: string;
  pages: string;
  examples?: string;
  estimatedMinutes: number;
  blocks: LessonBlock[];
  practiceTips: string[];
  commonMistakes: string[];
}

export interface CourseModule {
  id: string;
  number: string;
  title: string;
  pages: string;
  description: string;
  lessons: Lesson[];
}
