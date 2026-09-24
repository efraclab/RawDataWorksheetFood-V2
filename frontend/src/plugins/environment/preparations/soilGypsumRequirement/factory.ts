import type { CalculationSoilGypsumRequirement } from "./models/CalculationSoilGypsumRequirement";
import type { SamplePreparationSoilGypsumRequirement } from "./models/SamplePreparationSoilGypsumRequirement";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { soilGypsumRequirementConfig } from "./config";

export const createSamplePreparationSoilGypsumRequirement = (index: number): SamplePreparationSoilGypsumRequirement =>
  createSimpleSamplePreparation(soilGypsumRequirementConfig, index) as SamplePreparationSoilGypsumRequirement;

export const createCalculationSoilGypsumRequirement = (index: number): CalculationSoilGypsumRequirement =>
  createSimpleCalculation(soilGypsumRequirementConfig, index) as CalculationSoilGypsumRequirement;

export const restoreSamplePreparationSoilGypsumRequirement = (value: unknown, index: number): SamplePreparationSoilGypsumRequirement =>
  restoreSimpleSamplePreparation(soilGypsumRequirementConfig, value, index) as SamplePreparationSoilGypsumRequirement;

export const restoreCalculationSoilGypsumRequirement = (value: unknown, index = 0): CalculationSoilGypsumRequirement =>
  restoreSimpleCalculation(soilGypsumRequirementConfig, value, index) as CalculationSoilGypsumRequirement;
