import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { proteolyticConfig } from "./config";

export const proteolyticPreparation = createPlateCountPreparation(proteolyticConfig);
export const proteolyticPreparationDefinition = proteolyticPreparation.definition;
export const proteolyticPreparationHandler = proteolyticPreparation.handler;