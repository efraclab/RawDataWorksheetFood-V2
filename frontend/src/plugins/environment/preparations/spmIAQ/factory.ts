import type { CalculationSpmIAQ } from "./models/CalculationSpmIAQ";
import type { SamplePreparationSpmIAQ } from "./models/SamplePreparationSpmIAQ";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { spmIAQConfig } from "./config";

export const createSamplePreparationSpmIAQ = (index: number): SamplePreparationSpmIAQ =>
  createSimpleSamplePreparation(spmIAQConfig, index) as SamplePreparationSpmIAQ;

export const createCalculationSpmIAQ = (index: number): CalculationSpmIAQ =>
  createSimpleCalculation(spmIAQConfig, index) as CalculationSpmIAQ;

export const restoreSamplePreparationSpmIAQ = (value: unknown, index: number): SamplePreparationSpmIAQ =>
  restoreSimpleSamplePreparation(spmIAQConfig, value, index) as SamplePreparationSpmIAQ;

export const restoreCalculationSpmIAQ = (value: unknown, index = 0): CalculationSpmIAQ =>
  restoreSimpleCalculation(spmIAQConfig, value, index) as CalculationSpmIAQ;
