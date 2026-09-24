import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SO2AmbientPreparationModule from "./components/SO2AmbientPreparationModule";

export const so2AmbientPreparationDefinition: PreparationDefinition = {
  id: "environment.so2Ambient",
  name: "SO2 Ambient",
  pluginId: "environment",
  laboratory: "Environment",
  description: "SO2 concentration from sample/blank absorbance, calibration factor, and sampled volumes.",
  version: "1.0.0",
  metadata: {
    ui: { title: "SO2 Ambient Analysis", component: SO2AmbientPreparationModule },
    persistence: { preparationType: "so2Ambient", calculationType: "so2Ambient" },
  },
};
