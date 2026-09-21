import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Sparkles } from 'lucide-react';

export const FloatingMobileButton: React.FC = () => {
  const { mode, setMode } = useApp();

  // If already in mobile mode, do not show floating launcher
  if (mode === 'movil') {
    return null;
  }

  return (
    <aside
      aria-label="Acceso rápido a App Móvil"
      className="fixed bottom-6 right-6 z-40 flex items-center shadow-2xl animate-bounce"
    >
      <button
        id="floating-mobile-app-btn"
        onClick={() => setMode('movil')}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 border-2 border-emerald-300/40 transition transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Abrir directamente la App Móvil de Recuperación POSUCI 360"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Smartphone className="w-4 h-4 text-emerald-200" />
        </div>
        <div className="text-left leading-tight">
          <div className="flex items-center gap-1">
            <span>App Móvil POSUCI</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
          <div className="text-[10px] text-emerald-100 font-normal">Tomy & Recuperación</div>
        </div>
      </button>
    </aside>
  );
};
