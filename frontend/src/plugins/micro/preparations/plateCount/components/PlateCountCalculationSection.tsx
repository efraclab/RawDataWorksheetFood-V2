import { useMemo, useState } from "react";
import { Calculator, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { PlateCountConfig } from "../config";
import type {
  CalculationPlateCount,
  SamplePreparationPlateCount,
} from "../models";
import { calculatePlateCount, calculatePlateCountGroups, sumCounts } from "../calculation";
import { getCountGroups, getCountedReplicateNames } from "../factory";

const text = (v: unknown) => (v === null || v === undefined ? "" : String(v));

const inputClass =
  "w-full rounded-lg border border-emerald-300 px-3 py-2 text-sm outline-none hover:border-emerald-500 focus:border-emerald-500 disabled:bg-gray-100";

interface DetailProps {
  config: PlateCountConfig;
  calculation: CalculationPlateCount;
  samplePreparations: SamplePreparationPlateCount[];
  onUpdate: (calculation: CalculationPlateCount) => void;
  onRemove: () => void;
  isLocked: boolean;
}

const CalculationDetailPlateCount = ({
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

  const rows = useMemo(
    () =>
      selected
        ? getCountedReplicateNames(config).map(
            (name) => selected.steps.find((s) => s.name === name)?.counts ?? [],
          )
        : [],
    [selected, config],
  );

  const groups = getCountGroups(config);
  const groupRows = useMemo(
    () =>
      groups.map((group) => ({
        group,
        rows: selected
          ? getCountedReplicateNames(config, group).map(
              (name) => selected.steps.find((s) => s.name === name)?.counts ?? [],
            )
          : [],
      })),
    [selected, config, groups],
  );

  const total =
    groups.length > 0
      ? groupRows.reduce((sum, g) => sum + sumCounts(g.rows), 0)
      : sumCounts(rows);

  const errors: string[] = [];
  const replication = Number(calculation.replicationFactor);
  const dilution = Number(calculation.dilutionFactor);
  if (text(calculation.replicationFactor).trim() === "" || !Number.isFinite(replication) || replication <= 0)
    errors.push("Replication factor is required and must be greater than 0");
  if (text(calculation.dilutionFactor).trim() === "" || !Number.isFinite(dilution) || dilution <= 0)
    errors.push("Dilution factor is required and must be greater than 0");

  const updateFactor = (
    field: "replicationFactor" | "dilutionFactor",
    value: string,
  ) => onUpdate({ ...calculation, [field]: value, calculationResult: null, resultBreakdown: "" });

  const calculate = () => {
    if (isLocked || !selected || errors.length) return;

    if (groups.length > 0) {
      const g = calculatePlateCountGroups({
        groups: groupRows.map((x) => ({ key: x.group.key, label: x.group.label, rows: x.rows })),
        replicationFactor: calculation.replicationFactor,
        dilutionFactor: calculation.dilutionFactor,
      });

      onUpdate({
        ...calculation,
        selectedSamplePreparationLabel: selected.label,
        totalColonies: g.total,
        resultBreakdown: g.success
          ? g.groups.map((x) => `${x.label} Count: ${x.result} ${config.resultUnit}`).join("; ")
          : "",
        calculationResult: g.success ? g.result : `Error: ${g.error}`,
        calculationResultUnit: config.resultUnit,
      });
      return;
    }

    const r = calculatePlateCount({
      rows,
      replicationFactor: calculation.replicationFactor,
      dilutionFactor: calculation.dilutionFactor,
    });

    onUpdate({
      ...calculation,
      selectedSamplePreparationLabel: selected.label,
      totalColonies: r.total,
      calculationResult: r.success ? r.result : `Error: ${r.error}`,
      calculationResultUnit: config.resultUnit,
    });
  };

  const result = text(calculation.calculationResult);
  const isError = result.startsWith("Error:");

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button
          type="button"
          onClick={() => setExpanded((x) => !x)}
          className="font-semibold"
        >
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
            <label className="mb-2 block text-sm font-bold">
              Select Sample Preparation
            </label>
            <CustomDropdown
              options={samplePreparations.map((p) => ({
                value: p.label,
                label: p.label,
              }))}
              value={calculation.selectedSamplePreparationLabel ?? ""}
              onChange={(x) =>
                onUpdate({
                  ...calculation,
                  selectedSamplePreparationLabel: x || null,
                  totalColonies: null,
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
                (Total no. of colonies × Dilution factor) / Replication factor
              </div>

              <div className="rounded-lg border border-emerald-200 p-4">
                <div className="mb-3 text-sm">
                  Total no. of colonies (from the dilution grid):{" "}
                  <span className="font-bold">{total}</span>
                </div>
                {groups.length > 0 && (
                  <div className="mb-3 text-xs text-slate-600">
                    {groupRows.map((g) => `${g.group.label}: ${sumCounts(g.rows)}`).join(" · ")}
                  </div>
                )}
                {config.timePoints && config.timePoints.length > 0 && (
                  <div className="mb-3 text-xs text-slate-500">
                    Counted from: {getCountedReplicateNames(config).join(", ")}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Replication factor
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={isLocked}
                      value={text(calculation.replicationFactor)}
                      onChange={(e) => updateFactor("replicationFactor", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Dilution factor
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={isLocked}
                      value={text(calculation.dilutionFactor)}
                      onChange={(e) => updateFactor("dilutionFactor", e.target.value)}
                      placeholder="e.g. 1000"
                      className={inputClass}
                    />
                  </div>
                </div>
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

              {result && (
                <div className="overflow-hidden rounded-lg border-2 border-emerald-300">
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                    {config.title} Result
                  </div>
                  <div className="p-4 text-2xl font-bold">
                    {result} {!isError && config.resultUnit}
                  </div>
                  {!isError && calculation.resultBreakdown && (
                    <div className="px-4 pb-4 text-sm text-slate-700">
                      {calculation.resultBreakdown}
                    </div>
                  )}
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
  config: PlateCountConfig;
  calculations: CalculationPlateCount[];
  samplePreparations: SamplePreparationPlateCount[];
  canEditCalculations: boolean;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (calculation: CalculationPlateCount) => void;
}

const PlateCountCalculationSection = ({
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
          <p className="text-xs text-emerald-600/80">
            Click &quot;Add Calculation&quot; to begin
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {calculations.map((calculation) => (
            <CalculationDetailPlateCount
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

export default PlateCountCalculationSection;