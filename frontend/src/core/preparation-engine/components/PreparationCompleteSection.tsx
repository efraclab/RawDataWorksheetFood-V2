import React from "react";
import { CheckCircle2, Lock, Unlock } from "lucide-react";

export interface PreparationCompleteSectionProps {
    preparationName: string;

    isCompleted: boolean;
    isLocked?: boolean;

    completedBy?: string | null;
    completedAt?: string | null;

    onComplete?: () => void;
    onUnlock?: () => void;
}

const PreparationCompleteSection: React.FC<
    PreparationCompleteSectionProps
> = ({
    preparationName,
    isCompleted,
    isLocked = false,
    completedBy,
    completedAt,
    onComplete,
    onUnlock,
}) => {
    const formatCompletedAt = (value?: string | null) => {
        if (!value) {
            return null;
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString();
    };

    return (
        <section className="mt-6 rounded-2xl border border-emerald-200 bg-white shadow-sm">
            <div className="border-b border-emerald-100 bg-emerald-50 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-emerald-900">
                            Preparation Completion
                        </h3>

                        <p className="mt-1 text-sm text-emerald-700">
                            Complete and lock {preparationName} when all
                            preparation data has been verified.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                {isCompleted ? (
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />

                                <div>
                                    <h4 className="font-semibold text-emerald-900">
                                        Preparation Completed
                                    </h4>

                                    {completedBy && (
                                        <p className="mt-1 text-sm text-emerald-700">
                                            Completed by: {completedBy}
                                        </p>
                                    )}

                                    {completedAt && (
                                        <p className="text-sm text-emerald-700">
                                            Completed at:{" "}
                                            {formatCompletedAt(completedAt)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {onUnlock && (
                                <button
                                    type="button"
                                    onClick={onUnlock}
                                    disabled={!isLocked}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Unlock className="h-4 w-4" />
                                    Unlock Preparation
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <Lock className="mt-0.5 h-6 w-6 shrink-0 text-amber-700" />

                                <div>
                                    <h4 className="font-semibold text-amber-900">
                                        Preparation Not Completed
                                    </h4>

                                    <p className="mt-1 text-sm text-amber-700">
                                        Verify all preparation information
                                        before completing this preparation.
                                    </p>
                                </div>
                            </div>

                            {onComplete && (
                                <button
                                    type="button"
                                    onClick={onComplete}
                                    disabled={isLocked}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Complete Preparation
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PreparationCompleteSection;