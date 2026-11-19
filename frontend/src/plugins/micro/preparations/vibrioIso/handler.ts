import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { vibrioIsoConfig } from "./config";

export const vibrioIsoPreparation = createDetectionPreparation(vibrioIsoConfig);
export const vibrioIsoPreparationDefinition = vibrioIsoPreparation.definition;
export const vibrioIsoPreparationHandler = vibrioIsoPreparation.handler;
