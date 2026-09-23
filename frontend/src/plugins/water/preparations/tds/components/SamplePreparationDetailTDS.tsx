import React, { useState } from "react";
import { ChevronDown, FlaskConical, Trash } from "lucide-react";
import { motion } from "framer-motion";
import type { SamplePreparationTDS, SamplePreparationTDSStep } from "../models/SamplePreparationTDS";

interface Props {
  samplePreparation: SamplePreparationTDS;
  onStepChange: (samplePreparationId: number, stepName: string, field: keyof SamplePreparationTDSStep, newValue: string) => void;
  onRemove: () => void;
  role: string;
  isLocked: boolean;
  parameterType: string;
}

const SamplePreparationDetailTDS: React.FC<Props> = ({ samplePreparation, onStepChange, onRemove, isLocked }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-5 w-5" />
          <div><div className="font-semibold">{samplePreparation.label}</div><div className="text-xs text-emerald-100">Total Dissolved Solids (TDS) inputs</div></div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="rounded p-1 text-white"><ChevronDown className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} /></button>
          <button type="button" disabled={isLocked} onClick={onRemove} className="rounded p-1 text-white disabled:opacity-40"><Trash className="h-4 w-4" /></button>
        </div>
      </div>
      {expanded && <div className="space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5">
        {samplePreparation.steps.map((step) => <div key={step.name} className="grid items-center gap-3 rounded-lg border border-emerald-200 bg-white p-3 md:grid-cols-[minmax(0,1fr)_220px_70px]">
          <label className="text-sm font-semibold text-emerald-900">{step.name}</label>
          <input value={step.value1 ?? ""} disabled={isLocked} placeholder="Enter value" onChange={(event) => onStepChange(samplePreparation.id, step.name, "value1", event.target.value)} className="rounded-lg border border-emerald-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
          <span className="text-xs font-semibold text-slate-500">{step.unit1 || "—"}</span>
        </div>)}
      </div>}
    </motion.div>
  );
};
export default SamplePreparationDetailTDS;
