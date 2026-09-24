import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SoilGypsumRequirementPreparationModule from "./components/SoilGypsumRequirementPreparationModule";

export const soilGypsumRequirementPreparationDefinition: PreparationDefinition = {
  id: "environment.soilGypsumRequirement",
  name: "Soil (gypsum requirement)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Soil (Gypsum Requirement) Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Soil (gypsum requirement) Analysis", component: SoilGypsumRequirementPreparationModule },
    persistence: { preparationType: "soilGypsumRequirement", calculationType: "gypsum" },
  },
};
