import { createFormulaPreparation } from "../formula/createFormulaPreparation";
import { pdwAmcConfig } from "./config";

export const pdwAmcPreparation = createFormulaPreparation(pdwAmcConfig);
export const pdwAmcPreparationDefinition = pdwAmcPreparation.definition;
export const pdwAmcPreparationHandler = pdwAmcPreparation.handler;
