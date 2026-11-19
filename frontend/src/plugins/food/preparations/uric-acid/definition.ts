import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import UricAcidPreparationModule from "./components/UricAcidPreparationModule.tsx";

export const uricacidPreparationDefinition: PreparationDefinition = {
  id: "food.uric-acid",
  name: "Uric Acid",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Uric Acid preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Uric Acid",
      component: UricAcidPreparationModule,
    },
    persistence: {
      preparationType: "uricAcid",
      calculationType: "uricAcid",
    },
  },
};
