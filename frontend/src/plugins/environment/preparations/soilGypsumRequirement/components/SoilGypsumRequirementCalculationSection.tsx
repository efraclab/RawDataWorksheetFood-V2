import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { soilGypsumRequirementConfig } from "../config";

export default function SoilGypsumRequirementCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={soilGypsumRequirementConfig} {...props} />;
}
