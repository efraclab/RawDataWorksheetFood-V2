import React from "react";

export interface PreparationStep {
    readonly id?: string | number;
    readonly name: string;
}

export interface SamplePreparationStepsProps<TStep extends PreparationStep> {
    steps: readonly TStep[];
    isLocked?: boolean;
    onAddStep?: () => void;
    onRemoveStep?: (step: TStep, index: number) => void;
    renderStep: (step: TStep, index: number, isLocked: boolean) => React.ReactNode;
}

const SamplePreparationSteps = <TStep extends PreparationStep>({
    steps,
    isLocked = false,
    onAddStep: _onAddStep,
    onRemoveStep: _onRemoveStep,
    renderStep,
}: SamplePreparationStepsProps<TStep>) => {
    if (steps.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-5 py-8 text-center">
                <p className="text-sm font-medium text-emerald-800">
                    No preparation steps configured.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {steps.map((step, index) => (
                <div
                    key={step.id ?? index}
                    className="rounded-xl border border-emerald-200 bg-white px-4 py-4 shadow-sm"
                >
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-slate-800 text-sm font-bold text-white shadow-sm">
                            {index + 1}
                        </div>

                        <div className="relative flex min-w-0 flex-1 items-center">
                            <span className="absolute left-0 top-1/2 h-px w-full bg-emerald-100" />
                            <span className="relative bg-white pr-3 text-sm font-bold text-emerald-900">
                                {step.name}
                            </span>
                        </div>
                    </div>

                    <div className="pl-11">
                        {renderStep(step, index, isLocked)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SamplePreparationSteps;
