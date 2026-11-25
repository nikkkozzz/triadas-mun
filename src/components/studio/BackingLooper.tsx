import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Square, Minus, Plus } from 'lucide-react';
import { NoteName, TriadQuality } from '../../types/course';
import {
  noteToSemitone,
  SELECTABLE_KEYS,
  semitoneToNote,
} from '../../utils/musicTheory';
import { guitarAudio } from '../../utils/guitarAudio';
import { FretboardSVG } from '../diagrams/FretboardSVG';

interface BarChordDef {
  roman: string;
  semitoneOffset: number;
  quality: 'major' | 'minor' | 'diminished' | 'augmented';
  triadOverlayOffset?: number;
  triadOverlayQuality?: 'major' | 'minor';
  hint?: string;
}

interface ProgressionPreset {
  id: string;
  name: string;
  chapterRef: string;
  description: string;
  defaultKey: NoteName;
  defaultBpm: number;
  bars: BarChordDef[];
}

const PROGRESSIONS: ProgressionPreset[] = [
  {
    id: 'v-i',
    name: 'Cadencia I – V (Mayor)',
    chapterRef: 'Cap. 3.1',
    description: 'Mini-progresión esencial para practicar 1, 2 y 4 notas por acorde.',
    defaultKey: 'G',
    defaultBpm: 84,
    bars: [
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'V', semitoneOffset: 7, quality: 'major' },
      { roman: 'V', semitoneOffset: 7, quality: 'major' },
    ],
  },
  {
    id: 'iv-i',
    name: 'Cadencia I – IV (Plagal)',
    chapterRef: 'Cap. 3.3',
    description: 'Enlace suave entre tónica y subdominante sin mover la mano.',
    defaultKey: 'G',
    defaultBpm: 86,
    bars: [
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'IV', semitoneOffset: 5, quality: 'major' },
      { roman: 'IV', semitoneOffset: 5, quality: 'major' },
    ],
  },
  {
    id: 'i-iv-v',
    name: 'Progresión I – IV – I – V',
    chapterRef: 'Cap. 3.8',
    description: 'La rueda reina del rock, pop y country en 4 compases.',
    defaultKey: 'G',
    defaultBpm: 92,
    bars: [
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'IV', semitoneOffset: 5, quality: 'major' },
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'V', semitoneOffset: 7, quality: 'major' },
    ],
  },
  {
    id: 'blues-major',
    name: 'Blues Mayor (12 compases)',
    chapterRef: 'Cap. 3.8 · Ej. 47',
    description: 'Forma completa de 12 compases con turnaround V+ al final.',
    defaultKey: 'G',
    defaultBpm: 94,
    bars: [
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'IV', semitoneOffset: 5, quality: 'major' },
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'IV', semitoneOffset: 5, quality: 'major' },
      { roman: 'IV', semitoneOffset: 5, quality: 'major' },
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'V', semitoneOffset: 7, quality: 'major' },
      { roman: 'IV', semitoneOffset: 5, quality: 'major' },
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'V+', semitoneOffset: 7, quality: 'augmented', hint: 'Turnaround aumentado' },
    ],
  },
  {
    id: 'blues-minor',
    name: 'Blues Menor (12 compases)',
    chapterRef: 'Cap. 3.8 · Ej. 50',
    description: 'Incluye el giro clásico ♭VI → V → Im en los últimos 4 compases.',
    defaultKey: 'G',
    defaultBpm: 80,
    bars: [
      { roman: 'Im', semitoneOffset: 0, quality: 'minor' },
      { roman: 'Im', semitoneOffset: 0, quality: 'minor' },
      { roman: 'Im', semitoneOffset: 0, quality: 'minor' },
      { roman: 'Im', semitoneOffset: 0, quality: 'minor' },
      { roman: 'IVm', semitoneOffset: 5, quality: 'minor' },
      { roman: 'IVm', semitoneOffset: 5, quality: 'minor' },
      { roman: 'Im', semitoneOffset: 0, quality: 'minor' },
      { roman: 'Im', semitoneOffset: 0, quality: 'minor' },
      { roman: '♭VI', semitoneOffset: 8, quality: 'major' },
      { roman: 'V', semitoneOffset: 7, quality: 'major' },
      { roman: 'Im', semitoneOffset: 0, quality: 'minor' },
      { roman: 'V', semitoneOffset: 7, quality: 'major' },
    ],
  },
  {
    id: 'ii-v-i',
    name: 'Cadencia IIm – V – I (Jazz/Pop)',
    chapterRef: 'Cap. 3.8 & 5.2',
    description: 'Ciclo de cuartas perfecto para practicar enlaces cercanos y Upper Structures.',
    defaultKey: 'C',
    defaultBpm: 86,
    bars: [
      { roman: 'IIm', semitoneOffset: 2, quality: 'minor' },
      { roman: 'V', semitoneOffset: 7, quality: 'major' },
      { roman: 'I', semitoneOffset: 0, quality: 'major' },
      { roman: 'VIm', semitoneOffset: 9, quality: 'minor' },
    ],
  },
  {
    id: 'vamp-dorian',
    name: 'Vamp Dórico (Par modal 4–5)',
    chapterRef: 'Cap. 4.5 · Ej. 64',
    description: 'Base menor dórica para alternar las tríadas mayores del par 4–5 (p. ej. C y D sobre Am).',
    defaultKey: 'A',
    defaultBpm: 94,
    bars: [
      { roman: 'Im (♭III)', semitoneOffset: 0, quality: 'minor', triadOverlayOffset: 3, triadOverlayQuality: 'major', hint: 'Tríada ♭III (4 del modo)' },
      { roman: 'Im (IV)', semitoneOffset: 0, quality: 'minor', triadOverlayOffset: 5, triadOverlayQuality: 'major', hint: 'Tríada IV (5 del modo · nota 6ª)' },
    ],
  },
  {
    id: 'vamp-mixolydian',
    name: 'Vamp Mixolidio (Par modal 4–5)',
    chapterRef: 'Cap. 4.5 · Ej. 63',
    description: 'Groove dominante para alternar las tríadas ♭VII y I (p. ej. G y A sobre A7).',
    defaultKey: 'A',
    defaultBpm: 96,
    bars: [
      { roman: 'I7 (I)', semitoneOffset: 0, quality: 'major', triadOverlayOffset: 0, triadOverlayQuality: 'major', hint: 'Tríada I' },
      { roman: 'I7 (♭VII)', semitoneOffset: 0, quality: 'major', triadOverlayOffset: 10, triadOverlayQuality: 'major', hint: 'Tríada ♭VII (sonido Mixolidio)' },
    ],
  },
];

