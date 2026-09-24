import type { CalculationVolatileMatter } from "./models/CalculationVolatileMatter";
import type { SamplePreparationVolatileMatter } from "./models/SamplePreparationVolatileMatter";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { volatileMatterConfig } from "./config";

export const createSamplePreparationVolatileMatter = (index: number): SamplePreparationVolatileMatter =>
  createSimpleSamplePreparation(volatileMatterConfig, index) as SamplePreparationVolatileMatter;

export const createCalculationVolatileMatter = (index: number): CalculationVolatileMatter =>
  createSimpleCalculation(volatileMatterConfig, index) as CalculationVolatileMatter;

export const restoreSamplePreparationVolatileMatter = (value: unknown, index: number): SamplePreparationVolatileMatter =>
  restoreSimpleSamplePreparation(volatileMatterConfig, value, index) as SamplePreparationVolatileMatter;

export const restoreCalculationVolatileMatter = (value: unknown, index = 0): CalculationVolatileMatter =>
  restoreSimpleCalculation(volatileMatterConfig, value, index) as CalculationVolatileMatter;
