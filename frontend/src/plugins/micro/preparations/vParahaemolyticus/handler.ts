import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { vParahaemolyticusConfig } from "./config";

export const vParahaemolyticusPreparation = createDetectionPreparation(vParahaemolyticusConfig);
export const vParahaemolyticusPreparationDefinition = vParahaemolyticusPreparation.definition;
export const vParahaemolyticusPreparationHandler = vParahaemolyticusPreparation.handler;
