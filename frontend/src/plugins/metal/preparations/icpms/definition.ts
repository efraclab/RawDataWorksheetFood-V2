import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import IcpmsPreparationModule from "./components/IcpmsPreparationModule";

/**
 * Metal laboratory ICP-MS (FOOD) preparation.
 *
 * `metal.icpms` is the V2 module identity. `icpms` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const icpmsPreparationDefinition: PreparationDefinition = {
  id: "metal.icpms",
  name: "ICP-MS (FOOD)",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory ICP-MS (FOOD) preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "ICP-MS (FOOD)",
      component: IcpmsPreparationModule,
    },
    persistence: {
      preparationType: "icpms",
      calculationType: "icpms",
    },
  },
};
