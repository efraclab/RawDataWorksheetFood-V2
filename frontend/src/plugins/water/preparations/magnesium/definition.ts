import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import MagnesiumPreparationModule from "./components/MagnesiumPreparationModule";

export const magnesiumPreparationDefinition: PreparationDefinition = {
  id: "water.magnesium",
  name: "Magnesium (Mg)",
  pluginId: "water",
  laboratory: "Water",
  description: "Volume of sample, DF, Volume of EDTA and Strength of EDTA.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Magnesium (Mg) Analysis",
      component: MagnesiumPreparationModule,
    },
    persistence: {
      preparationType: "magnesium",
      calculationType: "magnesium",
    },
  },
};
