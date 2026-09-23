import type { PreparationModuleDefinition } from "../core/preparation/ui/PreparationModuleDefinition";
import { foodPreparationModuleRegistry } from "./food/preparation-engine/foodPreparationModuleRegistry";
import { metalPreparationModuleRegistry } from "./metal/preparation-engine/metalPreparationModuleRegistry";
import { waterPreparationModuleRegistry } from "./water/preparation-engine/waterPreparationModuleRegistry";

const normalizeLab = (value: unknown): string =>
  String(value ?? "").trim().toLowerCase().replace(/[\s_-]+/g, "");

export function getPreparationModuleRegistry(
  laboratory: unknown,
): readonly PreparationModuleDefinition[] {
  const normalized = normalizeLab(laboratory);

  if (normalized.includes("metal")) return metalPreparationModuleRegistry;
  if (normalized.includes("water")) return waterPreparationModuleRegistry;

  return foodPreparationModuleRegistry;
}
