import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import ArtificialColourPreparationModule from "./components/ArtificialColourPreparationModule.tsx";

export const artificialcolourPreparationDefinition: PreparationDefinition = {
  id: "food.artificial-colour",
  name: "Artificial Colour",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Artificial Colour preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Artificial Colour",
      component: ArtificialColourPreparationModule,
    },
    persistence: {
      preparationType: "artificialColour",
      calculationType: "artificialColour",
    },
  },
};
