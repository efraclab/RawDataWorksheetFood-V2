import { Calculator } from "lucide-react";
import type { CalculationCyanide } from "../models/CalculationCyanide";
import type { SamplePreparationCyanide } from "../models/SamplePreparationCyanide";
import CalculationDetailCyanide from "./CalculationDetailCyanide";

interface Props {
  calculations: CalculationCyanide[];
  samplePreparations: SamplePreparationCyanide[];
  canEditCalculations: boolean;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (calculation: CalculationCyanide) => void;
}

export default function CyanideCalculationSection({
  calculations,
  samplePreparations,
  canEditCalculations,
  onAdd,
  onRemove,
  onUpdate,
}: Props) {
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
            Cyanide (as CN) Calculation
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
              No Cyanide calculations added yet
            </p>
            <p className="text-xs text-emerald-600/80">
              Click &quot;Add Calculation&quot; to begin
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {calculations.map((calculation) => (
              <CalculationDetailCyanide
                key={calculation.id}
                calculation={calculation}
                samplePreparations={samplePreparations}
                onRemove={() => onRemove(calculation.id)}
                onUpdate={onUpdate}
                isLocked={!canEditCalculations}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
