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
import { carbonDisulphideAmbientPreparationHandler } from "../preparations/carbonDisulphideAmbient/handler";
import { pmStackPreparationHandler } from "../preparations/pmStack/handler";
import { so2StackPreparationHandler } from "../preparations/so2Stack/handler";
import { no2StackPreparationHandler } from "../preparations/no2Stack/handler";
import { ammoniaStackPreparationHandler } from "../preparations/ammoniaStack/handler";
import { hclStackPreparationHandler } from "../preparations/hclStack/handler";
import { hfStackPreparationHandler } from "../preparations/hfStack/handler";
import { h2sStackPreparationHandler } from "../preparations/h2sStack/handler";
import { cs2StackPreparationHandler } from "../preparations/cs2Stack/handler";
import { totalFlurideStackPreparationHandler } from "../preparations/totalFlurideStack/handler";
import { soilTotalNitrogenPreparationHandler } from "../preparations/soilTotalNitrogen/handler";
import { soilAvailableSulphurPreparationHandler } from "../preparations/soilAvailableSulphur/handler";
import { soilGypsumRequirementPreparationHandler } from "../preparations/soilGypsumRequirement/handler";
import { soilMoisturePreparationHandler } from "../preparations/soilMoisture/handler";
import { soilAvailablePhosphorousPreparationHandler } from "../preparations/soilAvailablePhosphorous/handler";
import { soilOrganicCarbonMatterPreparationHandler } from "../preparations/soilOrganicCarbonMatter/handler";
import { soilCa2PlusPreparationHandler } from "../preparations/soilCa2Plus/handler";
import { moistureCoalPreparationHandler } from "../preparations/moistureCoal/handler";
import { volatileMatterPreparationHandler } from "../preparations/volatileMatter/handler";
import { gcvPreparationHandler } from "../preparations/gcv/handler";
import { ashPreparationHandler } from "../preparations/ash/handler";
import { fixedCarbonPreparationHandler } from "../preparations/fixedCarbon/handler";
import { decolourizingActivatedCarbonPreparationHandler } from "../preparations/decolourizingActivatedCarbon/handler";
import { matterSolubleInWaterPreparationHandler } from "../preparations/matterSolubleInWater/handler";
import { spmIAQPreparationHandler } from "../preparations/spmIAQ/handler";
import { moistureVolatileSolventPreparationHandler } from "../preparations/moistureVolatileSolvent/handler";
import { overallMigrationPackagingPreparationHandler } from "../preparations/overallMigrationPackaging/handler";

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
  carbonDisulphideAmbientPreparationHandler,
  pmStackPreparationHandler,
  so2StackPreparationHandler,
  no2StackPreparationHandler,
  ammoniaStackPreparationHandler,
  hclStackPreparationHandler,
  hfStackPreparationHandler,
  h2sStackPreparationHandler,
  cs2StackPreparationHandler,
  totalFlurideStackPreparationHandler,
  soilTotalNitrogenPreparationHandler,
  soilAvailableSulphurPreparationHandler,
  soilGypsumRequirementPreparationHandler,
  soilMoisturePreparationHandler,
  soilAvailablePhosphorousPreparationHandler,
  soilOrganicCarbonMatterPreparationHandler,
  soilCa2PlusPreparationHandler,
  moistureCoalPreparationHandler,
  volatileMatterPreparationHandler,
  gcvPreparationHandler,
  ashPreparationHandler,
  fixedCarbonPreparationHandler,
  decolourizingActivatedCarbonPreparationHandler,
  matterSolubleInWaterPreparationHandler,
  spmIAQPreparationHandler,
  moistureVolatileSolventPreparationHandler,
  overallMigrationPackagingPreparationHandler,
];
