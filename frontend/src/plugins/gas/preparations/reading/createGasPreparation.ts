import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { GasTestConfig } from "./config";
import { createGasModule } from "./components/GasPreparationModule";
import { createGasHandler } from "./handler";

/** Builds the definition + handler for one Gas test. Module id "gas.<key>", persistence type = key. */
export function createGasPreparation(config: GasTestConfig): {
  definition: PreparationDefinition;
  handler: PreparationHandler;
} {
  const definition: PreparationDefinition = {
    id: `gas.${config.key}`,
    name: config.title,
    pluginId: "gas",
    laboratory: "Gas",
    description: `Gas laboratory ${config.testName} preparation and calculation.`,
    version: "1.0.0",
    metadata: {
      ui: {
        title: config.title,
        component: createGasModule(config),
      },
      persistence: {
        preparationType: config.key,
        calculationType: config.key,
      },
    },
  };

  return { definition, handler: createGasHandler(config, definition) };
}