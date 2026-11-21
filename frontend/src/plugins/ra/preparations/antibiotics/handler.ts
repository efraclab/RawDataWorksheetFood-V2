import { createResiduePreparation } from "../residue/createResiduePreparation";
import { antibioticsConfig } from "./config";

export const antibioticsPreparation = createResiduePreparation(antibioticsConfig);
export const antibioticsPreparationDefinition = antibioticsPreparation.definition;
export const antibioticsPreparationHandler = antibioticsPreparation.handler;