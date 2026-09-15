import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import AasWaterPreparationModule from "./components/AasWaterPreparationModule";

/**
 * Metal laboratory AAS (Water) preparation.
 *
 * `metal.aaswater` is the V2 module identity. `aaswater` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const aaswaterPreparationDefinition: PreparationDefinition = {
  id: "metal.aaswater",
  name: "AAS (Water)",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory AAS (Water) preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "AAS (Water)",
      component: AasWaterPreparationModule,
    },
    persistence: {
      preparationType: "aaswater",
      calculationType: "aaswater",
    },
  },
};
