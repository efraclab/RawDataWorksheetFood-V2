import type { CalculationMatterSolubleInWater } from "./models/CalculationMatterSolubleInWater";
import type { SamplePreparationMatterSolubleInWater } from "./models/SamplePreparationMatterSolubleInWater";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { matterSolubleInWaterConfig } from "./config";

export const createSamplePreparationMatterSolubleInWater = (index: number): SamplePreparationMatterSolubleInWater =>
  createSimpleSamplePreparation(matterSolubleInWaterConfig, index) as SamplePreparationMatterSolubleInWater;

export const createCalculationMatterSolubleInWater = (index: number): CalculationMatterSolubleInWater =>
  createSimpleCalculation(matterSolubleInWaterConfig, index) as CalculationMatterSolubleInWater;

export const restoreSamplePreparationMatterSolubleInWater = (value: unknown, index: number): SamplePreparationMatterSolubleInWater =>
  restoreSimpleSamplePreparation(matterSolubleInWaterConfig, value, index) as SamplePreparationMatterSolubleInWater;

export const restoreCalculationMatterSolubleInWater = (value: unknown, index = 0): CalculationMatterSolubleInWater =>
  restoreSimpleCalculation(matterSolubleInWaterConfig, value, index) as CalculationMatterSolubleInWater;
