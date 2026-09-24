import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import AshPreparationModule from "./components/AshPreparationModule";

export const ashPreparationDefinition: PreparationDefinition = {
  id: "environment.ash",
  name: "Ash",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Ash Content Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Ash Analysis", component: AshPreparationModule },
    persistence: { preparationType: "ash", calculationType: "ash" },
  },
};
