import React, { useMemo, useState } from 'react';
import { Volume2, Play, Square } from 'lucide-react';
import { CagedZone, FretboardConfig, FretNote, NoteName } from '../../types/course';
import {
  generateFretboardNotes,
  getCagedZoneLabel,
  getMidiAt,
  QUALITY_SPECS,
  SELECTABLE_KEYS,
  STRING_NAMES,
} from '../../utils/musicTheory';
import { guitarAudio } from '../../utils/guitarAudio';

interface FretboardSVGProps {
  config: FretboardConfig;
  globalBpm?: number;
}

const INLAY_FRETS = new Set([3, 5, 7, 9, 15, 17]);
const CAGED_OPTIONS: CagedZone[] = ['full', 'E', 'E2', 'D', 'C', 'A', 'A2', 'G'];

export const FretboardSVG: React.FC<FretboardSVGProps> = ({ config, globalBpm = 90 }) => {
  const [selectedRoot, setSelectedRoot] = useState<NoteName>(config.root ?? 'G');
  const [selectedZone, setSelectedZone] = useState<CagedZone>(config.cagedZone ?? 'full');
  const [labelMode, setLabelMode] = useState<'intervals' | 'notes'>(
    config.defaultLabelMode ?? 'intervals'
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNoteKey, setActiveNoteKey] = useState<string | null>(null);

  const startFret = config.startFret ?? 0;
  const endFret = config.endFret ?? 15;
  const fretCount = endFret - startFret;

  const { computedNotes, windowRange } = useMemo(() => {
    if (config.notes && !config.root) {
      return { computedNotes: config.notes, windowRange: null };
    }
    const generated = generateFretboardNotes({
      root: selectedRoot,
      quality: config.quality ?? 'major',
      cagedZone: selectedZone,
      stringSet: config.stringSet,
      startFret,
      endFret,
      labelMode,
      secondaryRoot: config.secondaryRoot,
      secondaryQuality: config.secondaryQuality,
    });
    return {
      computedNotes: config.notes ? [...generated.notes, ...config.notes] : generated.notes,
      windowRange: generated.windowRange,
    };
  }, [config, selectedRoot, selectedZone, labelMode, startFret, endFret]);

  const handleNoteClick = (note: FretNote) => {
    const key = `${note.string}-${note.fret}`;
    setActiveNoteKey(key);
    guitarAudio.playNote(note.string, note.fret, 1.3);
    window.setTimeout(() => {
      setActiveNoteKey((prev) => (prev === key ? null : prev));
    }, 320);
  };

  const handlePlayArpeggio = () => {
    if (isPlaying) {
      guitarAudio.stopAllSequences();
      setIsPlaying(false);
      return;
    }
    const playable = computedNotes.filter((n) => n.role !== 'muted');
    if (playable.length === 0) return;

    // Limit to a single musical octave/zone sweep if full neck
    const subset =
      selectedZone === 'full' && playable.length > 10
        ? playable.filter((n) => n.fret >= startFret && n.fret <= startFret + 7)
        : playable;
    const toPlay = subset.length >= 3 ? subset : playable.slice(0, 8);

    setIsPlaying(true);
    guitarAudio.playArpeggio(toPlay, Math.max(70, globalBpm), () => setIsPlaying(false));
  };

  const handlePlayChord = () => {
    const playable = computedNotes.filter((n) => n.role !== 'muted' && n.role !== 'secondary');
    if (playable.length === 0) return;

    // Pick one highest-priority note per string within tight fret window
    const byString = new Map<number, FretNote>();
    const sorted = [...playable].sort((a, b) => a.fret - b.fret);
    const anchorFret = sorted[0]?.fret ?? 0;
    for (const n of sorted) {
      if (n.fret <= anchorFret + 4 && !byString.has(n.string)) {
        byString.set(n.string, n);
      }
    }
    const chordNotes = Array.from(byString.values()).sort(
      (a, b) => getMidiAt(a.string, a.fret) - getMidiAt(b.string, b.fret)
    );
    guitarAudio.playChord(
      chordNotes.map((n) => ({ string: n.string, fret: n.fret })),
      'down',
      0.032,
      1.9
    );
  };

  // SVG Layout metrics — designed for crisp readability from guitar-playing distance
  const leftPad = 56;
  const rightPad = 24;
  const topPad = 30;
  const bottomPad = 36;
  const stringSpacing = 28;
  const fretWidth = fretCount <= 8 ? 78 : fretCount <= 12 ? 62 : 54;
  const width = leftPad + fretCount * fretWidth + rightPad;
  const height = topPad + 5 * stringSpacing + bottomPad;

  const getFretLineX = (fretIndex: number) => leftPad + (fretIndex - startFret) * fretWidth;
  const getNoteX = (fret: number) => {
    if (fret === 0 && startFret === 0) return leftPad - 18;
    return leftPad + (fret - startFret - 0.5) * fretWidth;
  };
  const getStringY = (stringNum: number) => topPad + (stringNum - 1) * stringSpacing;

  const qualityLabel = config.quality ? QUALITY_SPECS[config.quality].label : '';

  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] overflow-hidden">
      {/* Header + Controls */}
      <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            {config.title}
          </h4>
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
            {config.subtitle ??
              (config.root
                ? `${selectedRoot} · ${qualityLabel} · ${getCagedZoneLabel(selectedZone)}`
                : 'Haz clic en cualquier nota para escucharla')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Intervals vs Note Names Segmented Toggle */}
          {config.root && (
            <div className="inline-flex rounded-lg bg-black/[0.06] dark:bg-white/[0.08] p-0.5 text-[12px] font-medium">
              <button
                type="button"
                onClick={() => setLabelMode('intervals')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  labelMode === 'intervals'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                Grados
              </button>
              <button
                type="button"
                onClick={() => setLabelMode('notes')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  labelMode === 'notes'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                Notas
              </button>
            </div>
          )}

          {/* Audio reference buttons */}
          <button
            type="button"
            onClick={handlePlayChord}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-black/[0.06] dark:bg-white/[0.08] hover:bg-black/[0.1] dark:hover:bg-white/[0.14] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors cursor-pointer"
            title="Escuchar acorde rasgueado"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#0a84ff]" />
            Acorde
          </button>

          <button
            type="button"
            onClick={handlePlayArpeggio}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-[#ff453a] text-white'
                : 'bg-[#0071e3] dark:bg-[#0a84ff] text-white hover:opacity-90'
            }`}
            title="Escuchar arpegio nota por nota"
          >
            {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            {isPlaying ? 'Detener' : 'Arpegio'}
          </button>
        </div>
      </div>

      {/* Optional Interactive Transposer & CAGED Position Strip */}
      {(config.allowTranspose || config.showCagedZones) && config.root && (
        <div className="px-5 py-2.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex flex-wrap items-center gap-4 text-[12px]">
          {config.allowTranspose && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#6e6e73] dark:text-[#86868b] font-medium mr-1">Tonalidad:</span>
              {SELECTABLE_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedRoot(k)}
                  className={`px-2 py-0.5 rounded-md font-mono font-medium transition-colors cursor-pointer ${
                    selectedRoot === k
                      ? 'bg-[#ff3b30] text-white'
                      : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/[0.06] dark:hover:bg-white/[0.08]'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          )}

          {config.showCagedZones && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[#6e6e73] dark:text-[#86868b] font-medium mr-1">Posición:</span>
              {CAGED_OPTIONS.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setSelectedZone(z)}
                  className={`px-2 py-0.5 rounded-md font-mono font-medium transition-colors cursor-pointer ${
                    selectedZone === z
                      ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white'
                      : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/[0.06] dark:hover:bg-white/[0.08]'
                  }`}
                >
                  {z === 'full' ? 'Todo' : z === 'E2' ? "E'" : z === 'A2' ? "A'" : z}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Horizontal Scrollable High-Contrast Fretboard SVG */}
      <div className="overflow-x-auto px-3 py-4 bg-white dark:bg-[#0d0d0f]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[660px] h-auto select-none"
          role="img"
          aria-label={`Diapasón de guitarra: ${config.title}`}
        >
          {/* Fretboard wood surface */}
          <rect
            x={leftPad}
            y={topPad - 8}
            width={fretCount * fretWidth}
            height={5 * stringSpacing + 16}
            rx={6}
            className="fill-[#fafafa] dark:fill-[#17171a] stroke-black/[0.08] dark:stroke-white/[0.1]"
            strokeWidth={1}
          />

          {/* Highlighted CAGED window band */}
          {windowRange && (
            <rect
              x={getFretLineX(Math.max(startFret, windowRange[0] === 0 ? 0 : windowRange[0] - 1))}
              y={topPad - 10}
              width={
                (Math.min(endFret, windowRange[1]) -
                  Math.max(startFret, windowRange[0] === 0 ? 0 : windowRange[0] - 1)) *
                fretWidth
              }
              height={5 * stringSpacing + 20}
              rx={6}
              className="fill-[#0a84ff]/[0.07] dark:fill-[#0a84ff]/[0.11] stroke-[#0a84ff]/35"
              strokeWidth={1.2}
              strokeDasharray="4 3"
            />
          )}

          {/* Fret inlay markers */}
          {Array.from({ length: fretCount }, (_, i) => startFret + i + 1).map((fretNum) => {
            const cx = getNoteX(fretNum);
            const midY = topPad + 2.5 * stringSpacing;
            if (fretNum === 12) {
              return (
                <g key={`inlay-${fretNum}`}>
                  <circle
                    cx={cx}
                    cy={topPad + 1.5 * stringSpacing}
                    r={4.5}
                    className="fill-black/[0.11] dark:fill-white/[0.14]"
                  />
                  <circle
                    cx={cx}
                    cy={topPad + 3.5 * stringSpacing}
                    r={4.5}
                    className="fill-black/[0.11] dark:fill-white/[0.14]"
                  />
                </g>
              );
            }
            if (INLAY_FRETS.has(fretNum)) {
              return (
                <circle
                  key={`inlay-${fretNum}`}
                  cx={cx}
                  cy={midY}
                  r={4.5}
                  className="fill-black/[0.11] dark:fill-white/[0.14]"
                />
              );
            }
            return null;
          })}

          {/* Fret vertical wires */}
          {Array.from({ length: fretCount + 1 }, (_, i) => startFret + i).map((fretNum) => {
            const x = getFretLineX(fretNum);
            const isNut = fretNum === 0;
            return (
              <line
                key={`fret-${fretNum}`}
                x1={x}
                y1={topPad - 8}
                x2={x}
                y2={topPad + 5 * stringSpacing + 8}
                className={
                  isNut
                    ? 'stroke-[#1d1d1f] dark:stroke-[#f5f5f7]'
                    : 'stroke-black/[0.16] dark:stroke-white/[0.18]'
                }
                strokeWidth={isNut ? 4.5 : 1.3}
              />
            );
          })}

          {/* Strings (1 = high E top, 6 = low E bottom — exact book convention) */}
          {[1, 2, 3, 4, 5, 6].map((strNum) => {
            const y = getStringY(strNum);
            const thickness = 0.9 + (strNum - 1) * 0.34;
            return (
              <g key={`str-${strNum}`}>
                <text
                  x={14}
                  y={y + 4.5}
                  className="fill-[#6e6e73] dark:fill-[#86868b] text-[12px] font-mono font-semibold"
                >
                  {STRING_NAMES[strNum - 1]}
                </text>
                <line
                  x1={leftPad}
                  y1={y}
                  x2={leftPad + fretCount * fretWidth}
                  y2={y}
                  className="stroke-black/[0.28] dark:stroke-white/[0.32]"
                  strokeWidth={thickness}
                />
              </g>
            );
          })}

          {/* Fret numbers along bottom */}
          {Array.from({ length: fretCount }, (_, i) => startFret + i + 1).map((fretNum) => {
            const cx = getNoteX(fretNum);
            const isMarker = INLAY_FRETS.has(fretNum) || fretNum === 12;
            return (
              <text
                key={`fnum-${fretNum}`}
                x={cx}
                y={height - 10}
                textAnchor="middle"
                className={`font-mono tabular-nums text-[12px] ${
                  isMarker
                    ? 'fill-[#1d1d1f] dark:fill-[#f5f5f7] font-bold'
                    : 'fill-[#86868b] dark:fill-[#6e6e73] font-medium'
                }`}
              >
                {fretNum}
              </text>
            );
          })}

          {/* Interactive Note Dots */}
          {computedNotes.map((note) => {
            if (note.fret < startFret || note.fret > endFret) return null;
            const cx = getNoteX(note.fret);
            const cy = getStringY(note.string);
            const key = `${note.string}-${note.fret}`;
            const isHit = activeNoteKey === key;

            const isRoot = note.role === 'root';
            const isExtension = note.role === 'extension';
            const isSecondary = note.role === 'secondary';
            const isApproach = note.role === 'approach';

            const circleClass = isRoot
              ? 'fill-[#ff3b30] dark:fill-[#ff453a] stroke-white dark:stroke-[#0d0d0f]'
              : isSecondary
                ? 'fill-[#30d158] dark:fill-[#30d158] stroke-white dark:stroke-[#0d0d0f]'
                : isExtension
                  ? 'fill-[#0071e3] dark:fill-[#0a84ff] stroke-white dark:stroke-[#0d0d0f]'
                  : isApproach
                    ? 'fill-[#ff9f0a] stroke-white dark:stroke-[#0d0d0f]'
                    : 'fill-[#1d1d1f] dark:fill-[#f5f5f7] stroke-white dark:stroke-[#0d0d0f]';

            const textClass =
              isRoot || isExtension || isSecondary || isApproach
                ? 'fill-white font-bold'
                : 'fill-white dark:fill-[#1d1d1f] font-bold';

            return (
              <g
                key={key}
                onClick={() => handleNoteClick(note)}
                className="cursor-pointer group"
              >
                {isHit && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={16}
                    className="fill-[#0a84ff]/30"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isRoot ? 12.2 : 11.2}
                  strokeWidth={1.8}
                  className={`${circleClass} transition-transform duration-150`}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  className={`${textClass} text-[11px] font-mono pointer-events-none`}
                >
                  {note.label ?? ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="px-5 py-2.5 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-[#6e6e73] dark:text-[#86868b]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b30] dark:bg-[#ff453a]" />
          Tónica (1)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7]" />
          Notas de tríada (3 / 5)
        </span>
        {computedNotes.some((n) => n.role === 'extension') && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff]" />
            Extensiones / Escala
          </span>
        )}
        {computedNotes.some((n) => n.role === 'secondary') && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#30d158]" />
            {config.secondaryLabel ?? '2ª Tríada'}
          </span>
        )}
        <span className="ml-auto hidden sm:inline">Haz clic en cualquier punto para escuchar la nota</span>
      </div>
    </div>
  );
};
