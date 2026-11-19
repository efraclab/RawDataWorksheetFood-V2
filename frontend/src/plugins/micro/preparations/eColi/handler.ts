import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { eColiConfig } from "./config";

export const eColiPreparation = createPlateCountPreparation(eColiConfig);
export const eColiPreparationDefinition = eColiPreparation.definition;
export const eColiPreparationHandler = eColiPreparation.handler;