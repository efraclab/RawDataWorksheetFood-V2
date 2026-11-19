import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import PreservativePreparationModule from "./components/PreservativePreparationModule.tsx";

export const preservativePreparationDefinition: PreparationDefinition = {
  id: "food.preservative",
  name: "Preservative",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Preservative preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Preservative",
      component: PreservativePreparationModule,
    },
    persistence: {
      preparationType: "preservative",
      calculationType: "preservative",
    },
  },
};
