import React, { useEffect } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

export type PreparationToastType = "success" | "error" | "info";

export interface PreparationToastProps {
    visible: boolean;
    type?: PreparationToastType;
    message: string;
    duration?: number;
    onClose: () => void;
}

const PreparationToast: React.FC<PreparationToastProps> = ({
    visible,
    type = "info",
    message,
    duration = 4000,
    onClose,
}) => {
    useEffect(() => {
        if (!visible || duration <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            window.clearTimeout(timer);
        };
    }, [visible, duration, onClose]);

    if (!visible) {
        return null;
    }

    const Icon =
        type === "success"
            ? CheckCircle2
            : type === "error"
              ? XCircle
              : Info;

    const containerClass =
        type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : type === "error"
              ? "border-red-200 bg-red-50 text-red-900"
              : "border-blue-200 bg-blue-50 text-blue-900";

    const iconClass =
        type === "success"
            ? "text-emerald-700"
            : type === "error"
              ? "text-red-700"
              : "text-blue-700";

    return (
        <div
            className={`fixed bottom-5 right-5 z-[110] flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${containerClass}`}
            role="status"
            aria-live="polite"
        >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} />

            <p className="flex-1 text-sm font-medium leading-5">
                {message}
            </p>

            <button
                type="button"
                onClick={onClose}
                aria-label="Close notification"
                className="rounded-lg p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default PreparationToast;