import type { CalculationSoilOrganicCarbonMatter } from "./models/CalculationSoilOrganicCarbonMatter";
import type { SamplePreparationSoilOrganicCarbonMatter } from "./models/SamplePreparationSoilOrganicCarbonMatter";
import {
  createSimpleCalculation,
  createSimpleSamplePreparation,
  restoreSimpleCalculation,
  restoreSimpleSamplePreparation,
} from "../_shared/utils";
import { soilOrganicCarbonMatterConfig } from "./config";

export const createSamplePreparationSoilOrganicCarbonMatter = (
  index: number,
): SamplePreparationSoilOrganicCarbonMatter =>
  createSimpleSamplePreparation(
    soilOrganicCarbonMatterConfig,
    index,
  ) as SamplePreparationSoilOrganicCarbonMatter;

export const createCalculationSoilOrganicCarbonMatter = (
  index: number,
): CalculationSoilOrganicCarbonMatter =>
  createSimpleCalculation(
    soilOrganicCarbonMatterConfig,
    index,
  ) as CalculationSoilOrganicCarbonMatter;

export const restoreSamplePreparationSoilOrganicCarbonMatter = (
  value: unknown,
  index: number,
): SamplePreparationSoilOrganicCarbonMatter =>
  restoreSimpleSamplePreparation(
    soilOrganicCarbonMatterConfig,
    value,
    index,
  ) as SamplePreparationSoilOrganicCarbonMatter;

export const restoreCalculationSoilOrganicCarbonMatter = (
  value: unknown,
  index = 0,
): CalculationSoilOrganicCarbonMatter =>
  restoreSimpleCalculation(
    soilOrganicCarbonMatterConfig,
    value,
    index,
  ) as CalculationSoilOrganicCarbonMatter;
