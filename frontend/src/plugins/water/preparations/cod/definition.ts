import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import CODPreparationModule from "./components/CODPreparationModule";

export const codPreparationDefinition: PreparationDefinition = {
  id: "water.cod",
  name: "Chemical Oxygen Demand (as O2)",
  pluginId: "water",
  laboratory: "Water",
  description: "Chemical Oxygen Demand (as O2) concentration calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Chemical Oxygen Demand (as O2) Analysis",
      component: CODPreparationModule,
    },
    persistence: {
      preparationType: "cod",
      calculationType: "cod",
    },
  },
};
