import { forwardRef, useImperativeHandle, useState } from "react";
import { BiTestTube } from "react-icons/bi";
import { Trash2 } from "lucide-react";
import type { PreparationModuleHandle } from "../../../../../core/preparation/ui/PreparationModuleHandle";
import type { PreparationAttachedFile } from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import FileAttachmentSection from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import PreparationCompleteModal from "../../../../../core/preparation-engine/components/PreparationCompleteModal";
import PreparationCompleteSection from "../../../../../core/preparation-engine/components/PreparationCompleteSection";
import PreparationToast from "../../../../../core/preparation-engine/components/PreparationToast";
import SamplePreparationSection from "../../../../../core/preparation-engine/components/SamplePreparationSection";
import UnlockPreparationDialog from "../../../../../core/preparation-engine/components/UnlockPreparationDialog";
import type { SamplePreparationMBAS, SamplePreparationMBASStep } from "../models/SamplePreparationMBAS";
import type { CalculationMBAS } from "../models/CalculationMBAS";
import { createCalculationMBAS, createSamplePreparationMBAS, restoreCalculationMBAS } from "../factory";
import MBASCalculationSection from "./MBASCalculationSection";

type ModuleData = {
  samplePreparations: SamplePreparationMBAS[];
  files: PreparationAttachedFile[];
  calculations: CalculationMBAS[];
  completed: boolean;
  completedAt: string | null;
};

export interface MBASPreparationModuleProps {
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

const parseUnknown = (value: unknown): unknown => {
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return value; }
};

const normalizeDate = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value : null;

const restorePreparation = (value: unknown, index: number): SamplePreparationMBAS => {
  const source = (value && typeof value === "object" ? value : {}) as Partial<SamplePreparationMBAS>;
  const steps = Array.isArray(source.steps) ? source.steps : createSamplePreparationMBAS(index).steps;
  return {
    ...createSamplePreparationMBAS(index),
    ...source,
    id: typeof source.id === "number" ? source.id : index + 1,
    label: typeof source.label === "string" ? source.label : `Sample Preparation ${index + 1}`,
    steps: steps as SamplePreparationMBASStep[],
  };
};

