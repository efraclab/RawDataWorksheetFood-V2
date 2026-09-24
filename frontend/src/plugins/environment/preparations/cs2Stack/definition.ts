import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import Cs2StackPreparationModule from "./components/Cs2StackPreparationModule";

export const cs2StackPreparationDefinition: PreparationDefinition = {
  id: "environment.cs2Stack",
  name: "CS2 in Stack",
  pluginId: "environment",
  laboratory: "Environment",
  description: "CS2 in Stack Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "CS2 in Stack Analysis", component: Cs2StackPreparationModule },
    persistence: { preparationType: "cs2Stack", calculationType: "cs2" },
  },
};
