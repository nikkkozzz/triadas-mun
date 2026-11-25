import React, { useMemo, useState } from 'react';
import { Volume2, RefreshCw, Search, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { CagedZone, NoteName, TriadQuality } from '../../types/course';
import { FretboardSVG } from '../diagrams/FretboardSVG';
import {
  getMidiAt,
  getNoteNameAt,
  noteToSemitone,
  SELECTABLE_KEYS,
  semitoneToNote,
  STRING_NAMES,
} from '../../utils/musicTheory';
import { guitarAudio } from '../../utils/guitarAudio';

/* ============================================================================
   1. FRETBOARD NOTE TRAINER (Capítulo 1.7 — "Haz los deberes", págs. 45-46)
   ============================================================================ */
const NATURAL_NOTES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const FretboardNoteTrainer: React.FC = () => {
  const [targetString, setTargetString] = useState<1 | 2 | 3 | 4 | 5 | 6>(5);
  const [targetFret, setTargetFret] = useState<number>(3);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [streak, setStreak] = useState(0);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const answerNote = useMemo(
    () => getNoteNameAt(targetString, targetFret, false),
    [targetString, targetFret]
  );

  const nextQuestion = () => {
    // Pick a natural note position between fret 1 and 12 (book's C-D-E / F-G-A-B exercise)
    for (let attempt = 0; attempt < 30; attempt++) {
      const s = (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
      const f = Math.floor(Math.random() * 12) + 1;
      const n = getNoteNameAt(s, f, false);
      if (NATURAL_NOTES.includes(n) && (s !== targetString || f !== targetFret)) {
        setTargetString(s);
        setTargetFret(f);
        setFeedback('idle');
        setSelectedNote(null);
        return;
      }
    }
  };

  const handleGuess = (note: NoteName) => {
    setSelectedNote(note);
    guitarAudio.playNote(targetString, targetFret, 1.1);
    if (note === answerNote) {
      setFeedback('correct');
      setStreak((s) => s + 1);
    } else {
      setFeedback('wrong');
      setStreak(0);
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Entrenador interactivo de notas en el diapasón
          </h4>
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6]">
            Usa las marcas de traste y los bloques visuales C–D–E y F–G–A–B para identificar la nota señalada.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[13px] font-mono tabular-nums">
          <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
            Racha: <strong className="text-[#30d158]">{streak}</strong>
          </span>
          <button
            type="button"
            onClick={nextQuestion}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071e3] dark:bg-[#0a84ff] text-white font-sans font-medium text-[12px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Nueva nota
          </button>
        </div>
      </div>

      <FretboardSVG
        config={{
          title: `Cuerda ${targetString} (${STRING_NAMES[targetString - 1]}) · Traste ${targetFret}`,
          subtitle: 'Identifica qué nota natural corresponde al punto rojo',
          startFret: 0,
          endFret: 12,
          notes: [
            {
              string: targetString,
              fret: targetFret,
              label: feedback === 'correct' ? answerNote : '?',
              role: 'root',
            },
          ],
        }}
      />

      <div className="flex flex-wrap items-center gap-2 mt-4">
        {NATURAL_NOTES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleGuess(n)}
            className={`w-11 h-11 rounded-xl font-mono text-[15px] font-bold transition-all cursor-pointer ${
              selectedNote === n && feedback === 'correct'
                ? 'bg-[#30d158] text-white'
                : selectedNote === n && feedback === 'wrong'
                  ? 'bg-[#ff453a] text-white'
                  : 'bg-white dark:bg-[#242426] border border-black/[0.08] dark:border-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] hover:border-[#0a84ff]'
            }`}
          >
            {n}
          </button>
        ))}

        {feedback === 'correct' && (
          <span className="inline-flex items-center gap-1.5 ml-2 text-[14px] font-medium text-[#248a3d] dark:text-[#30d158]">
            <CheckCircle2 className="w-4 h-4" />
            Correcto: {answerNote}
          </span>
        )}
        {feedback === 'wrong' && (
          <span className="inline-flex items-center gap-1.5 ml-2 text-[14px] font-medium text-[#d70015] dark:text-[#ff453a]">
            <XCircle className="w-4 h-4" />
            No es {selectedNote}. Pista: busca el bloque C–D–E o F–G–A–B más cercano.
          </span>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   2. CAGED 7-POSITION COMPARATOR (Capítulo 2.7 — Págs. 107-108)
   ============================================================================ */
export const CagedSevenPositionExplorer: React.FC<{ globalBpm?: number }> = ({ globalBpm = 88 }) => {
  const [root, setRoot] = useState<NoteName>('G');
  const [quality, setQuality] = useState<TriadQuality>('major');
  const [zone, setZone] = useState<CagedZone>('E');

  const qualities: { id: TriadQuality; label: string; formula: string }[] = [
    { id: 'major', label: 'Mayor', formula: '1 - 3 - 5' },
    { id: 'minor', label: 'Menor', formula: '1 - ♭3 - 5' },
    { id: 'diminished', label: 'Disminuida', formula: '1 - ♭3 - ♭5' },
    { id: 'augmented', label: 'Aumentada', formula: '1 - 3 - ♯5' },
  ];

  const zones: { id: CagedZone; label: string }[] = [
    { id: 'E', label: 'E' },
    { id: 'E2', label: "E'" },
    { id: 'D', label: 'D' },
    { id: 'C', label: 'C' },
    { id: 'A', label: 'A' },
    { id: 'A2', label: "A'" },
    { id: 'G', label: 'G' },
    { id: 'full', label: 'Todo' },
  ];

  const activeSpec = qualities.find((q) => q.id === quality)!;

  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
      <div className="mb-4">
        <h4 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
          Explorador comparativo de las 7 posiciones CAGED
        </h4>
        <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
          Cambia instantáneamente entre Mayor, Menor, Disminuida y Aumentada sin mover la mano para ver qué nota se desplaza un semitono.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="inline-flex rounded-xl bg-black/[0.06] dark:bg-white/[0.08] p-1">
          {qualities.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setQuality(q.id)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                quality === q.id
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs'
                  : 'text-[#6e6e73] dark:text-[#a1a1a6]'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-xl bg-black/[0.06] dark:bg-white/[0.08] p-1">
          {zones.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => setZone(z.id)}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-[12px] font-semibold transition-colors cursor-pointer ${
                zone === z.id
                  ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white'
                  : 'text-[#6e6e73] dark:text-[#a1a1a6]'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {(['G', 'C', 'D', 'A', 'E', 'F', 'Bb'] as NoteName[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setRoot(k)}
              className={`px-2 py-1 rounded-md font-mono text-[12px] font-semibold cursor-pointer ${
                root === k
                  ? 'bg-[#ff3b30] text-white'
                  : 'bg-black/[0.05] dark:bg-white/[0.06] text-[#6e6e73] dark:text-[#a1a1a6]'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <FretboardSVG
        key={`${root}-${quality}-${zone}`}
        globalBpm={globalBpm}
        config={{
          title: `${root} ${activeSpec.label} (${activeSpec.formula})`,
          root,
          quality,
          cagedZone: zone,
          startFret: 0,
          endFret: 15,
        }}
      />
    </div>
  );
};

/* ============================================================================
   3. MODAL TRIAD PAIR CALCULATOR (Capítulo 4.5 — Págs. 212-223)
   ============================================================================ */
interface ModalSpec {
  id: 'dorian' | 'phrygian' | 'lydian' | 'mixolydian';
  name: string;
  characteristic: string;
  chordQuality: string;
  degreeInMajor: number; // 2=Dorian, 3=Phrygian, 4=Lydian, 5=Mixolydian
  semitonesFromParentMajor: number;
  pairs: {
    code: string;
    label: string;
    firstOffset: number;
    firstQuality: 'major' | 'minor';
    secondOffset: number;
    secondQuality: 'major' | 'minor';
  }[];
}

const MODAL_SPECS: ModalSpec[] = [
  {
    id: 'dorian',
    name: 'Dórico (2º grado)',
    characteristic: '6ª mayor',
    chordQuality: 'm / m7',
    degreeInMajor: 2,
    semitonesFromParentMajor: 2,
    pairs: [
      { code: '4–5', label: 'Par 4–5 (Mayores a un tono)', firstOffset: 3, firstQuality: 'major', secondOffset: 5, secondQuality: 'major' },
      { code: '2–3', label: 'Par 2–3 (Menores a un tono)', firstOffset: 0, firstQuality: 'minor', secondOffset: 2, secondQuality: 'minor' },
    ],
  },
  {
    id: 'phrygian',
    name: 'Frigio (3er grado)',
    characteristic: '♭2 (semitono)',
    chordQuality: 'm / m7',
    degreeInMajor: 3,
    semitonesFromParentMajor: 4,
    pairs: [
      { code: '3–4', label: 'Par 3–4 (Menor + Mayor a ½ tono)', firstOffset: 0, firstQuality: 'minor', secondOffset: 1, secondQuality: 'major' },
      { code: '2–3', label: 'Par 2–3 (Menores)', firstOffset: 10, firstQuality: 'minor', secondOffset: 0, secondQuality: 'minor' },
    ],
  },
  {
    id: 'lydian',
    name: 'Lidio (4º grado)',
    characteristic: '♯4',
    chordQuality: 'Maj7',
    degreeInMajor: 4,
    semitonesFromParentMajor: 5,
    pairs: [
      { code: '4–5', label: 'Par 4–5 (Mayores a un tono)', firstOffset: 0, firstQuality: 'major', secondOffset: 2, secondQuality: 'major' },
      { code: '3–4', label: 'Par 3–4 (Menor + Mayor)', firstOffset: 11, firstQuality: 'minor', secondOffset: 0, secondQuality: 'major' },
    ],
  },
  {
    id: 'mixolydian',
    name: 'Mixolidio (5º grado)',
    characteristic: '♭7',
    chordQuality: '7 (Dominante)',
    degreeInMajor: 5,
    semitonesFromParentMajor: 7,
    pairs: [
      { code: '4–5', label: 'Par 4–5 (Mayores a un tono)', firstOffset: 10, firstQuality: 'major', secondOffset: 0, secondQuality: 'major' },
      { code: '2–3', label: 'Par 2–3 (Menores a un tono)', firstOffset: 7, firstQuality: 'minor', secondOffset: 9, secondQuality: 'minor' },
    ],
  },
];

export const ModalTriadPairLab: React.FC<{ globalBpm?: number }> = ({ globalBpm = 90 }) => {
  const [tonic, setTonic] = useState<NoteName>('A');
  const [modeId, setModeId] = useState<ModalSpec['id']>('mixolydian');
  const [pairIndex, setPairIndex] = useState(0);

  const spec = MODAL_SPECS.find((m) => m.id === modeId)!;
  const pair = spec.pairs[pairIndex] ?? spec.pairs[0];

  const tonicSemi = noteToSemitone(tonic);
  const parentMajorRoot = semitoneToNote(tonicSemi - spec.semitonesFromParentMajor, false);
  const firstRoot = semitoneToNote(tonicSemi + pair.firstOffset, false);
  const secondRoot = semitoneToNote(tonicSemi + pair.secondOffset, false);

  const firstSymbol = `${firstRoot}${pair.firstQuality === 'minor' ? 'm' : ''}`;
  const secondSymbol = `${secondRoot}${pair.secondQuality === 'minor' ? 'm' : ''}`;

  const playDemo = () => {
    const bassMidi = 40 + ((tonicSemi - 4 + 12) % 12); // Low 6th string pedal
    guitarAudio.playMidi(bassMidi, 2.6, 0, 0.78);
    // Play first triad
    const f1 = 52 + ((noteToSemitone(firstRoot) - 4 + 12) % 12);
    const f1Third = f1 + (pair.firstQuality === 'minor' ? 3 : 4);
    const f1Fifth = f1 + 7;
    guitarAudio.playMidi(f1, 1.1, 0.25, 0.65);
    guitarAudio.playMidi(f1Third, 1.1, 0.45, 0.65);
    guitarAudio.playMidi(f1Fifth, 1.1, 0.65, 0.65);

    // Play second triad
    const f2 = 52 + ((noteToSemitone(secondRoot) - 4 + 12) % 12);
    const f2Third = f2 + (pair.secondQuality === 'minor' ? 3 : 4);
    const f2Fifth = f2 + 7;
    guitarAudio.playMidi(f2, 1.2, 1.25, 0.68);
    guitarAudio.playMidi(f2Third, 1.2, 1.45, 0.68);
    guitarAudio.playMidi(f2Fifth, 1.2, 1.65, 0.68);
  };

  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Calculadora del «Truco Modal» de pares de tríadas (2–3–4–5)
          </h4>
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
            Elige centro tonal y modo para calcular automáticamente el par de tríadas contiguas que revelan el grado característico.
          </p>
        </div>
        <button
          type="button"
          onClick={playDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0071e3] dark:bg-[#0a84ff] text-white text-[13px] font-semibold cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          Escuchar pedal {tonic} + {firstSymbol}/{secondSymbol}
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] p-3">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6e6e73] dark:text-[#86868b]">
            1. Centro Tonal (Nota Pedal)
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {SELECTABLE_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTonic(k)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[12px] font-bold cursor-pointer ${
                  tonic === k
                    ? 'bg-[#ff3b30] text-white'
                    : 'bg-black/[0.05] dark:bg-white/[0.06] text-[#1d1d1f] dark:text-[#f5f5f7]'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] p-3">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6e6e73] dark:text-[#86868b]">
            2. Modo y Par de Tríadas
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {MODAL_SPECS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setModeId(m.id);
                  setPairIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold cursor-pointer ${
                  modeId === m.id
                    ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white'
                    : 'bg-black/[0.05] dark:bg-white/[0.06] text-[#6e6e73] dark:text-[#a1a1a6]'
                }`}
              >
                {m.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {spec.pairs.map((p, idx) => (
              <button
                key={p.code}
                type="button"
                onClick={() => setPairIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-[12px] font-medium cursor-pointer ${
                  pairIndex === idx
                    ? 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f]'
                    : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#6e6e73] dark:text-[#a1a1a6]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Banner */}
      <div className="rounded-xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
        <span>
          Modo: <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">{tonic} {spec.name}</strong>
        </span>
        <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
          Escala madre: <strong className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">{parentMajorRoot} mayor</strong>
        </span>
        <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
          Nota característica: <strong className="font-mono text-[#ff3b30]">{spec.characteristic}</strong>
        </span>
        <span>
          Par ganador:{' '}
          <strong className="font-mono text-[#0071e3] dark:text-[#0a84ff]">{firstSymbol}</strong>
          {' + '}
          <strong className="font-mono text-[#30d158]">{secondSymbol}</strong>
        </span>
      </div>

      <FretboardSVG
        key={`${firstRoot}-${secondRoot}-${pair.firstQuality}`}
        globalBpm={globalBpm}
        config={{
          title: `Superposición de par modal: ${firstSymbol} (negro/rojo) + ${secondSymbol} (verde)`,
          subtitle: `Alterna ambas tríadas sobre un pedal o acorde de ${tonic}${spec.chordQuality === '7 (Dominante)' ? '7' : spec.chordQuality === 'm / m7' ? 'm7' : 'maj7'}`,
          root: firstRoot,
          quality: pair.firstQuality,
          secondaryRoot: secondRoot,
          secondaryQuality: pair.secondQuality,
          secondaryLabel: `2ª tríada (${secondSymbol})`,
          defaultLabelMode: 'notes',
          startFret: 0,
          endFret: 14,
        }}
      />
    </div>
  );
};

/* ============================================================================
   4. UPPER STRUCTURE EXPLORER (Capítulo 5 — Págs. 226-244)
   ============================================================================ */
interface UpperPreset {
  id: string;
  baseChord: string;
  triadLabel: string;
  triadRoot: NoteName;
  triadQuality: TriadQuality;
  bassMidi: number;
  resultSound: string;
  tensions: string;
  formula: string;
}

const UPPER_PRESETS: UpperPreset[] = [
  {
    id: 'cmaj7',
    baseChord: 'C (Tónica mayor)',
    triadLabel: 'Em sobre bajo C',
    triadRoot: 'E',
    triadQuality: 'minor',
    bassMidi: 48, // C3
    resultSound: 'Cmaj7',
    tensions: '3 · 5 · 7',
    formula: 'Tríada menor desde el 3er grado',
  },
  {
    id: 'cmaj9',
    baseChord: 'C (Tónica mayor)',
    triadLabel: 'G sobre bajo C',
    triadRoot: 'G',
    triadQuality: 'major',
    bassMidi: 48,
    resultSound: 'Cmaj9',
    tensions: '5 · 7 · 9',
    formula: 'Tríada mayor desde el 5º grado',
  },
  {
    id: 'cm7',
    baseChord: 'Cm (Menor)',
    triadLabel: 'E♭ sobre bajo C',
    triadRoot: 'Eb',
    triadQuality: 'major',
    bassMidi: 48,
    resultSound: 'Cm7',
    tensions: '♭3 · 5 · ♭7',
    formula: 'Tríada mayor desde el grado ♭3',
  },
  {
    id: 'cm9',
    baseChord: 'Cm (Menor)',
    triadLabel: 'Gm sobre bajo C',
    triadRoot: 'G',
    triadQuality: 'minor',
    bassMidi: 48,
    resultSound: 'Cm9',
    tensions: '5 · ♭7 · 9',
    formula: 'Tríada menor desde el 5º grado',
  },
  {
    id: 'a7b9b13',
    baseChord: 'A7 (Dominante ♭9♭13)',
    triadLabel: 'B♭m sobre bajo A7',
    triadRoot: 'Bb',
    triadQuality: 'minor',
    bassMidi: 45, // A2
    resultSound: 'A7(♭9, ♭13)',
    tensions: '♭9 · 3 · ♭13',
    formula: 'Tríada menor ½ tono por encima del dominante',
  },
  {
    id: 'g7alt',
    baseChord: 'G7 (Alterado)',
    triadLabel: 'E♭ sobre bajo G7',
    triadRoot: 'Eb',
    triadQuality: 'major',
    bassMidi: 43, // G2
    resultSound: 'G7(♯5, ♭9)',
    tensions: '♯5(♭13) · 1 · ♯9',
    formula: 'Tríada mayor sobre ♯5 (o ♭5 = D♭)',
  },
  {
    id: 'g7dim',
    baseChord: 'G7 (Disminuido H-W)',
    triadLabel: 'E mayor sobre bajo G7',
    triadRoot: 'E',
    triadQuality: 'major',
    bassMidi: 43,
    resultSound: 'G13(♭9)',
    tensions: '13 · ♭9 · 3',
    formula: 'Mayor ½ tono debajo de 3, 5 o ♭7 (B♭, D♭, E)',
  },
];

export const UpperStructureExplorer: React.FC = () => {
  const [selectedId, setSelectedId] = useState(UPPER_PRESETS[0].id);
  const preset = UPPER_PRESETS.find((p) => p.id === selectedId)!;

  const playUpperStructure = () => {
    // Low bass root + upper triad notes clearly separated in register
    guitarAudio.playMidi(preset.bassMidi, 2.3, 0, 0.85);
    const triadSemi = noteToSemitone(preset.triadRoot);
    const baseTriadMidi = 60 + triadSemi; // C4 octave
    const third = baseTriadMidi + (preset.triadQuality === 'minor' ? 3 : 4);
    const fifth = baseTriadMidi + 7;

    guitarAudio.playMidi(baseTriadMidi, 1.9, 0.22, 0.65);
    guitarAudio.playMidi(third, 1.9, 0.34, 0.65);
    guitarAudio.playMidi(fifth, 1.9, 0.46, 0.65);
  };

  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Laboratorio de Superposición (Upper Structures)
          </h4>
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
            Escucha cómo una tríada simple tocada en registro agudo transforma por completo un bajo o acorde base.
          </p>
        </div>
        <button
          type="button"
          onClick={playUpperStructure}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071e3] dark:bg-[#0a84ff] text-white text-[13px] font-semibold cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          Escuchar {preset.resultSound}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
        {UPPER_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedId(p.id)}
            className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
              selectedId === p.id
                ? 'border-[#0a84ff] bg-white dark:bg-[#1f2937]/40'
                : 'border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#1c1c1e] hover:border-black/[0.15] dark:hover:border-white/[0.2]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                {p.resultSound}
              </span>
              <span className="font-mono text-[11px] text-[#0071e3] dark:text-[#0a84ff] font-semibold">
                {p.tensions}
              </span>
            </div>
            <p className="text-[12px] text-[#6e6e73] dark:text-[#a1a1a6] mt-1">{p.triadLabel}</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] px-4 py-3 mb-2 text-[13px] text-[#424245] dark:text-[#d1d1d6]">
        <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">Regla práctica:</strong> {preset.formula} · Aporta las tensiones{' '}
        <span className="font-mono font-semibold text-[#0071e3] dark:text-[#0a84ff]">{preset.tensions}</span> sobre {preset.baseChord}.
      </div>

      <FretboardSVG
        key={preset.id}
        config={{
          title: `Tríada a tocar: ${preset.triadLabel} → ${preset.resultSound}`,
          root: preset.triadRoot,
          quality: preset.triadQuality,
          cagedZone: 'full',
          stringSet: [1, 2, 3, 4],
          defaultLabelMode: 'notes',
          startFret: 0,
          endFret: 14,
        }}
      />
    </div>
  );
};

/* ============================================================================
   5. COMPLETE 53-TERM GLOSSARY (Anexo — Págs. 303-306)
   ============================================================================ */
interface GlossaryEntry {
  term: string;
  definition: string;
  lessonId: string;
  chapterRef: string;
}

const GLOSSARY_TERMS: GlossaryEntry[] = [
  { term: 'Acorde de subdominante', definition: 'Acorde con función de alejamiento suave respecto a la tónica (principalmente grado IV y grado IIm).', lessonId: 'ch5-3', chapterRef: 'Cap. 5' },
  { term: 'Acorde de tónica', definition: 'Acorde de reposo y estabilidad sobre el que resuelve la tonalidad (grado I, y sustitutos VIm y IIIm).', lessonId: 'ch5-3', chapterRef: 'Cap. 5' },
  { term: 'Acorde dominante', definition: 'Acorde con máxima tensión armónica (grado V7) que contiene el tritono entre 3 y ♭7 y pide resolver en la tónica.', lessonId: 'ch5-3', chapterRef: 'Cap. 5' },
  { term: 'Acorde omitido (shell voicing)', definition: 'Acorde en el que se prescinde de alguna nota (habitualmente la 5ª justa o la tónica si la toca el bajo) para aligerar la textura.', lessonId: 'ch7-2', chapterRef: 'Anexo' },
  { term: 'Acorde suspendido (sus2 / sus4)', definition: 'Acorde donde la 3ª se sustituye por la 2ª mayor (sus2) o la 4ª justa (sus4), creando ambigüedad tonal.', lessonId: 'ch6-3', chapterRef: 'Cap. 6' },
  { term: 'Acorde tríada', definition: 'Acorde básico formado por tres notas obtenidas por superposición de terceras (grados 1, 3 y 5).', lessonId: 'ch1-1', chapterRef: 'Cap. 1' },
  { term: 'Acorde tétrada (cuatríada)', definition: 'Acorde de cuatro notas formado añadiendo una tercera más (la séptima) sobre la tríada (1-3-5-7).', lessonId: 'ch1-4', chapterRef: 'Cap. 1' },
  { term: 'Alteraciones', definition: 'Sostenidos (♯), bemoles (♭) o becuadros (♮) que modifican la altura de una nota en un semitono.', lessonId: 'ch1-2', chapterRef: 'Cap. 1' },
  { term: 'Anticipación', definition: 'Adelantar una nota del acorde siguiente en la última fracción débil (contratiempo) del compás actual.', lessonId: 'ch3-2', chapterRef: 'Cap. 3' },
  { term: 'Apoyatura', definition: 'Nota ajena al acorde que suena en tiempo fuerte y resuelve por grado conjunto (tono o semitono) sobre una nota del acorde.', lessonId: 'ch6-6', chapterRef: 'Cap. 6' },
  { term: 'Aproximación cromática', definition: 'Nota situada a un semitono inferior o superior que conduce hacia una nota objetivo de la tríada.', lessonId: 'ch6-1', chapterRef: 'Cap. 6' },
  { term: 'Aproximación diatónica', definition: 'Nota perteneciente a la escala de la tonalidad que resuelve por paso conjunto hacia una nota del acorde.', lessonId: 'ch6-1', chapterRef: 'Cap. 6' },
  { term: 'Armonización de escalas', definition: 'Construcción de un acorde sobre cada grado de una escala superponiendo terceras diatónicas.', lessonId: 'ch1-4', chapterRef: 'Cap. 1' },
  { term: 'Armonización de melodías', definition: 'Asignación de tríadas (I, IV, V...) por debajo de una línea melódica para acompañarla en estilo chord-melody.', lessonId: 'ch4-1', chapterRef: 'Cap. 4' },
  { term: 'Arpegio', definition: 'Ejecución sucesiva (nota a nota) de las notas que componen un acorde.', lessonId: 'ch1-1', chapterRef: 'Cap. 1' },
  { term: 'Cadencia', definition: 'Sucesión de acordes que cierra o puntúa una frase musical (p. ej. auténtica V–I o plagal IV–I).', lessonId: 'ch3-1', chapterRef: 'Cap. 3' },
  { term: 'Centro tonal', definition: 'Nota o acorde principal percibido como punto de gravedad y reposo de una pieza o sección modal.', lessonId: 'ch4-4', chapterRef: 'Cap. 4' },
  { term: 'Ciclo de cuartas', definition: 'Secuencia armónica donde cada raíz asciende una cuarta justa (7–3–6–2–5–1–4), base del jazz y estándares.', lessonId: 'ch3-8', chapterRef: 'Cap. 3' },
  { term: 'Contratiempo', definition: 'Acentuación o ataque en las fracciones débiles del pulso ("y"), fundamental en la práctica rítmica con metrónomo.', lessonId: 'ch2-3', chapterRef: 'Cap. 2' },
  { term: 'Disminuido auxiliar', definition: 'Acorde disminuido construido sobre la misma tónica que el acorde de reposo (I–Iº–I) para generar tensión pasajera.', lessonId: 'ch3-6', chapterRef: 'Cap. 3' },
  { term: 'Disposición abierta', definition: 'Distribución de las voces de un acorde que abarca más de una octava entre la nota más grave y la más aguda.', lessonId: 'ch1-8', chapterRef: 'Cap. 1' },
  { term: 'Disposición cerrada', definition: 'Distribución compacta de las tres notas de una tríada dentro del ámbito de una octava (3 cuerdas adyacentes).', lessonId: 'ch1-8', chapterRef: 'Cap. 1' },
  { term: 'Doble aproximación', definition: 'Rodeo de una nota objetivo atacando primero por encima y por debajo (o viceversa) antes de resolver en ella.', lessonId: 'ch6-1', chapterRef: 'Cap. 6' },
  { term: 'Dominante alterado', definition: 'Acorde dominante con tensiones alteradas (♭9, ♯9, ♭5/♯11, ♯5/♭13) para máxima tensión antes de resolver.', lessonId: 'ch5-3', chapterRef: 'Cap. 5' },
  { term: 'Dominante secundario', definition: 'Acorde dominante (V7) prestado temporalmente para resolver en un grado distinto a la tónica principal (p. ej. V/IIm).', lessonId: 'ch3-5', chapterRef: 'Cap. 3' },
  { term: 'Double stops', definition: 'Ejecución simultánea de dos notas (habitualmente terceras, cuartas o sextas extraídas de una tríada).', lessonId: 'ch4-2', chapterRef: 'Cap. 4' },
  { term: 'Drop 2 / Drop 3', definition: 'Técnica de apertura de acordes que baja una octava la segunda (Drop 2) o tercera (Drop 3) voz desde el agudo.', lessonId: 'ch1-8', chapterRef: 'Cap. 1' },
  { term: 'Enarmonía', definition: 'Dos nombres distintos para el mismo sonido en afinación temperada (p. ej. C♯ y D♭).', lessonId: 'ch1-2', chapterRef: 'Cap. 1' },
  { term: 'Escala cromática', definition: 'Sucesión de los 12 semitonos consecutivos dentro de una octava.', lessonId: 'ch1-2', chapterRef: 'Cap. 1' },
  { term: 'Escala disminuida (semitono-tono)', definition: 'Escala simétrica de 8 notas (1-♭9-♯9-3-♯11-5-13-♭7) usada sobre dominantes para generar tríadas mayores a distancia de 3ª menor.', lessonId: 'ch5-3', chapterRef: 'Cap. 5' },
  { term: 'Escala mayor', definition: 'Escala diatónica de 7 notas con estructura T–T–st–T–T–T–st (semitonos entre grados 3–4 y 7–1).', lessonId: 'ch1-2', chapterRef: 'Cap. 1' },
  { term: 'Escala menor armónica', definition: 'Escala menor natural con el 7º grado ascendido un semitono para crear un acorde V mayor con sensible.', lessonId: 'ch3-5', chapterRef: 'Cap. 3' },
  { term: 'Escala menor natural', definition: 'Escala relativa menor construida desde el 6º grado de la escala mayor (1-2-♭3-4-5-♭6-♭7).', lessonId: 'ch1-5', chapterRef: 'Cap. 1' },
  { term: 'Escala pentatónica', definition: 'Escala de 5 notas: la tríada mayor + grados 2 y 6 (pentatónica mayor) o la tríada menor + grados 4 y ♭7 (pentatónica menor).', lessonId: 'ch6-4', chapterRef: 'Cap. 6' },
  { term: 'Estado fundamental', definition: 'Posición de un acorde en la que la tónica (grado 1) ocupa la voz más grave (bajo).', lessonId: 'ch1-8', chapterRef: 'Cap. 1' },
  { term: 'Falsa sensible', definition: 'Nota de aproximación cromática situada un semitono por encima de la nota objetivo.', lessonId: 'ch6-1', chapterRef: 'Cap. 6' },
  { term: 'Grado característico', definition: 'Intervalo concreto que diferencia y define la sonoridad única de un modo (p. ej. 6 en Dórico, ♯4 en Lidio, ♭7 en Mixolidio).', lessonId: 'ch4-4', chapterRef: 'Cap. 4' },
  { term: 'Grado musical', definition: 'Posición numérica relativa de una nota respecto a la tónica (1, 2, 3, 4, 5, 6, 7). Pensar en grados permite transportar al instante.', lessonId: 'ch1-6', chapterRef: 'Cap. 1' },
  { term: 'Intercambio modal', definition: 'Préstamo de acordes provenientes de escalas paralelas con la misma tónica (p. ej. usar IVm o IIº en tonalidad mayor).', lessonId: 'ch3-6', chapterRef: 'Cap. 3' },
  { term: 'Intervalo', definition: 'Distancia en altura entre dos notas medida en tonos y semitonos.', lessonId: 'ch1-3', chapterRef: 'Cap. 1' },
  { term: 'Inversión de acorde', definition: 'Disposición de un acorde donde el bajo no es la tónica: 1ª inversión (3 en el bajo) o 2ª inversión (5 en el bajo).', lessonId: 'ch1-8', chapterRef: 'Cap. 1' },
  { term: 'Modos griegos (de la escala mayor)', definition: 'Las 7 escalas obtenidas al tomar cada grado de la escala mayor como centro tonal: Jónico, Dórico, Frigio, Lidio, Mixolidio, Eólico y Locrio.', lessonId: 'ch4-4', chapterRef: 'Cap. 4' },
  { term: 'Nota a evitar', definition: 'Nota de la escala que choca a distancia de semitono por encima de una nota estructural del acorde (p. ej. F sobre C mayor).', lessonId: 'ch5-2', chapterRef: 'Cap. 5' },
  { term: 'Nota de paso', definition: 'Nota añadida entre dos notas de la tríada (como la 2ª o la 4ª) para crear líneas melódicas más fluidas.', lessonId: 'ch6-2', chapterRef: 'Cap. 6' },
  { term: 'Nota objetivo (target note)', definition: 'Nota de la tríada (especialmente la 3ª o la 1ª) hacia la que se dirige y resuelve una frase en el cambio de acorde.', lessonId: 'ch3-2', chapterRef: 'Cap. 3' },
  { term: 'Nota pedal', definition: 'Nota grave mantenida de forma constante mientras cambian las tríadas o armonías por encima.', lessonId: 'ch4-4', chapterRef: 'Cap. 4' },
  { term: 'Pares de tríadas', definition: 'Uso alternado de dos tríadas contiguas sin notas en común (6 notas) para proyectar una sonoridad modal definida.', lessonId: 'ch4-5', chapterRef: 'Cap. 4' },
  { term: 'Sensible', definition: 'Nota situada un semitono por debajo de la tónica o de cualquier nota objetivo, con fuerte atracción resolutiva ascendente.', lessonId: 'ch6-1', chapterRef: 'Cap. 6' },
  { term: 'Sistema CAGED (y 7 posiciones)', definition: 'Mapa del diapasón basado en las 5 formas abiertas C–A–G–E–D ampliadas con E\' y A\' para eliminar puntos muertos.', lessonId: 'ch2-1', chapterRef: 'Cap. 2' },
  { term: 'Superposición de tríadas', definition: 'Tocar una tríada diferente sobre un acorde base o bajo para generar tétradas y tensiones avanzadas sin memorizar formas complejas.', lessonId: 'ch5-1', chapterRef: 'Cap. 5' },
  { term: 'Tensiones armónicas', definition: 'Extensiones más allá de la séptima (9, 11, 13 y sus alteraciones ♭9, ♯9, ♯11, ♭13) que aportan color al acorde.', lessonId: 'ch5-2', chapterRef: 'Cap. 5' },
  { term: 'Turnaround', definition: 'Breve progresión final (habitualmente en los últimos compases de un blues o estándar) que relanza la rueda hacia el inicio.', lessonId: 'ch3-7', chapterRef: 'Cap. 3' },
  { term: 'Upper structure', definition: 'Tríada mayor o menor ejecutada en el registro agudo sobre un bajo o tritono para producir un acorde con tensiones complejas.', lessonId: 'ch5-1', chapterRef: 'Cap. 5' },
];

export const InteractiveGlossary: React.FC<{ onNavigateLesson?: (lessonId: string) => void }> = ({
  onNavigateLesson,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter(
      (item) =>
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.chapterRef.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Glosario completo del libro ({GLOSSARY_TERMS.length} términos)
          </h4>
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6]">
            Filtra cualquier concepto armónico o técnico y salta directamente a su lección.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar término..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#242426] border border-black/[0.08] dark:border-white/[0.1] text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-none focus:border-[#0a84ff]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[540px] overflow-y-auto pr-1">
        {filtered.map((item) => (
          <div
            key={item.term}
            className="rounded-xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] p-4 flex flex-col justify-between gap-2"
          >
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <h5 className="text-[14px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {item.term}
                </h5>
                <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#86868b] shrink-0">
                  {item.chapterRef}
                </span>
              </div>
              <p className="text-[13px] text-[#424245] dark:text-[#a1a1a6] mt-1 leading-relaxed">
                {item.definition}
              </p>
            </div>
            {onNavigateLesson && (
              <button
                type="button"
                onClick={() => onNavigateLesson(item.lessonId)}
                className="self-start inline-flex items-center gap-1 text-[12px] font-semibold text-[#0071e3] dark:text-[#0a84ff] hover:underline cursor-pointer mt-1"
              >
                Ir a la lección
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-[14px] text-[#6e6e73] dark:text-[#86868b] col-span-2 py-8 text-center">
            No se encontraron términos que coincidan con «{query}».
          </p>
        )}
      </div>
    </div>
  );
};
