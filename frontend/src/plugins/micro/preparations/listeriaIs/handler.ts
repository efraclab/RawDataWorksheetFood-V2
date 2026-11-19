import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { listeriaIsConfig } from "./config";

export const listeriaIsPreparation = createDetectionPreparation(listeriaIsConfig);
export const listeriaIsPreparationDefinition = listeriaIsPreparation.definition;
export const listeriaIsPreparationHandler = listeriaIsPreparation.handler;
