import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle2,
    classes: "bg-green-50 border-green-200 text-green-800"
  },
  error: {
    icon: XCircle,
    classes: "bg-red-50 border-red-200 text-red-800"
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-amber-50 border-amber-200 text-amber-800"
  },
  info: {
    icon: Info,
    classes: "bg-blue-50 border-blue-200 text-blue-800"
  }
};

export function SideNotification({ open, variant = "info", title, message, onClose }) {
  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  useEffect(() => {
    if (!open || !onClose) return;
    const timer = setTimeout(() => onClose(), 10000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-y-0 right-0 z-[60] flex items-start pointer-events-none"
        >
          <div className="w-full max-w-sm mt-6 mr-4 pointer-events-auto">
            <div className={`rounded-l-2xl border shadow-xl p-5 flex flex-col gap-3 ${config.classes}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  {title && <p className="text-sm font-semibold tracking-wide uppercase">{title}</p>}
                  <p className="text-base font-medium">{message}</p>
                </div>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-current/60 hover:text-current"
                    aria-label="Fechar aviso"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
