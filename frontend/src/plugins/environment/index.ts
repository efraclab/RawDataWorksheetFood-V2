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