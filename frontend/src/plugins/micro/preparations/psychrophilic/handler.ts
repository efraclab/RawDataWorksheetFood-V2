import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { psychrophilicConfig } from "./config";

export const psychrophilicPreparation = createPlateCountPreparation(psychrophilicConfig);
export const psychrophilicPreparationDefinition = psychrophilicPreparation.definition;
export const psychrophilicPreparationHandler = psychrophilicPreparation.handler;