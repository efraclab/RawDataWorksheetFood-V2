import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwShigellaConfig } from "./config";

export const pdwShigellaPreparation = createDetectionPreparation(pdwShigellaConfig);
export const pdwShigellaPreparationDefinition = pdwShigellaPreparation.definition;
export const pdwShigellaPreparationHandler = pdwShigellaPreparation.handler;
