import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SoilTotalNitrogenPreparationModule from "./components/SoilTotalNitrogenPreparationModule";

export const soilTotalNitrogenPreparationDefinition: PreparationDefinition = {
  id: "environment.soilTotalNitrogen",
  name: "Soil (Total nitrogen)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Soil (Total Nitrogen) Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Soil (Total nitrogen) Analysis", component: SoilTotalNitrogenPreparationModule },
    persistence: { preparationType: "soilTotalNitrogen", calculationType: "soilN" },
  },
};
