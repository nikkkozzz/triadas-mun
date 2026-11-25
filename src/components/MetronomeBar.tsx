import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Minus, Plus, X } from 'lucide-react';
import { guitarAudio } from '../utils/guitarAudio';

interface MetronomeBarProps {
  isOpen: boolean;
  onClose: () => void;
  bpm: number;
  setBpm: (bpm: number) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
}

export const MetronomeBar: React.FC<MetronomeBarProps> = ({
  isOpen,
  onClose,
  bpm,
  setBpm,
  isRunning,
  onToggleRunning,
}) => {
  const [beatsPerBar, setBeatsPerBar] = useState<4 | 3>(4);
  const [contratiempo, setContratiempo] = useState(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [isOffbeatPulse, setIsOffbeatPulse] = useState(false);

  const tapTimesRef = useRef<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const stepCountRef = useRef(0);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCurrentBeat(0);
      setIsOffbeatPulse(false);
      return;
    }

    stepCountRef.current = 0;
    const subStepsPerBeat = contratiempo ? 2 : 1;
    const intervalMs = (60 / bpm / subStepsPerBeat) * 1000;

    const tick = () => {
      const step = stepCountRef.current;
      const beatIndex = Math.floor(step / subStepsPerBeat) % beatsPerBar;
      const isSub = contratiempo && step % 2 === 1;

      if (isSub) {
        setIsOffbeatPulse(true);
        guitarAudio.playMetronomeClick('offbeat');
      } else {
        setIsOffbeatPulse(false);
        setCurrentBeat(beatIndex + 1);
        guitarAudio.playMetronomeClick(beatIndex === 0 ? 'accent' : 'beat');
      }

      stepCountRef.current += 1;
    };

    tick();
    timerRef.current = window.setInterval(tick, intervalMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, bpm, beatsPerBar, contratiempo]);

  const handleTapTempo = () => {
    const now = performance.now();
    const recent = tapTimesRef.current.filter((t) => now - t < 2400);
    recent.push(now);
    tapTimesRef.current = recent.slice(-5);

    if (recent.length >= 2) {
      const diffs = [];
      for (let i = 1; i < recent.length; i++) {
        diffs.push(recent[i] - recent[i - 1]);
      }
      const avgMs = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const calcBpm = Math.round(60000 / avgMs);
      setBpm(Math.min(220, Math.max(40, calcBpm)));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="border-b border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7]/95 dark:bg-[#161617]/95 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Play + Beat Visual Indicator */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleRunning}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
              isRunning
                ? 'bg-[#ff453a] text-white'
                : 'bg-[#0071e3] dark:bg-[#0a84ff] text-white hover:opacity-90'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                Detener
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Metrónomo
              </>
            )}
          </button>

          {/* Visual Beat LEDs */}
          <div className="flex items-center gap-1.5" aria-label="Indicador de pulsos">
            {Array.from({ length: beatsPerBar }, (_, i) => i + 1).map((b) => {
              const active = isRunning && currentBeat === b && !isOffbeatPulse;
              return (
                <div
                  key={b}
                  className={`w-7 h-7 rounded-lg font-mono text-[12px] font-bold flex items-center justify-center transition-all tabular-nums ${
                    active
                      ? b === 1
                        ? 'bg-[#ff3b30] text-white scale-105'
                        : 'bg-[#0071e3] dark:bg-[#0a84ff] text-white scale-105'
                      : 'bg-black/[0.06] dark:bg-white/[0.08] text-[#6e6e73] dark:text-[#86868b]'
                  }`}
                >
                  {b}
                </div>
              );
            })}
            {contratiempo && (
              <div
                className={`px-2 h-7 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center transition-all ${
                  isRunning && isOffbeatPulse
                    ? 'bg-[#30d158] text-white'
                    : 'bg-black/[0.05] dark:bg-white/[0.06] text-[#86868b]'
                }`}
              >
                y
              </div>
            )}
          </div>
        </div>

        {/* BPM Slider + Fine Adjustment */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[220px] max-w-[340px]">
          <button
            type="button"
            onClick={() => setBpm(Math.max(40, bpm - 5))}
            className="p-1.5 rounded-lg bg-black/[0.06] dark:bg-white/[0.08] hover:bg-black/[0.12] dark:hover:bg-white/[0.14] text-[#1d1d1f] dark:text-[#f5f5f7] cursor-pointer"
            aria-label="Reducir 5 BPM"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6e6e73] dark:text-[#a1a1a6] mb-0.5">
              <span>Tempo</span>
              <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">
                {bpm} BPM
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={220}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              aria-label="Control de tempo BPM"
              className="w-full accent-[#0a84ff] cursor-pointer h-1.5"
            />
          </div>

          <button
            type="button"
            onClick={() => setBpm(Math.min(220, bpm + 5))}
            className="p-1.5 rounded-lg bg-black/[0.06] dark:bg-white/[0.08] hover:bg-black/[0.12] dark:hover:bg-white/[0.14] text-[#1d1d1f] dark:text-[#f5f5f7] cursor-pointer"
            aria-label="Aumentar 5 BPM"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Meter, Contratiempo, Tap Tempo & Close */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-black/[0.06] dark:bg-white/[0.08] p-0.5 text-[12px] font-mono">
            {([4, 3] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setBeatsPerBar(m)}
                className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                  beatsPerBar === m
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6]'
                }`}
              >
                {m}/4
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setContratiempo((c) => !c)}
            className={`px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
              contratiempo
                ? 'bg-[#30d158]/20 text-[#248a3d] dark:text-[#30d158] border border-[#30d158]/40'
                : 'bg-black/[0.06] dark:bg-white/[0.08] text-[#6e6e73] dark:text-[#a1a1a6]'
            }`}
            title="Activa la subdivisión de corcheas para practicar a contratiempo"
          >
            Contratiempo
          </button>

          <button
            type="button"
            onClick={handleTapTempo}
            className="px-2.5 py-1.5 rounded-lg text-[12px] font-medium bg-black/[0.06] dark:bg-white/[0.08] hover:bg-black/[0.12] dark:hover:bg-white/[0.15] text-[#1d1d1f] dark:text-[#f5f5f7] cursor-pointer"
          >
            Tap
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
            aria-label="Cerrar metrónomo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
