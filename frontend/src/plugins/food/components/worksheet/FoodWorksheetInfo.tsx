interface FoodWorksheetInfoProps {
  sampleName: string;
  parameterName: string;
  methodName: string;
}

export default function FoodWorksheetInfo({
  sampleName,
  parameterName,
  methodName,
}: FoodWorksheetInfoProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="grid grid-cols-1">

        <div className="grid grid-cols-[48px_1fr] border-b border-slate-200">

          <div className="flex items-start justify-center bg-emerald-700 py-5 text-sm font-bold text-white">
            1
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[310px_1fr]">

            <div className="border-b border-slate-200 bg-emerald-50 px-5 py-5 font-semibold text-emerald-800 md:border-b-0 md:border-r">
              Sample Particulars
              <span className="block text-sm">
                (All relevant information received with sample to be entered):
              </span>
            </div>

            <div className="px-5 py-5 text-slate-800">
              {sampleName || "—"}
            </div>

          </div>
        </div>


        <div className="grid grid-cols-[48px_1fr] border-b border-slate-200">

          <div className="flex items-start justify-center bg-emerald-700 py-5 text-sm font-bold text-white">
            2
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[310px_1fr]">

            <div className="border-b border-slate-200 bg-emerald-50 px-5 py-5 font-semibold text-emerald-800 md:border-b-0 md:border-r">
              Test(s) required
              <span className="block text-sm">
                (all tests and condition to be entered):
              </span>
            </div>

            <div className="px-5 py-5 text-slate-800">
              {parameterName || "—"}
            </div>

          </div>
        </div>


        <div className="grid grid-cols-[48px_1fr]">

          <div className="flex items-start justify-center bg-emerald-700 py-5 text-sm font-bold text-white">
            3
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[310px_1fr]">

            <div className="bg-emerald-50 px-5 py-5 font-semibold text-emerald-800 md:border-r">
              Method(s) of Analysis / Testing
            </div>

            <div className="px-5 py-5 text-slate-800">
              {methodName || "No methods"}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}