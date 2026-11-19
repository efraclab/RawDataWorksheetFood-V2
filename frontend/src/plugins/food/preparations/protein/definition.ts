import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import ProteinPreparationModule from "./components/ProteinPreparationModule.tsx";

export const proteinPreparationDefinition: PreparationDefinition = {
  id: "food.protein",
  name: "Protein",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Protein preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Protein",
      component: ProteinPreparationModule,
    },
    persistence: {
      preparationType: "protein",
      calculationType: "protein",
    },
  },
};
