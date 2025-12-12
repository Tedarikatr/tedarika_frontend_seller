import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

const TOAST_TYPES = {
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-600",
    border: "border-emerald-700",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-600",
    border: "border-red-700",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-yellow-600",
    border: "border-yellow-700",
  },
  info: {
    icon: Info,
    bg: "bg-blue-600",
    border: "border-blue-700",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message, duration) => addToast(message, "success", duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, "error", duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, "warning", duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, "info", duration), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        ${config.bg} ${config.border}
        border-2 rounded-xl shadow-2xl
        px-5 py-3 max-w-md w-full
        pointer-events-auto
        backdrop-blur-sm bg-opacity-95
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
        <p className="text-white text-sm font-medium flex-1 leading-relaxed">
          {toast.message}
        </p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
