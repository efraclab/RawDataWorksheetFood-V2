import React, { useMemo, useState } from "react";
import { Calculator, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationIcpOesWater } from "../models/CalculationIcpOesWater";
import type { SamplePreparationIcpOesWater } from "../models/SamplePreparationIcpOesWater";
import { calculateIcpOesWater } from "../calculation";

export interface CalculationDetailIcpOesWaterProps {
  calculation: CalculationIcpOesWater;
  samplePreparations: SamplePreparationIcpOesWater[];
  onUpdate: (calculation: CalculationIcpOesWater) => void;
  onRemove: () => void;
  isLocked: boolean;
}

const textValue = (value: unknown) => value === null || value === undefined ? "" : String(value);
const numeric = (value: unknown): number | null => {
  const raw = textValue(value).trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const findStep = (preparation: SamplePreparationIcpOesWater | null, name: string) =>
  preparation?.steps.find((step) => step.name === name);

const CalculationDetailIcpOesWater: React.FC<CalculationDetailIcpOesWaterProps> = ({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked,
}) => {
  const [expanded, setExpanded] = useState(true);

  const selected = useMemo(
    () => samplePreparations.find((p) => p.label === calculation.selectedSamplePreparationLabel) ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const sample = findStep(selected, "Instrument Concentration (Sample)");
    const blank = findStep(selected, "Instrument Concentration (Blank)");
    const v1 = findStep(selected, "Dilution Factor 1 (V1)");
    const v2 = findStep(selected, "Dilution Factor 2 (V2)");
    return {
      sample: sample?.value1 ?? "", sampleUnit: sample?.unit1 ?? "ppm",
      blank: blank?.value1 ?? "", blankUnit: blank?.unit1 ?? "ppm",
      v1: v1?.value1 ?? "", v1Unit: v1?.unit1 ?? "ml",
      v2: v2?.value1 ?? "", v2Unit: v2?.unit1 ?? "ml",
    };
  }, [selected]);

  const errors = useMemo(() => {
    if (!selected) return ["Please select a Sample Preparation"];
    const required = [
      ["Instrument Concentration (Sample)", values.sample, false],
      ["Instrument Concentration (Blank)", values.blank, false],
      ["Dilution Factor 1 (V1)", values.v1, true],
      ["Dilution Factor 2 (V2)", values.v2, true],
    ] as const;
    const result: string[] = [];
    for (const [label, value, positive] of required) {
      const raw = textValue(value).trim();
      if (!raw) { result.push(`${label}: value is required`); continue; }
      const n = Number(raw);
      if (!Number.isFinite(n)) result.push(`${label}: value must be numeric`);
      else if (positive && n <= 0) result.push(`${label}: value must be greater than 0`);
      else if (!positive && n < 0) result.push(`${label}: value cannot be negative`);
    }
    return result;
  }, [selected, values]);

  const update = <K extends keyof CalculationIcpOesWater>(field: K, value: CalculationIcpOesWater[K]) =>
    onUpdate({ ...calculation, [field]: value });

  const handlePreparationChange = (value: string) =>
    onUpdate({ ...calculation, selectedSamplePreparationLabel: value || null, calculationResult: null, calculationResultUnit: "mg/L" });

  const performCalculation = () => {
    if (isLocked || errors.length || !selected) return;
    const result = calculateIcpOesWater({
      instrumentConcentrationSample: values.sample,
      instrumentConcentrationSampleUnit: values.sampleUnit,
      instrumentConcentrationBlank: values.blank,
      instrumentConcentrationBlankUnit: values.blankUnit,
      dilutionFactor1: values.v1,
      dilutionFactor1Unit: values.v1Unit,
      dilutionFactor2: values.v2,
      dilutionFactor2Unit: values.v2Unit,
    });
    onUpdate({
      ...calculation,
      instrumentConcentrationSample: values.sample,
      instrumentConcentrationSampleUnit: values.sampleUnit,
      instrumentConcentrationBlank: values.blank,
      instrumentConcentrationBlankUnit: values.blankUnit,
      v1: values.v1,
      v1Unit: values.v1Unit,
      v2: values.v2,
      v2Unit: values.v2Unit,
      calculationResult: result.success ? result.result : `Error: ${result.error ?? "Calculation failed"}`,
      calculationResultUnit: result.success ? "mg/L" : "",
    });
  };

  const resultText = textValue(calculation.calculationResult);
  const resultNumber = numeric(calculation.calculationResult);
  const min = numeric(calculation.acceptanceLimitMin);
  const max = numeric(calculation.acceptanceLimitMax);
  const hasResult = resultNumber !== null;
  const isErrorResult = resultText.startsWith("Error:");
  const hasMin = min !== null;
  const hasMax = max !== null;
  const pass = hasResult && !isErrorResult && (!hasMin || resultNumber! >= min!) && (!hasMax || resultNumber! <= max!);

  const formulaSample = numeric(values.sample);
  const formulaBlank = numeric(values.blank);
  const formulaV1 = textValue(values.v1).trim() || "—";
  const formulaV2 = textValue(values.v2).trim() || "—";

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900">
        <div className="flex items-center justify-between px-4 py-3 text-white">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
            <span className="rounded-lg border border-white/30 bg-white/20 p-2"><Calculator className="h-5 w-5" /></span>
            <span className="min-w-0"><span className="block text-sm font-semibold">{calculation.label}</span><span className="block text-xs text-emerald-100">Calculation for ICP-OES (Water)</span></span>
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="rounded-lg p-2 hover:bg-white/20" aria-label={expanded ? "Collapse calculation" : "Expand calculation"}>{expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</button>
            <button type="button" onClick={onRemove} disabled={isLocked} className="rounded-lg border border-white/30 bg-white/20 p-2 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {expanded && <div className="bg-gradient-to-b from-white via-white to-slate-50"><div className="space-y-6 p-6">
        <div className="rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-slate-50 p-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">Select Sample Preparation</label>
          <CustomDropdown options={samplePreparations.map((p) => ({ value: p.label, label: p.label }))} value={calculation.selectedSamplePreparationLabel ?? ""} onChange={handlePreparationChange} placeholder="Select sample preparation..." colorScheme="emerald" disabled={isLocked} />
        </div>

        {selected && errors.length > 0 && <div className="rounded-lg border-b-2 border-red-200 bg-red-50 px-5 py-4"><div className="flex items-start gap-3"><div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-red-500" /><div><h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4><ul className="space-y-1">{errors.map((error) => <li key={error} className="text-xs text-red-700">• {error}</li>)}</ul></div></div></div>}

        {selected && <div className="rounded-lg border-2 border-emerald-200 bg-white p-4 shadow-sm">
          <h4 className="mb-3 text-sm font-bold text-slate-900">Formula for ICP-OES (Water)</h4>
          <div className="mb-3 rounded bg-slate-50 p-3"><div className="flex flex-col items-center"><div className="w-full border-b-2 border-black px-2 pb-2 text-center"><p className="break-words text-xs font-mono text-black">(Instrument Concentration (Sample) - Instrument Concentration (Blank)) × V1 × V2</p></div><div className="w-full px-2 pt-2 text-center"><p className="break-words text-xs font-mono text-black">1</p></div></div></div>
          <div className="rounded bg-emerald-50 p-3"><div className="flex items-center gap-2"><span className="text-lg font-bold text-black">=</span><div className="flex flex-1 flex-col items-center"><div className="w-full border-b-2 border-black px-2 pb-2 text-center"><p className="break-words text-xs font-mono text-black">({formulaSample ?? "—"} - {formulaBlank ?? "—"}) × {formulaV1} × {formulaV2}</p></div><div className="w-full px-2 pt-2 text-center"><p className="break-words text-xs font-mono text-black">1</p></div></div></div></div>
          <p className="mt-2 text-right text-xs font-semibold text-slate-600">= mg/L</p>
        </div>}

        {selected && <div className="rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-slate-50 p-4"><h5 className="mb-3 text-sm font-bold text-slate-700">Acceptance Limit</h5><div className="flex items-center gap-2"><input type="text" inputMode="decimal" disabled={isLocked} value={textValue(calculation.acceptanceLimitMin)} onChange={(e) => update("acceptanceLimitMin", e.target.value)} placeholder="Enter min limit" className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100" /><span className="shrink-0 text-xs font-semibold text-slate-500">to</span><input type="text" inputMode="decimal" disabled={isLocked} value={textValue(calculation.acceptanceLimitMax)} onChange={(e) => update("acceptanceLimitMax", e.target.value)} placeholder="Enter max limit" className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100" /></div></div>}

        {selected && <div className="flex justify-center pt-1"><button type="button" disabled={isLocked || errors.length > 0} onClick={performCalculation} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"><Calculator className="h-4 w-4" />Calculate Result</button></div>}
        {!selected && <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-3 text-center"><p className="text-xs font-medium text-emerald-800">Please select a sample preparation to enable calculation</p></div>}

        {resultText && <div className="border-t-2 border-emerald-200 pt-5"><div className="overflow-hidden rounded-lg border-2 border-emerald-300 bg-white shadow-lg"><div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2"><h6 className="text-sm font-bold text-white">ICP-OES Result</h6></div><div className="flex items-center gap-3 p-4"><p className={`text-2xl font-bold ${isErrorResult ? "text-red-700" : "text-slate-800"}`}>{resultText}{!isErrorResult && ` ${calculation.calculationResultUnit || "mg/L"}`}</p>{!isErrorResult && (hasMin || hasMax) && hasResult && <span className={`rounded-full border px-3 py-1 text-sm font-bold ${pass ? "border-green-300 bg-green-100 text-green-800" : "border-red-300 bg-red-100 text-red-800"}`}>{pass ? "Pass" : "Fail"}</span>}</div></div><div className="mt-4 rounded-lg border border-slate-200 bg-white p-4"><p className="text-sm font-medium text-slate-600">Sample Prep</p><p className="text-sm font-semibold text-slate-900">{calculation.selectedSamplePreparationLabel || "N/A"}</p></div></div>}
      </div></div>}
    </div>
  );
};

export default CalculationDetailIcpOesWater;
