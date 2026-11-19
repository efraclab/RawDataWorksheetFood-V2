export interface PreparationResult {
  /**
   * Indicates whether the operation succeeded.
   */
  success: boolean;

  /**
   * Result data.
   */
  data?: Record<string, unknown>;

  /**
   * Validation or execution errors.
   */
  errors?: string[];

  /**
   * Non-blocking warnings.
   */
  warnings?: string[];
}