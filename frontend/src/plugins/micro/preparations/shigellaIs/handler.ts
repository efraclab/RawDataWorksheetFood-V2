import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { shigellaIsConfig } from "./config";

export const shigellaIsPreparation = createDetectionPreparation(shigellaIsConfig);
export const shigellaIsPreparationDefinition = shigellaIsPreparation.definition;
export const shigellaIsPreparationHandler = shigellaIsPreparation.handler;
