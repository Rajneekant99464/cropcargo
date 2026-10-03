import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let borderClass = 'border-neutral-200 bg-white text-neutral-900';
        let icon = <Info className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-200 bg-emerald-50/95 text-emerald-950';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />;
        } else if (toast.type === 'warning' || toast.type === 'error') {
          borderClass = 'border-amber-200 bg-amber-50/95 text-amber-950';
          icon = <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl shadow-lg border text-xs transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs">{toast.title}</div>
              <div className="text-[11px] opacity-90 mt-0.5 leading-snug">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
