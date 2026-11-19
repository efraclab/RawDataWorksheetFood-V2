import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { totalMesophilicConfig } from "./config";

export const totalMesophilicPreparation = createPlateCountPreparation(totalMesophilicConfig);
export const totalMesophilicPreparationDefinition = totalMesophilicPreparation.definition;
export const totalMesophilicPreparationHandler = totalMesophilicPreparation.handler;