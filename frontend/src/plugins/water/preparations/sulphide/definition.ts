import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SulphidePreparationModule from "./components/SulphidePreparationModule";

export const sulphidePreparationDefinition: PreparationDefinition = {
  id: "water.sulphide",
  name: "Sulphide (as H2S)",
  pluginId: "water",
  laboratory: "Water",
  description: "Sulphide concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Sulphide (as H2S) Analysis",
      component: SulphidePreparationModule,
    },
    persistence: {
      preparationType: "sulphide",
      calculationType: "sulphide",
    },
  },
};
