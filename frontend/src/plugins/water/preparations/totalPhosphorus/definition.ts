import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import TotalPhosphorusPreparationModule from "./components/TotalPhosphorusPreparationModule";

export const totalPhosphorusPreparationDefinition: PreparationDefinition = {
  id: "water.totalPhosphorus",
  name: "Total Phosphorus",
  pluginId: "water",
  laboratory: "Water",
  description: "Total Phosphorus concentration calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Total Phosphorus Analysis",
      component: TotalPhosphorusPreparationModule,
    },
    persistence: {
      preparationType: "totalPhosphorus",
      calculationType: "totalPhosphorus",
    },
  },
};
