export interface PreparationDefinition {
  /**
   * Globally unique preparation identifier.
   */
  id: string;

  /**
   * Human-readable preparation name.
   */
  name: string;

  /**
   * Plugin/laboratory that owns this preparation.
   */
  pluginId: string;

  /**
   * Laboratory name.
   */
  laboratory: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Preparation implementation version.
   */
  version?: string;

  /**
   * Additional preparation metadata.
   */
  metadata?: Record<string, unknown>;
}