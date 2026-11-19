import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import TotalHardnessPreparationModule from "./components/TotalHardnessPreparationModule";

export const totalHardnessPreparationDefinition: PreparationDefinition = {
  id: "water.totalHardness",
  name: "Total Hardness (as CaCO3)",
  pluginId: "water",
  laboratory: "Water",
  description: "Total Hardness (as CaCO3) concentration calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Total Hardness (as CaCO3) Analysis",
      component: TotalHardnessPreparationModule,
    },
    persistence: {
      preparationType: "totalHardness",
      calculationType: "totalHardness",
    },
  },
};
