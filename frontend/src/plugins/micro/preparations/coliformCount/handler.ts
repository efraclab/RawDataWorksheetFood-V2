import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { coliformCountConfig } from "./config";

export const coliformCountPreparation = createPlateCountPreparation(coliformCountConfig);
export const coliformCountPreparationDefinition = coliformCountPreparation.definition;
export const coliformCountPreparationHandler = coliformCountPreparation.handler;