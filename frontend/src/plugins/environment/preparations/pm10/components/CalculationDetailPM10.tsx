import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationPM10 } from "../models/CalculationPM10";
import type { SamplePreparationPM10 } from "../models/SamplePreparationPM10";
import { calculatePM10 } from "../calculation";

const text = (value: unknown) => (value == null ? "" : String(value));

const truncateToThreeDecimals = (value: number) => Math.round((value + Number.EPSILON) * 1000) / 1000;

const numberOrNull = (value: unknown) => {
  const parsed = Number(text(value).trim());
  return text(value).trim() === "" || !Number.isFinite(parsed) ? null : parsed;
};

const normalizeStepName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const step = (
  preparation: SamplePreparationPM10 | null,
  names: string[],
) => {
  if (!preparation) return undefined;
  const normalizedNames = names.map(normalizeStepName);
  return preparation.steps.find((item) => {
    const actual = normalizeStepName(item.name);
    return normalizedNames.some(
      (expected) => actual === expected || actual.includes(expected) || expected.includes(actual),
    );
  });
};

interface Props {
  calculation: CalculationPM10;
  samplePreparations: SamplePreparationPM10[];
  onUpdate: (calculation: CalculationPM10) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function CalculationDetailPM10({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked,
}: Props) {
  const [expanded, setExpanded] = useState(true);

  // Always resolve a preparation. Older drafts can contain a missing or stale
  // selectedSamplePreparationLabel, which previously made Calculate Result a no-op.
  const selected = useMemo(
    () =>
      samplePreparations.find(
        (item) => item.label === calculation.selectedSamplePreparationLabel,
      ) ?? samplePreparations[0] ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const find = (names: string[]) => step(selected, names)?.value1 ?? "";
    return {
      averageFlowRate: find(["Average Flow Rate"]),
      samplingTime: find(["Total Sampling Time"]),
      initialWeight: find(["Initial weight of Filter"]),
      finalWeight: find(["Final weight of Filter"]),
    };
  }, [selected]);

  const requiredKeys = ["averageFlowRate", "samplingTime", "initialWeight", "finalWeight"] as const;
  const errors = requiredKeys
    .filter((key) => text(values[key]).trim() === "" || numberOrNull(values[key]) === null)
    .map((key) => `${key === "averageFlowRate" ? "Average flow rate" : key === "samplingTime" ? "Total sampling time" : key === "initialWeight" ? "Initial weight of filter" : "Final weight of filter"} is required and must be numeric`)
    .concat(
      numberOrNull(values.averageFlowRate) !== null && numberOrNull(values.averageFlowRate)! <= 0 ? ["Average flow rate must be greater than zero"] : [],
      numberOrNull(values.samplingTime) !== null && numberOrNull(values.samplingTime)! <= 0 ? ["Total sampling time must be greater than zero"] : [],
      numberOrNull(values.initialWeight) !== null && numberOrNull(values.initialWeight)! < 0 ? ["Initial filter weight cannot be negative"] : [],
      numberOrNull(values.finalWeight) !== null && numberOrNull(values.finalWeight)! < 0 ? ["Final filter weight cannot be negative"] : [],
      numberOrNull(values.initialWeight) !== null && numberOrNull(values.finalWeight) !== null && numberOrNull(values.finalWeight)! < numberOrNull(values.initialWeight)! ? ["Final filter weight cannot be less than initial weight"] : [],
    );

  const update = <K extends keyof CalculationPM10>(
    field: K,
    value: CalculationPM10[K],
  ) => onUpdate({ ...calculation, [field]: value });

  const runCalculation = () => {
    // Calculation must remain executable when the sample preparation is locked.
    // Locking prevents editing preparation inputs; it must not prevent calculating
    // already-entered values.
    if (!selected || errors.length > 0) return;

    const result = calculatePM10(values);
    if (!result.success) return;
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
  const passed =
    resultNumber !== null &&
    (minimum === null || resultNumber >= minimum) &&
    (maximum === null || resultNumber <= maximum);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="font-semibold"
        >
          {calculation.label} · PM10
        </button>

        <div className="flex gap-2">
          <button type="button" onClick={() => setExpanded((value) => !value)}>
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>
          <button type="button" disabled={isLocked} onClick={onRemove}>
            <Trash2 />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 p-6">
          <div className="rounded-lg border border-emerald-200 p-4">
            <label className="mb-2 block text-sm font-bold">
              Select Sample Preparation
            </label>
            <CustomDropdown
              options={samplePreparations.map((item) => ({
                value: item.label,
                label: item.label,
              }))}
              value={calculation.selectedSamplePreparationLabel ?? ""}
              onChange={(value) =>
                onUpdate({
                  ...calculation,
                  selectedSamplePreparationLabel: value || null,
                  calculationResult: null,
                })
              }
              colorScheme="emerald"
              disabled={isLocked}
            />
          </div>

          {selected && (
            <>
              <div className="rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-xs">
                PM10 (µg/m³) = ((W2 − W1) × 1000000) / (Q × t)
              </div>

              {errors.length > 0 && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4" role="alert">
                  <h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4>
                  <ul className="space-y-1">
                    {errors.map((error) => (
                      <li key={error} className="text-xs text-red-700">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border border-emerald-200 p-4">
                <h4 className="mb-3 font-bold">Acceptance Limit</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input
                    disabled={isLocked}
                    value={text(calculation.acceptanceLimitMin)}
                    onChange={(event) =>
                      update("acceptanceLimitMin", event.target.value)
                    }
                    placeholder="Minimum Limit"
                    className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500"
                  />
                  <input
                    disabled={isLocked}
                    value={text(calculation.acceptanceLimitMax)}
                    onChange={(event) =>
                      update("acceptanceLimitMax", event.target.value)
                    }
                    placeholder="Maximum Limit"
                    className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  disabled={!selected || errors.length > 0}
                  onClick={runCalculation}
                  className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Calculate Result
                </button>
              </div>

              {calculation.calculationResult !== null && (
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                    PM10 Result
                  </div>
                  <div className="flex items-center gap-3 p-4 text-2xl font-bold">
                    <span>
                      {calculation.calculationResult == null ? "" : text(truncateToThreeDecimals(calculation.calculationResult))} {calculation.calculationResultUnit || "µg/m³"}
                    </span>
                    {hasLimits && (
                      <span
                        className={`rounded-full border px-3 py-1 text-sm ${
                          passed
                            ? "border-green-300 bg-green-100 text-green-800"
                            : "border-red-300 bg-red-100 text-red-800"
                        }`}
                      >
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
