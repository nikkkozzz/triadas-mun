import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-xl border border-[#ff9f0a]/40 bg-[#1c1c1e]/95 backdrop-blur-md px-3.5 py-2 text-[12px] font-medium text-[#ffd60a] shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>Modo sin conexión — Todo el curso sigue disponible offline</span>
    </div>
  );
};
