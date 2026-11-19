import type { PreparationAttachedFile } from "../../../../core/preparation-engine/components/FileAttachmentSection";

/** Fields of one stage-table row. Keys match DETECTION_ROW_FIELDS in factory.ts. */
export type DetectionRowValues = Record<string, string>;

/** Final Present / Absent result. */
export interface DetectionResultValue {
  status: string;
  per: string;
}

/**
 * One saved step. Header fields use value1. Stage rows keep their cells in `row`
 * and the result keeps its fields in `result`. value1 of those steps always holds
 * a readable one-line summary, because the print report shows only value1.
 */
export interface DetectionStep {
  name: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  value3?: string;
  unit3?: string;
  logBookID?: string;
  row?: DetectionRowValues;
  result?: DetectionResultValue;
}

export interface SamplePreparationDetection {
  id: number;
  label: string;
  steps: DetectionStep[];
}

export interface DetectionModuleData {
  samplePreparations: SamplePreparationDetection[];
  files: PreparationAttachedFile[];
  /** Detection tests have no calculation. Kept empty so the draft has the same shape as other modules. */
  calculations: never[];
  completed: boolean;
  completedAt: string | null;
}

export type DetectionModuleDraft = DetectionModuleData;