const FRET_ZONES = [
  { id: 'all', label: 'Todo (0–15)', start: 0, end: 15 },
  { id: 'z1', label: 'Zona 0–5', start: 0, end: 5 },
  { id: 'z2', label: 'Zona 3–8', start: 3, end: 8 },
  { id: 'z3', label: 'Zona 7–12', start: 7, end: 12 },
  { id: 'z4', label: 'Zona 10–15', start: 10, end: 15 },
] as const;

export const BackingLooper: React.FC<{ initialBpm?: number }> = ({ initialBpm = 88 }) => {
  const [presetId, setPresetId] = useState(PROGRESSIONS[0].id);
  const [rootKey, setRootKey] = useState<NoteName>('G');
  const [bpm, setBpm] = useState(initialBpm);
  const [zoneId, setZoneId] = useState<(typeof FRET_ZONES)[number]['id']>('z2');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBar, setCurrentBar] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [includeClick, setIncludeClick] = useState(true);

  const preset = useMemo(
    () => PROGRESSIONS.find((p) => p.id === presetId) ?? PROGRESSIONS[0],
    [presetId]
  );

  const zone = FRET_ZONES.find((z) => z.id === zoneId) ?? FRET_ZONES[0];

  const resolvedBars = useMemo(() => {
    const keySemi = noteToSemitone(rootKey);
    const preferFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db'].includes(rootKey);
    return preset.bars.map((b) => {
      const chordRoot = semitoneToNote(keySemi + b.semitoneOffset, preferFlats);
      const suffix =
        b.quality === 'minor' ? 'm' : b.quality === 'diminished' ? 'º' : b.quality === 'augmented' ? '+' : '';
      const targetRoot =
        b.triadOverlayOffset !== undefined
          ? semitoneToNote(keySemi + b.triadOverlayOffset, preferFlats)
          : chordRoot;
      const targetQuality: TriadQuality = b.triadOverlayQuality ?? b.quality;
      const targetSuffix = targetQuality === 'minor' ? 'm' : targetQuality === 'augmented' ? '+' : '';

      return {
        ...b,
        chordRoot,
        chordName: `${chordRoot}${suffix}`,
        targetRoot,
        targetQuality,
        targetName: `${targetRoot}${targetSuffix}`,
      };
    });
  }, [preset, rootKey]);

  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  const playBackingBeat = (barIdx: number, beatInBar: number) => {
    const bar = resolvedBars[barIdx];
    if (!bar) return;

    const rootSemi = noteToSemitone(bar.chordRoot);
    const bassMidi = 40 + ((rootSemi - 4 + 12) % 12); // E2..D#3 range
    const chordBase = bassMidi + 12;
    const third = chordBase + (bar.quality === 'minor' || bar.quality === 'diminished' ? 3 : 4);
    const fifth =
      chordBase + (bar.quality === 'diminished' ? 6 : bar.quality === 'augmented' ? 8 : 7);

    if (includeClick) {
      guitarAudio.playMetronomeClick(beatInBar === 1 ? 'accent' : 'beat');
    }

    if (beatInBar === 1) {
      // Strong bass root + warm chord pad
      guitarAudio.playMidi(bassMidi, 1.9, 0, 0.8);
      guitarAudio.playMidi(chordBase, 1.4, 0.02, 0.42);
      guitarAudio.playMidi(third, 1.4, 0.04, 0.4);
      guitarAudio.playMidi(fifth, 1.4, 0.06, 0.4);
    } else if (beatInBar === 3) {
      // Rhythmic comp pulse on beat 3
      guitarAudio.playMidi(bassMidi, 0.9, 0, 0.55);
      guitarAudio.playMidi(third, 0.85, 0.02, 0.34);
      guitarAudio.playMidi(fifth, 0.85, 0.04, 0.34);
    } else if (beatInBar === 2 || beatInBar === 4) {
      // Light backbeat chord stab
      guitarAudio.playMidi(chordBase + 12, 0.35, 0, 0.18);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const beatMs = (60 / bpm) * 1000;
    const totalBars = resolvedBars.length;

    const tick = () => {
      const s = stepRef.current;
      const barIdx = Math.floor(s / 4) % totalBars;
      const beatInBar = (s % 4) + 1;
      setCurrentBar(barIdx);
      setCurrentBeat(beatInBar);
      playBackingBeat(barIdx, beatInBar);
      stepRef.current += 1;
    };

    tick();
    timerRef.current = window.setInterval(tick, beatMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, bpm, resolvedBars, includeClick]);

  const handleSelectPreset = (id: string) => {
    const found = PROGRESSIONS.find((p) => p.id === id);
    setPresetId(id);
    stepRef.current = 0;
    setCurrentBar(0);
    setCurrentBeat(1);
    if (found) {
      setRootKey(found.defaultKey);
      setBpm(found.defaultBpm);
    }
  };

  const activeBar = resolvedBars[currentBar] ?? resolvedBars[0];

  return (
    <div className="space-y-5">
      {/* Progression Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {PROGRESSIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelectPreset(p.id)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              presetId === p.id
                ? 'border-[#0a84ff] bg-[#0071e3]/10 dark:bg-[#0a84ff]/15'
                : 'border-black/[0.08] dark:border-white/[0.09] bg-white dark:bg-[#1c1c1e] hover:border-black/[0.2] dark:hover:border-white/[0.22]'
            }`}
          >
            <div className="text-[11px] font-mono text-[#0071e3] dark:text-[#0a84ff] font-semibold">
              {p.chapterRef}
            </div>
            <div className="text-[13px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5 leading-snug">
              {p.name}
            </div>
          </button>
        ))}
      </div>

      {/* Transport + Key + Zone Bar */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!isPlaying) {
                  stepRef.current = 0;
                }
                setIsPlaying((p) => !p);
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-[#ff453a] text-white'
                  : 'bg-[#0071e3] dark:bg-[#0a84ff] text-white hover:opacity-90'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  Detener bucle
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Iniciar Looper
                </>
              )}
            </button>

            {/* Beat Dots */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((b) => (
                <div
                  key={b}
                  className={`w-7 h-7 rounded-lg font-mono text-[12px] font-bold flex items-center justify-center tabular-nums transition-all ${
                    isPlaying && currentBeat === b
                      ? b === 1
                        ? 'bg-[#ff3b30] text-white scale-105'
                        : 'bg-[#0a84ff] text-white scale-105'
                      : 'bg-black/[0.06] dark:bg-white/[0.08] text-[#86868b]'
                  }`}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* BPM Control + Click Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.09] rounded-xl px-2 py-1">
              <button
                type="button"
                onClick={() => setBpm((v) => Math.max(50, v - 5))}
                className="p-1 text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
                aria-label="Reducir BPM"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[13px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7] w-16 text-center tabular-nums">
                {bpm} BPM
              </span>
              <button
                type="button"
                onClick={() => setBpm((v) => Math.min(180, v + 5))}
                className="p-1 text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
                aria-label="Aumentar BPM"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIncludeClick((c) => !c)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors ${
                includeClick
                  ? 'bg-[#30d158]/20 text-[#248a3d] dark:text-[#30d158] border border-[#30d158]/35'
                  : 'bg-black/[0.05] dark:bg-white/[0.08] text-[#86868b]'
              }`}
            >
              Claqueta: {includeClick ? 'Sí' : 'No'}
            </button>
          </div>
        </div>

        {/* Key & Fret Zone Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08] text-[12px]">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[#6e6e73] dark:text-[#86868b] font-medium mr-1">Tonalidad:</span>
            {SELECTABLE_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setRootKey(k)}
                className={`px-2 py-0.5 rounded-md font-mono font-semibold cursor-pointer ${
                  rootKey === k
                    ? 'bg-[#ff3b30] text-white'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/[0.06] dark:hover:bg-white/[0.08]'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[#6e6e73] dark:text-[#86868b] font-medium mr-1">
              Zona fija:
            </span>
            {FRET_ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setZoneId(z.id)}
                className={`px-2 py-0.5 rounded-md font-mono font-medium cursor-pointer ${
                  zoneId === z.id
                    ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/[0.06] dark:hover:bg-white/[0.08]'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Bar Chart Timeline */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
          {resolvedBars.map((bar, idx) => {
            const active = idx === currentBar;
            return (
              <button
                key={`${bar.roman}-${idx}`}
                type="button"
                onClick={() => {
                  setCurrentBar(idx);
                  stepRef.current = idx * 4;
                }}
                className={`rounded-xl border px-3 py-2.5 text-center transition-all cursor-pointer ${
                  active
                    ? 'border-[#0a84ff] bg-[#0071e3] dark:bg-[#0a84ff] text-white shadow-sm'
                    : 'border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7]'
                }`}
              >
                <div className="font-mono text-[15px] font-bold">{bar.chordName}</div>
                <div
                  className={`text-[10.5px] font-mono ${
                    active ? 'text-white/85' : 'text-[#86868b]'
                  }`}
                >
                  {bar.roman} · C.{idx + 1}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Synchronized Fretboard Showing Active Triad */}
      <FretboardSVG
        key={`${activeBar.targetRoot}-${activeBar.targetQuality}-${zone.id}`}
        globalBpm={bpm}
        config={{
          title: `Tríada activa en compás ${currentBar + 1}: ${activeBar.targetName} (${activeBar.roman})`,
          subtitle:
            activeBar.hint ??
            `${preset.description} Apunta a los puntos rojos (1) y oscuros (3/5) dentro de la zona elegida.`,
          root: activeBar.targetRoot,
          quality: activeBar.targetQuality,
          cagedZone: 'full',
          startFret: zone.start,
          endFret: zone.end,
        }}
      />
    </div>
  );
};
