import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import type { CalculationLithosun400, Lithosun400CalculationStage } from '../models/CalculationLithosun400';
import type {
  Lithosun400DissolutionHour,
  Lithosun400DissolutionStage,
  SamplePreparationLithosun400,
} from '../models/SamplePreparationLithosun400';
import { calculateLithosun400 } from '../calculation';

const HOURS: Lithosun400DissolutionHour[] = ['1', '3', '7'];

const text = (value: unknown): string => (value == null ? '' : String(value));

const numberValue = (value: unknown): number | null => {
  const raw = text(value).trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const emptyResults = (): Array<number | null> => [null, null, null, null, null, null];

const emptySamples = (): Array<number | string> => ['', '', '', '', '', ''];

const hourLabel = (hour: Lithosun400DissolutionHour): string =>
  `After ${hour} Hrs Disso`;

const getPreparationStage = (
  preparation: SamplePreparationLithosun400 | null,
  hour: Lithosun400DissolutionHour,
): Lithosun400DissolutionStage | null =>
  preparation?.stages?.find((stage) => stage.hour === hour) ?? null;

const getStepValue = (
  stage: Lithosun400DissolutionStage | null,
  name: string,
): string => stage?.steps?.find(
  (item) => item.name.toLowerCase() === name.toLowerCase(),
)?.value1 ?? '';

const getStage = (
  calculation: CalculationLithosun400,
  hour: Lithosun400DissolutionHour,
): Lithosun400CalculationStage => {
  const existing = calculation.stages?.find((stage) => stage.hour === hour);
  return {
    hour,
    label: hourLabel(hour),
    dissolutionSamples: existing?.dissolutionSamples
      ? [...existing.dissolutionSamples, ...emptySamples()].slice(0, 6)
      : emptySamples(),
    results: existing?.results
      ? [...existing.results, ...emptyResults()].slice(0, 6)
      : emptyResults(),
    acceptanceLimitMin: existing?.acceptanceLimitMin ?? '',
    acceptanceLimitMax: existing?.acceptanceLimitMax ?? '',
  };
};

export default function CalculationDetailLithosun400({
  calculation,
  samplePreparations,
  isLocked,
  onRemove,
  onUpdate,
}: {
  calculation: CalculationLithosun400;
  samplePreparations: SamplePreparationLithosun400[];
  isLocked: boolean;
  onRemove: () => void;
  onUpdate: (value: CalculationLithosun400) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  // Automatically associate a newly created/restored calculation with the
  // first available sample preparation. This also fixes older saved records
  // where selectedSamplePreparationId was null.
  useEffect(() => {
    const hasSelectedPreparation = samplePreparations.some(
      (preparation) => preparation.id === calculation.selectedSamplePreparationId,
    );
    if (hasSelectedPreparation) return;

    const firstPreparation = samplePreparations[0];
    if (!firstPreparation) return;

    onUpdate({
      ...calculation,
      selectedSamplePreparationId: firstPreparation.id,
    });
  }, [
    calculation,
    onUpdate,
    samplePreparations,
  ]);

  const selected = useMemo(
    () => samplePreparations.find(
      (preparation) => preparation.id === calculation.selectedSamplePreparationId,
    ) ?? null,
    [samplePreparations, calculation.selectedSamplePreparationId],
  );

  const update = (patch: Partial<CalculationLithosun400>) => {
    onUpdate({ ...calculation, ...patch });
  };

  const updateStage = (
    hour: Lithosun400DissolutionHour,
    patch: Partial<Lithosun400CalculationStage>,
  ) => {
    const stages = HOURS.map((stageHour) => {
      const current = getStage(calculation, stageHour);
      return stageHour === hour ? { ...current, ...patch, hour: stageHour, label: hourLabel(stageHour) } : current;
    });
    update({ stages });
  };

  const calculateStage = (hour: Lithosun400DissolutionHour) => {
    if (!selected || isLocked) return;

    const preparationStage = getPreparationStage(selected, hour);
    const currentStage = getStage(calculation, hour);

    const common = {
      blank: getStepValue(preparationStage, 'Instrument Concentration (Blank)'),
      v1: getStepValue(preparationStage, 'Volume makeup (V1)'),
      v2: getStepValue(preparationStage, 'Volume taken (V2)'),
      v3: getStepValue(preparationStage, 'Volume makeup (V3)'),
      labelClaim: getStepValue(preparationStage, 'Label Claim'),
      conversionFactor: getStepValue(preparationStage, 'Conversion Factor'),
    };

    const results = currentStage.dissolutionSamples.map((sample) => {
      const result = calculateLithosun400({ sample, ...common });
      return result.success ? result.result : null;
    });

    updateStage(hour, { results });
  };

  const minimum = (stage: Lithosun400CalculationStage): number | null =>
    numberValue(stage.acceptanceLimitMin);

  const maximum = (stage: Lithosun400CalculationStage): number | null =>
    numberValue(stage.acceptanceLimitMax);

  const getPassStatus = (
    result: number | null,
    stage: Lithosun400CalculationStage,
  ): boolean | null => {
    const min = minimum(stage);
    const max = maximum(stage);
    if (result === null || (min === null && max === null)) return null;
    return (min === null || result >= min) && (max === null || result <= max);
  };

  const inputClass =
    'w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70';

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="font-semibold"
        >
          {calculation.label} · Lithosun 400
        </button>
        <div className="flex gap-3">
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
        <div className="space-y-6 p-6">
          <div className="rounded-lg border border-emerald-200 p-4">
            <label className="mb-2 block text-sm font-bold">
              Select Sample Preparation
            </label>
            <select
              disabled={isLocked}
              value={calculation.selectedSamplePreparationId == null
                ? ''
                : String(calculation.selectedSamplePreparationId)}
              onChange={(event) => update({
                selectedSamplePreparationId: event.target.value
                  ? Number(event.target.value)
                  : null,
                stages: HOURS.map((hour) => getStage(calculation, hour)),
              })}
              className={inputClass}
            >
              <option value="">Select sample preparation</option>
              {samplePreparations.map((preparation) => (
                <option key={preparation.id} value={preparation.id}>
                  {preparation.label}
                </option>
              ))}
            </select>
          </div>

          {selected ? (
            HOURS.map((hour) => {
              const calculationStage = getStage(calculation, hour);
              const preparationStage = getPreparationStage(selected, hour);
              const min = minimum(calculationStage);
              const max = maximum(calculationStage);

              return (
                <section
                  key={hour}
                  className="space-y-5 rounded-xl border-2 border-emerald-200 p-4"
                >
                  <div className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-4 py-3 text-lg font-bold text-white">
                    {hourLabel(hour)}
                  </div>

                  <div className="rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-xs">
                    ((Dissolution Sample − Blank) × V1 × V3 × 1000) ÷
                    (Label Claim × V2 × Conversion Factor × 10000)
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-emerald-200">
                    <table className="min-w-full text-xs">
                      <thead className="bg-emerald-800 text-white">
                        <tr>
                          <th className="p-3 text-left">Tablet</th>
                          <th className="p-3 text-left">Main Sample</th>
                          <th className="p-3 text-left">Dissolution Sample</th>
                          <th className="p-3 text-left">Result (% of LC)</th>
                          <th className="p-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 6 }, (_, index) => {
                          const result = calculationStage.results[index] ?? null;
                          const status = getPassStatus(result, calculationStage);

                          return (
                            <tr key={index} className="border-t border-emerald-100">
                              <td className="p-3 font-semibold">Tablet {index + 1}</td>
                              <td className="p-3">
                                {getStepValue(
                                  preparationStage,
                                  `Instrument Concentration (Sample) Tab ${index + 1}`,
                                )}
                              </td>
                              <td className="p-3">
                                <input
                                  disabled={isLocked}
                                  inputMode="decimal"
                                  value={text(calculationStage.dissolutionSamples[index])}
                                  onChange={(event) => {
                                    const values = [
                                      ...calculationStage.dissolutionSamples,
                                    ];
                                    values[index] = event.target.value;
                                    updateStage(hour, {
                                      dissolutionSamples: values,
                                      results: emptyResults(),
                                    });
                                  }}
                                  className={`${inputClass} w-36`}
                                  placeholder="Enter value"
                                />
                              </td>
                              <td className="p-3 font-bold">
                                {result === null ? '—' : `${Number(result).toFixed(2)} %`}
                              </td>
                              <td className="p-3">
                                {status === null ? (
                                  '—'
                                ) : (
                                  <span
                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                                      status
                                        ? 'border-green-300 bg-green-100 text-green-800'
                                        : 'border-red-300 bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {status ? 'Pass' : 'Fail'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-lg border border-emerald-200 p-4">
                    <div className="mb-3 font-bold">Acceptance Limit</div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        disabled={isLocked}
                        inputMode="decimal"
                        value={text(calculationStage.acceptanceLimitMin)}
                        onChange={(event) => updateStage(hour, {
                          acceptanceLimitMin: event.target.value,
                        })}
                        placeholder="Minimum Limit"
                        className={inputClass}
                      />
                      <input
                        disabled={isLocked}
                        inputMode="decimal"
                        value={text(calculationStage.acceptanceLimitMax)}
                        onChange={(event) => updateStage(hour, {
                          acceptanceLimitMax: event.target.value,
                        })}
                        placeholder="Maximum Limit"
                        className={inputClass}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Limits are applied to each calculated tablet result:
                      {' '}{min ?? '—'} to {max ?? '—'}.
                    </p>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => calculateStage(hour)}
                      className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white outline-none transition hover:from-emerald-800 hover:to-slate-950 focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Calculate Result
                    </button>
                  </div>

                  <div className="rounded-lg border-2 border-emerald-300">
                    <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                      Result — {hourLabel(hour)}
                    </div>
                    <div className="grid gap-2 p-4 text-sm">
                      {calculationStage.results.map((result, index) => {
                        const status = getPassStatus(result, calculationStage);

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3"
                          >
                            <span className="font-semibold">Tablet-{index + 1}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-bold">
                                {result === null
                                  ? '—'
                                  : `${Number(result).toFixed(2)} % of L.C.`}
                              </span>
                              {status !== null && (
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                                    status
                                      ? 'border-green-300 bg-green-100 text-green-800'
                                      : 'border-red-300 bg-red-100 text-red-800'
                                  }`}
                                >
                                  {status ? 'Pass' : 'Fail'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <div className="rounded-lg border border-dashed border-emerald-300 p-8 text-center text-sm text-slate-500">
              Select a sample preparation to view the three dissolution stages.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
