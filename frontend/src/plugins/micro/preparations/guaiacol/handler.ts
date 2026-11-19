import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { guaiacolConfig } from "./config";

export const guaiacolPreparation = createPlateCountPreparation(guaiacolConfig);
export const guaiacolPreparationDefinition = guaiacolPreparation.definition;
export const guaiacolPreparationHandler = guaiacolPreparation.handler;
