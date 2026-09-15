import React, { useMemo } from "react";
import { Calculator, Trash2 } from "lucide-react";
import type { CalculationIcpms } from "../models/CalculationIcpms";
import type { SamplePreparationIcpms } from "../models/SamplePreparationIcpms";
import { calculateIcpms } from "../calculation";

export interface CalculationDetailIcpmsProps {
  calculation: CalculationIcpms;
  samplePreparations: SamplePreparationIcpms[];
  onUpdate: (calculation: CalculationIcpms) => void;
  onRemove: () => void;
  isLocked: boolean;
}

const textValue = (value: number | string | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

const numeric = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const CalculationDetailIcpms: React.FC<CalculationDetailIcpmsProps> = ({
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked,
}) => {
  const selectedPreparation = useMemo(
    () =>
      samplePreparations.find(
        (item) => item.label === calculation.selectedSamplePreparationLabel,
      ) ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const preparationValues = useMemo(() => {
    const step = (name: string) =>
      selectedPreparation?.steps.find((item) => item.name === name)?.value1 ?? "";

    return {
      sw1: step("Weighing"),
      v1: step("1st Dilution"),
      v2: step("2nd Dilution"),
      v3: step("3rd Dilution"),
    };
  }, [selectedPreparation]);

  const update = <K extends keyof CalculationIcpms>(
    field: K,
    value: CalculationIcpms[K],
  ) => {
    onUpdate({
      ...calculation,
      [field]: value,
      ...(field !== "calculationResult"
        ? { calculationResult: null }
        : {}),
    });
  };

  const effectiveValue = (
    field: "sw1" | "v1" | "v2" | "v3",
    fallback: string,
  ) => {
    const own = textValue(calculation[field]);
    return own !== "" ? own : fallback;
  };

  const calculate = () => {
    const sw1 = effectiveValue("sw1", preparationValues.sw1);
    const v1 = effectiveValue("v1", preparationValues.v1);
    const v2 = effectiveValue("v2", preparationValues.v2);
    const v3 = effectiveValue("v3", preparationValues.v3);

    const result = calculateIcpms({
      instrumentConcentrationSample: calculation.instrumentConcentrationSample,
      instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
      sampleWeight: sw1,
      volumeMakeup: v1,
      dilutionFactor1: v2,
      dilutionFactor2: v3,
    });

    onUpdate({
      ...calculation,
      sw1,
      v1,
      v2,
      v3,
      calculationResult: result.success ? result.result : null,
      calculationResultUnit: "mg/Kg",
    });
  };

  const sampleConcentration = numeric(calculation.instrumentConcentrationSample);
  const blankConcentration = numeric(calculation.instrumentConcentrationBlank);
  const sw1 = numeric(effectiveValue("sw1", preparationValues.sw1));
  const v1 = numeric(effectiveValue("v1", preparationValues.v1));
  const v2 = numeric(effectiveValue("v2", preparationValues.v2));
  const v3 = numeric(effectiveValue("v3", preparationValues.v3));

  return (
    <div className="overflow-hidden border border-slate-300 bg-white shadow-sm">
      {/* Excel-style formula header */}
      <div className="border-b-2 border-slate-800 bg-white px-5 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-900">
          <span className="whitespace-nowrap">Content in (</span>
          <span className="inline-block w-24 border-b border-slate-800" />
          <span className="whitespace-nowrap">)</span>
          <span className="mx-2">=</span>
          <div className="min-w-[360px] max-w-[620px] text-center">
            <div className="border-b border-slate-800 pb-2">
              Instrument Concentration × V1 × V2 × V3
            </div>
            <div className="pt-2">Sample Weight × 1000</div>
          </div>
          <span className="whitespace-nowrap">= Concentration</span>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 underline">
              {calculation.label}
            </h3>
            <p className="mt-1 text-xs font-semibold text-emerald-700">
              ICP-MS (FOOD)
            </p>
          </div>

          {!isLocked && (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(560px,1fr)_minmax(520px,1fr)]">
          {/* Excel calculation table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-slate-800 bg-white px-2 py-2 text-left font-bold underline">
                    Calculation
                  </th>
                  <th className="w-14 border border-slate-800 bg-white px-2 py-2 text-center font-bold">
                    &nbsp;
                  </th>
                  <th className="w-36 border border-slate-800 bg-white px-2 py-2 text-center font-bold underline">
                    Value
                  </th>
                  <th className="w-28 border border-slate-800 bg-white px-2 py-2 text-center font-bold underline">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                <InputRow
                  label="Instrument Concentration (Sample)"
                  value={textValue(calculation.instrumentConcentrationSample)}
                  unit={calculation.instrumentConcentrationSampleUnit || "ppb"}
                  locked={isLocked}
                  onChange={(value) =>
                    update("instrumentConcentrationSample", value)
                  }
                />
                <InputRow
                  label="Instrument Concentration (Blank)"
                  value={textValue(calculation.instrumentConcentrationBlank)}
                  unit={calculation.instrumentConcentrationBlankUnit || "ppb"}
                  locked={isLocked}
                  onChange={(value) =>
                    update("instrumentConcentrationBlank", value)
                  }
                />
                <InputRow
                  label="Sample Weight"
                  code="(SW1)"
                  value={effectiveValue("sw1", preparationValues.sw1)}
                  unit="g"
                  locked={isLocked}
                  onChange={(value) => update("sw1", value)}
                />
                <InputRow
                  label="Volume Makeup"
                  code="(V1)"
                  value={effectiveValue("v1", preparationValues.v1)}
                  unit="ml"
                  locked={isLocked}
                  onChange={(value) => update("v1", value)}
                />
                <InputRow
                  label="Dilution Factor 1"
                  code="(V2)"
                  value={effectiveValue("v2", preparationValues.v2)}
                  unit="ml"
                  locked={isLocked}
                  onChange={(value) => update("v2", value)}
                />
                <InputRow
                  label="Dilution Factor 2"
                  code="(V3)"
                  value={effectiveValue("v3", preparationValues.v3)}
                  unit="ml"
                  locked={isLocked}
                  onChange={(value) => update("v3", value)}
                />
              </tbody>
            </table>
          </div>

          {/* Excel-style visual calculation/result block */}
          <div className="min-h-[300px] border-2 border-slate-800 bg-white p-5">
            <div className="flex flex-wrap items-end justify-center gap-x-7 gap-y-4 text-sm font-semibold text-slate-900">
              <FormulaValue label="Instrument Concentration (Sample)" value={sampleConcentration} />
              <FormulaValue label="Instrument Concentration (Blank)" value={blankConcentration} />
              <FormulaValue label="(V1)" value={v1} />
              <FormulaValue label="(V2)" value={v2} />
              <FormulaValue label="(V3)" value={v3} />
            </div>

            <div className="mt-4 flex items-center justify-center gap-10 text-sm font-semibold text-slate-900">
              <div className="text-center">
                <div>{sw1 ?? "—"}</div>
                <div className="mt-1 font-normal">Sample Weight</div>
              </div>
              <div className="text-center">
                <div>1000</div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-[385px]">
                <div className="bg-[#052b67] px-3 py-1 text-sm font-bold italic text-white">
                  RESULT
                </div>
                <div className="flex min-h-[105px] items-center justify-center gap-10 border-2 border-slate-800 border-t-0 bg-[#10a9e0] px-5">
                  <span className="text-4xl font-bold text-white">
                    {calculation.calculationResult === null
                      ? "—"
                      : Number(calculation.calculationResult).toFixed(2)}
                  </span>
                  <span className="text-base font-bold text-white">
                    {calculation.calculationResultUnit || "mg/Kg"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          <label className="text-sm font-semibold text-slate-700">
            Sample Preparation
          </label>
          <select
            value={calculation.selectedSamplePreparationLabel ?? ""}
            disabled={isLocked}
            onChange={(event) =>
              update(
                "selectedSamplePreparationLabel",
                event.target.value || null,
              )
            }
            className="h-9 min-w-[220px] border border-emerald-300 bg-white px-3 text-sm outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">Select Sample Preparation</option>
            {samplePreparations.map((preparation) => (
              <option key={preparation.id} value={preparation.label}>
                {preparation.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={isLocked}
            onClick={calculate}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Calculator className="h-4 w-4" />
            Calculate Result
          </button>
        </div>
      </div>
    </div>
  );
};

const InputRow = ({
  label,
  code,
  value,
  unit,
  locked,
  onChange,
}: {
  label: string;
  code?: string;
  value: string;
  unit: string;
  locked: boolean;
  onChange: (value: string) => void;
}) => (
  <tr>
    <td className="border border-slate-800 px-2 py-2 font-semibold text-slate-800">
      {label}
      {code && <span className="ml-2 font-bold">{code}</span>}
    </td>
    <td className="border border-slate-800 px-2 text-center">=</td>
    <td className="border border-slate-800 bg-yellow-200 p-0">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        disabled={locked}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full border-0 bg-transparent px-2 text-center font-semibold text-slate-900 outline-none disabled:cursor-not-allowed disabled:opacity-70"
      />
    </td>
    <td className="border border-slate-800 bg-[#d99696] px-2 text-center font-medium text-slate-800">
      {unit}
    </td>
  </tr>
);

const FormulaValue = ({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) => (
  <div className="min-w-[85px] text-center">
    <div className="whitespace-nowrap text-xs font-semibold">{label}</div>
    <div className="mt-2 border-b border-slate-700 pb-1">{value ?? "—"}</div>
  </div>
);

export default CalculationDetailIcpms;
