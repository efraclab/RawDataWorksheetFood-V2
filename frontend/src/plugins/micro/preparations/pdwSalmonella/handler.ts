import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwSalmonellaConfig } from "./config";

export const pdwSalmonellaPreparation = createDetectionPreparation(pdwSalmonellaConfig);
export const pdwSalmonellaPreparationDefinition = pdwSalmonellaPreparation.definition;
export const pdwSalmonellaPreparationHandler = pdwSalmonellaPreparation.handler;
