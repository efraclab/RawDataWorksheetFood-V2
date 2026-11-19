import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import PMStackPreparationModule from "./components/PMStackPreparationModule";

export const pmStackPreparationDefinition: PreparationDefinition = {
  id: "environment.pmStack",
  name: "PM (Stack)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Particulate matter concentration from initial/final thimble weights and standard gas volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "PM (Stack) Analysis", component: PMStackPreparationModule },
    persistence: { preparationType: "pmStack", calculationType: "pmStack" },
  },
};
