import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import FixedCarbonPreparationModule from "./components/FixedCarbonPreparationModule";

export const fixedCarbonPreparationDefinition: PreparationDefinition = {
  id: "environment.fixedCarbon",
  name: "FIXED CARBON",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Fixed Carbon Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "FIXED CARBON Analysis", component: FixedCarbonPreparationModule },
    persistence: { preparationType: "fixedCarbon", calculationType: "fixedCarbon" },
  },
};
