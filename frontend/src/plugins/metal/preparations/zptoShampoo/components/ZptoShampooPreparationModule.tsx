import { forwardRef, useImperativeHandle, useState } from "react";
import { BiTestTube } from "react-icons/bi";
import { ChevronUp, Trash2, Droplets } from "lucide-react";

import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { PreparationModuleHandle } from "../../../../../core/preparation/ui/PreparationModuleHandle";
import type { PreparationAttachedFile } from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import SamplePreparationSection from "../../../../../core/preparation-engine/components/SamplePreparationSection";
import FileAttachmentSection from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import PreparationCompleteSection from "../../../../../core/preparation-engine/components/PreparationCompleteSection";
import PreparationCompleteModal from "../../../../../core/preparation-engine/components/PreparationCompleteModal";
import UnlockPreparationDialog from "../../../../../core/preparation-engine/components/UnlockPreparationDialog";
import PreparationToast from "../../../../../core/preparation-engine/components/PreparationToast";

import type { CalculationZptoShampoo } from "../models/CalculationZptoShampoo";
import type {
  SamplePreparationZptoShampoo,
  SamplePreparationZptoShampooStep,
} from "../models/SamplePreparationZptoShampoo";
import type {
  ZptoShampooModuleData,
  ZptoShampooModuleDraft,
} from "../models/index";
import {
  createCalculationZptoShampoo,
  createSamplePreparationZptoShampoo,
  restoreCalculationZptoShampoo,
  restoreSamplePreparationZptoShampoo,
} from "../factory";
import ZptoShampooCalculationSection from "./ZptoShampooCalculationSection";

export interface ZptoShampooPreparationModuleProps {
  preparationId: string;
  parameterId: number;
  parameterName?: string | null;
  parameterCode?: string | null;
  role: string;
  isLocked: boolean;
  canUnlockPreparation?: boolean;
  canEditCalculations?: boolean;
  onLockPreparation: (parameterId: number) => void;
  onUnlockPreparation: (parameterId: number) => void;
}

const parseSteps = (value: unknown): SamplePreparationZptoShampooStep[] => {
  if (Array.isArray(value)) return value as SamplePreparationZptoShampooStep[];
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? (parsed as SamplePreparationZptoShampooStep[])
      : [];
  } catch {
    return [];
  }
};

