import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { CourseModule, Lesson, LessonBlock } from '../types/course';
import { FretboardSVG } from './diagrams/FretboardSVG';
import { ChordGrid } from './diagrams/ChordBoxSVG';
import { TablatureSVG } from './diagrams/TablatureSVG';
import { DataTableBlock, IntervalStrip } from './diagrams/IntervalTableSVG';
import {
  CagedSevenPositionExplorer,
  FretboardNoteTrainer,
  InteractiveGlossary,
  ModalTriadPairLab,
  UpperStructureExplorer,
} from './interactive/InteractiveLabs';

interface LessonRendererProps {
  module: CourseModule;
  lesson: Lesson;
  lessonIndex: number;
  totalLessons: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onPrev: () => void;
  onNext: () => void;
  onNavigateLesson: (lessonId: string) => void;
  hasPrev: boolean;
  hasNext: boolean;
  globalBpm: number;
  isStandMode?: boolean;
}

export const LessonRenderer: React.FC<LessonRendererProps> = ({
  module,
  lesson,
  lessonIndex,
  totalLessons,
  isCompleted,
  onToggleComplete,
  onPrev,
  onNext,
  onNavigateLesson,
  hasPrev,
  hasNext,
  globalBpm,
  isStandMode = false,
}) => {
  const renderBlock = (block: LessonBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <div key={index} className="mt-10 mb-4">
            <h2 className="text-[22px] sm:text-[25px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              {block.text}
            </h2>
            {block.subtitle && (
              <p className="text-[15px] text-[#6e6e73] dark:text-[#a1a1a6] mt-1">
                {block.subtitle}
              </p>
            )}
          </div>
        );

      case 'paragraph':
        return (
          <p
            key={index}
            className="text-[16px] sm:text-[17px] leading-[1.7] text-[#3a3a3c] dark:text-[#d1d1d6] my-4"
          >
            {block.text}
          </p>
        );

      case 'list': {
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <div
            key={index}
            className="my-6 rounded-2xl border border-black/[0.07] dark:border-white/[0.09] bg-[#f5f5f7]/70 dark:bg-[#161617] p-5"
          >
            {block.title && (
              <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                {block.title}
              </h3>
            )}
            <ListTag
              className={`space-y-2.5 text-[15px] sm:text-[16px] leading-relaxed text-[#3a3a3c] dark:text-[#d1d1d6] ${
                block.ordered ? 'list-decimal pl-5' : 'list-disc pl-5'
              }`}
            >
              {block.items.map((item, i) => (
                <li key={i} className="pl-1">
                  {item}
                </li>
              ))}
            </ListTag>
          </div>
        );
      }

      case 'callout': {
        const styles = {
          memorize: {
            bg: 'bg-[#0071e3]/[0.06] dark:bg-[#0a84ff]/[0.1] border-[#0071e3]/20 dark:border-[#0a84ff]/25',
            iconColor: 'text-[#0071e3] dark:text-[#0a84ff]',
            Icon: Sparkles,
          },
          remember: {
            bg: 'bg-[#f5f5f7] dark:bg-[#161617] border-black/[0.08] dark:border-white/[0.1]',
            iconColor: 'text-[#1d1d1f] dark:text-[#f5f5f7]',
            Icon: BookOpen,
          },
          rule: {
            bg: 'bg-[#ff9f0a]/[0.07] dark:bg-[#ff9f0a]/[0.09] border-[#ff9f0a]/25',
            iconColor: 'text-[#b25000] dark:text-[#ff9f0a]',
            Icon: Lightbulb,
          },
          summary: {
            bg: 'bg-[#30d158]/[0.07] dark:bg-[#30d158]/[0.1] border-[#30d158]/25',
            iconColor: 'text-[#248a3d] dark:text-[#30d158]',
            Icon: BookmarkCheck,
          },
        }[block.variant];

        const Icon = styles.Icon;

        return (
          <div key={index} className={`my-6 rounded-2xl border p-5 ${styles.bg}`}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <Icon className={`w-4.5 h-4.5 shrink-0 ${styles.iconColor}`} />
              <h4 className="text-[15px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                {block.title}
              </h4>
            </div>
            {block.text && (
              <p className="text-[15px] leading-relaxed text-[#3a3a3c] dark:text-[#d1d1d6]">
                {block.text}
              </p>
            )}
            {block.items && (
              <ul className="space-y-2 mt-2.5 text-[15px] leading-relaxed text-[#3a3a3c] dark:text-[#d1d1d6] list-disc pl-5">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      }

      case 'fretboard':
        return <FretboardSVG key={index} config={block.config} globalBpm={globalBpm} />;

      case 'chord-grid':
        return (
          <ChordGrid
            key={index}
            title={block.title}
            subtitle={block.subtitle}
            voicings={block.voicings}
          />
        );

      case 'tab':
        return <TablatureSVG key={index} config={block.config} globalBpm={globalBpm} />;

      case 'interval-strip':
        return (
          <IntervalStrip
            key={index}
            title={block.title}
            subtitle={block.subtitle}
            items={block.items}
          />
        );

      case 'table':
        return <DataTableBlock key={index} data={block.data} />;

      case 'lab': {
        if (block.labType === 'note-trainer') return <FretboardNoteTrainer key={index} />;
        if (block.labType === 'caged-7-explorer')
          return <CagedSevenPositionExplorer key={index} globalBpm={globalBpm} />;
        if (block.labType === 'modal-pairs')
          return <ModalTriadPairLab key={index} globalBpm={globalBpm} />;
        if (block.labType === 'upper-structures') return <UpperStructureExplorer key={index} />;
        return <InteractiveGlossary key={index} onNavigateLesson={onNavigateLesson} />;
      }

      default:
        return null;
    }
  };

  return (
    <article
      className={`mx-auto px-5 sm:px-8 lg:px-10 py-8 sm:py-12 transition-all duration-200 ${
        isStandMode ? 'max-w-[1160px] text-[18px]' : 'max-w-[900px]'
      }`}
    >
      {/* Unboxed Apple Editorial Metadata Row (Zero-Pill Discipline) */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] font-medium text-[#6e6e73] dark:text-[#86868b] mb-3">
        <span className="text-[#0071e3] dark:text-[#0a84ff] font-semibold">
          {module.number} · {module.title}
        </span>
        <span>/</span>
        <span className="font-mono tabular-nums">
          Lección {lesson.code} ({lessonIndex + 1} de {totalLessons})
        </span>
        <span>·</span>
        <span className="font-mono">{lesson.pages}</span>
        {lesson.examples && (
          <>
            <span>·</span>
            <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">{lesson.examples}</span>
          </>
        )}
      </div>

      {/* Hero Lesson Header */}
      <header className="pb-7 border-b border-black/[0.08] dark:border-white/[0.1]">
        <h1 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold tracking-tight leading-[1.12] text-[#1d1d1f] dark:text-[#f5f5f7]">
          {lesson.title}
        </h1>
        <p className="text-[17px] sm:text-[19px] leading-relaxed text-[#6e6e73] dark:text-[#a1a1a6] mt-3 max-w-3xl">
          {lesson.subtitle}
        </p>
      </header>

      {/* Main Didactic & Interactive Lesson Blocks */}
      <div className="mt-6">{lesson.blocks.map((block, i) => renderBlock(block, i))}</div>

      {/* Dedicated Practice Tips & Common Mistakes Section */}
      <section className="mt-12 pt-8 border-t border-black/[0.08] dark:border-white/[0.1] grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4.5 h-4.5 text-[#0071e3] dark:text-[#0a84ff]" />
            <h3 className="text-[15px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Consejos de práctica
            </h3>
          </div>
          <ul className="space-y-2.5 text-[14.5px] leading-relaxed text-[#3a3a3c] dark:text-[#d1d1d6] list-disc pl-4">
            {lesson.practiceTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-[#f5f5f7] dark:bg-[#161617] p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4.5 h-4.5 text-[#ff9f0a]" />
            <h3 className="text-[15px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Errores comunes a evitar
            </h3>
          </div>
          <ul className="space-y-2.5 text-[14.5px] leading-relaxed text-[#3a3a3c] dark:text-[#d1d1d6] list-disc pl-4">
            {lesson.commonMistakes.map((mistake, i) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bottom Completion & Sequential Lesson Navigation */}
      <footer className="mt-10 pt-7 border-t border-black/[0.08] dark:border-white/[0.1] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold border transition-colors ${
            hasPrev
              ? 'border-black/[0.1] dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer'
              : 'border-black/[0.05] dark:border-white/[0.05] text-[#c7c7cc] dark:text-[#48484a] cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Lección anterior
        </button>

        <button
          type="button"
          onClick={onToggleComplete}
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold transition-all cursor-pointer ${
            isCompleted
              ? 'bg-[#30d158]/15 text-[#248a3d] dark:text-[#30d158] border border-[#30d158]/35'
              : 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] hover:opacity-90'
          }`}
        >
          <CheckCircle2 className="w-4.5 h-4.5" />
          {isCompleted ? 'Lección completada' : 'Marcar como completado'}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
            hasNext
              ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white hover:opacity-90 cursor-pointer'
              : 'bg-black/[0.06] dark:bg-white/[0.08] text-[#86868b] cursor-not-allowed'
          }`}
        >
          Siguiente lección
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </article>
  );
};
