import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwFaecalStrepConfig } from "./config";

export const pdwFaecalStrepPreparation = createDetectionPreparation(pdwFaecalStrepConfig);
export const pdwFaecalStrepPreparationDefinition = pdwFaecalStrepPreparation.definition;
export const pdwFaecalStrepPreparationHandler = pdwFaecalStrepPreparation.handler;
