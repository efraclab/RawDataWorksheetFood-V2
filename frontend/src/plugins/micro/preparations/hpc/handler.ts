import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { hpcConfig } from "./config";

export const hpcPreparation = createPlateCountPreparation(hpcConfig);
export const hpcPreparationDefinition = hpcPreparation.definition;
export const hpcPreparationHandler = hpcPreparation.handler;