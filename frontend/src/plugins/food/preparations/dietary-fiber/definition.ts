import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import DietaryFiberPreparationModule from "./components/DietaryFiberPreparationModule.tsx";

export const dietaryfiberPreparationDefinition: PreparationDefinition = {
  id: "food.dietary-fiber",
  name: "Dietary Fiber",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Dietary Fiber preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Dietary Fiber",
      component: DietaryFiberPreparationModule,
    },
    persistence: {
      preparationType: "dietaryFiber",
      calculationType: "dietaryFiber",
    },
  },
};
