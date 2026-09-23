import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import DissolvedOxygenPreparationModule from "./components/DissolvedOxygenPreparationModule";

export const dissolvedOxygenPreparationDefinition: PreparationDefinition = {
  id: "water.dissolvedOxygen",
  name: "Dissolved Oxygen (as O2)",
  pluginId: "water",
  laboratory: "Water",
  description: "DissolvedOxygen concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Dissolved Oxygen (as O2) Analysis",
      component: DissolvedOxygenPreparationModule,
    },
    persistence: {
      preparationType: "dissolvedOxygen",
      calculationType: "dissolvedOxygen",
    },
  },
};
