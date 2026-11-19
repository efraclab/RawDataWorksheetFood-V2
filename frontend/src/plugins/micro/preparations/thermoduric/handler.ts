import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { thermoduricConfig } from "./config";

export const thermoduricPreparation = createPlateCountPreparation(thermoduricConfig);
export const thermoduricPreparationDefinition = thermoduricPreparation.definition;
export const thermoduricPreparationHandler = thermoduricPreparation.handler;
