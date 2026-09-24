import type { CalculationOverallMigrationPackaging } from "./models/CalculationOverallMigrationPackaging";
import type { SamplePreparationOverallMigrationPackaging } from "./models/SamplePreparationOverallMigrationPackaging";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { overallMigrationPackagingConfig } from "./config";

export const createSamplePreparationOverallMigrationPackaging = (index: number): SamplePreparationOverallMigrationPackaging =>
  createSimpleSamplePreparation(overallMigrationPackagingConfig, index) as SamplePreparationOverallMigrationPackaging;

export const createCalculationOverallMigrationPackaging = (index: number): CalculationOverallMigrationPackaging =>
  createSimpleCalculation(overallMigrationPackagingConfig, index) as CalculationOverallMigrationPackaging;

export const restoreSamplePreparationOverallMigrationPackaging = (value: unknown, index: number): SamplePreparationOverallMigrationPackaging =>
  restoreSimpleSamplePreparation(overallMigrationPackagingConfig, value, index) as SamplePreparationOverallMigrationPackaging;

export const restoreCalculationOverallMigrationPackaging = (value: unknown, index = 0): CalculationOverallMigrationPackaging =>
  restoreSimpleCalculation(overallMigrationPackagingConfig, value, index) as CalculationOverallMigrationPackaging;
