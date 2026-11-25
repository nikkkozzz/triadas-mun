import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { ChordBoxVoicing } from '../../types/course';
import { guitarAudio } from '../../utils/guitarAudio';

interface ChordBoxSVGProps {
  voicing: ChordBoxVoicing;
}

export const ChordBoxSVG: React.FC<ChordBoxSVGProps> = ({ voicing }) => {
  const [strumming, setStrumming] = useState(false);

  const playedFrets = voicing.frets.filter((f) => f > 0);
  const minPlayed = playedFrets.length > 0 ? Math.min(...playedFrets) : 1;
  const maxPlayed = playedFrets.length > 0 ? Math.max(...playedFrets) : 4;
  const baseFret =
    voicing.baseFret ?? (maxPlayed <= 4 ? 1 : Math.max(1, minPlayed));
  const numFrets = Math.max(4, maxPlayed - baseFret + 1);

  const width = 158;
  const height = 166;
  const left = 30;
  const top = 30;
  const stringGap = 20;
  const fretGap = 26;
  const gridWidth = 5 * stringGap;

  const handlePlay = () => {
    setStrumming(true);
    const notes: { string: 1 | 2 | 3 | 4 | 5 | 6; fret: number }[] = [];
    // voicing.frets index 0 = string 6 (low E), index 5 = string 1 (high E)
    voicing.frets.forEach((f, idx) => {
      if (f >= 0) {
        const stringNum = (6 - idx) as 1 | 2 | 3 | 4 | 5 | 6;
        notes.push({ string: stringNum, fret: f });
      }
    });
    guitarAudio.playChord(notes, 'down', 0.036, 1.8);
    window.setTimeout(() => setStrumming(false), 450);
  };

  return (
    <div
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePlay();
        }
      }}
      className={`group rounded-2xl border transition-all p-3.5 flex flex-col items-center cursor-pointer select-none ${
        strumming
          ? 'border-[#0a84ff] bg-[#0a84ff]/[0.06] dark:bg-[#0a84ff]/[0.12]'
          : 'border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161617] hover:border-black/[0.2] dark:hover:border-white/[0.25]'
      }`}
    >
      <div className="w-full flex items-center justify-between mb-1">
        <span className="text-[15px] font-bold font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
          {voicing.name}
        </span>
        <Volume2
          className={`w-3.5 h-3.5 transition-colors ${
            strumming
              ? 'text-[#0a84ff]'
              : 'text-[#86868b] group-hover:text-[#0a84ff]'
          }`}
        />
      </div>
      {voicing.subtitle && (
        <span className="w-full text-[11px] text-[#6e6e73] dark:text-[#a1a1a6] mb-1.5 truncate">
          {voicing.subtitle}
        </span>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-[144px] h-auto"
        aria-label={`Diagrama de acorde ${voicing.name}`}
      >
        {/* Base fret indicator */}
        {baseFret > 1 && (
          <text
            x={left - 10}
            y={top + fretGap * 0.65}
            textAnchor="end"
            className="fill-[#1d1d1f] dark:fill-[#f5f5f7] font-mono text-[12px] font-bold tabular-nums"
          >
            {baseFret}
          </text>
        )}

        {/* Nut or top fret */}
        <line
          x1={left}
          y1={top}
          x2={left + gridWidth}
          y2={top}
          className="stroke-[#1d1d1f] dark:stroke-[#f5f5f7]"
          strokeWidth={baseFret === 1 ? 4.5 : 1.5}
        />

        {/* Horizontal frets */}
        {Array.from({ length: numFrets }, (_, i) => i + 1).map((f) => (
          <line
            key={`hf-${f}`}
            x1={left}
            y1={top + f * fretGap}
            x2={left + gridWidth}
            y2={top + f * fretGap}
            className="stroke-black/[0.18] dark:stroke-white/[0.2]"
            strokeWidth={1.2}
          />
        ))}

        {/* Vertical strings (index 0 = 6th low E left, index 5 = 1st high E right) */}
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <line
            key={`vs-${idx}`}
            x1={left + idx * stringGap}
            y1={top}
            x2={left + idx * stringGap}
            y2={top + numFrets * fretGap}
            className="stroke-black/[0.28] dark:stroke-white/[0.32]"
            strokeWidth={1.8 - idx * 0.16}
          />
        ))}

        {/* Optional barre bar */}
        {voicing.barre && (
          <rect
            x={left + (6 - voicing.barre.fromString) * stringGap - 7}
            y={top + (voicing.barre.fret - baseFret + 0.5) * fretGap - 7}
            width={(voicing.barre.fromString - voicing.barre.toString) * stringGap + 14}
            height={14}
            rx={7}
            className="fill-[#1d1d1f] dark:fill-[#f5f5f7]"
          />
        )}

        {/* Open / Muted indicators & finger dots */}
        {voicing.frets.map((fret, idx) => {
          const x = left + idx * stringGap;
          const isRoot = voicing.rootStrings?.includes(idx);
          const label = voicing.labels?.[idx];

          if (fret === -1) {
            return (
              <text
                key={`m-${idx}`}
                x={x}
                y={top - 10}
                textAnchor="middle"
                className="fill-[#86868b] font-mono text-[12px] font-bold"
              >
                ×
              </text>
            );
          }

          if (fret === 0) {
            return (
              <circle
                key={`o-${idx}`}
                cx={x}
                cy={top - 14}
                r={5.5}
                fill="none"
                strokeWidth={1.8}
                className={
                  isRoot
                    ? 'stroke-[#ff3b30] dark:stroke-[#ff453a]'
                    : 'stroke-[#1d1d1f] dark:stroke-[#f5f5f7]'
                }
              />
            );
          }

          const relFret = fret - baseFret + 1;
          if (relFret < 1 || relFret > numFrets) return null;
          const cy = top + (relFret - 0.5) * fretGap;

          return (
            <g key={`d-${idx}`}>
              <circle
                cx={x}
                cy={cy}
                r={8.8}
                className={
                  isRoot
                    ? 'fill-[#ff3b30] dark:fill-[#ff453a]'
                    : 'fill-[#1d1d1f] dark:fill-[#f5f5f7]'
                }
              />
              {label && (
                <text
                  x={x}
                  y={cy + 3.5}
                  textAnchor="middle"
                  className={`font-mono text-[9.5px] font-bold ${
                    isRoot ? 'fill-white' : 'fill-white dark:fill-[#1d1d1f]'
                  }`}
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

interface ChordGridProps {
  title: string;
  subtitle?: string;
  voicings: ChordBoxVoicing[];
}

export const ChordGrid: React.FC<ChordGridProps> = ({ title, subtitle, voicings }) => {
  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
      <div className="mb-4">
        <h4 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{title}</h4>
        {subtitle && (
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {voicings.map((v, idx) => (
          <ChordBoxSVG key={`${v.name}-${idx}`} voicing={v} />
        ))}
      </div>
    </div>
  );
};
