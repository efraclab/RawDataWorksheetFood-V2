import { forwardRef, useImperativeHandle, useState } from "react";
import type { ReactNode } from "react";
import { BiTestTube } from "react-icons/bi";
import { ChevronUp, Trash2, FlaskConical } from "lucide-react";

import type { PreparationModuleHandle } from "../../../../../core/preparation/ui/PreparationModuleHandle";
import type { PreparationAttachedFile } from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import SamplePreparationSection from "../../../../../core/preparation-engine/components/SamplePreparationSection";
import FileAttachmentSection from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import PreparationCompleteSection from "../../../../../core/preparation-engine/components/PreparationCompleteSection";
import PreparationCompleteModal from "../../../../../core/preparation-engine/components/PreparationCompleteModal";
import UnlockPreparationDialog from "../../../../../core/preparation-engine/components/UnlockPreparationDialog";
import PreparationToast from "../../../../../core/preparation-engine/components/PreparationToast";

import type { GasTestConfig } from "../config";
import type {
  CalculationGas,
  GasModuleData,
  GasModuleDraft,
  GasStep,
  SamplePreparationGas,
} from "../models";
import {
  getSections,
  stepName,
  createCalculationGas,
  createSamplePreparationGas,
  restoreCalculationGas,
  restoreSamplePreparationGas,
} from "../factory";
import GasCalculationSection from "./GasCalculationSection";

export interface GasPreparationModuleProps {
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

type ModuleProps = GasPreparationModuleProps & {
  config: GasTestConfig;
};

const inputClass =
  "w-full rounded-lg border border-emerald-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-100";

const parseSteps = (value: unknown): GasStep[] => {
  if (Array.isArray(value)) return value as GasStep[];
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as GasStep[]) : [];
  } catch {
    return [];
  }
};

