import { forwardRef, useImperativeHandle, useState } from "react";
import { BiTestTube } from "react-icons/bi";
import type { PreparationModuleHandle } from "../../../../core/preparation/ui/PreparationModuleHandle";
import type { PreparationAttachedFile } from "../../../../core/preparation-engine/components/FileAttachmentSection";
import FileAttachmentSection from "../../../../core/preparation-engine/components/FileAttachmentSection";
import PreparationCompleteModal from "../../../../core/preparation-engine/components/PreparationCompleteModal";
import PreparationCompleteSection from "../../../../core/preparation-engine/components/PreparationCompleteSection";
import PreparationToast from "../../../../core/preparation-engine/components/PreparationToast";
import SamplePreparationSection from "../../../../core/preparation-engine/components/SamplePreparationSection";
import UnlockPreparationDialog from "../../../../core/preparation-engine/components/UnlockPreparationDialog";
import { createSimpleCalculation, createSimpleSamplePreparation, normalizeDate, normalizeType, parseUnknown, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "./utils";
import SimpleEnvironmentCalculationSection from "./SimpleEnvironmentCalculationSection";
import SimpleEnvironmentSamplePreparationDetail from "./SimpleEnvironmentSamplePreparationDetail";
import type { SimpleEnvironmentCalculation, SimpleEnvironmentConfig, SimpleEnvironmentSamplePreparation } from "./types";

type ModuleData = {
  samplePreparations: SimpleEnvironmentSamplePreparation[];
  files: PreparationAttachedFile[];
  calculations: SimpleEnvironmentCalculation[];
  completed: boolean;
  completedAt: string | null;
};

export interface SimpleEnvironmentPreparationModuleProps {
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

export function createSimpleEnvironmentModule(
  config: SimpleEnvironmentConfig,
  ComponentName: string,
) {
  const Module = forwardRef<PreparationModuleHandle<ModuleData, unknown>, SimpleEnvironmentPreparationModuleProps>(
    (props, ref) => {
      const {
        parameterId, parameterName, parameterCode, isLocked,
        canUnlockPreparation = false, canEditCalculations = false,
        onLockPreparation, onUnlockPreparation,
      } = props;

      const [samplePreparations, setSamplePreparations] = useState<SimpleEnvironmentSamplePreparation[]>([]);
      const [files, setFiles] = useState<PreparationAttachedFile[]>([]);
      const [calculations, setCalculations] = useState<SimpleEnvironmentCalculation[]>([]);
      const [completed, setCompleted] = useState(false);
      const [completedAt, setCompletedAt] = useState<string | null>(null);
      const [showComplete, setShowComplete] = useState(false);
      const [showUnlock, setShowUnlock] = useState(false);
      const [unlocking, setUnlocking] = useState(false);
      const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" | "info" }>({ visible: false, message: "", type: "success" });

      const locked = isLocked || completed;
      const notify = (message: string, type: "success" | "error" | "info" = "success") =>
        setToast({ visible: true, message, type });

      const addPreparation = () => {
        if (locked || samplePreparations.length >= 10) return;
        setSamplePreparations((items) => [...items, createSimpleSamplePreparation(config, items.length)]);
        notify(`${config.shortName} sample preparation added.`);
      };

      const removePreparation = (index: number) => {
        if (locked) return;
        const removedLabel = `Sample Preparation ${index + 1}`;
        setSamplePreparations((items) => items.filter((_, i) => i !== index).map((item, i) => ({ ...item, id: i + 1, label: `Sample Preparation ${i + 1}` })));
        setCalculations((items) => items.map((item) =>
          item.selectedSamplePreparationLabel === removedLabel
            ? { ...item, selectedSamplePreparationLabel: null, calculationResult: null }
            : item,
        ));
      };

      const updateStep = (preparationId: number, stepName: string, value: string) => {
        if (locked) return;
        setSamplePreparations((items) => items.map((item) => {
          if (item.id !== preparationId) return item;
          const changed = item.steps.map((step) =>
            step.name === stepName ? { ...step, value1: value } : step
          );
          const numericValues: Record<string, number> = {};
          config.fields.forEach((field) => {
            const step = changed.find((entry) => entry.name === field.name);
            const parsed = Number(step?.value1 ?? "");
            if (Number.isFinite(parsed)) numericValues[field.key] = parsed;
          });
          const steps = changed.map((step) => {
            const field = config.fields.find((entry) => entry.name === step.name);
            if (!field?.compute) return step;
            return { ...step, value1: field.compute(numericValues) };
          });
          return { ...item, steps };
        }));
        setCalculations((items) => items.map((item) => ({ ...item, calculationResult: null })));
      };

      const addFiles = async (selected: File[]) => {
        if (locked) return;
        const mapped: PreparationAttachedFile[] = [];
        for (const file of selected.slice(0, Math.max(0, 10 - files.length))) {
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
          mapped.push({ id: `${Date.now()}-${mapped.length}`, name: file.name, size: file.size, type: file.type, fileDataBase64: base64 });
        }
        if (mapped.length) setFiles((items) => [...items, ...mapped]);
      };

      const complete = () => {
        if (isLocked || !samplePreparations.length) return;
        const now = new Date().toISOString();
        setCompleted(true);
        setCompletedAt(now);
        setShowComplete(false);
        onLockPreparation(parameterId);
        notify(`${config.shortName} preparation marked as complete.`);
      };

      const unlock = async () => {
        if (!canUnlockPreparation) return;
        setUnlocking(true);
        try {
          setCompleted(false);
          setCompletedAt(null);
          onUnlockPreparation(parameterId);
          setShowUnlock(false);
          notify(`${config.shortName} preparation unlocked successfully.`);
        } finally {
          setUnlocking(false);
        }
      };

      const withDefaultSelection = (items: SimpleEnvironmentCalculation[], preparations: SimpleEnvironmentSamplePreparation[]) =>
        items.map((item) => ({ ...item, selectedSamplePreparationLabel: item.selectedSamplePreparationLabel ?? preparations[0]?.label ?? null }));

      useImperativeHandle(ref, () => ({
        getDraft: () => ({ samplePreparations, files, calculations, completed, completedAt }),
        loadDraft: (draft) => {
          if (!draft || typeof draft !== "object") return;
          const value = draft as Partial<ModuleData>;
          const restoredPreparations = Array.isArray(value.samplePreparations)
            ? value.samplePreparations.map((item, index) => restoreSimpleSamplePreparation(config, item, index))
            : [];
          const restoredCalculations = Array.isArray(value.calculations)
            ? value.calculations.map((item, index) => restoreSimpleCalculation(config, item, index))
            : [];
          setSamplePreparations(restoredPreparations);
          setFiles(Array.isArray(value.files) ? value.files : []);
          setCalculations(withDefaultSelection(restoredCalculations, restoredPreparations));
          setCompleted(Boolean(value.completed));
          setCompletedAt(normalizeDate(value.completedAt));
        },
        restoreFromWorksheet: async (worksheet) => {
          if (!worksheet || typeof worksheet !== "object") return;
          const value = worksheet as { preparations?: unknown[]; calculations?: unknown[]; preparationCompletedAt?: unknown };
          const restoredPreparations = (value.preparations ?? [])
            .filter((item) => normalizeType((item as Record<string, unknown>)?.preparationType) === normalizeType(config.preparationType))
            .map((item, index) => restoreSimpleSamplePreparation(config, {
              ...(item as object),
              steps: parseUnknown((item as Record<string, unknown>).steps),
            }, index));
          const restoredCalculations = (value.calculations ?? [])
            .filter((item) => normalizeType((item as Record<string, unknown>)?.calculationType) === normalizeType(config.calculationType))
            .map((item, index) => restoreSimpleCalculation(config, parseUnknown((item as Record<string, unknown>).data), index));
          setSamplePreparations(restoredPreparations);
          setCalculations(withDefaultSelection(restoredCalculations, restoredPreparations));
          setFiles([]);
          setCompleted(Boolean(value.preparationCompletedAt));
          setCompletedAt(normalizeDate(value.preparationCompletedAt));
        },
      }), [samplePreparations, files, calculations, completed, completedAt]);

      return (
        <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/30 to-white pb-8 shadow-2xl">
          <div className="bg-gradient-to-r from-white via-white to-emerald-50 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900">
                  <BiTestTube className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-900">{config.title}</h2>
                  <p className="text-sm text-emerald-600">{config.subtitle}</p>
                </div>
              </div>
              <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
                {samplePreparations.length} Preparations
              </div>
            </div>
          </div>

          <SamplePreparationSection
            title={`Sample Preparations for ${config.shortName}`}
            preparations={samplePreparations}
            isLocked={locked}
            onAddPreparation={addPreparation}
            onRemovePreparation={(_, index) => removePreparation(index)}
            renderPreparation={(preparation, index) => (
              <SimpleEnvironmentSamplePreparationDetail
                config={config}
                samplePreparation={preparation}
                onStepChange={updateStep}
                onRemove={() => removePreparation(index)}
                isLocked={locked}
              />
            )}
          />

          {samplePreparations.length > 0 && (
            <>
              <div className="mx-6 mb-6">
                <FileAttachmentSection
                  files={files}
                  isLocked={locked}
                  title={`Attach ${config.shortName} Preparation Files (PDF)`}
                  maxFiles={10}
                  onAttachFiles={addFiles}
                  onRemoveFile={(_, index) => setFiles((items) => items.filter((__, i) => i !== index))}
                />
              </div>
              <div className="mx-6">
                <PreparationCompleteSection
                  preparationName={config.shortName}
                  isCompleted={completed}
                  isLocked={locked}
                  completedAt={completedAt}
                  canUnlockPreparation={canUnlockPreparation}
                  onComplete={() => setShowComplete(true)}
                  onUnlock={() => setShowUnlock(true)}
                />
              </div>
              {completed && (
                <SimpleEnvironmentCalculationSection
                  config={config}
                  calculations={calculations}
                  samplePreparations={samplePreparations}
                  canEditCalculations={canEditCalculations}
                  onAdd={() => setCalculations((items) => [...items, {
                    ...createSimpleCalculation(config, items.length),
                    selectedSamplePreparationLabel: samplePreparations[0]?.label ?? null,
                  }])}
                  onRemove={(id) => setCalculations((items) => items.filter((item) => item.id !== id))}
                  onUpdate={(value) => setCalculations((items) => items.map((item) => item.id === value.id ? value : item))}
                />
              )}
            </>
          )}

          <PreparationCompleteModal
            isOpen={showComplete}
            preparationName={config.shortName}
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
          <PreparationToast
            visible={toast.visible}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast((value) => ({ ...value, visible: false }))}
          />
        </div>
      );
    },
  );
  Module.displayName = ComponentName;
  return Module;
}
