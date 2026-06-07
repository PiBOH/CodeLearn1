import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'warning' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_DURATION = 3200;

const toastConfig: Record<ToastType, { bg: string; border: string; text: string; bar: string }> = {
  success: {
    bg:     'bg-emerald-50',
    border: 'border-emerald-300',
    text:   'text-emerald-900',
    bar:    'bg-emerald-400',
  },
  warning: {
    bg:     'bg-amber-50',
    border: 'border-amber-300',
    text:   'text-amber-900',
    bar:    'bg-amber-400',
  },
  info: {
    bg:     'bg-indigo-50',
    border: 'border-indigo-300',
    text:   'text-indigo-900',
    bar:    'bg-indigo-400',
  },
};

function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed top-4 inset-x-0 flex flex-col items-center gap-2 z-[999] pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map(toast => {
          const cfg = toastConfig[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -24, scale: 0.93 }}
              animate={{ opacity: 1, y: 0,   scale: 1 }}
              exit={{   opacity: 0, y: -16,  scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className={`w-full max-w-sm overflow-hidden rounded-2xl border shadow-xl shadow-black/10
                          pointer-events-auto ${cfg.bg} ${cfg.border}`}
            >
              {/* message */}
              <p className={`px-5 pt-4 pb-3 text-sm font-semibold text-center leading-snug ${cfg.text}`}>
                {toast.message}
              </p>
              {/* progress bar */}
              <motion.div
                className={`h-[3px] origin-left ${cfg.bar}`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: TOAST_DURATION / 1000, ease: 'linear' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
