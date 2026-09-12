import React from "react";
import { motion } from "framer-motion";

export interface EmptySamplePreparationProps {
    title?: string;
    description?: string;
    isLocked?: boolean;
    onAddPreparation: () => void;
}

const EmptySamplePreparation: React.FC<EmptySamplePreparationProps> = ({
    title = "No sample preparations added yet",
    description = "Click the add button to create LOD sample preparation",
    isLocked = false,
    //onAddPreparation,
}) => {
    const Target: React.FC<{ className: string }> = ({ className }) => (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12 text-center shadow-inner"
        >
            <div className="relative z-10">
                <div className="mb-3 inline-block rounded-full bg-white p-4 shadow-lg">
                    <Target className="h-10 w-10 text-emerald-400" />
                </div>

                <p className="mb-1 text-base font-bold text-emerald-800">
                    {title}
                </p>

                <p className="mx-auto max-w-md text-xs text-emerald-600/80">
                    {description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-100/50 px-4 py-2">
                    <div
                        className={`h-2 w-2 rounded-full bg-emerald-500 ${
                            isLocked ? "" : "animate-ping"
                        }`}
                    />
                    <span className="text-xs font-semibold text-emerald-800">
                        Ready to start
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default EmptySamplePreparation;
