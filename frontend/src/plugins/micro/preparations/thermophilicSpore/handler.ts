import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { thermophilicSporeConfig } from "./config";

export const thermophilicSporePreparation = createPlateCountPreparation(thermophilicSporeConfig);
export const thermophilicSporePreparationDefinition = thermophilicSporePreparation.definition;
export const thermophilicSporePreparationHandler = thermophilicSporePreparation.handler;