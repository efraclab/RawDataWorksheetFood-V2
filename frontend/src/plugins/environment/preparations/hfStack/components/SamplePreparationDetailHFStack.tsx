import React, { useState } from "react";
import { ChevronDown, FlaskConical, Trash } from "lucide-react";
import { motion } from "framer-motion";
import type {
  HFStackSection,
  SamplePreparationHFStack,
  SamplePreparationHFStackStep,
} from "../models/SamplePreparationHFStack";

interface Props {
  samplePreparation: SamplePreparationHFStack;
  onStepChange: (
    samplePreparationId: number,
    stepName: string,
    field: keyof SamplePreparationHFStackStep,
    newValue: string,
    section?: HFStackSection,
  ) => void;
  onRemove: () => void;
  role: string;
  isLocked: boolean;
  parameterType: string;
}

const sections: Array<{ key: HFStackSection; title: string }> = [
  { key: "particulate", title: "Calculation (in particulate)" },
  { key: "h2so4", title: "Calculation (in H₂SO₄)" },
  { key: "naoh", title: "Calculation (in NaOH)" },
];

const SamplePreparationDetailHFStack: React.FC<Props> = ({
  samplePreparation,
  onStepChange,
  onRemove,
  isLocked,
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-5 w-5" />

          <div>
            <div className="font-semibold">{samplePreparation.label}</div>
            <div className="text-xs text-emerald-100">
              HF Stack inputs
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded p-1 text-white"
            aria-label="Toggle preparation"
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            type="button"
            disabled={isLocked}
            onClick={onRemove}
            className="rounded p-1 text-white disabled:opacity-40"
            aria-label="Remove preparation"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 bg-gradient-to-br from-emerald-50/50 to-slate-50/30 p-5">
          {sections.map((section) => (
            <div
              key={section.key}
              className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm"
            >
              <div className="border-b border-emerald-200 bg-gradient-to-r from-white via-emerald-50/60 to-white px-4 py-3">
                <h4 className="text-sm font-bold text-emerald-900">
                  {section.title}
                </h4>
              </div>

              <div className="space-y-3 p-4">
                {samplePreparation.steps
                  .filter((step) => step.section === section.key)
                  .map((step) => (
                    <div
                      key={`${section.key}-${step.name}`}
                      className="grid items-center gap-3 rounded-lg border border-emerald-200 bg-white p-3 md:grid-cols-[minmax(0,1fr)_220px_70px]"
                    >
                      <label className="text-sm font-semibold text-emerald-900">
                        {step.name}
                      </label>

                      <input
                        value={step.value1 ?? ""}
                        disabled={isLocked}
                        placeholder="Enter value"
                        onChange={(event) =>
                          onStepChange(
                            samplePreparation.id,
                            step.name,
                            "value1",
                            event.target.value,
                            section.key,
                          )
                        }
                        className="rounded-lg border border-emerald-300 px-3 py-2 text-sm outline-none transition-colors hover:border-emerald-500 focus:border-emerald-500 disabled:bg-slate-50"
                      />

                      <span className="text-xs font-semibold text-slate-500">
                        {step.unit1 || "—"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SamplePreparationDetailHFStack;
