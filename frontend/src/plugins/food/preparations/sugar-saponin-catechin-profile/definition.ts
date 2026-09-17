import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SugarSaponinCatechinProfilePreparationModule from "./components/SugarSaponinCatechinProfilePreparationModule.tsx";

export const sugarsaponincatechinprofilePreparationDefinition: PreparationDefinition = {
  id: "food.sugar-saponin-catechin-profile",
  name: "Sugar / Saponin / Catechin Profile",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Sugar / Saponin / Catechin Profile preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Sugar/Saponin/Catechin Profile",
      component: SugarSaponinCatechinProfilePreparationModule,
    },
    persistence: {
      preparationType: "sugarSaponinCatechinProfile",
      calculationType: "sugarSaponinCatechinProfile",
    },
  },
};
