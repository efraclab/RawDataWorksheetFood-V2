import type { LabPlugin } from "../../core/plugin";

import {
    foodPreparationRegistry,
} from "./preparation-engine/foodPreparationRegistry";

const foodPlugin: LabPlugin = {
    id: "food",

    name: "Food",

    description:
        "Food laboratory worksheet, preparation, analysis and approval functionality.",

    preparations: foodPreparationRegistry,
};

export default foodPlugin;