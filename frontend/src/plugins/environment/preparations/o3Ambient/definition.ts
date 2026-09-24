import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import O3AmbientPreparationModule from "./components/O3AmbientPreparationModule";

export const o3AmbientPreparationDefinition: PreparationDefinition = {
  id: "environment.o3Ambient",
  name: "O3 Ambient",
  pluginId: "environment",
  laboratory: "Environment",
  description: "O3 concentration from absorbance, calibration factor, sampled air volume, and the fixed conversion factor.",
  version: "1.0.0",
  metadata: {
    ui: { title: "O3 Ambient Analysis", component: O3AmbientPreparationModule },
    persistence: { preparationType: "o3Ambient", calculationType: "o3Ambient" },
  },
};
