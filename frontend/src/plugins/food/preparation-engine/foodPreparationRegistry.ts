import type {
    PreparationHandler
} from "../../../core/preparation/runtime/PreparationRuntime";

import {
    lodPreparationHandler
} from "../preparations/lod/handler";


/**
 * All Food laboratory preparation handlers.
 *
 * Food owns this registry.
 *
 * Core does not know which preparations exist.
 */
export const foodPreparationRegistry:
    readonly PreparationHandler[] = [
        lodPreparationHandler,
    ];