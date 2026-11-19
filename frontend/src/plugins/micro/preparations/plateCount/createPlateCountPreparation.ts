import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PlateCountConfig } from "./config";
import { createPlateCountModule } from "./components/PlateCountPreparationModule";
import { createPlateCountHandler } from "./handler";

/**
 * Builds the definition + handler for one plate-count test from its config.
 */
export function createPlateCountPreparation(config: PlateCountConfig): {
  definition: PreparationDefinition;
  handler: PreparationHandler;
} {
  const definition: PreparationDefinition = {
    id: config.moduleId,
    name: config.title,
    pluginId: "micro",
    laboratory: "Micro",
    description: `Micro laboratory ${config.testName} preparation and calculation.`,
    version: "1.0.0",
    metadata: {
      ui: {
        title: config.title,
        component: createPlateCountModule(config),
      },
      persistence: {
        preparationType: config.persistenceType,
        calculationType: config.persistenceType,
      },
    },
  };

  return { definition, handler: createPlateCountHandler(config, definition) };
}