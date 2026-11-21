import { createResiduePreparation } from "../residue/createResiduePreparation";
import { ochratoxinConfig } from "./config";

export const ochratoxinPreparation = createResiduePreparation(ochratoxinConfig);
export const ochratoxinPreparationDefinition = ochratoxinPreparation.definition;
export const ochratoxinPreparationHandler = ochratoxinPreparation.handler;