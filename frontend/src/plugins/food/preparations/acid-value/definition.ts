import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import AcidValuePreparationModule from "./components/AcidValuePreparationModule.tsx";

export const acidvaluePreparationDefinition: PreparationDefinition = {
  id: "food.acid-value",
  name: "Acid Value",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Acid Value preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Acid Value",
      component: AcidValuePreparationModule,
    },
    persistence: {
      preparationType: "acidValue",
      calculationType: "acidValue",
    },
  },
};
