import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { ResidueConfig } from "./config";
import { createResidueModule } from "./components/ResiduePreparationModule";
import { createResidueHandler } from "./handler";

/** Builds the definition + handler for one RA test from its config. */
export function createResiduePreparation(config: ResidueConfig): {
  definition: PreparationDefinition;
  handler: PreparationHandler;
} {
  const definition: PreparationDefinition = {
    id: config.moduleId,
    name: config.title,
    pluginId: "ra",
    laboratory: "RA",
    description: `RA laboratory ${config.testName} preparation and calculation.`,
    version: "1.0.0",
    metadata: {
      ui: {
        title: config.title,
        component: createResidueModule(config),
      },
      persistence: {
        preparationType: config.persistenceType,
        calculationType: config.persistenceType,
      },
    },
  };

  return { definition, handler: createResidueHandler(config, definition) };
}