import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import CyanidePreparationModule from "./components/CyanidePreparationModule";

export const cyanidePreparationDefinition: PreparationDefinition = {
  id: "water.cyanide",
  name: "Cyanide (as CN)",
  pluginId: "water",
  laboratory: "Water",
  description: "Cyanide concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Cyanide (as CN) Analysis",
      component: CyanidePreparationModule,
    },
    persistence: {
      preparationType: "cyanide",
      calculationType: "cyanide",
    },
  },
};
