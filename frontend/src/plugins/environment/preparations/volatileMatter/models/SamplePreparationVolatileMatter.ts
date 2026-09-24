import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationVolatileMatterStep extends SimpleEnvironmentStep {}
export interface SamplePreparationVolatileMatter extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationVolatileMatterStep[]; }
