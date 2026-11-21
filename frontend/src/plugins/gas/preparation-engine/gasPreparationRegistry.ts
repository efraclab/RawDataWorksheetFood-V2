import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";
import { gasTests } from "../preparations/gasTests";
import { createGasPreparation } from "../preparations/reading/createGasPreparation";

/** One prepared test per line of gasTests.ts (definition + handler). */
export const gasPreparations = gasTests.map((config) => ({
  config,
  ...createGasPreparation(config),
}));

/**
 * All Gas laboratory preparation handlers.
 * To add a test, add it to preparations/gasTests.ts. The UI registry derives its dropdown from this list.
 */
export const gasPreparationRegistry: readonly PreparationHandler[] = gasPreparations.map(
  (p) => p.handler,
);