/**
 * Everything that differs between RA tests (LC-Pesticides, Aflatoxins, Melamine...).
 * One config file per test; the engine in this folder is shared.
 * Taken from RAW_DATA_FORMAT-RA_LAB.xlsx ("Parameters" and "Raw Data for Steps" sheets).
 */

/**
 * One step of a section.
 * - string: a free-text step with that name.
 * - { name, value }: free-text step with a pre-filled value.
 * - { name, template }: a fill-in sentence. Each "___" in the template is one blank.
 */
export type ResidueStepConfig =
  | string
  | { readonly name: string; readonly value?: string; readonly template?: string };

export interface ResidueSectionConfig {
  /** Box title, e.g. "Mobile Phase Preparation". Also the prefix of the saved step name. */
  readonly title: string;
  readonly steps: readonly ResidueStepConfig[];
}

export interface ResidueConfig {
  /** Short key used for DOM ids, e.g. "lcPesticides". */
  readonly key: string;
  /** V2 module identity, e.g. "ra.lcPesticides". */
  readonly moduleId: string;
  /** Worksheet persistence type (also used as calculationType). */
  readonly persistenceType: string;
  /** Dropdown / header title. */
  readonly title: string;
  /** Full test name from the sheet. */
  readonly testName: string;
  readonly sections: readonly ResidueSectionConfig[];
  /** Default analyte rows in the calculation (e.g. B1, B2, G1, G2). Omit for one blank row. */
  readonly analytes?: readonly string[];
}