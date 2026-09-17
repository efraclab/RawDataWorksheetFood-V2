import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import MeropenemPreparationModule from "./components/MeropenemPreparationModule";

/**
 * Metal laboratory MEROPENEM preparation.
 *
 * `metal.meropenem` is the V2 module identity. `meropenem` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const meropenemPreparationDefinition: PreparationDefinition = {
  id: "metal.meropenem",
  name: "MEROPENEM",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory MEROPENEM preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "MEROPENEM",
      component: MeropenemPreparationModule,
    },
    persistence: {
      preparationType: "meropenem",
      calculationType: "meropenem",
    },
  },
};
