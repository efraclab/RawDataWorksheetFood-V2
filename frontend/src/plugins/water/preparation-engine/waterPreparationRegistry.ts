import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";
import { fluoridePreparationHandler } from "../preparations/fluoride/handler";
import { cyanidePreparationHandler } from "../preparations/cyanide/handler";
import { nitratePreparationHandler } from "../preparations/nitrate/handler";
import { tdsPreparationHandler } from "../preparations/tds/handler";

export const waterPreparationRegistry: readonly PreparationHandler[] = [
  fluoridePreparationHandler,
  cyanidePreparationHandler,
  nitratePreparationHandler,
  tdsPreparationHandler,
];
