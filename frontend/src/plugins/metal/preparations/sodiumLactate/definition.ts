import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import SodiumLactatePreparationModule from "./components/SodiumLactatePreparationModule";

/**
 * Metal laboratory SODIUM LACTATE preparation.
 *
 * `metal.sodiumLactate` is the V2 module identity. `sodiumLactate` is retained as the
 * existing worksheet persistence type so existing data can be restored.
 */
export const sodiumLactatePreparationDefinition: PreparationDefinition = {
  id: "metal.sodiumLactate",
  name: "SODIUM LACTATE",
  pluginId: "metal",
  laboratory: "Metal",
  description: "Metal laboratory SODIUM LACTATE preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "SODIUM LACTATE",
      component: SodiumLactatePreparationModule,
    },
    persistence: {
      preparationType: "sodiumLactate",
      calculationType: "sodiumLactate",
    },
  },
};
