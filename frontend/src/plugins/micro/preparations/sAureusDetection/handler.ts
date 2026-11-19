import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { sAureusDetectionConfig } from "./config";

export const sAureusDetectionPreparation = createDetectionPreparation(sAureusDetectionConfig);
export const sAureusDetectionPreparationDefinition = sAureusDetectionPreparation.definition;
export const sAureusDetectionPreparationHandler = sAureusDetectionPreparation.handler;
