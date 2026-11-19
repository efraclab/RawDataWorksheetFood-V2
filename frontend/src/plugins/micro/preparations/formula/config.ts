/**
 * Tests whose sheet has its own small formula (Rope spore, Plankton, Coliphage,
 * Heat-resistant moulds). Each config lists its input tables and fields and
 * gives the formula as a function. The engine in this folder is shared.
 */

/** A grid of free-text cells. Numbers are read with `cell` / `sum`; text counts as 0. */
export interface FormulaTableConfig {
  readonly key: string;
  readonly title: string;
  readonly rows: readonly string[];
  readonly columns: readonly string[];
}

/** A single numeric input, e.g. "Volume of concentrated sample (V1)". */
export interface FormulaFieldConfig {
  readonly key: string;
  readonly label: string;
  readonly defaultValue?: string;
}

/** Read access to the entered values, given to `compute`. */
export interface FormulaInputs {
  /** Number in one cell, or null when empty / not a number. */
  cell(table: string, row: number, column: number): number | null;
  /** Sum of the numeric cells of a table; optionally only some columns. Text counts as 0. */
  sum(table: string, columns?: readonly number[]): number;
  /** Number in a field, or null when empty / not a number. */
  field(key: string): number | null;
}

export interface FormulaOutput {
  /** Main result, shown with `unit`. null when it cannot be calculated. */
  value: number | null;
  /** Optional extra lines, e.g. "Count from 1 ml flask: 30". */
  details?: string[];
  error?: string;
}

export interface FormulaConfig {
  readonly key: string;
  readonly moduleId: string;
  readonly persistenceType: string;
  readonly title: string;
  readonly testName: string;
  readonly media: string;
  readonly method: string;
  /** Free-text header fields, e.g. "Incubation", "Plate size". Values are defaults. */
  readonly headerTextSteps?: ReadonlyArray<{ readonly name: string; readonly value?: string }>;
  readonly tables: readonly FormulaTableConfig[];
  readonly fields?: readonly FormulaFieldConfig[];
  /** Formula as printed on the sheet. */
  readonly formulaText: string;
  readonly resultLabel: string;
  /** Unit from the sheet; empty when the sheet gives none. */
  readonly unit: string;
  readonly compute: (inputs: FormulaInputs) => FormulaOutput;
}
