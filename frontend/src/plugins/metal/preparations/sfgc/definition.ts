import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SfgcPreparationModule from "./components/SfgcPreparationModule";

/**
 * Metal laboratory SFGC preparation.
 *
 * `metal.sfgc` is the V2 module identity. `sfgc` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const sfgcPreparationDefinition: PreparationDefinition = {
  id: "metal.sfgc",
  name: "SFGC",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory SFGC preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "SFGC",
      component: SfgcPreparationModule,
    },
    persistence: {
      preparationType: "sfgc",
      calculationType: "sfgc",
    },
  },
};
