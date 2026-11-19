import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import WsvPreparationModule from "./components/WsvPreparationModule.tsx";

export const wsvPreparationDefinition: PreparationDefinition = {
  id: "food.wsv",
  name: "WSV (Water Soluble Vitamins)",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory WSV (Water Soluble Vitamins) preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for WSV",
      component: WsvPreparationModule,
    },
    persistence: {
      preparationType: "wsv",
      calculationType: "wsv",
    },
  },
};
