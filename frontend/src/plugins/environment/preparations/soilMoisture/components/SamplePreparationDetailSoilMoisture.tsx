import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { soilMoistureConfig } from "../config";

export default function SamplePreparationDetailSoilMoisture(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={soilMoistureConfig} {...props} />;
}
