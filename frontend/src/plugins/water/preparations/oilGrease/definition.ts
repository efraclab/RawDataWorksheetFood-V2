import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import OilGreasePreparationModule from "./components/OilGreasePreparationModule";

export const oilGreasePreparationDefinition: PreparationDefinition = {
  id: "water.oilGrease",
  name: "Oil & Grease",
  pluginId: "water",
  laboratory: "Water",
  description: "Oil & Grease concentration calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Oil & Grease Analysis",
      component: OilGreasePreparationModule,
    },
    persistence: {
      preparationType: "oilGrease",
      calculationType: "oilGrease",
    },
  },
};