const normalizeCompletedAt = (value: unknown): string | null => {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const FieldLabel = ({ children }: { children: ReactNode }) => (
  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
    {children}
  </div>
);

const GasSampleCard = ({
  config,
  preparation,
  disabled,
  onRemove,
  onChange,
}: {
  config: GasTestConfig;
  preparation: SamplePreparationGas;
  disabled: boolean;
  onRemove: () => void;
  onChange: (stepIndex: number, patch: Partial<GasStep>) => void;
}) => {
  const find = (name: string) => {
    const index = preparation.steps.findIndex((s) => s.name === name);
    return { index, step: preparation.steps[index] as GasStep | undefined };
  };

  return (
    <div className="group relative z-20">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-700/20 to-slate-900/20 blur-xl" />

      <div className="relative mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-white/95">
        <div className="relative rounded-t-lg bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-1 items-center gap-4">
              <div className="rounded-lg border border-white/30 bg-white/20 p-2">
                <FlaskConical className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide text-white">
                  {preparation.label}
                </h4>
                <p className="text-xs text-emerald-100">
                  Sample Preparation for {config.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById(
                    `gas-${config.key}-prep-${preparation.id}`,
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
          id={`gas-${config.key}-prep-${preparation.id}`}
          className="space-y-5 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5"
        >
          {getSections(config).map((section) => (
            <div key={section.title} className="rounded-xl border border-emerald-200/60 bg-white p-4">
              <div className="mb-3 text-sm font-bold text-emerald-900">{section.title}</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {section.fields.map((field) => {
                  const name = stepName(section.title, field.label);
                  const { index, step } = find(name);
                  if (!step) return null;
                  return (
                    <div key={name}>
                      <FieldLabel>{field.label}</FieldLabel>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          inputMode={field.numeric ? "decimal" : undefined}
                          value={step.value1 ?? ""}
                          disabled={disabled}
                          onChange={(e) => onChange(index, { value1: e.target.value })}
                          className={inputClass}
                        />
                        {field.symbol &&
                          field.symbol !== "OBS" &&
                          ["DT", "IR", "OV"].includes(field.symbol) &&
                          config.unit && (
                            <span className="whitespace-nowrap text-xs font-semibold text-slate-600">
                              {config.unit}
                            </span>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GasPreparationModule = forwardRef<
  PreparationModuleHandle<GasModuleDraft, unknown>,
  ModuleProps
>((props, ref) => {
  const {
    config,
    parameterId,
    parameterName,
    parameterCode,
    isLocked,
    canUnlockPreparation = false,
    canEditCalculations = false,
    onLockPreparation,
    onUnlockPreparation,
  } = props;

  const persistenceType = config.key.toLowerCase();

  const [samplePreparations, setSamplePreparations] = useState<
    SamplePreparationGas[]
  >([]);
  const [files, setFiles] = useState<PreparationAttachedFile[]>([]);
  const [calculations, setCalculations] = useState<CalculationGas[]>([]);
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
      createSamplePreparationGas(config, current.length),
    ]);
    notify(`${config.title} sample preparation added.`);
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
                resultBreakdown: "",
              }
            : calculation,
        ),
      );
    }
  };

  const updateStep = (
    preparationIndex: number,
    stepIndex: number,
    patch: Partial<GasStep>,
  ) => {
    if (preparationDataLocked) return;

    setSamplePreparations((current) =>
      current.map((preparation, currentIndex) =>
        currentIndex !== preparationIndex
          ? preparation
          : {
              ...preparation,
              steps: preparation.steps.map((step, currentStepIndex) =>
                currentStepIndex !== stepIndex ? step : { ...step, ...patch },
              ),
            },
      ),
    );

    setCalculations((current) =>
      current.map((calculation) => ({
        ...calculation,
                calculationResult: null,
        resultBreakdown: "",
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
    setCompletedAt(new Date().toISOString());
    setShowComplete(false);
    onLockPreparation(parameterId);
    notify(`${config.title} preparation marked as complete!`);
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
      notify(`${config.title} preparation unlocked successfully.`);
    } finally {
      setUnlocking(false);
    }
  };

  const updateCalculation = (updated: CalculationGas) => {
    setCalculations((current) =>
      current.map((calculation) =>
        calculation.id === updated.id ? updated : calculation,
      ),
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      getDraft: (): GasModuleDraft => ({
        samplePreparations,
        files,
        calculations,
        completed,
        completedAt,
      }),

      loadDraft: (draft) => {
        if (!draft || typeof draft !== "object") return;

        const value = draft as Partial<GasModuleData>;

        setSamplePreparations(
          Array.isArray(value.samplePreparations)
            ? value.samplePreparations.map((item, index) =>
                restoreSamplePreparationGas(config, item, index),
              )
            : [],
        );
        setFiles(Array.isArray(value.files) ? value.files : []);
        setCalculations(
          Array.isArray(value.calculations)
            ? value.calculations.map((item, index) =>
                restoreCalculationGas(config, item, index),
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
        };

        const preparations = Array.isArray(parameter.preparations)
          ? parameter.preparations
              .filter((item) => {
                if (!item || typeof item !== "object") return false;
                const value = item as Record<string, unknown>;
                return (
                  String(value.preparationType ?? "").trim().toLowerCase() ===
                    persistenceType &&
                  String(value.preparationCategory ?? "sample")
                    .trim()
                    .toLowerCase() === "sample"
                );
              })
              .map((item, index) => {
                const value = item as Record<string, unknown>;
                return restoreSamplePreparationGas(
                  config,
                  { ...value, steps: parseSteps(value.steps) },
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
                  persistenceType
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

                return restoreCalculationGas(config, data ?? value, index);
              })
          : [];

        const restoredFiles = Array.isArray(parameter.files)
          ? parameter.files
              .filter((item) => {
                if (!item || typeof item !== "object") return false;
                const value = item as Record<string, unknown>;
                return (
                  String(value.preparationType ?? "").trim().toLowerCase() ===
                  persistenceType
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
                    value.fileName ?? value.name ?? `${config.title}-${index + 1}.pdf`,
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
                  String(item?.preparationType ?? "").trim().toLowerCase() ===
                    persistenceType && Boolean(item?.isPreparationCompleted),
              ) ?? null
            : null;

        // Completion is read only from THIS test's own preparation records.
        // The parameter-level `preparationCompletedAt` is shared by every
        // preparation on the parameter, so using it would mark a new test
        // (for example Coliform Count) as completed because TPC was completed.
        setCompleted(Boolean(completedPreparation));
        setCompletedAt(normalizeCompletedAt(completedPreparation?.completedAt ?? null));
      },
    }),
    [config, persistenceType, samplePreparations, files, calculations, completed, completedAt],
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
                {config.title} Analysis
              </h2>
              <p className="text-sm text-emerald-600">
                Gas Laboratory • {config.testName} • Sample &amp; Calculations
              </p>
            </div>
          </div>

          <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
            {samplePreparations.length} Preparations
          </div>
        </div>
      </div>

      <SamplePreparationSection<SamplePreparationGas>
        title={`Sample Preparations for ${config.title}`}
        preparations={samplePreparations}
        isLocked={preparationDataLocked}
        onAddPreparation={addPreparation}
        onRemovePreparation={(_, index) => removePreparation(index)}
        renderPreparation={(preparation, index) => (
          <GasSampleCard
            config={config}
            preparation={preparation}
            disabled={preparationDataLocked}
            onRemove={() => removePreparation(index)}
            onChange={(stepIndex, patch) => updateStep(index, stepIndex, patch)}
          />
        )}
      />

      {samplePreparations.length > 0 && (
        <>
          <div className="mx-6 mb-6">
            <FileAttachmentSection
              files={files}
              isLocked={preparationDataLocked}
              title={`Attach ${config.title} Preparation Files (PDF)`}
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
              preparationName={config.title}
              isCompleted={completed}
              isLocked={preparationDataLocked}
              completedAt={completedAt}
              canUnlockPreparation={canUnlockPreparation}
              onComplete={() => setShowComplete(true)}
              onUnlock={() => setShowUnlock(true)}
            />
          </div>

          {completed && (
            <GasCalculationSection
              config={config}
              calculations={calculations}
              samplePreparations={samplePreparations}
              canEditCalculations={canEditCalculations}
              onAdd={() =>
                canEditCalculations &&
                setCalculations((current) => [
                  ...current,
                  createCalculationGas(config, current.length),
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
            preparationName={config.title}
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

GasPreparationModule.displayName = "GasPreparationModule";

/**
 * Returns the module component for one test. Core renders it with its normal
 * props and a ref, so the config is bound here.
 */
export function createGasModule(config: GasTestConfig) {
  const Module = forwardRef<
    PreparationModuleHandle<GasModuleDraft, unknown>,
    GasPreparationModuleProps
  >((props, ref) => (
    <GasPreparationModule ref={ref} config={config} {...props} />
  ));

  Module.displayName = `${config.title}PreparationModule`;
  return Module;
}

export default GasPreparationModule;