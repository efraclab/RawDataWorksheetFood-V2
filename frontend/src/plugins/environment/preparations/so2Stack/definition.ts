import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SO2StackPreparationModule from "./components/SO2StackPreparationModule";

export const so2StackPreparationDefinition: PreparationDefinition = {
  id: "environment.so2Stack",
  name: "SO\u2082 (Stack)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Sulphur dioxide concentration from barium perchlorate titration and sampled gas volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "SO\u2082 (Stack) Analysis", component: SO2StackPreparationModule },
    persistence: { preparationType: "so2Stack", calculationType: "so2Stack" },
  },
};
