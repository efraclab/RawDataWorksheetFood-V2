import type { PreparationAttachedFile } from "../../../../core/preparation-engine/components/FileAttachmentSection";

/**
 * One saved step. `counts` holds the dilution-grid cells for a replicate row
 * (10^0 ... 10^-10). Cells are free text because the lab records values such
 * as TNTC, NA and <1 as well as numbers.
 */
export interface PlateCountStep {
  name: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  value3?: string;
  unit3?: string;
  logBookID?: string;
  counts?: string[];
  /** Confirmation-test row: started, completed, media, temp, time, colony, sample, positive, blank. */
  confirm?: Record<string, string>;
  /** Plate-wise counts: one cell per dilution column x time point (index = column * timePoints + time). */
  plates?: string[];
}

export interface SamplePreparationPlateCount {
  id: number;
  label: string;
  steps: PlateCountStep[];
}

export interface CalculationPlateCount {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  /** Shown by the print report as "Formula". */
  formula: string;
  replicationFactor: number | string;
  dilutionFactor: number | string;
  totalColonies: number | null;
  /** Per-group results as one line (Yeast and Mould tests). Printed by the report. */
  resultBreakdown: string;
  calculationResult: number | string | null;
  calculationResultUnit: string;
}

export interface PlateCountModuleData {
  samplePreparations: SamplePreparationPlateCount[];
  files: PreparationAttachedFile[];
  calculations: CalculationPlateCount[];
  completed: boolean;
  completedAt: string | null;
}

export type PlateCountModuleDraft = PlateCountModuleData;