import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import AlkalinityPreparationModule from "./components/AlkalinityPreparationModule";

export const alkalinityPreparationDefinition: PreparationDefinition = {
  id: "water.alkalinity",
  name: "Alkalinity (CaCO3 & HCO3)",
  pluginId: "water",
  laboratory: "Water",
  description: "Volume of sample, DF, Volume of H2SO4 and Strength of H2SO4.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Alkalinity (CaCO3 & HCO3) Analysis",
      component: AlkalinityPreparationModule,
    },
    persistence: {
      preparationType: "alkalinity",
      calculationType: "alkalinity",
    },
  },
};
