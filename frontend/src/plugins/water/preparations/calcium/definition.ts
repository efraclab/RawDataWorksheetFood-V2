import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import CalciumPreparationModule from "./components/CalciumPreparationModule";

export const calciumPreparationDefinition: PreparationDefinition = {
  id: "water.calcium",
  name: "Calcium (Ca)",
  pluginId: "water",
  laboratory: "Water",
  description: "Volume of sample, DF, Volume of EDTA and Strength of EDTA.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Calcium (Ca) Analysis",
      component: CalciumPreparationModule,
    },
    persistence: {
      preparationType: "calcium",
      calculationType: "calcium",
    },
  },
};
