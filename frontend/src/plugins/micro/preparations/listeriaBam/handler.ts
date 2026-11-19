import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { listeriaBamConfig } from "./config";

export const listeriaBamPreparation = createDetectionPreparation(listeriaBamConfig);
export const listeriaBamPreparationDefinition = listeriaBamPreparation.definition;
export const listeriaBamPreparationHandler = listeriaBamPreparation.handler;
