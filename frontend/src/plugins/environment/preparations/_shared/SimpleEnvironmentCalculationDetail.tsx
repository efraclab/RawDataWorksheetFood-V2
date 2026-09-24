import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import CustomDropdown from "../../../../shared/CustomDropdown";
import type { SimpleEnvironmentCalculation, SimpleEnvironmentConfig, SimpleEnvironmentSamplePreparation } from "./types";

const text = (value: unknown) => (value == null ? "" : String(value));
const numberOrNull = (value: unknown) => {
  const raw = text(value).trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};
const normalize = (value: unknown) => text(value).trim().toLowerCase().replace(/[^a-z0-9]/g, "");

interface Props {
  config: SimpleEnvironmentConfig;
  calculation: SimpleEnvironmentCalculation;
  samplePreparations: SimpleEnvironmentSamplePreparation[];
  onUpdate: (calculation: SimpleEnvironmentCalculation) => void;
  onRemove: () => void;
  isLocked: boolean;
  canEditCalculations: boolean;
}

export default function SimpleEnvironmentCalculationDetail({
  config, calculation, samplePreparations, onUpdate, onRemove, isLocked, canEditCalculations,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const selected = useMemo(
    () => samplePreparations.find((item) => item.label === calculation.selectedSamplePreparationLabel)
      ?? samplePreparations[0] ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const result: Record<string, string> = {};
    const numericValues: Record<string, number> = {};
    config.fields.forEach((field) => {
      const step = selected?.steps.find((item) => normalize(item.name) === normalize(field.name));
      const raw = step?.value1 ?? "";
      const numeric = Number(raw);
      if (Number.isFinite(numeric)) numericValues[field.key] = numeric;
      result[field.key] = raw;
    });
    config.fields.forEach((field) => {
      if (field.compute) result[field.key] = field.compute(numericValues);
    });
    return result;
  }, [config.fields, selected]);

  const errors = config.fields
    .filter((field) => {
      const value = numberOrNull(values[field.key]);
      return value === null;
    })
    .map((field) => `${field.name} is required and must be numeric`);

  const update = <K extends keyof SimpleEnvironmentCalculation>(
    field: K,
    value: SimpleEnvironmentCalculation[K],
  ) => {
    setCalculationError(null);
    onUpdate({ ...calculation, [field]: value });
  };

  const runCalculation = () => {
    setCalculationError(null);

    if (!selected) {
      setCalculationError("Please select a sample preparation before calculating the result.");
      return;
    }

    if (errors.length > 0) {
      setCalculationError("Please correct the validation errors above before calculating the result.");
      return;
    }

    const result = config.calculate(values);
    if (!result.success || result.result === null) {
      setCalculationError(result.error || `Unable to calculate ${config.shortName}.`);
      onUpdate({
        ...calculation,
        selectedSamplePreparationLabel: selected.label,
        calculationResult: null,
        calculationResultUnit: config.resultUnit,
      });
      return;
    }

    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      calculationResult: result.result,
      calculationResultUnit: config.resultUnit,
    });
  };

  const result = numberOrNull(calculation.calculationResult);
  const min = numberOrNull(calculation.acceptanceLimitMin);
  const max = numberOrNull(calculation.acceptanceLimitMax);
  const hasLimits = min !== null || max !== null;
  const passed = result !== null && (min === null || result >= min) && (max === null || result <= max);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button type="button" onClick={() => setExpanded((value) => !value)} className="font-semibold">
          {calculation.label} · {config.shortName}
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => setExpanded((value) => !value)} aria-label="Toggle calculation">
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>
          <button type="button" disabled={isLocked || !canEditCalculations} onClick={onRemove} aria-label="Remove calculation" className="disabled:opacity-40">
            <Trash2 />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 p-6">
          <div className="rounded-lg border border-emerald-200 p-4">
            <label className="mb-2 block text-sm font-bold text-emerald-900">Select Sample Preparation</label>
            <CustomDropdown
              options={samplePreparations.map((item) => ({ value: item.label, label: item.label }))}
              value={calculation.selectedSamplePreparationLabel ?? ""}
              onChange={(value) => { setCalculationError(null); onUpdate({ ...calculation, selectedSamplePreparationLabel: value || null, calculationResult: null }); }}
              colorScheme="emerald"
              disabled={isLocked || !canEditCalculations}
            />
          </div>

          <div className="rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-sm font-semibold text-slate-700">
            {config.formula}
          </div>

          {(errors.length > 0 || calculationError) && (
            <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4" role="alert">
              <h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4>
              {errors.length > 0 && (
                <ul className="space-y-1">
                  {errors.map((error) => <li key={error} className="text-xs text-red-700">• {error}</li>)}
                </ul>
              )}
              {calculationError && <p className="mt-1 text-xs font-semibold text-red-700">• {calculationError}</p>}
            </div>
          )}

          <div className="rounded-lg border border-emerald-200 p-4">
            <h4 className="mb-3 font-bold text-emerald-900">Acceptance Limit</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input disabled={isLocked || !canEditCalculations} value={text(calculation.acceptanceLimitMin)} onChange={(event) => update("acceptanceLimitMin", event.target.value)} placeholder="Minimum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 disabled:bg-slate-50" />
              <input disabled={isLocked || !canEditCalculations} value={text(calculation.acceptanceLimitMax)} onChange={(event) => update("acceptanceLimitMax", event.target.value)} placeholder="Maximum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 disabled:bg-slate-50" />
            </div>
          </div>

          <div className="text-center">
            <button type="button" disabled={isLocked || !canEditCalculations} onClick={runCalculation} className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
              Calculate Result
            </button>
          </div>

          {calculation.calculationResult !== null && (
            <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
              <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                {config.shortName} Result
              </div>
              <div className="flex items-center gap-3 p-4 text-2xl font-bold text-slate-900">
                <span>{Math.round((calculation.calculationResult + Number.EPSILON) * 1000) / 1000} {calculation.calculationResultUnit || config.resultUnit}</span>
                {hasLimits && <span className={`rounded-full border px-3 py-1 text-sm ${passed ? "border-green-300 bg-green-100 text-green-800" : "border-red-300 bg-red-100 text-red-800"}`}>{passed ? "Pass" : "Fail"}</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
