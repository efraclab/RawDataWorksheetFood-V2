import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { sAureusDetectionIsoConfig } from "./config";

export const sAureusDetectionIsoPreparation = createDetectionPreparation(sAureusDetectionIsoConfig);
export const sAureusDetectionIsoPreparationDefinition = sAureusDetectionIsoPreparation.definition;
export const sAureusDetectionIsoPreparationHandler = sAureusDetectionIsoPreparation.handler;
