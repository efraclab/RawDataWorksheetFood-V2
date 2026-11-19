import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { eColiCcaCocaConfig } from "./config";

export const eColiCcaCocaPreparation = createDetectionPreparation(eColiCcaCocaConfig);
export const eColiCcaCocaPreparationDefinition = eColiCcaCocaPreparation.definition;
export const eColiCcaCocaPreparationHandler = eColiCcaCocaPreparation.handler;
