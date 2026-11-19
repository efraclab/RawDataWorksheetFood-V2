import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { guaiacolYsgConfig } from "./config";

export const guaiacolYsgPreparation = createPlateCountPreparation(guaiacolYsgConfig);
export const guaiacolYsgPreparationDefinition = guaiacolYsgPreparation.definition;
export const guaiacolYsgPreparationHandler = guaiacolYsgPreparation.handler;
