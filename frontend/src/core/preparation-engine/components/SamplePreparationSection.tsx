import React from "react";
import { Plus } from "lucide-react";

export interface SamplePreparationSectionProps<TPreparation> {
    title: string;
    preparations: readonly TPreparation[];
    isLocked?: boolean;

    onAddPreparation: () => void;
    onRemovePreparation: (preparation: TPreparation, index: number) => void;

    renderPreparation: (
        preparation: TPreparation,
        index: number
    ) => React.ReactNode;
}

const SamplePreparationSection = <TPreparation,>({
    title,
    preparations,
    isLocked = false,
    onAddPreparation,
    onRemovePreparation,
    renderPreparation,
}: SamplePreparationSectionProps<TPreparation>) => {
    return (
        <section className="mt-6 rounded-2xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-bold text-emerald-900">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-emerald-700">
                        Configure the sample preparation steps required for
                        analysis.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onAddPreparation}
                    disabled={isLocked}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    Add Preparation
                </button>
            </div>

            <div className="p-5">
                {preparations.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-6 py-10 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                            <Plus className="h-6 w-6 text-emerald-700" />
                        </div>

                        <h4 className="text-base font-semibold text-emerald-900">
                            No Sample Preparation
                        </h4>

                        <p className="mt-1 text-sm text-emerald-700">
                            Add a sample preparation to configure the analysis
                            steps.
                        </p>

                        <button
                            type="button"
                            onClick={onAddPreparation}
                            disabled={isLocked}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-500 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            Add Preparation
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {preparations.map((preparation, index) => (
                            <div key={index} className="relative">
                                {renderPreparation(preparation, index)}

                                {!isLocked && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemovePreparation(
                                                preparation,
                                                index
                                            )
                                        }
                                        className="absolute right-4 top-4 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SamplePreparationSection;