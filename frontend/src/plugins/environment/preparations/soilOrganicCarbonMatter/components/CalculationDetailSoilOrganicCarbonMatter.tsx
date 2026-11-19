import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { soilOrganicCarbonMatterConfig } from "../config";

export default function CalculationDetailSoilOrganicCarbonMatter(props: any) {
  return (
    <SimpleEnvironmentCalculationDetail
      config={soilOrganicCarbonMatterConfig}
      {...props}
    />
  );
}
