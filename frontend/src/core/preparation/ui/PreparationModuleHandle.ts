export interface PreparationModuleHandle<
    TDraft = unknown,
    TWorksheet = unknown
> {
    /**
     * Collect the current UI/module state.
     */
    getDraft(): TDraft;

    /**
     * Restore UI/module state from a previously
     * collected draft.
     */
    loadDraft(draft: TDraft): void;

    /**
     * Restore preparation information from
     * worksheet data.
     */
    restoreFromWorksheet(
        worksheet: TWorksheet
    ): void | Promise<void>;
}