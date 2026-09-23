import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import FluoridePreparationModule from "./components/FluoridePreparationModule";

export const fluoridePreparationDefinition: PreparationDefinition = {
  id: "water.fluoride",
  name: "Fluoride (as F)",
  pluginId: "water",
  laboratory: "Water",
  description: "Fluoride concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Fluoride (as F) Analysis",
      component: FluoridePreparationModule,
    },
    persistence: {
      preparationType: "fluoride",
      calculationType: "fluoride",
    },
  },
};
