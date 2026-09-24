import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationAshStep extends SimpleEnvironmentStep {}
export interface SamplePreparationAsh extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationAshStep[]; }
