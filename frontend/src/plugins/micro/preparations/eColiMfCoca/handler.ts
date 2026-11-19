import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { eColiMfCocaConfig } from "./config";

export const eColiMfCocaPreparation = createDetectionPreparation(eColiMfCocaConfig);
export const eColiMfCocaPreparationDefinition = eColiMfCocaPreparation.definition;
export const eColiMfCocaPreparationHandler = eColiMfCocaPreparation.handler;
