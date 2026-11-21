import { useMemo, useState } from "react";
import { Calculator, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { ResidueConfig } from "../config";
import type {
  CalculationResidue,
  ResidueAnalyte,
  SamplePreparationResidue,
} from "../models";
import { calculateResidue, isPositiveNumber } from "../calculation";
import {
  RESULT_UNIT,
  createAnalyte,
  getPreparationDilutionFactor,
  summarizeAnalytes,
} from "../factory";

const text = (v: unknown) => (v === null || v === undefined ? "" : String(v));

const inputClass =
  "w-full rounded-lg border border-emerald-300 px-3 py-2 text-sm outline-none hover:border-emerald-500 focus:border-emerald-500 disabled:bg-gray-100";

/** Any change to inputs clears the old results. */
const clearResults = (c: CalculationResidue): CalculationResidue => ({
  ...c,
  analytes: c.analytes.map((a) => ({ ...a, resultUgKg: null, resultMgKg: null })),
  resultBreakdown: "",
  calculationResult: null,
});

interface DetailProps {
  config: ResidueConfig;
  calculation: CalculationResidue;
  samplePreparations: SamplePreparationResidue[];
  onUpdate: (calculation: CalculationResidue) => void;
  onRemove: () => void;
  isLocked: boolean;
}

const CalculationDetailResidue = ({
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
      samplePreparations.find(
        (p) => p.label === calculation.selectedSamplePreparationLabel,
      ) ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const errors: string[] = [];
  if (!isPositiveNumber(calculation.dilutionFactor))
    errors.push("Dilution factor is required and must be greater than 0");
  if (calculation.analytes.length === 0) errors.push("Add at least one analyte row");
  calculation.analytes.forEach((a, i) => {
    const n = Number(text(a.concentration).trim());
    if (text(a.concentration).trim() === "" || !Number.isFinite(n) || n < 0)
      errors.push(`Row ${i + 1}: instrument concentration must be a number (0 or more)`);
  });

  const updateAnalyte = (index: number, patch: Partial<ResidueAnalyte>) =>
    onUpdate(
      clearResults({
        ...calculation,
        analytes: calculation.analytes.map((a, i) => (i === index ? { ...a, ...patch } : a)),
      }),
    );

  const calculate = () => {
    if (isLocked || !selected || errors.length) return;

    const analytes = calculation.analytes.map((a) => {
      const r = calculateResidue({
        concentration: a.concentration,
        dilutionFactor: calculation.dilutionFactor,
      });
      return { ...a, resultUgKg: r.ugKg, resultMgKg: r.mgKg };
    });
    const breakdown = summarizeAnalytes(analytes);
    const single = analytes.length === 1 ? analytes[0] : null;

    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      analytes,
      resultBreakdown: breakdown,
      // One analyte: the number. Several: the whole line, because the report prints this field.
      calculationResult: single ? single.resultUgKg : breakdown,
      calculationResultUnit: single ? RESULT_UNIT : "",
    });
  };

  const hasResults = calculation.analytes.some((a) => a.resultUgKg !== null);

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
              onChange={(x) => {
                const prep = samplePreparations.find((p) => p.label === x) ?? null;
                const df = getPreparationDilutionFactor(prep);
                onUpdate(
                  clearResults({
                    ...calculation,
                    selectedSamplePreparationLabel: x || null,
                    // Take the dilution factor typed in the preparation, if any.
                    dilutionFactor: df !== "" ? df : calculation.dilutionFactor,
                  }),
                );
              }}
              colorScheme="emerald"
              disabled={isLocked}
            />
          </div>

          {selected && (
            <>
              <div className="rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-xs">
                Result (µg/kg) = Instrument concentration × Dilution factor · Result (mg/kg) = µg/kg ÷ 1000
              </div>

              <div className="rounded-lg border border-emerald-200 p-4">
                <div className="mb-4 max-w-xs">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Dilution factor
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    disabled={isLocked}
                    value={text(calculation.dilutionFactor)}
                    onChange={(e) =>
                      onUpdate(clearResults({ ...calculation, dilutionFactor: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="text-left text-slate-600">
                        <th className="px-2 py-1">Analyte</th>
                        <th className="px-2 py-1">Instrument Concentration</th>
                        <th className="px-2 py-1">Result (µg/kg)</th>
                        <th className="px-2 py-1">Result (mg/kg)</th>
                        <th className="px-2 py-1" />
                      </tr>
                    </thead>
                    <tbody>
                      {calculation.analytes.map((a, i) => (
                        <tr key={i}>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              disabled={isLocked}
                              value={a.name}
                              placeholder="Analyte name"
                              onChange={(e) => updateAnalyte(i, { name: e.target.value })}
                              className={inputClass}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              inputMode="decimal"
                              disabled={isLocked}
                              value={a.concentration}
                              onChange={(e) => updateAnalyte(i, { concentration: e.target.value })}
                              className={inputClass}
                            />
                          </td>
                          <td className="px-2 py-1 font-bold">{text(a.resultUgKg)}</td>
                          <td className="px-2 py-1 font-bold">{text(a.resultMgKg)}</td>
                          <td className="px-2 py-1">
                            <button
                              type="button"
                              disabled={isLocked || calculation.analytes.length <= 1}
                              onClick={() =>
                                onUpdate(
                                  clearResults({
                                    ...calculation,
                                    analytes: calculation.analytes.filter((_, x) => x !== i),
                                  }),
                                )
                              }
                              className="rounded p-1 text-red-600 disabled:opacity-30"
                              aria-label={`Remove row ${i + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() =>
                    onUpdate(
                      clearResults({
                        ...calculation,
                        analytes: [...calculation.analytes, createAnalyte()],
                      }),
                    )
                  }
                  className="mt-3 rounded-lg border border-emerald-400 px-3 py-1.5 text-xs font-semibold text-emerald-800 disabled:opacity-40"
                >
                  + Add Analyte
                </button>
              </div>

              {errors.length > 0 && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4" role="alert">
                  <h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4>
                  <ul className="space-y-1">
                    {errors.map((e) => (
                      <li key={e} className="text-xs text-red-700">• {e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  disabled={isLocked || errors.length > 0}
                  onClick={calculate}
                  className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Calculate Result
                </button>
              </div>

              {hasResults && (
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                    {config.title} Result
                  </div>
                  <div className="p-4 text-sm font-semibold">{calculation.resultBreakdown}</div>
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
  config: ResidueConfig;
  calculations: CalculationResidue[];
  samplePreparations: SamplePreparationResidue[];
  canEditCalculations: boolean;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (calculation: CalculationResidue) => void;
}

const ResidueCalculationSection = ({
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
            <CalculationDetailResidue
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

export default ResidueCalculationSection;