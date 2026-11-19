import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import VolatileMatterPreparationModule from "./components/VolatileMatterPreparationModule";

export const volatileMatterPreparationDefinition: PreparationDefinition = {
  id: "environment.volatileMatter",
  name: "Volatile Matter",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Volatile Matter Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Volatile Matter Analysis", component: VolatileMatterPreparationModule },
    persistence: { preparationType: "volatileMatter", calculationType: "volatileMatter" },
  },
};
