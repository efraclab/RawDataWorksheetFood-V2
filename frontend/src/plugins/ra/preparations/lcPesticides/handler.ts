import { createResiduePreparation } from "../residue/createResiduePreparation";
import { lcPesticidesConfig } from "./config";

export const lcPesticidesPreparation = createResiduePreparation(lcPesticidesConfig);
export const lcPesticidesPreparationDefinition = lcPesticidesPreparation.definition;
export const lcPesticidesPreparationHandler = lcPesticidesPreparation.handler;