import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationMoistureVolatileSolventStep extends SimpleEnvironmentStep {}
export interface SamplePreparationMoistureVolatileSolvent extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationMoistureVolatileSolventStep[]; }
