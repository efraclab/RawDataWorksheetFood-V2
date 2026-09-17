import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import CarbohydratePreparationModule from "./components/CarbohydratePreparationModule.tsx";

export const carbohydratePreparationDefinition: PreparationDefinition = {
  id: "food.carbohydrate",
  name: "Carbohydrate",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Carbohydrate preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Carbohydrate",
      component: CarbohydratePreparationModule,
    },
    persistence: {
      preparationType: "carbohydrate",
      calculationType: "carbohydrate",
    },
  },
};
