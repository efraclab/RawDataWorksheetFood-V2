import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import FatPreparationModule from "./components/FatPreparationModule.tsx";

export const fatPreparationDefinition: PreparationDefinition = {
  id: "food.fat",
  name: "FAT",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory FAT preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for FAT",
      component: FatPreparationModule,
    },
    persistence: {
      preparationType: "fat",
      calculationType: "fat",
    },
  },
};
