import { createResiduePreparation } from "../residue/createResiduePreparation";
import { melamineConfig } from "./config";

export const melaminePreparation = createResiduePreparation(melamineConfig);
export const melaminePreparationDefinition = melaminePreparation.definition;
export const melaminePreparationHandler = melaminePreparation.handler;