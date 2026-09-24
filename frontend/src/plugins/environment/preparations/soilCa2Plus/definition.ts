import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SoilCa2PlusPreparationModule from "./components/SoilCa2PlusPreparationModule";

export const soilCa2PlusPreparationDefinition: PreparationDefinition = {
  id: "environment.soilCa2Plus",
  name: "SOIL Ca2+",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Soil calcium (Ca2+) analysis by versanate method.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "SOIL Ca2+ Analysis",
      component: SoilCa2PlusPreparationModule,
    },
    persistence: {
      preparationType: "soilCa2Plus",
      calculationType: "soilCa2Plus",
    },
  },
};
