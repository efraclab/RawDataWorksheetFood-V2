import { createResiduePreparation } from "../residue/createResiduePreparation";
import { aflatoxinsConfig } from "./config";

export const aflatoxinsPreparation = createResiduePreparation(aflatoxinsConfig);
export const aflatoxinsPreparationDefinition = aflatoxinsPreparation.definition;
export const aflatoxinsPreparationHandler = aflatoxinsPreparation.handler;