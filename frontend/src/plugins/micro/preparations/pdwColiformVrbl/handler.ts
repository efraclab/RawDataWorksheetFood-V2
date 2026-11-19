import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwColiformVrblConfig } from "./config";

export const pdwColiformVrblPreparation = createDetectionPreparation(pdwColiformVrblConfig);
export const pdwColiformVrblPreparationDefinition = pdwColiformVrblPreparation.definition;
export const pdwColiformVrblPreparationHandler = pdwColiformVrblPreparation.handler;
