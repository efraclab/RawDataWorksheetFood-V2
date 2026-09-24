import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { soilGypsumRequirementConfig } from "../config";

export default function CalculationDetailSoilGypsumRequirement(props: any) {
  return <SimpleEnvironmentCalculationDetail config={soilGypsumRequirementConfig} {...props} />;
}
