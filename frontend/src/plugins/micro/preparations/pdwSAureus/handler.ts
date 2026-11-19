import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwSAureusConfig } from "./config";

export const pdwSAureusPreparation = createDetectionPreparation(pdwSAureusConfig);
export const pdwSAureusPreparationDefinition = pdwSAureusPreparation.definition;
export const pdwSAureusPreparationHandler = pdwSAureusPreparation.handler;
