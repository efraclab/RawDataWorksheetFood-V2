import type { PreparationAttachedFile } from "../../../../core/preparation-engine/components/FileAttachmentSection";

/** Result fields. All text so the analyst's entries are kept as written. */
export interface MpnResultValue {
  status: string;
  per: string;
  mpnIndex: string;
  largestVolume: string;
  drySolids: string;
  /** Calculated value (or the MPN index when there is no formula). */
  mpnResult: string;
}

/**
 * One saved step. Tube rows keep their cells in `tubes`
 * (index = reading × tubes + tube). value1 always holds a readable summary,
 * because the print report shows only value1.
 */
export interface MpnStep {
  name: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  value3?: string;
  unit3?: string;
  logBookID?: string;
  tubes?: string[];
  result?: MpnResultValue;
}

export interface SamplePreparationMpn {
  id: number;
  label: string;
  steps: MpnStep[];
}

export interface MpnModuleData {
  samplePreparations: SamplePreparationMpn[];
  files: PreparationAttachedFile[];
  calculations: never[];
  completed: boolean;
  completedAt: string | null;
}

export type MpnModuleDraft = MpnModuleData;
