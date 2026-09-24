import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationNO2Stack } from "../models/CalculationNO2Stack";
import type { SamplePreparationNO2Stack } from "../models/SamplePreparationNO2Stack";
import { calculateNO2Stack } from "../calculation";

const text = (value: unknown) => (value == null ? "" : String(value));
const numberOrNull = (value: unknown) => {
  const parsed = Number(text(value).trim());
  return text(value).trim() === "" || !Number.isFinite(parsed) ? null : parsed;
};
const normalizeStepName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const step = (preparation: SamplePreparationNO2Stack | null, names: string[]) => {
  if (!preparation) return undefined;
  const normalizedNames = names.map(normalizeStepName);
  return preparation.steps.find((item) => {
    const actual = normalizeStepName(item.name);
    return normalizedNames.some((expected) => actual === expected || actual.includes(expected) || expected.includes(actual));
  });
};

interface Props {
  calculation: CalculationNO2Stack;
  samplePreparations: SamplePreparationNO2Stack[];
  onUpdate: (calculation: CalculationNO2Stack) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function CalculationDetailNO2Stack({ calculation, samplePreparations, onUpdate, onRemove, isLocked }: Props) {
  const [expanded, setExpanded] = useState(true);
  const selected = useMemo(
    () => samplePreparations.find((item) => item.label === calculation.selectedSamplePreparationLabel) ?? samplePreparations[0] ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const find = (names: string[]) => step(selected, names)?.value1 ?? "";
    return {
      as: find(["Absorbance of sample"]),
      ab: find(["Absorbance of blank"]),
      f: find(["Dilution factor"]),
      kc: find(["Spectrophotometer calibration factor"]),
      aliquotFactor: find(["50/25 the aliquot factor"]),
      vbc: find(["Sample volume at standard condition"]),
    };
  }, [selected]);

  const errors = [
    text(values.as).trim() === "" || numberOrNull(values.as) === null ? "Absorbance of sample is required and must be numeric" : "",
    text(values.ab).trim() === "" || numberOrNull(values.ab) === null ? "Absorbance of blank is required and must be numeric" : "",
    text(values.f).trim() === "" || numberOrNull(values.f) === null ? "Dilution factor is required and must be numeric" : "",
    text(values.kc).trim() === "" || numberOrNull(values.kc) === null ? "Spectrophotometer calibration factor is required and must be numeric" : "",
    text(values.aliquotFactor).trim() === "" || numberOrNull(values.aliquotFactor) === null ? "50/25 the aliquot factor is required and must be numeric" : "",
    text(values.vbc).trim() === "" || numberOrNull(values.vbc) === null ? "Sample volume at standard condition is required and must be numeric" : "",
  ].filter(Boolean) as string[];
  if (numberOrNull(values.as) !== null && numberOrNull(values.as)! < 0) errors.push("Absorbance of sample cannot be negative");
  if (numberOrNull(values.ab) !== null && numberOrNull(values.ab)! < 0) errors.push("Absorbance of blank cannot be negative");
  if (numberOrNull(values.f) !== null && numberOrNull(values.f)! <= 0) errors.push("Dilution factor must be greater than zero");
  if (numberOrNull(values.kc) !== null && numberOrNull(values.kc)! <= 0) errors.push("Spectrophotometer calibration factor must be greater than zero");
  if (numberOrNull(values.aliquotFactor) !== null && numberOrNull(values.aliquotFactor)! <= 0) errors.push("50/25 the aliquot factor must be greater than zero");
  if (numberOrNull(values.vbc) !== null && numberOrNull(values.vbc)! <= 0) errors.push("Sample volume at standard condition must be greater than zero");

  const update = <K extends keyof CalculationNO2Stack>(field: K, value: CalculationNO2Stack[K]) => onUpdate({ ...calculation, [field]: value });

  const runCalculation = () => {
    if (!selected || errors.length > 0) return;
    const result = calculateNO2Stack({
      as: values.as,
      ab: values.ab,
      f: values.f,
      kc: values.kc,
      aliquotFactor: values.aliquotFactor,
      vbc: values.vbc
    });
    if (!result.success) return;
    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      calculationResult: result.result,
      calculationResultUnit: "mg/Nm\u00b3",
    });
  };

  const resultNumber = numberOrNull(calculation.calculationResult);
  const minimum = numberOrNull(calculation.acceptanceLimitMin);
  const maximum = numberOrNull(calculation.acceptanceLimitMax);
  const hasLimits = minimum !== null || maximum !== null;
  const passed = resultNumber !== null && (minimum === null || resultNumber >= minimum) && (maximum === null || resultNumber <= maximum);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button type="button" onClick={() => setExpanded((value) => !value)} className="font-semibold">
          {calculation.label} · NO₂ Stack
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => setExpanded((value) => !value)}>{expanded ? <ChevronUp /> : <ChevronDown />}</button>
          <button type="button" disabled={isLocked} onClick={onRemove}><Trash2 /></button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 p-6">
          <div className="rounded-lg border border-emerald-200 p-4">
            <label className="mb-2 block text-sm font-bold">Select Sample Preparation</label>
            <CustomDropdown
              options={samplePreparations.map((item) => ({ value: item.label, label: item.label }))}
              value={calculation.selectedSamplePreparationLabel ?? ""}
              onChange={(value) => onUpdate({ ...calculation, selectedSamplePreparationLabel: value || null, calculationResult: null })}
              colorScheme="emerald"
              disabled={isLocked}
            />
          </div>

          {selected && (
            <>
              <div className="rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-xs">
                C = ((As − Ab) × Kc × 1000 × 2 × F) / Vbc
              </div>
              {errors.length > 0 && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4" role="alert">
                  <h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4>
                  <ul className="space-y-1">
                    {errors.map((error) => <li key={error} className="text-xs text-red-700">• {error}</li>)}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border border-emerald-200 p-4">
                <h4 className="mb-3 font-bold">Acceptance Limit</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input disabled={isLocked} value={text(calculation.acceptanceLimitMin)} onChange={(event) => update("acceptanceLimitMin", event.target.value)} placeholder="Minimum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500" />
                  <input disabled={isLocked} value={text(calculation.acceptanceLimitMax)} onChange={(event) => update("acceptanceLimitMax", event.target.value)} placeholder="Maximum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              <div className="text-center">
                <button type="button" disabled={errors.length > 0} onClick={runCalculation} className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                  Calculate Result
                </button>
              </div>

              {calculation.calculationResult !== null && (
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                    NO₂ Concentration
                  </div>
                  <div className="flex items-center gap-3 p-4 text-2xl font-bold">
                    <span>{text(calculation.calculationResult)} {calculation.calculationResultUnit || "mg/Nm\u00b3"}</span>
                    {hasLimits && (
                      <span className={`rounded-full border px-3 py-1 text-sm ${passed ? "border-green-300 bg-green-100 text-green-800" : "border-red-300 bg-red-100 text-red-800"}`}>
                        {passed ? "Pass" : "Fail"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
