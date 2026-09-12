import {
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";
import { BiTestTube } from "react-icons/bi";
import { ChevronDown} from "lucide-react";

import type { PreparationModuleHandle } from "../../../../../core/preparation/ui/PreparationModuleHandle";
import type { PreparationDraft } from "../../../../../core/preparation/ui/PreparationDraft";

import type { SamplePreparationLod } from "../models/SamplePreparationLod";
import type { SamplePreparationLodStep } from "../models/SamplePreparationLodStep";

import SamplePreparationSection from "../../../../../core/preparation-engine/components/SamplePreparationSection";
import SamplePreparationDetail from "../../../../../core/preparation-engine/components/SamplePreparationDetail";
import FileAttachmentSection from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import CalculationSection from "../../../../../core/preparation-engine/components/CalculationSection";
import EmptyCalculation from "../../../../../core/preparation-engine/components/EmptyCalculation";
import PreparationCompleteModal from "../../../../../core/preparation-engine/components/PreparationCompleteModal";

import { calculateLod } from "../calculation";

import PreparationCompleteSection from "../../../../../core/preparation-engine/components/PreparationCompleteSection";

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

const createDefaultPreparation = (id: number): SamplePreparationLod => ({
    id,
    label: `Sample Preparation ${id}`,
    steps: [
        {
            name: "Weight of Empty Dish",
            value1: "",
            unit1: "g",
            logBookID: "",
        },
        {
            name: "Weight of Sample + Dish",
            value1: "",
            unit1: "g",
        },
        {
            name: "Drying",
            value1: "",
            unit1: "°C",
            value2: "",
            unit2: "min",
            logBookID: "",
        },
        {
            name: "Weight of Sample + Dish after Drying",
            value1: "",
            unit1: "g",
        },
    ],
});

const isLodCalculationState = (value: unknown): value is LodCalculationState => {
    if (!value || typeof value !== "object") return false;
    const calculation = value as Record<string, unknown>;
    return (
        "w1" in calculation &&
        "w2" in calculation &&
        "w3" in calculation &&
        "result" in calculation &&
        "unit" in calculation
    );
};

const StepUnitSelect = ({
    value,
    options,
    disabled,
    onChange,
}: {
    value: string;
    options: string[];
    disabled: boolean;
    onChange: (value: string) => void;
}) => (
    <div className="relative shrink-0">
        <select
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            className="h-8 min-w-[78px] appearance-none rounded-lg border border-emerald-300 bg-white px-3 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700" />
    </div>
);

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
        const [samplePreparations, setSamplePreparations] = useState<SamplePreparationLod[]>([]);
        const [files, setFiles] = useState<unknown[]>([]);
        const [calculation, setCalculation] = useState<LodCalculationState | null>(null);
        const [completed, setCompleted] = useState(false);
        const [completedAt, setCompletedAt] = useState<string | null>(null);
        const [showCompleteModal, setShowCompleteModal] = useState(false);

        const addPreparation = () => {
            if (isLocked) return;
            setSamplePreparations((current) => [
                ...current,
                createDefaultPreparation(current.length + 1),
            ]);
        };

        const removePreparation = (index: number) => {
            if (isLocked) return;
            setSamplePreparations((current) =>
                current
                    .filter((_, currentIndex) => currentIndex !== index)
                    .map((preparation, currentIndex) => ({
                        ...preparation,
                        id: currentIndex + 1,
                        label: `Sample Preparation ${currentIndex + 1}`,
                    }))
            );
        };

        const updateStep = (
            preparationIndex: number,
            stepIndex: number,
            field: keyof SamplePreparationLodStep,
            value: string
        ) => {
            if (isLocked) return;
            setSamplePreparations((current) =>
                current.map((preparation, currentPreparationIndex) =>
                    currentPreparationIndex !== preparationIndex
                        ? preparation
                        : {
                              ...preparation,
                              steps: preparation.steps.map((step, currentStepIndex) =>
                                  currentStepIndex !== stepIndex
                                      ? step
                                      : { ...step, [field]: value }
                              ),
                          }
                )
            );
        };

        const calculate = () => {
            if (samplePreparations.length === 0) return;

            const steps = samplePreparations[0].steps;
            const findStep = (name: string) =>
                steps.find(
                    (step) => step.name.trim().toLowerCase() === name.trim().toLowerCase()
                );

            const w1Step = findStep("Weight of Empty Dish");
            const w2Step = findStep("Weight of Sample + Dish");
            const w3Step = findStep("Weight of Sample + Dish after Drying");

            if (!w1Step?.value1 || !w2Step?.value1 || !w3Step?.value1) {
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

        const openCompleteModal = () => {
            if (isLocked || samplePreparations.length === 0) return;
            setShowCompleteModal(true);
        };

        const completePreparation = () => {
            if (isLocked || samplePreparations.length === 0) return;
            const now = new Date().toISOString();
            setCompleted(true);
            setCompletedAt(now);
            setShowCompleteModal(false);
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
                    if (!lodValue || typeof lodValue !== "object") return;
                    const lod = lodValue as Partial<LodModuleData>;
                    setSamplePreparations(
                        Array.isArray(lod.samplePreparations) ? lod.samplePreparations : []
                    );
                    setFiles(Array.isArray(lod.files) ? lod.files : []);
                    setCalculation(
                        isLodCalculationState(lod.calculation) ? lod.calculation : null
                    );
                    setCompleted(Boolean(lod.completed));
                    setCompletedAt(
                        typeof lod.completedAt === "string" ? lod.completedAt : null
                    );
                },
                restoreFromWorksheet: async () => {
                    // Existing worksheet restoration will be connected separately.
                },
            }),
            [samplePreparations, files, calculation, completed, completedAt]
        );

        return (
            <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/30 to-white pb-6 shadow-2xl">
                <div className="bg-gradient-to-r from-white via-white to-emerald-50 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-lg">
                                <BiTestTube className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-emerald-900">LOD Analysis</h2>
                                <p className="text-sm text-emerald-600">LOD • Sample &amp; Calculations</p>
                            </div>
                        </div>
                        <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
                            {samplePreparations.length} Items
                        </div>
                    </div>
                </div>

                <SamplePreparationSection<SamplePreparationLod>
                    title="Sample Preparations for LOD"
                    preparations={samplePreparations}
                    isLocked={isLocked}
                    onAddPreparation={addPreparation}
                    onRemovePreparation={(_, index) => removePreparation(index)}
                    renderPreparation={(preparation, index) => (
                        <SamplePreparationDetail<SamplePreparationLod, SamplePreparationLodStep>
                            preparation={preparation}
                            preparationIndex={index}
                            isLocked={isLocked}
                            onRemove={() => removePreparation(index)}
                            renderStep={(step, stepIndex, locked) => {
                                const stepName = step.name.trim().toLowerCase();
                                const isDrying = stepName === "drying";
                                const isW1 = stepName === "weight of empty dish";
                                const isW2 = stepName === "weight of sample + dish";
                                const isW3 = stepName === "weight of sample + dish after drying";

                                const update = (field: keyof SamplePreparationLodStep, value: string) =>
                                    updateStep(index, stepIndex, field, value);

                                if (isDrying) {
                                    return (
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 lg:flex-nowrap">
                                            <span className="shrink-0 font-medium text-slate-600">Drying</span>
                                            <input
                                                type="text"
                                                value={step.value1 ?? ""}
                                                disabled={locked}
                                                placeholder="Enter Temp"
                                                onChange={(event) => update("value1", event.target.value)}
                                                className="h-8 w-[122px] rounded-lg border border-emerald-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                                            />
                                            <StepUnitSelect
                                                value={step.unit1 || "°C"}
                                                options={["°C", "°F"]}
                                                disabled={locked}
                                                onChange={(value) => update("unit1", value)}
                                            />
                                            <span className="shrink-0 font-medium text-slate-600">for</span>
                                            <input
                                                type="text"
                                                value={step.value2 ?? ""}
                                                disabled={locked}
                                                placeholder="Enter Time"
                                                onChange={(event) => update("value2", event.target.value)}
                                                className="h-8 w-[122px] rounded-lg border border-emerald-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                                            />
                                            <StepUnitSelect
                                                value={step.unit2 || "min"}
                                                options={["min", "sec", "hr"]}
                                                disabled={locked}
                                                onChange={(value) => update("unit2", value)}
                                            />
                                            <span className="shrink-0 font-medium text-slate-500">(Log ID:</span>
                                            <input
                                                type="text"
                                                value={step.logBookID ?? ""}
                                                disabled={locked}
                                                placeholder="Enter ID"
                                                onChange={(event) => update("logBookID", event.target.value)}
                                                className="h-8 w-[98px] rounded-lg border border-emerald-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                                            />
                                            <span className="shrink-0 font-medium text-slate-500">)</span>
                                        </div>
                                    );
                                }

                                const label = isW1
                                    ? "Weight of Empty Dish"
                                    : isW2
                                      ? "Weight of Sample + Dish"
                                      : isW3
                                        ? "Weight of Sample + Dish after Drying"
                                        : step.name;
                                const marker = isW1 ? "(W1)" : isW2 ? "(W2)" : isW3 ? "(W3)" : "";

                                return (
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 lg:flex-nowrap">
                                        <span className="shrink-0 font-medium text-slate-600">{label}</span>
                                        <input
                                            type="text"
                                            value={step.value1 ?? ""}
                                            disabled={locked}
                                            placeholder="Enter Weight"
                                            onChange={(event) => update("value1", event.target.value)}
                                            className="h-8 w-[120px] rounded-lg border border-emerald-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                                        />
                                        <StepUnitSelect
                                            value={step.unit1 || "g"}
                                            options={["g", "kg", "mg"]}
                                            disabled={locked}
                                            onChange={(value) => update("unit1", value)}
                                        />
                                        <span className="shrink-0 font-medium text-slate-500">{marker}</span>
                                        {isW1 && (
                                            <>
                                                <span className="shrink-0 font-medium text-slate-500">(Log ID:</span>
                                                <input
                                                    type="text"
                                                    value={step.logBookID ?? ""}
                                                    disabled={locked}
                                                    placeholder="Enter ID"
                                                    onChange={(event) => update("logBookID", event.target.value)}
                                                    className="h-8 w-[98px] rounded-lg border border-emerald-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                                                />
                                                <span className="shrink-0 font-medium text-slate-500">)</span>
                                            </>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    )}
                />

                {samplePreparations.length > 0 && (
                    <>

                        <div className="mx-6">
                            <FileAttachmentSection
                            files={files.filter(
                                (file): file is {
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
                            accept="application/pdf,.pdf"
                            title="Attach Weight Print Sheets (PDF)"
                            description=""
                            maxFiles={10}
                            onAttachFiles={(selectedFiles) => {
                                setFiles((current) => [
                                    ...current,
                                    ...selectedFiles.slice(0, Math.max(0, 10 - current.length)).map(
                                        (file, fileIndex) => ({
                                            id: `${Date.now()}-${fileIndex}`,
                                            name: file.name,
                                            size: file.size,
                                            type: file.type,
                                        })
                                    ),
                                ]);
                            }}
                            onRemoveFile={(_, fileIndex) => {
                                setFiles((current) =>
                                    current.filter((__, currentIndex) => currentIndex !== fileIndex)
                                );
                            }}
                        />
                            
                        </div>

                        <div className="mx-6 mt-6">
                             <PreparationCompleteSection
                            preparationName="Loss on Drying"
                            isCompleted={completed}
                            isLocked={isLocked}
                            completedBy={null}
                            completedAt={completedAt}
                            onComplete={openCompleteModal}
                            onUnlock={unlockPreparation}
                        />

                        
                        </div>
                        
{completed && (

                            <div className="mx-6 mt-6">
                                <CalculationSection
                                title="Loss on Drying Calculation"
                                description="Calculate the Loss on Drying result using the recorded weights."
                                isLocked={isLocked}
                                hasCalculation={calculation !== null}
                                onCalculate={calculate}
                            >
                                {calculation ? (
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                                        <div className="grid gap-4 md:grid-cols-4">
                                            <div><span className="text-xs text-emerald-600">W1</span><p className="font-semibold text-emerald-900">{calculation.w1}</p></div>
                                            <div><span className="text-xs text-emerald-600">W2</span><p className="font-semibold text-emerald-900">{calculation.w2}</p></div>
                                            <div><span className="text-xs text-emerald-600">W3</span><p className="font-semibold text-emerald-900">{calculation.w3}</p></div>
                                            <div><span className="text-xs text-emerald-600">Result</span><p className="text-xl font-bold text-emerald-900">{calculation.result} {calculation.unit}</p></div>
                                        </div>
                                    </div>
                                ) : (
                                    <EmptyCalculation />
                                )}
                            </CalculationSection>
                            </div>
                            
                        )}
                       

                        <PreparationCompleteModal
                            isOpen={showCompleteModal}
                            preparationName="Loss on Drying"
                            parameterName={parameterName}
                            parameterCode={parameterCode}
                            onConfirm={completePreparation}
                            onCancel={() => setShowCompleteModal(false)}
                        />
                    </>
                )}
            </div>
        );
    }
);

LodPreparationModule.displayName = "LodPreparationModule";

export default LodPreparationModule;
