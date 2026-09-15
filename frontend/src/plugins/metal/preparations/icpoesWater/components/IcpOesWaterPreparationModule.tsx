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

import type { CalculationIcpOesWater } from "../models/CalculationIcpOesWater";
import type {
  SamplePreparationIcpOesWater,
  SamplePreparationIcpOesWaterStep,
} from "../models/SamplePreparationIcpOesWater";
import type {
  IcpOesWaterModuleData,
  IcpOesWaterModuleDraft,
} from "../models/index";
import {
  createCalculationIcpOesWater,
  createSamplePreparationIcpOesWater,
  restoreCalculationIcpOesWater,
  restoreSamplePreparationIcpOesWater,
} from "../factory";
import IcpOesWaterCalculationSection from "./IcpOesWaterCalculationSection";

export interface IcpOesWaterPreparationModuleProps {
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

const parseSteps = (value: unknown): SamplePreparationIcpOesWaterStep[] => {
  if (Array.isArray(value)) return value as SamplePreparationIcpOesWaterStep[];
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? (parsed as SamplePreparationIcpOesWaterStep[])
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
  if (
    name === "Instrument Concentration (Sample)" ||
    name === "Instrument Concentration (Blank)"
  ) {
    return ["ppb", "ppm"];
  }

  return ["ml", "L", "µl"];
};

const getDefaultUnit = (name: string): string => {
  if (
    name === "Instrument Concentration (Sample)" ||
    name === "Instrument Concentration (Blank)"
  ) {
    return "ppb";
  }

  if (name === "Sample Weight (SW1)") return "g";
  return "ml";
};

/**
 * ICP-OES preparation deliberately uses the same visual pattern as LOD.
 *
 * Layout:
 *   1 — full row
 *   2 — full row
 *   3 — full row
 *   4 — full row
 *   3 — full row
 *   4 — full row
 *
 * Only the business labels/units differ.
 */
const IcpOesWaterStep = ({
  step,
  stepNumber,
  locked,
  onChange,
}: {
  step: SamplePreparationIcpOesWaterStep;
  stepNumber: number;
  locked: boolean;
  onChange: (field: keyof SamplePreparationIcpOesWaterStep, value: string) => void;
}) => {
  const unit = step.unit1 || getDefaultUnit(step.name);
  const unitOptions = getUnitOptions(step.name);

  return (
    <div className="relative rounded-xl border border-emerald-200/60 bg-white p-4 transition-all duration-200 hover:border-emerald-300">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-slate-800 shadow-md">
          <span className="text-xs font-bold text-white">{stepNumber}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <div className="text-sm font-bold text-emerald-900">
              {step.name}
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-gray-600">{step.name}</span>

            <input
              type="text"
              inputMode="decimal"
              value={step.value1 ?? ""}
              disabled={locked}
              placeholder="Enter value"
              onChange={(event) => onChange("value1", event.target.value)}
              className="w-[122px] rounded-lg border border-emerald-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-100"
            />

            <div className="w-20">
              <CustomDropdown
                options={unitOptions.map((option) => ({
                  value: option,
                  label: option,
                }))}
                value={unit}
                onChange={(value) => onChange("unit1", value)}
                colorScheme="emerald"
                disabled={locked}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IcpOesWaterSamplePreparationCard = ({
  preparation,
  disabled,
  onRemove,
  onChange,
}: {
  preparation: SamplePreparationIcpOesWater;
  disabled: boolean;
  onRemove: () => void;
  onChange: (
    stepIndex: number,
    field: keyof SamplePreparationIcpOesWaterStep,
    value: string,
  ) => void;
}) => {
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
                  Sample Preparation for ICP-OES (Water)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById(
                    `icpoesWater-prep-${preparation.id}`,
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
          id={`icpoesWater-prep-${preparation.id}`}
          className="space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5"
        >
          {preparation.steps.map((step, stepIndex) => (
            <IcpOesWaterStep
              key={`${preparation.id}-${stepIndex}`}
              step={step}
              stepNumber={stepIndex + 1}
              locked={disabled}
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

const IcpOesWaterPreparationModule = forwardRef<
  PreparationModuleHandle<IcpOesWaterModuleDraft, unknown>,
  IcpOesWaterPreparationModuleProps
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
    SamplePreparationIcpOesWater[]
  >([]);
  const [files, setFiles] = useState<PreparationAttachedFile[]>([]);
  const [calculations, setCalculations] = useState<CalculationIcpOesWater[]>([]);
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
      createSamplePreparationIcpOesWater(current.length),
    ]);
    notify("ICP-OES sample preparation added.");
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
    field: keyof SamplePreparationIcpOesWaterStep,
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
    notify("ICP-OES preparation marked as complete!");
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
      notify("ICP-OES preparation unlocked successfully.");
    } finally {
      setUnlocking(false);
    }
  };

  const updateCalculation = (updated: CalculationIcpOesWater) => {
    setCalculations((current) =>
      current.map((calculation) =>
        calculation.id === updated.id ? updated : calculation,
      ),
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      getDraft: (): IcpOesWaterModuleDraft => ({
        samplePreparations,
        files,
        calculations,
        completed,
        completedAt,
      }),

      loadDraft: (draft) => {
        if (!draft || typeof draft !== "object") return;

        const value = draft as Partial<IcpOesWaterModuleData>;

        setSamplePreparations(
          Array.isArray(value.samplePreparations)
            ? value.samplePreparations.map((item, index) =>
                restoreSamplePreparationIcpOesWater(item, index),
              )
            : [],
        );
        setFiles(Array.isArray(value.files) ? value.files : []);
        setCalculations(
          Array.isArray(value.calculations)
            ? value.calculations.map((item, index) =>
                restoreCalculationIcpOesWater(item, index),
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
                    .toLowerCase() === "icpoes_water" &&
                  String(value.preparationCategory ?? "sample")
                    .trim()
                    .toLowerCase() === "sample"
                );
              })
              .map((item, index) => {
                const value = item as Record<string, unknown>;

                return restoreSamplePreparationIcpOesWater(
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
                    .toLowerCase() === "icpoes_water"
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

                return restoreCalculationIcpOesWater(data ?? value, index);
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
                    .toLowerCase() === "icpoes_water"
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
                    value.fileName ?? value.name ?? `ICP-OES-${index + 1}.pdf`,
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
                    .toLowerCase() === "icpoes_water" &&
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
                ICP-OES (Water) Analysis
              </h2>
              <p className="text-sm text-emerald-600">
                Metal Laboratory • Sample &amp; Calculations
              </p>
            </div>
          </div>

          <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
            {samplePreparations.length} Preparations
          </div>
        </div>
      </div>

      <SamplePreparationSection<SamplePreparationIcpOesWater>
        title="Sample Preparations for ICP-OES (Water)"
        preparations={samplePreparations}
        isLocked={preparationDataLocked}
        onAddPreparation={addPreparation}
        onRemovePreparation={(_, index) => removePreparation(index)}
        renderPreparation={(preparation, index) => (
          <IcpOesWaterSamplePreparationCard
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
              title="Attach ICP-OES Preparation Files (PDF)"
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
              preparationName="ICP-OES (Water)"
              isCompleted={completed}
              isLocked={preparationDataLocked}
              completedAt={completedAt}
              canUnlockPreparation={canUnlockPreparation}
              onComplete={() => setShowComplete(true)}
              onUnlock={() => setShowUnlock(true)}
            />
          </div>

          {completed && (
            <IcpOesWaterCalculationSection
              calculations={calculations}
              samplePreparations={samplePreparations}
              canEditCalculations={canEditCalculations}
              onAdd={() =>
                canEditCalculations &&
                setCalculations((current) => [
                  ...current,
                  createCalculationIcpOesWater(current.length),
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
            preparationName="ICP-OES (Water)"
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

IcpOesWaterPreparationModule.displayName = "IcpOesWaterPreparationModule";

export default IcpOesWaterPreparationModule;
