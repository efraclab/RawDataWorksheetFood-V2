import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { coliformEcoliMfConfig } from "./config";

export const coliformEcoliMfPreparation = createDetectionPreparation(coliformEcoliMfConfig);
export const coliformEcoliMfPreparationDefinition = coliformEcoliMfPreparation.definition;
export const coliformEcoliMfPreparationHandler = coliformEcoliMfPreparation.handler;
