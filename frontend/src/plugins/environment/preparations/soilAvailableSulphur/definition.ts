import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SoilAvailableSulphurPreparationModule from "./components/SoilAvailableSulphurPreparationModule";

export const soilAvailableSulphurPreparationDefinition: PreparationDefinition = {
  id: "environment.soilAvailableSulphur",
  name: "Soil (Available sulphur)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Soil (Available Sulphur) Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Soil (Available sulphur) Analysis", component: SoilAvailableSulphurPreparationModule },
    persistence: { preparationType: "soilAvailableSulphur", calculationType: "soilS" },
  },
};
