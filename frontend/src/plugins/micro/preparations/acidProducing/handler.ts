import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { acidProducingConfig } from "./config";

export const acidProducingPreparation = createPlateCountPreparation(acidProducingConfig);
export const acidProducingPreparationDefinition = acidProducingPreparation.definition;
export const acidProducingPreparationHandler = acidProducingPreparation.handler;