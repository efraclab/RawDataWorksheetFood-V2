import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { MpnConfig } from "./config";
import { createMpnModule } from "./components/MpnPreparationModule";
import { createMpnHandler } from "./handler";

/** Builds the definition + handler for one multiple-tube test from its config. */
export function createMpnPreparation(config: MpnConfig): {
  definition: PreparationDefinition;
  handler: PreparationHandler;
} {
  const definition: PreparationDefinition = {
    id: config.moduleId,
    name: config.title,
    pluginId: "micro",
    laboratory: "Micro",
    description: `Micro laboratory ${config.testName} (multiple tube).`,
    version: "1.0.0",
    metadata: {
      ui: { title: config.title, component: createMpnModule(config) },
      persistence: { preparationType: config.persistenceType },
    },
  };
  return { definition, handler: createMpnHandler(config, definition) };
}
