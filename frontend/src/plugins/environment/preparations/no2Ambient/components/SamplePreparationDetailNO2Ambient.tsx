import React, { useMemo, useState } from "react";
import { ChevronDown, FlaskConical, Trash } from "lucide-react";
import { motion } from "framer-motion";
import type { SamplePreparationNO2Ambient, SamplePreparationNO2AmbientStep } from "../models/SamplePreparationNO2Ambient";
import { calculateNO2Ambient } from "../calculation";

const normalize = (value: unknown): string => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

const getStepValue = (steps: SamplePreparationNO2AmbientStep[], ...names: string[]): string => {
  const wanted = names.map(normalize);
  return steps.find((item) => wanted.includes(normalize(item.name)))?.value1 ?? "";
};

const unitForStep = (name: string): string => {
  const normalized = normalize(name);
  if (normalized === "volumeofairsampled") return "m³";
  if (normalized === "volumeofsample" || normalized === "volumeofaliquottakenforanalysis") return "ml";
  return "";
};

interface Props {
  samplePreparation: SamplePreparationNO2Ambient;
  onStepChange: (samplePreparationId: number, stepName: string, field: keyof SamplePreparationNO2AmbientStep, newValue: string) => void;
  onRemove: () => void;
  role: string;
  isLocked: boolean;
  parameterType: string;
}

const SamplePreparationDetailNO2Ambient: React.FC<Props> = ({ samplePreparation, onStepChange, onRemove, isLocked }) => {
  const [expanded, setExpanded] = useState(true);

  const values = useMemo(() => ({
    graphFactor: getStepValue(samplePreparation.steps, "Graph factor"),
    sampleAbs: getStepValue(samplePreparation.steps, "Sample abs"),
    blankAbs: getStepValue(samplePreparation.steps, "Blank abs"),
    dilutionFactor: getStepValue(samplePreparation.steps, "Dilution factor"),
    samplingEfficiency: getStepValue(samplePreparation.steps, "Sampling efficiency") || "0.82",
    volumeOfAirSampled: getStepValue(samplePreparation.steps, "Volume of air sampled"),
    volumeOfSample: getStepValue(samplePreparation.steps, "Volume of sample"),
    volumeOfAliquot: getStepValue(samplePreparation.steps, "Volume of aliquot taken for analysis"),
  }), [samplePreparation.steps]);

  const calculation = useMemo(() => calculateNO2Ambient(values), [values]);
  const analyzedSample = calculation.success ? String(calculation.analyzedSample) : "—";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-5 w-5" />
          <div><div className="font-semibold">{samplePreparation.label}</div><div className="text-xs text-emerald-100">NO2 Ambient inputs</div></div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setExpanded((value) => !value)} className="rounded p-1 text-white"><ChevronDown className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} /></button>
          <button type="button" disabled={isLocked} onClick={onRemove} className="rounded p-1 text-white disabled:opacity-40"><Trash className="h-4 w-4" /></button>
        </div>
      </div>

      {expanded && <div className="space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5">
        {samplePreparation.steps.map((step) => {
          const isEfficiency = normalize(step.name) === "samplingefficiency";
          return (
            <div key={step.name} className="grid items-center gap-3 rounded-lg border border-emerald-200 bg-white p-3 md:grid-cols-[minmax(0,1fr)_220px_70px]">
              <label className="text-sm font-semibold text-emerald-900">{step.name}</label>
              <input
                value={isEfficiency ? "0.82" : step.value1 ?? ""}
                disabled={isLocked || isEfficiency}
                readOnly={isEfficiency}
                placeholder="Enter value"
                onChange={(event) => onStepChange(samplePreparation.id, step.name, "value1", event.target.value)}
                className={`rounded-lg border border-emerald-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none ${isEfficiency ? "cursor-not-allowed bg-emerald-50 font-semibold text-emerald-800" : ""}`}
              />
              <span className="text-xs font-semibold text-slate-500">{step.unit1 || unitForStep(step.name) || "—"}</span>
            </div>
          );
        })}

        <div className="grid items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3 md:grid-cols-[minmax(0,1fr)_220px_70px]">
          <div>
            <label className="text-sm font-semibold text-emerald-900">NO2 Concentration in analyzed sample</label>
            <p className="text-xs text-emerald-700">Auto calculated: Graph factor × (Sample abs − Blank abs)</p>
          </div>
          <input value={analyzedSample} readOnly aria-label="NO2 Concentration in analyzed sample" className="cursor-not-allowed rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-950" />
          <span className="text-xs font-semibold text-slate-600">µg</span>
        </div>
      </div>}
    </motion.div>
  );
};

export default SamplePreparationDetailNO2Ambient;
