import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { eColiDetectionConfig } from "./config";

export const eColiDetectionPreparation = createDetectionPreparation(eColiDetectionConfig);
export const eColiDetectionPreparationDefinition = eColiDetectionPreparation.definition;
export const eColiDetectionPreparationHandler = eColiDetectionPreparation.handler;
