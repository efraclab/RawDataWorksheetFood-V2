import  {
    forwardRef,
    useEffect,
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

    /** Worksheet/parameter data used to restore module state. */
    worksheet?: unknown;
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
            worksheet,
        },
        ref
    ) => {
        const [activeGroups, setActiveGroups] =
            useState<string[]>([]);

        const [expandedGroups, setExpandedGroups] =
            useState<string[]>([]);

        useEffect(() => {
            if (!worksheet || activeGroups.length > 0) return;
            const parameter = worksheet as any;
            const hasLod = Array.isArray(parameter?.preparations) &&
                parameter.preparations.some((x: any) =>
                    String(x?.preparationType ?? "").toLowerCase() === "lod" &&
                    x?.preparationCategory === "sample"
                );
            const hasLodCalculation = Array.isArray(parameter?.calculations) &&
                parameter.calculations.some((x: any) => String(x?.calculationType ?? "").toLowerCase() === "lod");
            if (hasLod || hasLodCalculation) {
                setActiveGroups(["food.lod"]);
                setExpandedGroups(["food.lod"]);
            }
        }, [worksheet, activeGroups.length]);

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
        // A completed preparation is genuinely locked for editing.
        // `canUnlockPreparation` only controls the separate Unlock action;
        // it must NOT re-enable Add/Remove/Lock controls while the
        // preparation is completed.
        const effectiveIsLocked = isLocked;

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

        useEffect(() => {
            if (worksheet === undefined) return;
            let cancelled = false;
            const restore = async () => {
                // Wait until active module refs exist.
                for (const groupId of activeGroups) {
                    const module = moduleRefs.current[groupId];
                    if (!module) return;
                }
                for (const groupId of activeGroups) {
                    if (cancelled) return;
                    const module = moduleRefs.current[groupId];
                    if (module?.restoreFromWorksheet) {
                        await module.restoreFromWorksheet(worksheet);
                    }
                }
            };
            void restore();
            return () => { cancelled = true; };
        }, [activeGroups, worksheet]);

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
            <div
                className="
                    mb-8
                    p-6
                    bg-gradient-to-br
                    from-emerald-50
                    via-emerald-50
                    to-emerald-50
                    border
                    border-emerald-200
                    rounded-2xl
                    shadow-2xl
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-6
                    "
                >
                    <PreparationHeader />

                    <div className="relative">
                        <button
                            type="button"
                            disabled={effectiveIsLocked}
                            onClick={() => {
                                if (effectiveIsLocked) return;
                                setShowMenu((value) => !value);
                            }}
                            className="
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                px-6
                                py-3
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                rounded-xl
                                font-semibold
                                shadow-lg
                                transition-all
                                duration-200
                            "
                        >
                            + Add Preparation
                        </button>

                        <PreparationDropdown
                            open={showMenu}
                            groups={registry}
                            activeGroups={activeGroups}
                            onSelect={(groupId) => {
                                addPreparation(groupId);
                                setShowMenu(false);
                            }}
                        />
                    </div>
                </div>

                <ActivePreparationGroups
                    registry={registry}
                    activeGroups={activeGroups}
                    onRemovePreparation={removePreparation}
                    onTogglePreparation={togglePreparation}
                    expandedGroups={expandedGroups}
                    isLocked={effectiveIsLocked}
                />

                <ModuleRenderer
                    registry={registry}
                    activeGroups={expandedGroups}
                    parameterId={parameterId}
                    parameterName={parameterName}
                    parameterCode={parameterCode}
                    role={role}
                    isLocked={effectiveIsLocked}
                    canUnlockPreparation={canUnlockPreparation}
                    canEditCalculations={canEditCalculations}
                    onLockPreparation={onLockPreparation}
                    onUnlockPreparation={onUnlockPreparation}
                    moduleRefs={moduleRefs}
                />
            </div>
        );
    }
);

PreparationEngine.displayName =
    "PreparationEngine";

export default PreparationEngine;