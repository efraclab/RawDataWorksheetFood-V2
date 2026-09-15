import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";
import { icpmsPreparationHandler } from "../preparations/icpms/handler";
import { icpoesPreparationHandler } from "../preparations/icpoes/handler";

/**
 * All Metal laboratory preparation handlers.
 *
 * Metal owns this registry. Core only executes/resolves handlers and never
 * needs to know which Metal preparations exist.
 */
export const metalPreparationRegistry: readonly PreparationHandler[] = [
  icpmsPreparationHandler,
  icpoesPreparationHandler,
];
