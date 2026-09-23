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
