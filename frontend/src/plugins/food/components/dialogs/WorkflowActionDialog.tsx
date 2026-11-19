import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, Loader2, ClipboardCheck } from "lucide-react";

interface Props {
  isOpen: boolean;
  busy?: boolean;
  title: string;
  subtitle: string;
  parameterName?: string;
  parameterCode?: string;
  confirmText: string;
  busyText: string;
  commentLabel?: string;
  commentPlaceholder?: string;
  warning?: string;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}

export default function WorkflowActionDialog({
  isOpen, busy = false, title, subtitle, parameterName, parameterCode,
  confirmText, busyText, commentLabel, commentPlaceholder, warning,
  onClose, onConfirm,
}: Props) {
  const [comment, setComment] = React.useState("");
  React.useEffect(() => { if (!isOpen) setComment(""); }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.15}}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !busy && onClose()}>
          <motion.div initial={{opacity:0,scale:.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95,y:20}}
            transition={{type:"spring",damping:30,stiffness:400}} onClick={e=>e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"><ClipboardCheck className="w-6 h-6 text-white"/></div>
                <div className="flex-1"><h3 className="text-xl font-semibold text-white">{title}</h3><p className="text-sm text-emerald-200 mt-0.5">{subtitle}</p></div>
                {!busy && <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"><X className="w-5 h-5 text-white"/></button>}
              </div>
            </div>
            <div className="p-6 space-y-4">
              {(parameterName || parameterCode) && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-white"/></div><div><p className="text-sm font-semibold text-emerald-900">{parameterName || "Parameter"}</p><p className="text-xs text-emerald-700 font-mono">{parameterCode || ""}</p></div></div></div>}
              {warning && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"><div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4 text-amber-600"/></div><p className="text-sm text-amber-800 leading-relaxed">{warning}</p></div>}
              {commentLabel && <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">{commentLabel}</label><textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder={commentPlaceholder} rows={3} className="w-full text-sm text-slate-700 bg-white border border-slate-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"/></div>}
            </div>
            <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-200">
              <button onClick={onClose} disabled={busy} className="flex-1 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
              <button onClick={()=>onConfirm(comment)} disabled={busy} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-slate-800 text-white font-medium rounded-lg hover:from-emerald-800 hover:to-slate-900 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {busy ? <><Loader2 className="w-4 h-4 animate-spin"/><span>{busyText}</span></> : <><CheckCircle2 className="w-4 h-4"/><span>{confirmText}</span></>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
