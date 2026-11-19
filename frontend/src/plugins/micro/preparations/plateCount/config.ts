/**
 * Everything that differs between plate-count tests (TPC, Coliform, E. coli...).
 * One config file per test; the engine in this folder is shared.
 */
/** One row of the "Biochemical confirmation" table. */
export interface ConfirmationTestConfig {
  readonly name: string;
  readonly media?: string;
  readonly temp?: string;
  readonly time?: string;
  /** Colony characteristics column (only some sheets use it). */
  readonly colony?: string;
  /** Pre-filled "+ve control" observation. */
  readonly positive?: string;
}

/** A reading time (e.g. 24 h, 48 h). Only `counted` rows enter the formula. */
export interface TimePointConfig {
  readonly label: string;
  readonly counted: boolean;
}

/** Plate-wise raw count table (replicate x plate x dilution x time). */
export interface PlateRecordsConfig {
  readonly replicates: number;
  readonly plates: number;
  /** Column headings, e.g. dilutions. Each column has one cell per time point. */
  readonly columnLabels: readonly string[];
}

/** A group of count columns that is calculated on its own (e.g. Yeast and Mould). Results are added together. */
export interface CountGroupConfig {
  readonly key: string;
  readonly label: string;
}

export interface PlateCountConfig {
  /** Short key used for DOM ids, e.g. "tpc". */
  readonly key: string;
  /** V2 module identity, e.g. "micro.tpc". */
  readonly moduleId: string;
  /** Worksheet persistence type (also used as calculationType), e.g. "tpc". */
  readonly persistenceType: string;
  /** Dropdown / header title, e.g. "TPC". */
  readonly title: string;
  /** Full test name from the Excel sheet. */
  readonly testName: string;
  readonly media: string;
  readonly method: string;
  /** Incubation temperature in °C (text, editable). */
  readonly incubationTemp: string;
  /** Incubation time in hours (text, editable). */
  readonly incubationTime: string;
  /** Default replication factor (text, editable). */
  readonly replicationFactor: string;
  /** Default dilution factor (text, editable). Empty = analyst must enter. */
  readonly dilutionFactor: string;
  readonly resultUnit: string;
  /** Number of replicate rows in the dilution grid. Default 2. */
  readonly replicateCount?: number;
  /** Overrides the default "Incubation Temperature (°C)" label. The unit goes in the label. */
  readonly incubationTempLabel?: string;
  /** Overrides the default "Incubation Time (Hours)" label, e.g. when the sheet says "7th day". */
  readonly incubationTimeLabel?: string;
  /** Extra free-text fields shown after Blank (e.g. "Positive Control"). */
  readonly extraTextSteps?: ReadonlyArray<string | { readonly name: string; readonly value?: string }>;
  /** Overrides the default "Inoculation Volume for Pour Plate (ml)" label (e.g. spread plate). */
  readonly inoculationLabel?: string;
  /** Number of dilution columns in the grid (1 to 11). Default 11. */
  readonly columnCount?: number;
  /** Separate count grids calculated one by one and added (Yeast + Mould). Omit for a single grid. */
  readonly countGroups?: readonly CountGroupConfig[];
  /** Reading times. Omit for one reading. Only `counted` times are summed in the result. */
  readonly timePoints?: readonly TimePointConfig[];
  /** Plate-wise raw count table. Needs `timePoints`. */
  readonly plateRecords?: PlateRecordsConfig;
  /** Rows of the confirmation-test table. Omit for tests that have none. */
  readonly confirmationTests?: readonly ConfirmationTestConfig[];
}