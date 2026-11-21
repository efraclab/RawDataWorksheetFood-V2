import { useMemo, useState } from "react";
import { Calculator, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { GasTestConfig } from "../config";
import type { CalculationGas, SamplePreparationGas } from "../models";
import { FORMULAS, calculateGas, getRawFields, getRawValues, summarizeValues } from "../factory";

const text = (v: unknown) => (v === null || v === undefined ? "" : String(v));

interface DetailProps {
  config: GasTestConfig;
  calculation: CalculationGas;
  samplePreparations: SamplePreparationGas[];
  onUpdate: (calculation: CalculationGas) => void;
  onRemove: () => void;
  isLocked: boolean;
}

const CalculationDetailGas = ({
  config,
  calculation,
  samplePreparations,
  onUpdate,
  onRemove,
  isLocked,
}: DetailProps) => {
  const [expanded, setExpanded] = useState(true);

  const selected = useMemo(
    () =>
      samplePreparations.find((p) => p.label === calculation.selectedSamplePreparationLabel) ??
      null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const values = useMemo(() => getRawValues(config, selected), [config, selected]);
  const check = calculateGas(config, values);

  const calculate = () => {
    if (isLocked || !selected || !check.success) return;
    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      resultBreakdown: summarizeValues(config, values),
      calculationResult: check.result,
      calculationResultUnit: config.unit,
    });
  };

  const result = text(calculation.calculationResult);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button type="button" onClick={() => setExpanded((x) => !x)} className="font-semibold">
          {calculation.label} · {config.title}
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => setExpanded((x) => !x)}>
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
            <label className="mb-2 block text-sm font-bold">Select Sample Preparation</label>
            <CustomDropdown
              options={samplePreparations.map((p) => ({ value: p.label, label: p.label }))}
              value={calculation.selectedSamplePreparationLabel ?? ""}
              onChange={(x) =>
                onUpdate({
                  ...calculation,
                  selectedSamplePreparationLabel: x || null,
                  resultBreakdown: "",
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
                {FORMULAS[config.kind]}
              </div>

              <div className="rounded-lg border border-emerald-200 p-4">
                <div className="mb-2 text-xs text-slate-500">
                  Values from {selected.label} (edit them in the sample preparation):
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                  {getRawFields(config).map((f) => (
                    <div key={f.symbol}>
                      <span className="font-semibold">{f.symbol === "OBS" ? "Observation" : f.symbol}:</span>{" "}
                      {values[f.symbol] || "—"}
                    </div>
                  ))}
                </div>
              </div>

              {!check.success && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-3 text-xs text-red-700" role="alert">
                  • {check.error}
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  disabled={isLocked || !check.success}
                  onClick={calculate}
                  className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Calculate Result
                </button>
              </div>

              {result && (
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                    {config.title} Result
                  </div>
                  <div className="p-4 text-2xl font-bold">
                    {result} {config.unit}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

interface SectionProps {
  config: GasTestConfig;
  calculations: CalculationGas[];
  samplePreparations: SamplePreparationGas[];
  canEditCalculations: boolean;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (calculation: CalculationGas) => void;
}

const GasCalculationSection = ({
  config,
  calculations,
  samplePreparations,
  canEditCalculations,
  onAdd,
  onRemove,
  onUpdate,
}: SectionProps) => (
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
          {config.title} Calculations
        </h3>
        <button
          type="button"
          onClick={onAdd}
          disabled={!canEditCalculations}
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
            No {config.title} calculations added yet
          </p>
          <p className="text-xs text-emerald-600/80">Click &quot;Add Calculation&quot; to begin</p>
        </div>
      ) : (
        <div className="space-y-6">
          {calculations.map((calculation) => (
            <CalculationDetailGas
              key={calculation.id}
              config={config}
              calculation={calculation}
              samplePreparations={samplePreparations}
              onUpdate={onUpdate}
              onRemove={() => onRemove(calculation.id)}
              isLocked={!canEditCalculations}
            />
          ))}
        </div>
      )}
    </div>
  </section>
);

export default GasCalculationSection;