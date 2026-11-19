import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwYeastMouldConfig } from "./config";

export const pdwYeastMouldPreparation = createDetectionPreparation(pdwYeastMouldConfig);
export const pdwYeastMouldPreparationDefinition = pdwYeastMouldPreparation.definition;
export const pdwYeastMouldPreparationHandler = pdwYeastMouldPreparation.handler;
