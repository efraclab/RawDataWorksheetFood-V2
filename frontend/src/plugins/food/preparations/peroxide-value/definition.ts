import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import PeroxideValuePreparationModule from "./components/PeroxideValuePreparationModule.tsx";

export const peroxidevaluePreparationDefinition: PreparationDefinition = {
  id: "food.peroxide-value",
  name: "Peroxide Value",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Peroxide Value preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Peroxide Value",
      component: PeroxideValuePreparationModule,
    },
    persistence: {
      preparationType: "peroxideValue",
      calculationType: "peroxideValue",
    },
  },
};
