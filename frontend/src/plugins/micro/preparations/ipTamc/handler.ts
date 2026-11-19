import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { ipTamcConfig } from "./config";

export const ipTamcPreparation = createPlateCountPreparation(ipTamcConfig);
export const ipTamcPreparationDefinition = ipTamcPreparation.definition;
export const ipTamcPreparationHandler = ipTamcPreparation.handler;
