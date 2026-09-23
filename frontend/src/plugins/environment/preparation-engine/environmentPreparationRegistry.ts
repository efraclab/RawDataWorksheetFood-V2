import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";
import { pm10PreparationHandler } from "../preparations/pm10/handler";

export const environmentPreparationRegistry: readonly PreparationHandler[] = [
  pm10PreparationHandler,
];
