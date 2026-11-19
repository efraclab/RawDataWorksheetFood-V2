import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { sulphiteReducingConfig } from "./config";

export const sulphiteReducingPreparation = createPlateCountPreparation(sulphiteReducingConfig);
export const sulphiteReducingPreparationDefinition = sulphiteReducingPreparation.definition;
export const sulphiteReducingPreparationHandler = sulphiteReducingPreparation.handler;