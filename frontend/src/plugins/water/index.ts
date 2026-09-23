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

export * from "./preparations/cyanide";
export * from "./preparations/nitrate";
export * from "./preparations/tds";

export * from "./preparations/nitrite";
export * from "./preparations/sulphate";
export * from "./preparations/chloride";
export * from "./preparations/alkalinity";
export * from "./preparations/calcium";
export * from "./preparations/magnesium";