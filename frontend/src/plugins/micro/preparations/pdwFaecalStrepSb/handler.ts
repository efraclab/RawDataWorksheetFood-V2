import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { pdwFaecalStrepSbConfig } from "./config";

export const pdwFaecalStrepSbPreparation = createDetectionPreparation(pdwFaecalStrepSbConfig);
export const pdwFaecalStrepSbPreparationDefinition = pdwFaecalStrepSbPreparation.definition;
export const pdwFaecalStrepSbPreparationHandler = pdwFaecalStrepSbPreparation.handler;
