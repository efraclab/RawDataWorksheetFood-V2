import type { SimpleEnvironmentSamplePreparation, SimpleEnvironmentStep } from "../../_shared/types";
export interface SamplePreparationSoilMoistureStep extends SimpleEnvironmentStep {}
export interface SamplePreparationSoilMoisture extends SimpleEnvironmentSamplePreparation { steps: SamplePreparationSoilMoistureStep[]; }
