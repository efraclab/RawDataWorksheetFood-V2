import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { ayushTymcConfig } from "./config";

export const ayushTymcPreparation = createPlateCountPreparation(ayushTymcConfig);
export const ayushTymcPreparationDefinition = ayushTymcPreparation.definition;
export const ayushTymcPreparationHandler = ayushTymcPreparation.handler;
