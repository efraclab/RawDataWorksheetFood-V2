import type { CalculationGcv } from "./models/CalculationGcv";
import type { SamplePreparationGcv } from "./models/SamplePreparationGcv";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { gcvConfig } from "./config";

export const createSamplePreparationGcv = (index: number): SamplePreparationGcv =>
  createSimpleSamplePreparation(gcvConfig, index) as SamplePreparationGcv;

export const createCalculationGcv = (index: number): CalculationGcv =>
  createSimpleCalculation(gcvConfig, index) as CalculationGcv;

export const restoreSamplePreparationGcv = (value: unknown, index: number): SamplePreparationGcv =>
  restoreSimpleSamplePreparation(gcvConfig, value, index) as SamplePreparationGcv;

export const restoreCalculationGcv = (value: unknown, index = 0): CalculationGcv =>
  restoreSimpleCalculation(gcvConfig, value, index) as CalculationGcv;
