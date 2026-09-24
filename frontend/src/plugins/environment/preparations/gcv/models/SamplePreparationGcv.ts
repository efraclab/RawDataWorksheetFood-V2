import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationGcvStep extends SimpleEnvironmentStep {}
export interface SamplePreparationGcv extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationGcvStep[]; }
