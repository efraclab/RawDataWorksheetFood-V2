import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import NotsPreparationModule from "./components/NotsPreparationModule.tsx";

export const notsPreparationDefinition: PreparationDefinition = {
  id: "food.nots",
  name: "NOTS",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory NOTS preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for NOTS",
      component: NotsPreparationModule,
    },
    persistence: {
      preparationType: "nots",
      calculationType: "nots",
    },
  },
};
