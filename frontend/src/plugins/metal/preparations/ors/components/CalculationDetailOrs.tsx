import React, { useMemo, useState } from "react";
import { Calculator, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationOrs } from "../models/CalculationOrs";
import type { SamplePreparationOrs } from "../models/SamplePreparationOrs";
import { calculateOrs } from "../calculation";

export interface CalculationDetailOrsProps {
  calculation: CalculationOrs;
  samplePreparations: SamplePreparationOrs[];
  onUpdate: (calculation: CalculationOrs) => void;
  onRemove: () => void;
  isLocked: boolean;
}

const textValue = (value: unknown): string => value === null || value === undefined ? "" : String(value);
const numeric = (value: unknown): number | null => {
  const raw = textValue(value).trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const step = (preparation: SamplePreparationOrs | null, name: string) =>
  preparation?.steps.find((item) => item.name === name);

const CalculationDetailOrs: React.FC<CalculationDetailOrsProps> = ({
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
    const sample = step(selected, "Instrument Concentration (Sample)");
    const blank = step(selected, "Instrument Concentration (Blank)");
    const sw1 = step(selected, "Sample Weight (SW1)");
    const v1 = step(selected, "Volume Makeup (V1)");
    const v2 = step(selected, "Dilution Factor 1 (V2)");
    const v3 = step(selected, "Dilution Factor 2 (V3)");
    const sachet = step(selected, "Sachet Weight (Avg)");
    const mw = step(selected, "Molecular Weight");
    const claim = step(selected, "Label Claim");

    return {
      sample: sample?.value1 ?? "", sampleUnit: sample?.unit1 ?? "ppm",
      blank: blank?.value1 ?? "", blankUnit: blank?.unit1 ?? "ppm",
      sw1: sw1?.value1 ?? "", sw1Unit: sw1?.unit1 ?? "g",
      v1: v1?.value1 ?? "", v1Unit: v1?.unit1 ?? "ml",
      v2Factor: v2?.value1 ?? "", v2Volume: v2?.value2 ?? "", v2VolumeUnit: v2?.unit2 ?? "ml",
      v3Factor: v3?.value1 ?? "", v3Volume: v3?.value2 ?? "", v3VolumeUnit: v3?.unit2 ?? "ml",
      sachetWeight: sachet?.value1 ?? "", sachetWeightUnit: sachet?.unit1 ?? "g", molecularWeight: mw?.value1 ?? "",
      labelClaimBase: claim?.value1 ?? "", labelClaimValue: claim?.value2 ?? "",
    };
  }, [selected]);

  const errors = useMemo(() => {
    if (!selected) return ["Please select a Sample Preparation"];
    const required: Array<[string, unknown, boolean]> = [
      ["Instrument Concentration (Sample)", values.sample, false],
      ["Instrument Concentration (Blank)", values.blank, false],
      ["Sample Weight (SW1)", values.sw1, true],
      ["Volume Makeup (V1)", values.v1, true],
      ["V2 factor", values.v2Factor, true],
      ["V2 volume", values.v2Volume, true],
      ["V3 factor", values.v3Factor, true],
      ["V3 volume", values.v3Volume, true],
      ["Sachet Weight (Avg)", values.sachetWeight, true],
      ["Molecular Weight", values.molecularWeight, true],
      ["Label Claim first value", values.labelClaimBase, true],
      ["Label Claim second value", values.labelClaimValue, true],
    ];
    return required.flatMap(([label, value, positive]) => {
      const raw = textValue(value).trim();
      if (!raw) return [`${label}: value is required`];
      const n = numeric(value);
      if (n === null) return [`${label}: value must be numeric`];
      if (positive && n <= 0) return [`${label}: value must be greater than 0`];
      if (!positive && n < 0) return [`${label}: value cannot be negative`];
      return [];
    });
  }, [selected, values]);

  const update = <K extends keyof CalculationOrs>(
    field: K,
    value: CalculationOrs[K],
  ) => {
    onUpdate({
      ...calculation,
      [field]: value,
    });
  };

  const handlePreparationChange = (value: string) =>
    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: value || null,
      calculationResult: null,
      calculationResultUnit: "% of L.C.",
    });

  const performCalculation = () => {
    if (isLocked || errors.length || !selected) return;
    const result = calculateOrs({
      instrumentConcentrationSample: values.sample,
      instrumentConcentrationSampleUnit: values.sampleUnit,
      instrumentConcentrationBlank: values.blank,
      instrumentConcentrationBlankUnit: values.blankUnit,
      sampleWeight: values.sw1,
      sampleWeightUnit: values.sw1Unit,
      volumeMakeup: values.v1,
      volumeMakeupUnit: values.v1Unit,
      dilutionFactor1: values.v2Factor,
      dilutionVolume1: values.v2Volume,
      dilutionVolume1Unit: values.v2VolumeUnit,
      dilutionFactor2: values.v3Factor,
      dilutionVolume2: values.v3Volume,
      dilutionVolume2Unit: values.v3VolumeUnit,
      sachetWeight: values.sachetWeight,
      sachetWeightUnit: values.sachetWeightUnit,
      molecularWeight: values.molecularWeight,
      labelClaimBase: values.labelClaimBase,
      labelClaimValue: values.labelClaimValue,
    });

    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      sw1: values.sw1,
      sw1Unit: values.sw1Unit,
      v1: values.v1,
      v1Unit: values.v1Unit,
      v2Factor: values.v2Factor,
      v2Volume: values.v2Volume,
      v2VolumeUnit: values.v2VolumeUnit,
      v3Factor: values.v3Factor,
      v3Volume: values.v3Volume,
      v3VolumeUnit: values.v3VolumeUnit,
      sachetWeight: values.sachetWeight,
      sachetWeightUnit: values.sachetWeightUnit,
      molecularWeight: values.molecularWeight,
      labelClaimBase: values.labelClaimBase,
      labelClaimValue: values.labelClaimValue,
      instrumentConcentrationSample: values.sample,
      instrumentConcentrationSampleUnit: values.sampleUnit,
      instrumentConcentrationBlank: values.blank,
      instrumentConcentrationBlankUnit: values.blankUnit,
      calculationResult: result.success ? result.result : `Error: ${result.error ?? "Calculation failed"}`,
      calculationResultUnit: result.success ? "% of L.C." : "",
    });
  };

  const resultText = textValue(calculation.calculationResult);
  const resultNumber = numeric(calculation.calculationResult);
  const min = numeric(calculation.acceptanceLimitMin);
  const max = numeric(calculation.acceptanceLimitMax);
  const isErrorResult = resultText.startsWith("Error:");
  const pass = resultNumber !== null && !isErrorResult &&
    (min === null || resultNumber >= min) && (max === null || resultNumber <= max);

  const f = (v: unknown) => textValue(v).trim() || "—";

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900">
        <div className="flex items-center justify-between px-4 py-3 text-white">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
            <span className="rounded-lg border border-white/30 bg-white/20 p-2"><Calculator className="h-5 w-5" /></span>
            <span className="min-w-0"><span className="block text-sm font-semibold">{calculation.label}</span><span className="block text-xs text-emerald-100">ORS • ICP-MS (ICH-Q3D)</span></span>
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="rounded-lg p-2 hover:bg-white/20">{expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</button>
            <button type="button" onClick={onRemove} disabled={isLocked} className="rounded-lg border border-white/30 bg-white/20 p-2 hover:bg-white/30 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {expanded && <div className="space-y-6 bg-gradient-to-b from-white via-white to-slate-50 p-6">
        <div className="rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-slate-50 p-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">Select Sample Preparation</label>
          <CustomDropdown
            options={samplePreparations.map((p) => ({ value: p.label, label: p.label }))}
            value={calculation.selectedSamplePreparationLabel ?? ""}
            onChange={handlePreparationChange}
            placeholder="Select sample preparation..."
            colorScheme="emerald"
            disabled={isLocked}
          />
        </div>

        {selected && errors.length > 0 && <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4">
          <h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4>
          <ul className="space-y-1">{errors.map((e) => <li key={e} className="text-xs text-red-700">• {e}</li>)}</ul>
        </div>}

        {selected && (
          <div className="rounded-lg border-2 border-emerald-200 bg-white p-4 shadow-sm">
            <h4 className="mb-3 text-sm font-bold text-slate-900">
              Formula for ORS (Excel)
            </h4>

            <div className="mb-3 rounded bg-slate-50 p-4">
              <div className="flex flex-col items-center">
                <div className="w-full border-b-2 border-black px-2 pb-3 text-center">
                  <p className="break-words text-xs font-mono leading-5 text-black">
                    (Instrument Concentration (Sample) − Instrument Concentration (Blank)) × V1 × V2(volume) × V3(volume) × Sachet Weight (Avg) × Label Claim Base × 1000
                  </p>
                </div>
                <div className="w-full px-2 pt-3 text-center">
                  <p className="break-words text-xs font-mono leading-5 text-black">
                    Sample Weight (SW1) × 1000000 × V2(factor) × V3(factor) × Molecular Weight × Label Claim Value
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-black">=</span>
                <div className="flex flex-1 flex-col items-center">
                  <div className="w-full border-b-2 border-black px-2 pb-3 text-center">
                    <p className="break-words text-xs font-mono leading-5 text-black">
                      ({f(values.sample)} − {f(values.blank)}) × {f(values.v1)} × {f(values.v2Volume)} × {f(values.v3Volume)} × {f(values.sachetWeight)} × {f(values.labelClaimBase)} × 1000
                    </p>
                  </div>
                  <div className="w-full px-2 pt-3 text-center">
                    <p className="break-words text-xs font-mono leading-5 text-black">
                      {f(values.sw1)} × 1000000 × {f(values.v2Factor)} × {f(values.v3Factor)} × {f(values.molecularWeight)} × {f(values.labelClaimValue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-2 text-right text-xs font-semibold text-slate-600">
              = % of L.C.
            </p>
          </div>
        )}

        {selected && (
          <div className="rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-slate-50 p-4">
            <h5 className="mb-3 text-sm font-bold text-slate-700">
              Acceptance Limit
            </h5>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                  Minimum Limit
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  disabled={isLocked}
                  value={textValue(calculation.acceptanceLimitMin)}
                  onChange={(event) =>
                    update("acceptanceLimitMin", event.target.value)
                  }
                  placeholder="Enter min limit"
                  className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                />
              </div>

              <span className="mt-5 shrink-0 text-xs font-semibold text-slate-500">
                to
              </span>

              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                  Maximum Limit
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  disabled={isLocked}
                  value={textValue(calculation.acceptanceLimitMax)}
                  onChange={(event) =>
                    update("acceptanceLimitMax", event.target.value)
                  }
                  placeholder="Enter max limit"
                  className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        )}

        {selected && <div className="flex justify-center">
          <button type="button" disabled={isLocked || errors.length > 0} onClick={performCalculation} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"><Calculator className="h-4 w-4" />Calculate Result</button>
        </div>}

        {!selected && <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-3 text-center"><p className="text-xs font-medium text-emerald-800">Please select a sample preparation to enable calculation</p></div>}

        {resultText && <div className="border-t-2 border-emerald-200 pt-5">
          <div className="overflow-hidden rounded-lg border-2 border-emerald-300 bg-white shadow-lg">
            <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2"><h6 className="text-sm font-bold text-white">ORS Result</h6></div>
            <div className="flex items-center gap-3 p-4">
              <p className={`text-2xl font-bold ${isErrorResult ? "text-red-700" : "text-slate-800"}`}>{resultText}{!isErrorResult && ` ${calculation.calculationResultUnit || "% of L.C."}`}</p>
              {!isErrorResult && (min !== null || max !== null) && resultNumber !== null && <span className={`rounded-full border px-3 py-1 text-sm font-bold ${pass ? "border-green-300 bg-green-100 text-green-800" : "border-red-300 bg-red-100 text-red-800"}`}>{pass ? "Pass" : "Fail"}</span>}
            </div>
          </div>
        </div>}
      </div>}
    </div>
  );
};

export default CalculationDetailOrs;
