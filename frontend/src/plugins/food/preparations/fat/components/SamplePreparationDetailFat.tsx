import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Trash } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";

interface Props {
  samplePreparation: any;
  onStepChange: (
    samplePreparationId: number,
    stepName: string,
    field: "value1" | "unit1" | "value2" | "unit2" | "logBookID",
    newValue: string
  ) => void;
  onRemove: () => void;
  role: string;
  isLocked: boolean;
  parameterType: string;
}

const massUnits = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
];

const volumeUnits = [
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "µL", label: "µL" },
];

const SamplePreparationDetailFat: React.FC<Props> = ({
  samplePreparation,
  onStepChange,
  onRemove,
  isLocked,
}) => {
  const [expanded, setExpanded] = useState(true);
  const steps = Array.isArray(samplePreparation?.steps)
    ? samplePreparation.steps
    : [];

  const unitOptions = (unit: string) => {
    const u = unit.toLowerCase();
    if (u === "mg" || u === "g" || u === "kg") return massUnits;
    if (u === "ml" || u === "l" || u === "µl") return volumeUnits;
    return [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-700/20 to-slate-900/20 blur-xl" />
      <div className="relative overflow-hidden rounded-xl border border-emerald-200/60 bg-white shadow-lg">
        <div className={`relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 ${expanded ? "rounded-t-xl" : "rounded-xl"}`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-1 items-center gap-4">
              <div className="rounded-lg border border-white/30 bg-white/20 p-2">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide text-white">
                  {samplePreparation.label}
                </h4>
                <p className="text-xs text-emerald-100">
                  Sample Preparation for FAT Details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setExpanded(v => !v)} className="rounded-lg p-2 hover:bg-white/20">
                <ChevronDown className={`h-5 w-5 text-white transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              <button type="button" onClick={onRemove} disabled={isLocked} className="rounded-lg p-2 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40">
                <Trash className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5"
            >
              {steps.map((step: any, index: number) => {
                const options = unitOptions(String(step.unit1 ?? ""));
                return (
                  <div key={`${samplePreparation.id}-${index}`} className="rounded-xl border border-emerald-200/60 bg-white p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-slate-800 text-xs font-bold text-white shadow-md">
                        {index + 1}
                      </div>
                      <div className="font-bold text-sm text-emerald-900">{step.name}</div>
                      <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <input
                        disabled={isLocked}
                        type="number"
                        min="0"
                        step="0.0001"
                        inputMode="decimal"
                        value={step.value1 ?? ""}
                        placeholder={`Enter ${step.name}`}
                        onChange={e => onStepChange(samplePreparation.id, step.name, "value1", e.target.value)}
                        className="w-40 rounded-lg border border-emerald-300 bg-white px-2.5 py-2 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                      />
                      {options.length > 0 && (
                        <div className="w-24">
                          <CustomDropdown
                            disabled={isLocked}
                            options={options}
                            value={step.unit1 ?? ""}
                            onChange={v => onStepChange(samplePreparation.id, step.name, "unit1", v)}
                            colorScheme="emerald"
                          />
                        </div>
                      )}
                      <span className="text-gray-500">(Value)</span>

                      {(step.value2 !== undefined || step.unit2 !== undefined) && (
                        <>
                          <span className="text-gray-500">for</span>
                          <input
                            disabled={isLocked}
                            type="number"
                            min="0"
                            step="0.01"
                            value={step.value2 ?? ""}
                            placeholder="Enter time"
                            onChange={e => onStepChange(samplePreparation.id, step.name, "value2", e.target.value)}
                            className="w-28 rounded-lg border border-emerald-300 bg-white px-2.5 py-2 text-xs disabled:bg-gray-100"
                          />
                          <span className="text-gray-500">{step.unit2 ?? ""}</span>
                        </>
                      )}
                      <span className="text-gray-500">(Log ID:</span>
                      <input
                        disabled={isLocked}
                        type="text"
                        value={step.logBookID ?? ""}
                        placeholder="Enter ID"
                        onChange={e => onStepChange(samplePreparation.id, step.name, "logBookID", e.target.value)}
                        className="w-24 rounded-lg border border-emerald-300 px-2.5 py-2 text-xs disabled:bg-gray-100"
                      />
                      <span className="text-gray-500">)</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SamplePreparationDetailFat;
