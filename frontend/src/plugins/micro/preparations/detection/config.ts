/**
 * Everything that differs between detection (Present / Absent) tests:
 * Salmonella, Listeria, Vibrio, E. coli detection, S. aureus detection...
 * One config file per test; the engine in this folder is shared.
 */

/** One row of a stage table: a medium, an enrichment step or a biochemical test. */
export interface DetectionRowConfig {
  readonly name: string;
  /** Expected colony / growth characteristics (e.g. "Turbidity", "Black colony"). */
  readonly characteristics?: string;
  /** Media or reagent used. */
  readonly media?: string;
  /** Incubation temperature in °C (text). */
  readonly temp?: string;
  /** Incubation time (text, e.g. "24 h"). */
  readonly time?: string;
}

/** A titled table on the sheet, e.g. "Enrichment & Isolation" or "Biochemical Confirmation". */
export interface DetectionSectionConfig {
  readonly title: string;
  readonly rows: readonly DetectionRowConfig[];
}

export interface DetectionConfig {
  /** Short key used for DOM ids, e.g. "salmonellaIs". */
  readonly key: string;
  /** V2 module identity, e.g. "micro.salmonellaIs". */
  readonly moduleId: string;
  /** Worksheet persistence type, e.g. "salmonellaIs". */
  readonly persistenceType: string;
  /** Dropdown / header title. */
  readonly title: string;
  /** Full test name from the Excel sheet. */
  readonly testName: string;
  readonly media: string;
  readonly method: string;
  readonly sections: readonly DetectionSectionConfig[];
  /** Default "per" quantity for the result, e.g. "25 g". Empty = analyst enters it. */
  readonly resultPer?: string;
  /** Result choices. Default ["Absent", "Present"]. ELISA uses ["Negative", "Positive"]. */
  readonly resultOptions?: readonly string[];
  /**
   * Extra free-text fields shown in the header (e.g. "Volume of sample filtered")
   * or in the result box (e.g. "Confirmed colony count").
   */
  readonly headerTextSteps?: ReadonlyArray<string | { readonly name: string; readonly value?: string }>;
  readonly resultTextSteps?: readonly string[];
}
