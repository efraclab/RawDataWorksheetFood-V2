import type { CalculationDecolourizingActivatedCarbon } from "./models/CalculationDecolourizingActivatedCarbon";
import type { SamplePreparationDecolourizingActivatedCarbon } from "./models/SamplePreparationDecolourizingActivatedCarbon";
import { createSimpleCalculation, createSimpleSamplePreparation, restoreSimpleCalculation, restoreSimpleSamplePreparation } from "../_shared/utils";
import { decolourizingActivatedCarbonConfig } from "./config";

export const createSamplePreparationDecolourizingActivatedCarbon = (index: number): SamplePreparationDecolourizingActivatedCarbon =>
  createSimpleSamplePreparation(decolourizingActivatedCarbonConfig, index) as SamplePreparationDecolourizingActivatedCarbon;

export const createCalculationDecolourizingActivatedCarbon = (index: number): CalculationDecolourizingActivatedCarbon =>
  createSimpleCalculation(decolourizingActivatedCarbonConfig, index) as CalculationDecolourizingActivatedCarbon;

export const restoreSamplePreparationDecolourizingActivatedCarbon = (value: unknown, index: number): SamplePreparationDecolourizingActivatedCarbon =>
  restoreSimpleSamplePreparation(decolourizingActivatedCarbonConfig, value, index) as SamplePreparationDecolourizingActivatedCarbon;

export const restoreCalculationDecolourizingActivatedCarbon = (value: unknown, index = 0): CalculationDecolourizingActivatedCarbon =>
  restoreSimpleCalculation(decolourizingActivatedCarbonConfig, value, index) as CalculationDecolourizingActivatedCarbon;
