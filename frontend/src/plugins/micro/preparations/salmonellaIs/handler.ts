import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { salmonellaIsConfig } from "./config";

export const salmonellaIsPreparation = createDetectionPreparation(salmonellaIsConfig);
export const salmonellaIsPreparationDefinition = salmonellaIsPreparation.definition;
export const salmonellaIsPreparationHandler = salmonellaIsPreparation.handler;
