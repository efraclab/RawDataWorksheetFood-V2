import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import NO2AmbientPreparationModule from "./components/NO2AmbientPreparationModule";

export const no2AmbientPreparationDefinition: PreparationDefinition = {
  id: "environment.no2Ambient",
  name: "NO2 Ambient",
  pluginId: "environment",
  laboratory: "Environment",
  description: "NO2 concentration from graph factor, sample/blank absorbance, dilution factor, sampling efficiency, and sampled volumes.",
  version: "1.0.0",
  metadata: {
    ui: { title: "NO2 Ambient Analysis", component: NO2AmbientPreparationModule },
    persistence: { preparationType: "no2Ambient", calculationType: "no2Ambient" },
  },
};
