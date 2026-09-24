import type { CalculationTotalFlurideStack } from "./models/CalculationTotalFlurideStack";
import type { SamplePreparationTotalFlurideStack } from "./models/SamplePreparationTotalFlurideStack";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { totalFlurideStackConfig } from "./config";

export const createSamplePreparationTotalFlurideStack = (index: number): SamplePreparationTotalFlurideStack =>
  createSimpleSamplePreparation(totalFlurideStackConfig, index) as SamplePreparationTotalFlurideStack;

export const createCalculationTotalFlurideStack = (index: number): CalculationTotalFlurideStack =>
  createSimpleCalculation(totalFlurideStackConfig, index) as CalculationTotalFlurideStack;

export const restoreSamplePreparationTotalFlurideStack = (value: unknown, index: number): SamplePreparationTotalFlurideStack =>
  restoreSimpleSamplePreparation(totalFlurideStackConfig, value, index) as SamplePreparationTotalFlurideStack;

export const restoreCalculationTotalFlurideStack = (value: unknown, index = 0): CalculationTotalFlurideStack =>
  restoreSimpleCalculation(totalFlurideStackConfig, value, index) as CalculationTotalFlurideStack;
