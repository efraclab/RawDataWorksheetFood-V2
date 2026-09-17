import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import EnergyPreparationModule from "./components/EnergyPreparationModule.tsx";

export const energyPreparationDefinition: PreparationDefinition = {
  id: "food.energy",
  name: "Energy",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Energy preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Energy",
      component: EnergyPreparationModule,
    },
    persistence: {
      preparationType: "energy",
      calculationType: "energy",
    },
  },
};
