import type { PreparationAttachedFile } from "../../../../core/preparation-engine/components/FileAttachmentSection";

/** One saved step. `name` is "<Section>: <Field>" so names stay unique. */
export interface GasStep {
  name: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  value3?: string;
  unit3?: string;
  logBookID?: string;
}

export interface SamplePreparationGas {
  id: number;
  label: string;
  steps: GasStep[];
}

export interface CalculationGas {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  /** Shown by the print report as "Formula". */
  formula: string;
  /** Raw values used, as one line (e.g. "W1 = 10; W2 = 20; W3 = 10.5"). Printed by the report. */
  resultBreakdown: string;
  calculationResult: number | string | null;
  calculationResultUnit: string;
}

export interface GasModuleData {
  samplePreparations: SamplePreparationGas[];
  files: PreparationAttachedFile[];
  calculations: CalculationGas[];
  completed: boolean;
  completedAt: string | null;
}

export type GasModuleDraft = GasModuleData;