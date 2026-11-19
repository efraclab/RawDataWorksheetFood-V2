import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { listeriaAphaConfig } from "./config";

export const listeriaAphaPreparation = createDetectionPreparation(listeriaAphaConfig);
export const listeriaAphaPreparationDefinition = listeriaAphaPreparation.definition;
export const listeriaAphaPreparationHandler = listeriaAphaPreparation.handler;
