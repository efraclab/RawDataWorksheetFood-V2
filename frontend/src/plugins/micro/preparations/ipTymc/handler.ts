import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { ipTymcConfig } from "./config";

export const ipTymcPreparation = createPlateCountPreparation(ipTymcConfig);
export const ipTymcPreparationDefinition = ipTymcPreparation.definition;
export const ipTymcPreparationHandler = ipTymcPreparation.handler;
