import { createPlateCountPreparation } from "../plateCount/createPlateCountPreparation";
import { totalBacterialSporeConfig } from "./config";

export const totalBacterialSporePreparation = createPlateCountPreparation(totalBacterialSporeConfig);
export const totalBacterialSporePreparationDefinition = totalBacterialSporePreparation.definition;
export const totalBacterialSporePreparationHandler = totalBacterialSporePreparation.handler;
