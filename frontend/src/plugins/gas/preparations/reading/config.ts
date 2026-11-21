/**
 * Gas lab tests (RAW_DATA_FORMAT-GAS_LAB.xlsx). All 38 tests share this engine.
 * What differs per test: method, instrument, unit and the kind of raw data / formula.
 */

/**
 * - detectorTube: No. of strokes + Detector tube reading (DT). Result = DT.
 * - instrument:   Instrument reading (IR). Result = IR.
 * - observation:  Observation value (OV). Result = OV (Assay).
 * - nvr:          W1, W2, W3. Result = (W3 - W1) / (W2 - W1).
 * - nvor:         W1, W2, I1, I2. Result = (I2 - I1) / (W2 - W1).
 * - text:         Observation text is the result (Appearance, Taste & Odour).
 */
export type GasTestKind =
  | "detectorTube"
  | "instrument"
  | "observation"
  | "nvr"
  | "nvor"
  | "text";

export interface GasTestConfig {
  /** Short key, e.g. "no2". Also the persistence type. */
  readonly key: string;
  /** Dropdown / header title. */
  readonly title: string;
  /** Full name from the Methods sheet. */
  readonly testName: string;
  readonly kind: GasTestKind;
  /** Instrument from the Methods sheet (pre-filled, editable). */
  readonly instrument: string;
  /** Method No (ISBT) from the Methods sheet (pre-filled, editable). */
  readonly method: string;
  /** Result unit from the Methods sheet. "" when the sheet has "-". */
  readonly unit: string;
}