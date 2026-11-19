import { createFormulaPreparation } from "../formula/createFormulaPreparation";
import { hrmSmprConfig } from "./config";

export const hrmSmprPreparation = createFormulaPreparation(hrmSmprConfig);
export const hrmSmprPreparationDefinition = hrmSmprPreparation.definition;
export const hrmSmprPreparationHandler = hrmSmprPreparation.handler;
