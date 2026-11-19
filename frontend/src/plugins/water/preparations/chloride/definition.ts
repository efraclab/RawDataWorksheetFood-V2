import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import ChloridePreparationModule from "./components/ChloridePreparationModule";

export const chloridePreparationDefinition: PreparationDefinition = {
  id: "water.chloride",
  name: "Chloride (Cl)",
  pluginId: "water",
  laboratory: "Water",
  description: "Volume of sample, DF, Volume of AgNO3 and Strength of AgNO3.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Chloride (Cl) Analysis",
      component: ChloridePreparationModule,
    },
    persistence: {
      preparationType: "chloride",
      calculationType: "chloride",
    },
  },
};
