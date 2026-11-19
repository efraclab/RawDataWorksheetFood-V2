import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { DetectionConfig } from "./config";
import { createDetectionModule } from "./components/DetectionPreparationModule";
import { createDetectionHandler } from "./handler";

/** Builds the definition + handler for one detection test from its config. */
export function createDetectionPreparation(config: DetectionConfig): {
  definition: PreparationDefinition;
  handler: PreparationHandler;
} {
  const definition: PreparationDefinition = {
    id: config.moduleId,
    name: config.title,
    pluginId: "micro",
    laboratory: "Micro",
    description: `Micro laboratory ${config.testName} (detection).`,
    version: "1.0.0",
    metadata: {
      ui: {
        title: config.title,
        component: createDetectionModule(config),
      },
      persistence: {
        preparationType: config.persistenceType,
      },
    },
  };

  return { definition, handler: createDetectionHandler(config, definition) };
}
