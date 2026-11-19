import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SulphatePreparationModule from "./components/SulphatePreparationModule";

export const sulphatePreparationDefinition: PreparationDefinition = {
  id: "water.sulphate",
  name: "Sulphate (as SO4)",
  pluginId: "water",
  laboratory: "Water",
  description: "Sulphate concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Sulphate (as SO4) Analysis",
      component: SulphatePreparationModule,
    },
    persistence: {
      preparationType: "sulphate",
      calculationType: "sulphate",
    },
  },
};
