import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import GcvPreparationModule from "./components/GcvPreparationModule";

export const gcvPreparationDefinition: PreparationDefinition = {
  id: "environment.gcv",
  name: "GCV",
  pluginId: "environment",
  laboratory: "Environment",
  description: "GCV - Gross Calorific Value Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "GCV Analysis", component: GcvPreparationModule },
    persistence: { preparationType: "gcv", calculationType: "gcv" },
  },
};
