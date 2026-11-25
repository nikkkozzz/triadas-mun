import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Search,
  X,
  RotateCcw,
} from 'lucide-react';
import { COURSE_MODULES, ALL_LESSONS } from '../data/courseModules';

interface CourseSidebarProps {
  currentLessonId: string;
  completedIds: Set<string>;
  onSelectLesson: (lessonId: string) => void;
  onResetProgress: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  currentLessonId,
  completedIds,
  onSelectLesson,
  onResetProgress,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [search, setSearch] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(COURSE_MODULES.map((m) => m.id))
  );

  const totalCount = ALL_LESSONS.length;
  const completedCount = completedIds.size;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) {
        next.delete(modId);
      } else {
        next.add(modId);
      }
      return next;
    });
  };

  const filteredModules = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COURSE_MODULES;
    return COURSE_MODULES.map((m) => ({
      ...m,
      lessons: m.lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.subtitle.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q) ||
          (l.examples && l.examples.toLowerCase().includes(q)) ||
          m.title.toLowerCase().includes(q)
      ),
    })).filter((m) => m.lessons.length > 0);
  }, [search]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#f5f5f7] dark:bg-[#111113] border-r border-black/[0.08] dark:border-white/[0.09]">
      {/* Progress Overview */}
      <div className="px-4 pt-4 pb-3.5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Progreso del curso
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] font-bold text-[#0071e3] dark:text-[#0a84ff] tabular-nums">
              {progressPct}%
            </span>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={onResetProgress}
                title="Reiniciar progreso guardado"
                className="text-[#86868b] hover:text-[#ff453a] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="h-1.5 w-full rounded-full bg-black/[0.08] dark:bg-white/[0.1] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#0071e3] dark:bg-[#0a84ff] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <p className="text-[11px] text-[#6e6e73] dark:text-[#86868b] mt-1.5 tabular-nums">
          {completedCount} de {totalCount} lecciones completadas · Págs. 1–310
        </p>

        {/* Search Input */}
        <div className="relative mt-3">
          <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tema o ejemplo..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.09] text-[12px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-none focus:border-[#0a84ff]"
          />
        </div>
      </div>

      {/* Scrollable Modules & Lessons Index */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-2" aria-label="Índice del curso">
        {filteredModules.map((mod) => {
          const isExpanded = search.trim().length > 0 || expandedModules.has(mod.id);
          const modCompleted = mod.lessons.filter((l) => completedIds.has(l.id)).length;

          return (
            <div key={mod.id} className="select-none">
              <button
                type="button"
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#6e6e73] dark:text-[#86868b]">
                    <span>{mod.number}</span>
                    <span>·</span>
                    <span className="font-mono">{mod.pages}</span>
                  </div>
                  <div className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate mt-0.5">
                    {mod.title}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono text-[11px] text-[#86868b] tabular-nums">
                    {modCompleted}/{mod.lessons.length}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#86868b]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#86868b]" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <ul className="mt-1 space-y-0.5 pl-1">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    const isDone = completedIds.has(lesson.id);

                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectLesson(lesson.id);
                            onCloseMobile();
                          }}
                          className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white'
                              : 'text-[#424245] dark:text-[#d1d1d6] hover:bg-black/[0.05] dark:hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2
                                className={`w-4 h-4 ${
                                  isActive ? 'text-white' : 'text-[#248a3d] dark:text-[#30d158]'
                                }`}
                              />
                            ) : (
                              <Circle
                                className={`w-4 h-4 ${
                                  isActive ? 'text-white/70' : 'text-[#c7c7cc] dark:text-[#48484a]'
                                }`}
                              />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[12.5px] font-medium leading-snug line-clamp-2">
                              <span
                                className={`font-mono text-[11px] mr-1.5 ${
                                  isActive ? 'text-white/80' : 'text-[#86868b]'
                                }`}
                              >
                                {lesson.code}
                              </span>
                              {lesson.title}
                            </div>
                            <div
                              className={`text-[10.5px] font-mono mt-0.5 ${
                                isActive ? 'text-white/75' : 'text-[#86868b]'
                              }`}
                            >
                              {lesson.pages}
                              {lesson.examples ? ` · ${lesson.examples}` : ''}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {filteredModules.length === 0 && (
          <p className="text-[12px] text-[#86868b] text-center py-6 px-3">
            No se encontraron lecciones para «{search}».
          </p>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-[300px] xl:w-[320px] shrink-0 h-[calc(100vh-56px)] sticky top-14">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-[86vw] max-w-[330px] h-full flex flex-col">
            <div className="h-14 px-4 flex items-center justify-between bg-[#f5f5f7] dark:bg-[#111113] border-b border-black/[0.08] dark:border-white/[0.09]">
              <span className="font-semibold text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Índice del curso
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
                aria-label="Cerrar índice"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
