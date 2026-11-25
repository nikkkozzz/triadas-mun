import React, { useMemo, useState } from 'react';
import { Volume2, RefreshCw, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { NoteName, TriadQuality } from '../../types/course';
import { noteToSemitone, SELECTABLE_KEYS } from '../../utils/musicTheory';
import { guitarAudio } from '../../utils/guitarAudio';
import { FretboardSVG } from '../diagrams/FretboardSVG';

type DrillMode = 'quality' | 'inversion';

interface Question {
  root: NoteName;
  quality: 'major' | 'minor' | 'diminished' | 'augmented';
  inversion: 0 | 1 | 2; // 0 = fundamental, 1 = 1st inv (3 in bass), 2 = 2nd inv (5 in bass)
}

const QUALITY_OPTIONS: { id: Question['quality']; label: string; formula: string }[] = [
  { id: 'major', label: 'Mayor', formula: '1 – 3 – 5' },
  { id: 'minor', label: 'Menor', formula: '1 – ♭3 – 5' },
  { id: 'diminished', label: 'Disminuida', formula: '1 – ♭3 – ♭5' },
  { id: 'augmented', label: 'Aumentada', formula: '1 – 3 – ♯5' },
];

const INVERSION_OPTIONS: { id: 0 | 1 | 2; label: string; desc: string }[] = [
  { id: 0, label: 'Estado fundamental', desc: 'Tónica (1) en el bajo' },
  { id: 1, label: '1ª Inversión', desc: 'Tercera (3) en el bajo' },
  { id: 2, label: '2ª Inversión', desc: 'Quinta (5) en el bajo' },
];

function createQuestion(mode: DrillMode): Question {
  const root = SELECTABLE_KEYS[Math.floor(Math.random() * SELECTABLE_KEYS.length)];
  if (mode === 'quality') {
    const qualities: Question['quality'][] = ['major', 'minor', 'diminished', 'augmented'];
    return {
      root,
      quality: qualities[Math.floor(Math.random() * qualities.length)],
      inversion: 0,
    };
  }
  const qualities: Question['quality'][] = ['major', 'minor'];
  const inversions: (0 | 1 | 2)[] = [0, 1, 2];
  return {
    root,
    quality: qualities[Math.floor(Math.random() * qualities.length)],
    inversion: inversions[Math.floor(Math.random() * inversions.length)],
  };
}

function getTriadMidis(q: Question): number[] {
  const base = 52 + ((noteToSemitone(q.root) - 4 + 12) % 12); // E3..D#4 range
  const thirdOffset = q.quality === 'minor' || q.quality === 'diminished' ? 3 : 4;
  const fifthOffset =
    q.quality === 'diminished' ? 6 : q.quality === 'augmented' ? 8 : 7;

  const rootM = base;
  const thirdM = base + thirdOffset;
  const fifthM = base + fifthOffset;

  if (q.inversion === 0) return [rootM, thirdM, fifthM];
  if (q.inversion === 1) return [thirdM, fifthM, rootM + 12];
  return [fifthM - 12, rootM, thirdM];
}

export const EarTrainer: React.FC = () => {
  const [mode, setMode] = useState<DrillMode>('quality');
  const [question, setQuestion] = useState<Question>(() => createQuestion('quality'));
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const [showFretboard, setShowFretboard] = useState(false);

  const midis = useMemo(() => getTriadMidis(question), [question]);

  const playQuestion = (style: 'chord' | 'arpeggio') => {
    if (style === 'chord') {
      midis.forEach((m, idx) => guitarAudio.playMidi(m, 1.8, idx * 0.04, 0.72));
    } else {
      midis.forEach((m, idx) => guitarAudio.playMidi(m, 1.1, idx * 0.34, 0.78));
    }
  };

  const handleModeChange = (nextMode: DrillMode) => {
    setMode(nextMode);
    const nextQ = createQuestion(nextMode);
    setQuestion(nextQ);
    setSelectedAnswer(null);
    setShowFretboard(false);
  };

  const handleNext = () => {
    const nextQ = createQuestion(mode);
    setQuestion(nextQ);
    setSelectedAnswer(null);
    setShowFretboard(false);
    const nextMidis = getTriadMidis(nextQ);
    nextMidis.forEach((m, idx) => guitarAudio.playMidi(m, 1.7, idx * 0.045, 0.72));
  };

  const isAnswered = selectedAnswer !== null;
  const isCorrect =
    isAnswered &&
    (mode === 'quality'
      ? selectedAnswer === question.quality
      : selectedAnswer === question.inversion);

  const handleGuess = (val: string | number) => {
    if (isAnswered) return;
    setSelectedAnswer(val);
    const ok =
      mode === 'quality' ? val === question.quality : val === question.inversion;
    setScore((s) => ({
      correct: s.correct + (ok ? 1 : 0),
      total: s.total + 1,
      streak: ok ? s.streak + 1 : 0,
    }));
  };

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Mode + Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-black/[0.06] dark:bg-white/[0.08] p-1">
          <button
            type="button"
            onClick={() => handleModeChange('quality')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
              mode === 'quality'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs'
                : 'text-[#6e6e73] dark:text-[#a1a1a6]'
            }`}
          >
            4 Cualidades (M / m / º / +)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('inversion')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
              mode === 'inversion'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs'
                : 'text-[#6e6e73] dark:text-[#a1a1a6]'
            }`}
          >
            Inversiones (Fund. / 1ª / 2ª)
          </button>
        </div>

        <div className="flex items-center gap-4 text-[13px] font-mono tabular-nums text-[#6e6e73] dark:text-[#a1a1a6]">
          <span>
            Aciertos: <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">{score.correct}/{score.total}</strong> ({accuracy}%)
          </span>
          <span>
            Racha: <strong className="text-[#30d158]">{score.streak}</strong>
          </span>
        </div>
      </div>

      {/* Audio Trigger Stage */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              {mode === 'quality'
                ? '¿Qué tipo de tríada estás escuchando?'
                : `¿En qué inversión suena esta tríada ${question.quality === 'minor' ? 'menor' : 'mayor'}?`}
            </h3>
            <p className="text-[13px] text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
              Escúchala en bloque (acorde) o nota por nota (arpegio) antes de responder.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => playQuestion('chord')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0071e3] dark:bg-[#0a84ff] text-white text-[13px] font-semibold hover:opacity-90 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              Escuchar acorde
            </button>
            <button
              type="button"
              onClick={() => playQuestion('arpeggio')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-[#242426] border border-black/[0.08] dark:border-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] text-[13px] font-semibold hover:border-[#0a84ff] cursor-pointer"
            >
              Arpegio
            </button>
          </div>
        </div>

        {/* Choice Grid */}
        {mode === 'quality' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUALITY_OPTIONS.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              const isRightOpt = question.quality === opt.id;
              const style = !isAnswered
                ? 'border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1c1c1e] hover:border-[#0a84ff]'
                : isRightOpt
                  ? 'border-[#30d158] bg-[#30d158]/15'
                  : isSelected
                    ? 'border-[#ff453a] bg-[#ff453a]/15'
                    : 'border-black/[0.06] dark:border-white/[0.06] bg-white/50 dark:bg-[#1c1c1e]/50 opacity-60';

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleGuess(opt.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer'
                  } ${style}`}
                >
                  <div className="text-[15px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {opt.label}
                  </div>
                  <div className="font-mono text-[12px] text-[#6e6e73] dark:text-[#a1a1a6] mt-1">
                    {opt.formula}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INVERSION_OPTIONS.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              const isRightOpt = question.inversion === opt.id;
              const style = !isAnswered
                ? 'border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1c1c1e] hover:border-[#0a84ff]'
                : isRightOpt
                  ? 'border-[#30d158] bg-[#30d158]/15'
                  : isSelected
                    ? 'border-[#ff453a] bg-[#ff453a]/15'
                    : 'border-black/[0.06] dark:border-white/[0.06] bg-white/50 dark:bg-[#1c1c1e]/50 opacity-60';

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleGuess(opt.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer'
                  } ${style}`}
                >
                  <div className="text-[15px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {opt.label}
                  </div>
                  <div className="text-[12px] text-[#6e6e73] dark:text-[#a1a1a6] mt-1">
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Result Banner + Next */}
        {isAnswered && (
          <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[14px] font-medium">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#248a3d] dark:text-[#30d158]" />
                  <span className="text-[#248a3d] dark:text-[#30d158]">
                    ¡Exacto! Era <strong>{question.root}</strong>{' '}
                    {QUALITY_OPTIONS.find((q) => q.id === question.quality)?.label}
                    {mode === 'inversion'
                      ? ` (${INVERSION_OPTIONS[question.inversion].label})`
                      : ''}
                    .
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-[#d70015] dark:text-[#ff453a]" />
                  <span className="text-[#d70015] dark:text-[#ff453a]">
                    Era <strong>{question.root}</strong>{' '}
                    {QUALITY_OPTIONS.find((q) => q.id === question.quality)?.label}
                    {mode === 'inversion'
                      ? ` (${INVERSION_OPTIONS[question.inversion].label})`
                      : ''}
                    . Escúchala arpegiada para memorizar su color.
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFretboard((s) => !s)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium bg-white dark:bg-[#242426] border border-black/[0.08] dark:border-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                {showFretboard ? 'Ocultar mástil' : 'Ver en mástil'}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071e3] dark:bg-[#0a84ff] text-white text-[13px] font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Siguiente reto
              </button>
            </div>
          </div>
        )}
      </div>

      {showFretboard && isAnswered && (
        <FretboardSVG
          config={{
            title: `Respuesta en el mástil: ${question.root} ${QUALITY_OPTIONS.find((q) => q.id === question.quality)?.label}`,
            root: question.root,
            quality: question.quality as TriadQuality,
            cagedZone: 'full',
            startFret: 0,
            endFret: 12,
          }}
        />
      )}
    </div>
  );
};
