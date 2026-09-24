import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CustomDropdown from "../../../../shared/CustomDropdown";
import type { SimpleEnvironmentCalculation, SimpleEnvironmentSamplePreparation } from "../../_shared/types";
import { calculateTotalFluorideStack } from "../calculation";
import { totalFlurideStackConfig } from "../config";

const text = (value: unknown) => (value == null ? "" : String(value));
const numberOrNull = (value: unknown) => {
  const raw = text(value).trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};
const normalize = (value: unknown) => text(value).trim().toLowerCase().replace(/[^a-z0-9]/g, "");

interface Props {
  calculation: SimpleEnvironmentCalculation;
  samplePreparations: SimpleEnvironmentSamplePreparation[];
  onUpdate: (calculation: SimpleEnvironmentCalculation) => void;
  onRemove: () => void;
  isLocked: boolean;
  canEditCalculations: boolean;
}

export default function CalculationDetailTotalFlurideStack({
  calculation, samplePreparations, onUpdate, onRemove, isLocked, canEditCalculations,
}: Props) {
  const [expanded, setExpanded] = useState(true);

  const selected = useMemo(
    () => samplePreparations.find((item) => item.label === calculation.selectedSamplePreparationLabel)
      ?? samplePreparations[0] ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const result: Record<string, string> = {};
    totalFlurideStackConfig.fields.forEach((field) => {
      const step = selected?.steps.find((item) => normalize(item.name) === normalize(field.name));
      result[field.key] = step?.value1 ?? "";
    });

    // Ft is derived and must never come from persisted/manual input.
    const m = numberOrNull(result.m);
    const vd = numberOrNull(result.vd);
    result.ft = m !== null && vd !== null ? String(m * vd) : "";
    return result;
  }, [selected]);

  const errors = totalFlurideStackConfig.fields
    .filter((field) => field.readOnly || field.compute ? false : numberOrNull(values[field.key]) === null)
    .map((field) => `${field.name} is required and must be numeric`);

  const liveCalculation = useMemo(
    () => errors.length ? { success: false, result: null as number | null } : calculateTotalFluorideStack(values),
    [values, errors.length],
  );

  // Do not allow an old persisted result (for example 1 mg/m³) to remain visible
  // after the preparation inputs have changed. The displayed/persisted result is
  // always synchronized with the current Excel-equivalent calculation.
  useEffect(() => {
    if (!liveCalculation.success || liveCalculation.result === null) {
      if (calculation.calculationResult !== null) {
        onUpdate({ ...calculation, calculationResult: null });
      }
      return;
    }
    const current = calculation.calculationResult;
    if (current === null || Math.abs(current - liveCalculation.result) > 1e-12) {
      onUpdate({
        ...calculation,
        selectedSamplePreparationLabel: selected?.label ?? calculation.selectedSamplePreparationLabel,
        calculationResult: liveCalculation.result,
        calculationResultUnit: totalFlurideStackConfig.resultUnit,
      });
    }
  }, [liveCalculation, calculation, onUpdate, selected]);

  const update = <K extends keyof SimpleEnvironmentCalculation>(field: K, value: SimpleEnvironmentCalculation[K]) =>
    onUpdate({ ...calculation, [field]: value });

  const runCalculation = () => {
    if (!selected || errors.length || !liveCalculation.success || liveCalculation.result === null) return;
    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      calculationResult: liveCalculation.result,
      calculationResultUnit: totalFlurideStackConfig.resultUnit,
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
          {calculation.label} · {totalFlurideStackConfig.shortName}
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
              onChange={(value) => onUpdate({ ...calculation, selectedSamplePreparationLabel: value || null, calculationResult: null })}
              colorScheme="emerald"
              disabled={isLocked || !canEditCalculations}
            />
          </div>

          <div className="rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-sm font-semibold text-slate-700">
            {totalFlurideStackConfig.formula}
          </div>

          {errors.length > 0 && (
            <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4" role="alert">
              <h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4>
              <ul className="space-y-1">{errors.map((error) => <li key={error} className="text-xs text-red-700">• {error}</li>)}</ul>
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
            <button type="button" disabled={!selected || errors.length > 0} onClick={runCalculation} className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
              Calculate Result
            </button>
          </div>

          {result !== null && (
            <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
              <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                {totalFlurideStackConfig.shortName} Result
              </div>
              <div className="flex items-center gap-3 p-4 text-2xl font-bold text-slate-900">
                <span>{result} {calculation.calculationResultUnit || totalFlurideStackConfig.resultUnit}</span>
                {hasLimits && <span className={`rounded-full border px-3 py-1 text-sm ${passed ? "border-green-300 bg-green-100 text-green-800" : "border-red-300 bg-red-100 text-red-800"}`}>{passed ? "Pass" : "Fail"}</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
