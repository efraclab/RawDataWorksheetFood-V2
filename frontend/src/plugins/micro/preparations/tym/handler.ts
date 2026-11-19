import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { tymConfig } from "./config";

export const tymPreparation = createPlateCountPreparation(tymConfig);
export const tymPreparationDefinition = tymPreparation.definition;
export const tymPreparationHandler = tymPreparation.handler;