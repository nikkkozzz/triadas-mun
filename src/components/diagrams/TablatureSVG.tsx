import React, { useEffect, useState } from 'react';
import { Play, Square } from 'lucide-react';
import { TabConfig } from '../../types/course';
import { guitarAudio } from '../../utils/guitarAudio';

interface TablatureSVGProps {
  config: TabConfig;
  globalBpm?: number;
}

const TAB_STRINGS = ['e', 'B', 'G', 'D', 'A', 'E'] as const;

export const TablatureSVG: React.FC<TablatureSVGProps> = ({ config, globalBpm = 88 }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [speedMode, setSpeedMode] = useState<'slow' | 'normal' | 'sync'>('normal');

  useEffect(() => {
    return () => {
      guitarAudio.stopAllSequences();
    };
  }, [config]);

  const baseBpm = config.bpm ?? 88;
  const effectiveBpm =
    speedMode === 'slow'
      ? Math.round(baseBpm * 0.7)
      : speedMode === 'sync'
        ? globalBpm
        : baseBpm;

  const isPlaying = activeStep !== null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      guitarAudio.stopAllSequences();
      setActiveStep(null);
      return;
    }
    guitarAudio.playTabSequence(config.steps, effectiveBpm, (idx) => {
      setActiveStep(idx);
    });
  };

  // Layout parameters — large, legible TAB typography for distance reading
  const leftPad = 48;
  const rightPad = 28;
  const topPad = 48;
  const bottomPad = 36;
  const stringSpacing = 22;
  const stepWidth = config.steps.length <= 10 ? 58 : config.steps.length <= 18 ? 46 : 40;
  const width = Math.max(620, leftPad + config.steps.length * stepWidth + rightPad);
  const height = topPad + 5 * stringSpacing + bottomPad;

  const getStepX = (idx: number) => leftPad + idx * stepWidth + stepWidth * 0.5;
  const getStringY = (stringNum: number) => topPad + (stringNum - 1) * stringSpacing;

  return (
    <div className="my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#0071e3] dark:text-[#0a84ff] font-semibold">
            {config.exampleNumber && <span>{config.exampleNumber}</span>}
            {config.exampleNumber && <span className="text-[#86868b]">·</span>}
            <span className="text-[#6e6e73] dark:text-[#a1a1a6] tabular-nums">
              {effectiveBpm} BPM · {config.timeSignature ?? '4/4'}
            </span>
          </div>
          <h4 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
            {config.title}
          </h4>
          {config.subtitle && (
            <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-black/[0.06] dark:bg-white/[0.08] p-0.5 text-[12px] font-medium">
            {(
              [
                ['slow', '70%'],
                ['normal', '100%'],
                ['sync', 'Metr.'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSpeedMode(mode)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  speedMode === mode
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-[#ff453a] text-white'
                : 'bg-[#0071e3] dark:bg-[#0a84ff] text-white hover:opacity-90'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                Detener
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                Escuchar TAB
              </>
            )}
          </button>
        </div>
      </div>

      {/* SVG TAB Canvas */}
      <div className="overflow-x-auto px-3 py-4 bg-white dark:bg-[#0d0d0f]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[620px] h-auto select-none"
          role="img"
          aria-label={`Tablatura: ${config.title}`}
        >
          {/* Active Playback Column Highlight */}
          {activeStep !== null && (
            <rect
              x={getStepX(activeStep) - stepWidth * 0.4}
              y={topPad - 26}
              width={stepWidth * 0.8}
              height={5 * stringSpacing + 46}
              rx={8}
              className="fill-[#0a84ff]/15 dark:fill-[#0a84ff]/20"
            />
          )}

          {/* Opening TAB clef lines */}
          <line
            x1={leftPad - 4}
            y1={topPad}
            x2={leftPad - 4}
            y2={topPad + 5 * stringSpacing}
            className="stroke-black/[0.35] dark:stroke-white/[0.4]"
            strokeWidth={2}
          />
          <line
            x1={width - rightPad}
            y1={topPad}
            x2={width - rightPad}
            y2={topPad + 5 * stringSpacing}
            className="stroke-black/[0.45] dark:stroke-white/[0.5]"
            strokeWidth={2.5}
          />

          {/* 6 Horizontal TAB Lines */}
          {TAB_STRINGS.map((strLabel, idx) => {
            const y = topPad + idx * stringSpacing;
            return (
              <g key={`tabstr-${idx}`}>
                <text
                  x={18}
                  y={y + 4.5}
                  className="fill-[#6e6e73] dark:fill-[#86868b] font-mono text-[13px] font-bold"
                >
                  {strLabel}
                </text>
                <line
                  x1={leftPad - 4}
                  y1={y}
                  x2={width - rightPad}
                  y2={y}
                  className="stroke-black/[0.18] dark:stroke-white/[0.22]"
                  strokeWidth={1.1}
                />
              </g>
            );
          })}

          {/* Steps */}
          {config.steps.map((step, sIdx) => {
            const x = getStepX(sIdx);
            const isCurrent = activeStep === sIdx;

            return (
              <g
                key={`step-${sIdx}`}
                onClick={() => {
                  if (step.notes.length > 1) {
                    guitarAudio.playChord(
                      step.notes.map((n) => ({ string: n.string, fret: n.fret })),
                      step.strum === 'up' ? 'up' : 'down',
                      0.025,
                      1.2
                    );
                  } else if (step.notes.length === 1) {
                    guitarAudio.playNote(step.notes[0].string, step.notes[0].fret, 1.0);
                  }
                }}
                className="cursor-pointer"
              >
                {/* Chord name above TAB */}
                {step.chord && (
                  <text
                    x={x}
                    y={20}
                    textAnchor="middle"
                    className="fill-[#0071e3] dark:fill-[#0a84ff] font-mono text-[13px] font-bold"
                  >
                    {step.chord}
                  </text>
                )}

                {/* Strum / Picking direction arrow */}
                {step.strum && (
                  <text
                    x={x}
                    y={36}
                    textAnchor="middle"
                    className="fill-[#6e6e73] dark:fill-[#a1a1a6] font-mono text-[13px] font-bold"
                  >
                    {step.strum === 'down' ? '↓' : '↑'}
                  </text>
                )}

                {/* Fret numbers on strings */}
                {step.notes.map((n, nIdx) => {
                  const y = getStringY(n.string);
                  const fretStr = `${n.fret}${n.technique ?? ''}`;
                  const pillW = fretStr.length >= 2 ? 24 : 18;
                  const fillClass =
                    n.highlight === 'root'
                      ? 'fill-[#ff3b30] dark:fill-[#ff453a]'
                      : n.highlight === 'approach'
                        ? 'fill-[#ff9f0a]'
                        : isCurrent
                          ? 'fill-[#0071e3] dark:fill-[#0a84ff]'
                          : 'fill-[#1d1d1f] dark:fill-[#f5f5f7]';

                  return (
                    <g key={`n-${sIdx}-${nIdx}`}>
                      <rect
                        x={x - pillW / 2}
                        y={y - 9}
                        width={pillW}
                        height={18}
                        rx={4}
                        className="fill-white dark:fill-[#0d0d0f]"
                      />
                      <text
                        x={x}
                        y={y + 5.5}
                        textAnchor="middle"
                        className={`${fillClass} font-mono text-[15px] font-bold tabular-nums`}
                      >
                        {fretStr}
                      </text>
                    </g>
                  );
                })}

                {/* Bottom annotation (e.g. position or beat) */}
                {step.annotation && (
                  <text
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    className="fill-[#6e6e73] dark:fill-[#86868b] font-mono text-[11px] font-medium"
                  >
                    {step.annotation}
                  </text>
                )}

                {/* Measure barline */}
                {step.barAfter && sIdx < config.steps.length - 1 && (
                  <line
                    x1={x + stepWidth * 0.5}
                    y1={topPad}
                    x2={x + stepWidth * 0.5}
                    y2={topPad + 5 * stringSpacing}
                    className="stroke-black/[0.28] dark:stroke-white/[0.32]"
                    strokeWidth={1.5}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
