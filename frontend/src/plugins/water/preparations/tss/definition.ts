import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import TSSPreparationModule from "./components/TSSPreparationModule";

export const tssPreparationDefinition: PreparationDefinition = {
  id: "water.tss",
  name: "Total Suspended Solids (TSS)",
  pluginId: "water",
  laboratory: "Water",
  description: "Total suspended solids calculation using dish weights and sample volume.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Total Suspended Solids (TSS) Analysis",
      component: TSSPreparationModule,
    },
    persistence: {
      preparationType: "tss",
      calculationType: "tss",
    },
  },
};
