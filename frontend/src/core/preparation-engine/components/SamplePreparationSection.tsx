import React from "react";
import EmptySamplePreparation from "./EmptySamplePreparation";

export interface SamplePreparationSectionProps<TPreparation> {
    title: string;
    preparations: readonly TPreparation[];
    isLocked?: boolean;

    onAddPreparation: () => void;
    onRemovePreparation: (
        preparation: TPreparation,
        index: number
    ) => void;

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
    // onRemovePreparation,
    renderPreparation,
}: SamplePreparationSectionProps<TPreparation>) => {
    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-emerald-800">
                        <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-emerald-700 to-emerald-900" />
                        {title}
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={onAddPreparation}
                    disabled={isLocked}
                    className={`
                        rounded-xl
                        bg-emerald-600
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-lg
                        transition-all
                        duration-200
                        hover:bg-emerald-700
                        ${
                            isLocked
                                ? "cursor-not-allowed opacity-50 hover:bg-emerald-600"
                                : ""
                        }
                    `}
                >
                    + Add Preparation
                </button>
            </div>

            {preparations.length === 0 ? (
                <EmptySamplePreparation
                    onAddPreparation={onAddPreparation}
                    isLocked={isLocked}
                />
            ) : (
                <div className="space-y-5">
                    {preparations.map((preparation, index) => (
                        <React.Fragment key={index}>
                            {renderPreparation(preparation, index)}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SamplePreparationSection;
