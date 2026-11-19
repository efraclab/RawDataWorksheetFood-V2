import type {
  SimpleEnvironmentSamplePreparation,
  SimpleEnvironmentStep,
} from "../../_shared/types";

export interface SamplePreparationSoilCa2PlusStep extends SimpleEnvironmentStep {}

export interface SamplePreparationSoilCa2Plus
  extends SimpleEnvironmentSamplePreparation {
  steps: SamplePreparationSoilCa2PlusStep[];
}
