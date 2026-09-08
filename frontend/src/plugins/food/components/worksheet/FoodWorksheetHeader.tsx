interface FoodWorksheetHeaderProps {
  worksheetId: string;
  registrationNo: string;
  sampleName: string;
  parameterCount: number;
  dueDate?: string;
  displayStatus: string;
}

function formatDueDate(value?: string): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
}

export default function FoodWorksheetHeader({
  worksheetId,
  registrationNo,
  sampleName,
  parameterCount,
  dueDate,
  displayStatus,
}: FoodWorksheetHeaderProps) {
  return (
    <div className="space-y-4">

      {/* Main worksheet banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-slate-800 px-6 py-5 text-white shadow-lg">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="text-sm font-medium text-emerald-100">
              Worksheet ID
            </div>

            <div className="mt-1 text-2xl font-bold tracking-wide">
              {worksheetId}
            </div>
          </div>


          <div className="inline-flex w-fit items-center rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            {displayStatus || "—"}
          </div>

        </div>
      </div>


      {/* Worksheet summary */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-2">

          <div className="border-b border-slate-200 bg-emerald-700 px-5 py-4 text-white md:border-r">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
              Registration No.
            </span>

            <p className="mt-1 font-semibold">
              {registrationNo || "—"}
            </p>
          </div>


          <div className="border-b border-slate-200 bg-emerald-700 px-5 py-4 text-white">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
              Sample Name
            </span>

            <p className="mt-1 font-semibold">
              {sampleName || "—"}
            </p>
          </div>


          <div className="px-5 py-4 md:border-r md:border-slate-200">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Number of Parameters
            </span>

            <p className="mt-1 font-semibold text-slate-800">
              {parameterCount}
            </p>
          </div>


          <div className="px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Due Date
            </span>

            <p className="mt-1 font-semibold text-slate-800">
              {formatDueDate(dueDate)}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}