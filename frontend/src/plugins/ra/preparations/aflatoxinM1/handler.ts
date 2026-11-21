import { createResiduePreparation } from "../residue/createResiduePreparation";
import { aflatoxinM1Config } from "./config";

export const aflatoxinM1Preparation = createResiduePreparation(aflatoxinM1Config);
export const aflatoxinM1PreparationDefinition = aflatoxinM1Preparation.definition;
export const aflatoxinM1PreparationHandler = aflatoxinM1Preparation.handler;