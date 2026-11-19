import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwSraConfig } from "./config";

export const pdwSraPreparation = createDetectionPreparation(pdwSraConfig);
export const pdwSraPreparationDefinition = pdwSraPreparation.definition;
export const pdwSraPreparationHandler = pdwSraPreparation.handler;
