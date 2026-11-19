import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationH2SStack } from "../models/CalculationH2SStack";
import type { SamplePreparationH2SStack } from "../models/SamplePreparationH2SStack";
import { calculateH2SStack } from "../calculation";

const text = (value: unknown) => (value == null ? "" : String(value));

const numberOrNull = (value: unknown) => {
  const parsed = Number(text(value).trim());
  return text(value).trim() === "" || !Number.isFinite(parsed) ? null : parsed;
};

const normalizeStepName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * H2S Stack can contain more than one step with the same normalized name
 * in restored/older worksheet data. Prefer a matching step that actually
 * contains value1 so populated values such as Barometric pressure = 760
 * are not replaced by an earlier empty duplicate.
 */
const step = (
  preparation: SamplePreparationH2SStack | null,
  names: string[],
) => {
  if (!preparation) return undefined;

  const normalizedNames = names.map(normalizeStepName);

  const matches = preparation.steps.filter((item) => {
    const actual = normalizeStepName(item.name);

    return normalizedNames.some(
      (expected) =>
        actual === expected ||
        actual.includes(expected) ||
        expected.includes(actual),
    );
  });

  return (
    matches.find((item) => text(item.value1).trim() !== "") ??
    matches[0]
  );
};

interface Props {
  calculation: CalculationH2SStack;
  samplePreparations: SamplePreparationH2SStack[];
  onUpdate: (calculation: CalculationH2SStack) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function CalculationDetailH2SStack({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked,
}: Props) {
  const [expanded, setExpanded] = useState(true);

  const selected = useMemo(
    () =>
      samplePreparations.find(
        (item) => item.label === calculation.selectedSamplePreparationLabel,
      ) ??
      samplePreparations[0] ??
      null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const find = (names: string[]) => step(selected, names)?.value1 ?? "";

    const pb = find(["Barometric pressure"]);
    const fAq = find(["Aqueous tension"]);

    const pbNumber = numberOrNull(pb);
    const fAqNumber = numberOrNull(fAq);

    const drynessFactor =
      pbNumber !== null &&
      fAqNumber !== null &&
      pbNumber > 0 &&
      pbNumber > fAqNumber
        ? String((pbNumber - fAqNumber) / pbNumber)
        : "";

    return {
      a1: find(["Volume of iodine solution consumed"]),
      b1: find(["Normality of iodine solution"]),
      v: find(["Volume of air sample passed"]),
      pb,
      fAq,
      drynessFactor,
    };
  }, [selected]);

  const errors = [
    text(values.a1).trim() === "" || numberOrNull(values.a1) === null
      ? "Volume of iodine solution consumed is required and must be numeric"
      : "",
    text(values.b1).trim() === "" || numberOrNull(values.b1) === null
      ? "Normality of iodine solution is required and must be numeric"
      : "",
    text(values.v).trim() === "" || numberOrNull(values.v) === null
      ? "Volume of air sample passed is required and must be numeric"
      : "",
    text(values.pb).trim() === "" || numberOrNull(values.pb) === null
      ? "Barometric pressure is required and must be numeric"
      : "",
    text(values.fAq).trim() === "" || numberOrNull(values.fAq) === null
      ? "Aqueous tension is required and must be numeric"
      : "",
  ].filter(Boolean) as string[];

  if (numberOrNull(values.a1) !== null && numberOrNull(values.a1)! < 0) {
    errors.push("Volume of iodine solution consumed cannot be negative");
  }

  if (numberOrNull(values.b1) !== null && numberOrNull(values.b1)! <= 0) {
    errors.push("Normality of iodine solution must be greater than zero");
  }

  if (numberOrNull(values.v) !== null && numberOrNull(values.v)! <= 0) {
    errors.push("Volume of air sample passed must be greater than zero");
  }

  if (numberOrNull(values.pb) !== null && numberOrNull(values.pb)! <= 0) {
    errors.push("Barometric pressure must be greater than zero");
  }

  if (numberOrNull(values.fAq) !== null && numberOrNull(values.fAq)! < 0) {
    errors.push("Aqueous tension cannot be negative");
  }

  if (
    numberOrNull(values.pb) !== null &&
    numberOrNull(values.fAq) !== null &&
    numberOrNull(values.pb)! <= numberOrNull(values.fAq)!
  ) {
    errors.push("Barometric pressure must be greater than aqueous tension");
  }

  const update = <K extends keyof CalculationH2SStack>(
    field: K,
    value: CalculationH2SStack[K],
  ) => onUpdate({ ...calculation, [field]: value });

  const runCalculation = () => {
    if (!selected || errors.length > 0) return;

    const result = calculateH2SStack({
      a1: values.a1,
      b1: values.b1,
      v: values.v,
      pb: values.pb,
      fAq: values.fAq,
    });

    if (!result.success) return;

    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      calculationResult: result.result,
      calculationResultUnit: calculation.calculationResultUnit || "ppm v/v",
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
          {calculation.label} · H₂S Stack
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>

          <button
            type="button"
            disabled={isLocked}
            onClick={onRemove}
          >
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
                F = (Pb − f) / Pb ; H₂S = (12400 × A1 × B1) / (V × F)
              </div>

              {errors.length > 0 && (
                <div
                  className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4"
                  role="alert"
                >
                  <h4 className="mb-2 text-sm font-bold text-red-800">
                    Validation Errors
                  </h4>

                  <ul className="space-y-1">
                    {errors.map((error) => (
                      <li key={error} className="text-xs text-red-700">
                        • {error}
                      </li>
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
                  disabled={errors.length > 0}
                  onClick={runCalculation}
                  className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Calculate Result
                </button>
              </div>

              {calculation.calculationResult !== null && (
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                    H₂S Concentration
                  </div>

                  <div className="flex items-center gap-3 p-4 text-2xl font-bold">
                    <span>
                      {text(calculation.calculationResult)}{" "}
                      {calculation.calculationResultUnit || "ppm v/v"}
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
