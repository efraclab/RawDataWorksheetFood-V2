import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { mouldPresenceConfig } from "./config";

export const mouldPresencePreparation = createDetectionPreparation(mouldPresenceConfig);
export const mouldPresencePreparationDefinition = mouldPresencePreparation.definition;
export const mouldPresencePreparationHandler = mouldPresencePreparation.handler;
