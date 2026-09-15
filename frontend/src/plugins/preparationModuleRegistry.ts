import type { PreparationModuleDefinition } from "../core/preparation/ui/PreparationModuleDefinition";
import { foodPreparationModuleRegistry } from "./food/preparation-engine/foodPreparationModuleRegistry";
import { metalPreparationModuleRegistry } from "./metal/preparation-engine/metalPreparationModuleRegistry";

const normalizeLab = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

/**
 * Application composition point. The selected laboratory owns the registry;
 * Core never imports Food LOD or Metal ICP-MS directly.
 */
export function getPreparationModuleRegistry(
  laboratory: unknown,
): readonly PreparationModuleDefinition[] {
  const normalized = normalizeLab(laboratory);

  if (normalized.includes("metal")) {
    return metalPreparationModuleRegistry;
  }

  return foodPreparationModuleRegistry;
}
