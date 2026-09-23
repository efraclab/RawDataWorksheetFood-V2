import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import CustomDropdown from '../../../../../shared/CustomDropdown';
import type { CalculationLithosun300 } from '../models/CalculationLithosun300';
import type { SamplePreparationLithosun300 } from '../models/SamplePreparationLithosun300';
import { calculateLithosun300 } from '../calculation';

const text = (value: unknown) => (value == null ? '' : String(value));
const numberValue = (value: unknown): number | null => {
  const raw = text(value).trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const step = (
  preparation: SamplePreparationLithosun300 | null,
  name: string,
) => preparation?.steps.find((item) => item.name.toLowerCase() === name.toLowerCase());

const emptyResults = (): Array<number | null> => [null, null, null, null, null, null];

export default function CalculationDetailLithosun300({
  calculation,
  samplePreparations,
  isLocked,
  onRemove,
  onUpdate,
}: {
  calculation: CalculationLithosun300;
  samplePreparations: SamplePreparationLithosun300[];
  isLocked: boolean;
  onRemove: () => void;
  onUpdate: (value: CalculationLithosun300) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const selected = useMemo(
    () => samplePreparations.find(
      (preparation) => preparation.label === calculation.selectedSamplePreparationLabel,
    ) ?? null,
    [samplePreparations, calculation.selectedSamplePreparationLabel],
  );

  const common = useMemo(() => ({
    blank: step(selected, 'Instrument Concentration (Blank)')?.value1 ?? '',
    v1: step(selected, 'Volume makeup (V1)')?.value1 ?? '',
    v2: step(selected, 'Volume taken (V2)')?.value1 ?? '',
    v3: step(selected, 'Volume makeup (V3)')?.value1 ?? '',
    labelClaim: step(selected, 'Label Claim')?.value1 ?? '',
    conversionFactor: step(selected, 'Conversion Factor')?.value1 ?? '',
  }), [selected]);

  const update = (patch: Partial<CalculationLithosun300>) => {
    onUpdate({ ...calculation, ...patch });
  };

  const calculate = () => {
    if (!selected || isLocked) return;
    const required: Array<[string, unknown, boolean]> = [
      ["Instrument Concentration (Blank)", common.blank, false],
      ["Volume makeup (V1)", common.v1, true],
      ["Volume taken (V2)", common.v2, true],
      ["Volume makeup (V3)", common.v3, true],
      ["Label Claim", common.labelClaim, true],
      ["Conversion Factor", common.conversionFactor, true],
    ];
    const errors = required.flatMap(([label, value, positive]) => {
      const raw = text(value).trim();
      if (!raw) return [`${label} is required`];
      const number = numberValue(value);
      if (number === null) return [`${label} must be numeric`];
      return positive && number <= 0 ? [`${label} must be greater than zero`] : [];
    });
    const sampleErrors = calculation.dissolutionSamples
      .map((sample, index) => text(sample).trim() ? (numberValue(sample) === null ? `Dissolution Sample ${index + 1} must be numeric` : '') : `Dissolution Sample ${index + 1} is required`)
      .filter(Boolean);
    const allErrors = [...errors, ...sampleErrors];
    setValidationErrors(allErrors);
    if (allErrors.length > 0) return;

    const results = calculation.dissolutionSamples.map((sample) => {
      const result = calculateLithosun300({ sample, ...common });
      return result.success ? result.result : null;
    });

    update({ results });
  };

  const minimum = numberValue(calculation.acceptanceLimitMin);
  const maximum = numberValue(calculation.acceptanceLimitMax);
  const hasAcceptanceLimit = minimum !== null || maximum !== null;

  const getPassStatus = (result: number | null) => {
    if (result === null || !hasAcceptanceLimit) return null;
    return (minimum === null || result >= minimum) && (maximum === null || result <= maximum);
  };

  const inputClass =
    'w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70';

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <button type="button" onClick={() => setExpanded((value) => !value)} className="font-semibold">
          {calculation.label} · Lithosun 300
        </button>
        <div className="flex gap-3">
          <button type="button" onClick={() => setExpanded((value) => !value)} aria-label="Toggle calculation">
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>
          <button type="button" disabled={isLocked} onClick={onRemove} aria-label="Remove calculation">
            <Trash2 />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 p-6">
          <div className="rounded-lg border border-emerald-200 p-4">
            <label className="mb-2 block text-sm font-bold">Select Sample Preparation</label>
            <CustomDropdown
              options={samplePreparations.map((preparation) => ({ value: preparation.label, label: preparation.label }))}
              value={calculation.selectedSamplePreparationLabel ?? ''}
              onChange={(value) => update({ selectedSamplePreparationLabel: value || null, results: emptyResults() })}
              colorScheme="emerald"
              disabled={isLocked}
            />
          </div>

          {selected && (
            <>
              <div className="rounded-lg border border-emerald-200 bg-slate-50 p-4 text-center font-mono text-xs">
                ((Dissolution Sample − Blank) × V1 × V3 × 1000) ÷ (Label Claim × V2 × Conversion Factor × 10000)
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
                      const result = calculation.results[index] ?? null;
                      const status = getPassStatus(result);

                      return (
                        <tr key={index} className="border-t border-emerald-100">
                          <td className="p-3 font-semibold">Tablet {index + 1}</td>
                          <td className="p-3">
                            {step(selected, `Instrument Concentration (Sample) Tab ${index + 1}`)?.value1 ?? ''}
                          </td>
                          <td className="p-3">
                            <input
                              disabled={isLocked}
                              inputMode="decimal"
                              value={text(calculation.dissolutionSamples[index])}
                              onChange={(event) => {
                                const values = [...calculation.dissolutionSamples];
                                values[index] = event.target.value;
                                update({ dissolutionSamples: values, results: emptyResults() });
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
                    value={text(calculation.acceptanceLimitMin)}
                    onChange={(event) => update({ acceptanceLimitMin: event.target.value })}
                    placeholder="Minimum Limit"
                    className={inputClass}
                  />
                  <input
                    disabled={isLocked}
                    inputMode="decimal"
                    value={text(calculation.acceptanceLimitMax)}
                    onChange={(event) => update({ acceptanceLimitMax: event.target.value })}
                    placeholder="Maximum Limit"
                    className={inputClass}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Limits are applied to each calculated tablet result: {minimum ?? '—'} to {maximum ?? '—'}.
                </p>
              </div>

              {validationErrors.length > 0 && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4" role="alert">
                  <h4 className="mb-2 text-sm font-bold text-red-800">Validation Errors</h4>
                  <ul className="space-y-1">{validationErrors.map((error) => <li key={error} className="text-xs text-red-700">• {error}</li>)}</ul>
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={calculate}
                  className="rounded-lg bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-3 font-semibold text-white outline-none transition hover:from-emerald-800 hover:to-slate-950 focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Calculate Result
                </button>
              </div>

              <div className="rounded-lg border-2 border-emerald-300">
                <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-2 font-bold text-white">
                  Result
                </div>
                <div className="grid gap-2 p-4 text-sm">
                  {calculation.results.map((result, index) => {
                    const status = getPassStatus(result);

                    return (
                      <div key={index} className="flex items-center justify-between gap-3">
                        <span className="font-semibold">Tablet-{index + 1}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">
                            {result === null ? '—' : `${Number(result).toFixed(2)} % of L.C.`}
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
