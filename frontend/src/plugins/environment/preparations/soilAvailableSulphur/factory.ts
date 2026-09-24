import type { CalculationSoilAvailableSulphur } from "./models/CalculationSoilAvailableSulphur";
import type { SamplePreparationSoilAvailableSulphur } from "./models/SamplePreparationSoilAvailableSulphur";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { soilAvailableSulphurConfig } from "./config";

export const createSamplePreparationSoilAvailableSulphur = (index: number): SamplePreparationSoilAvailableSulphur =>
  createSimpleSamplePreparation(soilAvailableSulphurConfig, index) as SamplePreparationSoilAvailableSulphur;

export const createCalculationSoilAvailableSulphur = (index: number): CalculationSoilAvailableSulphur =>
  createSimpleCalculation(soilAvailableSulphurConfig, index) as CalculationSoilAvailableSulphur;

export const restoreSamplePreparationSoilAvailableSulphur = (value: unknown, index: number): SamplePreparationSoilAvailableSulphur =>
  restoreSimpleSamplePreparation(soilAvailableSulphurConfig, value, index) as SamplePreparationSoilAvailableSulphur;

export const restoreCalculationSoilAvailableSulphur = (value: unknown, index = 0): CalculationSoilAvailableSulphur =>
  restoreSimpleCalculation(soilAvailableSulphurConfig, value, index) as CalculationSoilAvailableSulphur;
