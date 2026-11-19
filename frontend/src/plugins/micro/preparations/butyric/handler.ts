import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { butyricConfig } from "./config";

export const butyricPreparation = createPlateCountPreparation(butyricConfig);
export const butyricPreparationDefinition = butyricPreparation.definition;
export const butyricPreparationHandler = butyricPreparation.handler;
