import type { CalculationMoistureCoal } from "./models/CalculationMoistureCoal";
import type { SamplePreparationMoistureCoal } from "./models/SamplePreparationMoistureCoal";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { moistureCoalConfig } from "./config";

export const createSamplePreparationMoistureCoal = (index: number): SamplePreparationMoistureCoal =>
  createSimpleSamplePreparation(moistureCoalConfig, index) as SamplePreparationMoistureCoal;

export const createCalculationMoistureCoal = (index: number): CalculationMoistureCoal =>
  createSimpleCalculation(moistureCoalConfig, index) as CalculationMoistureCoal;

export const restoreSamplePreparationMoistureCoal = (value: unknown, index: number): SamplePreparationMoistureCoal =>
  restoreSimpleSamplePreparation(moistureCoalConfig, value, index) as SamplePreparationMoistureCoal;

export const restoreCalculationMoistureCoal = (value: unknown, index = 0): CalculationMoistureCoal =>
  restoreSimpleCalculation(moistureCoalConfig, value, index) as CalculationMoistureCoal;
