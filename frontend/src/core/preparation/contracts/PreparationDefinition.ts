export interface PreparationDefinition {
    /**
     * Globally unique preparation identifier
     * within the laboratory plugin.
     *
     * Examples:
     *   "lod"
     *   "fat"
     *   "protein"
     */
    readonly id: string;

    /**
     * Human-readable preparation name.
     */
    readonly name: string;

    /**
     * Plugin that owns this preparation.
     *
     * Example:
     *   "food"
     */
    readonly pluginId: string;

    /**
     * Laboratory/domain that owns this preparation.
     *
     * Example:
     *   "Food"
     */
    readonly laboratory: string;

    /**
     * Optional description shown by the UI
     * or available to the preparation runtime.
     */
    readonly description?: string;

    /**
     * Optional preparation definition version.
     */
    readonly version?: string;

    /**
     * Extensible metadata.
     *
     * Core does not interpret preparation-specific
     * metadata.
     */
    readonly metadata?: Record<string, unknown>;
}