const normalizeCompletedAt = (value: unknown): string | null => {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const getUnitOptions = (name: string): string[] => {
  if (name === "Instrument Concentration (Sample)" || name === "Instrument Concentration (Blank)") return ["ppm", "ppb"];
  if (name === "Sample Weight (SW1)" || name.startsWith("Weight of Pycnometer")) return ["g", "mg", "kg"];
  if (name === "Volume Makeup (V1)") return ["ml", "L", "µl"];
  return [];
};

const getDefaultUnit = (name: string): string => {
  if (name === "Instrument Concentration (Sample)" || name === "Instrument Concentration (Blank)") return "ppm";
  if (name === "Sample Weight (SW1)" || name.startsWith("Weight of Pycnometer")) return "g";
  if (name === "Volume Makeup (V1)") return "ml";
  if (name === "Molecular Weight") return "g/mol";
  return "";
};

const twoValueStep = (name: string) =>
  name === "Dilution Factor 1 (V2)" ||
  name === "Weight of Pycnometer with Sample (W2)" ||
  name === "Weight of Pycnometer with Water (W3)" ||
  name === "Label Claim" ||
  name === "Molecular Weight";

const ZptoShampooStep = ({
  step,
  stepNumber,
  locked,
  onChange,
}: {
  step: SamplePreparationZptoShampooStep;
  stepNumber: number;
  locked: boolean;
  onChange: (field: keyof SamplePreparationZptoShampooStep, value: string) => void;
}) => {
  const unit = step.unit1 || getDefaultUnit(step.name);
  const unitOptions = getUnitOptions(step.name);
  const isTwoValue = twoValueStep(step.name);
  const isV2 = step.name === "Dilution Factor 1 (V2)";
  const isPycnometerWeight =
    step.name === "Weight of Pycnometer with Sample (W2)" ||
    step.name === "Weight of Pycnometer with Water (W3)";
  const isMolecularWeight = step.name === "Molecular Weight";

  return (
    <div className="relative rounded-xl border border-emerald-200/60 bg-white p-4 transition-all duration-200 hover:border-emerald-300">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-slate-800 shadow-md">
          <span className="text-xs font-bold text-white">{stepNumber}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <div className="text-sm font-bold text-emerald-900">{step.name}</div>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
          </div>

          {isTwoValue ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {isV2 ? "Factor" : isPycnometerWeight ? "Factor" : "Value 1"}
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={step.value1 ?? ""}
                  disabled={locked}
                  placeholder={isV2 || isPycnometerWeight ? "1" : "Enter value"}
                  onChange={(event) => onChange("value1", event.target.value)}
                  className="w-full rounded-lg border border-emerald-300 px-3 py-2 text-xs outline-none transition hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
                />
              </div>
              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {isV2 ? "Volume" : isPycnometerWeight ? "Weight" : "Value 2"}
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={step.value2 ?? ""}
                  disabled={locked}
                  placeholder={isV2 ? "100" : "Enter value"}
                  onChange={(event) => onChange("value2", event.target.value)}
                  className="w-full rounded-lg border border-emerald-300 px-3 py-2 text-xs outline-none transition hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
                />
              </div>
              <div className="pb-2 text-xs font-semibold text-slate-600">
                {isV2 ? "ml" : isPycnometerWeight ? "g" : isMolecularWeight ? "g/mol" : ""}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <input
                type="text"
                inputMode="decimal"
                value={step.value1 ?? ""}
                disabled={locked}
                placeholder="Enter value"
                onChange={(event) => onChange("value1", event.target.value)}
                className="w-[180px] rounded-lg border border-emerald-300 px-3 py-2 text-xs outline-none transition hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
              />
              {unitOptions.length > 0 ? (
                <div className="w-24">
                  <CustomDropdown
                    options={unitOptions.map((option) => ({ value: option, label: option }))}
                    value={unit}
                    onChange={(value) => onChange("unit1", value)}
                    colorScheme="emerald"
                    disabled={locked}
                  />
                </div>
              ) : (
                <span className="font-semibold text-slate-500">{unit}</span>
              )}
            </div>
          )}

          {isV2 && (
            <p className="mt-2 text-[11px] text-slate-500">
              Excel input: <span className="font-semibold">factor × volume</span> — both values are used in the ZPTO SHAMPOO calculation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const calculateSpecificGravity = (w1: unknown, w2: unknown, w3: unknown): string => {
  const a = Number(w1);
  const b = Number(w2);
  const c = Number(w3);
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c) || a === c) return "";
  const value = ((a - b) / (a - c)) * 0.998;
  return Number.isFinite(value) ? String(Number(value.toFixed(5))) : "";
};

const ZptoShampooSamplePreparationCard = ({
  preparation,
  disabled,
  onRemove,
  onChange,
}: {
  preparation: SamplePreparationZptoShampoo;
  disabled: boolean;
  onRemove: () => void;
  onChange: (
    stepIndex: number,
    field: keyof SamplePreparationZptoShampooStep,
    value: string,
  ) => void;
}) => {
  const specificGravity = calculateSpecificGravity(
    preparation.steps.find((s) => s.name === "Weight of Empty Pycnometer (W1)")?.value1,
    preparation.steps.find((s) => s.name === "Weight of Pycnometer with Sample (W2)")?.value2,
    preparation.steps.find((s) => s.name === "Weight of Pycnometer with Water (W3)")?.value2,
  );

  return (
    <div className="group relative z-20">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-700/20 to-slate-900/20 blur-xl" />

      <div className="relative mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-white/95">
        <div className="relative rounded-t-lg bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-1 items-center gap-4">
              <div className="rounded-lg border border-white/30 bg-white/20 p-2">
                <Droplets className="h-5 w-5 text-white" />
              </div>

              <div>
                <h4 className="text-sm font-semibold tracking-wide text-white">
                  {preparation.label}
                </h4>
                <p className="text-xs text-emerald-100">
                  Sample Preparation for ZPTO SHAMPOO
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById(
                    `zptoShampoo-prep-${preparation.id}`,
                  );
                  if (element) element.classList.toggle("hidden");
                }}
                className="rounded-lg p-2 hover:bg-white/20"
                aria-label={`Toggle ${preparation.label}`}
              >
                <ChevronUp className="h-5 w-5 text-white" />
              </button>

              <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className="rounded-lg p-2 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Remove ${preparation.label}`}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div
          id={`zptoShampoo-prep-${preparation.id}`}
          className="space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5"
        >
          {preparation.steps.map((step, stepIndex) => (
            <ZptoShampooStep
              key={`${preparation.id}-${stepIndex}`}
              step={
                step.name === "Specific Gravity"
                  ? { ...step, value1: specificGravity }
                  : step
              }
              stepNumber={stepIndex + 1}
              locked={disabled || step.name === "Specific Gravity"}
              onChange={(field, value) =>
                onChange(stepIndex, field, value)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ZptoShampooPreparationModule = forwardRef<
  PreparationModuleHandle<ZptoShampooModuleDraft, unknown>,
  ZptoShampooPreparationModuleProps
>((props, ref) => {
  const {
    parameterId,
    parameterName,
    parameterCode,
    isLocked,
    canUnlockPreparation = false,
    canEditCalculations = false,
    onLockPreparation,
    onUnlockPreparation,
  } = props;

  const [samplePreparations, setSamplePreparations] = useState<
    SamplePreparationZptoShampoo[]
  >([]);
  const [files, setFiles] = useState<PreparationAttachedFile[]>([]);
  const [calculations, setCalculations] = useState<CalculationZptoShampoo[]>([]);
  const [completed, setCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ visible: false, message: "", type: "success" });

  const preparationDataLocked = isLocked || completed;

  const notify = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => setToast({ visible: true, message, type });

  const addPreparation = () => {
    if (preparationDataLocked) return;

    setSamplePreparations((current) => [
      ...current,
      createSamplePreparationZptoShampoo(current.length),
    ]);
    notify("ZPTO SHAMPOO sample preparation added.");
  };

  const removePreparation = (index: number) => {
    if (preparationDataLocked) return;

    const removedLabel = samplePreparations[index]?.label;

    setSamplePreparations((current) =>
      current
        .filter((_, currentIndex) => currentIndex !== index)
        .map((preparation, currentIndex) => ({
          ...preparation,
          id: currentIndex + 1,
          label: `Sample Preparation ${currentIndex + 1}`,
        })),
    );

    if (removedLabel) {
      setCalculations((current) =>
        current.map((calculation) =>
          calculation.selectedSamplePreparationLabel === removedLabel
            ? {
                ...calculation,
                selectedSamplePreparationLabel: null,
                calculationResult: null,
              }
            : calculation,
        ),
      );
    }
  };

  const updateStep = (
    preparationIndex: number,
    stepIndex: number,
    field: keyof SamplePreparationZptoShampooStep,
    value: string,
  ) => {
    if (preparationDataLocked) return;

    setSamplePreparations((current) =>
      current.map((preparation, currentIndex) =>
        currentIndex !== preparationIndex
          ? preparation
          : {
              ...preparation,
              steps: preparation.steps.map((step, currentStepIndex) =>
                currentStepIndex !== stepIndex
                  ? step
                  : { ...step, [field]: value },
              ),
            },
      ),
    );

    setCalculations((current) =>
      current.map((calculation) => ({
        ...calculation,
        calculationResult: null,
      })),
    );
  };

  const addFiles = async (selected: File[]) => {
    if (preparationDataLocked) return;

    const mapped: PreparationAttachedFile[] = [];
    const remaining = Math.max(0, 10 - files.length);

    for (const file of selected.slice(0, remaining)) {
      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        notify(`${file.name} is not a PDF.`, "error");
        continue;
      }

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      mapped.push({
        id: `${Date.now()}-${mapped.length}`,
        name: file.name,
        size: file.size,
        type: file.type,
        fileDataBase64: base64,
      });
    }

    if (mapped.length) setFiles((current) => [...current, ...mapped]);
  };

  const complete = () => {
    if (isLocked || !samplePreparations.length) return;

    setCompleted(true);
    const now = new Date().toISOString();
    setCompletedAt(now);
    setShowComplete(false);
    onLockPreparation(parameterId);
    notify("ZPTO SHAMPOO preparation marked as complete!");
  };

  const unlock = async () => {
    if (!canUnlockPreparation) return;

    setUnlocking(true);

    try {
      setCompleted(false);
      setCompletedAt(null);
      setCalculations([]);
      onUnlockPreparation(parameterId);
      setShowUnlock(false);
      notify("ZPTO SHAMPOO preparation unlocked successfully.");
    } finally {
      setUnlocking(false);
    }
  };

  const updateCalculation = (updated: CalculationZptoShampoo) => {
    setCalculations((current) =>
      current.map((calculation) =>
        calculation.id === updated.id ? updated : calculation,
      ),
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      getDraft: (): ZptoShampooModuleDraft => ({
        samplePreparations,
        files,
        calculations,
        completed,
        completedAt,
      }),

      loadDraft: (draft) => {
        if (!draft || typeof draft !== "object") return;

        const value = draft as Partial<ZptoShampooModuleData>;

        setSamplePreparations(
          Array.isArray(value.samplePreparations)
            ? value.samplePreparations.map((item, index) =>
                restoreSamplePreparationZptoShampoo(item, index),
              )
            : [],
        );
        setFiles(Array.isArray(value.files) ? value.files : []);
        setCalculations(
          Array.isArray(value.calculations)
            ? value.calculations.map((item, index) =>
                restoreCalculationZptoShampoo(item, index),
              )
            : [],
        );
        setCompleted(Boolean(value.completed));
        setCompletedAt(normalizeCompletedAt(value.completedAt));
      },

      restoreFromWorksheet: async (worksheet) => {
        if (!worksheet || typeof worksheet !== "object") return;

        const parameter = worksheet as {
          preparations?: unknown[];
          calculations?: unknown[];
          files?: unknown[];
          preparationCompletedAt?: unknown;
        };

        const preparations = Array.isArray(parameter.preparations)
          ? parameter.preparations
              .filter((item) => {
                if (!item || typeof item !== "object") return false;
                const value = item as Record<string, unknown>;
                return (
                  String(value.preparationType ?? "")
                    .trim()
                    .toLowerCase() === "zpto_shampoo" &&
                  String(value.preparationCategory ?? "sample")
                    .trim()
                    .toLowerCase() === "sample"
                );
              })
              .map((item, index) => {
                const value = item as Record<string, unknown>;

                return restoreSamplePreparationZptoShampoo(
                  {
                    ...value,
                    steps: parseSteps(value.steps),
                  },
                  index,
                );
              })
          : [];

        const worksheetCalculations = Array.isArray(parameter.calculations)
          ? parameter.calculations
              .filter((item) => {
                if (!item || typeof item !== "object") return false;
                const value = item as Record<string, unknown>;
                return (
                  String(value.calculationType ?? "")
                    .trim()
                    .toLowerCase() === "zpto_shampoo"
                );
              })
              .map((item, index) => {
                const value = item as Record<string, unknown>;
                let data: unknown = value.data;

                if (typeof data === "string") {
                  try {
                    data = JSON.parse(data);
                  } catch {
                    data = {};
                  }
                }

                return restoreCalculationZptoShampoo(data ?? value, index);
              })
          : [];

        const restoredFiles = Array.isArray(parameter.files)
          ? parameter.files
              .filter((item) => {
                if (!item || typeof item !== "object") return false;
                const value = item as Record<string, unknown>;
                return (
                  String(value.preparationType ?? "")
                    .trim()
                    .toLowerCase() === "zpto_shampoo"
                );
              })
              .map((item, index) => {
                const value = item as Record<string, unknown>;

                return {
                  id:
                    typeof value.id === "number"
                      ? value.id
                      : `${Date.now()}-${index}`,
                  name: String(
                    value.fileName ?? value.name ?? `ZPTO SHAMPOO-${index + 1}.pdf`,
                  ),
                  type: "application/pdf",
                  fileDataBase64:
                    typeof value.fileDataBase64 === "string"
                      ? value.fileDataBase64
                      : null,
                } satisfies PreparationAttachedFile;
              })
          : [];

        setSamplePreparations(preparations);
        setCalculations(worksheetCalculations);
        setFiles(restoredFiles);

        type CompletedPreparationRecord = {
          preparationType?: unknown;
          isPreparationCompleted?: unknown;
          completedAt?: unknown;
        };

        const completedPreparation: CompletedPreparationRecord | null =
          Array.isArray(parameter.preparations)
            ? (parameter.preparations as CompletedPreparationRecord[]).find(
                (item) =>
                  String(item?.preparationType ?? "")
                    .trim()
                    .toLowerCase() === "zpto_shampoo" &&
                  Boolean(item?.isPreparationCompleted),
              ) ?? null
            : null;

        const completedValue =
          parameter.preparationCompletedAt ??
          completedPreparation?.completedAt ??
          null;

        setCompleted(Boolean(completedValue));
        setCompletedAt(normalizeCompletedAt(completedValue));
      },
    }),
    [
      samplePreparations,
      files,
      calculations,
      completed,
      completedAt,
    ],
  );

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/30 to-white pb-8 shadow-2xl">
      <div className="bg-gradient-to-r from-white via-white to-emerald-50 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-lg">
              <BiTestTube className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-900">
                ZPTO SHAMPOO Analysis
              </h2>
              <p className="text-sm text-emerald-600">
                Metal Laboratory • ZPTO SHAMPOO • Sample &amp; Calculations
              </p>
            </div>
          </div>

          <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
            {samplePreparations.length} Preparations
          </div>
        </div>
      </div>

      <SamplePreparationSection<SamplePreparationZptoShampoo>
        title="Sample Preparations for ZPTO SHAMPOO"
        preparations={samplePreparations}
        isLocked={preparationDataLocked}
        onAddPreparation={addPreparation}
        onRemovePreparation={(_, index) => removePreparation(index)}
        renderPreparation={(preparation, index) => (
          <ZptoShampooSamplePreparationCard
            preparation={preparation}
            disabled={preparationDataLocked}
            onRemove={() => removePreparation(index)}
            onChange={(stepIndex, field, value) =>
              updateStep(index, stepIndex, field, value)
            }
          />
        )}
      />

      {samplePreparations.length > 0 && (
        <>
          <div className="mx-6 mb-6">
            <FileAttachmentSection
              files={files}
              isLocked={preparationDataLocked}
              title="Attach ZPTO SHAMPOO Preparation Files (PDF)"
              maxFiles={10}
              onAttachFiles={addFiles}
              onRemoveFile={(_, index) =>
                setFiles((current) =>
                  current.filter((__, fileIndex) => fileIndex !== index),
                )
              }
            />
          </div>

          <div className="mx-6">
            <PreparationCompleteSection
              preparationName="ZPTO SHAMPOO"
              isCompleted={completed}
              isLocked={preparationDataLocked}
              completedAt={completedAt}
              canUnlockPreparation={canUnlockPreparation}
              onComplete={() => setShowComplete(true)}
              onUnlock={() => setShowUnlock(true)}
            />
          </div>

          {completed && (
            <ZptoShampooCalculationSection
              calculations={calculations}
              samplePreparations={samplePreparations}
              canEditCalculations={canEditCalculations}
              onAdd={() =>
                canEditCalculations &&
                setCalculations((current) => [
                  ...current,
                  createCalculationZptoShampoo(current.length),
                ])
              }
              onRemove={(id) => {
                if (!canEditCalculations) return;

                setCalculations((current) =>
                  current.filter((calculation) => calculation.id !== id),
                );
              }}
              onUpdate={(updated) => {
                if (!canEditCalculations) return;
                updateCalculation(updated);
              }}
            />
          )}

          <PreparationCompleteModal
            isOpen={showComplete}
            preparationName="ZPTO SHAMPOO"
            parameterName={parameterName}
            parameterCode={parameterCode}
            onConfirm={complete}
            onCancel={() => setShowComplete(false)}
          />

          <UnlockPreparationDialog
            isOpen={showUnlock}
            isUnlocking={unlocking}
            parameterName={parameterName ?? ""}
            parameterCode={parameterCode ?? ""}
            onClose={() => setShowUnlock(false)}
            onConfirm={unlock}
          />
        </>
      )}

      <PreparationToast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast((current) => ({ ...current, visible: false }))
        }
      />
    </div>
  );
});

ZptoShampooPreparationModule.displayName = "ZptoShampooPreparationModule";

export default ZptoShampooPreparationModule;
