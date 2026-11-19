import type { CalculationAsh } from "./models/CalculationAsh";
import type { SamplePreparationAsh } from "./models/SamplePreparationAsh";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { ashConfig } from "./config";

export const createSamplePreparationAsh = (index: number): SamplePreparationAsh =>
  createSimpleSamplePreparation(ashConfig, index) as SamplePreparationAsh;

export const createCalculationAsh = (index: number): CalculationAsh =>
  createSimpleCalculation(ashConfig, index) as CalculationAsh;

export const restoreSamplePreparationAsh = (value: unknown, index: number): SamplePreparationAsh =>
  restoreSimpleSamplePreparation(ashConfig, value, index) as SamplePreparationAsh;

export const restoreCalculationAsh = (value: unknown, index = 0): CalculationAsh =>
  restoreSimpleCalculation(ashConfig, value, index) as CalculationAsh;
