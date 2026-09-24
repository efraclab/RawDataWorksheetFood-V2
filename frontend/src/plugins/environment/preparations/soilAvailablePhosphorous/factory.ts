import type { CalculationSoilAvailablePhosphorous } from "./models/CalculationSoilAvailablePhosphorous";
import type { SamplePreparationSoilAvailablePhosphorous } from "./models/SamplePreparationSoilAvailablePhosphorous";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { soilAvailablePhosphorousConfig } from "./config";

export const createSamplePreparationSoilAvailablePhosphorous = (index: number): SamplePreparationSoilAvailablePhosphorous =>
  createSimpleSamplePreparation(soilAvailablePhosphorousConfig, index) as SamplePreparationSoilAvailablePhosphorous;

export const createCalculationSoilAvailablePhosphorous = (index: number): CalculationSoilAvailablePhosphorous =>
  createSimpleCalculation(soilAvailablePhosphorousConfig, index) as CalculationSoilAvailablePhosphorous;

export const restoreSamplePreparationSoilAvailablePhosphorous = (value: unknown, index: number): SamplePreparationSoilAvailablePhosphorous =>
  restoreSimpleSamplePreparation(soilAvailablePhosphorousConfig, value, index) as SamplePreparationSoilAvailablePhosphorous;

export const restoreCalculationSoilAvailablePhosphorous = (value: unknown, index = 0): CalculationSoilAvailablePhosphorous =>
  restoreSimpleCalculation(soilAvailablePhosphorousConfig, value, index) as CalculationSoilAvailablePhosphorous;
