import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { enterobacteriaceaeConfig } from "./config";

export const enterobacteriaceaePreparation = createPlateCountPreparation(enterobacteriaceaeConfig);
export const enterobacteriaceaePreparationDefinition = enterobacteriaceaePreparation.definition;
export const enterobacteriaceaePreparationHandler = enterobacteriaceaePreparation.handler;
