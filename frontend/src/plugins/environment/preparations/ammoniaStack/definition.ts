import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import AmmoniaStackPreparationModule from "./components/AmmoniaStackPreparationModule";

export const ammoniaStackPreparationDefinition: PreparationDefinition = {
  id: "environment.ammoniaStack",
  name: "Ammonia (Stack)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Ammonia concentration from sulphuric acid titration and dry gas sample volume.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Ammonia (Stack) Analysis", component: AmmoniaStackPreparationModule },
    persistence: { preparationType: "ammoniaStack", calculationType: "ammoniaStack" },
  },
};
