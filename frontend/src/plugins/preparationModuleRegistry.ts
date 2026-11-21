import type { PreparationModuleDefinition } from "../core/preparation/ui/PreparationModuleDefinition";
import { foodPreparationModuleRegistry } from "./food/preparation-engine/foodPreparationModuleRegistry";
import { metalPreparationModuleRegistry } from "./metal/preparation-engine/metalPreparationModuleRegistry";
import { environmentPreparationModuleRegistry } from "./environment/preparation-engine/environmentPreparationModuleRegistry";
import { waterPreparationModuleRegistry } from "./water/preparation-engine/waterPreparationModuleRegistry";
import { microPreparationModuleRegistry } from "./micro/preparation-engine/microPreparationModuleRegistry";
import { raPreparationModuleRegistry } from "./ra/preparation-engine/raPreparationModuleRegistry";
import { gasPreparationModuleRegistry } from "./gas/preparation-engine/gasPreparationModuleRegistry";

const normalizeLab = (value: unknown): string =>
  String(value ?? "").trim().toLowerCase().replace(/[\s_-]+/g, "");

export function getPreparationModuleRegistry(
  laboratory: unknown,
): readonly PreparationModuleDefinition[] {
  const normalized = normalizeLab(laboratory);

  if (normalized.includes("metal")) return metalPreparationModuleRegistry;
  if (normalized.includes("water")) return waterPreparationModuleRegistry;
  if (normalized.includes("environment") || normalized === "env" || normalized.startsWith("env")) return environmentPreparationModuleRegistry;
  if (normalized.includes("micro")) return microPreparationModuleRegistry;
  // "ra", "ralab", "ra lab" (normalized has no spaces). Exact match so other names are not caught.
  if (normalized === "ra" || normalized === "ralab") return raPreparationModuleRegistry;
  if (normalized.includes("gas")) return gasPreparationModuleRegistry;

  return foodPreparationModuleRegistry;
}