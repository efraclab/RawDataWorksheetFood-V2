import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { acidophilicConfig } from "./config";

export const acidophilicPreparation = createPlateCountPreparation(acidophilicConfig);
export const acidophilicPreparationDefinition = acidophilicPreparation.definition;
export const acidophilicPreparationHandler = acidophilicPreparation.handler;