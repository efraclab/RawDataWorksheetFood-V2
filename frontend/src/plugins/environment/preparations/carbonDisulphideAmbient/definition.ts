import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import CarbonDisulphideAmbientPreparationModule from "./components/CarbonDisulphideAmbientPreparationModule";

export const carbonDisulphideAmbientPreparationDefinition: PreparationDefinition = {
  id: "environment.carbonDisulphideAmbient",
  name: "Carbon Disulphide (Ambient)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Carbon disulphide concentration from mass of carbon disulphide and sampled air volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Carbon Disulphide (Ambient) Analysis", component: CarbonDisulphideAmbientPreparationModule },
    persistence: { preparationType: "carbonDisulphideAmbient", calculationType: "carbonDisulphideAmbient" },
  },
};
