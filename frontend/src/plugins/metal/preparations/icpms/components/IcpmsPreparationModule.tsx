import { forwardRef, useImperativeHandle, useState } from "react";
import { BiTestTube } from "react-icons/bi";
import { ChevronUp, Trash2 } from "lucide-react";

import type { PreparationModuleHandle } from "../../../../../core/preparation/ui/PreparationModuleHandle";
import type { PreparationAttachedFile } from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import SamplePreparationSection from "../../../../../core/preparation-engine/components/SamplePreparationSection";
import FileAttachmentSection from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import PreparationCompleteSection from "../../../../../core/preparation-engine/components/PreparationCompleteSection";
import PreparationCompleteModal from "../../../../../core/preparation-engine/components/PreparationCompleteModal";
import UnlockPreparationDialog from "../../../../../core/preparation-engine/components/UnlockPreparationDialog";
import PreparationToast from "../../../../../core/preparation-engine/components/PreparationToast";

import type { CalculationIcpms } from "../models/CalculationIcpms";
import type { SamplePreparationIcpms, SamplePreparationIcpmsStep } from "../models/SamplePreparationIcpms";
import type { IcpmsModuleData, IcpmsModuleDraft } from "../models/index";
import {
  createCalculationIcpms,
  createSamplePreparationIcpms,
  restoreCalculationIcpms,
  restoreSamplePreparationIcpms,
} from "../factory";
import IcpmsCalculationSection from "./IcpmsCalculationSection";

export interface IcpmsPreparationModuleProps {
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

const parseSteps = (value: unknown): SamplePreparationIcpmsStep[] => {
  if (Array.isArray(value)) return value as SamplePreparationIcpmsStep[];
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as SamplePreparationIcpmsStep[]) : [];
  } catch {
    return [];
  }
};

