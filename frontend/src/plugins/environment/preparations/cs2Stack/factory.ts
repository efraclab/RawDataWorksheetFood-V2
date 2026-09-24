import type { CalculationCs2Stack } from "./models/CalculationCs2Stack";
import type { SamplePreparationCs2Stack } from "./models/SamplePreparationCs2Stack";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { cs2StackConfig } from "./config";

export const createSamplePreparationCs2Stack = (index: number): SamplePreparationCs2Stack =>
  createSimpleSamplePreparation(cs2StackConfig, index) as SamplePreparationCs2Stack;

export const createCalculationCs2Stack = (index: number): CalculationCs2Stack =>
  createSimpleCalculation(cs2StackConfig, index) as CalculationCs2Stack;

export const restoreSamplePreparationCs2Stack = (value: unknown, index: number): SamplePreparationCs2Stack =>
  restoreSimpleSamplePreparation(cs2StackConfig, value, index) as SamplePreparationCs2Stack;

export const restoreCalculationCs2Stack = (value: unknown, index = 0): CalculationCs2Stack =>
  restoreSimpleCalculation(cs2StackConfig, value, index) as CalculationCs2Stack;
