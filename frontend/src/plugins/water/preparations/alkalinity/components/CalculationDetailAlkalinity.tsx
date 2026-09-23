import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationAlkalinity } from "../models/CalculationAlkalinity";
import type { SamplePreparationAlkalinity } from "../models/SamplePreparationAlkalinity";
import { calculateAlkalinity } from "../calculation";

const text = (value: unknown) => (value == null ? "" : String(value));
const truncateToThreeDecimals = (value: number) => Math.trunc(value * 1000) / 1000;
const numberOrNull = (value: unknown): number | null => {
  const raw = text(value).trim();
  if (raw === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};
const step = (preparation: SamplePreparationAlkalinity | null, name: string) =>
  preparation?.steps.find((item) => item.name.trim().toLowerCase() === name.trim().toLowerCase());

interface Props {
  calculation: CalculationAlkalinity;
  samplePreparations: SamplePreparationAlkalinity[];
  onUpdate: (calculation: CalculationAlkalinity) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function CalculationDetailAlkalinity({ calculation, samplePreparations, onUpdate, onRemove, isLocked }: Props) {
  const [expanded, setExpanded] = useState(true);
  const selected = useMemo(
    () => samplePreparations.find((item) => item.label === calculation.selectedSamplePreparationLabel) ?? samplePreparations[0] ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );
  const values = useMemo(() => ({ sample: step(selected, "Volume of sample")?.value1 ?? "", df: step(selected, "Dilution factor")?.value1 ?? "", acid: step(selected, "Volume of H2SO4")?.value1 ?? "", strength: step(selected, "Strength of H2SO4")?.value1 ?? "" }), [selected]);
  const errors = ["sample", "df", "acid", "strength"].map((key) =>
    text(values[key as keyof typeof values]).trim() === "" || numberOrNull(values[key as keyof typeof values]) === null
      ? `${key} is required and must be numeric`
      : null,
  ).filter((value): value is string => Boolean(value));
  const update = <K extends keyof CalculationAlkalinity>(field: K, value: CalculationAlkalinity[K]) => onUpdate({ ...calculation, [field]: value });
  const runCalculation = () => {
    if (!selected || errors.length > 0) return;
    const result = calculateAlkalinity(values);
    onUpdate({ ...calculation, selectedSamplePreparationLabel: selected.label, calculationResult: result.success ? result.result : null, calculationResultSecondary: result.success ? result.resultSecondary : null, calculationResultUnit: "mg/L" });
  };
  const minimum = numberOrNull(calculation.acceptanceLimitMin);
  const maximum = numberOrNull(calculation.acceptanceLimitMax);
  const hasLimits = minimum !== null || maximum !== null;
  const statusFor = (value: number | null | undefined) => {
    const number = numberOrNull(value);
    if (number === null) return "Fail";
    return (minimum === null || number >= minimum) && (maximum === null || number <= maximum) ? "Pass" : "Fail";
  };

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button type="button" onClick={() => setExpanded((value) => !value)} className="font-semibold focus:outline-none focus:ring-0 focus:ring-0">{calculation.label} · Alkalinity</button>
        <div className="flex gap-2">
          <button type="button" onClick={() => setExpanded((value) => !value)} className="focus:outline-none focus:ring-0 focus:ring-0">{expanded ? <ChevronUp /> : <ChevronDown />}</button>
          <button type="button" disabled={isLocked} onClick={onRemove} className="focus:outline-none focus:ring-0 focus:ring-0"><Trash2 /></button>
        </div>
      </div>
      {expanded && (
        <div className="space-y-5 p-6">
          <div className="rounded-lg border border-emerald-200 p-4">
            <label className="mb-2 block text-sm font-bold">Select Sample Preparation</label>
            <CustomDropdown options={samplePreparations.map((item) => ({ value: item.label, label: item.label }))} value={calculation.selectedSamplePreparationLabel ?? ""} onChange={(value) => onUpdate({ ...calculation, selectedSamplePreparationLabel: value || null, calculationResult: null })} colorScheme="emerald" disabled={isLocked} />
          </div>
          {selected && (
            <>
              <div className="space-y-2 rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-xs leading-6">
                CaCO3 = (Volume of H2SO4 × Strength × 50 × 1000 × DF) / Volume of sample<br />HCO3 = (Volume of H2SO4 × Strength × 61 × 1000 × DF) / Volume of sample
              </div>
              {errors.length > 0 && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4" role="alert">
                  <h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4>
                  <ul className="space-y-1">{errors.map((error) => <li key={error} className="text-xs text-red-700">• {error}</li>)}</ul>
                </div>
              )}
              <div className="rounded-lg border border-emerald-200 p-4">
                <h4 className="mb-3 font-bold">Acceptance Limit</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input disabled={isLocked} value={text(calculation.acceptanceLimitMin)} onChange={(event) => update("acceptanceLimitMin", event.target.value)} placeholder="Minimum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-0 focus:ring-0" />
                  <input disabled={isLocked} value={text(calculation.acceptanceLimitMax)} onChange={(event) => update("acceptanceLimitMax", event.target.value)} placeholder="Maximum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-0 focus:ring-0" />
                </div>
              </div>
              <div className="text-center">
                <button type="button" disabled={!selected} onClick={runCalculation} className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white focus:outline-none focus:ring-0 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50">Calculate Result</button>
              </div>
              {calculation.calculationResult !== null && (
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">Alkalinity Result</div>
                  <div className="divide-y divide-emerald-100 px-4 py-1"><div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-3 border-b border-emerald-100 py-3 last:border-b-0"><span className="w-[270px] shrink-0 font-semibold text-slate-800">Alkalinity (CaCO3)</span><span className="flex items-center gap-2 text-lg font-bold text-slate-900">{text(truncateToThreeDecimals(calculation.calculationResult))} {calculation.calculationResultUnit || "mg/L"} {hasLimits && <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusFor(calculation.calculationResult) === "Pass" ? "border-green-300 bg-green-100 text-green-800" : "border-red-300 bg-red-100 text-red-800"}`}>{statusFor(calculation.calculationResult)}</span>}</span></div><div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-3 border-b border-emerald-100 py-3 last:border-b-0"><span className="w-[270px] shrink-0 font-semibold text-slate-800">Alkalinity (HCO3)</span><span className="flex items-center gap-2 text-lg font-bold text-slate-900">{text(truncateToThreeDecimals(calculation.calculationResultSecondary))} {calculation.calculationResultUnit || "mg/L"} {hasLimits && <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusFor(calculation.calculationResultSecondary) === "Pass" ? "border-green-300 bg-green-100 text-green-800" : "border-red-300 bg-red-100 text-red-800"}`}>{statusFor(calculation.calculationResultSecondary)}</span>}</span></div></div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
