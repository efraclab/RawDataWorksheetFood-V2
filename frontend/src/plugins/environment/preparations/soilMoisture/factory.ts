import type { CalculationSoilMoisture } from "./models/CalculationSoilMoisture";
import type { SamplePreparationSoilMoisture } from "./models/SamplePreparationSoilMoisture";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { soilMoistureConfig } from "./config";

export const createSamplePreparationSoilMoisture = (index: number): SamplePreparationSoilMoisture =>
  createSimpleSamplePreparation(soilMoistureConfig, index) as SamplePreparationSoilMoisture;

export const createCalculationSoilMoisture = (index: number): CalculationSoilMoisture =>
  createSimpleCalculation(soilMoistureConfig, index) as CalculationSoilMoisture;

export const restoreSamplePreparationSoilMoisture = (value: unknown, index: number): SamplePreparationSoilMoisture =>
  restoreSimpleSamplePreparation(soilMoistureConfig, value, index) as SamplePreparationSoilMoisture;

export const restoreCalculationSoilMoisture = (value: unknown, index = 0): CalculationSoilMoisture =>
  restoreSimpleCalculation(soilMoistureConfig, value, index) as CalculationSoilMoisture;
