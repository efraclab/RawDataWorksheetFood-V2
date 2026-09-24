import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import HFStackPreparationModule from "./components/HFStackPreparationModule";

export const hfStackPreparationDefinition: PreparationDefinition = {
  id: "environment.hfStack",
  name: "HF (Stack)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Hydrogen fluoride in particulate from absorbance volume, instrument reading, factor, dilution factor and standard gas volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "HF (Stack) Analysis", component: HFStackPreparationModule },
    persistence: { preparationType: "hfStack", calculationType: "hfStack" },
  },
};
