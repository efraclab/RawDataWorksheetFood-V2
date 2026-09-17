import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import FreeFattyAcidPreparationModule from "./components/FreeFattyAcidPreparationModule.tsx";

export const freefattyacidPreparationDefinition: PreparationDefinition = {
  id: "food.free-fatty-acid",
  name: "Free Fatty Acid",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Free Fatty Acid preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Free Fatty Acid",
      component: FreeFattyAcidPreparationModule,
    },
    persistence: {
      preparationType: "freeFattyAcid",
      calculationType: "freeFattyAcid",
    },
  },
};
