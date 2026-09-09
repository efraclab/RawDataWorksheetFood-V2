import React from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

export interface PreparationCompleteModalProps {
    isOpen: boolean;
    preparationName: string;

    isSubmitting?: boolean;

    onConfirm: () => void;
    onCancel: () => void;
}

const PreparationCompleteModal: React.FC<
    PreparationCompleteModalProps
> = ({
    isOpen,
    preparationName,
    isSubmitting = false,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preparation-complete-title"
        >
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                            <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                        </div>

                        <h3
                            id="preparation-complete-title"
                            className="text-lg font-bold text-emerald-900"
                        >
                            Complete Preparation
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        aria-label="Close"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-white hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-5 py-6">
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                        <div>
                            <p className="text-sm font-semibold text-amber-900">
                                Are you sure you want to complete this
                                preparation?
                            </p>

                            <p className="mt-2 text-sm leading-6 text-amber-800">
                                <span className="font-semibold">
                                    {preparationName}
                                </span>{" "}
                                will be marked as completed and locked. You
                                may need to unlock it before making further
                                changes.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCircle2 className="h-4 w-4" />

                        {isSubmitting
                            ? "Completing..."
                            : "Complete Preparation"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreparationCompleteModal;