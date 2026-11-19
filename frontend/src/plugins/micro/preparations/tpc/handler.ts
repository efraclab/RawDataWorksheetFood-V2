import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { tpcConfig } from "./config";

export const tpcPreparation = createPlateCountPreparation(tpcConfig);
export const tpcPreparationDefinition = tpcPreparation.definition;
export const tpcPreparationHandler = tpcPreparation.handler;