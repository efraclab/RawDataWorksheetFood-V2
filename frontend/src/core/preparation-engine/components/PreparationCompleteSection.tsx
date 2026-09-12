import React from "react";
import { AlertCircle, Lock, Unlock } from "lucide-react";

export interface PreparationCompleteSectionProps {
    preparationName: string;
    isCompleted: boolean;
    isLocked?: boolean;
    completedBy?: string | null;
    completedAt?: string | null;
    onComplete?: () => void;
    onUnlock?: () => void;
}

const PreparationCompleteSection: React.FC<PreparationCompleteSectionProps> = ({
    isCompleted,
    isLocked = false,
    onComplete,
    onUnlock,
}) => {
    if (isCompleted) {
        return (
            <section className="mt-6">
                <button
                    type="button"
                    onClick={onUnlock}
                    disabled={!isLocked}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Unlock className="h-4 w-4" />
                    Unlock LOD Preparation
                </button>
            </section>
        );
    }

    return (
        <section className="mt-6">
            <button
                type="button"
                onClick={onComplete}
                disabled={isLocked}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Lock className="h-4 w-4" />
                Mark LOD Preparation as Complete
            </button>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                <span>
                    Complete preparation above to unlock the <strong>Calculations</strong> section.
                </span>
            </div>
        </section>
    );
};

export default PreparationCompleteSection;
