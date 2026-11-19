import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { coliformEcoliConfig } from "./config";

export const coliformEcoliPreparation = createPlateCountPreparation(coliformEcoliConfig);
export const coliformEcoliPreparationDefinition = coliformEcoliPreparation.definition;
export const coliformEcoliPreparationHandler = coliformEcoliPreparation.handler;