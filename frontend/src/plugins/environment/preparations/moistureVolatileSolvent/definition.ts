import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import MoistureVolatileSolventPreparationModule from "./components/MoistureVolatileSolventPreparationModule";

export const moistureVolatileSolventPreparationDefinition: PreparationDefinition = {
  id: "environment.moistureVolatileSolvent",
  name: "Moisture of volatile solvent",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Moisture of Volatile Solvent Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Moisture of volatile solvent Analysis", component: MoistureVolatileSolventPreparationModule },
    persistence: { preparationType: "moistureVolatileSolvent", calculationType: "moistureSolvent" },
  },
};
