import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import AnoferPreparationModule from "./components/AnoferPreparationModule";

/**
 * Metal laboratory ANOFER preparation.
 *
 * `metal.anofer` is the V2 module identity. `anofer` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const anoferPreparationDefinition: PreparationDefinition = {
  id: "metal.anofer",
  name: "ANOFER",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory ANOFER preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "ANOFER",
      component: AnoferPreparationModule,
    },
    persistence: {
      preparationType: "anofer",
      calculationType: "anofer",
    },
  },
};
