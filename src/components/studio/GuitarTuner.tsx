import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import {
  DetectedPitch,
  detectPitch,
  STANDARD_GUITAR_STRINGS,
} from '../../utils/pitchDetector';
import { guitarAudio } from '../../utils/guitarAudio';

export const GuitarTuner: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pitch, setPitch] = useState<DetectedPitch | null>(null);
  const [playingString, setPlayingString] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const smoothedCentsRef = useRef<number>(0);

  const stopMic = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsListening(false);
    setPitch(null);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  const startMic = async () => {
    setErrorMsg(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Tu navegador no admite acceso al micrófono. Usa las cuerdas de referencia abajo.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);

      audioCtxRef.current = ctx;
      streamRef.current = stream;
      setIsListening(true);

      const buffer = new Float32Array(analyser.fftSize);
      const update = () => {
        analyser.getFloatTimeDomainData(buffer);
        const result = detectPitch(buffer, ctx.sampleRate);
        if (result) {
          smoothedCentsRef.current = smoothedCentsRef.current * 0.65 + result.cents * 0.35;
          setPitch({
            ...result,
            cents: Math.round(smoothedCentsRef.current),
          });
        }
        rafRef.current = window.requestAnimationFrame(update);
      };
      update();
    } catch {
      setErrorMsg(
        'No se pudo acceder al micrófono. Permite el acceso en tu navegador o afina de oído pulsando cada cuerda.'
      );
      stopMic();
    }
  };

  const handlePlayReference = (stringNum: 1 | 2 | 3 | 4 | 5 | 6) => {
    setPlayingString(stringNum);
    guitarAudio.playNote(stringNum, 0, 2.8, 0, 0.85);
    window.setTimeout(() => {
      setPlayingString((prev) => (prev === stringNum ? null : prev));
    }, 1800);
  };

  const centsClamped = pitch ? Math.max(-50, Math.min(50, pitch.cents)) : 0;
  const isInTune = pitch !== null && Math.abs(pitch.cents) <= 5;
  const needleLeftPct = 50 + (centsClamped / 50) * 46;

  return (
    <div className="space-y-6">
      {/* Microphone Chromatic Meter */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Afinador cromático por micrófono
            </h3>
            <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6]">
              Afinación estándar A = 440 Hz · Toca una cuerda al aire y ajusta hasta que la aguja quede en verde.
            </p>
          </div>
          <button
            type="button"
            onClick={isListening ? stopMic : () => void startMic()}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
              isListening
                ? 'bg-[#ff453a] text-white'
                : 'bg-[#0071e3] dark:bg-[#0a84ff] text-white hover:opacity-90'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                Detener micrófono
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Activar micrófono
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-5 rounded-xl bg-[#ff9f0a]/12 border border-[#ff9f0a]/30 px-4 py-3 text-[13px] text-[#b25000] dark:text-[#ffd60a]">
            {errorMsg}
          </div>
        )}

        {/* Note Readout + Precision Cents Bar */}
        <div className="rounded-2xl bg-white dark:bg-[#0d0d0f] border border-black/[0.07] dark:border-white/[0.09] px-6 py-7 text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span
              className={`font-mono text-[56px] font-bold leading-none tabular-nums transition-colors ${
                isInTune
                  ? 'text-[#248a3d] dark:text-[#30d158]'
                  : pitch
                    ? 'text-[#1d1d1f] dark:text-[#f5f5f7]'
                    : 'text-[#c7c7cc] dark:text-[#3a3a3c]'
              }`}
            >
              {pitch ? pitch.noteName : '—'}
            </span>
            {pitch && (
              <span className="font-mono text-[22px] font-semibold text-[#86868b] tabular-nums">
                {pitch.octave}
              </span>
            )}
          </div>

          <div className="mt-2 h-5 text-[13px] font-mono text-[#6e6e73] dark:text-[#a1a1a6] tabular-nums">
            {pitch ? (
              <span>
                {pitch.frequency.toFixed(1)} Hz ·{' '}
                <strong
                  className={
                    isInTune
                      ? 'text-[#248a3d] dark:text-[#30d158]'
                      : 'text-[#1d1d1f] dark:text-[#f5f5f7]'
                  }
                >
                  {isInTune
                    ? 'Afinada'
                    : pitch.cents > 0
                      ? `+${pitch.cents} cents (alta — afloja)`
                      : `${pitch.cents} cents (baja — tensa)`}
                </strong>{' '}
                · Cuerda cercana: {pitch.closestString.label}
              </span>
            ) : isListening ? (
              'Escuchando... toca una cuerda al aire'
            ) : (
              'Pulsa «Activar micrófono» o utiliza los tonos de referencia abajo'
            )}
          </div>

          {/* Cents Track */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-[11px] font-mono text-[#86868b] mb-1.5">
              <span>♭ −50</span>
              <span className="text-[#248a3d] dark:text-[#30d158] font-bold">0</span>
              <span>+50 ♯</span>
            </div>
            <div className="relative h-3 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
              {/* Center Green Sweet Spot */}
              <div className="absolute left-[45%] right-[45%] top-0 bottom-0 bg-[#30d158]/25" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-[#30d158]" />
              {/* Moving Needle */}
              {pitch && (
                <div
                  className={`absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full transition-all duration-75 ${
                    isInTune ? 'bg-[#30d158]' : 'bg-[#0071e3] dark:bg-[#0a84ff]'
                  }`}
                  style={{ left: `${needleLeftPct}%` }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reference Open Strings (Tune by Ear) */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
        <div className="mb-3.5">
          <h4 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Afinar de oído — Referencia de cuerdas al aire (E–A–D–G–B–e)
          </h4>
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6]">
            Haz clic en cada cuerda para escuchar su tono exacto sostenido.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {STANDARD_GUITAR_STRINGS.map((str) => {
            const active = playingString === str.number;
            return (
              <button
                key={str.number}
                type="button"
                onClick={() => handlePlayReference(str.number)}
                className={`rounded-xl border p-3.5 text-center transition-all cursor-pointer ${
                  active
                    ? 'border-[#0a84ff] bg-[#0071e3] dark:bg-[#0a84ff] text-white'
                    : 'border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] hover:border-[#0a84ff]'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-mono text-[18px] font-bold">{str.name}</span>
                  <Volume2 className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#0a84ff]'}`} />
                </div>
                <div
                  className={`text-[11px] font-mono mt-1 ${
                    active ? 'text-white/85' : 'text-[#86868b]'
                  }`}
                >
                  {str.label} · {str.frequency.toFixed(0)} Hz
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
