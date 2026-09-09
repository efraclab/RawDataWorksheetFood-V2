import React from "react";
import { Plus } from "lucide-react";

export interface PreparationStep {
    readonly id?: string | number;
    readonly name: string;
    readonly [key: string]: unknown;
}

export interface SamplePreparationStepsProps<TStep extends PreparationStep> {
    steps: readonly TStep[];
    isLocked?: boolean;

    onAddStep?: () => void;
    onRemoveStep?: (step: TStep, index: number) => void;

    renderStep: (
        step: TStep,
        index: number,
        isLocked: boolean
    ) => React.ReactNode;
}

const SamplePreparationSteps = <TStep extends PreparationStep>({
    steps,
    isLocked = false,
    onAddStep,
    onRemoveStep,
    renderStep,
}: SamplePreparationStepsProps<TStep>) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-emerald-900">
                        Preparation Steps
                    </h4>

                    <p className="mt-1 text-sm text-emerald-700">
                        Configure the steps required to complete this
                        preparation.
                    </p>
                </div>

                {onAddStep && (
                    <button
                        type="button"
                        onClick={onAddStep}
                        disabled={isLocked}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-500 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        Add Step
                    </button>
                )}
            </div>

            {steps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-5 py-8 text-center">
                    <p className="text-sm font-medium text-emerald-800">
                        No preparation steps configured.
                    </p>

                    {onAddStep && (
                        <button
                            type="button"
                            onClick={onAddStep}
                            disabled={isLocked}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            Add Step
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {steps.map((step, index) => (
                        <div
                            key={step.id ?? index}
                            className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                                        {index + 1}
                                    </div>

                                    <span className="font-semibold text-emerald-900">
                                        {step.name}
                                    </span>
                                </div>

                                {onRemoveStep && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemoveStep(step, index)
                                        }
                                        disabled={isLocked}
                                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            {renderStep(step, index, isLocked)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SamplePreparationSteps;