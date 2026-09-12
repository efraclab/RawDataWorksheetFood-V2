import React from "react";

import { Plus } from "lucide-react";

import type {
    PreparationModuleDefinition,
} from "../../preparation/ui/PreparationModuleDefinition";

export interface PreparationDropdownProps {
    registry:
        readonly PreparationModuleDefinition[];

    activeGroups: string[];

    onAddPreparation: (
        preparationId: string
    ) => void;

    disabled?: boolean;
}

const PreparationDropdown: React.FC<
    PreparationDropdownProps
> = ({
    registry,
    activeGroups,
    onAddPreparation,
    disabled = false,
}) => {
    const availablePreparations =
        registry.filter(
            (preparation) =>
                !activeGroups.includes(
                    preparation.id
                )
        );

    if (
        availablePreparations.length ===
        0
    ) {
        return null;
    }

    return (
        <div className="relative inline-block">
            <select
                value=""
                disabled={disabled}
                onChange={(event) => {
                    const preparationId =
                        event.target.value;

                    if (
                        preparationId
                    ) {
                        onAddPreparation(
                            preparationId
                        );
                    }
                }}
                className="appearance-none rounded-lg border border-emerald-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-emerald-800 shadow-sm transition hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="">
                    + Add Preparation
                </option>

                {availablePreparations.map(
                    (preparation) => (
                        <option
                            key={
                                preparation.id
                            }
                            value={
                                preparation.id
                            }
                        >
                            {
                                preparation.title
                            }
                        </option>
                    )
                )}
            </select>

            <Plus className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700" />
        </div>
    );
};

export default PreparationDropdown;