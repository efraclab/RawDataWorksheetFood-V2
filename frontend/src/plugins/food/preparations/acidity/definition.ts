import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import AcidityPreparationModule from "./components/AcidityPreparationModule.tsx";

export const acidityPreparationDefinition: PreparationDefinition = {
  id: "food.acidity",
  name: "Acidity",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Acidity preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Acidity",
      component: AcidityPreparationModule,
    },
    persistence: {
      preparationType: "acidity",
      calculationType: "acidity",
    },
  },
};
