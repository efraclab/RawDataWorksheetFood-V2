import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";
import { aaswaterPreparationHandler } from "../preparations/aaswater/handler";
import { anoferPreparationHandler } from "../preparations/anofer/handler";
import { icpmsPreparationHandler } from "../preparations/icpms/handler";
import { icpmsIchQ3dPreparationHandler } from "../preparations/icpmsIchQ3d/handler";
import { icpmsWaterPreparationHandler } from "../preparations/icpmsWater/handler";
import { icpoesPreparationHandler } from "../preparations/icpoes/handler";
import { icpoesWaterPreparationHandler } from "../preparations/icpoesWater/handler";
import { orsPreparationHandler } from "../preparations/ors/handler";
import { zptoShampooPreparationHandler } from "../preparations/zptoShampoo/handler";
import { talcPreparationHandler } from "../preparations/talc/handler";
import { meropenemPreparationHandler } from "../preparations/meropenem/handler";
import { sfgcPreparationHandler } from "../preparations/sfgc/handler";

/**
 * All Metal laboratory preparation handlers.
 *
 * Metal owns this registry. Core only executes/resolves handlers and never
 * needs to know which Metal preparations exist.
 *
 * Keep every implemented Metal preparation registered here. The Metal UI
 * registry derives its dropdown entries from this list.
 */
export const metalPreparationRegistry: readonly PreparationHandler[] = [
  anoferPreparationHandler,
  icpmsPreparationHandler,
  icpmsIchQ3dPreparationHandler,
  icpmsWaterPreparationHandler,
  icpoesPreparationHandler,
  icpoesWaterPreparationHandler,
  orsPreparationHandler,
  aaswaterPreparationHandler,
  zptoShampooPreparationHandler,
  talcPreparationHandler,
  meropenemPreparationHandler,
  sfgcPreparationHandler,
];
