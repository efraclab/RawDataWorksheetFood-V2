import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { thermophilicConfig } from "./config";

export const thermophilicPreparation = createPlateCountPreparation(thermophilicConfig);
export const thermophilicPreparationDefinition = thermophilicPreparation.definition;
export const thermophilicPreparationHandler = thermophilicPreparation.handler;