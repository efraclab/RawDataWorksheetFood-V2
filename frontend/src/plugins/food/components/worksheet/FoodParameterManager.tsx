export interface FoodWorksheetParameter {
  id: number;
  parameterName?: string;
  paraCode?: string;
  status?: string;
}

interface FoodParameterManagerProps {
  parameters: FoodWorksheetParameter[];
  selectedParameterId: number | null;
  onSelect: (parameter: FoodWorksheetParameter) => void;
}

export default function FoodParameterManager({
  parameters,
  selectedParameterId,
  onSelect,
}: FoodParameterManagerProps) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Parameters
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a parameter to view its details.
          </p>
        </div>

        <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          {parameters.length}
        </div>

      </div>


      {parameters.length === 0 ? (

        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">

          <p className="font-medium text-slate-600">
            No parameters available.
          </p>

        </div>

      ) : (

        <div className="mt-5 space-y-3">

          {parameters.map((parameter, index) => {

            const isSelected =
              selectedParameterId === parameter.id;

            return (
              <button
                key={parameter.id}
                type="button"
                onClick={() => onSelect(parameter)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
                }`}
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-sm font-bold text-white">
                    {index + 1}
                  </div>


                  <div className="min-w-0 flex-1">

                    <div className="font-semibold text-slate-800">
                      {parameter.parameterName ||
                        parameter.paraCode ||
                        "Unnamed Parameter"}
                    </div>

                    {parameter.paraCode && (
                      <div className="mt-1 text-xs text-slate-500">
                        Code: {parameter.paraCode}
                      </div>
                    )}

                  </div>


                  <div className="text-xs font-semibold text-slate-500">
                    {parameter.status || "Created"}
                  </div>

                </div>

              </button>
            );
          })}

        </div>

      )}

    </section>
  );
}