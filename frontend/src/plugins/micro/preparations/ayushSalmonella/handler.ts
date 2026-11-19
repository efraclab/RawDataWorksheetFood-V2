import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { ayushSalmonellaConfig } from "./config";

export const ayushSalmonellaPreparation = createDetectionPreparation(ayushSalmonellaConfig);
export const ayushSalmonellaPreparationDefinition = ayushSalmonellaPreparation.definition;
export const ayushSalmonellaPreparationHandler = ayushSalmonellaPreparation.handler;
