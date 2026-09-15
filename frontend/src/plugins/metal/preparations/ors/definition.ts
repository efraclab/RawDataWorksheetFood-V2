import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import OrsPreparationModule from "./components/OrsPreparationModule";

/**
 * Metal laboratory ORS preparation.
 *
 * `metal.ors` is the V2 module identity. `ors` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const orsPreparationDefinition: PreparationDefinition = {
  id: "metal.ors",
  name: "ORS",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory ORS preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "ORS",
      component: OrsPreparationModule,
    },
    persistence: {
      preparationType: "ors",
      calculationType: "ors",
    },
  },
};
