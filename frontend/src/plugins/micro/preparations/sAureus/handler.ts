import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { sAureusConfig } from "./config";

export const sAureusPreparation = createPlateCountPreparation(sAureusConfig);
export const sAureusPreparationDefinition = sAureusPreparation.definition;
export const sAureusPreparationHandler = sAureusPreparation.handler;