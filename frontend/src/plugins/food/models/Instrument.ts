export interface Instrument {
  /**
   * V1 reference-data identifier.
   */
  id?: string | null;

  /**
   * V2/reference APIs may expose the same identifier as instrumentId.
   */
  instrumentId?: string | null;

  name: string;
  instrumentTag?: string | null;
  make?: string | null;
  calibrationDoneDate?: string | null;
  calibrationDueDate?: string | null;

  [key: string]: unknown;
}
