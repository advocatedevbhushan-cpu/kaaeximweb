'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type ToastVariant = 'default' | 'success' | 'destructive' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const t = { ...newToast, id };
    setToasts(prev => [...prev, t]);

    if (newToast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, newToast.duration || 5000);
    }
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    destructive: <AlertCircle className="w-5 h-5 text-destructive" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-info" />,
    default: <Info className="w-5 h-5 text-primary" />,
  };

  const bgColors = {
    success: 'bg-success/10 border-success/20',
    destructive: 'bg-destructive/10 border-destructive/20',
    warning: 'bg-warning/10 border-warning/20',
    info: 'bg-info/10 border-info/20',
    default: 'bg-card border-border',
  };

  return (
    <div
      className={`pointer-events-auto animate-slide-up ${bgColors[toast.variant || 'default']} border rounded-xl p-4 shadow-xl min-w-[300px] max-w-sm flex items-start gap-3`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.variant || 'default']}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{toast.title}</p>
        {toast.description && <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}