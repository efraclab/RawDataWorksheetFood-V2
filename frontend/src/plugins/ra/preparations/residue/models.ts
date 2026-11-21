import type { PreparationAttachedFile } from "../../../../core/preparation-engine/components/FileAttachmentSection";

/**
 * One saved step. `name` is "<Section title>: <Step>" so names stay unique.
 * `blanks` holds the fill-in values of a template step.
 */
export interface ResidueStep {
  name: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  value3?: string;
  unit3?: string;
  logBookID?: string;
  blanks?: string[];
}

export interface SamplePreparationResidue {
  id: number;
  label: string;
  steps: ResidueStep[];
}

export interface ResidueAnalyte {
  name: string;
  /** Instrument concentration as typed (µg/kg). */
  concentration: string;
  resultUgKg: number | null;
  resultMgKg: number | null;
}

export interface CalculationResidue {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  /** Shown by the print report as "Formula". */
  formula: string;
  dilutionFactor: number | string;
  analytes: ResidueAnalyte[];
  /** All analyte results as one line. Printed by the report. */
  resultBreakdown: string;
  calculationResult: number | string | null;
  calculationResultUnit: string;
}

export interface ResidueModuleData {
  samplePreparations: SamplePreparationResidue[];
  files: PreparationAttachedFile[];
  calculations: CalculationResidue[];
  completed: boolean;
  completedAt: string | null;
}

export type ResidueModuleDraft = ResidueModuleData;