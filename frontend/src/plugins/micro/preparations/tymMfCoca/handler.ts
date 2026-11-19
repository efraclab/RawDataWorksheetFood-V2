import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { tymMfCocaConfig } from "./config";

export const tymMfCocaPreparation = createDetectionPreparation(tymMfCocaConfig);
export const tymMfCocaPreparationDefinition = tymMfCocaPreparation.definition;
export const tymMfCocaPreparationHandler = tymMfCocaPreparation.handler;
