import type { CalculationSoilCa2Plus } from "./models/CalculationSoilCa2Plus";
import type { SamplePreparationSoilCa2Plus } from "./models/SamplePreparationSoilCa2Plus";
import {
  createSimpleCalculation,
  createSimpleSamplePreparation,
  restoreSimpleCalculation,
  restoreSimpleSamplePreparation,
} from "../_shared/utils";
import { soilCa2PlusConfig } from "./config";

export const createSamplePreparationSoilCa2Plus = (
  index: number,
): SamplePreparationSoilCa2Plus =>
  createSimpleSamplePreparation(soilCa2PlusConfig, index) as SamplePreparationSoilCa2Plus;

export const createCalculationSoilCa2Plus = (
  index: number,
): CalculationSoilCa2Plus =>
  createSimpleCalculation(soilCa2PlusConfig, index) as CalculationSoilCa2Plus;

export const restoreSamplePreparationSoilCa2Plus = (
  value: unknown,
  index: number,
): SamplePreparationSoilCa2Plus =>
  restoreSimpleSamplePreparation(
    soilCa2PlusConfig,
    value,
    index,
  ) as SamplePreparationSoilCa2Plus;

export const restoreCalculationSoilCa2Plus = (
  value: unknown,
  index = 0,
): CalculationSoilCa2Plus =>
  restoreSimpleCalculation(
    soilCa2PlusConfig,
    value,
    index,
  ) as CalculationSoilCa2Plus;
