import type { PreparationContext } from "./PreparationContext";
import type { PreparationResult } from "./PreparationResult";

export interface PreparationCapabilities {
  collectData?: (
    context: PreparationContext
  ) => Promise<PreparationResult>;

  validate?: (
    context: PreparationContext
  ) => Promise<PreparationResult>;

  calculate?: (
    context: PreparationContext
  ) => Promise<PreparationResult>;

  workflow?: (
    context: PreparationContext
  ) => Promise<PreparationResult>;

  result?: (
    context: PreparationContext
  ) => Promise<PreparationResult>;
}