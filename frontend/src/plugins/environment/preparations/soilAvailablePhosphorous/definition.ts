import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SoilAvailablePhosphorousPreparationModule from "./components/SoilAvailablePhosphorousPreparationModule";

export const soilAvailablePhosphorousPreparationDefinition: PreparationDefinition = {
  id: "environment.soilAvailablePhosphorous",
  name: "Soil (available phosphorous)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Soil (Available Phosphorous) Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Soil (available phosphorous) Analysis", component: SoilAvailablePhosphorousPreparationModule },
    persistence: { preparationType: "soilAvailablePhosphorous", calculationType: "phosphorous" },
  },
};
