import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { soilGypsumRequirementConfig } from "../config";

export default function SamplePreparationDetailSoilGypsumRequirement(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={soilGypsumRequirementConfig} {...props} />;
}
