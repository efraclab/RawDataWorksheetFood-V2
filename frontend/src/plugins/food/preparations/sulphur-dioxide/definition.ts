import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SulphurDioxidePreparationModule from "./components/SulphurDioxidePreparationModule.tsx";

export const sulphurdioxidePreparationDefinition: PreparationDefinition = {
  id: "food.sulphur-dioxide",
  name: "Sulphur Dioxide",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Sulphur Dioxide preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Sulphur Dioxide",
      component: SulphurDioxidePreparationModule,
    },
    persistence: {
      preparationType: "sulphurDioxide",
      calculationType: "sulphurDioxide",
    },
  },
};
