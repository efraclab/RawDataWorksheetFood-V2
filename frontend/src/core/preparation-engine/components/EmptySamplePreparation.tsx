import React from "react";
import { Beaker, Plus } from "lucide-react";

export interface EmptySamplePreparationProps {
    title?: string;
    description?: string;
    isLocked?: boolean;
    onAddPreparation: () => void;
}

const EmptySamplePreparation: React.FC<EmptySamplePreparationProps> = ({
    title = "No Sample Preparation",
    description = "Add a sample preparation to configure the required analysis steps.",
    isLocked = false,
    onAddPreparation,
}) => {
    return (
        <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <Beaker className="h-7 w-7 text-emerald-700" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-emerald-900">
                {title}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-emerald-700">
                {description}
            </p>

            <button
                type="button"
                onClick={onAddPreparation}
                disabled={isLocked}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Plus className="h-4 w-4" />
                Add Preparation
            </button>
        </div>
    );
};

export default EmptySamplePreparation;