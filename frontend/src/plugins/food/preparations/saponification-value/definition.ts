import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SaponificationValuePreparationModule from "./components/SaponificationValuePreparationModule.tsx";

export const saponificationvaluePreparationDefinition: PreparationDefinition = {
  id: "food.saponification-value",
  name: "Saponification Value",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Saponification Value preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Saponification Value",
      component: SaponificationValuePreparationModule,
    },
    persistence: {
      preparationType: "saponificationValue",
      calculationType: "saponificationValue",
    },
  },
};
