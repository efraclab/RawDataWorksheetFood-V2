import type { LabPlugin } from "../../core/plugin";

const raPlugin: LabPlugin = {
  id: "ra",

  name: "RA",

  description:
    "RA laboratory plugin.",

  preparations: [],
};

export default raPlugin;
export { raPlugin };
export { raPreparationRegistry } from "./preparation-engine/raPreparationRegistry";
export { raPreparationModuleRegistry } from "./preparation-engine/raPreparationModuleRegistry";

// All tests use the shared engine in preparations/residue
export * from "./preparations/lcPesticides";
export * from "./preparations/gcPesticides";
export * from "./preparations/antibiotics";
export * from "./preparations/aflatoxins";
export * from "./preparations/melamine";
export * from "./preparations/dithiocarbamates";
export * from "./preparations/dioxinFuran";
export * from "./preparations/residualSolvents";
export * from "./preparations/vocThm";
export * from "./preparations/pahPcb";
export * from "./preparations/aflatoxinM1";
export * from "./preparations/ochratoxin";
export * from "./preparations/vitaminB";