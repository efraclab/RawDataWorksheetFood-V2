/**
 * Multiple-tube (MPN / tube Presence-Absence) tests: LST/BGLB coliform, EC broth
 * E. coli, faecal coliform MPN, Salmonella MPN. One config file per test.
 */

/** One row of a tube table: a dilution, a series or a strength, with its tubes. */
export interface TubeGroupConfig {
  readonly label: string;
  readonly tubes: number;
}

/** One tube table, e.g. "Presumptive Test" or "Confirmed Test". */
export interface TubeStageConfig {
  readonly title: string;
  readonly media?: string;
  /** Incubation text shown under the title, e.g. "37 °C for 24 / 48 h". */
  readonly incubation?: string;
  readonly inoculation?: string;
  readonly groups: readonly TubeGroupConfig[];
  /** Reading columns per tube, e.g. ["24 h", "48 h"]. */
  readonly readings: readonly string[];
}

/**
 * Final calculation, copied from the sheets:
 * - "none": analyst enters the MPN index only.
 * - "faecalSolids": MPN/g = 10 × MPN Index/100 mL / (Largest volume × % dry solids)  (sheet 83)
 * - "salmonellaSolids": MPN/4 g = MPN Index/100 mL × 4 / % dry solids              (sheet 84)
 */
export type MpnFormula = "none" | "faecalSolids" | "salmonellaSolids";

export interface MpnResultConfig {
  readonly formula: MpnFormula;
  readonly unit: string;
}

export interface MpnConfig {
  readonly key: string;
  readonly moduleId: string;
  readonly persistenceType: string;
  readonly title: string;
  readonly testName: string;
  readonly media: string;
  readonly method: string;
  readonly stages: readonly TubeStageConfig[];
  /** Free-text rows after the tables (Positive control, Blank, Indole test...). */
  readonly extraTextSteps?: readonly string[];
  /**
   * Which stage decides a positive tube. A tube is positive when any of the
   * listed readings (default: all readings) is "+".
   */
  readonly countStage: number;
  readonly countReadings?: readonly string[];
  /** Show the Present / Absent result. */
  readonly presence: boolean;
  /** Show the MPN result. Omit for Present / Absent only. */
  readonly mpn?: MpnResultConfig;
}
