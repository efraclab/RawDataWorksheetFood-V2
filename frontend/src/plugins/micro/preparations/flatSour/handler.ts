import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { flatSourConfig } from "./config";

export const flatSourPreparation = createPlateCountPreparation(flatSourConfig);
export const flatSourPreparationDefinition = flatSourPreparation.definition;
export const flatSourPreparationHandler = flatSourPreparation.handler;
