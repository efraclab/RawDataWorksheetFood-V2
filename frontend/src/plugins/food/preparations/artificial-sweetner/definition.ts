import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import ArtificialSweetnerPreparationModule from "./components/ArtificialSweetnerPreparationModule.tsx";

export const artificialsweetnerPreparationDefinition: PreparationDefinition = {
  id: "food.artificial-sweetner",
  name: "Artificial Sweetener",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Artificial Sweetener preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Artificial Sweetener",
      component: ArtificialSweetnerPreparationModule,
    },
    persistence: {
      preparationType: "artificialSweetner",
      calculationType: "artificialSweetner",
    },
  },
};
