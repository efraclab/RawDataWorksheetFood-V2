import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { FormulaConfig } from "./config";
import { createFormulaModule } from "./components/FormulaPreparationModule";
import { createFormulaHandler } from "./handler";

/** Builds the definition + handler for one formula test from its config. */
export function createFormulaPreparation(config: FormulaConfig): {
  definition: PreparationDefinition;
  handler: PreparationHandler;
} {
  const definition: PreparationDefinition = {
    id: config.moduleId,
    name: config.title,
    pluginId: "micro",
    laboratory: "Micro",
    description: `Micro laboratory ${config.testName}.`,
    version: "1.0.0",
    metadata: {
      ui: { title: config.title, component: createFormulaModule(config) },
      persistence: { preparationType: config.persistenceType },
    },
  };
  return { definition, handler: createFormulaHandler(config, definition) };
}
