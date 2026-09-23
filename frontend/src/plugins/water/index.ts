import type { LabPlugin } from "../../core/plugin";
import { waterPreparationRegistry } from "./preparation-engine/waterPreparationRegistry";

const waterPlugin: LabPlugin = {
  id: "water",
  name: "Water",
  description: "Water laboratory plugin.",
  preparations: waterPreparationRegistry,
};

export { waterPlugin };
export { waterPreparationRegistry } from "./preparation-engine/waterPreparationRegistry";
export { waterPreparationModuleRegistry } from "./preparation-engine/waterPreparationModuleRegistry";
export * from "./preparations/fluoride";
export default waterPlugin;
