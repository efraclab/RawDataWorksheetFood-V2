import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { lipolyticConfig } from "./config";

export const lipolyticPreparation = createPlateCountPreparation(lipolyticConfig);
export const lipolyticPreparationDefinition = lipolyticPreparation.definition;
export const lipolyticPreparationHandler = lipolyticPreparation.handler;
