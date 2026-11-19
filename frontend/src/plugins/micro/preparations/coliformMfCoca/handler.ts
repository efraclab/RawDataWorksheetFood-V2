import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { coliformMfCocaConfig } from "./config";

export const coliformMfCocaPreparation = createDetectionPreparation(coliformMfCocaConfig);
export const coliformMfCocaPreparationDefinition = coliformMfCocaPreparation.definition;
export const coliformMfCocaPreparationHandler = coliformMfCocaPreparation.handler;
