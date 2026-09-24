import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";
import { pm10PreparationHandler } from "../preparations/pm10/handler";
import { pm25PreparationHandler } from "../preparations/pm25/handler";
import { so2AmbientPreparationHandler } from "../preparations/so2Ambient/handler";
import { no2AmbientPreparationHandler } from "../preparations/no2Ambient/handler";
import { o3AmbientPreparationHandler } from "../preparations/o3Ambient/handler";
import { nh3AmbientPreparationHandler } from "../preparations/nh3Ambient/handler";
import { h2sAmbientPreparationHandler } from "../preparations/h2sAmbient/handler";
import { chlorineAmbientPreparationHandler } from "../preparations/chlorineAmbient/handler";
import { totalFlurideAmbientPreparationHandler } from "../preparations/totalFlurideAmbient/handler";

export const environmentPreparationRegistry: readonly PreparationHandler[] = [
  pm10PreparationHandler,
  pm25PreparationHandler,
  so2AmbientPreparationHandler,
  no2AmbientPreparationHandler,
  o3AmbientPreparationHandler,
  nh3AmbientPreparationHandler,
  h2sAmbientPreparationHandler,
  chlorineAmbientPreparationHandler,
  totalFlurideAmbientPreparationHandler,
];
