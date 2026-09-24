import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import NH3AmbientPreparationModule from "./components/NH3AmbientPreparationModule";

export const nh3AmbientPreparationDefinition: PreparationDefinition = {
  id: "environment.nh3Ambient",
  name: "NH3 Ambient",
  pluginId: "environment",
  laboratory: "Environment",
  description: "NH3 concentration from sample absorbance, reagent blank, calibration factor, and sampled air volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "NH3 Ambient Analysis", component: NH3AmbientPreparationModule },
    persistence: { preparationType: "nh3Ambient", calculationType: "nh3Ambient" },
  },
};
