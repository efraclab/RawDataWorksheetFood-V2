import { forwardRef, useImperativeHandle, useState } from "react";
import type { ReactNode } from "react";
import { BiTestTube } from "react-icons/bi";
import { ChevronUp, Trash2, Calculator } from "lucide-react";

import type { PreparationModuleHandle } from "../../../../../core/preparation/ui/PreparationModuleHandle";
import type { PreparationAttachedFile } from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import SamplePreparationSection from "../../../../../core/preparation-engine/components/SamplePreparationSection";
import FileAttachmentSection from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import PreparationCompleteSection from "../../../../../core/preparation-engine/components/PreparationCompleteSection";
import PreparationCompleteModal from "../../../../../core/preparation-engine/components/PreparationCompleteModal";
import UnlockPreparationDialog from "../../../../../core/preparation-engine/components/UnlockPreparationDialog";
import PreparationToast from "../../../../../core/preparation-engine/components/PreparationToast";

import type { FormulaConfig } from "../config";
import type { FormulaModuleData, FormulaModuleDraft, FormulaStep, SamplePreparationFormula } from "../models";
import {
  FORMULA_STEP_NAMES,
  createSamplePreparationFormula,
  getRowStepName,
  restoreSamplePreparationFormula,
  runFormula,
  summarizeCells,
  withResult,
} from "../factory";

