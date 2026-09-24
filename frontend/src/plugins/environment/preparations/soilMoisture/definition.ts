import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SoilMoisturePreparationModule from "./components/SoilMoisturePreparationModule";

export const soilMoisturePreparationDefinition: PreparationDefinition = {
  id: "environment.soilMoisture",
  name: "Soil (Moisture)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Soil (Moisture) Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Soil (Moisture) Analysis", component: SoilMoisturePreparationModule },
    persistence: { preparationType: "soilMoisture", calculationType: "soilMoisture" },
  },
};
