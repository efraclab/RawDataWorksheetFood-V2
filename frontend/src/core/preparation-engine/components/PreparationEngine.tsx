import  {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import PreparationHeader from "./PreparationHeader";
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

    /**
     * Lock coming from the worksheet/parameter workflow.
     *
     * IMPORTANT:
     * This value alone must NOT prevent a Reviewer from working
     * when the parameter is in the normal CREATED state.
     */
    isLocked: boolean;

    /**
     * V1 business rule:
     *
     * Reviewer + CREATED parameter
     *     => Preparation can be unlocked/edited.
     *
     * Analyst + Analysis Revision Started
     *     => Preparation can be unlocked/edited.
     */
    canUnlockPreparation: boolean;

    /**
     * Controls calculation editing.
     */
    canEditCalculations?: boolean;

    onLockPreparation: (
        parameterId: number
    ) => void;

    onUnlockPreparation: (
        parameterId: number
    ) => void;
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
            canUnlockPreparation,
            canEditCalculations = false,
            onLockPreparation,
            onUnlockPreparation,
        },
        ref
    ) => {
        const [activeGroups, setActiveGroups] =
            useState<string[]>([]);

        const [expandedGroups, setExpandedGroups] =
            useState<string[]>([]);

        const [showMenu, setShowMenu] =
            useState(false);

        const moduleRefs =
            useRef<
                Record<
                    string,
                    PreparationModuleHandle | null
                >
            >({});

        const pendingDraftRef =
            useRef<PreparationDraft | null>(null);

        /**
         * ============================================================
         * EFFECTIVE PREPARATION LOCK
         * ============================================================
         *
         * VERY IMPORTANT:
         *
         * `isLocked` may be true because of a stale/local preparation
         * lock state while the V1 workflow explicitly allows the
         * Reviewer to unlock a CREATED parameter.
         *
         * Therefore:
         *
         *      canUnlockPreparation === true
         *
         * overrides the visual/action lock of the Preparation section.
         *
         * This preserves:
         *
         * Reviewer + CREATED
         *      => editable
         *
         * Analyst + Analysis Revision Started
         *      => editable
         */
        const effectiveIsLocked =
            isLocked && !canUnlockPreparation;

        useEffect(() => {
            if (effectiveIsLocked) {
                setShowMenu(false);
            }
        }, [effectiveIsLocked]);

        /**
         * ============================================================
         * ADD PREPARATION
         * ============================================================
         */
        const addPreparation = (
            preparationId: string
        ) => {
            if (effectiveIsLocked) {
                return;
            }

            setActiveGroups((current) => {
                if (current.includes(preparationId)) {
                    return current;
                }

                return [
                    ...current,
                    preparationId,
                ];
            });

            setExpandedGroups((current) => {
                if (current.includes(preparationId)) {
                    return current;
                }

                return [
                    ...current,
                    preparationId,
                ];
            });
        };

        /**
         * ============================================================
         * REMOVE PREPARATION
         * ============================================================
         */
        const removePreparation = (
            preparationId: string
        ) => {
            if (effectiveIsLocked) {
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

        /**
         * ============================================================
         * EXPAND / COLLAPSE
         * ============================================================
         */
        const togglePreparation = (
            preparationId: string
        ) => {
            setExpandedGroups((current) =>
                current.includes(preparationId)
                    ? current.filter(
                        (id) =>
                            id !== preparationId
                    )
                    : [
                        ...current,
                        preparationId,
                    ]
            );
        };

        /**
         * ============================================================
         * LOAD DRAFT
         * ============================================================
         *
         * Module refs are not necessarily available immediately after
         * activeGroups changes.
         *
         * Therefore the draft is stored temporarily and applied after
         * the modules have mounted.
         */
        const loadDraft = (
            draft: PreparationDraft
        ) => {
            if (!draft) {
                return;
            }

            const groups =
                Array.isArray(
                    draft.activeGroups
                )
                    ? draft.activeGroups
                    : [];

            pendingDraftRef.current = draft;

            setActiveGroups(groups);
            setExpandedGroups(groups);
        };

        /**
         * ============================================================
         * RESTORE DRAFT AFTER MODULE MOUNT
         * ============================================================
         */
        useEffect(() => {
            const draft =
                pendingDraftRef.current;

            if (!draft) {
                return;
            }

            let allModulesMounted = true;

            for (const groupId of draft.activeGroups) {
                const module =
                    moduleRefs.current[groupId];

                if (!module) {
                    allModulesMounted = false;
                    break;
                }
            }

            if (!allModulesMounted) {
                return;
            }

            for (const groupId of draft.activeGroups) {
                const module =
                    moduleRefs.current[groupId];

                const moduleDraft =
                    draft.modules?.[groupId];

                if (
                    module &&
                    moduleDraft !== undefined
                ) {
                    module.loadDraft(
                        moduleDraft
                    );
                }
            }

            pendingDraftRef.current = null;
        }, [activeGroups]);

        /**
         * ============================================================
         * IMPERATIVE HANDLE
         * ============================================================
         */
        useImperativeHandle(
            ref,
            () => ({
                collectDraft: () => {
                    const modules: Record<
                        string,
                        unknown
                    > = {};

                    for (
                        const groupId
                        of activeGroups
                    ) {
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

                    return {
                        activeGroups: [
                            ...activeGroups,
                        ],
                        modules,
                    };
                },

                loadDraft,

                restoreFromWorksheet:
                    async (
                        worksheet: unknown
                    ) => {
                        for (
                            const groupId
                            of activeGroups
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
            [activeGroups]
        );

        /**
         * ============================================================
         * RENDER
         * ============================================================
         */
        return (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm ">

                {/* ==================================================
                    HEADER
                ================================================== */}
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <PreparationHeader />

                    <div className="relative">
                        <button
                            type="button"
                            disabled={
                                effectiveIsLocked
                            }
                            onClick={() => {
                                if (effectiveIsLocked) {
                                    return;
                                }

                                setShowMenu((current) => !current);
                            }}
                            className="
                                inline-flex
                                items-center
                                gap-2
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
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <span>+ Add Preparation</span>

                            <svg
                                className={`h-4 w-4 transition-transform duration-200 ${
                                    showMenu ? "rotate-180" : ""
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {showMenu && !effectiveIsLocked && (
                            <div
                                className="
                                    absolute
                                    right-0
                                    top-full
                                    z-50
                                    mt-2
                                    w-72
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-emerald-200
                                    bg-white
                                    shadow-2xl
                                "
                            >
                                <div className="max-h-80 overflow-y-auto">
                                    {registry
                                        .filter(
                                            (definition) =>
                                                !activeGroups.includes(
                                                    definition.id
                                                )
                                        )
                                        .map((definition) => (
                                            <button
                                                key={definition.id}
                                                type="button"
                                                onClick={() => {
                                                    addPreparation(
                                                        definition.id
                                                    );
                                                    setShowMenu(false);
                                                }}
                                                className="
                                                    block
                                                    w-full
                                                    border-b
                                                    border-emerald-100
                                                    px-4
                                                    py-3
                                                    text-left
                                                    text-sm
                                                    font-medium
                                                    text-gray-800
                                                    transition-colors
                                                    duration-150
                                                    last:border-b-0
                                                    hover:bg-emerald-50
                                                "
                                            >
                                                {definition.title}
                                            </button>
                                        ))}

                                    {registry.filter(
                                        (definition) =>
                                            !activeGroups.includes(
                                                definition.id
                                            )
                                    ).length === 0 && (
                                        <div className="px-4 py-5 text-center text-sm text-gray-500">
                                            No preparations available
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================================================
                    ACTIVE PREPARATION GROUPS
                ================================================== */}
                {activeGroups.length === 0 ? (
                    <div
                        className="
                            min-h-[230px]
                            rounded-2xl
                            border-2
                            border-dashed
                            border-gray-300
                            bg-white
                            px-6
                            py-10
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                        "
                    >
                        <div
                            className="
                                mb-5
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-gray-100
                                text-gray-300
                            "
                            aria-hidden="true"
                        >
                            <svg
                                className="h-9 w-9"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="8" />
                                <circle cx="12" cy="12" r="4" />
                                <circle cx="12" cy="12" r="1.5" />
                            </svg>
                        </div>

                        <h3
                            className="
                                text-base
                                font-bold
                                text-gray-900
                            "
                        >
                            No preparation groups configured yet
                        </h3>

                        <p
                            className="
                                mt-2
                                max-w-xl
                                text-sm
                                leading-6
                                text-gray-500
                            "
                        >
                            Click the{" "}
                            <span className="font-semibold text-emerald-700">
                                "Add Preparation"
                            </span>{" "}
                            button above to select preparation groups
                            <br />
                            for this parameter
                        </p>
                    </div>
                ) : (
                    <ActivePreparationGroups
                        registry={registry}
                        activeGroups={
                            activeGroups
                        }
                        onRemovePreparation={
                            removePreparation
                        }
                        onTogglePreparation={
                            togglePreparation
                        }
                        expandedGroups={
                            expandedGroups
                        }
                        isLocked={
                            effectiveIsLocked
                        }
                    />
                )}

                {/* ==================================================
                    MODULE CONTENT
                ================================================== */}
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
                    isLocked={
                        effectiveIsLocked
                    }
                    canUnlockPreparation={
                        canUnlockPreparation
                    }
                    canEditCalculations={
                        canEditCalculations
                    }
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