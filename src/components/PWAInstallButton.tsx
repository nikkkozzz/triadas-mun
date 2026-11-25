import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Already running as an installed standalone PWA
  if (isInstalled) {
    return null;
  }

  // Chromium / Edge / Android / Desktop native install flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-[#0071e3] dark:bg-[#0a84ff] text-white hover:opacity-90 transition-opacity cursor-pointer"
        title="Instalar Tríadas para Muñones como app en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instalar app</span>
      </button>
    );
  }

  // iOS Safari guided installation modal
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-[#0071e3] dark:bg-[#0a84ff] text-white hover:opacity-90 transition-opacity cursor-pointer"
          title="Instalar en iPhone o iPad"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Instalar en iPhone o iPad"
          >
            <div className="w-full max-w-sm rounded-3xl border border-black/[0.1] dark:border-white/[0.12] bg-white dark:bg-[#161617] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[17px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Instalar en iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
                  aria-label="Cerrar instrucciones"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="space-y-2.5 text-[14px] leading-relaxed text-[#424245] dark:text-[#d1d1d6] list-decimal pl-5">
                <li>
                  Pulsa el botón <strong className="inline-flex items-center gap-1 text-[#1d1d1f] dark:text-[#f5f5f7]"><Share className="w-3.5 h-3.5 inline" /> Compartir</strong> en la barra de Safari.
                </li>
                <li>
                  Desliza hacia abajo y selecciona <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">Añadir a pantalla de inicio</strong>.
                </li>
                <li>
                  Pulsa <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">Añadir</strong> para usar el curso sin conexión como app nativa.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#0071e3] dark:bg-[#0a84ff] py-2.5 text-[14px] font-semibold text-white hover:opacity-90 cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
