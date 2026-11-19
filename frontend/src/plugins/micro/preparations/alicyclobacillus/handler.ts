import { createDetectionPreparation } from "../detection/createDetectionPreparation";
import { alicyclobacillusConfig } from "./config";

export const alicyclobacillusPreparation = createDetectionPreparation(alicyclobacillusConfig);
export const alicyclobacillusPreparationDefinition = alicyclobacillusPreparation.definition;
export const alicyclobacillusPreparationHandler = alicyclobacillusPreparation.handler;
