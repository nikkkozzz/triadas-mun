import React, { useEffect, useState } from 'react';
import { Headphones, Repeat, Sliders, X } from 'lucide-react';
import { BackingLooper } from './BackingLooper';
import { GuitarTuner } from './GuitarTuner';
import { EarTrainer } from './EarTrainer';

export type StudioTab = 'looper' | 'tuner' | 'ear';

interface PracticeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: StudioTab;
  globalBpm: number;
}

export const PracticeStudioModal: React.FC<PracticeStudioModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'looper',
  globalBpm,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs: { id: StudioTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'looper', label: 'Looper y Bases', Icon: Repeat },
    { id: 'tuner', label: 'Afinador', Icon: Sliders },
    { id: 'ear', label: 'Entrenador de Oído', Icon: Headphones },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Estudio de práctica interactivo"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-black/[0.1] dark:border-white/[0.12] bg-white dark:bg-[#0b0b0d] shadow-2xl overflow-hidden">
        {/* Studio Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-black/[0.08] dark:border-white/[0.1] flex flex-wrap items-center justify-between gap-3 bg-[#f5f5f7]/80 dark:bg-[#141416]">
          <div className="flex items-center gap-3">
            <h2 className="text-[17px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Estudio de Práctica
            </h2>
            <div className="inline-flex rounded-xl bg-black/[0.06] dark:bg-white/[0.08] p-1">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
                    activeTab === id
                      ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs'
                      : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-black/[0.06] dark:bg-white/[0.08] text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar Estudio de Práctica"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Studio Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {activeTab === 'looper' && <BackingLooper initialBpm={globalBpm} />}
          {activeTab === 'tuner' && <GuitarTuner />}
          {activeTab === 'ear' && <EarTrainer />}
        </div>
      </div>
    </div>
  );
};