const MBASPreparationModule = forwardRef<PreparationModuleHandle<ModuleData, unknown>, MBASPreparationModuleProps>(
  (props, ref) => {
    const {
      parameterId, parameterName, parameterCode, isLocked,
      canUnlockPreparation = false, canEditCalculations = false,
      onLockPreparation, onUnlockPreparation,
    } = props;

    const [samplePreparations, setSamplePreparations] = useState<SamplePreparationMBAS[]>([]);
    const [files, setFiles] = useState<PreparationAttachedFile[]>([]);
    const [calculations, setCalculations] = useState<CalculationMBAS[]>([]);
    const [completed, setCompleted] = useState(false);
    const [completedAt, setCompletedAt] = useState<string | null>(null);
    const [showComplete, setShowComplete] = useState(false);
    const [showUnlock, setShowUnlock] = useState(false);
    const [unlocking, setUnlocking] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" | "info" }>({
      visible: false, message: "", type: "success",
    });

    const locked = isLocked || completed;
    const notify = (message: string, type: "success" | "error" | "info" = "success") =>
      setToast({ visible: true, message, type });

    const addPreparation = () => {
      if (locked || samplePreparations.length >= 10) return;
      setSamplePreparations((items) => [...items, createSamplePreparationMBAS(items.length)]);
      notify("MBAS sample preparation added.");
    };

    const removePreparation = (index: number) => {
      if (locked) return;
      setSamplePreparations((items) =>
        items.filter((_, i) => i !== index).map((item, i) => ({
          ...item, id: i + 1, label: `Sample Preparation ${i + 1}`,
        })),
      );
      setCalculations((items) => items.map((item) => {
        if (item.selectedSamplePreparationLabel !== `Sample Preparation ${index + 1}`) return item;
        return { ...item, selectedSamplePreparationLabel: null, calculationResult: null };
      }));
    };

    const updateStep = (preparationId: number, stepName: string, field: keyof SamplePreparationMBASStep, value: string) => {
      if (locked) return;
      setSamplePreparations((items) => items.map((item) =>
        item.id !== preparationId ? item : {
          ...item,
          steps: item.steps.map((step) => step.name !== stepName ? step : { ...step, [field]: value }),
        },
      ));
      setCalculations((items) => items.map((item) => ({ ...item, calculationResult: null })));
    };

    const addFiles = async (selected: File[]) => {
      if (locked) return;
      const mapped: PreparationAttachedFile[] = [];
      for (const file of selected.slice(0, Math.max(0, 10 - files.length))) {
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          notify(`${file.name} is not a PDF.`, "error"); continue;
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
      setCompleted(true); setCompletedAt(now); setShowComplete(false);
      onLockPreparation(parameterId);
      notify("MBAS preparation marked as complete.");
    };

    const unlock = async () => {
      if (!canUnlockPreparation) return;
      setUnlocking(true);
      try {
        setCompleted(false); setCompletedAt(null);
        onUnlockPreparation(parameterId); setShowUnlock(false);
        notify("MBAS preparation unlocked successfully.");
      } finally { setUnlocking(false); }
    };

    const withDefaultSelection = (items: CalculationMBAS[], preparations: SamplePreparationMBAS[]) =>
      items.map((item) => ({
        ...item,
        selectedSamplePreparationLabel: item.selectedSamplePreparationLabel ??
          preparations[0]?.label ?? null,
      }));

    useImperativeHandle(ref, () => ({
      getDraft: () => ({ samplePreparations, files, calculations, completed, completedAt }),
      loadDraft: (draft) => {
        if (!draft || typeof draft !== "object") return;
        const value = draft as Partial<ModuleData>;
        const restoredPreparations = Array.isArray(value.samplePreparations)
          ? value.samplePreparations.map((item, index) => restorePreparation(item, index)) : [];
        const restoredCalculations = Array.isArray(value.calculations)
          ? value.calculations.map((item) => restoreCalculationMBAS(item)) : [];
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
          .filter((item) => String((item as Record<string, unknown>)?.preparationType ?? "").toLowerCase() === "mbas")
          .map((item, index) => restorePreparation({ ...(item as object), steps: parseUnknown((item as Record<string, unknown>).steps) }, index));
        const restoredCalculations = (value.calculations ?? [])
          .filter((item) => String((item as Record<string, unknown>)?.calculationType ?? "").toLowerCase() === "mbas")
          .map((item) => {
            const source = item as Record<string, unknown>;
            const data = parseUnknown(source.data);
            return restoreCalculationMBAS(data);
          });
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
                <h2 className="text-2xl font-bold text-emerald-900">Anionic Surface Active Agents (as MBAS) Analysis</h2>
                <p className="text-sm text-emerald-600">Water Laboratory • MBAS Testing</p>
              </div>
            </div>
            <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
              {samplePreparations.length} Preparations
            </div>
          </div>
        </div>

        <SamplePreparationSection
          title="Sample Preparations for Anionic Surface Active Agents (as MBAS)"
          preparations={samplePreparations}
          isLocked={locked}
          onAddPreparation={addPreparation}
          onRemovePreparation={(_, index) => removePreparation(index)}
          renderPreparation={(preparation, index) => (
            <div className="mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-white">
              <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
                <div>
                  <div className="font-semibold">{preparation.label}</div>
                  <div className="text-xs text-emerald-100">Anionic Surface Active Agents (as MBAS) inputs</div>
                </div>
                <button type="button" disabled={locked} onClick={() => removePreparation(index)} className="disabled:opacity-40" aria-label={`Remove ${preparation.label}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5">
                {preparation.steps.map((step) => (
                  <div key={step.name} className="grid items-center gap-3 rounded-lg border border-emerald-200 bg-white p-3 md:grid-cols-[minmax(0,1fr)_220px_70px]">
                    <label className="text-sm font-semibold text-emerald-900">{step.name}</label>
                    <input disabled={locked} value={step.value1 ?? ""} onChange={(event) => updateStep(preparation.id, step.name, "value1", event.target.value)} inputMode="decimal" placeholder="Enter value" className="rounded-lg border border-emerald-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                    <span className="text-xs font-semibold text-slate-500">{step.unit1 || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        />

        {samplePreparations.length > 0 && <>
          <div className="mx-6 mb-6">
            <FileAttachmentSection files={files} isLocked={locked} title="Attach Anionic Surface Active Agents (as MBAS) Preparation Files (PDF)" maxFiles={10} onAttachFiles={addFiles} onRemoveFile={(_, index) => setFiles((items) => items.filter((__, i) => i !== index))} />
          </div>
          <div className="mx-6">
            <PreparationCompleteSection preparationName="Anionic Surface Active Agents (as MBAS)" isCompleted={completed} isLocked={locked} completedAt={completedAt} canUnlockPreparation={canUnlockPreparation} onComplete={() => setShowComplete(true)} onUnlock={() => setShowUnlock(true)} />
          </div>
          {completed && <MBASCalculationSection calculations={calculations} samplePreparations={samplePreparations} canEditCalculations={canEditCalculations} onAdd={() => {
                        setCalculations((items) => [...items, { ...createCalculationMBAS(items.length), selectedSamplePreparationLabel: samplePreparations[0]?.label ?? null }]);
          }} onRemove={(id) => setCalculations((items) => items.filter((item) => item.id !== id))} onUpdate={(value) => setCalculations((items) => items.map((item) => item.id === value.id ? value : item))} />}
        </>}

        <PreparationCompleteModal isOpen={showComplete} preparationName="Anionic Surface Active Agents (as MBAS)" parameterName={parameterName} parameterCode={parameterCode} onConfirm={complete} onCancel={() => setShowComplete(false)} />
        <UnlockPreparationDialog isOpen={showUnlock} isUnlocking={unlocking} parameterName={parameterName ?? ""} parameterCode={parameterCode ?? ""} onClose={() => setShowUnlock(false)} onConfirm={unlock} />
        <PreparationToast visible={toast.visible} type={toast.type} message={toast.message} onClose={() => setToast((value) => ({ ...value, visible: false }))} />
      </div>
    );
  },
);

MBASPreparationModule.displayName = "MBASPreparationModule";
export default MBASPreparationModule;
