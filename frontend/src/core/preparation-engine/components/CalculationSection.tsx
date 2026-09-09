import React from "react";
import { Calculator } from "lucide-react";

export interface CalculationSectionProps {
    title?: string;
    description?: string;

    isLocked?: boolean;
    hasCalculation?: boolean;

    onCalculate?: () => void;

    children?: React.ReactNode;
}

const CalculationSection: React.FC<CalculationSectionProps> = ({
    title = "Calculation",
    description = "Review and calculate the preparation result.",
    isLocked = false,
    hasCalculation = false,
    onCalculate,
    children,
}) => {
    return (
        <section className="mt-6 rounded-2xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                        <Calculator className="h-5 w-5 text-emerald-700" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-emerald-900">
                            {title}
                        </h3>

                        <p className="mt-1 text-sm text-emerald-700">
                            {description}
                        </p>
                    </div>
                </div>

                {onCalculate && (
                    <button
                        type="button"
                        onClick={onCalculate}
                        disabled={isLocked}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Calculator className="h-4 w-4" />
                        Calculate
                    </button>
                )}
            </div>

            <div className="p-5">
                {hasCalculation ? (
                    children
                ) : (
                    <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-6 py-10 text-center">
                        <Calculator className="mx-auto h-8 w-8 text-emerald-500" />

                        <h4 className="mt-3 text-base font-semibold text-emerald-900">
                            No Calculation Available
                        </h4>

                        <p className="mt-1 text-sm text-emerald-700">
                            Complete the preparation data before calculating
                            the result.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CalculationSection;