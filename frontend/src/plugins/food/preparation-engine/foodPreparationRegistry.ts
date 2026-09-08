import type {
    PreparationHandler
} from "../../../core/preparation/runtime/PreparationRuntime";

/**
 * All Food laboratory preparation handlers.
 *
 * Food owns this registry.
 *
 * Core does not know which preparations exist.
 *
 * A preparation registered here must provide:
 *
 * - definition
 * - capabilities
 * - execute()
 */
export const foodPreparationRegistry:
    readonly PreparationHandler[] = [];