import React, { useState } from "react";
import { ChevronDown, FlaskConical, Trash } from "lucide-react";
import { motion } from "framer-motion";
import type { SamplePreparationPM25, SamplePreparationPM25Step } from "../models/SamplePreparationPM25";
import { calculatePM25 } from "../calculation";

const normalize = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const unitForStep = (name: string): string => {
  const normalized = normalize(name);
  if (normalized.includes("averageflowrate")) return "m³/min";
  if (normalized.includes("totalsamplingtime")) return "min";
  if (normalized.includes("initialweightoffilter") || normalized.includes("finalweightoffilter")) return "gm";
  return "";
};

const getStepValue = (steps: SamplePreparationPM25Step[], ...names: string[]): string => {
  const wanted = names.map(normalize);
  return steps.find((step) => wanted.includes(normalize(step.name)))?.value1 ?? "";
};

interface Props {
  samplePreparation: SamplePreparationPM25;
  onStepChange: (samplePreparationId: number, stepName: string, field: keyof SamplePreparationPM25Step, newValue: string) => void;
  onRemove: () => void;
  role: string;
  isLocked: boolean;
  parameterType: string;
}

const SamplePreparationDetailPM25: React.FC<Props> = ({ samplePreparation, onStepChange, onRemove, isLocked }) => {
  const [expanded, setExpanded] = useState(true);

  const averageFlowRate = getStepValue(samplePreparation.steps, "Average Flow Rate");
  const samplingTime = getStepValue(samplePreparation.steps, "Total Sampling Time");
  const initialWeight = getStepValue(samplePreparation.steps, "Initial Weight of Filter");
  const finalWeight = getStepValue(samplePreparation.steps, "Final Weight of Filter");

  const q = Number(averageFlowRate);
  const t = Number(samplingTime);
  const volume = averageFlowRate.trim() !== "" && samplingTime.trim() !== "" && Number.isFinite(q) && Number.isFinite(t) && q > 0 && t > 0
    ? q * t
    : null;
  const calculation = calculatePM25({ averageFlowRate, samplingTime, initialWeight, finalWeight });
  const calculatedValue = (value: number | null): string =>
    value === null ? "—" : Number(value.toFixed(2)).toString();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-5 w-5" />
          <div><div className="font-semibold">{samplePreparation.label}</div><div className="text-xs text-emerald-100">PM25 inputs</div></div>
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
          <span className="text-xs font-semibold text-slate-500">{step.unit1 || unitForStep(step.name) || "—"}</span>
        </div>)}

        <div className="grid items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3 md:grid-cols-[minmax(0,1fr)_220px_70px]">
          <div>
            <label className="text-sm font-semibold text-emerald-900">Volume of Air Sampled</label>
            <p className="text-xs text-emerald-700">Auto calculated: Average Flow Rate × Total Sampling Time</p>
          </div>
          <input value={calculatedValue(volume)} readOnly aria-label="Volume of Air Sampled" className="cursor-not-allowed rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-950" />
          <span className="text-xs font-semibold text-slate-600">m³</span>
        </div>

        <div className="grid items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3 md:grid-cols-[minmax(0,1fr)_220px_70px]">
          <div>
            <label className="text-sm font-semibold text-emerald-900">Mass concentration of particulate matter</label>
            <p className="text-xs text-emerald-700">Auto calculated from filter weight difference and sampled air volume</p>
          </div>
          <input value={calculatedValue(calculation.success ? calculation.result : null)} readOnly aria-label="Mass concentration of particulate matter" className="cursor-not-allowed rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-950" />
          <span className="text-xs font-semibold text-slate-600">µg/m³</span>
        </div>
      </div>}
    </motion.div>
  );
};

export default SamplePreparationDetailPM25;
