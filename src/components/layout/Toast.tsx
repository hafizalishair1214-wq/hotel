import React from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { notifications, removeNotification } = useLoyalty();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto bg-stone-900/95 border border-amber-500/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-md flex items-start space-x-3 text-stone-100 animate-slide-up"
        >
          <div className="mt-0.5 shrink-0">
            {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {n.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {n.type === 'info' && <Info className="w-4 h-4 text-amber-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-stone-100">{n.title}</h5>
            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{n.message}</p>
          </div>

          <button
            onClick={() => removeNotification(n.id)}
            className="text-stone-500 hover:text-stone-300 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
