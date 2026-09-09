import  {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import PreparationHeader from "./PreparationHeader";
import PreparationDropdown from "./PreparationDropdown";
import ActivePreparationGroups from "./ActivePreparationGroups";
import ModuleRenderer from "./ModuleRenderer";

import type { PreparationModuleDefinition } from "../../preparation/ui/PreparationModuleDefinition";
import type { PreparationModuleHandle } from "../../preparation/ui/PreparationModuleHandle";
import type { PreparationDraft } from "../../preparation/ui/PreparationDraft";

export interface PreparationEngineHandle {
    collectDraft: () => PreparationDraft;

    loadDraft: (draft: PreparationDraft) => void;

    restoreFromWorksheet: (
        worksheet: unknown
    ) => void | Promise<void>;
}

export interface PreparationEngineProps {
    registry: readonly PreparationModuleDefinition[];

    parameterId: number;

    parameterName?: string | null;

    parameterCode?: string | null;

    role: string;

    isLocked: boolean;

    onLockPreparation: (parameterId: number) => void;

    onUnlockPreparation: (parameterId: number) => void;
}

const PreparationEngine = forwardRef<
    PreparationEngineHandle,
    PreparationEngineProps
>(
    (
        {
            registry,
            parameterId,
            parameterName,
            parameterCode,
            role,
            isLocked,
            onLockPreparation,
            onUnlockPreparation,
        },
        ref
    ) => {
        const [activeGroups, setActiveGroups] =
            useState<string[]>([]);

        const [expandedGroups, setExpandedGroups] =
            useState<string[]>([]);

        const moduleRefs =
            useRef<
                Record<
                    string,
                    PreparationModuleHandle | null
                >
            >({});

        const addPreparation = (
            preparationId: string
        ) => {
            if (
                isLocked ||
                activeGroups.includes(preparationId)
            ) {
                return;
            }

            setActiveGroups((current) => [
                ...current,
                preparationId,
            ]);

            setExpandedGroups((current) => [
                ...current,
                preparationId,
            ]);
        };

        const removePreparation = (
            preparationId: string
        ) => {
            if (isLocked) {
                return;
            }

            setActiveGroups((current) =>
                current.filter(
                    (id) => id !== preparationId
                )
            );

            setExpandedGroups((current) =>
                current.filter(
                    (id) => id !== preparationId
                )
            );

            delete moduleRefs.current[
                preparationId
            ];
        };

        const togglePreparation = (
            preparationId: string
        ) => {
            setExpandedGroups((current) =>
                current.includes(preparationId)
                    ? current.filter(
                          (id) =>
                              id !== preparationId
                      )
                    : [...current, preparationId]
            );
        };

        useImperativeHandle(
            ref,
            () => ({
                collectDraft: () => {
                    const modules: Record<
                        string,
                        unknown
                    > = {};

                    activeGroups.forEach(
                        (groupId) => {
                            const module =
                                moduleRefs.current[
                                    groupId
                                ];

                            if (
                                module &&
                                typeof module.getDraft ===
                                    "function"
                            ) {
                                modules[groupId] =
                                    module.getDraft();
                            }
                        }
                    );

                    return {
                        activeGroups: [
                            ...activeGroups,
                        ],

                        modules,

                        completed: isLocked,

                        completedAt: null,
                    };
                },

                loadDraft: (
                    draft: PreparationDraft
                ) => {
                    const groups =
                        Array.isArray(
                            draft?.activeGroups
                        )
                            ? draft.activeGroups
                            : [];

                    setActiveGroups(groups);

                    setExpandedGroups(groups);

                    setTimeout(() => {
                        groups.forEach(
                            (groupId) => {
                                const module =
                                    moduleRefs.current[
                                        groupId
                                    ];

                                const moduleDraft =
                                    draft.modules?.[
                                        groupId
                                    ];

                                if (
                                    module &&
                                    moduleDraft !==
                                        undefined
                                ) {
                                    module.loadDraft(
                                        moduleDraft
                                    );
                                }
                            }
                        );
                    }, 0);
                },

                restoreFromWorksheet:
                    async (
                        worksheet: unknown
                    ) => {
                        for (
                            const groupId of
                                activeGroups
                        ) {
                            const module =
                                moduleRefs.current[
                                    groupId
                                ];

                            if (
                                module &&
                                typeof module.restoreFromWorksheet ===
                                    "function"
                            ) {
                                await module.restoreFromWorksheet(
                                    worksheet
                                );
                            }
                        }
                    },
            }),
            [
                activeGroups,
                isLocked,
            ]
        );

        return (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <PreparationHeader />

                    <PreparationDropdown
                        registry={registry}
                        activeGroups={activeGroups}
                        onAddPreparation={
                            addPreparation
                        }
                        disabled={isLocked}
                    />
                </div>

                <ActivePreparationGroups
                    registry={registry}
                    activeGroups={activeGroups}
                    onRemovePreparation={
                        removePreparation
                    }
                    onTogglePreparation={
                        togglePreparation
                    }
                    expandedGroups={
                        expandedGroups
                    }
                    isLocked={isLocked}
                />

                <ModuleRenderer
                    registry={registry}
                    activeGroups={
                        expandedGroups
                    }
                    parameterId={
                        parameterId
                    }
                    parameterName={
                        parameterName
                    }
                    parameterCode={
                        parameterCode
                    }
                    role={role}
                    isLocked={isLocked}
                    onLockPreparation={
                        onLockPreparation
                    }
                    onUnlockPreparation={
                        onUnlockPreparation
                    }
                    moduleRefs={
                        moduleRefs
                    }
                />
            </div>
        );
    }
);

PreparationEngine.displayName =
    "PreparationEngine";

export default PreparationEngine;