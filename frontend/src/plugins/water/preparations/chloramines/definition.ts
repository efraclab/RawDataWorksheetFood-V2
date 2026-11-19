import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import ChloraminesPreparationModule from "./components/ChloraminesPreparationModule";

export const chloraminesPreparationDefinition: PreparationDefinition = {
  id: "water.chloramines",
  name: "Chloramine (Cl2)",
  pluginId: "water",
  laboratory: "Water",
  description: "Chloramine (Cl2) concentration calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Chloramine (Cl2) Analysis",
      component: ChloraminesPreparationModule,
    },
    persistence: {
      preparationType: "chloramines",
      calculationType: "chloramines",
    },
  },
};
