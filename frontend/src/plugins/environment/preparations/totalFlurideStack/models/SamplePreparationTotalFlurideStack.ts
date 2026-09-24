import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationTotalFlurideStackStep extends SimpleEnvironmentStep {}
export interface SamplePreparationTotalFlurideStack extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationTotalFlurideStackStep[]; }
