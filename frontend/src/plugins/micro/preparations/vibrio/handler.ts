import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { vibrioConfig } from "./config";

export const vibrioPreparation = createDetectionPreparation(vibrioConfig);
export const vibrioPreparationDefinition = vibrioPreparation.definition;
export const vibrioPreparationHandler = vibrioPreparation.handler;
