import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { pseudomonasConfig } from "./config";

export const pseudomonasPreparation = createPlateCountPreparation(pseudomonasConfig);
export const pseudomonasPreparationDefinition = pseudomonasPreparation.definition;
export const pseudomonasPreparationHandler = pseudomonasPreparation.handler;
