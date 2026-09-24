import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import NO2StackPreparationModule from "./components/NO2StackPreparationModule";

export const no2StackPreparationDefinition: PreparationDefinition = {
  id: "environment.no2Stack",
  name: "NO\u2082 (Stack)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Nitrogen dioxide concentration from spectrophotometric absorbance and standard-condition sample volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "NO\u2082 (Stack) Analysis", component: NO2StackPreparationModule },
    persistence: { preparationType: "no2Stack", calculationType: "no2Stack" },
  },
};
