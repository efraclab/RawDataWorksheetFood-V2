import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import TalcPreparationModule from "./components/TalcPreparationModule";

/**
 * Metal laboratory TALC preparation.
 *
 * `metal.talc` is the V2 module identity. `talc` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const talcPreparationDefinition: PreparationDefinition = {
  id: "metal.talc",
  name: "TALC",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory TALC preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "TALC",
      component: TalcPreparationModule,
    },
    persistence: {
      preparationType: "talc",
      calculationType: "talc",
    },
  },
};
