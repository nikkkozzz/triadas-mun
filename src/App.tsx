import { useCallback, useEffect, useMemo, useState } from 'react';
import { Maximize2, Menu, Minimize2, Moon, Sliders, Sun, Timer } from 'lucide-react';
import { ALL_LESSONS, getModuleForLesson } from './data/courseModules';
import { CourseSidebar } from './components/CourseSidebar';
import { LessonRenderer } from './components/LessonRenderer';
import { MetronomeBar } from './components/MetronomeBar';
import { PracticeStudioModal, StudioTab } from './components/studio/PracticeStudioModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { guitarAudio } from './utils/guitarAudio';

const STORAGE_COMPLETED_KEY = 'triadas_munones_completed_v1';
const STORAGE_CURRENT_KEY = 'triadas_munones_current_lesson_v1';
const STORAGE_THEME_KEY = 'triadas_munones_theme_v1';

export default function App() {
  const [currentLessonId, setCurrentLessonId] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_CURRENT_KEY);
      if (saved && ALL_LESSONS.some((l) => l.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore storage access failures
    }
    return ALL_LESSONS[0].id;
  });

  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return new Set(parsed.filter((id): id is string => typeof id === 'string'));
        }
      }
    } catch {
      // Ignore storage access failures
    }
    return new Set();
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_THEME_KEY);
      if (saved === 'light') return false;
    } catch {
      // Default to dark mode for comfortable practice
    }
    return true;
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMetronomeOpen, setIsMetronomeOpen] = useState(false);
  const [isMetronomeRunning, setIsMetronomeRunning] = useState(false);
  const [bpm, setBpm] = useState(86);

  const [isStandMode, setIsStandMode] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioInitialTab, setStudioInitialTab] = useState<StudioTab>('looper');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#000000' : '#ffffff');
    }
    try {
      window.localStorage.setItem(STORAGE_THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore
    }
  }, [isDark]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_CURRENT_KEY, currentLessonId);
    } catch {
      // Ignore
    }
    guitarAudio.stopAllSequences();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLessonId]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(Array.from(completedIds)));
    } catch {
      // Ignore
    }
  }, [completedIds]);

  const currentIndex = useMemo(
    () => ALL_LESSONS.findIndex((l) => l.id === currentLessonId),
    [currentLessonId]
  );

  const currentLesson = ALL_LESSONS[currentIndex] ?? ALL_LESSONS[0];
  const currentModule = getModuleForLesson(currentLesson.id)!;

  const progressPct = Math.round((completedIds.size / ALL_LESSONS.length) * 100);

  const handleToggleComplete = useCallback(() => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentLesson.id)) {
        next.delete(currentLesson.id);
      } else {
        next.add(currentLesson.id);
      }
      return next;
    });
  }, [currentLesson.id]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentLessonId(ALL_LESSONS[currentIndex - 1].id);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < ALL_LESSONS.length - 1) {
      setCurrentLessonId(ALL_LESSONS[currentIndex + 1].id);
    }
  }, [currentIndex]);

  const handleResetProgress = () => {
    setCompletedIds(new Set());
  };

  const openStudio = (tab: StudioTab = 'looper') => {
    setIsMetronomeRunning(false);
    setStudioInitialTab(tab);
    setStudioOpen(true);
  };

  // Global Keyboard Shortcuts for Hands-Free Guitar Practice (Modo Atril & Normal)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return;
      }

      if (e.key === 'Escape') {
        if (studioOpen) {
          setStudioOpen(false);
        } else if (isStandMode) {
          setIsStandMode(false);
        }
        return;
      }

      if (studioOpen) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsMetronomeRunning((r) => !r);
        setIsMetronomeOpen(true);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMetronomeOpen((o) => !o);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsStandMode((s) => !s);
      } else if (e.key === 'c' || e.key === 'C') {
        handleToggleComplete();
      } else if (e.key === 's' || e.key === 'S') {
        openStudio('looper');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [studioOpen, isStandMode, handleNext, handlePrev, handleToggleComplete]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1d1d1f] dark:bg-[#000000] dark:text-[#f5f5f7]">
      {/* Apple-style Minimal 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 h-14 border-b border-black/[0.08] dark:border-white/[0.1] bg-white/85 dark:bg-[#000000]/85 backdrop-blur-xl">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Mobile Menu + Brand Wordmark */}
          <div className="flex items-center gap-3 min-w-0">
            {!isStandMode && (
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] cursor-pointer"
                aria-label="Abrir índice del curso"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentLessonId(ALL_LESSONS[0].id)}
              className="flex items-center gap-2.5 text-left cursor-pointer min-w-0"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b30] shrink-0" />
              <span className="font-bold text-[15px] tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                Tríadas para Muñones
              </span>
              <span className="hidden xl:inline text-[12px] text-[#86868b] font-mono">
                y CAGED · v1.2
              </span>
            </button>
          </div>

          {/* Center: Compact Progress Summary */}
          <div className="hidden lg:flex items-center gap-3 text-[12px] text-[#6e6e73] dark:text-[#a1a1a6]">
            <span className="font-mono tabular-nums">
              {currentLesson.code} · {currentModule.number}
            </span>
            <span className="text-black/20 dark:text-white/20">|</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full bg-black/[0.08] dark:bg-white/[0.12] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0071e3] dark:bg-[#0a84ff] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-mono font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">
                {progressPct}%
              </span>
            </div>
          </div>

          {/* Right: Install PWA + Estudio + Metrónomo + Modo Atril + Theme */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />

            <button
              type="button"
              onClick={() => openStudio('looper')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.1] dark:hover:bg-white/[0.14] transition-colors cursor-pointer"
              title="Abrir Looper, Afinador y Entrenador de Oído (tecla S)"
            >
              <Sliders className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#0a84ff]" />
              <span className="hidden sm:inline">Estudio</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMetronomeOpen((o) => !o)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                isMetronomeRunning
                  ? 'bg-[#ff453a] text-white'
                  : isMetronomeOpen
                    ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white'
                    : 'bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.1] dark:hover:bg-white/[0.14]'
              }`}
              title="Metrónomo (Espacio: Play/Stop · M: mostrar/ocultar)"
            >
              <Timer className="w-4 h-4" />
              <span className="hidden md:inline">Metrónomo</span>
              <span className="font-mono text-[12px] tabular-nums opacity-90">{bpm}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsStandMode((s) => !s)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                isStandMode
                  ? 'bg-[#0071e3] dark:bg-[#0a84ff] text-white'
                  : 'bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.1] dark:hover:bg-white/[0.14]'
              }`}
              title="Modo Atril sin distracciones (tecla F)"
            >
              {isStandMode ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Atril</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              className="p-2 rounded-lg bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.1] dark:hover:bg-white/[0.14] transition-colors cursor-pointer"
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Collapsible Integrated Metronome Bar */}
      <MetronomeBar
        isOpen={isMetronomeOpen}
        onClose={() => setIsMetronomeOpen(false)}
        bpm={bpm}
        setBpm={setBpm}
        isRunning={isMetronomeRunning}
        onToggleRunning={() => setIsMetronomeRunning((r) => !r)}
      />

      {/* Main Split Workspace: Left Course Index (hidden in Modo Atril) + Right Lesson Canvas */}
      <div className="flex-1 flex">
        {!isStandMode && (
          <CourseSidebar
            currentLessonId={currentLesson.id}
            completedIds={completedIds}
            onSelectLesson={setCurrentLessonId}
            onResetProgress={handleResetProgress}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0">
          <LessonRenderer
            module={currentModule}
            lesson={currentLesson}
            lessonIndex={currentIndex}
            totalLessons={ALL_LESSONS.length}
            isCompleted={completedIds.has(currentLesson.id)}
            onToggleComplete={handleToggleComplete}
            onPrev={handlePrev}
            onNext={handleNext}
            onNavigateLesson={setCurrentLessonId}
            hasPrev={currentIndex > 0}
            hasNext={currentIndex < ALL_LESSONS.length - 1}
            globalBpm={bpm}
            isStandMode={isStandMode}
          />
        </main>
      </div>

      {/* Subtle Keyboard Shortcut Strip in Modo Atril */}
      {isStandMode && (
        <div className="sticky bottom-0 z-30 border-t border-black/[0.08] dark:border-white/[0.1] bg-white/90 dark:bg-[#0b0b0d]/90 backdrop-blur-xl px-4 py-2 text-center text-[12px] text-[#6e6e73] dark:text-[#a1a1a6] font-mono">
          <span>Modo Atril</span>
          <span className="mx-2 opacity-40">·</span>
          <span>Espacio: Metrónomo</span>
          <span className="mx-2 opacity-40">·</span>
          <span>← / →: Lecciones</span>
          <span className="mx-2 opacity-40">·</span>
          <span>S: Estudio</span>
          <span className="mx-2 opacity-40">·</span>
          <span>C: Completar</span>
          <span className="mx-2 opacity-40">·</span>
          <span>F / Esc: Salir</span>
        </div>
      )}

      {/* Practice Studio Modal (Looper, Tuner & Ear Trainer) */}
      <PracticeStudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        initialTab={studioInitialTab}
        globalBpm={bpm}
      />

      {/* Non-intrusive Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
