import {
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";

import type { PreparationModuleHandle } from "../../../../../core/preparation/ui/PreparationModuleHandle";
import type { PreparationDraft } from "../../../../../core/preparation/ui/PreparationDraft";

import type { SamplePreparationLod } from "../models/SamplePreparationLod";
import type { SamplePreparationLodStep } from "../models/SamplePreparationLodStep";

import SamplePreparationSection from "../../../../../core/preparation-engine/components/SamplePreparationSection";
import SamplePreparationDetail from "../../../../../core/preparation-engine/components/SamplePreparationDetail";
import FileAttachmentSection from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import CalculationSection from "../../../../../core/preparation-engine/components/CalculationSection";
import EmptyCalculation from "../../../../../core/preparation-engine/components/EmptyCalculation";
import PreparationCompleteSection from "../../../../../core/preparation-engine/components/PreparationCompleteSection";

import { calculateLod } from "../calculation";

export interface LodPreparationModuleProps {
    preparationId: string;
    parameterId: number;
    parameterName?: string | null;
    parameterCode?: string | null;
    role: string;
    isLocked: boolean;

    onLockPreparation: (parameterId: number) => void;
    onUnlockPreparation: (parameterId: number) => void;
}

interface LodCalculationState {
    w1: string | null;
    w2: string | null;
    w3: string | null;
    result: string | null;
    unit: string | null;
}

interface LodModuleData {
    samplePreparations: SamplePreparationLod[];
    files: unknown[];
    calculation: LodCalculationState | null;
    completed: boolean;
    completedAt: string | null;
}

interface LodModuleDraft extends PreparationDraft {
    modules: Record<string, unknown>;
}

const createDefaultPreparation = (
    id: number
): SamplePreparationLod => ({
    id,
    label: `Sample Preparation ${id}`,
    steps: [
        {
            name: "Weight of Empty Dish",
            value1: "",
            unit1: "g",
        },
        {
            name: "Weight of Sample + Dish",
            value1: "",
            unit1: "g",
        },
        {
            name: "Drying",
            value1: "",
            unit1: "min",
            value2: "",
            unit2: "°C",
        },
        {
            name: "Weight of Sample + Dish after Drying",
            value1: "",
            unit1: "g",
        },
    ],
});

const isLodCalculationState = (
    value: unknown
): value is LodCalculationState => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const calculation = value as Record<string, unknown>;

    return (
        ("w1" in calculation) &&
        ("w2" in calculation) &&
        ("w3" in calculation) &&
        ("result" in calculation) &&
        ("unit" in calculation)
    );
};

const LodPreparationModule = forwardRef<
    PreparationModuleHandle<LodModuleDraft, unknown>,
    LodPreparationModuleProps
