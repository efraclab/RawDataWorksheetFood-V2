import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import TotalFlurideAmbientPreparationModule from "./components/TotalFlurideAmbientPreparationModule";

export const totalFlurideAmbientPreparationDefinition: PreparationDefinition = {
  id: "environment.totalFlurideAmbient",
  name: "Total Fluride Ambient",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Total Fluride concentration from total µgF and volume of air sampled.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Total Fluride Ambient Analysis", component: TotalFlurideAmbientPreparationModule },
    persistence: { preparationType: "totalFlurideAmbient", calculationType: "totalFlurideAmbient" },
  },
};
