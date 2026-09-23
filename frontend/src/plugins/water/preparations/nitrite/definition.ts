import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import NitritePreparationModule from "./components/NitritePreparationModule";

export const nitritePreparationDefinition: PreparationDefinition = {
  id: "water.nitrite",
  name: "Nitrite (as NO2)",
  pluginId: "water",
  laboratory: "Water",
  description: "Nitrite concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Nitrite (as NO2) Analysis",
      component: NitritePreparationModule,
    },
    persistence: {
      preparationType: "nitrite",
      calculationType: "nitrite",
    },
  },
};
