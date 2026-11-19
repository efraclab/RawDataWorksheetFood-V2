import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { soilTotalNitrogenConfig } from "../config";

export default function SamplePreparationDetailSoilTotalNitrogen(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={soilTotalNitrogenConfig} {...props} />;
}
