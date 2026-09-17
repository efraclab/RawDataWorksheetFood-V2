import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import CrudeFiberPreparationModule from "./components/CrudeFiberPreparationModule.tsx";

export const crudefiberPreparationDefinition: PreparationDefinition = {
  id: "food.crude-fiber",
  name: "Crude Fiber",
  pluginId: "food",
  laboratory: "Food",
  description: "Food laboratory Crude Fiber preparation and calculation.",
  version: "1.0.0",
  metadata: {
    ui: {
      title: "Preparations for Crude Fiber",
      component: CrudeFiberPreparationModule,
    },
    persistence: {
      preparationType: "crudeFiber",
      calculationType: "crudeFiber",
    },
  },
};
