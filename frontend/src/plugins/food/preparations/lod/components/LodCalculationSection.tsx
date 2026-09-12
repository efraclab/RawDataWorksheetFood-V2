import React, { useMemo, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Trash2,
  XCircle,
} from "lucide-react";
import type { CalculationLod } from "../models/CalculationLod";
import type { SamplePreparationLod } from "../models/SamplePreparationLod";
import { calculateLod } from "../calculation";
import CustomDropdown from "../../../../../shared/CustomDropdown";

interface Props {
  calculations: CalculationLod[];
  samplePreparations: SamplePreparationLod[];
  /** Preparation lock must NOT lock calculations. */
  isLocked: boolean;
  /** This is the actual calculation edit permission. */
  canEditCalculations: boolean;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onChange: (
    id: number,
    field: keyof CalculationLod,
    value: string | null
  ) => void;
}

const massToG = (value: string, unit: string): number => {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return 0;

  switch (unit.toLowerCase().trim()) {
    case "mg":
    case "milligram":
      return n / 1000;
    case "kg":
    case "kilogram":
      return n * 1000;
    default:
      return n;
  }
};

const validate = (prep?: SamplePreparationLod): string[] => {
  if (!prep) return ["Please select a Sample Preparation"];

  const errors: string[] = [];
  const required = [
    "Weight of Empty Dish",
    "Weight of Sample + Dish",
    "Weight of Sample + Dish after Drying",
  ];

  for (const name of required) {
    const step = prep.steps.find((s) => s.name === name);
    if (!step) {
      errors.push(`Sample Preparation: ${name} step is missing`);
      continue;
    }

    const raw = String(step.value1 ?? "").trim();
    const value = Number.parseFloat(raw);

    if (!raw || !Number.isFinite(value) || value === 0) {
      errors.push(
        `Sample Preparation - ${name}: Weight value is required and must be a valid non-zero number`
      );
    }
  }

  return errors;
};

