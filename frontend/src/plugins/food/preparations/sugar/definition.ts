import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SugarPreparationModule from "./components/SugarPreparationModule.tsx";

export const sugarPreparationDefinition: PreparationDefinition = {
  id: "food.sugar",
  name: "Total Sugar",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Total Sugar preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Total Sugar",
      component: SugarPreparationModule,
    },
    persistence: {
      preparationType: "sugar",
      calculationType: "sugar",
    },
  },
};
