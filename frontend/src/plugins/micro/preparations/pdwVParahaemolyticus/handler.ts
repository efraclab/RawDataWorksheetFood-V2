import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwVParahaemolyticusConfig } from "./config";

export const pdwVParahaemolyticusPreparation = createDetectionPreparation(pdwVParahaemolyticusConfig);
export const pdwVParahaemolyticusPreparationDefinition = pdwVParahaemolyticusPreparation.definition;
export const pdwVParahaemolyticusPreparationHandler = pdwVParahaemolyticusPreparation.handler;
