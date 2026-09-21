import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 border border-amber-400/40 px-3.5 py-2 text-xs font-medium text-white shadow-2xl backdrop-blur-sm animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>Modo sin conexión — Operando con datos clínicos en caché local.</span>
    </div>
  );
};
