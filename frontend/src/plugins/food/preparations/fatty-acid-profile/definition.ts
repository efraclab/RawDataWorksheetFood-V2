import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import FattyAcidProfilePreparationModule from "./components/FattyAcidProfilePreparationModule.tsx";

export const fattyacidprofilePreparationDefinition: PreparationDefinition = {
  id: "food.fatty-acid-profile",
  name: "Fatty Acid Profile",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Fatty Acid Profile preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Fatty Acid Profile",
      component: FattyAcidProfilePreparationModule,
    },
    persistence: {
      preparationType: "fattyAcidProfile",
      calculationType: "fattyAcidProfile",
    },
  },
};
