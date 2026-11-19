import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwEColiConfig } from "./config";

export const pdwEColiPreparation = createDetectionPreparation(pdwEColiConfig);
export const pdwEColiPreparationDefinition = pdwEColiPreparation.definition;
export const pdwEColiPreparationHandler = pdwEColiPreparation.handler;
