import type { CalculationMoistureVolatileSolvent } from "./models/CalculationMoistureVolatileSolvent";
import type { SamplePreparationMoistureVolatileSolvent } from "./models/SamplePreparationMoistureVolatileSolvent";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { moistureVolatileSolventConfig } from "./config";

export const createSamplePreparationMoistureVolatileSolvent = (index: number): SamplePreparationMoistureVolatileSolvent =>
  createSimpleSamplePreparation(moistureVolatileSolventConfig, index) as SamplePreparationMoistureVolatileSolvent;

export const createCalculationMoistureVolatileSolvent = (index: number): CalculationMoistureVolatileSolvent =>
  createSimpleCalculation(moistureVolatileSolventConfig, index) as CalculationMoistureVolatileSolvent;

export const restoreSamplePreparationMoistureVolatileSolvent = (value: unknown, index: number): SamplePreparationMoistureVolatileSolvent =>
  restoreSimpleSamplePreparation(moistureVolatileSolventConfig, value, index) as SamplePreparationMoistureVolatileSolvent;

export const restoreCalculationMoistureVolatileSolvent = (value: unknown, index = 0): CalculationMoistureVolatileSolvent =>
  restoreSimpleCalculation(moistureVolatileSolventConfig, value, index) as CalculationMoistureVolatileSolvent;
