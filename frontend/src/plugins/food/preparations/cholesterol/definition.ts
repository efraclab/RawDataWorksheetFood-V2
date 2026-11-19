import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import CholesterolPreparationModule from "./components/CholesterolPreparationModule.tsx";

export const cholesterolPreparationDefinition: PreparationDefinition = {
  id: "food.cholesterol",
  name: "Cholesterol",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Cholesterol preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Cholesterol",
      component: CholesterolPreparationModule,
    },
    persistence: {
      preparationType: "cholesterol",
      calculationType: "cholesterol",
    },
  },
};
