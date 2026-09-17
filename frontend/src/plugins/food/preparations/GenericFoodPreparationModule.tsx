import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { BiTestTube } from "react-icons/bi";
import type { PreparationModuleHandle } from "../../../core/preparation/ui/PreparationModuleHandle";
import SamplePreparationSection from "../../../core/preparation-engine/components/SamplePreparationSection";
import FileAttachmentSection, {
  type PreparationAttachedFile,
} from "../../../core/preparation-engine/components/FileAttachmentSection";
import PreparationCompleteSection from "../../../core/preparation-engine/components/PreparationCompleteSection";
import PreparationCompleteModal from "../../../core/preparation-engine/components/PreparationCompleteModal";
import UnlockPreparationDialog from "../../../core/preparation-engine/components/UnlockPreparationDialog";
import PreparationToast from "../../../core/preparation-engine/components/PreparationToast";

export interface FoodLegacyModuleConfig {
  id: string;
  preparationType: string;
  calculationType: string;
  title: string;
  shortTitle: string;
  sampleDetail?: React.ComponentType<any>;
  calculationDetail: React.ComponentType<any>;
  createSamplePreparation: (index: number) => any;
  createCalculation: (index: number) => any;
  restoreCalculation: (data: any) => any;
}

export interface FoodLegacyModuleProps {
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

export interface FoodLegacyModuleDraft {
  samplePreparations: any[];
  calculations: any[];
  files: PreparationAttachedFile[];
  completed: boolean;
  completedAt: string | null;
}

const parseSteps = (value: unknown): any[] => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseCalculationData = (value: unknown): any => {
  if (value && typeof value === "object") return value;
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const normalize = (value: unknown): string =>
  String(value ?? "").trim().toLowerCase();

const GenericFoodPreparationModule = forwardRef<
  PreparationModuleHandle<FoodLegacyModuleDraft, unknown>,
  FoodLegacyModuleProps & { config: FoodLegacyModuleConfig }
>((props, ref) => {
  const {
    parameterId,
    parameterName,
    parameterCode,
    role,
    isLocked,
    canUnlockPreparation = false,
    canEditCalculations = false,
    onLockPreparation,
    onUnlockPreparation,
    config,
  } = props;

  const [samplePreparations, setSamplePreparations] = useState<any[]>([]);
  const [calculations, setCalculations] = useState<any[]>([]);
  const [files, setFiles] = useState<PreparationAttachedFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
  }>({ visible: false, message: "", type: "success" });

  const preparationLocked = isLocked || completed;

  const notify = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success",
  ) => setToast({ visible: true, message, type });

  const addPreparation = () => {
    if (preparationLocked) return;
    setSamplePreparations((current) => [
      ...current,
      config.createSamplePreparation(current.length),
    ]);
    notify(`${config.shortTitle} sample preparation added.`);
  };

  const removePreparation = (_prep: any, index: number) => {
    if (preparationLocked) return;

    const removedLabel = samplePreparations[index]?.label;
    setSamplePreparations((current) =>
      current
        .filter((_, currentIndex) => currentIndex !== index)
        .map((item, currentIndex) => ({
          ...item,
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
                calculationResultUnit: null,
              }
            : calculation,
        ),
      );
    }
  };

  const handleStepChange = (
    preparationId: number,
    stepName: string,
    field: string,
    value: string,
  ) => {
    if (preparationLocked) return;

    setSamplePreparations((current) =>
      current.map((preparation) =>
        preparation.id !== preparationId
          ? preparation
          : {
              ...preparation,
              steps: (Array.isArray(preparation.steps)
                ? preparation.steps
                : []
              ).map((step: any) =>
                step.name !== stepName
                  ? step
                  : { ...step, [field]: value },
              ),
            },
      ),
    );

    // Changing preparation inputs invalidates any previously calculated
    // result, exactly as the V1 workflow did when source values changed.
    setCalculations((current) =>
      current.map((calculation) => ({
        ...calculation,
        calculationResult: null,
        calculationResultUnit: null,
      })),
    );
  };

  const addFiles = async (selected: File[]) => {
    if (preparationLocked) return;

    const remaining = Math.max(0, 10 - files.length);
    const mapped: PreparationAttachedFile[] = [];

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
        type: file.type || "application/pdf",
        fileDataBase64: base64,
      });
    }

    if (mapped.length) setFiles((current) => [...current, ...mapped]);
  };

  const completePreparation = () => {
    if (isLocked || samplePreparations.length === 0) return;

    const now = new Date().toISOString();
    setCompleted(true);
    setCompletedAt(now);
    setShowComplete(false);
    onLockPreparation(parameterId);
    notify(`${config.shortTitle} preparation marked as complete.`);
  };

  const unlockPreparation = async () => {
    if (!canUnlockPreparation) return;

    setUnlocking(true);
    try {
      setCompleted(false);
      setCompletedAt(null);
      setShowUnlock(false);
      onUnlockPreparation(parameterId);
      notify(`${config.shortTitle} preparation unlocked successfully.`);
    } finally {
      setUnlocking(false);
    }
  };

  const updateCalculation = (
    calculationId: number,
    field: string,
    value: any,
  ) => {
    setCalculations((current) =>
      current.map((calculation) =>
        calculation.id === calculationId
          ? { ...calculation, [field]: value }
          : calculation,
      ),
    );
  };

  const restoreFromWorksheet = (worksheet: unknown) => {
    const parameter = worksheet as any;
    const rawPreparations = Array.isArray(parameter?.preparations)
      ? parameter.preparations
      : [];

    const matchingPreparations = rawPreparations
      .filter(
        (item: any) =>
          normalize(item?.preparationCategory) === "sample" &&
          normalize(item?.preparationType) === normalize(config.preparationType),
      )
      .map((item: any, index: number) => ({
        id: index + 1,
        label: item?.label ?? `Sample Preparation ${index + 1}`,
        steps: parseSteps(item?.steps),
      }));

    const rawFiles = Array.isArray(parameter?.files) ? parameter.files : [];
    const matchingFiles = rawFiles
      .filter(
        (item: any) =>
          normalize(item?.preparationType) === normalize(config.preparationType),
      )
      .map((item: any, index: number) => ({
        id: item?.id ?? index,
        name: item?.fileName ?? item?.name ?? `${config.shortTitle}-${index + 1}.pdf`,
        type: "application/pdf",
        fileDataBase64: item?.fileDataBase64 ?? null,
      }));

    const rawCalculations = Array.isArray(parameter?.calculations)
      ? parameter.calculations
      : [];

    const matchingCalculations = rawCalculations
      .filter(
        (item: any) =>
          normalize(item?.calculationType) === normalize(config.calculationType),
      )
      .map((item: any, index: number) => {
        const data = parseCalculationData(item?.data);
        return {
          ...config.restoreCalculation({
            ...item,
            data,
          }),
          ...data,
          id: data?.id ?? item?.id ?? Date.now() + index,
          label:
            data?.label ??
            item?.label ??
            `Calculation ${index + 1}`,
        };
      });

    const completionValue =
      parameter?.preparationCompletedAt ??
      rawPreparations.find(
        (item: any) =>
          normalize(item?.preparationType) === normalize(config.preparationType) &&
          item?.isPreparationCompleted,
      )?.completedAt ??
      null;

    setSamplePreparations(matchingPreparations);
    setFiles(matchingFiles);
    setCalculations(matchingCalculations);
    setCompleted(Boolean(completionValue));
    setCompletedAt(
      completionValue ? new Date(completionValue).toISOString() : null,
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      getDraft: () => ({
        samplePreparations,
        calculations,
        files,
        completed,
        completedAt,
      }),

      loadDraft: (draft) => {
        const source: any = draft ?? {};
        setSamplePreparations(
          Array.isArray(source.samplePreparations)
            ? source.samplePreparations
            : [],
        );
        setCalculations(
          Array.isArray(source.calculations) ? source.calculations : [],
        );
        setFiles(Array.isArray(source.files) ? source.files : []);
        setCompleted(Boolean(source.completed));
        setCompletedAt(
          typeof source.completedAt === "string"
            ? source.completedAt
            : null,
        );
      },

      restoreFromWorksheet,
    }),
    [samplePreparations, calculations, files, completed, completedAt, config],
  );

  const calculationComponent = config.calculationDetail;
  const sampleComponent = config.sampleDetail;
  const CalculationDetail = calculationComponent;

  const calculationsSection = useMemo(() => {
    if (!completed) return null;

    return (
      <section className="mt-8 pb-10">
        <div className="mx-6 flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
          <div className="rounded-lg border border-emerald-300/50 bg-emerald-100 px-4 py-2 shadow-sm">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              CALCULATIONS
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
        </div>

        <div className="mx-6 rounded-2xl border border-emerald-200 bg-white/70 p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-3 text-lg font-bold text-emerald-900">
              <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-emerald-600 to-emerald-900" />
              Calculations for {config.shortTitle}
            </h3>

            <button
              type="button"
              disabled={!canEditCalculations}
              onClick={() =>
                setCalculations((current) => [
                  ...current,
                  config.createCalculation(current.length),
                ])
              }
              className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-base leading-none">+</span>
              Add Calculation
            </button>
          </div>

          {calculations.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12 text-center shadow-inner">
              <p className="mb-1 text-base font-semibold text-emerald-800">
                No {config.shortTitle} calculations added yet
              </p>
              <p className="text-xs text-emerald-600/80">
                Click &quot;Add Calculation&quot; to begin
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {calculations.map((calculation) => (
                <CalculationDetail
                  key={calculation.id}
                  calculation={calculation}
                  samplePreparations={samplePreparations}
                  onRemove={() =>
                    setCalculations((current) =>
                      current.filter((item) => item.id !== calculation.id),
                    )
                  }
                  onFieldChange={(id: number, field: string, value: any) =>
                    updateCalculation(id, field, value)
                  }
                  role={role}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }, [
    CalculationDetail,
    calculations,
    canEditCalculations,
    completed,
    config,
    role,
    samplePreparations,
  ]);

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
                {config.title}
              </h2>
              <p className="text-sm text-emerald-600">
                {config.shortTitle} • Sample &amp; Calculations
              </p>
            </div>
          </div>
          <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
            {samplePreparations.length} Items
          </div>
        </div>
      </div>

      <SamplePreparationSection
        title={`Sample Preparations for ${config.shortTitle}`}
        preparations={samplePreparations}
        isLocked={preparationLocked}
        onAddPreparation={addPreparation}
        onRemovePreparation={removePreparation}
        renderPreparation={(preparation: any, index: number) =>
          sampleComponent ? (
            React.createElement(sampleComponent, {
              samplePreparation: preparation,
              onStepChange: handleStepChange,
              onRemove: () => removePreparation(preparation, index),
              role,
              isLocked: preparationLocked,
              parameterType: config.preparationType,
            })
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-white p-4 text-sm text-slate-600">
              No sample-preparation renderer has been configured for{" "}
              {config.shortTitle}.
            </div>
          )
        }
      />

      {samplePreparations.length > 0 && (
        <>
          <div className="mx-6 mb-6">
            <FileAttachmentSection
              files={files}
              isLocked={preparationLocked}
              title={`Attach ${config.shortTitle} Preparation Files (PDF)`}
              maxFiles={10}
              onAttachFiles={addFiles}
              onRemoveFile={(_, index) =>
                setFiles((current) =>
                  current.filter((__, currentIndex) => currentIndex !== index),
                )
              }
            />
          </div>

          <div className="mx-6">
            <PreparationCompleteSection
              preparationName={config.shortTitle}
              isCompleted={completed}
              isLocked={preparationLocked}
              completedAt={completedAt}
              canUnlockPreparation={canUnlockPreparation}
              onComplete={() => setShowComplete(true)}
              onUnlock={() => setShowUnlock(true)}
            />
          </div>

          {calculationsSection}

          <PreparationCompleteModal
            isOpen={showComplete}
            preparationName={config.shortTitle}
            parameterName={parameterName}
            parameterCode={parameterCode}
            onConfirm={completePreparation}
            onCancel={() => setShowComplete(false)}
          />

          <UnlockPreparationDialog
            isOpen={showUnlock}
            isUnlocking={unlocking}
            parameterName={parameterName ?? ""}
            parameterCode={parameterCode ?? ""}
            onClose={() => setShowUnlock(false)}
            onConfirm={unlockPreparation}
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

GenericFoodPreparationModule.displayName = "GenericFoodPreparationModule";

export default GenericFoodPreparationModule;
