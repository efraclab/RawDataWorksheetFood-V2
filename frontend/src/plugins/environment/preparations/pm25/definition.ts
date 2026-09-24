import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import PM25PreparationModule from "./components/PM25PreparationModule";

export const pm25PreparationDefinition: PreparationDefinition = {
  id: "environment.pm25",
  name: "PM25",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Particulate matter PM25 concentration from filter mass gain and sampled air volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "PM25 Analysis", component: PM25PreparationModule },
    persistence: { preparationType: "pm25", calculationType: "pm25" },
  },
};
