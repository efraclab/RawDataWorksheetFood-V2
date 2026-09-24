import type { CalculationSoilTotalNitrogen } from "./models/CalculationSoilTotalNitrogen";
import type { SamplePreparationSoilTotalNitrogen } from "./models/SamplePreparationSoilTotalNitrogen";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { soilTotalNitrogenConfig } from "./config";

export const createSamplePreparationSoilTotalNitrogen = (index: number): SamplePreparationSoilTotalNitrogen =>
  createSimpleSamplePreparation(soilTotalNitrogenConfig, index) as SamplePreparationSoilTotalNitrogen;

export const createCalculationSoilTotalNitrogen = (index: number): CalculationSoilTotalNitrogen =>
  createSimpleCalculation(soilTotalNitrogenConfig, index) as CalculationSoilTotalNitrogen;

export const restoreSamplePreparationSoilTotalNitrogen = (value: unknown, index: number): SamplePreparationSoilTotalNitrogen =>
  restoreSimpleSamplePreparation(soilTotalNitrogenConfig, value, index) as SamplePreparationSoilTotalNitrogen;

export const restoreCalculationSoilTotalNitrogen = (value: unknown, index = 0): CalculationSoilTotalNitrogen =>
  restoreSimpleCalculation(soilTotalNitrogenConfig, value, index) as CalculationSoilTotalNitrogen;
