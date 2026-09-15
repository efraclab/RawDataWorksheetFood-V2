import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import IcpOesWaterPreparationModule from "./components/IcpOesWaterPreparationModule";

export const icpoesWaterPreparationDefinition: PreparationDefinition = {
  id: "metal.icpoesWater",
  name: "ICP-OES (Water)",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory ICP-OES (Water) preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: { title: "ICP-OES (Water)", component: IcpOesWaterPreparationModule },
    persistence: { preparationType: "icpoes_water", calculationType: "icpoes_water" },
  },
};
