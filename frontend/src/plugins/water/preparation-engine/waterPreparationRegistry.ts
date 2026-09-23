import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";
import { fluoridePreparationHandler } from "../preparations/fluoride/handler";

export const waterPreparationRegistry: readonly PreparationHandler[] = [
  fluoridePreparationHandler,
];
