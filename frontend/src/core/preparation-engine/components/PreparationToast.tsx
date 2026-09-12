import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PreparationToastType = "success" | "error" | "info" | "warning";

export interface PreparationToastProps {
    visible: boolean;
    type?: PreparationToastType;
    message: string;
    duration?: number;
    onClose: () => void;
}

const PreparationToast: React.FC<PreparationToastProps> = ({
    visible,
    message,
    type = "info",
    duration = 5000,
    onClose,
}) => {
    useEffect(() => {
        if (!visible || duration <= 0) return;
        const timer = window.setTimeout(onClose, duration);
        return () => window.clearTimeout(timer);
    }, [visible, duration, onClose]);

    const config = {
        success: {
            border: "border-emerald-500",
            iconBg: "bg-emerald-500",
            icon: (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        error: {
            border: "border-red-500",
            iconBg: "bg-red-500",
            icon: (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        },
        info: {
            border: "border-blue-500",
            iconBg: "bg-blue-500",
            icon: (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        warning: {
            border: "border-amber-500",
            iconBg: "bg-amber-500",
            icon: (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    } as const;

    const current = config[type];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed right-6 top-6 z-[9999] w-96"
                >
                    <div className={`overflow-hidden rounded-lg border-l-4 bg-white shadow-xl ${current.border}`}>
                        <div className="flex items-center gap-3 p-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${current.iconBg}`}
                            >
                                {current.icon}
                            </motion.div>
                            <div className="min-w-0 flex-1">
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="text-sm font-medium leading-snug text-gray-800"
                                >
                                    {message}
                                </motion.p>
                            </div>
                            <motion.button
                                type="button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                onClick={onClose}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Close notification"
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: duration / 1000, ease: "linear" }}
                            className={`h-1 origin-left ${current.iconBg}`}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PreparationToast;
