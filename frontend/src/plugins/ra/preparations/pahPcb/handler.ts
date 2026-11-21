import { createResiduePreparation } from "../residue/createResiduePreparation";
import { pahPcbConfig } from "./config";

export const pahPcbPreparation = createResiduePreparation(pahPcbConfig);
export const pahPcbPreparationDefinition = pahPcbPreparation.definition;
export const pahPcbPreparationHandler = pahPcbPreparation.handler;