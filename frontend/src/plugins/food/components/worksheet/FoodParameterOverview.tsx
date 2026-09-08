import type {
  FoodWorksheetParameter,
} from "./FoodParameterManager";

interface FoodParameterOverviewProps {
  parameter: FoodWorksheetParameter;
}

export default function FoodParameterOverview({
  parameter,
}: FoodParameterOverviewProps) {
  return (
    <section className="mt-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">

      <div className="border-b border-slate-200 pb-4">

        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Selected Parameter
        </div>

        <h2 className="mt-1 text-xl font-bold text-slate-800">
          {parameter.parameterName ||
            parameter.paraCode ||
            "Unnamed Parameter"}
        </h2>

      </div>


      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl bg-slate-50 p-4">

          <div className="text-xs font-semibold uppercase text-slate-500">
            Parameter Code
          </div>

          <div className="mt-1 font-semibold text-slate-800">
            {parameter.paraCode || "—"}
          </div>

        </div>


        <div className="rounded-xl bg-slate-50 p-4">

          <div className="text-xs font-semibold uppercase text-slate-500">
            Status
          </div>

          <div className="mt-1 font-semibold text-slate-800">
            {parameter.status || "Created"}
          </div>

        </div>


        <div className="rounded-xl bg-slate-50 p-4">

          <div className="text-xs font-semibold uppercase text-slate-500">
            Parameter ID
          </div>

          <div className="mt-1 font-semibold text-slate-800">
            {parameter.id}
          </div>

        </div>

      </div>

    </section>
  );
}