import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import MBASPreparationModule from "./components/MBASPreparationModule";

export const mbasPreparationDefinition: PreparationDefinition = {
  id: "water.mbas",
  name: "Surfactant-Methylene Blue (as MBAS)",
  pluginId: "water",
  laboratory: "Water",
  description: "MBAS concentration calculation using Abs, DF, M and C.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Surfactant-Methylene Blue (as MBAS) Analysis",
      component: MBASPreparationModule,
    },
    persistence: {
      preparationType: "mbas",
      calculationType: "mbas",
    },
  },
};
