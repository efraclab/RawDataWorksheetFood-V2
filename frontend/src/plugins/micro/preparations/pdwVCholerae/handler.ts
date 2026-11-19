import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwVCholeraeConfig } from "./config";

export const pdwVCholeraePreparation = createDetectionPreparation(pdwVCholeraeConfig);
export const pdwVCholeraePreparationDefinition = pdwVCholeraePreparation.definition;
export const pdwVCholeraePreparationHandler = pdwVCholeraePreparation.handler;
