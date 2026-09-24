import type { CalculationFixedCarbon } from "./models/CalculationFixedCarbon";
import type { SamplePreparationFixedCarbon } from "./models/SamplePreparationFixedCarbon";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { fixedCarbonConfig } from "./config";

export const createSamplePreparationFixedCarbon = (index: number): SamplePreparationFixedCarbon =>
  createSimpleSamplePreparation(fixedCarbonConfig, index) as SamplePreparationFixedCarbon;

export const createCalculationFixedCarbon = (index: number): CalculationFixedCarbon =>
  createSimpleCalculation(fixedCarbonConfig, index) as CalculationFixedCarbon;

export const restoreSamplePreparationFixedCarbon = (value: unknown, index: number): SamplePreparationFixedCarbon =>
  restoreSimpleSamplePreparation(fixedCarbonConfig, value, index) as SamplePreparationFixedCarbon;

export const restoreCalculationFixedCarbon = (value: unknown, index = 0): CalculationFixedCarbon =>
  restoreSimpleCalculation(fixedCarbonConfig, value, index) as CalculationFixedCarbon;
