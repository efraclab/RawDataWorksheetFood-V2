import type { PreparationAttachedFile } from "../../../../core/preparation-engine/components/FileAttachmentSection";

/**
 * One saved step. Table rows keep their cells in `cells`. value1 always holds a
 * readable summary (or the field value), because the print report shows only value1.
 */
export interface FormulaStep {
  name: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  value3?: string;
  unit3?: string;
  logBookID?: string;
  cells?: string[];
}

export interface SamplePreparationFormula {
  id: number;
  label: string;
  steps: FormulaStep[];
}

export interface FormulaModuleData {
  samplePreparations: SamplePreparationFormula[];
  files: PreparationAttachedFile[];
  calculations: never[];
  completed: boolean;
  completedAt: string | null;
}

export type FormulaModuleDraft = FormulaModuleData;
