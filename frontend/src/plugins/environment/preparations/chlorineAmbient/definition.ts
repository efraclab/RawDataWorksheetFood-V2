import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import ChlorineAmbientPreparationModule from "./components/ChlorineAmbientPreparationModule";

export const chlorineAmbientPreparationDefinition: PreparationDefinition = {
  id: "environment.chlorineAmbient",
  name: "Chlorine Ambient",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Chlorine concentration from amount of chlorine found and volume of air sampled.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Chlorine Ambient Analysis", component: ChlorineAmbientPreparationModule },
    persistence: { preparationType: "chlorineAmbient", calculationType: "chlorineAmbient" },
  },
};
