import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SpmIAQPreparationModule from "./components/SpmIAQPreparationModule";

export const spmIAQPreparationDefinition: PreparationDefinition = {
  id: "environment.spmIAQ",
  name: "SPM (IAQ)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "SPM (IAQ) Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "SPM (IAQ) Analysis", component: SpmIAQPreparationModule },
    persistence: { preparationType: "spmIAQ", calculationType: "spm" },
  },
};
