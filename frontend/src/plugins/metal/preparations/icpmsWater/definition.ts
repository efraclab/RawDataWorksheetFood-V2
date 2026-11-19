import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import IcpmsWaterPreparationModule from "./components/IcpmsWaterPreparationModule";

export const icpmsWaterPreparationDefinition: PreparationDefinition = {
  id: "metal.icpmsWater",
  name: "ICP-MS (Water)",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory ICP-MS (Water) preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "ICP-MS (Water)",
      component: IcpmsWaterPreparationModule,
    },
    persistence: {
      preparationType: "icpms_water",
      calculationType: "icpms_water",
    },
  },
};
