import type { LabPlugin } from "../../core/plugin";
import { environmentPreparationRegistry } from "./preparation-engine/environmentPreparationRegistry";

const environmentPlugin: LabPlugin = {
  id: "environment",
  name: "Environment",
  description: "Environment laboratory plugin.",
  preparations: environmentPreparationRegistry,
};

export { environmentPlugin, environmentPreparationRegistry };
export { environmentPreparationModuleRegistry } from "./preparation-engine/environmentPreparationModuleRegistry";
export * from "./preparations/pm10";
export default environmentPlugin;

export * from "./preparations/pm25";
export * from "./preparations/so2Ambient";
export * from "./preparations/no2Ambient";
export * from "./preparations/o3Ambient";
export * from "./preparations/nh3Ambient";
export * from "./preparations/h2sAmbient";
export * from "./preparations/chlorineAmbient";
export * from "./preparations/totalFlurideAmbient";
export * from "./preparations/carbonDisulphideAmbient";
export * from "./preparations/pmStack";
export * from "./preparations/so2Stack";
export * from "./preparations/no2Stack";
export * from "./preparations/ammoniaStack";
export * from "./preparations/hclStack";
export * from "./preparations/hfStack";
export * from "./preparations/h2sStack";
export * from "./preparations/cs2Stack";
export * from "./preparations/totalFlurideStack";
export * from "./preparations/soilTotalNitrogen";
export * from "./preparations/soilAvailableSulphur";
export * from "./preparations/soilGypsumRequirement";
export * from "./preparations/soilMoisture";
export * from "./preparations/soilAvailablePhosphorous";
export * from "./preparations/moistureCoal";
export * from "./preparations/volatileMatter";
export * from "./preparations/gcv";
export * from "./preparations/ash";
export * from "./preparations/fixedCarbon";
export * from "./preparations/decolourizingActivatedCarbon";
export * from "./preparations/matterSolubleInWater";
export * from "./preparations/spmIAQ";
export * from "./preparations/moistureVolatileSolvent";
export * from "./preparations/overallMigrationPackaging";