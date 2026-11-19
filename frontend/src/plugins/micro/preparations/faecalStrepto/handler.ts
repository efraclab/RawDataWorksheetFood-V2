import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { faecalStreptoConfig } from "./config";

export const faecalStreptoPreparation = createPlateCountPreparation(faecalStreptoConfig);
export const faecalStreptoPreparationDefinition = faecalStreptoPreparation.definition;
export const faecalStreptoPreparationHandler = faecalStreptoPreparation.handler;