import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import MoisturePreparationModule from "./components/MoisturePreparationModule.tsx";

export const moisturePreparationDefinition: PreparationDefinition = {
  id: "food.moisture",
  name: "Moisture",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Moisture preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Moisture",
      component: MoisturePreparationModule,
    },
    persistence: {
      preparationType: "moisture",
      calculationType: "moisture",
    },
  },
};
