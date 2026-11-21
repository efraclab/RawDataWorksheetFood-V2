import type { LabPlugin } from "../../core/plugin";

const gasPlugin: LabPlugin = {
  id: "gas",

  name: "Gas",

  description:
    "Gas laboratory plugin.",

  preparations: [],
};

export default gasPlugin;
export { gasPlugin };
export { gasPreparationRegistry, gasPreparations } from "./preparation-engine/gasPreparationRegistry";
export { gasPreparationModuleRegistry } from "./preparation-engine/gasPreparationModuleRegistry";
export { gasTests } from "./preparations/gasTests";
export type { GasTestConfig, GasTestKind } from "./preparations/reading/config";