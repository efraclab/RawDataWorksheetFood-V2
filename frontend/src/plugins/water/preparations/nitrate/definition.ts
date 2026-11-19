import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import NitratePreparationModule from "./components/NitratePreparationModule";

export const nitratePreparationDefinition: PreparationDefinition = {
  id: "water.nitrate",
  name: "Nitrate (as NO3)",
  pluginId: "water",
  laboratory: "Water",
  description: "Nitrate concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Nitrate (as NO3) Analysis",
      component: NitratePreparationModule,
    },
    persistence: {
      preparationType: "nitrate",
      calculationType: "nitrate",
    },
  },
};
