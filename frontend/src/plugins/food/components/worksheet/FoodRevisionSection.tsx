import { motion } from "framer-motion";
import type { ParameterDetail } from "../../models/ParameterDetail";

interface Props {
  parameter: ParameterDetail;
  status: string;
  reviewerComment?: string | null;
  qaComment?: string | null;
  revisionStarted: boolean;
  onStartRevision: () => void;
  onCompleteRevision: () => void;
}

export default function FoodRevisionSection({
  parameter,
  status,
  reviewerComment,
  qaComment,
  revisionStarted,
  onStartRevision,
  onCompleteRevision,
}: Props) {
  const normalized = String(status || parameter.status || "")
    .trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  if (!["analysis revision", "analysis revision started"].includes(normalized)) return null;
  const fromQA = Boolean(qaComment);
  const sender = fromQA ? "QA" : "Reviewer";
  const comment = fromQA ? qaComment : reviewerComment;
  const header = fromQA
    ? "from-amber-50 via-amber-100 to-amber-50"
    : "from-orange-50 via-orange-100 to-orange-50";
  const text = fromQA ? "text-amber-700" : "text-orange-700";
  const border = fromQA ? "border-amber-200" : "border-orange-200";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
      <div className={`bg-gradient-to-r ${header} px-6 py-5 border-b border-slate-200`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${fromQA ? "bg-amber-100" : "bg-orange-100"} rounded-xl flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${text} animate-pulse`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8 8 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8 8 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Revision Requested by {sender}</h3>
              <p className="text-sm text-slate-600 mt-0.5">
                {revisionStarted
                  ? 'Revision in progress — make your changes and click "Complete Revision" when done'
                  : `${sender} has requested revisions. Click "Start Revision" to unlock editing`}
              </p>
            </div>
          </div>
          {revisionStarted ? (
            <motion.button type="button" onClick={onCompleteRevision} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`px-5 py-2.5 bg-white/60 backdrop-blur-sm border ${border} ${text} text-sm font-semibold rounded-lg hover:bg-white/80 transition-all flex items-center gap-2 shadow-sm`}>
              <span>✓</span> Complete Revision
            </motion.button>
          ) : (
            <motion.button type="button" onClick={onStartRevision} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`px-5 py-2.5 ${fromQA ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-gradient-to-r from-orange-500 to-orange-600"} text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-md`}>
              <span>✎</span> Start Revision
            </motion.button>
          )}
        </div>
      </div>
      <div className={`p-6 ${fromQA ? "bg-amber-50" : "bg-orange-50"}`}>
        {comment && (
          <div className={`bg-white border ${border} rounded-xl p-5`}>
            <h4 className="font-semibold text-sm text-slate-800 mb-2">Revision Remarks <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fromQA ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700"}`}>from {sender}</span></h4>
            <p className={`text-sm italic leading-relaxed px-4 py-3 rounded-lg border ${fromQA ? "text-amber-900 bg-amber-50 border-amber-100" : "text-orange-900 bg-orange-50 border-orange-100"}`}>“{comment}”</p>
          </div>
        )}
        <div className="mt-4 bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-sm text-slate-800 mb-2">{revisionStarted ? "Revision Mode Active" : "Revision Pending — Action Required"}</h4>
          <ul className="text-sm text-slate-600 space-y-2">
            {!revisionStarted ? (
              <>
                <li>• Review {sender}&apos;s feedback above carefully</li>
                <li>• Click <strong>&quot;Start Revision&quot;</strong> to unlock the parameter for editing</li>
              </>
            ) : (
              <>
                <li>• Review {sender}&apos;s feedback above and make necessary corrections</li>
                <li>• You have full editing access to all preparations and calculations</li>
                <li>• Click <strong>&quot;Save Draft&quot;</strong> to save your changes</li>
                <li>• Click <strong>&quot;Complete Revision&quot;</strong> when all changes are done</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
