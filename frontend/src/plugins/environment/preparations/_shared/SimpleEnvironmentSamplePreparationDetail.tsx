import { ChevronDown, FlaskConical, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { SimpleEnvironmentConfig, SimpleEnvironmentSamplePreparation } from "./types";

interface Props {
  config: SimpleEnvironmentConfig;
  samplePreparation: SimpleEnvironmentSamplePreparation;
  onStepChange: (preparationId: number, stepName: string, value: string) => void;
  onRemove: () => void;
  isLocked: boolean;
}

export default function SimpleEnvironmentSamplePreparationDetail({
  config,
  samplePreparation,
  onStepChange,
  onRemove,
  isLocked,
}: Props) {
  const [expanded, setExpanded] = useState(true);

  const numericValues = useMemo(() => {
    const values: Record<string, number> = {};
    config.fields.forEach((field) => {
      const step = samplePreparation.steps.find((item) => item.name === field.name);
      const value = Number(step?.value1 ?? "");
      if (Number.isFinite(value)) values[field.key] = value;
    });
    return values;
  }, [config.fields, samplePreparation.steps]);

  return (
    <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-5 w-5" />
          <div>
            <div className="font-semibold">{samplePreparation.label}</div>
            <div className="text-xs text-emerald-100">{config.shortName} inputs</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="rounded p-1 text-white" aria-label="Toggle preparation">
            <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          <button type="button" disabled={isLocked} onClick={onRemove} className="rounded p-1 text-white disabled:opacity-40" aria-label="Remove preparation">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5">
          {config.fields.map((field) => {
            const step = samplePreparation.steps.find((item) => item.name === field.name);
            const computedValue = field.compute ? field.compute(numericValues) : null;
            const displayValue = field.compute ? (computedValue ?? "") : (step?.value1 ?? "");
            return (
              <div key={field.key} className="grid items-center gap-3 rounded-lg border border-emerald-200 bg-white p-3 md:grid-cols-[minmax(0,1fr)_220px_90px]">
                <label className="text-sm font-semibold text-emerald-900">
                  {field.name} <span className="ml-1 font-bold text-slate-600">({field.symbol})</span>
                </label>
                <input
                  value={displayValue}
                  readOnly={Boolean(field.readOnly || field.compute)}
                  disabled={isLocked || field.readOnly}
                  placeholder="Enter value"
                  onChange={(event) => onStepChange(samplePreparation.id, field.name, event.target.value)}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${field.compute ? "border-slate-300 bg-slate-100 text-slate-700" : "border-emerald-300 bg-white hover:border-emerald-500 focus:border-emerald-500"} disabled:bg-slate-50`}
                />
                <span className="text-xs font-semibold text-slate-500">{field.unit || "—"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
