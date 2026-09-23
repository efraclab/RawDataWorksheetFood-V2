import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import TDSPreparationModule from "./components/TDSPreparationModule";

export const tdsPreparationDefinition: PreparationDefinition = {
  id: "water.tds",
  name: "Total Dissolved Solids (TDS)",
  pluginId: "water",
  laboratory: "Water",
  description: "Total dissolved solids calculation using dish weights and sample volume.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Total Dissolved Solids (TDS) Analysis",
      component: TDSPreparationModule,
    },
    persistence: {
      preparationType: "tds",
      calculationType: "tds",
    },
  },
};
