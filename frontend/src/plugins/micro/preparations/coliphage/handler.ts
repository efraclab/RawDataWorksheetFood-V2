import { createFormulaPreparation } from "../formula/createFormulaPreparation";
import { coliphageConfig } from "./config";

export const coliphagePreparation = createFormulaPreparation(coliphageConfig);
export const coliphagePreparationDefinition = coliphagePreparation.definition;
export const coliphagePreparationHandler = coliphagePreparation.handler;
