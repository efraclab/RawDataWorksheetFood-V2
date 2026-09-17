import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import UnsapMatterPreparationModule from "./components/UnsapMatterPreparationModule.tsx";

export const unsapmatterPreparationDefinition: PreparationDefinition = {
  id: "food.unsap-matter",
  name: "Unsaponifiable Matter",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Unsaponifiable Matter preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Unsaponifiable Matter",
      component: UnsapMatterPreparationModule,
    },
    persistence: {
      preparationType: "unsapMatter",
      calculationType: "unsapMatter",
    },
  },
};
