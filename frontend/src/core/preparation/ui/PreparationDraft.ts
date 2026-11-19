export interface PreparationDraft {
    /**
     * Preparation module IDs currently active
     * for the parameter.
     *
     * Example:
     * ["food.lod"]
     */
    activeGroups: string[];

    /**
     * Draft state belonging to each preparation module.
     *
     * Core does not interpret the contents.
     *
     * Example:
     *
     * modules["food.lod"] = {
     *     samplePreparations: [...],
     *     calculations: [...]
     * }
     */
    modules: Record<string, unknown>;

    /**
     * Whether the preparation has been completed.
     */
    completed?: boolean;

    /**
     * Completion timestamp.
     */
    completedAt?: string | null;
}