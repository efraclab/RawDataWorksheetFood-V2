export interface PreparationContext {
  /**
   * Current worksheet identifier.
   */
  worksheetId: string;

  /**
   * Current preparation identifier.
   */
  preparationId: string;

  /**
   * Current user identifier.
   */
  userId?: string;

  /**
   * Preparation input/runtime data.
   */
  data: Record<string, unknown>;

  /**
   * Additional runtime metadata.
   */
  metadata?: Record<string, unknown>;
}