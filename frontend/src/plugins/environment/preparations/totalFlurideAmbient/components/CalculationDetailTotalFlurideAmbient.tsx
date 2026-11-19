import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationTotalFlurideAmbient } from "../models/CalculationTotalFlurideAmbient";
import type { SamplePreparationTotalFlurideAmbient } from "../models/SamplePreparationTotalFlurideAmbient";
import { calculateTotalFlurideAmbient } from "../calculation";

const text = (value: unknown) => (value == null ? "" : String(value));

const truncateToThreeDecimals = (value: number) => Math.round((value + Number.EPSILON) * 1000) / 1000;

const numberOrNull = (value: unknown) => {
  const parsed = Number(text(value).trim());
  return text(value).trim() === "" || !Number.isFinite(parsed) ? null : parsed;
};

const normalizeStepName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const step = (
  preparation: SamplePreparationTotalFlurideAmbient | null,
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
  calculation: CalculationTotalFlurideAmbient;
  samplePreparations: SamplePreparationTotalFlurideAmbient[];
  onUpdate: (calculation: CalculationTotalFlurideAmbient) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function CalculationDetailTotalFlurideAmbient({
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
      totalMicrogramFluoride: find(["Total µgF"]),
      volumeAirSampled: find(["Volume of air sampled"]),
    };
  }, [selected]);

  const errors = [
    text(values.totalMicrogramFluoride).trim() === "" || numberOrNull(values.totalMicrogramFluoride) === null ? "Total µgF is required and must be numeric" : "",
    text(values.volumeAirSampled).trim() === "" || numberOrNull(values.volumeAirSampled) === null ? "Volume of air sampled is required and must be numeric" : "",
  ].filter(Boolean) as string[];
  if (numberOrNull(values.totalMicrogramFluoride) !== null && numberOrNull(values.totalMicrogramFluoride)! < 0) errors.push("Total µgF cannot be negative");
  if (numberOrNull(values.volumeAirSampled) !== null && numberOrNull(values.volumeAirSampled)! <= 0) errors.push("Volume of air sampled must be greater than zero");

  const update = <K extends keyof CalculationTotalFlurideAmbient>(
    field: K,
    value: CalculationTotalFlurideAmbient[K],
  ) => onUpdate({ ...calculation, [field]: value });

  const runCalculation = () => {
    // Calculation must remain executable when the sample preparation is locked.
    // Locking prevents editing preparation inputs; it must not prevent calculating
    // already-entered values.
    if (!selected || errors.length > 0) return;

    const result = calculateTotalFlurideAmbient(values);
    if (!result.success) return;
    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      calculationResult: result.result,
      calculationResultUnit: "mg/m³",
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
          {calculation.label} · Total Fluride Ambient
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
                C(Fluride) = Total µgF / Vs
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
                    Total Fluride Ambient Result
                  </div>
                  <div className="flex items-center gap-3 p-4 text-2xl font-bold">
                    <span>
                      {calculation.calculationResult == null ? "" : text(truncateToThreeDecimals(calculation.calculationResult))} {calculation.calculationResultUnit || "mg/m³"}
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