export interface FormulaPreparationModuleProps {
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

type ModuleProps = FormulaPreparationModuleProps & { config: FormulaConfig };

const inputClass =
  "w-full rounded-lg border border-emerald-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-100";

const parseSteps = (value: unknown): FormulaStep[] => {
  if (Array.isArray(value)) return value as FormulaStep[];
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as FormulaStep[]) : [];
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

const FormulaSampleCard = ({
  config,
  preparation,
  disabled,
  onRemove,
  onChange,
}: {
  config: FormulaConfig;
  preparation: SamplePreparationFormula;
  disabled: boolean;
  onRemove: () => void;
  onChange: (stepIndex: number, patch: Partial<FormulaStep>) => void;
}) => {
  const n = FORMULA_STEP_NAMES;

  const find = (name: string) => {
    const index = preparation.steps.findIndex((s) => s.name === name);
    return { index, step: preparation.steps[index] as FormulaStep | undefined };
  };

  const textField = (name: string, type: "text" | "date" = "text", label: string = name) => {
    const { index, step } = find(name);
    if (!step) return null;
    return (
      <div key={name}>
        <FieldLabel>{label}</FieldLabel>
        <input
          type={type}
          value={step.value1 ?? ""}
          disabled={disabled}
          onChange={(e) => onChange(index, { value1: e.target.value })}
          className={inputClass}
        />
      </div>
    );
  };

  const output = runFormula(config, preparation);

  return (
    <div className="group relative z-20">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-700/20 to-slate-900/20 blur-xl" />
      <div className="relative mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-white/95">
        <div className="relative rounded-t-lg bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-1 items-center gap-4">
              <div className="rounded-lg border border-white/30 bg-white/20 p-2">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide text-white">{preparation.label}</h4>
                <p className="text-xs text-emerald-100">Sample Preparation for {config.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById(`${config.key}-prep-${preparation.id}`);
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

        <div id={`${config.key}-prep-${preparation.id}`} className="space-y-5 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5">
          <div className="rounded-xl border border-emerald-200/60 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-emerald-900">{config.testName}</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(n.nature)}
              {textField(n.media)}
              {textField(n.quantity)}
              {textField(n.method)}
              {textField(n.instrument)}
              <div />
              {textField(n.started, "date")}
              {textField(n.completed, "date")}
              {(config.headerTextSteps ?? []).map((h) => textField(h.name))}
            </div>
          </div>

          {config.tables.map((table) => (
            <div key={table.key} className="rounded-xl border border-emerald-200/60 bg-white p-4">
              <div className="mb-3 text-sm font-bold text-emerald-900">{table.title}</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left font-semibold text-slate-600" />
                      {table.columns.map((column) => (
                        <th key={column} className="px-1 py-1 text-center font-semibold text-slate-600">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row) => {
                      const name = getRowStepName(table, row);
                      const { index, step } = find(name);
                      if (!step) return null;
                      return (
                        <tr key={name}>
                          <td className="whitespace-nowrap px-2 py-1 font-semibold text-emerald-900">{row}</td>
                          {table.columns.map((column, c) => (
                            <td key={column} className="px-1 py-1">
                              <input
                                type="text"
                                value={step.cells?.[c] ?? ""}
                                disabled={disabled}
                                aria-label={`${name} ${column}`}
                                onChange={(e) => {
                                  const cells = [...(step.cells ?? [])];
                                  while (cells.length < table.columns.length) cells.push("");
                                  cells[c] = e.target.value;
                                  onChange(index, { cells, value1: summarizeCells(table, cells) });
                                }}
                                className="w-20 rounded-lg border border-emerald-300 px-2 py-1.5 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-100"
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {(config.fields ?? []).length > 0 && (
            <div className="grid grid-cols-1 gap-3 rounded-xl border border-emerald-200/60 bg-white p-4 md:grid-cols-2">
              {(config.fields ?? []).map((f) => textField(f.label))}
            </div>
          )}

          <div className="rounded-xl border border-emerald-200/60 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-emerald-900">Result</div>
            <div className="mb-3 rounded-lg border border-emerald-200 bg-slate-50 p-3 text-center font-mono text-xs">
              {config.formulaText}
            </div>
            {textField(n.observations)}
            <div className="mt-3">
              {output.value !== null ? (
                <div className="rounded-lg border-2 border-emerald-300 px-4 py-3">
                  <div className="text-lg font-bold text-emerald-900">
                    {config.resultLabel}: {output.value} {config.unit}
                  </div>
                  {(output.details ?? []).map((d) => (
                    <div key={d} className="text-sm text-slate-700">
                      {d}
                    </div>
                  ))}
                </div>
              ) : output.error ? (
                <div className="rounded-lg border-2 border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700" role="alert">
                  {output.error}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormulaPreparationModule = forwardRef<
  PreparationModuleHandle<FormulaModuleDraft, unknown>,
  ModuleProps
>((props, ref) => {
  const {
    config,
    parameterId,
    parameterName,
    parameterCode,
    isLocked,
    canUnlockPreparation = false,
    onLockPreparation,
    onUnlockPreparation,
  } = props;

  const persistenceType = config.persistenceType.toLowerCase();

  const [samplePreparations, setSamplePreparations] = useState<SamplePreparationFormula[]>([]);
  const [files, setFiles] = useState<PreparationAttachedFile[]>([]);
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
      createSamplePreparationFormula(config, current.length),
    ]);
    notify(`${config.title} sample preparation added.`);
  };

  const removePreparation = (index: number) => {
    if (preparationDataLocked) return;
    setSamplePreparations((current) =>
      current
        .filter((_, i) => i !== index)
        .map((p, i) => ({ ...p, id: i + 1, label: `Sample Preparation ${i + 1}` })),
    );
  };

  const updateStep = (preparationIndex: number, stepIndex: number, patch: Partial<FormulaStep>) => {
    if (preparationDataLocked) return;
    setSamplePreparations((current) =>
      current.map((p, i) =>
        i !== preparationIndex
          ? p
          : withResult(config, {
              ...p,
              steps: p.steps.map((s, j) => (j !== stepIndex ? s : { ...s, ...patch })),
            }),
      ),
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
        type: file.type,
        fileDataBase64: base64,
      });
    }
    if (mapped.length) setFiles((current) => [...current, ...mapped]);
  };

  const openComplete = () => {
    const missing = samplePreparations.filter((p) => runFormula(config, p).value === null);
    if (missing.length) {
      notify(`Result cannot be calculated for: ${missing.map((p) => p.label).join(", ")}.`, "error");
      return;
    }
    setShowComplete(true);
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
      onUnlockPreparation(parameterId);
      setShowUnlock(false);
      notify(`${config.title} preparation unlocked successfully.`);
    } finally {
      setUnlocking(false);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      getDraft: (): FormulaModuleDraft => ({
        samplePreparations,
        files,
        calculations: [],
        completed,
        completedAt,
      }),

      loadDraft: (draft) => {
        if (!draft || typeof draft !== "object") return;
        const value = draft as Partial<FormulaModuleData>;
        setSamplePreparations(
          Array.isArray(value.samplePreparations)
            ? value.samplePreparations.map((item, index) =>
                restoreSamplePreparationFormula(config, item, index),
              )
            : [],
        );
        setFiles(Array.isArray(value.files) ? value.files : []);
        setCompleted(Boolean(value.completed));
        setCompletedAt(normalizeCompletedAt(value.completedAt));
      },

      restoreFromWorksheet: async (worksheet) => {
        if (!worksheet || typeof worksheet !== "object") return;
        const parameter = worksheet as { preparations?: unknown[]; files?: unknown[] };

        type PreparationRecord = Record<string, unknown>;
        const own = Array.isArray(parameter.preparations)
          ? (parameter.preparations as PreparationRecord[]).filter(
              (item) =>
                item &&
                typeof item === "object" &&
                String(item.preparationType ?? "").trim().toLowerCase() === persistenceType &&
                String(item.preparationCategory ?? "sample").trim().toLowerCase() === "sample",
            )
          : [];

        setSamplePreparations(
          own.map((item, index) =>
            restoreSamplePreparationFormula(config, { ...item, steps: parseSteps(item.steps) }, index),
          ),
        );

        setFiles(
          Array.isArray(parameter.files)
            ? (parameter.files as PreparationRecord[])
                .filter(
                  (item) =>
                    item &&
                    typeof item === "object" &&
                    String(item.preparationType ?? "").trim().toLowerCase() === persistenceType,
                )
                .map(
                  (item, index) =>
                    ({
                      id: typeof item.id === "number" ? item.id : `${Date.now()}-${index}`,
                      name: String(item.fileName ?? item.name ?? `${config.title}-${index + 1}.pdf`),
                      type: "application/pdf",
                      fileDataBase64:
                        typeof item.fileDataBase64 === "string" ? item.fileDataBase64 : null,
                    }) satisfies PreparationAttachedFile,
                )
            : [],
        );

        // Completion comes only from THIS test's own records (same rule as plate count).
        const done = own.find((item) => Boolean(item.isPreparationCompleted)) ?? null;
        setCompleted(Boolean(done));
        setCompletedAt(normalizeCompletedAt(done?.completedAt ?? null));
      },
    }),
    [config, persistenceType, samplePreparations, files, completed, completedAt],
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
              <h2 className="text-2xl font-bold text-emerald-900">{config.title}</h2>
              <p className="text-sm text-emerald-600">
                Micro Laboratory • {config.testName} • Raw Data & Calculation
              </p>
            </div>
          </div>
          <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
            {samplePreparations.length} Preparations
          </div>
        </div>
      </div>

      <SamplePreparationSection<SamplePreparationFormula>
        title={`Sample Preparations for ${config.title}`}
        preparations={samplePreparations}
        isLocked={preparationDataLocked}
        onAddPreparation={addPreparation}
        onRemovePreparation={(_, index) => removePreparation(index)}
        renderPreparation={(preparation, index) => (
          <FormulaSampleCard
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
                setFiles((current) => current.filter((__, fileIndex) => fileIndex !== index))
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
              onComplete={openComplete}
              onUnlock={() => setShowUnlock(true)}
            />
          </div>

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

FormulaPreparationModule.displayName = "FormulaPreparationModule";

/** Returns the module component for one test, with its config bound. */
export function createFormulaModule(config: FormulaConfig) {
  const Module = forwardRef<
    PreparationModuleHandle<FormulaModuleDraft, unknown>,
    FormulaPreparationModuleProps
  >((props, ref) => <FormulaPreparationModule ref={ref} config={config} {...props} />);
  Module.displayName = `${config.title}PreparationModule`;
  return Module;
}

export default FormulaPreparationModule;
