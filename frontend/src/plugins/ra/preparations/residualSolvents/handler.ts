import { createResiduePreparation } from "../residue/createResiduePreparation";
import { residualSolventsConfig } from "./config";

export const residualSolventsPreparation = createResiduePreparation(residualSolventsConfig);
export const residualSolventsPreparationDefinition = residualSolventsPreparation.definition;
export const residualSolventsPreparationHandler = residualSolventsPreparation.handler;