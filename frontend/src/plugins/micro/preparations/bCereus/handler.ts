import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { bCereusConfig } from "./config";

export const bCereusPreparation = createPlateCountPreparation(bCereusConfig);
export const bCereusPreparationDefinition = bCereusPreparation.definition;
export const bCereusPreparationHandler = bCereusPreparation.handler;