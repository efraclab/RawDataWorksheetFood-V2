import { createResiduePreparation } from "../residue/createResiduePreparation";
import { dioxinFuranConfig } from "./config";

export const dioxinFuranPreparation = createResiduePreparation(dioxinFuranConfig);
export const dioxinFuranPreparationDefinition = dioxinFuranPreparation.definition;
export const dioxinFuranPreparationHandler = dioxinFuranPreparation.handler;