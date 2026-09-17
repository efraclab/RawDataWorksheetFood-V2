import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationTalc } from "../models/CalculationTalc";
import type { SamplePreparationTalc } from "../models/SamplePreparationTalc";
import { calculateTalc } from "../calculation";

const text = (value: unknown) => (value == null ? "" : String(value));
const numberOrNull = (value: unknown) => {
  const parsed = Number(text(value).trim());
  return text(value).trim() === "" || !Number.isFinite(parsed) ? null : parsed;
};
const step = (preparation: SamplePreparationTalc | null, name: string) =>
  preparation?.steps.find((item) => item.name.trim().toLowerCase() === name.trim().toLowerCase());

interface Props {
  calculation: CalculationTalc;
  samplePreparations: SamplePreparationTalc[];
  onUpdate: (calculation: CalculationTalc) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function CalculationDetailTalc({ calculation, samplePreparations, onUpdate, onRemove, isLocked }: Props) {
  const [expanded, setExpanded] = useState(true);
  const selected = useMemo(
    () => samplePreparations.find((item) => item.label === calculation.selectedSamplePreparationLabel) ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const sample = step(selected, "Instrument Concentration (Sample)");
    const blank = step(selected, "Instrument Concentration (Blank)");
    const v1 = step(selected, "Makeup Volume (V1)");
    const v2 = step(selected, "Dilution Factor 2 (V2)");
    const weight = step(selected, "Weight of Sample (SW)");
    return {
      sample: sample?.value1 ?? "",
      blank: blank?.value1 ?? "",
      v1Factor: v1?.value1 ?? "",
      v1Volume: v1?.value2 ?? "",
      v2Factor: v2?.value1 ?? "",
      v2Volume: v2?.value2 ?? "",
      sampleWeight: weight?.value1 ?? "",
    };
  }, [selected]);

  const requiredKeys = ["sample", "blank", "v1Factor", "v1Volume", "v2Factor", "v2Volume", "sampleWeight"] as const;
  const errors = requiredKeys.filter((key) => text(values[key]).trim() === "" || numberOrNull(values[key]) === null);
  const update = <K extends keyof CalculationTalc>(field: K, value: CalculationTalc[K]) =>
    onUpdate({ ...calculation, [field]: value });

  const runCalculation = () => {
    if (isLocked || !selected || errors.length > 0) return;
    const result = calculateTalc({ ...values, x1: 1 });
    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      instrumentConcentrationSample: values.sample,
      instrumentConcentrationBlank: values.blank,
      sw1: values.sampleWeight,
      v2Factor: values.v1Factor,
      v2Volume: values.v1Volume,
      v3Factor: values.v2Factor,
      v3Volume: values.v2Volume,
      calculationResult: result.success ? result.result : `Error: ${result.error}`,
      calculationResultUnit: "%",
    });
  };

  const resultText = text(calculation.calculationResult);
  const resultNumber = numberOrNull(calculation.calculationResult);
  const minimum = numberOrNull(calculation.acceptanceLimitMin);
  const maximum = numberOrNull(calculation.acceptanceLimitMax);
  const hasLimits = minimum !== null || maximum !== null;
  const passed = resultNumber !== null && (minimum === null || resultNumber >= minimum) && (maximum === null || resultNumber <= maximum);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button type="button" onClick={() => setExpanded((value) => !value)} className="font-semibold">{calculation.label} · TALC</button>
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
                ((Sample − Blank) × V1(volume) × V2(volume) × X1) / (SW × V1(factor) × V2(factor) × 10,000)
              </div>

              <div className="rounded-lg border border-emerald-200 p-4">
                <h4 className="mb-3 font-bold">Acceptance Limit</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input disabled={isLocked} value={text(calculation.acceptanceLimitMin)} onChange={(event) => update("acceptanceLimitMin", event.target.value)} placeholder="Minimum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500" />
                  <input disabled={isLocked} value={text(calculation.acceptanceLimitMax)} onChange={(event) => update("acceptanceLimitMax", event.target.value)} placeholder="Maximum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              <div className="text-center">
                <button type="button" disabled={isLocked || errors.length > 0} onClick={runCalculation} className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Calculate Result</button>
              </div>

              {resultText && (
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">TALC Result</div>
                  <div className="flex items-center gap-3 p-4 text-2xl font-bold">
                    <span>{resultText} %</span>
                    {!resultText.startsWith("Error:") && hasLimits && (
                      <span className={`rounded-full border px-3 py-1 text-sm ${passed ? "border-green-300 bg-green-100 text-green-800" : "border-red-300 bg-red-100 text-red-800"}`}>{passed ? "Pass" : "Fail"}</span>
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