const normalizeCompletedAt = (value: unknown): string | null => {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const IcpmsSamplePreparationCard = ({
  preparation,
  disabled,
  onRemove,
  onChange,
}: {
  preparation: SamplePreparationIcpms;
  disabled: boolean;
  onRemove: () => void;
  onChange: (stepIndex: number, field: keyof SamplePreparationIcpmsStep, value: string) => void;
}) => {
  const updateStep = (
    stepIndex: number,
    field: keyof SamplePreparationIcpmsStep,
    value: string,
  ) => onChange(stepIndex, field, value);

  return (
    <div className="relative group z-20">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-700/20 to-slate-900/20 blur-xl" />
      <div className="relative mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-white/95">
        <div className="relative rounded-t-lg bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="rounded-lg border border-white/30 bg-white/20 p-2">
                <BiTestTube className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide text-white">
                  {preparation.label}
                </h4>
                <p className="text-xs text-emerald-100">
                  Sample Preparation for ICP-MS (FOOD)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  const target = event.currentTarget.closest(".group")?.querySelector<HTMLElement>("[data-preparation-body]");
                  target?.classList.toggle("hidden");
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

        <div data-preparation-body className="grid gap-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5 md:grid-cols-2 xl:grid-cols-3">
          {preparation.steps.map((step, stepIndex) => (
            <div key={`${preparation.id}-${stepIndex}`} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-2 text-xs font-semibold text-slate-600">
                {step.name}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={step.value1 ?? ""}
                  disabled={disabled}
                  onChange={(event) => updateStep(stepIndex, "value1", event.target.value)}
                  className="h-9 min-w-0 flex-1 rounded-lg border border-emerald-300 px-3 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
                  placeholder="Enter value"
                />
                {step.unit1 && (
                  <div className="flex h-9 min-w-[68px] items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-2 text-xs font-semibold text-emerald-800">
                    {step.unit1}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const IcpmsPreparationModule = forwardRef<
  PreparationModuleHandle<IcpmsModuleDraft, unknown>,
  IcpmsPreparationModuleProps
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

  const [samplePreparations, setSamplePreparations] = useState<SamplePreparationIcpms[]>([]);
  const [files, setFiles] = useState<PreparationAttachedFile[]>([]);
  const [calculations, setCalculations] = useState<CalculationIcpms[]>([]);
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
  const notify = (message: string, type: "success" | "error" | "info" = "success") =>
    setToast({ visible: true, message, type });

  const addPreparation = () => {
    if (preparationDataLocked) return;
    setSamplePreparations((current) => [
      ...current,
      createSamplePreparationIcpms(current.length),
    ]);
    notify("ICP-MS sample preparation added.");
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
    field: keyof SamplePreparationIcpmsStep,
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
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
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
        type: file.type || "application/pdf",
        fileDataBase64: base64,
      });
    }

    if (mapped.length) setFiles((current) => [...current, ...mapped]);
  };

  const complete = () => {
    if (isLocked || samplePreparations.length === 0) return;
    setCompleted(true);
    const now = new Date().toISOString();
    setCompletedAt(now);
    setShowComplete(false);
    onLockPreparation(parameterId);
    notify("ICP-MS (FOOD) preparation marked as complete!");
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
      notify("ICP-MS (FOOD) preparation unlocked successfully.");
    } finally {
      setUnlocking(false);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      getDraft: (): IcpmsModuleDraft => ({
        samplePreparations,
        files,
        calculations,
        completed,
        completedAt,
      }),

      loadDraft: (draft) => {
        if (!draft || typeof draft !== "object") return;

        const value = draft as Partial<IcpmsModuleData>;

        setSamplePreparations(
          Array.isArray(value.samplePreparations)
            ? value.samplePreparations.map((item, index) =>
                restoreSamplePreparationIcpms(item, index),
              )
            : [],
        );
        setFiles(Array.isArray(value.files) ? value.files : []);
        setCalculations(
          Array.isArray(value.calculations)
            ? value.calculations.map((item, index) =>
                restoreCalculationIcpms(item, index),
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
                  String(value.preparationType ?? "").trim().toLowerCase() ===
                    "icpms" &&
                  String(value.preparationCategory ?? "sample").trim().toLowerCase() ===
                    "sample"
                );
              })
              .map((item, index) => {
                const value = item as Record<string, unknown>;
                return restoreSamplePreparationIcpms(
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
                  String(value.calculationType ?? "").trim().toLowerCase() ===
                  "icpms"
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
                return restoreCalculationIcpms(data ?? value, index);
              })
          : [];

        const restoredFiles = Array.isArray(parameter.files)
          ? parameter.files
              .filter((item) => {
                if (!item || typeof item !== "object") return false;
                const value = item as Record<string, unknown>;
                return (
                  String(value.preparationType ?? "").trim().toLowerCase() ===
                  "icpms"
                );
              })
              .map((item, index) => {
                const value = item as Record<string, unknown>;
                return {
                  id:
                    typeof value.id === "number"
                      ? value.id
                      : `${Date.now()}-${index}`,
                  name: String(value.fileName ?? value.name ?? `ICP-MS-${index + 1}.pdf`),
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
                  String(item?.preparationType ?? "").trim().toLowerCase() ===
                    "icpms" &&
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
      parameterId,
      isLocked,
      canUnlockPreparation,
      canEditCalculations,
      parameterName,
      parameterCode,
      onLockPreparation,
      onUnlockPreparation,
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
                ICP-MS (FOOD) Analysis
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

      <SamplePreparationSection<SamplePreparationIcpms>
        title="Sample Preparations for ICP-MS (FOOD)"
        preparations={samplePreparations}
        isLocked={preparationDataLocked}
        onAddPreparation={addPreparation}
        onRemovePreparation={() => undefined}
        renderPreparation={(preparation, index) => (
          <IcpmsSamplePreparationCard
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
              title="Attach ICP-MS Preparation Files (PDF)"
              maxFiles={10}
              onAttachFiles={addFiles}
              onRemoveFile={(_, index) =>
                setFiles((current) => current.filter((__, fileIndex) => fileIndex !== index))
              }
            />
          </div>

          <div className="mx-6">
            <PreparationCompleteSection
              preparationName="ICP-MS (FOOD)"
              isCompleted={completed}
              isLocked={preparationDataLocked}
              completedAt={completedAt}
              canUnlockPreparation={canUnlockPreparation}
              onComplete={() => setShowComplete(true)}
              onUnlock={() => setShowUnlock(true)}
            />
          </div>

          {completed && (
            <IcpmsCalculationSection
              calculations={calculations}
              samplePreparations={samplePreparations}
              canEditCalculations={canEditCalculations}
              onAdd={() =>
                canEditCalculations &&
                setCalculations((current) => [
                  ...current,
                  createCalculationIcpms(current.length),
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
                setCalculations((current) =>
                  current.map((calculation) =>
                    calculation.id === updated.id ? updated : calculation,
                  ),
                );
              }}
            />
          )}

          <PreparationCompleteModal
            isOpen={showComplete}
            preparationName="ICP-MS (FOOD)"
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
        onClose={() => setToast((current) => ({ ...current, visible: false }))}
      />
    </div>
  );
});

IcpmsPreparationModule.displayName = "IcpmsPreparationModule";

export default IcpmsPreparationModule;
