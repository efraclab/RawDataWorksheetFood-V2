import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import DecolourizingActivatedCarbonPreparationModule from "./components/DecolourizingActivatedCarbonPreparationModule";

export const decolourizingActivatedCarbonPreparationDefinition: PreparationDefinition = {
  id: "environment.decolourizingActivatedCarbon",
  name: "Decolourizing (ACTIVATED CARBON)",
  pluginId: "environment",
  laboratory: "Environment",
  description: "Decolourizing (Activated Carbon) Analysis.",
  version: "1.0.0",
  metadata: {
    ui: { title: "Decolourizing (ACTIVATED CARBON) Analysis", component: DecolourizingActivatedCarbonPreparationModule },
    persistence: { preparationType: "decolourizingActivatedCarbon", calculationType: "decolourizing" },
  },
};
