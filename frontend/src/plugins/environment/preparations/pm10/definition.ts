import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import PM10PreparationModule from "./components/PM10PreparationModule";

export const pm10PreparationDefinition: PreparationDefinition = {
  id: "environment.pm10",
  name: "PM10",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Particulate matter PM10 concentration from filter mass gain and sampled air volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "PM10 Analysis", component: PM10PreparationModule },
    persistence: { preparationType: "pm10", calculationType: "pm10" },
  },
};
