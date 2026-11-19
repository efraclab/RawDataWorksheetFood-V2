import { createFormulaPreparation } from "../formula/createFormulaPreparation";
import { planktonConfig } from "./config";

export const planktonPreparation = createFormulaPreparation(planktonConfig);
export const planktonPreparationDefinition = planktonPreparation.definition;
export const planktonPreparationHandler = planktonPreparation.handler;
