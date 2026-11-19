import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { ayushTamcConfig } from "./config";

export const ayushTamcPreparation = createPlateCountPreparation(ayushTamcConfig);
export const ayushTamcPreparationDefinition = ayushTamcPreparation.definition;
export const ayushTamcPreparationHandler = ayushTamcPreparation.handler;
