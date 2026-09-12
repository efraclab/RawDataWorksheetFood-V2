import React from "react";

import {
    ChevronDown,
    ChevronUp,
    Trash2,
} from "lucide-react";

import type {
    PreparationModuleDefinition,
} from "../../preparation/ui/PreparationModuleDefinition";

export interface ActivePreparationGroupsProps {
    registry:
        readonly PreparationModuleDefinition[];

    activeGroups: string[];

    onRemovePreparation: (
        preparationId: string
    ) => void;

    onTogglePreparation: (
        preparationId: string
    ) => void;

    expandedGroups: string[];

    isLocked?: boolean;
}

const ActivePreparationGroups: React.FC<
    ActivePreparationGroupsProps
> = ({
    registry,
    activeGroups,
    onRemovePreparation,
    onTogglePreparation,
    expandedGroups,
    isLocked = false,
}) => {
    if (activeGroups.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 space-y-3">
            {activeGroups.map(
                (groupId) => {
                    const definition =
                        registry.find(
                            (module) =>
                                module.id ===
                                groupId
                        );

                    if (!definition) {
                        return null;
                    }

                    const isExpanded =
                        expandedGroups.includes(
                            groupId
                        );

                    return (
                        <div
                            key={groupId}
                            className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm"
                        >
                            <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-4 py-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        onTogglePreparation(
                                            groupId
                                        )
                                    }
                                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                >
                                    {isExpanded ? (
                                        <ChevronUp className="h-5 w-5 shrink-0 text-emerald-700" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 shrink-0 text-emerald-700" />
                                    )}

                                    <span className="truncate text-lg font-semibold text-emerald-900">
                                        {
                                            definition.title
                                        }
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemovePreparation(
                                            groupId
                                        )
                                    }
                                    disabled={
                                        isLocked
                                    }
                                    title={
                                        isLocked
                                            ? "Preparation is locked"
                                            : "Remove preparation"
                                    }
                                    className="ml-3 rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default ActivePreparationGroups;