import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { fixedCarbonConfig } from "../config";

export default function SamplePreparationDetailFixedCarbon(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={fixedCarbonConfig} {...props} />;
}
