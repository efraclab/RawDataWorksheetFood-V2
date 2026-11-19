import { createFormulaPreparation } from "../formula/createFormulaPreparation";
import { hrmAphaConfig } from "./config";

export const hrmAphaPreparation = createFormulaPreparation(hrmAphaConfig);
export const hrmAphaPreparationDefinition = hrmAphaPreparation.definition;
export const hrmAphaPreparationHandler = hrmAphaPreparation.handler;
