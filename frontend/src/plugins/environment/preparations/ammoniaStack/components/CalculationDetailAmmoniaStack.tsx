import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationAmmoniaStack } from "../models/CalculationAmmoniaStack";
import type { SamplePreparationAmmoniaStack } from "../models/SamplePreparationAmmoniaStack";
import { calculateAmmoniaStack } from "../calculation";

const text = (value: unknown) => (value == null ? "" : String(value));
const numberOrNull = (value: unknown) => {
  const parsed = Number(text(value).trim());
  return text(value).trim() === "" || !Number.isFinite(parsed) ? null : parsed;
};
const normalizeStepName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const step = (preparation: SamplePreparationAmmoniaStack | null, names: string[]) => {
  if (!preparation) return undefined;
  const normalizedNames = names.map(normalizeStepName);
  return preparation.steps.find((item) => {
    const actual = normalizeStepName(item.name);
    return normalizedNames.some((expected) => actual === expected || actual.includes(expected) || expected.includes(actual));
  });
};

interface Props {
  calculation: CalculationAmmoniaStack;
  samplePreparations: SamplePreparationAmmoniaStack[];
  onUpdate: (calculation: CalculationAmmoniaStack) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function CalculationDetailAmmoniaStack({ calculation, samplePreparations, onUpdate, onRemove, isLocked }: Props) {
  const [expanded, setExpanded] = useState(true);
  const selected = useMemo(
    () => samplePreparations.find((item) => item.label === calculation.selectedSamplePreparationLabel) ?? samplePreparations[0] ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const find = (names: string[]) => step(selected, names)?.value1 ?? "";
    return {
      ammoniaEquivalent: find(["mg of ammonia equivalent to 1 ml of 0.02 N sulphuric acid"]),
      v: find(["0.02 N sulphuric acid used for sample"]),
      vb: find(["0.02 N sulphuric acid used for blank"]),
      f: find(["Factor of 0.02 N sulphuric Acid"]),
      vn: find(["Volume of dry gas sample"]),
    };
  }, [selected]);

  const errors = [
    text(values.ammoniaEquivalent).trim() === "" || numberOrNull(values.ammoniaEquivalent) === null ? "Ammonia equivalent is required and must be numeric" : "",
    text(values.v).trim() === "" || numberOrNull(values.v) === null ? "0.02 N sulphuric acid used for sample is required and must be numeric" : "",
    text(values.vb).trim() === "" || numberOrNull(values.vb) === null ? "0.02 N sulphuric acid used for blank is required and must be numeric" : "",
    text(values.f).trim() === "" || numberOrNull(values.f) === null ? "Factor of 0.02 N sulphuric acid is required and must be numeric" : "",
    text(values.vn).trim() === "" || numberOrNull(values.vn) === null ? "Volume of dry gas sample is required and must be numeric" : "",
  ].filter(Boolean) as string[];
  if (numberOrNull(values.v) !== null && numberOrNull(values.v)! < 0) errors.push("0.02 N sulphuric acid used for sample cannot be negative");
  if (numberOrNull(values.vb) !== null && numberOrNull(values.vb)! < 0) errors.push("0.02 N sulphuric acid used for blank cannot be negative");
  if (numberOrNull(values.ammoniaEquivalent) !== null && numberOrNull(values.ammoniaEquivalent)! <= 0) errors.push("Ammonia equivalent must be greater than zero");
  if (numberOrNull(values.f) !== null && numberOrNull(values.f)! <= 0) errors.push("Factor of 0.02 N sulphuric acid must be greater than zero");
  if (numberOrNull(values.vn) !== null && numberOrNull(values.vn)! <= 0) errors.push("Volume of dry gas sample must be greater than zero");

  const update = <K extends keyof CalculationAmmoniaStack>(field: K, value: CalculationAmmoniaStack[K]) => onUpdate({ ...calculation, [field]: value });

  const runCalculation = () => {
    if (!selected || errors.length > 0) return;
    const result = calculateAmmoniaStack({
      ammoniaEquivalent: values.ammoniaEquivalent,
      v: values.v,
      vb: values.vb,
      f: values.f,
      vn: values.vn
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
          {calculation.label} · Ammonia Stack
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
                C = 0.34 × (V − Vb) × f / Vn
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
                    Ammonia Concentration
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
