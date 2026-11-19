import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwColiformConfig } from "./config";

export const pdwColiformPreparation = createDetectionPreparation(pdwColiformConfig);
export const pdwColiformPreparationDefinition = pdwColiformPreparation.definition;
export const pdwColiformPreparationHandler = pdwColiformPreparation.handler;
