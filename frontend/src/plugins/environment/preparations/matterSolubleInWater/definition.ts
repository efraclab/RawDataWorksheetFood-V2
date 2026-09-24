import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import MatterSolubleInWaterPreparationModule from "./components/MatterSolubleInWaterPreparationModule";

export const matterSolubleInWaterPreparationDefinition: PreparationDefinition = {
  id: "environment.matterSolubleInWater",
  name: "Matter Soluble in Water",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Matter Soluble in Water Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Matter Soluble in Water Analysis", component: MatterSolubleInWaterPreparationModule },
    persistence: { preparationType: "matterSolubleInWater", calculationType: "matterSoluble" },
  },
};
