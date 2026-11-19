import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { ipEColiConfig } from "./config";

export const ipEColiPreparation = createDetectionPreparation(ipEColiConfig);
export const ipEColiPreparationDefinition = ipEColiPreparation.definition;
export const ipEColiPreparationHandler = ipEColiPreparation.handler;
