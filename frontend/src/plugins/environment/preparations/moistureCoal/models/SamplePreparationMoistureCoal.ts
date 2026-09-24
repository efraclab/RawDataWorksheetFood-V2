import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationMoistureCoalStep extends SimpleEnvironmentStep {}
export interface SamplePreparationMoistureCoal extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationMoistureCoalStep[]; }
