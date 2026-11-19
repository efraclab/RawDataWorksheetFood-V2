import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { ayushSAureusConfig } from "./config";

export const ayushSAureusPreparation = createDetectionPreparation(ayushSAureusConfig);
export const ayushSAureusPreparationDefinition = ayushSAureusPreparation.definition;
export const ayushSAureusPreparationHandler = ayushSAureusPreparation.handler;
