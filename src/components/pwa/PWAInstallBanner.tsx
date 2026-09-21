import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Smartphone, Download, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, isInstallable, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('posuci_pwa_banner_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('posuci_pwa_banner_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <aside
        aria-label="Aviso de instalación móvil"
        className="bg-gradient-to-r from-sky-900/90 via-indigo-950/95 to-slate-900 border-b border-sky-500/30 text-white px-4 py-2.5 relative shadow-lg z-30"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-sky-100">
                ¿Usando desde el celular? Instala la App de POSUCI 360
              </p>
              <p className="text-[11px] text-slate-300 hidden md:block">
                Acceso directo en tu pantalla de inicio, modo pantalla completa, alertas clínicas y funcionamiento offline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleInstall}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar Gratis</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Cerrar aviso"
              aria-label="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                Cómo instalar en tu móvil
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              {isIOS ? (
                <>En iPhone o iPad, presiona el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en Safari y luego selecciona <strong>"Agregar al inicio"</strong>.</>
              ) : (
                <>Abre el menú de tu navegador (los 3 puntos en la esquina superior derecha) y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</>
              )}
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
