import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import H2SAmbientPreparationModule from "./components/H2SAmbientPreparationModule";

export const h2sAmbientPreparationDefinition: PreparationDefinition = {
  id: "environment.h2sAmbient",
  name: "H2S Ambient",
  pluginId: "environment",
  laboratory: "Environment",
  description: "H2S concentration from microgram of hydrogen sulphide in the sample and litres of air sampled.",
  version: "1.0.0",
  metadata: {
    ui: { title: "H2S Ambient Analysis", component: H2SAmbientPreparationModule },
    persistence: { preparationType: "h2sAmbient", calculationType: "h2sAmbient" },
  },
};
