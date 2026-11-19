import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { ipSalmonellaConfig } from "./config";

export const ipSalmonellaPreparation = createDetectionPreparation(ipSalmonellaConfig);
export const ipSalmonellaPreparationDefinition = ipSalmonellaPreparation.definition;
export const ipSalmonellaPreparationHandler = ipSalmonellaPreparation.handler;