>(
    (
        {
            parameterId,
            parameterName,
            parameterCode,
            isLocked,
            onLockPreparation,
            onUnlockPreparation,
        },
        ref
    ) => {
        const [samplePreparations, setSamplePreparations] =
            useState<SamplePreparationLod[]>([]);

        const [files, setFiles] = useState<unknown[]>([]);

        const [calculation, setCalculation] =
            useState<LodCalculationState | null>(null);

        const [completed, setCompleted] = useState(false);

        const [completedAt, setCompletedAt] =
            useState<string | null>(null);

        const addPreparation = () => {
            if (isLocked) {
                return;
            }

            setSamplePreparations((current) => [
                ...current,
                createDefaultPreparation(current.length + 1),
            ]);
        };

        const removePreparation = (index: number) => {
            if (isLocked) {
                return;
            }

            setSamplePreparations((current) =>
                current
                    .filter(
                        (_, currentIndex) =>
                            currentIndex !== index
                    )
                    .map((preparation, currentIndex) => ({
                        ...preparation,
                        id: currentIndex + 1,
                        label: `Sample Preparation ${
                            currentIndex + 1
                        }`,
                    }))
            );
        };

        const addStep = (preparationIndex: number) => {
            if (isLocked) {
                return;
            }

            setSamplePreparations((current) =>
                current.map((preparation, index) =>
                    index === preparationIndex
                        ? {
                              ...preparation,
                              steps: [
                                  ...preparation.steps,
                                  {
                                      name: `Step ${
                                          preparation.steps.length + 1
                                      }`,
                                      value1: "",
                                      unit1: "",
                                  },
                              ],
                          }
                        : preparation
                )
            );
        };

        const removeStep = (
            preparationIndex: number,
            stepIndex: number
        ) => {
            if (isLocked) {
                return;
            }

            setSamplePreparations((current) =>
                current.map((preparation, index) =>
                    index === preparationIndex
                        ? {
                              ...preparation,
                              steps: preparation.steps.filter(
                                  (_, currentStepIndex) =>
                                      currentStepIndex !== stepIndex
                              ),
                          }
                        : preparation
                )
            );
        };

        const updateStep = (
            preparationIndex: number,
            stepIndex: number,
            field: keyof SamplePreparationLodStep,
            value: string
        ) => {
            if (isLocked) {
                return;
            }

            setSamplePreparations((current) =>
                current.map((preparation, currentPreparationIndex) =>
                    currentPreparationIndex !== preparationIndex
                        ? preparation
                        : {
                              ...preparation,
                              steps: preparation.steps.map(
                                  (step, currentStepIndex) =>
                                      currentStepIndex !== stepIndex
                                          ? step
                                          : {
                                                ...step,
                                                [field]: value,
                                            }
                              ),
                          }
                )
            );
        };

        const calculate = () => {
            if (samplePreparations.length === 0) {
                return;
            }

            const steps = samplePreparations[0].steps;

            const findStep = (name: string) =>
                steps.find(
                    (step) =>
                        step.name.trim().toLowerCase() ===
                        name.trim().toLowerCase()
                );

            const w1Step = findStep(
                "Weight of Empty Dish"
            );

            const w2Step = findStep(
                "Weight of Sample + Dish"
            );

            const w3Step = findStep(
                "Weight of Sample + Dish after Drying"
            );

            if (
                !w1Step?.value1 ||
                !w2Step?.value1 ||
                !w3Step?.value1
            ) {
                setCalculation(null);
                return;
            }

            const result = calculateLod({
                w1: w1Step.value1,
                w2: w2Step.value1,
                w3: w3Step.value1,
                w1Unit: w1Step.unit1 || "g",
                w2Unit: w2Step.unit1 || "g",
                w3Unit: w3Step.unit1 || "g",
            });

            if (!result.success) {
                setCalculation(null);
                return;
            }

            setCalculation({
                w1: result.w1,
                w2: result.w2,
                w3: result.w3,
                result: result.result,
                unit: result.unit,
            });
        };

        const completePreparation = () => {
            if (isLocked) {
                return;
            }

            setCompleted(true);

            const now = new Date().toISOString();

            setCompletedAt(now);

            onLockPreparation(parameterId);
        };

        const unlockPreparation = () => {
            setCompleted(false);
            onUnlockPreparation(parameterId);
        };

        useImperativeHandle(
            ref,
            () => ({
                getDraft: () => ({
                    activeGroups: ["food.lod"],
                    modules: {
                        lod: {
                            samplePreparations,
                            files,
                            calculation,
                            completed,
                            completedAt,
                        } satisfies LodModuleData,
                    },
                }),

                loadDraft: (draft) => {
                    const lodValue = draft?.modules?.lod;

                    if (
                        !lodValue ||
                        typeof lodValue !== "object"
                    ) {
                        return;
                    }

                    const lod =
                        lodValue as Partial<LodModuleData>;

                    setSamplePreparations(
                        Array.isArray(
                            lod.samplePreparations
                        )
                            ? lod.samplePreparations
                            : []
                    );

                    setFiles(
                        Array.isArray(lod.files)
                            ? lod.files
                            : []
                    );

                    setCalculation(
                        isLodCalculationState(
                            lod.calculation
                        )
                            ? lod.calculation
                            : null
                    );

                    setCompleted(
                        Boolean(lod.completed)
                    );

                    setCompletedAt(
                        typeof lod.completedAt === "string"
                            ? lod.completedAt
                            : null
                    );
                },

                restoreFromWorksheet: async () => {
                    // Worksheet restoration will be connected
                    // to the existing V1 worksheet data.
                },
            }),
            [
                samplePreparations,
                files,
                calculation,
                completed,
                completedAt,
            ]
        );

        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-emerald-900">
                        {parameterName ||
                            "Loss on Drying"}
                    </h3>

                    {parameterCode && (
                        <p className="mt-1 text-sm text-emerald-600">
                            Parameter: {parameterCode}
                        </p>
                    )}
                </div>

                <SamplePreparationSection<
                    SamplePreparationLod
                >
                    title="Sample Preparations"
                    preparations={samplePreparations}
                    isLocked={isLocked}
                    onAddPreparation={addPreparation}
                    onRemovePreparation={
                        (preparation, index) => {
                            void preparation;
                            removePreparation(index);
                        }
                    }
                    renderPreparation={(
                        preparation,
                        index
                    ) => (
                        <SamplePreparationDetail<
                            SamplePreparationLod,
                            SamplePreparationLodStep
                        >
                            preparation={preparation}
                            preparationIndex={index}
                            isLocked={isLocked}
                            onRemove={() =>
                                removePreparation(index)
                            }
                            onAddStep={() =>
                                addStep(index)
                            }
                            onRemoveStep={(
                                _step,
                                stepIndex
                            ) =>
                                removeStep(
                                    index,
                                    stepIndex
                                )
                            }
                            renderStep={(
                                step,
                                stepIndex,
                                locked
                            ) => (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Value
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                step.value1 ??
                                                ""
                                            }
                                            disabled={
                                                locked
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateStep(
                                                    index,
                                                    stepIndex,
                                                    "value1",
                                                    event.target
                                                        .value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Unit
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                step.unit1 ??
                                                ""
                                            }
                                            disabled={
                                                locked
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateStep(
                                                    index,
                                                    stepIndex,
                                                    "unit1",
                                                    event.target
                                                        .value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            )}
                        />
                    )}
                />

                <FileAttachmentSection
                    files={files
                        .filter(
                            (
                                file
                            ): file is {
                                id: string | number;
                                name: string;
                                size?: number;
                                type?: string;
                                url?: string;
                            } =>
                                !!file &&
                                typeof file === "object" &&
                                "id" in file &&
                                "name" in file
                        )}
                    isLocked={isLocked}
                    onAttachFiles={(selectedFiles) => {
                        setFiles((current) => [
                            ...current,
                            ...selectedFiles.map(
                                (file, index) => ({
                                    id: `${Date.now()}-${index}`,
                                    name: file.name,
                                    size: file.size,
                                    type: file.type,
                                })
                            ),
                        ]);
                    }}
                    onRemoveFile={(_, index) => {
                        setFiles((current) =>
                            current.filter(
                                (_, currentIndex) =>
                                    currentIndex !==
                                    index
                            )
                        );
                    }}
                />

                <CalculationSection
                    title="Loss on Drying Calculation"
                    description="Calculate the Loss on Drying result using the recorded weights."
                    isLocked={isLocked}
                    hasCalculation={
                        calculation !== null
                    }
                    onCalculate={calculate}
                >
                    {calculation ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div>
                                    <span className="text-xs text-emerald-600">
                                        W1
                                    </span>

                                    <p className="font-semibold text-emerald-900">
                                        {calculation.w1}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-xs text-emerald-600">
                                        W2
                                    </span>

                                    <p className="font-semibold text-emerald-900">
                                        {calculation.w2}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-xs text-emerald-600">
                                        W3
                                    </span>

                                    <p className="font-semibold text-emerald-900">
                                        {calculation.w3}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-xs text-emerald-600">
                                        Result
                                    </span>

                                    <p className="text-xl font-bold text-emerald-900">
                                        {calculation.result}{" "}
                                        {calculation.unit}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <EmptyCalculation />
                    )}
                </CalculationSection>

                <PreparationCompleteSection
                    preparationName="Loss on Drying"
                    isCompleted={completed}
                    isLocked={isLocked}
                    completedBy={null}
                    completedAt={completedAt}
                    onComplete={
                        completePreparation
                    }
                    onUnlock={
                        unlockPreparation
                    }
                />
            </div>
        );
    }
);

LodPreparationModule.displayName =
    "LodPreparationModule";

export default LodPreparationModule;