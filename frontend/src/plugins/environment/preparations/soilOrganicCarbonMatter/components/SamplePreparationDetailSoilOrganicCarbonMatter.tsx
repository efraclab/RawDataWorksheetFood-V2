import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { soilOrganicCarbonMatterConfig } from "../config";

export default function SamplePreparationDetailSoilOrganicCarbonMatter(props: any) {
  return (
    <SimpleEnvironmentSamplePreparationDetail
      config={soilOrganicCarbonMatterConfig}
      {...props}
    />
  );
}