const LodCalculationSection: React.FC<Props> = ({
  calculations,
  samplePreparations,
  isLocked: _isLocked,
  canEditCalculations,
  onAdd,
  onRemove,
  onChange,
}) => {
  // IMPORTANT:
  // Preparation locking and calculation editing are separate permissions.
  // A completed/locked preparation exposes the calculation section and the
  // calculation editor remains enabled when canEditCalculations is true.
  const calculationDisabled = !canEditCalculations;

  return (
    <section className="mt-8 pb-10">
      <div className="mx-6 flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
        <div className="rounded-lg border border-emerald-300/50 bg-emerald-100 px-4 py-2 shadow-sm">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            CALCULATIONS
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
      </div>

      <div className="mx-6 rounded-2xl border border-emerald-200 bg-white/70 p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-3 text-lg font-bold text-emerald-900">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-emerald-600 to-emerald-900" />
            Calculations for LOD
          </h3>

          <button
            type="button"
            onClick={onAdd}
            disabled={calculationDisabled}
            className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-base leading-none">+</span>
            Add Calculation
          </button>
        </div>

        {calculations.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12 text-center shadow-inner">
            <Calculator className="mx-auto h-10 w-10 text-emerald-400" />
            <p className="mb-1 mt-3 text-base font-semibold text-emerald-800">
              No LOD calculations added yet
            </p>
            <p className="text-xs text-emerald-600/80">
              Click &quot;Add Calculation&quot; to begin
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {calculations.map((calculation) => (
              <LodCalculationCard
                key={calculation.id}
                calculation={calculation}
                samplePreparations={samplePreparations}
                disabled={calculationDisabled}
                onRemove={() => onRemove(calculation.id)}
                onChange={(field, value) =>
                  onChange(calculation.id, field, value)
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

interface CardProps {
  calculation: CalculationLod;
  samplePreparations: SamplePreparationLod[];
  disabled: boolean;
  onRemove: () => void;
  onChange: (
    field: keyof CalculationLod,
    value: string | null
  ) => void;
}

const LodCalculationCard: React.FC<CardProps> = ({
  calculation,
  samplePreparations,
  disabled,
  onRemove,
  onChange,
}) => {
  const [expanded, setExpanded] = useState(true);

  const selected = samplePreparations.find(
    (preparation) =>
      preparation.label === calculation.selectedSamplePreparationLabel
  );

  const errors = useMemo(() => validate(selected), [selected]);

  const weights = useMemo(() => {
    const find = (name: string) =>
      selected?.steps.find((step) => step.name === name);

    const w1 = find("Weight of Empty Dish");
    const w2 = find("Weight of Sample + Dish");
    const w3 = find("Weight of Sample + Dish after Drying");

    return {
      w1: w1?.value1 ?? "",
      u1: w1?.unit1 ?? "g",
      w2: w2?.value1 ?? "",
      u2: w2?.unit1 ?? "g",
      w3: w3?.value1 ?? "",
      u3: w3?.unit1 ?? "g",
    };
  }, [selected]);

  const handlePreparationChange = (value: string) => {
    onChange("selectedSamplePreparationLabel", value || null);
    // A preparation change invalidates the previous result.
    onChange("calculationResult", null);
    onChange("calculationResultUnit", null);
  };

  const performCalculation = () => {
    if (disabled) return;

    if (errors.length > 0) {
      onChange("calculationResult", `Error: ${errors[0]}`);
      onChange("calculationResultUnit", null);
      return;
    }

    const result = calculateLod({
      w1: weights.w1,
      w2: weights.w2,
      w3: weights.w3,
      w1Unit: weights.u1,
      w2Unit: weights.u2,
      w3Unit: weights.u3,
    });

    onChange("w1", result.w1 ?? null);
    onChange("w2", result.w2 ?? null);
    onChange("w3", result.w3 ?? null);
    onChange(
      "calculationResult",
      result.success
        ? result.result
        : result.error ?? "Error: Calculation failed"
    );
    onChange("calculationResultUnit", result.success ? result.unit : null);
  };

  const resultNumber = Number.parseFloat(calculation.calculationResult ?? "");
  const min = Number.parseFloat(calculation.acceptanceLimitMin ?? "");
  const max = Number.parseFloat(calculation.acceptanceLimitMax ?? "");
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);
  const hasResult = Number.isFinite(resultNumber);
  const pass =
    hasResult &&
    (!hasMin || resultNumber >= min) &&
    (!hasMax || resultNumber <= max);

  const W1 = massToG(weights.w1, weights.u1);
  const W2 = massToG(weights.w2, weights.u2);
  const W3 = massToG(weights.w3, weights.u3);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900">
        <div className="flex items-center justify-between px-4 py-3 text-white">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="flex min-w-0 flex-1 items-center gap-4 text-left"
          >
            <span className="rounded-lg border border-white/30 bg-white/20 p-2">
              <Calculator className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">
                {calculation.label}
              </span>
              <span className="block text-xs text-emerald-100">
                Calculation for Residue on Ignition
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="rounded-lg p-2 transition-colors hover:bg-white/20"
              aria-label={expanded ? "Collapse calculation" : "Expand calculation"}
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="rounded-lg border border-white/30 bg-white/20 p-2 transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
              title={`Remove ${calculation.label}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="bg-gradient-to-b from-white via-white to-slate-50">
          {/* V1 validation position: immediately below calculation header. */}
          {errors.length > 0 ? (
            <div className="border-b-2 border-red-200 bg-red-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
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
              </div>
            </div>
          ) : selected ? (
            <div className="border-b-2 border-emerald-200 bg-emerald-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-800">
                  All required fields are valid - Ready to calculate
                </p>
              </div>
            </div>
          ) : null}

          <div className="space-y-6 p-6">
            {/* Select Sample Preparation */}
            <div className="rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-slate-50 p-4">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Select Sample Preparation
              </label>
              <CustomDropdown
                options={samplePreparations.map((preparation) => ({
                  value: preparation.label,
                  label: preparation.label,
                }))}
                value={calculation.selectedSamplePreparationLabel ?? ""}
                onChange={handlePreparationChange}
                placeholder="Select sample preparation..."
                colorScheme="emerald"
                disabled={disabled}
              />
            </div>

            {/* V1 formula layout */}
            {selected && (
              <div className="rounded-lg border-2 border-emerald-200 bg-white p-4 shadow-sm">
                <h4 className="mb-3 text-sm font-bold text-slate-900">
                  Formula for LOD/Water (Loss on Drying)
                </h4>

                <div className="mb-3 rounded bg-slate-50 p-3">
                  <div className="flex flex-col items-center">
                    <div className="w-full border-b-2 border-black px-2 pb-2 text-center">
                      <p className="break-words text-xs font-mono text-black">
                        (Weight of Sample + bottle in g W2) - (Weight of Sample + bottle after in Drying W3)
                      </p>
                    </div>
                    <div className="w-full px-2 pt-2 text-center">
                      <p className="break-words text-xs font-mono text-black">
                        (Weight of Sample + bottle in g W2) - (Weight of empty bottle in g W1)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded bg-emerald-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-black">=</span>
                    <div className="flex flex-1 flex-col items-center">
                      <div className="w-full border-b-2 border-black px-2 pb-2 text-center">
                        <p className="break-words text-xs font-mono text-black">
                          ({W2.toFixed(4)} - {W3.toFixed(4)})
                        </p>
                      </div>
                      <div className="w-full px-2 pt-2 text-center">
                        <p className="break-words text-xs font-mono text-black">
                          ({W2.toFixed(4)} - {W1.toFixed(4)})
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-black">
                      X 100
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-right text-xs font-semibold text-slate-600">
                  = %
                </p>
              </div>
            )}

            {/* Acceptance Limit - text inputs, no number spinners */}
            {selected && (
              <div className="rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-slate-50 p-4">
                <h5 className="mb-3 text-sm font-bold text-slate-700">
                  Acceptance Limit
                </h5>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    disabled={disabled}
                    value={calculation.acceptanceLimitMin ?? ""}
                    onChange={(event) =>
                      onChange("acceptanceLimitMin", event.target.value)
                    }
                    placeholder="Enter min limit"
                    className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                  />
                  <span className="shrink-0 text-xs font-semibold text-slate-500">
                    to
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    disabled={disabled}
                    value={calculation.acceptanceLimitMax ?? ""}
                    onChange={(event) =>
                      onChange("acceptanceLimitMax", event.target.value)
                    }
                    placeholder="Enter max limit"
                    className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                  />
                </div>
              </div>
            )}

            {selected && (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  disabled={disabled || errors.length > 0}
                  onClick={performCalculation}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:via-emerald-700 hover:to-emerald-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Calculator className="h-4 w-4" />
                  Calculate Result
                </button>
              </div>
            )}

            {!selected && (
              <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-3 text-center">
                <p className="text-xs font-medium text-emerald-800">
                  Please select a sample preparation to enable calculation
                </p>
              </div>
            )}

            {calculation.calculationResult && (
              <div className="border-t-2 border-emerald-200 pt-5">
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300 bg-white shadow-lg">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                    <h6 className="text-sm font-bold text-white">
                      LOD/Water Result
                    </h6>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <p className="text-2xl font-bold text-slate-800">
                      {calculation.calculationResult}
                      {!calculation.calculationResult.startsWith("Error") &&
                        ` ${calculation.calculationResultUnit ?? ""}`}
                    </p>
                    {(hasMin || hasMax) && hasResult &&
                      !calculation.calculationResult.startsWith("Error") && (
                        <span
                          className={`rounded-full border px-3 py-1 text-sm font-bold ${
                            pass
                              ? "border-green-300 bg-green-100 text-green-800"
                              : "border-red-300 bg-red-100 text-red-800"
                          }`}
                        >
                          {pass ? "Pass" : "Fail"}
                        </span>
                      )}
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-600">Sample Prep</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {calculation.selectedSamplePreparationLabel || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LodCalculationSection;
