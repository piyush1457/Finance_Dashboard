
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils/classMerge';
import { useToastStore } from '../../store/toastStore';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-lg bg-[var(--surface-color)] p-4 shadow-lg border border-[var(--border-color)] animate-in fade-in slide-in-from-bottom-5 sm:slide-in-from-right-5 duration-300",
          )}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm font-medium text-[var(--text-primary)]">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
