import React, { useMemo, useState } from "react";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationAasWater } from "../models/CalculationAasWater";
import type { SamplePreparationAasWater } from "../models/SamplePreparationAasWater";
import { calculateAasWater } from "../calculation";

export interface CalculationDetailAasWaterProps {
  calculation: CalculationAasWater;
  samplePreparations: SamplePreparationAasWater[];
  onUpdate: (calculation: CalculationAasWater) => void;
  onRemove: () => void;
  isLocked: boolean;
}

const textValue = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

const numeric = (value: unknown): number | null => {
  const raw = textValue(value).trim();
  if (!raw) return null;
  const result = Number(raw);
  return Number.isFinite(result) ? result : null;
};

const findStep = (
  preparation: SamplePreparationAasWater | null,
  name: string,
) => preparation?.steps.find((step) => step.name === name);

const CalculationDetailAasWater: React.FC<CalculationDetailAasWaterProps> = ({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked,
}) => {
  const [expanded, setExpanded] = useState(true);

  const selected = useMemo(
    () =>
      samplePreparations.find(
        (preparation) =>
          preparation.label === calculation.selectedSamplePreparationLabel,
      ) ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => {
    const sample = findStep(selected, "Instrument Concentration (Sample)");
    const blank = findStep(selected, "Instrument Concentration (Blank)");
    const v1 = findStep(selected, "Dilution Factor 1 (V1)");
    const v2 = findStep(selected, "Dilution Factor 2 (V2)");

    return {
      sample: sample?.value1 ?? "",
      sampleUnit: sample?.unit1 ?? "ppm",
      blank: blank?.value1 ?? "",
      blankUnit: blank?.unit1 ?? "ppm",
      v1: v1?.value1 ?? "",
      v1Unit: v1?.unit1 ?? "ml",
      v2: v2?.value1 ?? "",
      v2Unit: v2?.unit1 ?? "ml",
    };
  }, [selected]);

  const update = <K extends keyof CalculationAasWater>(
    field: K,
    value: CalculationAasWater[K],
  ) => {
    onUpdate({
      ...calculation,
      [field]: value,
    });
  };

  const handlePreparationChange = (value: string) => {
    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: value || null,
      v1: null,
      v2: null,
      instrumentConcentrationSample: "",
      instrumentConcentrationBlank: "",
      calculationResult: null,
      calculationResultUnit: "mg/L",
    });
  };

  const errors = useMemo(() => {
    if (!selected) return ["Please select a Sample Preparation"];

    const required = [
      {
        label: "Instrument Concentration (Sample)",
        value: values.sample,
        allowZero: true,
      },
      {
        label: "Instrument Concentration (Blank)",
        value: values.blank,
        allowZero: true,
      },
      {
        label: "Dilution Factor 1 (V1)",
        value: values.v1,
        allowZero: false,
      },
      {
        label: "Dilution Factor 2 (V2)",
        value: values.v2,
        allowZero: false,
      },
    ];

    return required.reduce<string[]>((result, item) => {
      const raw = textValue(item.value).trim();
      const number = numeric(item.value);

      if (number === null || (!item.allowZero && number <= 0)) {
        result.push(
          `${item.label}: value is required and must be a valid number`,
        );
      }

      if (raw === "") {
        result[result.length - 1] = `${item.label}: value is required`;
      }

      return result;
    }, []);
  }, [selected, values]);

  const performCalculation = () => {
    if (isLocked || errors.length > 0 || !selected) return;

    const result = calculateAasWater({
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
      v1: values.v1,
      v1Unit: values.v1Unit,
      v2: values.v2,
      v2Unit: values.v2Unit,
      instrumentConcentrationSample: values.sample,
      instrumentConcentrationSampleUnit: values.sampleUnit,
      instrumentConcentrationBlank: values.blank,
      instrumentConcentrationBlankUnit: values.blankUnit,
      calculationResult: result.success
        ? result.result
        : `Error: ${result.error ?? "Calculation failed"}`,
      calculationResultUnit: result.success ? "mg/L" : "",
    });
  };

  const resultText = textValue(calculation.calculationResult);
  const resultNumber = numeric(calculation.calculationResult);
  const min = numeric(calculation.acceptanceLimitMin);
  const max = numeric(calculation.acceptanceLimitMax);
  const hasMin = min !== null;
  const hasMax = max !== null;
  const hasResult = resultNumber !== null;
  const isErrorResult = resultText.startsWith("Error:");

  const pass =
    hasResult &&
    !isErrorResult &&
    (!hasMin || resultNumber >= (min as number)) &&
    (!hasMax || resultNumber <= (max as number));

  const formulaSample = numeric(values.sample);
  const formulaBlank = numeric(values.blank);
  const formulaV1 = textValue(values.v1).trim() || "—";
  const formulaV2 = textValue(values.v2).trim() || "—";

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
                Calculation for AAS (Water)
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="rounded-lg p-2 transition-colors hover:bg-white/20"
              aria-label={
                expanded ? "Collapse calculation" : "Expand calculation"
              }
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
              disabled={isLocked}
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
          <div className="space-y-6 p-6">
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
                disabled={isLocked}
              />
            </div>

            {selected && errors.length > 0 && (
              <div className="rounded-lg border-b-2 border-red-200 bg-red-50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-red-500" />
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
            )}

            {selected && (
              <div className="rounded-lg border-2 border-emerald-200 bg-white p-4 shadow-sm">
                <h4 className="mb-3 text-sm font-bold text-slate-900">
                  Formula for AAS (Water)
                </h4>

                <div className="mb-3 rounded bg-slate-50 p-3">
                  <div className="flex flex-col items-center">
                    <div className="w-full border-b-2 border-black px-2 pb-2 text-center">
                      <p className="break-words text-xs font-mono text-black">
                        (Instrument Concentration (Sample) - Instrument Concentration (Blank)) × V1 × V2
                      </p>
                    </div>
                    <div className="w-full px-2 pt-2 text-center">
                      <p className="break-words text-xs font-mono text-black">
                        Concentration
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
                          ({formulaSample ?? "—"} - {formulaBlank ?? "—"}) × {formulaV1} × {formulaV2}
                        </p>
                      </div>
                      <div className="w-full px-2 pt-2 text-center">
                        <p className="break-words text-xs font-mono text-black">
                          Concentration
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-right text-xs font-semibold text-slate-600">
                  = mg/L
                </p>
              </div>
            )}

            {selected && (
              <div className="rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-slate-50 p-4">
                <h5 className="mb-3 text-sm font-bold text-slate-700">
                  Acceptance Limit
                </h5>

                <div className="flex items-center gap-2">
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

                  <span className="shrink-0 text-xs font-semibold text-slate-500">
                    to
                  </span>

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
            )}

            {selected && (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  disabled={isLocked || errors.length > 0}
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

            {resultText && (
              <div className="border-t-2 border-emerald-200 pt-5">
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300 bg-white shadow-lg">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2">
                    <h6 className="text-sm font-bold text-white">
                      AAS (Water) Result
                    </h6>
                  </div>

                  <div className="flex items-center gap-3 p-4">
                    <p
                      className={`text-2xl font-bold ${
                        isErrorResult ? "text-red-700" : "text-slate-800"
                      }`}
                    >
                      {resultText}
                      {!isErrorResult &&
                        ` ${calculation.calculationResultUnit || "mg/L"}`}
                    </p>

                    {!isErrorResult &&
                      (hasMin || hasMax) &&
                      hasResult && (
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
                  <p className="text-sm font-medium text-slate-600">
                    Sample Prep
                  </p>
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

export default CalculationDetailAasWater;
