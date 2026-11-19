import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { enterobacteriaceaeDetectionConfig } from "./config";

export const enterobacteriaceaeDetectionPreparation = createDetectionPreparation(enterobacteriaceaeDetectionConfig);
export const enterobacteriaceaeDetectionPreparationDefinition = enterobacteriaceaeDetectionPreparation.definition;
export const enterobacteriaceaeDetectionPreparationHandler = enterobacteriaceaeDetectionPreparation.handler;
