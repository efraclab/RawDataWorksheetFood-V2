import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { soilOrganicCarbonMatterConfig } from "../config";

export default function SoilOrganicCarbonMatterCalculationSection(props: any) {
  return (
    <SimpleEnvironmentCalculationSection
      config={soilOrganicCarbonMatterConfig}
      {...props}
    />
  );
}
