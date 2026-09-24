import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import TotalFlurideStackPreparationModule from "./components/TotalFlurideStackPreparationModule";

export const totalFlurideStackPreparationDefinition: PreparationDefinition = {
  id: "environment.totalFlurideStack",
  name: "Total fluoride (stack)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Total Fluoride (Stack) Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Total fluoride (stack) Analysis", component: TotalFlurideStackPreparationModule },
    persistence: { preparationType: "totalFlurideStack", calculationType: "totalFlurideStack" },
  },
};
