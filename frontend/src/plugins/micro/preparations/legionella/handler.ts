import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { legionellaConfig } from "./config";

export const legionellaPreparation = createDetectionPreparation(legionellaConfig);
export const legionellaPreparationDefinition = legionellaPreparation.definition;
export const legionellaPreparationHandler = legionellaPreparation.handler;
