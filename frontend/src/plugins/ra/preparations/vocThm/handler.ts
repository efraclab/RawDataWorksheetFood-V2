import { createResiduePreparation } from "../residue/createResiduePreparation";
import { vocThmConfig } from "./config";

export const vocThmPreparation = createResiduePreparation(vocThmConfig);
export const vocThmPreparationDefinition = vocThmPreparation.definition;
export const vocThmPreparationHandler = vocThmPreparation.handler;