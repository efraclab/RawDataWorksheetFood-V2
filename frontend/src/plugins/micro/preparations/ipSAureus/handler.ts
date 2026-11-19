import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { ipSAureusConfig } from "./config";

export const ipSAureusPreparation = createDetectionPreparation(ipSAureusConfig);
export const ipSAureusPreparationDefinition = ipSAureusPreparation.definition;
export const ipSAureusPreparationHandler = ipSAureusPreparation.handler;
