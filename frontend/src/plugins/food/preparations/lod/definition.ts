import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";

import LodPreparationModule from "./components/LodPreparationModule";

export const lodPreparationDefinition: PreparationDefinition = {
    id: "food.lod",
    name: "Loss on Drying",
    pluginId: "food",
    laboratory: "Food",
    description:
        "Food laboratory Loss on Drying preparation and calculation.",
    version: "1.0.0",
    metadata: {
        ui: {
            title: "Preparations for LOD",
            component: LodPreparationModule,
        },
    },
};
