import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationCs2StackStep extends SimpleEnvironmentStep {}
export interface SamplePreparationCs2Stack extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationCs2StackStep[]; }
