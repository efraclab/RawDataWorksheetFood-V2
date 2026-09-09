import type { ComponentType } from "react";


export interface PreparationModuleDefinition {
    /**
     * Same stable preparation ID used by
     * PreparationDefinition / PreparationHandler.
     *
     * Example:
     * "food.lod"
     */
    readonly id: string;

    /**
     * UI display name.
     */
    readonly title: string;

    /**
     * Optional UI metadata.
     */
    readonly color?: string;

    /**
     * React component responsible for the
     * preparation module UI.
     */
    readonly component: ComponentType<any>;
}