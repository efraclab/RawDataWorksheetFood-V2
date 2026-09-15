import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";

import { aaswaterPreparationHandler } from "../preparations/aaswater/handler";
import { icpmsPreparationHandler } from "../preparations/icpms/handler";
import { icpmsWaterPreparationHandler } from "../preparations/icpmsWater/handler";
import { icpoesPreparationHandler } from "../preparations/icpoes/handler";

/**
 * All Metal laboratory preparation handlers.
 *
 * Metal owns this registry.
 * Core only executes/resolves handlers and never needs to know
 * which Metal preparations exist.
 *
 * IMPORTANT:
 * Every Metal preparation that should appear in the
 * Preparation Management dropdown MUST be registered here.
 */
export const metalPreparationRegistry: readonly PreparationHandler[] = [
  // AAS
  aaswaterPreparationHandler,

  // ICP-MS
  icpmsPreparationHandler,
  icpmsWaterPreparationHandler,

  // ICP-OES
  icpoesPreparationHandler,
];