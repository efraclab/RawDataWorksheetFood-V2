import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import FSVPreparationModule from "./components/FSVPreparationModule.tsx";

export const fsvPreparationDefinition: PreparationDefinition = {
  id: "food.fsv",
  name: "FSV (A, D, E, K)",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory FSV (A, D, E, K) preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for FSV",
      component: FSVPreparationModule,
    },
    persistence: {
      preparationType: "fsv",
      calculationType: "fsv",
    },
  },
};
