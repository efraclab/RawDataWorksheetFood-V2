import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationFixedCarbonStep extends SimpleEnvironmentStep {}
export interface SamplePreparationFixedCarbon extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationFixedCarbonStep[]; }
