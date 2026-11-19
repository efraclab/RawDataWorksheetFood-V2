import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { shigellaAphaConfig } from "./config";

export const shigellaAphaPreparation = createDetectionPreparation(shigellaAphaConfig);
export const shigellaAphaPreparationDefinition = shigellaAphaPreparation.definition;
export const shigellaAphaPreparationHandler = shigellaAphaPreparation.handler;
