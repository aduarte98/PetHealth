import React from "react";
import { XCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle2,
    classes: "bg-green-50 border-green-200 text-green-700"
  },
  error: {
    icon: XCircle,
    classes: "bg-red-50 border-red-200 text-red-700"
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-amber-50 border-amber-200 text-amber-700"
  },
  info: {
    icon: Info,
    classes: "bg-blue-50 border-blue-200 text-blue-700"
  }
};

export function AlertMessage({ variant = "info", title, message, onClose, className = "" }) {
  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${config.classes} ${className}`}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-inherit/70 hover:text-inherit"
          aria-label="Fechar alerta"
        >
          ×
        </button>
      )}
    </div>
  );
}
