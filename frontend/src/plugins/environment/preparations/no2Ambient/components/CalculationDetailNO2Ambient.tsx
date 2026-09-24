import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationNO2Ambient } from "../models/CalculationNO2Ambient";
import type { SamplePreparationNO2Ambient } from "../models/SamplePreparationNO2Ambient";
import { calculateNO2Ambient } from "../calculation";

const text = (value: unknown) => (value == null ? "" : String(value));
const numberOrNull = (value: unknown) => {
  const raw = text(value).trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};
const normalize = (value: unknown) => text(value).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
const findStep = (preparation: SamplePreparationNO2Ambient | null, names: string[]) => {
  if (!preparation) return undefined;
  const wanted = names.map(normalize);
  return preparation.steps.find((item) => wanted.includes(normalize(item.name)));
};

interface Props {
  calculation: CalculationNO2Ambient;
  samplePreparations: SamplePreparationNO2Ambient[];
  onUpdate: (calculation: CalculationNO2Ambient) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function CalculationDetailNO2Ambient({ calculation, samplePreparations, onUpdate, onRemove, isLocked }: Props) {
  const [expanded, setExpanded] = useState(true);
  const selected = useMemo(
    () => samplePreparations.find((item) => item.label === calculation.selectedSamplePreparationLabel) ?? samplePreparations[0] ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const find = (names: string[]) => findStep(selected, names)?.value1 ?? "";
    return {
      graphFactor: find(["Graph factor"]),
      sampleAbs: find(["Sample abs"]),
      blankAbs: find(["Blank abs"]),
      dilutionFactor: find(["Dilution factor"]),
      samplingEfficiency: find(["Sampling efficiency"]) || "0.82",
      volumeOfAirSampled: find(["Volume of air sampled"]),
      volumeOfSample: find(["Volume of sample"]),
      volumeOfAliquot: find(["Volume of aliquot taken for analysis"]),
    };
  }, [selected]);

  const errors = [
    ["Graph factor", values.graphFactor],
    ["Sample abs", values.sampleAbs],
    ["Blank abs", values.blankAbs],
    ["Dilution factor", values.dilutionFactor],
    ["Volume of air sampled", values.volumeOfAirSampled],
    ["Volume of sample", values.volumeOfSample],
    ["Volume of aliquot taken for analysis", values.volumeOfAliquot],
  ].filter(([, value]) => numberOrNull(value) === null).map(([name]) => `${name} is required and must be numeric`);

  const update = <K extends keyof CalculationNO2Ambient>(field: K, value: CalculationNO2Ambient[K]) => onUpdate({ ...calculation, [field]: value });

  const runCalculation = () => {
    if (!selected || errors.length > 0) return;
    const result = calculateNO2Ambient(values);
    if (!result.success || result.result === null) return;
    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      calculationResult: result.result,
      calculationResultUnit: "µg/m³",
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
        <button type="button" onClick={() => setExpanded((value) => !value)} className="font-semibold">{calculation.label} · NO2 Ambient</button>
        <div className="flex gap-2">
          <button type="button" onClick={() => setExpanded((value) => !value)}>{expanded ? <ChevronUp /> : <ChevronDown />}</button>
          <button type="button" disabled={isLocked} onClick={onRemove}><Trash2 /></button>
        </div>
      </div>

      {expanded && <div className="space-y-5 p-6">
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

        {selected && <>
          <div className="rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-xs">
            NO2 (µg/m³) = (NO2 × D × VS) / (VA × VT × 0.82)
          </div>

          {errors.length > 0 && <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4" role="alert">
            <h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4>
            <ul className="space-y-1">{errors.map((error) => <li key={error} className="text-xs text-red-700">• {error}</li>)}</ul>
          </div>}

          <div className="rounded-lg border border-emerald-200 p-4">
            <h4 className="mb-3 font-bold">Acceptance Limit</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input disabled={isLocked} value={text(calculation.acceptanceLimitMin)} onChange={(event) => update("acceptanceLimitMin", event.target.value)} placeholder="Minimum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none hover:border-emerald-500 focus:border-emerald-500" />
              <input disabled={isLocked} value={text(calculation.acceptanceLimitMax)} onChange={(event) => update("acceptanceLimitMax", event.target.value)} placeholder="Maximum Limit" className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none hover:border-emerald-500 focus:border-emerald-500" />
            </div>
          </div>

          <div className="text-center"><button type="button" disabled={errors.length > 0} onClick={runCalculation} className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Calculate Result</button></div>

          {calculation.calculationResult !== null && <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
            <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">NO2 Ambient Result</div>
            <div className="flex items-center gap-3 p-4 text-2xl font-bold">
              <span>{resultNumber === null ? "—" : resultNumber.toFixed(3)} {calculation.calculationResultUnit || "µg/m³"}</span>
              {hasLimits && <span className={`rounded-full border px-3 py-1 text-sm ${passed ? "border-green-300 bg-green-100 text-green-800" : "border-red-300 bg-red-100 text-red-800"}`}>{passed ? "Pass" : "Fail"}</span>}
            </div>
          </div>}
        </>}
      </div>}
    </div>
  );
}
