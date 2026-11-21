import { createResiduePreparation } from "../residue/createResiduePreparation";
import { gcPesticidesConfig } from "./config";

export const gcPesticidesPreparation = createResiduePreparation(gcPesticidesConfig);
export const gcPesticidesPreparationDefinition = gcPesticidesPreparation.definition;
export const gcPesticidesPreparationHandler = gcPesticidesPreparation.handler;