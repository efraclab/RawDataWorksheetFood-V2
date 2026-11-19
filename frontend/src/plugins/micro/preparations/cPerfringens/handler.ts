import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { cPerfringensConfig } from "./config";

export const cPerfringensPreparation = createPlateCountPreparation(cPerfringensConfig);
export const cPerfringensPreparationDefinition = cPerfringensPreparation.definition;
export const cPerfringensPreparationHandler = cPerfringensPreparation.handler;
