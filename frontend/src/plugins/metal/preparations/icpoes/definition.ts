import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import IcpOesPreparationModule from "./components/IcpOesPreparationModule";

/**
 * Metal laboratory ICP-OES (FOOD) preparation.
 *
 * `metal.icpoes` is the V2 module identity. `icpoes` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const icpoesPreparationDefinition: PreparationDefinition = {
  id: "metal.icpoes",
  name: "ICP-OES (FOOD)",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory ICP-OES (FOOD) preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "ICP-OES (FOOD)",
      component: IcpOesPreparationModule,
    },
    persistence: {
      preparationType: "icpoes",
      calculationType: "icpoes",
    },
  },
};
