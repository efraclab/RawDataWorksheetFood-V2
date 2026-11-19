import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { cBotulinumConfig } from "./config";

export const cBotulinumPreparation = createPlateCountPreparation(cBotulinumConfig);
export const cBotulinumPreparationDefinition = cBotulinumPreparation.definition;
export const cBotulinumPreparationHandler = cBotulinumPreparation.handler;
