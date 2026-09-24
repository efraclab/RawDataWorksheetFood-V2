import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { CalculationHFStack, HFStackSectionCalculation } from "../models/CalculationHFStack";
import type { HFStackSection, SamplePreparationHFStack } from "../models/SamplePreparationHFStack";
import { calculateHFStack } from "../calculation";

const text = (value: unknown) => (value == null ? "" : String(value));

const numberOrNull = (value: unknown) => {
  const raw = text(value).trim();
  const parsed = Number(raw);
  return raw === "" || !Number.isFinite(parsed) ? null : parsed;
};

const sectionConfig: Array<{
  key: HFStackSection;
  title: string;
  resultTitle: string;
}> = [
  { key: "particulate", title: "Calculation (in particulate)", resultTitle: "HF in Particulate" },
  { key: "h2so4", title: "Calculation (in H₂SO₄)", resultTitle: "HF in H₂SO₄" },
  { key: "naoh", title: "Calculation (in NaOH)", resultTitle: "HF in NaOH" },
];

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

const findValue = (
  preparation: SamplePreparationHFStack | null,
  section: HFStackSection,
  name: string,
) => {
  const expected = normalize(name);

  return (
    preparation?.steps.find(
      (item) =>
        item.section === section &&
        (normalize(item.name) === expected ||
          normalize(item.name).includes(expected) ||
          expected.includes(normalize(item.name))),
    )?.value1 ?? ""
  );
};

interface Props {
  calculation: CalculationHFStack;
  samplePreparations: SamplePreparationHFStack[];
  onUpdate: (calculation: CalculationHFStack) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function CalculationDetailHFStack({
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

  const updateSection = (
    section: HFStackSection,
    patch: Partial<HFStackSectionCalculation>,
  ) => {
    onUpdate({
      ...calculation,
      [section]: {
        ...calculation[section],
        ...patch,
      },
    });
  };

  const getValues = (section: HFStackSection) => ({
    v: findValue(selected, section, "Volume of Absorbence"),
    ir: findValue(selected, section, "Instrument Reading"),
    factor: findValue(selected, section, "Factor"),
    df: findValue(selected, section, "Dilution Factor"),
    vstd: findValue(selected, section, "Volume of Gas Drawn"),
  });

  const sectionErrors = (section: HFStackSection) => {
    if (!selected) return ["Select a sample preparation."];

    const values = getValues(section);
    const errors: string[] = [];

    (Object.entries(values) as Array<[keyof typeof values, string]>).forEach(
      ([key, value]) => {
        if (value.trim() === "" || numberOrNull(value) === null) {
          errors.push(`${key} is required and must be numeric`);
        }
      },
    );

    const ir = numberOrNull(values.ir);
    const v = numberOrNull(values.v);
    const factor = numberOrNull(values.factor);
    const df = numberOrNull(values.df);
    const vstd = numberOrNull(values.vstd);

    if (ir !== null && ir < 0) {
      errors.push("Instrument Reading cannot be negative");
    }
    if (v !== null && v <= 0) {
      errors.push("Volume of Absorbence must be greater than zero");
    }
    if (factor !== null && factor <= 0) {
      errors.push("Factor must be greater than zero");
    }
    if (df !== null && df <= 0) {
      errors.push("Dilution Factor must be greater than zero");
    }
    if (vstd !== null && vstd <= 0) {
      errors.push("Volume of Gas Drawn must be greater than zero");
    }

    return errors;
  };

  const runSection = (section: HFStackSection) => {
    if (!selected) return;

    const errors = sectionErrors(section);
    if (errors.length > 0) return;

    const values = getValues(section);
    const result = calculateHFStack(values);

    if (!result.success) return;

    updateSection(section, {
      result: result.result,
    });
  };

  const resultStatus = (section: HFStackSection) => {
    const data = calculation[section];
    const result = data.result;
    const minimum = numberOrNull(data.acceptanceLimitMin);
    const maximum = numberOrNull(data.acceptanceLimitMax);

    if (
      result === null ||
      (minimum === null && maximum === null)
    ) {
      return null;
    }

    return (
      (minimum === null || result >= minimum) &&
      (maximum === null || result <= maximum)
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="font-semibold"
        >
          {calculation.label} · HF Stack
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-label="Toggle calculation"
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>

          <button
            type="button"
            disabled={isLocked}
            onClick={onRemove}
            aria-label="Remove calculation"
          >
            <Trash2 />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 p-6">
          <div className="rounded-lg border border-emerald-200 p-4">
            <label className="mb-2 block text-sm font-bold text-emerald-900">
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
                  particulate: {
                    ...calculation.particulate,
                    result: null,
                  },
                  h2so4: {
                    ...calculation.h2so4,
                    result: null,
                  },
                  naoh: {
                    ...calculation.naoh,
                    result: null,
                  },
                })
              }
              colorScheme="emerald"
              disabled={isLocked}
            />
          </div>

          {selected &&
            sectionConfig.map((section) => {
              const errors = sectionErrors(section.key);
              const data = calculation[section.key];
              const passed = resultStatus(section.key);

              return (
                <div
                  key={section.key}
                  className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm"
                >
                  <div className="border-b border-emerald-200 bg-gradient-to-r from-white via-emerald-50/60 to-white px-4 py-3">
                    <h4 className="text-sm font-bold text-emerald-900">
                      {section.title}
                    </h4>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-xs text-slate-700">
                      C = (V × IR × 1.053 × DF) / (Vstd × 1000)
                    </div>

                    {errors.length > 0 && (
                      <div
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                        role="alert"
                      >
                        <ul className="space-y-1">
                          {errors.map((error) => (
                            <li
                              key={error}
                              className="text-xs text-red-700"
                            >
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-lg border border-emerald-200 p-4">
                      <h5 className="mb-3 font-bold text-emerald-900">
                        Acceptance Limit
                      </h5>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <input
                          disabled={isLocked}
                          value={text(data.acceptanceLimitMin)}
                          onChange={(event) =>
                            updateSection(section.key, {
                              acceptanceLimitMin: event.target.value,
                            })
                          }
                          placeholder="Minimum Limit"
                          className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 disabled:bg-slate-50"
                        />

                        <input
                          disabled={isLocked}
                          value={text(data.acceptanceLimitMax)}
                          onChange={(event) =>
                            updateSection(section.key, {
                              acceptanceLimitMax: event.target.value,
                            })
                          }
                          placeholder="Maximum Limit"
                          className="w-full rounded-lg border border-emerald-300 px-3 py-2 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        disabled={errors.length > 0 || isLocked}
                        onClick={() => runSection(section.key)}
                        className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Calculate Result
                      </button>
                    </div>

                    {data.result !== null && (
                      <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
                        <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                          {section.resultTitle}
                        </div>

                        <div className="flex items-center gap-3 p-4 text-2xl font-bold">
                          <span>{data.result.toFixed(3)} mg/Nm³</span>

                          {passed !== null && (
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
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
