import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'card' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback for browsers that don't trigger beforeinstallprompt yet
      setShowIOSGuide(true);
    }
  };

  if (justInstalled) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
        <CheckCircle className="w-4 h-4 text-emerald-400" />
        <span>¡App Instalada!</span>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <>
        <button
          id="pwa-header-install-btn"
          onClick={handleInstallClick}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-sky-950/40 hover:shadow-sky-500/20 transition-all active:scale-95 cursor-pointer border border-sky-400/30"
          title="Instalar POSUCI 360 como aplicación móvil o de escritorio"
        >
          <Smartphone className="w-3.5 h-3.5 animate-pulse text-sky-200" />
          <span className="hidden sm:inline">Instalar App Móvil</span>
          <span className="sm:hidden">Instalar App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center p-2.5 shadow-lg shadow-sky-500/30">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Instalar POSUCI 360</h3>
                  <p className="text-xs text-sky-300">En iPhone, iPad o Android</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-white">En iPhone / iPad (Safari):</span>
                    <p className="text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      Toca el botón <Share2 className="w-3.5 h-3.5 text-sky-400 inline" /> <strong>Compartir</strong> en la barra inferior de Safari y luego selecciona <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> <strong>"Agregar al inicio"</strong>.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 pt-2 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-white">En Android (Chrome / Edge):</span>
                    <p className="text-slate-400 mt-0.5">
                      Toca el menú de tres puntos (<strong>⋮</strong>) arriba a la derecha y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Variant card or banner
  return (
    <>
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Instalar en el Celular</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-2">Instalar en la pantalla de inicio</h3>
            <p className="text-xs text-slate-300 mb-4">
              Abre el menú de tu navegador y selecciona <strong>"Agregar a pantalla principal"</strong> o <strong>"Instalar App"</strong>.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
