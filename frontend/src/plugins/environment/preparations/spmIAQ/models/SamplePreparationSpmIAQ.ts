import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationSpmIAQStep extends SimpleEnvironmentStep {}
export interface SamplePreparationSpmIAQ extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationSpmIAQStep[]; }
