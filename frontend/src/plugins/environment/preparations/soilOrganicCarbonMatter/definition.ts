import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SoilOrganicCarbonMatterPreparationModule from "./components/SoilOrganicCarbonMatterPreparationModule";

export const soilOrganicCarbonMatterPreparationDefinition: PreparationDefinition = {
  id: "environment.soilOrganicCarbonMatter",
  name: "SOIL organic carbon - matter",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Soil organic carbon and organic matter analysis.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "SOIL organic carbon - matter Analysis",
      component: SoilOrganicCarbonMatterPreparationModule,
    },
    persistence: {
      preparationType: "soilOrganicCarbonMatter",
      calculationType: "soilOrganicCarbonMatter",
    },
  },
};
