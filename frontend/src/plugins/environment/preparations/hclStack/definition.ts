import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import HCLStackPreparationModule from "./components/HCLStackPreparationModule";

export const hclStackPreparationDefinition: PreparationDefinition = {
  id: "environment.hclStack",
  name: "HCL Stack",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Hydrogen chloride in particulate from absorbance volume, instrument reading, factor, dilution factor and standard gas volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "HCL Stack Analysis", component: HCLStackPreparationModule },
    persistence: { preparationType: "hclStack", calculationType: "hclStack" },
  },
};
