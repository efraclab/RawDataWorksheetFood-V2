import { createFormulaPreparation } from "../formula/createFormulaPreparation";
import { ropeSporeConfig } from "./config";

export const ropeSporePreparation = createFormulaPreparation(ropeSporeConfig);
export const ropeSporePreparationDefinition = ropeSporePreparation.definition;
export const ropeSporePreparationHandler = ropeSporePreparation.handler;
