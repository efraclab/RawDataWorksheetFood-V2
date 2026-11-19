import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import MoistureCoalPreparationModule from "./components/MoistureCoalPreparationModule";

export const moistureCoalPreparationDefinition: PreparationDefinition = {
  id: "environment.moistureCoal",
  name: "Moisture Coal",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Moisture Coal Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Moisture Coal Analysis", component: MoistureCoalPreparationModule },
    persistence: { preparationType: "moistureCoal", calculationType: "moistureCoal" },
  },
};
