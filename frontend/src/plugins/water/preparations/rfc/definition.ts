import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import RFCPreparationModule from "./components/RFCPreparationModule";

export const rfcPreparationDefinition: PreparationDefinition = {
  id: "water.rfc",
  name: "Residual Free Chlorine (as Cl2)",
  pluginId: "water",
  laboratory: "Water",
  description: "RFC concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Residual Free Chlorine (as Cl2) Analysis",
      component: RFCPreparationModule,
    },
    persistence: {
      preparationType: "rfc",
      calculationType: "rfc",
    },
  },
};
