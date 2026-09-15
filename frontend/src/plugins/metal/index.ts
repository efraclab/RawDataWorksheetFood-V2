import metalPlugin from "./plugin";

export default metalPlugin;

export { metalPlugin };

export { metalPreparationRegistry } from "./preparation-engine/metalPreparationRegistry";

export { metalPreparationModuleRegistry } from "./preparation-engine/metalPreparationModuleRegistry";

// Metal preparation modules
export * from "./preparations/aaswater";
export * from "./preparations/icpms";
export * from "./preparations/icpmsWater";
export * from "./preparations/icpoes";