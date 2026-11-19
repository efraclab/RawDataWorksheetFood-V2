import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import IcpmsIchQ3dPreparationModule from "./components/IcpmsIchQ3dPreparationModule";

/**
 * Metal laboratory ICP-MS (ICH-Q3D) preparation.
 *
 * `metal.icpmsIchQ3d` is the V2 module identity. `icpmsIchQ3d` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const icpmsIchQ3dPreparationDefinition: PreparationDefinition = {
  id: "metal.icpmsIchQ3d",
  name: "ICP-MS (ICH-Q3D)",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory ICP-MS (ICH-Q3D) preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "ICP-MS (ICH-Q3D)",
      component: IcpmsIchQ3dPreparationModule,
    },
    persistence: {
      preparationType: "icpmsIchQ3d",
      calculationType: "icpmsIchQ3d",
    },
  },
};
