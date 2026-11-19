import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import PhenolPreparationModule from "./components/PhenolPreparationModule";

export const phenolPreparationDefinition: PreparationDefinition = {
  id: "water.phenol",
  name: "Phenolic Compounds (as C6H5OH)",
  pluginId: "water",
  laboratory: "Water",
  description: "Phenol concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Phenolic Compounds (as C6H5OH) Analysis",
      component: PhenolPreparationModule,
    },
    persistence: {
      preparationType: "phenol",
      calculationType: "phenol",
    },
  },
};
